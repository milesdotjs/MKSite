/**
 * Turning Stockfish into Miles.
 *
 * Three layers, in order:
 *
 *  1. The opening book (his actual repertoire). While the position is in the
 *     book the bot plays the book move — unless the opponent has just hung
 *     something. A real player finishing a Réti setup still takes a free
 *     piece, so before every book move the engine is asked whether its own
 *     choice is clearly better; if it is by a wide margin, the book is
 *     abandoned for the punishment.
 *  2. Stockfish with UCI_LimitStrength at MILES_ELO. Bot ratings run a little
 *     below human ones, so the engine sits somewhat above his real rating.
 *  3. A faint style nudge: among candidate moves the engine considers nearly
 *     equal, lean toward the active one. It never overrides a real
 *     evaluation difference, so strength is unchanged; it just makes the
 *     bot's near-coin-flips land the way his would.
 *
 * Think time is modelled too, so the clock means something: quick in the
 * book, longer in sharp positions, and fast when short of time.
 */
import { Chess, type Move } from 'chess.js';
import { type Book, openingName, pickBookMove } from '../book/book';
import { lineScore, search, type Engine, type SearchLine } from './uci';

/** Not displayed anywhere. Tuned to feel like a ~1600 human on chess.com. */
export const MILES_ELO = 1750;

/** How much better (centipawns) the engine's move must be to leave the book. */
const PUNISH_MARGIN_CP = 140;
/** Candidates within this of the best are "the same" for style purposes. */
const STYLE_WINDOW_CP = 20;

export async function configureMiles(engine: Engine): Promise<void> {
  engine.send('ucinewgame');
  engine.send('setoption name UCI_LimitStrength value true');
  engine.send(`setoption name UCI_Elo value ${MILES_ELO}`);
  engine.send('setoption name MultiPV value 3');
  await engine.ready();
}

export type MilesMove = {
  /** Long algebraic (e2e4, e7e8q) ready for chess.js. */
  uci: string;
  san: string;
  /** Centipawns from Miles's point of view, after his search. 0 while in book. */
  cp: number;
  mateIn: number | null;
  source: 'book' | 'punish' | 'engine';
  /** Opening name once the move is played, if the book still knows it. */
  opening: string | null;
  /** How long the whole turn should appear to take, in ms. */
  thinkMs: number;
};

type ClockInfo = {
  /** Miles's remaining time. */
  remainingMs: number;
  /** The game's starting time per side. */
  baseMs: number;
};

export async function chooseMilesMove(
  engine: Engine,
  chess: Chess,
  book: Book,
  clock: ClockInfo
): Promise<MilesMove> {
  const fen = chess.fen();
  const budget = thinkBudget(chess, clock);

  const bookPick = pickBookMove(book, fen);
  if (bookPick) {
    const bookMove = sanToMove(chess, bookPick.san);
    if (bookMove) {
      const punish = await checkForPunishment(engine, chess, bookMove);
      if (punish) {
        return finish(chess, punish.move, punish.cp, punish.mateIn, 'punish', book, budget.outOfBook);
      }
      return finish(chess, bookMove, 0, null, 'book', book, budget.inBook);
    }
  }

  const result = await search(engine, { fen, movetimeMs: budget.engineMs });
  const ranked = result.lines.slice().sort((a, b) => lineScore(b) - lineScore(a));
  const chosen = styleNudge(chess, ranked, result.best);
  const move = uciToMove(chess, chosen.move) ?? uciToMove(chess, result.best);
  if (!move) throw new Error('engine proposed an illegal move');
  return finish(chess, move, chosen.cp, chosen.mateIn, 'engine', book, budget.outOfBook);
}

function finish(
  chess: Chess,
  move: Move,
  cp: number,
  mateIn: number | null,
  source: MilesMove['source'],
  book: Book,
  thinkMs: number
): MilesMove {
  // Peek at the opening name after the move without disturbing the game.
  const probe = new Chess(chess.fen());
  probe.move(move.san);
  return {
    uci: move.from + move.to + (move.promotion ?? ''),
    san: move.san,
    cp,
    mateIn,
    source,
    opening: openingName(book, probe.fen()),
    thinkMs,
  };
}

/**
 * Ask the engine whether the book move is a mistake here. A short fixed-depth
 * search scores both the engine's favourite and the book move; a gap wider
 * than PUNISH_MARGIN_CP means the opponent has blundered and Miles takes it.
 */
async function checkForPunishment(
  engine: Engine,
  chess: Chess,
  bookMove: Move
): Promise<{ move: Move; cp: number; mateIn: number | null } | null> {
  const fen = chess.fen();
  const bookUci = bookMove.from + bookMove.to + (bookMove.promotion ?? '');

  const full = await search(engine, { fen, depth: 10 });
  const ranked = full.lines.slice().sort((a, b) => lineScore(b) - lineScore(a));
  const best = ranked[0];
  if (!best || best.move === bookUci) return null;

  let bookLine = ranked.find((l) => l.move === bookUci);
  if (!bookLine) {
    const only = await search(engine, { fen, depth: 10, searchMoves: [bookUci] });
    bookLine = only.lines.find((l) => l.move === bookUci) ?? only.lines[0];
  }
  if (!bookLine) return null;

  if (lineScore(best) - lineScore(bookLine) >= PUNISH_MARGIN_CP) {
    const move = uciToMove(chess, best.move);
    if (move) return { move, cp: best.cp, mateIn: best.mateIn };
  }
  return null;
}

/**
 * Among near-equal candidates prefer the active one. "Active" here means a
 * capture, a check, or a pawn push toward the opponent's king — the sort of
 * move an attacking Sicilian player reaches for when the engine says it does
 * not matter.
 */
function styleNudge(chess: Chess, ranked: SearchLine[], engineBest: string): SearchLine {
  const top = ranked.find((l) => l.move === engineBest) ?? ranked[0];
  if (!top || ranked.length < 2) return top ?? { move: engineBest, cp: 0, mateIn: null, depth: 0 };
  // Never second-guess a forced mate or a clearly winning line.
  if (top.mateIn !== null) return top;

  const near = ranked.filter((l) => l.mateIn === null && lineScore(top) - lineScore(l) <= STYLE_WINDOW_CP);
  if (near.length < 2) return top;

  const scored = near.map((l) => ({ line: l, style: activity(chess, l.move) }));
  scored.sort((a, b) => b.style - a.style || lineScore(b.line) - lineScore(a.line));
  // Half the time take the stylish one; the rest of the time the engine's own.
  return Math.random() < 0.5 ? scored[0].line : top;
}

function activity(chess: Chess, uci: string): number {
  const move = uciToMove(chess, uci);
  if (!move) return 0;
  let score = 0;
  if (move.captured) score += 2;
  if (move.san.includes('+')) score += 2;
  if (move.piece === 'p') {
    const enemyKing = findKing(chess, chess.turn() === 'w' ? 'b' : 'w');
    if (enemyKing) {
      const kingFile = enemyKing.charCodeAt(0) - 97;
      const pawnFile = move.to.charCodeAt(0) - 97;
      if (Math.abs(kingFile - pawnFile) <= 1) score += 1;
    }
  }
  return score;
}

function findKing(chess: Chess, color: 'w' | 'b'): string | null {
  for (const row of chess.board()) {
    for (const cell of row) {
      if (cell && cell.type === 'k' && cell.color === color) return cell.square;
    }
  }
  return null;
}

/**
 * How long Miles "thinks". Returns the engine's actual search time plus the
 * total wall time the UI should show for in-book and out-of-book moves.
 *
 * Human pacing for a 5|0 or 10|0 game: a touch over 1% of the starting time
 * per move in the opening, two to three times that in the middlegame, and a
 * scramble when under twenty seconds. A little jitter so it never feels like
 * a metronome.
 */
function thinkBudget(chess: Chess, clock: ClockInfo): { engineMs: number; inBook: number; outOfBook: number } {
  const moveNo = chess.moveNumber();
  const remaining = Math.max(0, clock.remainingMs);
  const jitter = () => 0.75 + Math.random() * 0.5;

  const scramble = remaining < 20_000;
  const lowish = remaining < 60_000;

  let outOfBook: number;
  if (scramble) outOfBook = 350 + Math.random() * 400;
  else if (lowish) outOfBook = 900 + Math.random() * 900;
  else {
    const phase = moveNo < 12 ? 1.2 : moveNo < 35 ? 2.6 : 1.8;
    outOfBook = clock.baseMs * 0.011 * phase * jitter();
  }
  // Never think away more than a fifth of what is left.
  outOfBook = Math.min(outOfBook, remaining * 0.2);

  const inBook = scramble ? 250 + Math.random() * 250 : Math.min(600 + Math.random() * 700, remaining * 0.1);

  // The engine itself needs little of that time to play at this level.
  const engineMs = Math.max(150, Math.min(900, Math.round(outOfBook * 0.45)));
  return { engineMs, inBook: Math.round(inBook), outOfBook: Math.round(outOfBook) };
}

function sanToMove(chess: Chess, san: string): Move | null {
  return chess.moves({ verbose: true }).find((m) => m.san === san) ?? null;
}

function uciToMove(chess: Chess, uci: string): Move | null {
  const from = uci.slice(0, 2);
  const to = uci.slice(2, 4);
  const promo = uci[4];
  return (
    chess
      .moves({ verbose: true })
      .find((m) => m.from === from && m.to === to && (promo ? m.promotion === promo : true)) ?? null
  );
}
