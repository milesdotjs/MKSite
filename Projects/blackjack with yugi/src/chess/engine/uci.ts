/**
 * Thin UCI transport over the vendored Stockfish WASM build.
 *
 * We ship the *lite single-threaded* engine deliberately: the multi-threaded
 * builds need SharedArrayBuffer, which needs COOP/COEP response headers, which
 * a static host (GitHub Pages) cannot set. Single-threaded costs us depth we
 * were never going to use — the strongest bot here is capped well below what
 * this engine reaches in a second on one core.
 *
 * The build doubles as its own Web Worker: it reads UCI commands from
 * postMessage and posts engine output back one line at a time.
 */

/** Vendored under public/ — see scripts note in the chess README section. */
const ENGINE_FILE = 'engine/stockfish-18-lite-single.js';

export type Engine = {
  send(cmd: string): void;
  /** Subscribe to engine output. Returns an unsubscribe function. */
  onLine(fn: (line: string) => void): () => void;
  /** Resolves once the engine has answered `isready`. */
  ready(): Promise<void>;
  dispose(): void;
};

function engineUrl(): string {
  // Resolve against the document, not this module: with Vite's `base: './'`
  // the bundle lives in /assets/ but the engine sits next to index.html, so a
  // module-relative URL (new URL(..., import.meta.url)) would look in the
  // wrong directory. document.baseURI tracks wherever the app was deployed.
  return new URL(import.meta.env.BASE_URL + ENGINE_FILE, document.baseURI).href;
}

export async function createEngine(): Promise<Engine> {
  const worker = new Worker(engineUrl());
  const listeners = new Set<(line: string) => void>();

  worker.onmessage = (e: MessageEvent) => {
    const line = typeof e.data === 'string' ? e.data : String(e.data ?? '');
    for (const fn of listeners) fn(line);
  };

  const engine: Engine = {
    send: (cmd) => worker.postMessage(cmd),
    onLine: (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    ready: () =>
      new Promise<void>((resolve) => {
        const off = engine.onLine((line) => {
          if (line.trim() === 'readyok') {
            off();
            resolve();
          }
        });
        engine.send('isready');
      }),
    dispose: () => {
      listeners.clear();
      // `quit` lets the engine close itself; terminate is the backstop for a
      // build that never got far enough to process commands.
      try {
        worker.postMessage('quit');
      } catch {
        /* already gone */
      }
      worker.terminate();
    },
  };

  // Handshake. `uciok` means the option list has been sent and the engine will
  // accept setoption/position/go.
  await new Promise<void>((resolve, reject) => {
    const timeout = window.setTimeout(
      () => reject(new Error('Stockfish did not answer `uci` in time')),
      45_000
    );
    const off = engine.onLine((line) => {
      if (line.trim() === 'uciok') {
        window.clearTimeout(timeout);
        off();
        resolve();
      }
    });
    engine.send('uci');
  });

  await engine.ready();
  return engine;
}

/** One candidate line from a MultiPV search, scored from the mover's view. */
export type SearchLine = {
  /** Long-algebraic move, e.g. "g1f3" or "e7e8q". */
  move: string;
  /** Centipawns, positive = good for the side to move. */
  cp: number;
  /** Set when the line is a forced mate; positive = mover delivers it. */
  mateIn: number | null;
  depth: number;
};

export type SearchResult = {
  /** The engine's own pick. */
  best: string;
  /** Ranked candidates, strongest first. May hold only `best` at multipv 1. */
  lines: SearchLine[];
};

/** Mate scores are folded into centipawns so callers can compare freely. */
const MATE_CP = 100_000;

export function lineScore(l: SearchLine): number {
  if (l.mateIn === null) return l.cp;
  return l.mateIn > 0 ? MATE_CP - l.mateIn * 100 : -MATE_CP - l.mateIn * 100;
}

/**
 * Run one search and collect the MultiPV table.
 *
 * Only the deepest iteration is kept: Stockfish emits `info` for every
 * iteration as it deepens, and the shallow ones would otherwise outnumber and
 * outrank the final answer.
 */
export function search(
  engine: Engine,
  opts: { fen: string; depth?: number; movetimeMs?: number }
): Promise<SearchResult> {
  return new Promise((resolve, reject) => {
    const byRank = new Map<number, SearchLine>();
    let deepest = -1;

    const off = engine.onLine((line) => {
      if (line.startsWith('info ')) {
        const parsed = parseInfo(line);
        if (!parsed) return;
        const { rank, entry } = parsed;
        // A deeper iteration invalidates everything collected so far.
        if (entry.depth > deepest) {
          deepest = entry.depth;
          byRank.clear();
        }
        if (entry.depth === deepest) byRank.set(rank, entry);
        return;
      }

      if (line.startsWith('bestmove')) {
        off();
        window.clearTimeout(guard);
        const best = line.split(/\s+/)[1] ?? '';
        if (!best || best === '(none)') {
          reject(new Error('engine returned no move'));
          return;
        }
        const lines = [...byRank.entries()]
          .sort((a, b) => a[0] - b[0])
          .map(([, v]) => v);
        // Guarantee the engine's own choice is present and first, even if the
        // info stream was too sparse to rank it (very shallow searches).
        if (!lines.some((l) => l.move === best)) {
          lines.unshift({ move: best, cp: 0, mateIn: null, depth: Math.max(deepest, 0) });
        }
        resolve({ best, lines });
      }
    });

    const guard = window.setTimeout(() => {
      off();
      reject(new Error('engine search timed out'));
    }, 30_000);

    engine.send(`position fen ${opts.fen}`);
    const limits: string[] = [];
    if (opts.depth !== undefined) limits.push(`depth ${opts.depth}`);
    if (opts.movetimeMs !== undefined) limits.push(`movetime ${opts.movetimeMs}`);
    engine.send(`go ${limits.length ? limits.join(' ') : 'depth 8'}`);
  });
}

function parseInfo(line: string): { rank: number; entry: SearchLine } | null {
  const depth = /\bdepth (\d+)/.exec(line);
  const pv = /\bpv (\S+)/.exec(line);
  if (!depth || !pv) return null;

  const cp = /\bscore cp (-?\d+)/.exec(line);
  const mate = /\bscore mate (-?\d+)/.exec(line);
  if (!cp && !mate) return null;

  const multipv = /\bmultipv (\d+)/.exec(line);
  return {
    rank: multipv ? Number(multipv[1]) : 1,
    entry: {
      move: pv[1],
      cp: cp ? Number(cp[1]) : 0,
      mateIn: mate ? Number(mate[1]) : null,
      depth: Number(depth[1]),
    },
  };
}
