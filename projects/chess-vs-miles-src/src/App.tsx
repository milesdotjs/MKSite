/**
 * Chess vs. Miles — the whole game in one screen.
 *
 * chess.js owns the rules and lives in a ref (it is a mutable object);
 * React re-renders off a FEN string. Stockfish lives in a ref too. The
 * clocks are real: a 100 ms ticker drains whichever side is to move, and a
 * side that hits zero loses (or draws, if the other side cannot mate).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Chess, type Color, type Move, type PieceSymbol, type Square } from 'chess.js';
import { Board, fadeCapturedPiece, type BoardPiece } from './components/Board';
import { Clock } from './components/Clock';
import { Miles, type Mood } from './components/Miles';
import { MoveList } from './components/MoveList';
import { ChessPiece } from './components/Pieces';
import { bookFor, bookKey, openingName, type Book } from './book/book';
import { createEngine, type Engine } from './engine/uci';
import { chooseMilesMove, configureMiles } from './engine/miles';
import { openingQuip, quip, resetQuips, type QuipKey } from './quips';
import { sound } from './sound';

type Setup = { player: Color; minutes: 5 | 10 };
type Phase = 'setup' | 'loading' | 'playerTurn' | 'botThinking' | 'over';
type Result = {
  winner: Color | null; // null = draw
  how: 'mate' | 'time' | 'resign' | 'stalemate' | 'repetition' | 'material' | 'fifty';
};

const TICK_MS = 100;
/** Eval swing across one move pair that counts as a real mistake. */
const SWING_CP = 160;
/** Miles resigns after this many consecutive engine moves at or below RESIGN_CP. */
const RESIGN_CP = -1500;
const RESIGN_STREAK = 3;

const pieceValue: Record<PieceSymbol, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

export function App() {
  const [setup, setSetup] = useState<Setup>({ player: 'w', minutes: 5 });
  const [phase, setPhase] = useState<Phase>('setup');
  const [fen, setFen] = useState(new Chess().fen());
  const [clocks, setClocks] = useState({ w: 0, b: 0 });
  const [selected, setSelected] = useState<Square | null>(null);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);
  const [promotion, setPromotion] = useState<{ from: Square; to: Square } | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [message, setMessage] = useState('');
  const [mood, setMoodState] = useState<Mood>('idle');
  const [opening, setOpening] = useState<string | null>(null);
  const [engineError, setEngineError] = useState<string | null>(null);
  const [muted, setMuted] = useState(sound.isMuted());

  const chessRef = useRef(new Chess());
  const engineRef = useRef<Engine | null>(null);
  const bookRef = useRef<Book | null>(null);
  const idsRef = useRef(new Map<Square, string>());
  const nextId = useRef(0);
  const prevCp = useRef<number | null>(null);
  const leftBook = useRef(false);
  const resignStreak = useRef(0);
  const warnedLow = useRef({ w: false, b: false });
  const moodTimer = useRef(0);
  const phaseRef = useRef<Phase>('setup');
  phaseRef.current = phase;
  // Clocks are read inside the async bot turn, so mirror them into a ref.
  const clocksRef = useRef(clocks);
  clocksRef.current = clocks;

  const player = setup.player;
  const bot: Color = player === 'w' ? 'b' : 'w';

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const say = useCallback((key: QuipKey) => {
    const line = quip(key);
    if (line) setMessage(line);
  }, []);

  /** Set a mood that relaxes back to idle; `hold` keeps it until changed. */
  const setMood = useCallback((m: Mood, hold = false) => {
    window.clearTimeout(moodTimer.current);
    setMoodState(m);
    if (!hold && m !== 'idle') {
      moodTimer.current = window.setTimeout(() => setMoodState('idle'), 2600);
    }
  }, []);

  const seedIds = useCallback(() => {
    idsRef.current = new Map();
    nextId.current = 0;
    for (const row of chessRef.current.board()) {
      for (const cell of row) if (cell) idsRef.current.set(cell.square, `p${nextId.current++}`);
    }
  }, []);

  const trackIds = useCallback((move: Move) => {
    const ids = idsRef.current;
    const moverId = ids.get(move.from) ?? `p${nextId.current++}`;
    ids.delete(move.from);
    ids.set(move.to, moverId);
    if (move.isEnPassant()) ids.delete(`${move.to[0]}${move.from[1]}` as Square);
    if (move.isKingsideCastle() || move.isQueensideCastle()) {
      const rank = move.to[1];
      const k = move.isKingsideCastle();
      const rookFrom = `${k ? 'h' : 'a'}${rank}` as Square;
      const rookTo = `${k ? 'f' : 'd'}${rank}` as Square;
      const rookId = ids.get(rookFrom);
      if (rookId) {
        ids.delete(rookFrom);
        ids.set(rookTo, rookId);
      }
    }
  }, []);

  const hasMatingMaterial = (chess: Chess, color: Color): boolean => {
    let minors = 0;
    for (const row of chess.board()) {
      for (const cell of row) {
        if (!cell || cell.color !== color || cell.type === 'k') continue;
        if (cell.type === 'p' || cell.type === 'r' || cell.type === 'q') return true;
        minors++;
      }
    }
    return minors >= 2;
  };

  const finish = useCallback(
    (r: Result) => {
      setResult(r);
      setPhase('over');
      setSelected(null);
      sound.end();
      if (r.winner === null) {
        say('draw');
        setMood('annoyed', true);
      } else if (r.winner === bot) {
        say(r.how === 'mate' ? 'winMate' : r.how === 'time' ? 'winTime' : 'winResign');
        setMood('grin', true);
      } else {
        say(r.how === 'mate' ? 'loseMate' : r.how === 'time' ? 'loseTime' : 'resign');
        setMood('sad', true);
      }
    },
    [bot, say, setMood]
  );

  /** End-of-game check after a move. Returns true when the game is over. */
  const settle = useCallback((): boolean => {
    const chess = chessRef.current;
    const side = chess.turn();
    if (chess.isCheckmate()) {
      finish({ winner: side === 'w' ? 'b' : 'w', how: 'mate' });
      return true;
    }
    if (chess.isStalemate()) return finish({ winner: null, how: 'stalemate' }), true;
    if (chess.isThreefoldRepetition()) return finish({ winner: null, how: 'repetition' }), true;
    if (chess.isInsufficientMaterial()) return finish({ winner: null, how: 'material' }), true;
    if (chess.isDrawByFiftyMoves()) return finish({ winner: null, how: 'fifty' }), true;
    return false;
  }, [finish]);

  /** Apply a legal move to the game and the board. */
  const applyMove = useCallback(
    (from: Square, to: Square, promo?: PieceSymbol): Move | null => {
      const chess = chessRef.current;
      let move: Move;
      try {
        move = chess.move({ from, to, promotion: promo ?? 'q' });
      } catch {
        return null;
      }
      if (move.captured) {
        const victim = move.isEnPassant() ? (`${move.to[0]}${move.from[1]}` as Square) : move.to;
        const id = idsRef.current.get(victim);
        if (id) fadeCapturedPiece(id);
      }
      trackIds(move);
      setFen(chess.fen());
      setLastMove({ from: move.from, to: move.to });
      setSelected(null);
      if (chess.inCheck()) sound.check();
      else if (move.captured) sound.capture();
      else sound.move();
      return move;
    },
    [trackIds]
  );

  // ─── Setup / lifecycle ────────────────────────────────────────────────────
  const startGame = useCallback(
    (s: Setup) => {
      setSetup(s);
      chessRef.current = new Chess();
      seedIds();
      setFen(chessRef.current.fen());
      setClocks({ w: s.minutes * 60_000, b: s.minutes * 60_000 });
      setSelected(null);
      setLastMove(null);
      setPromotion(null);
      setResult(null);
      setOpening(null);
      prevCp.current = null;
      leftBook.current = false;
      resignStreak.current = 0;
      warnedLow.current = { w: false, b: false };
      resetQuips();
      const botColor: Color = s.player === 'w' ? 'b' : 'w';
      bookRef.current = bookFor(botColor);
      setMood('idle');
      setMessage('');
      setPhase('loading');
    },
    [seedIds, setMood]
  );

  // Boot the engine once per game.
  useEffect(() => {
    if (phase !== 'loading') return;
    let cancelled = false;
    let engine: Engine | null = null;
    (async () => {
      try {
        engine = engineRef.current ?? (await createEngine());
        if (cancelled) return;
        await configureMiles(engine);
        if (cancelled) return;
        engineRef.current = engine;
        const first = player === 'w' ? 'playerTurn' : 'botThinking';
        setPhase(first);
        setMessage(`${quip('greeting')} ${quip(player === 'w' ? 'greetingBlack' : 'greetingWhite')}`);
      } catch (err) {
        if (cancelled) return;
        setEngineError(err instanceof Error ? err.message : String(err));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [phase, player]);

  // Dispose the worker when the app unmounts.
  useEffect(() => () => engineRef.current?.dispose(), []);

  // ─── Clocks ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'playerTurn' && phase !== 'botThinking') return;
    const id = window.setInterval(() => {
      const side = chessRef.current.turn();
      setClocks((c) => {
        const next = { ...c, [side]: Math.max(0, c[side] - TICK_MS) };
        if (next[side] === 0) {
          const other: Color = side === 'w' ? 'b' : 'w';
          // Chess rules: a flag only loses if the opponent could still mate.
          const winner = hasMatingMaterial(chessRef.current, other) ? other : null;
          window.setTimeout(() => {
            if (phaseRef.current === 'over') return;
            finish({ winner, how: 'time' });
          }, 0);
        } else if (next[side] < 30_000 && !warnedLow.current[side]) {
          warnedLow.current[side] = true;
          window.setTimeout(() => {
            say(side === bot ? 'lowTime' : 'opponentLowTime');
            sound.lowTime();
          }, 0);
        }
        return next;
      });
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [phase, bot, finish, say]);

  // ─── Player's move ────────────────────────────────────────────────────────
  const handlePlayerMove = useCallback(
    (from: Square, to: Square, promo?: PieceSymbol) => {
      if (phase !== 'playerTurn') return;
      const chess = chessRef.current;
      const piece = chess.get(from);
      const lastRank = player === 'w' ? '8' : '1';
      if (!promo && piece?.type === 'p' && piece.color === player && to[1] === lastRank) {
        const legal = chess.moves({ square: from, verbose: true }).some((m) => m.to === to && m.promotion);
        if (legal) {
          setPromotion({ from, to });
          return;
        }
      }
      const move = applyMove(from, to, promo);
      if (!move) return;

      const name = openingName(bookRef.current!, chess.fen());
      setOpening(name);

      if (settle()) return;

      if (move.captured) {
        const heavy = move.captured === 'q' || move.captured === 'r';
        say(heavy ? 'lostQueen' : 'lostPiece');
        setMood(heavy ? 'shock' : 'annoyed');
      } else if (chess.inCheck()) {
        say('inCheck');
        setMood('shock');
      }
      setPhase('botThinking');
    },
    [applyMove, phase, player, say, setMood, settle]
  );

  // ─── Miles's move ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'botThinking') return;
    const engine = engineRef.current;
    const book = bookRef.current;
    if (!engine || !book) return;
    let cancelled = false;
    const chess = chessRef.current;
    const started = performance.now();

    (async () => {
      // A beat before "thinking" so the player's own move is seen landing.
      const thinkTimer = window.setTimeout(() => {
        if (cancelled) return;
        setMood('think', true);
        if (leftBook.current && Math.random() < 0.45) say('thinking');
      }, 350);

      let picked;
      try {
        picked = await chooseMilesMove(engine, chess, book, {
          remainingMs: clocksRef.current[bot],
          baseMs: setup.minutes * 60_000,
        });
      } catch (err) {
        window.clearTimeout(thinkTimer);
        if (cancelled) return;
        setEngineError(err instanceof Error ? err.message : String(err));
        return;
      }
      if (cancelled) return;

      // Pad to the human-like think time, but never past the flag.
      const elapsed = performance.now() - started;
      const wait = Math.max(0, Math.min(picked.thinkMs - elapsed, clocksRef.current[bot] - 400));
      await new Promise((r) => setTimeout(r, wait));
      window.clearTimeout(thinkTimer);
      if (cancelled || phaseRef.current !== 'botThinking') return;

      const from = picked.uci.slice(0, 2) as Square;
      const to = picked.uci.slice(2, 4) as Square;
      const promo = picked.uci[4] as PieceSymbol | undefined;
      const move = applyMove(from, to, promo);
      if (!move) {
        setPhase('playerTurn');
        return;
      }
      setOpening(picked.opening);
      setMood('idle');

      if (settle()) return;

      // Resign a hopeless position like a person would, not grind to mate.
      if (picked.source === 'engine') {
        resignStreak.current = picked.cp <= RESIGN_CP ? resignStreak.current + 1 : 0;
        if (resignStreak.current >= RESIGN_STREAK && chess.moveNumber() >= 20) {
          finish({ winner: player, how: 'resign' });
          return;
        }
      }

      // Commentary, most specific first.
      const swing = prevCp.current === null || picked.source !== 'engine' ? 0 : picked.cp - prevCp.current;
      if (picked.source === 'engine') prevCp.current = picked.cp;

      const opener = openingQuip(picked.opening);
      if (picked.source === 'punish') {
        say('punish');
        setMood('grin');
      } else if (move.captured) {
        const heavy = move.captured === 'q' || move.captured === 'r';
        say(heavy ? 'captureBig' : 'capture');
        setMood(heavy ? 'grin' : 'happy');
      } else if (chess.inCheck()) {
        say('check');
        setMood('happy');
      } else if (move.promotion) {
        say('promote');
        setMood('grin');
      } else if (move.isQueensideCastle()) {
        say('castleLong');
      } else if (move.isKingsideCastle()) {
        say('castle');
      } else if (opener) {
        setMessage(opener);
      } else if (picked.source === 'engine' && !leftBook.current) {
        leftBook.current = true;
        say('leftBook');
        setMood('think');
      } else if (swing >= SWING_CP) {
        say('playerBlunder');
        setMood('grin');
      } else if (swing <= -SWING_CP) {
        say('playerGood');
        setMood('annoyed');
      } else if (picked.source === 'book' && Math.random() < 0.25) {
        say('bookMove');
      }
      if (picked.source === 'engine') leftBook.current = true;

      setPhase('playerTurn');
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // ─── Derived board state ──────────────────────────────────────────────────
  const pieces: BoardPiece[] = useMemo(() => {
    const out: BoardPiece[] = [];
    for (const row of chessRef.current.board()) {
      for (const cell of row) {
        if (!cell) continue;
        let id = idsRef.current.get(cell.square);
        if (!id) {
          id = `p${nextId.current++}`;
          idsRef.current.set(cell.square, id);
        }
        out.push({ id, square: cell.square, type: cell.type, color: cell.color });
      }
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fen]);

  const targets: Square[] = useMemo(() => {
    if (!selected || phase !== 'playerTurn') return [];
    return chessRef.current.moves({ square: selected, verbose: true }).map((m) => m.to as Square);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, phase, fen]);

  const checkSquare: Square | null = useMemo(() => {
    const chess = chessRef.current;
    if (!chess.inCheck()) return null;
    const side = chess.turn();
    for (const row of chess.board()) {
      for (const cell of row) if (cell && cell.type === 'k' && cell.color === side) return cell.square;
    }
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fen]);

  const history = useMemo(() => chessRef.current.history(), [fen]); // eslint-disable-line react-hooks/exhaustive-deps
  // Whether the book still knows this position (even when the names through it
  // disagree too much to label it).
  const inBook = useMemo(() => !!bookRef.current?.names.has(bookKey(fen)), [fen]);

  const material = useMemo(() => {
    let w = 0;
    let b = 0;
    for (const row of chessRef.current.board()) {
      for (const cell of row) {
        if (!cell) continue;
        if (cell.color === 'w') w += pieceValue[cell.type];
        else b += pieceValue[cell.type];
      }
    }
    return { w: w - b, b: b - w };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fen]);

  const handleSelect = useCallback(
    (sq: Square | null) => {
      if (phase !== 'playerTurn') return;
      if (sq === null) return setSelected(null);
      const piece = chessRef.current.get(sq);
      setSelected(piece && piece.color === player ? sq : null);
    },
    [phase, player]
  );

  const resign = () => {
    if (phase !== 'playerTurn' && phase !== 'botThinking') return;
    finish({ winner: bot, how: 'resign' });
  };

  const toggleMute = () => {
    const m = !muted;
    sound.setMuted(m);
    setMuted(m);
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  if (phase === 'setup') {
    return <SetupScreen initial={setup} onStart={startGame} />;
  }

  const turn = chessRef.current.turn();
  const inPlay = phase === 'playerTurn' || phase === 'botThinking';
  const topColor = bot;
  const bottomColor = player;

  return (
    <div className="game">
      <header className="top">
        <Miles mood={mood} text={message} caption={opening} />
      </header>

      <main className="arena">
        <div className="side-row">
          <Clock ms={clocks[topColor]} active={inPlay && turn === topColor} label="Miles" />
          <Material value={material[topColor]} />
        </div>

        {engineError ? (
          <EngineFailed detail={engineError} onBack={() => setPhase('setup')} />
        ) : phase === 'loading' ? (
          <div className="board-wrap">
            <div className="board loading">
              <div className="loading-text">
                Waking Miles up…
                <small>The engine loads once and is cached after that.</small>
              </div>
            </div>
          </div>
        ) : (
          <Board
            pieces={pieces}
            orientation={player}
            targets={targets}
            selected={selected}
            lastMove={lastMove}
            checkSquare={checkSquare}
            movableColor={player}
            interactive={phase === 'playerTurn'}
            onSelect={handleSelect}
            onMove={(f, t) => handlePlayerMove(f, t)}
          />
        )}

        <div className="side-row">
          <Clock ms={clocks[bottomColor]} active={inPlay && turn === bottomColor} label="You" />
          <Material value={material[bottomColor]} />
          <div className="actions">
            <button className="btn ghost" onClick={toggleMute} aria-pressed={muted} title={muted ? 'Unmute' : 'Mute'}>
              {muted ? 'Sound off' : 'Sound on'}
            </button>
            <button className="btn ghost" onClick={resign} disabled={!inPlay}>
              Resign
            </button>
            <button className="btn ghost" onClick={() => setPhase('setup')}>
              New game
            </button>
          </div>
        </div>
      </main>

      <aside className="panel">
        <MoveList history={history} opening={opening} inBook={inBook} />
      </aside>

      {promotion && (
        <div className="overlay">
          <div className="card">
            <div className="card-title">Promote to</div>
            <div className="promo-row">
              {(['q', 'r', 'b', 'n'] as PieceSymbol[]).map((p) => (
                <button
                  key={p}
                  className="promo"
                  onClick={() => {
                    const { from, to } = promotion;
                    setPromotion(null);
                    handlePlayerMove(from, to, p);
                  }}
                >
                  <ChessPiece piece={p} color={player} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {result && (
        <ResultCard result={result} player={player} onRematch={() => startGame(setup)} onNew={() => setPhase('setup')} />
      )}
    </div>
  );
}

function Material({ value }: { value: number }) {
  if (value <= 0) return <span className="material" aria-hidden />;
  return <span className="material">+{value}</span>;
}

function SetupScreen({ initial, onStart }: { initial: Setup; onStart: (s: Setup) => void }) {
  const [player, setPlayer] = useState<Color | 'random'>(initial.player);
  const [minutes, setMinutes] = useState<5 | 10>(initial.minutes);

  return (
    <div className="setup">
      <div className="setup-card">
        <Miles mood="idle" text="Pick a colour and a clock. Then it's on." />
        <h1>Chess vs. Miles</h1>
        <p className="lede">
          A bot that plays my openings, at about my level, and talks about as much as I do. e4 as White,
          Sicilian as Black, no takebacks.
        </p>

        <div className="field">
          <span className="field-label">You play</span>
          <div className="seg">
            <button className={player === 'w' ? 'on' : ''} onClick={() => setPlayer('w')}>
              White
            </button>
            <button className={player === 'b' ? 'on' : ''} onClick={() => setPlayer('b')}>
              Black
            </button>
            <button className={player === 'random' ? 'on' : ''} onClick={() => setPlayer('random')}>
              Random
            </button>
          </div>
        </div>

        <div className="field">
          <span className="field-label">Clock</span>
          <div className="seg">
            <button className={minutes === 5 ? 'on' : ''} onClick={() => setMinutes(5)}>
              5 min
            </button>
            <button className={minutes === 10 ? 'on' : ''} onClick={() => setMinutes(10)}>
              10 min
            </button>
          </div>
        </div>

        <button
          className="btn primary big"
          onClick={() => onStart({ player: player === 'random' ? (Math.random() < 0.5 ? 'w' : 'b') : player, minutes })}
        >
          Play
        </button>
        <p className="fine">
          Run out of time and you lose. That is the rule, and I will absolutely take the win.
        </p>
      </div>
    </div>
  );
}

const HOW: Record<Result['how'], string> = {
  mate: 'by checkmate',
  time: 'on time',
  resign: 'by resignation',
  stalemate: 'Stalemate',
  repetition: 'Draw by repetition',
  material: 'Draw, insufficient material',
  fifty: 'Draw by the fifty-move rule',
};

function ResultCard({
  result,
  player,
  onRematch,
  onNew,
}: {
  result: Result;
  player: Color;
  onRematch: () => void;
  onNew: () => void;
}) {
  const youWon = result.winner === player;
  const title = result.winner === null ? HOW[result.how] : youWon ? 'You won' : 'Miles won';
  const sub = result.winner === null ? '' : HOW[result.how];
  return (
    <div className="overlay">
      <div className={`card result ${youWon ? 'won' : ''}`}>
        <div className="card-title">{title}</div>
        {sub && <div className="card-sub">{sub}</div>}
        <div className="card-actions">
          <button className="btn primary" onClick={onRematch}>
            Rematch
          </button>
          <button className="btn ghost" onClick={onNew}>
            Change settings
          </button>
        </div>
      </div>
    </div>
  );
}

function EngineFailed({ detail, onBack }: { detail: string; onBack: () => void }) {
  return (
    <div className="board-wrap">
      <div className="board loading">
        <div className="loading-text">
          The engine would not start.
          <small>{detail}. It needs WebAssembly; a hard refresh usually fixes it.</small>
          <button className="btn ghost" onClick={onBack}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
