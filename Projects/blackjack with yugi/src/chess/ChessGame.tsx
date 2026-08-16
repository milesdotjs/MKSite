/**
 * The chess duel: board, opponent, and the loop that ties the engine to the
 * character's mouth.
 *
 * chess.js owns the rules and lives in a ref rather than in state — it is a
 * mutable object, and mirroring it into React state as a FEN plus a derived
 * piece list keeps rendering honest while still allowing cheap legality
 * queries. Stockfish lives in a ref too, since it is a worker with a lifetime
 * that has nothing to do with render cycles.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Chess, type Color, type PieceSymbol, type Square } from 'chess.js';
import { LifePoints } from '../components/LifePoints';
import { impact, lightning, registerFx, screenShake } from '../anim/fx';
import { sound } from '../anim/sound';
import { gsap, useGSAP, SplitText } from '../anim/gsapSetup';
import { CharacterPortrait } from './components/CharacterPortrait';
import { ChessBoard, burnCapturedPiece, type BoardPiece } from './components/ChessBoard';
import { ChessPiece } from './components/Pieces';
import { characterById, strengthOf, tierIndex, type Character } from './characters';
import { PIECE_DAMAGE, PIECE_NAMES, STARTING_LP, isHeavyLoss } from './damage';
import { pickQuip, type QuipKey } from './quips';
import { createEngine, type Engine } from './engine/uci';
import { chooseMove, configure } from './engine/opponent';

type Phase = 'loading' | 'error' | 'playerTurn' | 'botThinking' | 'gameOver';

type Outcome =
  | 'playerMate'
  | 'botMate'
  | 'playerCrushed'
  | 'botResigns'
  | 'stalemate'
  | 'draw';

type Props = {
  characterId: string;
  /** Index into the character's own difficulty ladder. */
  tier: number;
  onExit: () => void;
  /** Restart against the same opponent at the same strength. */
  onRematch: () => void;
};

/** The player is always White so the opening move is theirs. */
const PLAYER: Color = 'w';
const BOT: Color = 'b';

/**
 * Dev-only: start from a given position via ?fen=…
 *
 * Mate, stalemate and promotion are all several minutes of play away, which
 * makes them exactly the states that go unverified. This drops us straight
 * into one. Mirrors the ?debug= hook the blackjack game already has.
 */
function debugPosition(): string | undefined {
  if (!import.meta.env.DEV) return undefined;
  const fen = new URLSearchParams(window.location.search).get('fen');
  if (!fen) return undefined;
  try {
    new Chess(fen);
    return fen;
  } catch {
    console.warn('ignoring invalid ?fen=', fen);
    return undefined;
  }
}

/** Centipawn swing across one full move pair that counts as a real mistake. */
const BLUNDER_CP = 160;

export function ChessGame({ characterId, tier, onExit, onRematch }: Props) {
  const character = useMemo(() => characterById(characterId), [characterId]);
  const strength = useMemo(() => strengthOf(character, tier), [character, tier]);
  const tierLabel = character.tiers[tierIndex(character, tier)].label;

  const chessRef = useRef(new Chess(debugPosition()));
  const engineRef = useRef<Engine | null>(null);
  // Piece identity has to survive moves so the DOM node can glide rather than
  // pop. chess.js has no concept of a piece id, so we keep our own map keyed
  // by the square a piece currently stands on.
  const idsRef = useRef(new Map<Square, string>());
  const nextId = useRef(0);
  const prevBotCp = useRef<number | null>(null);

  const [phase, setPhase] = useState<Phase>('loading');
  const [fen, setFen] = useState(() => chessRef.current.fen());
  const [message, setMessage] = useState('');
  const [playerLP, setPlayerLP] = useState(STARTING_LP);
  const [botLP, setBotLP] = useState(STARTING_LP);
  const [selected, setSelected] = useState<Square | null>(null);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [taken, setTaken] = useState<{ byPlayer: PieceSymbol[]; byBot: PieceSymbol[] }>({
    byPlayer: [],
    byBot: [],
  });
  const [promotion, setPromotion] = useState<{ from: Square; to: Square } | null>(null);
  const [engineError, setEngineError] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // Without this the impact shake silently does nothing here — fx.ts holds a
  // single shake target and only the blackjack screen was claiming it.
  useEffect(() => {
    registerFx('shakeTarget', rootRef.current);
    return () => registerFx('shakeTarget', null);
  }, []);

  const say = useCallback(
    (key: QuipKey) => {
      setMessage((prev) => pickQuip(character.id, key, prev));
    },
    [character.id]
  );

  // Seed piece ids for the opening position.
  if (idsRef.current.size === 0) {
    for (const row of chessRef.current.board()) {
      for (const cell of row) {
        if (cell) idsRef.current.set(cell.square, `p${nextId.current++}`);
      }
    }
  }

  // Boot the engine once per opponent.
  useEffect(() => {
    let cancelled = false;
    let engine: Engine | null = null;

    (async () => {
      try {
        engine = await createEngine();
        if (cancelled) {
          engine.dispose();
          return;
        }
        await configure(engine, strength);
        if (cancelled) {
          engine.dispose();
          return;
        }
        engineRef.current = engine;
        setPhase('playerTurn');
        setMessage(pickQuip(character.id, 'greeting'));
      } catch (err) {
        if (cancelled) return;
        setEngineError(err instanceof Error ? err.message : String(err));
        setPhase('error');
      }
    })();

    return () => {
      cancelled = true;
      engine?.dispose();
      engineRef.current = null;
    };
  }, [character, strength]);

  /** Move the id map along with the piece, handling captures and castling. */
  const trackIds = useCallback(
    (move: { from: Square; to: Square; captured?: PieceSymbol; flags: string }) => {
      const ids = idsRef.current;
      const moverId = ids.get(move.from) ?? `p${nextId.current++}`;
      ids.delete(move.from);
      ids.set(move.to, moverId);

      // En passant removes a pawn that is not on the destination square.
      if (move.flags.includes('e')) {
        const dir = move.to[1] > move.from[1] ? -1 : 1;
        const victim = `${move.to[0]}${Number(move.to[1]) + dir}` as Square;
        ids.delete(victim);
      }

      // Castling drags the rook too; chess.js reports only the king's travel.
      if (move.flags.includes('k') || move.flags.includes('q')) {
        const rank = move.to[1];
        const kingSide = move.flags.includes('k');
        const rookFrom = `${kingSide ? 'h' : 'a'}${rank}` as Square;
        const rookTo = `${kingSide ? 'f' : 'd'}${rank}` as Square;
        const rookId = ids.get(rookFrom);
        if (rookId) {
          ids.delete(rookFrom);
          ids.set(rookTo, rookId);
        }
      }
    },
    []
  );

  /**
   * Apply a legal move and fold in everything that hangs off it: damage, the
   * captured tray, sound, and the end-of-game check.
   *
   * Returns the move so the caller can decide what to say about it.
   */
  const applyMove = useCallback(
    (from: Square, to: Square, promo?: PieceSymbol) => {
      const chess = chessRef.current;
      let move;
      try {
        move = chess.move({ from, to, promotion: promo ?? 'q' });
      } catch {
        return null;
      }

      // Burn the victim before the id map forgets it and before React drops
      // the element — both happen on the very next lines.
      if (move.captured) {
        const victimSquare = move.isEnPassant()
          ? (`${move.to[0]}${move.from[1]}` as Square)
          : move.to;
        const victimId = idsRef.current.get(victimSquare);
        if (victimId) burnCapturedPiece(victimId);
      }

      trackIds(move);
      setFen(chess.fen());
      setLastMove({ from: move.from, to: move.to });
      setSelected(null);

      const byPlayer = move.color === PLAYER;
      if (move.captured) {
        const dmg = PIECE_DAMAGE[move.captured];
        const heavy = isHeavyLoss(move.captured);
        if (byPlayer) {
          setBotLP((lp) => Math.max(0, lp - dmg));
          setTaken((t) => ({ ...t, byPlayer: [...t.byPlayer, move.captured!] }));
          impact('opponent', heavy ? 1.5 : 0.85);
          screenShake(heavy ? 1.1 : 0.55, 1);
        } else {
          setPlayerLP((lp) => Math.max(0, lp - dmg));
          setTaken((t) => ({ ...t, byBot: [...t.byBot, move.captured!] }));
          impact('player', heavy ? 1.8 : 1);
          screenShake(heavy ? 1.5 : 0.8, -1);
        }
        sound.thunder(isHeavyLoss(move.captured) ? 0.18 : 0.08);
      } else {
        sound.chime(0.05);
      }

      return move;
    },
    [trackIds]
  );

  /** Decide whether the duel is over, and on what terms. */
  const settle = useCallback(
    (nextPlayerLP: number, nextBotLP: number): Outcome | null => {
      const chess = chessRef.current;
      if (chess.isCheckmate()) {
        // Whoever is to move has been mated.
        return chess.turn() === PLAYER ? 'botMate' : 'playerMate';
      }
      if (chess.isStalemate()) return 'stalemate';
      if (chess.isDraw()) return 'draw';
      if (nextPlayerLP <= 0) return 'playerCrushed';
      if (nextBotLP <= 0) return 'botResigns';
      return null;
    },
    []
  );

  const finish = useCallback(
    (result: Outcome) => {
      setOutcome(result);
      setPhase('gameOver');
      const playerWon = result === 'playerMate' || result === 'botResigns';
      const drawn = result === 'stalemate' || result === 'draw';
      say(drawn ? 'draw' : playerWon ? 'lose' : 'win');
      lightning();
      if (playerWon) sound.chime(0.5);
      else if (!drawn) sound.thunder(0.4);
      if (result === 'playerCrushed') setPlayerLP(0);
      if (result === 'botResigns') setBotLP(0);
    },
    [say]
  );

  const handlePlayerMove = useCallback(
    (from: Square, to: Square, promo?: PieceSymbol) => {
      if (phase !== 'playerTurn') return;
      const chess = chessRef.current;

      // Promotion needs a choice before the move can be made, so intercept it
      // here rather than silently queening.
      const piece = chess.get(from);
      const lastRank = to[1] === '8';
      if (!promo && piece?.type === 'p' && piece.color === PLAYER && lastRank) {
        const legal = chess
          .moves({ square: from, verbose: true })
          .some((m) => m.to === to && m.promotion);
        if (legal) {
          setPromotion({ from, to });
          return;
        }
      }

      const move = applyMove(from, to, promo);
      if (!move) return;

      const dmg = move.captured ? PIECE_DAMAGE[move.captured] : 0;
      const nextBotLP = Math.max(0, botLP - dmg);
      const done = settle(playerLP, nextBotLP);
      if (done) {
        finish(done);
        return;
      }

      if (move.captured) {
        say(isHeavyLoss(move.captured) ? 'lostQueen' : 'lostPiece');
      } else if (chess.inCheck()) {
        say('inCheck');
      }
      setPhase('botThinking');
    },
    [applyMove, botLP, finish, phase, playerLP, say, settle]
  );

  // The opponent's turn.
  useEffect(() => {
    if (phase !== 'botThinking') return;
    const engine = engineRef.current;
    if (!engine) return;

    let cancelled = false;
    const chess = chessRef.current;

    (async () => {
      say('thinking');
      let picked;
      try {
        picked = await chooseMove(engine, strength, chess.fen());
      } catch (err) {
        if (cancelled) return;
        setEngineError(err instanceof Error ? err.message : String(err));
        setPhase('error');
        return;
      }
      if (cancelled) return;

      // Long-algebraic from the engine: e7e8q carries the promotion suffix.
      const from = picked.move.slice(0, 2) as Square;
      const to = picked.move.slice(2, 4) as Square;
      const promo = (picked.move[4] as PieceSymbol | undefined) ?? undefined;

      // Give the shortest searches a beat so the reply does not land before
      // the player has seen their own move settle.
      await new Promise((r) => setTimeout(r, 380));
      if (cancelled) return;

      const move = applyMove(from, to, promo);
      if (!move) {
        setPhase('playerTurn');
        return;
      }

      const dmg = move.captured ? PIECE_DAMAGE[move.captured] : 0;
      const nextPlayerLP = Math.max(0, playerLP - dmg);
      const done = settle(nextPlayerLP, botLP);
      if (done) {
        finish(done);
        return;
      }

      // Eval is read from the search the bot just ran, so nothing extra is
      // spent on commentary. Both readings are from the bot's point of view at
      // the same point in the cycle, one full move pair apart — so a jump in
      // its favour means the exchange went the player's way, and vice versa.
      // It is an honest signal about the pair, not about the player's move in
      // isolation, which is close enough for banter.
      const prev = prevBotCp.current;
      const swing = prev === null ? 0 : picked.cp - prev;
      prevBotCp.current = picked.cp;

      if (move.captured) {
        say(isHeavyLoss(move.captured) ? 'captureBig' : 'capture');
      } else if (chess.inCheck()) {
        say('check');
      } else if (move.promotion) {
        say('promote');
      } else if (move.isKingsideCastle?.() || move.isQueensideCastle?.()) {
        say('castle');
      } else if (prev !== null && swing >= BLUNDER_CP) {
        say('playerBlunder');
      } else if (prev !== null && swing <= -BLUNDER_CP) {
        say('playerGood');
      }

      setPhase('playerTurn');
    })();

    return () => {
      cancelled = true;
    };
  }, [applyMove, botLP, strength, finish, phase, playerLP, say, settle]);

  // Derived board data.
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
    // fen is the render trigger: the Chess object mutates in place.
  }, [fen]);

  const targets: Square[] = useMemo(() => {
    if (!selected || phase !== 'playerTurn') return [];
    return chessRef.current
      .moves({ square: selected, verbose: true })
      .map((m) => m.to as Square);
  }, [selected, phase, fen]);

  const checkSquare: Square | null = useMemo(() => {
    const chess = chessRef.current;
    if (!chess.inCheck()) return null;
    const side = chess.turn();
    for (const row of chess.board()) {
      for (const cell of row) {
        if (cell && cell.type === 'k' && cell.color === side) return cell.square;
      }
    }
    return null;
  }, [fen]);

  const handleSelect = useCallback(
    (sq: Square | null) => {
      if (phase !== 'playerTurn') return;
      if (sq === null) {
        setSelected(null);
        return;
      }
      const piece = chessRef.current.get(sq);
      setSelected(piece && piece.color === PLAYER ? sq : null);
    },
    [phase]
  );

  const thinking = phase === 'botThinking';

  return (
    <div className="chess-root" ref={rootRef}>
      <div className="hud-top">
        <LifePoints label={character.name.split(' ')[0].toUpperCase()} value={botLP} align="left" />
        <div className="hud-center">
          <button className="btn-ghost" onClick={onExit}>
            ← Leave
          </button>
          <div className="tier-pill" title={`about ${strength.rating} Elo`}>
            {tierLabel}
          </div>
        </div>
        <LifePoints label="YOU" value={playerLP} align="right" />
      </div>

      <div className="chess-layout">
        <aside className="chess-opponent" style={{ ['--accent' as string]: character.accent }}>
          <div className={`chess-portrait-frame ${thinking ? 'thinking' : ''}`}>
            <div className="chess-portrait-name">{character.name}</div>
            <CharacterPortrait
              portrait={character.portrait}
              message={message}
              agitated={thinking}
            />
          </div>
          <Speech text={message} />
          <CapturedTray taken={taken} />
        </aside>

        <main className="chess-main">
          {phase === 'loading' && <EngineLoading character={character} />}
          {phase === 'error' && <EngineFailed detail={engineError} onExit={onExit} />}
          {phase !== 'loading' && phase !== 'error' && (
            <ChessBoard
              pieces={pieces}
              orientation={PLAYER}
              targets={targets}
              selected={selected}
              lastMove={lastMove}
              checkSquare={checkSquare}
              movableColor={PLAYER}
              interactive={phase === 'playerTurn'}
              onSelect={handleSelect}
              onMove={(from, to) => handlePlayerMove(from, to)}
            />
          )}
          <div className="chess-status">
            {phase === 'botThinking' && <span className="thinking-dots">thinking</span>}
            {phase === 'playerTurn' && checkSquare && <span className="check-warn">Check!</span>}
          </div>
        </main>
      </div>

      {promotion && (
        <PromotionPicker
          onPick={(p) => {
            const { from, to } = promotion;
            setPromotion(null);
            handlePlayerMove(from, to, p);
          }}
        />
      )}

      {outcome && (
        <ResultBanner
          outcome={outcome}
          character={character}
          onExit={onExit}
          onRematch={onRematch}
        />
      )}
    </div>
  );
}

/** Quip line, revealed character by character like the blackjack dealer's. */
function Speech({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const el = ref.current?.querySelector('span');
      if (!el || !text) return;
      // Split words as well as chars: per-character wrappers alone let a line
      // break land inside a word.
      const split = new SplitText(el, { type: 'words,chars' });
      gsap.from(split.chars, {
        opacity: 0,
        filter: 'blur(4px)',
        y: 3,
        duration: 0.3,
        stagger: 0.013,
        ease: 'power1.out',
      });
      return () => split.revert();
    },
    { scope: ref, dependencies: [text] }
  );
  return (
    <div className="chess-speech" ref={ref}>
      <span key={text}>{text}</span>
    </div>
  );
}

function CapturedTray({
  taken,
}: {
  taken: { byPlayer: PieceSymbol[]; byBot: PieceSymbol[] };
}) {
  const row = (list: PieceSymbol[], color: Color, label: string) => (
    <div className="tray-row">
      <span className="tray-label">{label}</span>
      <div className="tray-pieces">
        {list.length === 0 && <span className="tray-empty">—</span>}
        {list.map((p, i) => (
          <ChessPiece key={`${p}${i}`} piece={p} color={color} className="tray-piece" />
        ))}
      </div>
    </div>
  );
  return (
    <div className="chess-tray">
      {row(taken.byPlayer, BOT, 'you took')}
      {row(taken.byBot, PLAYER, 'they took')}
    </div>
  );
}

function PromotionPicker({ onPick }: { onPick: (p: PieceSymbol) => void }) {
  const choices: PieceSymbol[] = ['q', 'r', 'b', 'n'];
  return (
    <div className="promo-overlay">
      <div className="promo-card">
        <div className="promo-title">Your pawn reaches the far rank</div>
        <div className="promo-choices">
          {choices.map((c) => (
            <button key={c} className="promo-choice" onClick={() => onPick(c)}>
              <ChessPiece piece={c} color={PLAYER} />
              <span>{PIECE_NAMES[c]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function EngineLoading({ character }: { character: Character }) {
  return (
    <div className="engine-loading">
      <div className="engine-loading-title">Summoning {character.name}…</div>
      <div className="engine-loading-sub">
        Waking the engine. This happens once — it is cached from here on.
      </div>
      <div className="engine-loading-bar">
        <span />
      </div>
    </div>
  );
}

function EngineFailed({ detail, onExit }: { detail: string | null; onExit: () => void }) {
  return (
    <div className="engine-loading">
      <div className="engine-loading-title">The shadows would not answer.</div>
      <div className="engine-loading-sub">
        The chess engine failed to start{detail ? `: ${detail}` : '.'} It needs WebAssembly,
        which every current browser supports — a hard refresh usually settles it.
      </div>
      <button className="btn btn-primary" onClick={onExit}>
        Back to the menu
      </button>
    </div>
  );
}

const RESULT_COPY: Record<Outcome, { title: string; sub: string }> = {
  playerMate: { title: 'Checkmate', sub: 'You took the king. The duel is yours.' },
  botMate: { title: 'Checkmate', sub: 'Your king has fallen.' },
  botResigns: { title: 'They Resign', sub: 'Their life points are spent — the position is hopeless.' },
  playerCrushed: { title: 'Mind Crush', sub: 'Your life points are gone. The shadows take the game.' },
  stalemate: { title: 'Stalemate', sub: 'No legal move remains. Nobody wins.' },
  draw: { title: 'A Draw', sub: 'Neither side can force the issue.' },
};

function ResultBanner({
  outcome,
  character,
  onExit,
  onRematch,
}: {
  outcome: Outcome;
  character: Character;
  onExit: () => void;
  onRematch: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const won = outcome === 'playerMate' || outcome === 'botResigns';
  const copy = RESULT_COPY[outcome];

  useGSAP(
    () => {
      gsap.from(ref.current, { opacity: 0, scale: 0.94, duration: 0.5, ease: 'power2.out' });
    },
    { scope: ref, dependencies: [] }
  );

  return (
    <div className="chess-result" ref={ref}>
      <div className={`chess-result-card ${won ? 'won' : ''}`}>
        <div className="chess-result-title">{copy.title}</div>
        <div className="chess-result-sub">{copy.sub}</div>
        <div className="chess-result-actions">
          <button className="btn btn-primary" onClick={onRematch}>
            Duel {character.name.split(' ')[0]} again
          </button>
          <button className="btn btn-secondary" onClick={onExit}>
            Change opponent or level
          </button>
        </div>
      </div>
    </div>
  );
}
