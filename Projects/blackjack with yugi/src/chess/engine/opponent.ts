/**
 * Turning a raw engine into a *character* of a given strength.
 *
 * Stockfish has two built-in handicaps and neither is enough on its own:
 *
 *  - `UCI_LimitStrength` + `UCI_Elo` is the good one, but it bottoms out at
 *    1320, which is still a solid club player. Every bot below Mai needs
 *    something weaker than Stockfish can express.
 *  - `Skill Level` reaches lower but stays tactically sharp: a Skill 0 engine
 *    searching to a real depth still refuses to hang a piece, which is exactly
 *    the mistake a beginner needs their opponent to make.
 *
 * So the weak end is hobbled on three axes at once — low skill, a depth of one
 * or three plies, and a genuine chance of passing over the best move for a
 * worse one from the MultiPV table. The last one is what makes these bots
 * actually losable to a human rather than merely a bit dull.
 */
import type { Strength } from '../characters';
import { lineScore, search, type Engine, type SearchLine } from './uci';

/** Push a strength profile into the engine. Call once per game. */
export async function configure(engine: Engine, s: Strength): Promise<void> {
  engine.send('ucinewgame');
  engine.send(`setoption name MultiPV value ${Math.max(1, s.multiPV)}`);

  if (s.uciElo !== null) {
    engine.send('setoption name UCI_LimitStrength value true');
    engine.send(`setoption name UCI_Elo value ${s.uciElo}`);
  } else {
    // Below Stockfish's floor the limiter is unavailable; Skill Level and a
    // shallow search carry the handicap instead.
    engine.send('setoption name UCI_LimitStrength value false');
    engine.send(`setoption name Skill Level value ${s.skill}`);
  }

  await engine.ready();
}

export type BotMove = {
  /** Long-algebraic, ready for chess.js. */
  move: string;
  /** Centipawns from the *bot's* point of view after its search. */
  cp: number;
  mateIn: number | null;
  /** True when the bot passed over its best move — used to flavour quips. */
  slipped: boolean;
};

export async function chooseMove(
  engine: Engine,
  s: Strength,
  fen: string
): Promise<BotMove> {
  const result = await search(engine, {
    fen,
    depth: s.depth,
    movetimeMs: s.movetimeMs,
  });

  const ranked = result.lines.slice().sort((a, b) => lineScore(b) - lineScore(a));
  const top = ranked[0];

  const alternates = ranked.slice(1, 1 + Math.max(0, s.slipDepth));
  const shouldSlip = alternates.length > 0 && Math.random() < s.slipChance;

  if (!shouldSlip) {
    return {
      move: result.best,
      cp: top?.cp ?? 0,
      mateIn: top?.mateIn ?? null,
      slipped: false,
    };
  }

  const pick = weightedPick(alternates, top ? lineScore(top) : 0);
  return { move: pick.move, cp: pick.cp, mateIn: pick.mateIn, slipped: true };
}

/**
 * Choose among the also-rans, favouring the ones that are merely worse over
 * the ones that are catastrophic.
 *
 * A flat random pick would have even the mid-tier bots dropping their queen
 * outright, which reads as broken rather than beatable. Weighting by how far
 * each line trails the best move keeps a slip proportional to the character:
 * Weevil's shallow search produces bad candidates anyway, while Mai's are all
 * near-misses, so the same code yields very different personalities.
 */
function weightedPick(lines: SearchLine[], bestScore: number): SearchLine {
  const weights = lines.map((l) => {
    const lossPawns = Math.max(0, bestScore - lineScore(l)) / 100;
    return 1 / (1 + lossPawns * lossPawns);
  });
  const total = weights.reduce((a, b) => a + b, 0);
  if (total <= 0) return lines[0];

  let roll = Math.random() * total;
  for (let i = 0; i < lines.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return lines[i];
  }
  return lines[lines.length - 1];
}
