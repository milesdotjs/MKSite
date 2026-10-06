/**
 * The two things Miles plays with White that are not 1.e4.
 *
 *   1.Nf3 then b3, Bb2, e3, Be2 — the Réti move order into a Nimzo-Larsen
 *   setup. The "for fun" opening. Always 1.Nf3 first; never 1.b3.
 *   Jobava London (1.d4 2.Nc3 3.Bf4) — he hates it and plays it as a joke.
 *
 * Fork weights are *max over lines through a move*, not a sum, so these stay
 * rare no matter how many 1.e4 lines the main book carries. 1.e4's strongest
 * line carries weight 3; these carry a fraction of 1, so together they come up
 * roughly one game in eight.
 *
 * The setup is a system, so the book is allowed to be interrupted: if the
 * opponent hangs something, the engine layer takes it instead of finishing
 * the setup (see engine/miles.ts, bookOverride).
 */
import type { Line } from './types';

const RETI = 'Réti Opening: Nimzo-Larsen Setup';
const JOB = 'Jobava London System';

const RETI_W = 0.25;
const JOBAVA_W = 0.2;

export const WHITE_SIDELINES: Line[] = [
  // ─── Réti, Nimzo-Larsen setup: 1.Nf3 then b3, Bb2, e3, Be2 ───────────────
  // A *system*: the same five moves against nearly anything, in that order
  // unless the opponent forces a change. Lines are short on purpose — once
  // the setup is complete the engine plays the position.
  {
    name: `${RETI}: vs 1...d5`,
    weight: RETI_W,
    moves: '1. Nf3 d5 2. b3 Nf6 3. Bb2 e6 4. e3 Be7 5. Be2 O-O 6. O-O c5 7. c4 Nc6 8. cxd5 exd5 9. d4 b6 10. Nc3',
  },
  {
    name: `${RETI}: vs 1...d5, 3...c5`,
    weight: RETI_W,
    moves: '1. Nf3 d5 2. b3 Nf6 3. Bb2 c5 4. e3 Nc6 5. Be2 e6 6. O-O Be7 7. c4 O-O 8. cxd5 exd5 9. d4 b6 10. Nc3',
  },
  {
    name: `${RETI}: vs 1...d5, 3...Bg4`,
    weight: RETI_W,
    moves: '1. Nf3 d5 2. b3 Nf6 3. Bb2 Bg4 4. e3 e6 5. Be2 Nbd7 6. O-O Bd6 7. d3 O-O 8. Nbd2 c6 9. c4',
  },
  {
    name: `${RETI}: vs 1...d5, 3...Bf5`,
    weight: RETI_W,
    moves: '1. Nf3 d5 2. b3 Nf6 3. Bb2 Bf5 4. e3 e6 5. Be2 Nbd7 6. O-O Bd6 7. d3 O-O 8. Nbd2 c6 9. c4',
  },
  {
    name: `${RETI}: vs 1...d5, 3...g6`,
    weight: RETI_W,
    moves: '1. Nf3 d5 2. b3 Nf6 3. Bb2 g6 4. e3 Bg7 5. Be2 O-O 6. O-O c5 7. c4 Nc6 8. cxd5 Nxd5 9. d4',
  },
  {
    name: `${RETI}: vs 1...d5, 3...c6`,
    weight: RETI_W,
    moves: '1. Nf3 d5 2. b3 Nf6 3. Bb2 c6 4. e3 Bg4 5. Be2 e6 6. O-O Bd6 7. d3 Nbd7 8. Nbd2 O-O 9. c4',
  },
  {
    name: `${RETI}: vs 1...d5, 3...Nc6`,
    weight: RETI_W,
    moves: '1. Nf3 d5 2. b3 Nf6 3. Bb2 Nc6 4. e3 Bg4 5. Be2 e6 6. O-O Bd6 7. d3 O-O 8. Nbd2',
  },
  {
    name: `${RETI}: vs 1...d5, 3...e6 4.e3 c5`,
    weight: RETI_W,
    moves: '1. Nf3 d5 2. b3 Nf6 3. Bb2 e6 4. e3 c5 5. Be2 Nc6 6. O-O Bd6 7. c4 O-O 8. cxd5 exd5 9. d4 cxd4 10. Nxd4',
  },
  {
    name: `${RETI}: vs 1...d5, 3...e6 4.e3 Bd6`,
    weight: RETI_W,
    moves: '1. Nf3 d5 2. b3 Nf6 3. Bb2 e6 4. e3 Bd6 5. Be2 O-O 6. O-O c5 7. c4 Nc6 8. cxd5 exd5 9. d4',
  },
  {
    name: `${RETI}: vs 1...d5, 3...e6 4.e3 Nbd7`,
    weight: RETI_W,
    moves: '1. Nf3 d5 2. b3 Nf6 3. Bb2 e6 4. e3 Nbd7 5. Be2 Bd6 6. O-O O-O 7. c4 c6 8. Nc3 Qe7 9. d4',
  },
  {
    name: `${RETI}: vs 1...d5, 3...e6 4.e3 b6`,
    weight: RETI_W,
    moves: '1. Nf3 d5 2. b3 Nf6 3. Bb2 e6 4. e3 b6 5. Be2 Bb7 6. O-O Be7 7. c4 O-O 8. Nc3 c5 9. cxd5 Nxd5 10. Nxd5',
  },
  {
    name: `${RETI}: vs 1...d5, 2...c5`,
    weight: RETI_W,
    moves: '1. Nf3 d5 2. b3 c5 3. Bb2 Nc6 4. e3 Nf6 5. Be2 e6 6. O-O Be7 7. c4 O-O 8. cxd5 exd5 9. d4',
  },
  {
    name: `${RETI}: vs 1...d5, 2...c5 3.Bb2 f6?!`,
    weight: RETI_W,
    moves: '1. Nf3 d5 2. b3 c5 3. Bb2 f6 4. e3 e5 5. Be2 Nc6 6. O-O Nge7 7. c4 d4 8. exd4 cxd4 9. d3',
  },
  {
    name: `${RETI}: vs 1...d5, 2...Bg4`,
    weight: RETI_W,
    moves: '1. Nf3 d5 2. b3 Bg4 3. Bb2 Nf6 4. e3 e6 5. Be2 Nbd7 6. O-O Bd6 7. d3 O-O 8. Nbd2 c6 9. c4',
  },
  {
    name: `${RETI}: vs 1...d5, 2...Bf5`,
    weight: RETI_W,
    moves: '1. Nf3 d5 2. b3 Bf5 3. Bb2 Nf6 4. e3 e6 5. Be2 Nbd7 6. O-O Bd6 7. d3 O-O 8. Nbd2 c6 9. c4',
  },
  {
    name: `${RETI}: vs 1...d5, 2...e6`,
    weight: RETI_W,
    moves: '1. Nf3 d5 2. b3 e6 3. Bb2 Nf6 4. e3 Be7 5. Be2 O-O 6. O-O c5 7. c4 Nc6 8. cxd5 exd5 9. d4',
  },
  {
    name: `${RETI}: vs 1...d5, 2...c6`,
    weight: RETI_W,
    moves: '1. Nf3 d5 2. b3 c6 3. Bb2 Nf6 4. e3 Bg4 5. Be2 e6 6. O-O Bd6 7. d3 Nbd7 8. Nbd2 O-O 9. c4',
  },
  {
    name: `${RETI}: vs 1...d5, 2...Nc6`,
    weight: RETI_W,
    moves: '1. Nf3 d5 2. b3 Nc6 3. Bb2 Nf6 4. e3 Bg4 5. Be2 e6 6. O-O Bd6 7. d3 O-O 8. Nbd2',
  },
  {
    name: `${RETI}: vs 1...d5, 2...g6`,
    weight: RETI_W,
    moves: '1. Nf3 d5 2. b3 g6 3. Bb2 Bg7 4. e3 Nf6 5. Be2 O-O 6. O-O c5 7. c4 Nc6 8. cxd5 Nxd5 9. d4',
  },
  {
    name: `${RETI}: vs 1...d5, 2...f6?!`,
    weight: RETI_W,
    moves: '1. Nf3 d5 2. b3 f6 3. Bb2 e5 4. e3 Nc6 5. Be2 Bd6 6. O-O Nge7 7. c4 d4 8. exd4 exd4 9. d3',
  },
  {
    name: `${RETI}: vs 1...d5, 2...d4`,
    weight: RETI_W,
    moves: '1. Nf3 d5 2. b3 d4 3. Bb2 c5 4. e3 Nc6 5. exd4 cxd4 6. Be2 e5 7. O-O Nf6 8. d3 Bd6 9. c3',
  },
  {
    name: `${RETI}: vs 1...Nf6`,
    weight: RETI_W,
    moves: '1. Nf3 Nf6 2. b3 g6 3. Bb2 Bg7 4. e3 O-O 5. Be2 d6 6. O-O c5 7. c4 Nc6 8. d4 cxd4 9. Nxd4',
  },
  {
    name: `${RETI}: vs 1...Nf6, 2...d5`,
    weight: RETI_W,
    moves: '1. Nf3 Nf6 2. b3 d5 3. Bb2 e6 4. e3 Be7 5. Be2 O-O 6. O-O c5 7. c4 Nc6 8. cxd5 exd5 9. d4',
  },
  {
    name: `${RETI}: vs 1...Nf6, 2...e6`,
    weight: RETI_W,
    moves: '1. Nf3 Nf6 2. b3 e6 3. Bb2 d5 4. e3 Be7 5. Be2 O-O 6. O-O c5 7. c4 Nc6 8. cxd5 exd5 9. d4',
  },
  {
    name: `${RETI}: vs 1...Nf6, 2...e6 3.Bb2 b6`,
    weight: RETI_W,
    moves: '1. Nf3 Nf6 2. b3 e6 3. Bb2 b6 4. e3 Bb7 5. Be2 Be7 6. O-O O-O 7. c4 d5 8. Nc3 c5 9. cxd5 Nxd5 10. Nxd5',
  },
  {
    name: `${RETI}: vs 1...Nf6, 2...c5`,
    weight: RETI_W,
    moves: '1. Nf3 Nf6 2. b3 c5 3. Bb2 Nc6 4. e3 d5 5. Be2 e6 6. O-O Be7 7. c4 O-O 8. cxd5 exd5 9. d4',
  },
  {
    name: `${RETI}: vs 1...Nf6, 2...c5 3.Bb2 g6`,
    weight: RETI_W,
    moves: '1. Nf3 Nf6 2. b3 c5 3. Bb2 g6 4. e3 Bg7 5. Be2 O-O 6. O-O Nc6 7. c4 d5 8. cxd5 Nxd5 9. d4',
  },
  {
    name: `${RETI}: vs 1...Nf6, 2...b6`,
    weight: RETI_W,
    moves: '1. Nf3 Nf6 2. b3 b6 3. Bb2 Bb7 4. e3 e6 5. Be2 Be7 6. O-O O-O 7. c4 d5 8. Nc3 c5 9. cxd5',
  },
  {
    name: `${RETI}: vs 1...Nf6, 2...d6`,
    weight: RETI_W,
    moves: '1. Nf3 Nf6 2. b3 d6 3. Bb2 g6 4. e3 Bg7 5. Be2 O-O 6. O-O e5 7. c4 Nc6 8. d3 Re8 9. Nc3',
  },
  {
    name: `${RETI}: vs 1...Nf6, 2...e5?!`,
    weight: RETI_W,
    moves: '1. Nf3 Nf6 2. b3 e5 3. Nxe5 d6 4. Nf3',
  },
  {
    name: `${RETI}: vs 1...c5`,
    weight: RETI_W,
    moves: '1. Nf3 c5 2. b3 Nc6 3. Bb2 d5 4. e3 Nf6 5. Be2 e6 6. O-O Be7 7. c4 O-O 8. cxd5 exd5 9. d4',
  },
  {
    name: `${RETI}: vs 1...c5, 2...d5`,
    weight: RETI_W,
    moves: '1. Nf3 c5 2. b3 d5 3. Bb2 Nf6 4. e3 Nc6 5. Be2 e6 6. O-O Be7 7. c4 O-O 8. cxd5 exd5 9. d4',
  },
  {
    name: `${RETI}: vs 1...c5, 2...Nf6`,
    weight: RETI_W,
    moves: '1. Nf3 c5 2. b3 Nf6 3. Bb2 Nc6 4. e3 d5 5. Be2 e6 6. O-O Be7 7. c4 O-O 8. cxd5 exd5 9. d4',
  },
  {
    name: `${RETI}: vs 1...c5, 2...d6`,
    weight: RETI_W,
    moves: '1. Nf3 c5 2. b3 d6 3. Bb2 Nf6 4. e3 g6 5. Be2 Bg7 6. O-O O-O 7. c4 Nc6 8. d4 cxd4 9. Nxd4',
  },
  {
    name: `${RETI}: vs 1...c5, 2...e6`,
    weight: RETI_W,
    moves: '1. Nf3 c5 2. b3 e6 3. Bb2 Nf6 4. e3 Nc6 5. Be2 d5 6. O-O Be7 7. c4 O-O 8. cxd5 exd5 9. d4',
  },
  {
    name: `${RETI}: vs 1...c5, 2...g6`,
    weight: RETI_W,
    moves: '1. Nf3 c5 2. b3 g6 3. Bb2 Bg7 4. e3 Nf6 5. Be2 O-O 6. O-O Nc6 7. c4 d5 8. cxd5 Nxd5 9. d4',
  },
  {
    name: `${RETI}: vs 1...c5, 2...b6`,
    weight: RETI_W,
    moves: '1. Nf3 c5 2. b3 b6 3. Bb2 Bb7 4. e3 Nf6 5. Be2 e6 6. O-O Be7 7. c4 O-O 8. Nc3 d5 9. cxd5',
  },
  {
    name: `${RETI}: vs 1...c5, 2...Nc6 3.Bb2 e5`,
    weight: RETI_W,
    moves: '1. Nf3 c5 2. b3 Nc6 3. Bb2 e5 4. e3 d6 5. Be2 Nf6 6. O-O Be7 7. c4 O-O 8. Nc3 Bf5 9. d3',
  },
  {
    name: `${RETI}: vs 1...e6`,
    weight: RETI_W,
    moves: '1. Nf3 e6 2. b3 d5 3. Bb2 Nf6 4. e3 Be7 5. Be2 O-O 6. O-O c5 7. c4 Nc6 8. cxd5 exd5 9. d4',
  },
  {
    name: `${RETI}: vs 1...e6, 2...Nf6`,
    weight: RETI_W,
    moves: '1. Nf3 e6 2. b3 Nf6 3. Bb2 d5 4. e3 Be7 5. Be2 O-O 6. O-O c5 7. c4 Nc6 8. cxd5 exd5 9. d4',
  },
  {
    name: `${RETI}: vs 1...e6, 2...b6`,
    weight: RETI_W,
    moves: '1. Nf3 e6 2. b3 b6 3. Bb2 Bb7 4. e3 Nf6 5. Be2 Be7 6. O-O O-O 7. c4 d5 8. Nc3',
  },
  {
    name: `${RETI}: vs 1...e6, 2...f5`,
    weight: RETI_W,
    moves: '1. Nf3 e6 2. b3 f5 3. Bb2 Nf6 4. e3 Be7 5. Be2 O-O 6. O-O b6 7. c4 Bb7 8. Nc3 d6 9. d4',
  },
  {
    name: `${RETI}: vs 1...g6`,
    weight: RETI_W,
    moves: '1. Nf3 g6 2. b3 Bg7 3. Bb2 Nf6 4. e3 O-O 5. Be2 d6 6. O-O c5 7. c4 Nc6 8. d4 cxd4 9. Nxd4',
  },
  {
    name: `${RETI}: vs 1...g6, 2...Bg7 3.Bb2 d5`,
    weight: RETI_W,
    moves: '1. Nf3 g6 2. b3 Bg7 3. Bb2 d5 4. e3 Nf6 5. Be2 O-O 6. O-O c5 7. c4 Nc6 8. cxd5 Nxd5 9. d4',
  },
  {
    name: `${RETI}: vs 1...g6, 2...Bg7 3.Bb2 e5`,
    weight: RETI_W,
    moves: '1. Nf3 g6 2. b3 Bg7 3. Bb2 e5 4. e3 d6 5. Be2 Ne7 6. O-O O-O 7. c4 Nbc6 8. Nc3 f5 9. d3',
  },
  {
    name: `${RETI}: vs 1...g6, 2...Bg7 3.Bb2 c5`,
    weight: RETI_W,
    moves: '1. Nf3 g6 2. b3 Bg7 3. Bb2 c5 4. e3 Nf6 5. Be2 O-O 6. O-O Nc6 7. c4 d5 8. cxd5 Nxd5 9. d4',
  },
  {
    name: `${RETI}: vs 1...d6`,
    weight: RETI_W,
    moves: '1. Nf3 d6 2. b3 Nf6 3. Bb2 g6 4. e3 Bg7 5. Be2 O-O 6. O-O e5 7. c4 Nc6 8. d3 Re8 9. Nc3',
  },
  {
    name: `${RETI}: vs 1...d6, 2...e5`,
    weight: RETI_W,
    moves: '1. Nf3 d6 2. b3 e5 3. Bb2 Nc6 4. e3 Nf6 5. Be2 Be7 6. O-O O-O 7. c4 Bf5 8. Nc3 Re8 9. d3',
  },
  {
    name: `${RETI}: vs 1...d6, 2...Bg4`,
    weight: RETI_W,
    moves: '1. Nf3 d6 2. b3 Bg4 3. Bb2 Nd7 4. e3 e5 5. Be2 Ngf6 6. O-O Be7 7. c4 O-O 8. Nc3 c6 9. d3',
  },
  {
    name: `${RETI}: vs 1...f5`,
    weight: RETI_W,
    moves: '1. Nf3 f5 2. b3 Nf6 3. Bb2 e6 4. e3 Be7 5. Be2 O-O 6. O-O b6 7. c4 Bb7 8. Nc3 d6 9. d4',
  },
  {
    name: `${RETI}: vs 1...f5, 2...d6`,
    weight: RETI_W,
    moves: '1. Nf3 f5 2. b3 d6 3. Bb2 Nf6 4. e3 g6 5. Be2 Bg7 6. O-O O-O 7. c4 c6 8. d4 Qc7 9. Nbd2',
  },
  {
    name: `${RETI}: vs 1...f5, 2...e6`,
    weight: RETI_W,
    moves: '1. Nf3 f5 2. b3 e6 3. Bb2 Nf6 4. e3 Be7 5. Be2 O-O 6. O-O b6 7. c4 Bb7 8. Nc3 d6 9. d4',
  },
  {
    name: `${RETI}: vs 1...f5, 2...g6`,
    weight: RETI_W,
    moves: '1. Nf3 f5 2. b3 g6 3. Bb2 Nf6 4. e3 Bg7 5. Be2 O-O 6. O-O d6 7. c4 c6 8. d4 Qc7 9. Nbd2',
  },
  {
    name: `${RETI}: vs 1...b6`,
    weight: RETI_W,
    moves: '1. Nf3 b6 2. b3 Bb7 3. Bb2 Nf6 4. e3 e6 5. Be2 Be7 6. O-O O-O 7. c4 d5 8. Nc3 c5 9. cxd5',
  },
  {
    name: `${RETI}: vs 1...b6, 2...e6`,
    weight: RETI_W,
    moves: '1. Nf3 b6 2. b3 e6 3. Bb2 Bb7 4. e3 Nf6 5. Be2 Be7 6. O-O O-O 7. c4 d5 8. Nc3',
  },
  {
    name: `${RETI}: vs 1...c6`,
    weight: RETI_W,
    moves: '1. Nf3 c6 2. b3 d5 3. Bb2 Nf6 4. e3 Bg4 5. Be2 e6 6. O-O Bd6 7. d3 Nbd7 8. Nbd2 O-O 9. c4',
  },
  {
    name: `${RETI}: vs 1...c6, 2...d5 3.Bb2 Bg4`,
    weight: RETI_W,
    moves: '1. Nf3 c6 2. b3 d5 3. Bb2 Bg4 4. e3 Nf6 5. Be2 e6 6. O-O Bd6 7. d3 Nbd7 8. Nbd2 O-O 9. c4',
  },
  {
    name: `${RETI}: vs 1...c6, 2...d5 3.Bb2 Bf5`,
    weight: RETI_W,
    moves: '1. Nf3 c6 2. b3 d5 3. Bb2 Bf5 4. e3 Nf6 5. Be2 e6 6. O-O Bd6 7. d3 Nbd7 8. Nbd2 O-O 9. c4',
  },
  {
    name: `${RETI}: vs 1...Nc6`,
    weight: RETI_W,
    moves: '1. Nf3 Nc6 2. b3 d5 3. Bb2 Nf6 4. e3 Bg4 5. Be2 e6 6. O-O Bd6 7. d3 O-O 8. Nbd2',
  },
  {
    name: `${RETI}: vs 1...Nc6, 2...e5`,
    weight: RETI_W,
    moves: '1. Nf3 Nc6 2. b3 e5 3. Bb2 d6 4. e3 Nf6 5. Be2 Be7 6. O-O O-O 7. c4 Bf5 8. Nc3 Re8 9. d3',
  },
  {
    name: `${RETI}: vs 1...e5?! 2.Nxe5`,
    weight: RETI_W,
    moves: '1. Nf3 e5 2. Nxe5 Nc6 3. Nxc6 dxc6 4. b3 Nf6 5. Bb2 Bd6 6. e3 O-O 7. Be2 Re8 8. O-O',
  },
  {
    name: `${RETI}: vs 1...e5?! 2.Nxe5 Qe7`,
    weight: RETI_W,
    moves: '1. Nf3 e5 2. Nxe5 Qe7 3. Nf3',
  },
  {
    name: `${RETI}: vs 1...e5?! 2.Nxe5 d6`,
    weight: RETI_W,
    moves: '1. Nf3 e5 2. Nxe5 d6 3. Nf3 Nf6 4. b3 Nc6 5. Bb2 Be7 6. e3 O-O 7. Be2 Re8 8. O-O',
  },
  {
    name: `${RETI}: vs 1...e5?! 2.Nxe5 Bd6`,
    weight: RETI_W,
    moves: '1. Nf3 e5 2. Nxe5 Bd6 3. Nf3 Nf6 4. b3 O-O 5. Bb2 Re8 6. e3 Nc6 7. Be2 Be5 8. Nxe5 Nxe5 9. O-O',
  },
  {
    name: `${RETI}: vs 1...e5?! 2.Nxe5 Nf6`,
    weight: RETI_W,
    moves: '1. Nf3 e5 2. Nxe5 Nf6 3. b3 d6 4. Nf3 Nc6 5. Bb2 Be7 6. e3 O-O 7. Be2 Re8 8. O-O',
  },
  {
    name: `${RETI}: vs 1...a6?!`,
    weight: RETI_W,
    moves: '1. Nf3 a6 2. b3 d5 3. Bb2 Nf6 4. e3 e6 5. Be2 c5 6. O-O Nc6 7. c4 Be7 8. cxd5 exd5 9. d4',
  },
  {
    name: `${RETI}: vs 1...h6?!`,
    weight: RETI_W,
    moves: '1. Nf3 h6 2. b3 d5 3. Bb2 Nf6 4. e3 e6 5. Be2 c5 6. O-O Nc6 7. c4 Be7 8. cxd5 exd5 9. d4',
  },
  {
    name: `${RETI}: vs 1...b5?!`,
    weight: RETI_W,
    moves: '1. Nf3 b5 2. e4 Bb7 3. Bxb5 Bxe4 4. O-O Nf6 5. Re1 Bb7 6. d4 e6 7. c4',
  },
  {
    name: `${RETI}: vs 1...Nh6?!`,
    weight: RETI_W,
    moves: '1. Nf3 Nh6 2. b3 d5 3. Bb2 e6 4. e3 Be7 5. Be2 O-O 6. O-O c5 7. c4 Nc6 8. d4',
  },

  // ─── Jobava London ────────────────────────────────────────────────────────
  {
    name: `${JOB}: 2...d5 3.Bf4 e6`,
    weight: JOBAVA_W,
    moves: '1. d4 Nf6 2. Nc3 d5 3. Bf4 e6 4. Nb5 Na6 5. e3 Be7 6. Nf3 O-O 7. c3 c5 8. Bd3 Nc7 9. Nxc7 Qxc7 10. O-O',
  },
  {
    name: `${JOB}: 2...d5 3.Bf4 e6 4.Nb5 Bd6`,
    weight: JOBAVA_W,
    moves: '1. d4 Nf6 2. Nc3 d5 3. Bf4 e6 4. Nb5 Bd6 5. Nxd6+ cxd6 6. e3 Nc6 7. Nf3 O-O 8. Bd3 Qe7 9. O-O',
  },
  {
    name: `${JOB}: 2...d5 3.Bf4 c5`,
    weight: JOBAVA_W,
    moves: '1. d4 Nf6 2. Nc3 d5 3. Bf4 c5 4. e3 Nc6 5. Nb5 e5 6. dxe5 Ne4 7. Nf3 a6 8. Nd6+ Bxd6 9. exd6 Qf6 10. Bg3',
  },
  {
    name: `${JOB}: 2...d5 3.Bf4 c5 4.e3 cxd4`,
    weight: JOBAVA_W,
    moves: '1. d4 Nf6 2. Nc3 d5 3. Bf4 c5 4. e3 cxd4 5. exd4 a6 6. Nf3 Nc6 7. Bd3 Bg4 8. O-O e6 9. h3 Bxf3 10. Qxf3',
  },
  {
    name: `${JOB}: 2...d5 3.Bf4 c5 4.e3 Nc6 5.Nb5 Qa5+`,
    weight: JOBAVA_W,
    moves: '1. d4 Nf6 2. Nc3 d5 3. Bf4 c5 4. e3 Nc6 5. Nb5 Qa5+ 6. c3 Ne4 7. Qa4 Qxa4 8. Nc7+ Kd8 9. Nxa8',
  },
  {
    name: `${JOB}: 2...d5 3.Bf4 a6`,
    weight: JOBAVA_W,
    moves: '1. d4 Nf6 2. Nc3 d5 3. Bf4 a6 4. e3 e6 5. Nf3 c5 6. Bd3 Nc6 7. O-O Be7 8. Ne5 Qb6 9. Rb1',
  },
  {
    name: `${JOB}: 2...d5 3.Bf4 Bf5`,
    weight: JOBAVA_W,
    moves: '1. d4 Nf6 2. Nc3 d5 3. Bf4 Bf5 4. f3 e6 5. g4 Bg6 6. h4 h6 7. e3 c5 8. Bd3',
  },
  {
    name: `${JOB}: 2...d5 3.Bf4 g6`,
    weight: JOBAVA_W,
    moves: '1. d4 Nf6 2. Nc3 d5 3. Bf4 g6 4. e3 Bg7 5. h4 O-O 6. Nf3 c5 7. Be2 Nc6 8. Ne5',
  },
  {
    name: `${JOB}: 2...d5 3.Bf4 c6`,
    weight: JOBAVA_W,
    moves: '1. d4 Nf6 2. Nc3 d5 3. Bf4 c6 4. e3 Bf5 5. f3 e6 6. g4 Bg6 7. h4 h6 8. Bd3',
  },
  {
    name: `${JOB}: 2...d5 3.Bf4 Nbd7`,
    weight: JOBAVA_W,
    moves: '1. d4 Nf6 2. Nc3 d5 3. Bf4 Nbd7 4. e3 e6 5. Nf3 c5 6. Bd3 Be7 7. O-O O-O 8. Ne5',
  },
  {
    name: `${JOB}: 2...d5 3.Bf4 e6 4.e3 Bd6`,
    weight: JOBAVA_W,
    moves: '1. d4 Nf6 2. Nc3 d5 3. Bf4 e6 4. e3 Bd6 5. Bg3 O-O 6. Nf3 c5 7. Bd3 Nc6 8. O-O',
  },
  {
    name: `${JOB}: 2...e6 3.Bf4`,
    weight: JOBAVA_W,
    moves: '1. d4 Nf6 2. Nc3 e6 3. Bf4 d5 4. Nb5 Bd6 5. Nxd6+ cxd6 6. e3 Nc6 7. Nf3 O-O 8. Bd3',
  },
  {
    name: `${JOB}: 2...e6 3.Bf4 Bb4`,
    weight: JOBAVA_W,
    moves: '1. d4 Nf6 2. Nc3 e6 3. Bf4 Bb4 4. Qd3 d5 5. e3 O-O 6. Nf3 c5 7. a3 Bxc3+ 8. Qxc3',
  },
  {
    name: `${JOB}: 2...e6 3.Bf4 c5`,
    weight: JOBAVA_W,
    moves: '1. d4 Nf6 2. Nc3 e6 3. Bf4 c5 4. e3 Nc6 5. Nb5 d5 6. c3 a6 7. Nd6+ Bxd6 8. Bxd6 Ne4 9. Bf4',
  },
  {
    name: `${JOB}: 2...e6 3.Bf4 b6`,
    weight: JOBAVA_W,
    moves: '1. d4 Nf6 2. Nc3 e6 3. Bf4 b6 4. e4 Bb7 5. Bd3 Bb4 6. Nge2 d5 7. e5 Ne4 8. O-O',
  },
  {
    name: `${JOB}: 2...g6 3.Bf4 d5`,
    weight: JOBAVA_W,
    moves: '1. d4 Nf6 2. Nc3 g6 3. Bf4 d5 4. e3 Bg7 5. h4 O-O 6. Nf3 c5 7. Be2 Nc6 8. Ne5',
  },
  {
    name: `${JOB}: 2...g6 3.Bf4 Bg7 4.e4`,
    weight: JOBAVA_W,
    moves: '1. d4 Nf6 2. Nc3 g6 3. Bf4 Bg7 4. e4 d6 5. Qd2 O-O 6. f3 c6 7. Bh6 b5 8. Nge2',
  },
  {
    name: `${JOB}: 2...g6 3.Bf4 Bg7 4.e4 d5`,
    weight: JOBAVA_W,
    moves: '1. d4 Nf6 2. Nc3 g6 3. Bf4 Bg7 4. e4 d5 5. e5 Nh5 6. Be3 O-O 7. Nf3 c5 8. dxc5 Nc6 9. Bb5',
  },
  {
    name: `${JOB}: 2...c5 3.Bf4`,
    weight: JOBAVA_W,
    moves: '1. d4 Nf6 2. Nc3 c5 3. d5 e6 4. e4 exd5 5. e5 d4 6. exf6',
  },
  {
    name: `${JOB}: 2...c5 3.d5 d6`,
    weight: JOBAVA_W,
    moves: '1. d4 Nf6 2. Nc3 c5 3. d5 d6 4. e4 g6 5. Bb5+ Nbd7 6. Nf3 Bg7 7. O-O O-O 8. Re1',
  },
  {
    name: `${JOB}: 2...c5 3.d5 e5`,
    weight: JOBAVA_W,
    moves: '1. d4 Nf6 2. Nc3 c5 3. d5 e5 4. e4 d6 5. Bb5+ Nbd7 6. Nf3 a6 7. Be2 Be7 8. O-O O-O 9. Nd2',
  },
  {
    name: `${JOB}: 2...c6 3.Bf4 d5`,
    weight: JOBAVA_W,
    moves: '1. d4 Nf6 2. Nc3 c6 3. Bf4 d5 4. e3 Bf5 5. f3 e6 6. g4 Bg6 7. h4 h6 8. Bd3',
  },
  {
    name: `${JOB}: 2...b6 3.Bf4`,
    weight: JOBAVA_W,
    moves: '1. d4 Nf6 2. Nc3 b6 3. Bf4 Bb7 4. e3 e6 5. Nf3 Bb4 6. Bd3 d5 7. O-O O-O 8. Ne5',
  },
  {
    name: `${JOB}: 2...d6 3.Bf4`,
    weight: JOBAVA_W,
    moves: '1. d4 Nf6 2. Nc3 d6 3. Bf4 g6 4. e4 Bg7 5. Qd2 O-O 6. f3 c6 7. Bh6 b5 8. Nge2',
  },
  {
    name: `${JOB}: 2...d6 3.Bf4 Nbd7`,
    weight: JOBAVA_W,
    moves: '1. d4 Nf6 2. Nc3 d6 3. Bf4 Nbd7 4. e4 e5 5. dxe5 dxe5 6. Bg5 Be7 7. Nf3 h6 8. Bh4',
  },
  {
    name: `${JOB}: 1...d5 2.Nc3 Nf6 3.Bf4 (move order)`,
    weight: JOBAVA_W,
    moves: '1. d4 d5 2. Nc3 Nf6 3. Bf4 e6 4. Nb5 Na6 5. e3 Be7 6. Nf3 O-O 7. c3 c5 8. Bd3',
  },
  {
    name: `${JOB}: 1...d5 2.Nc3 Nf6 3.Bf4 c5`,
    weight: JOBAVA_W,
    moves: '1. d4 d5 2. Nc3 Nf6 3. Bf4 c5 4. e3 Nc6 5. Nb5 e5 6. dxe5 Ne4 7. Nf3 a6 8. Nd6+ Bxd6 9. exd6 Qf6 10. Bg3',
  },
  {
    name: `${JOB}: 1...d5 2.Nc3 Nf6 3.Bf4 a6`,
    weight: JOBAVA_W,
    moves: '1. d4 d5 2. Nc3 Nf6 3. Bf4 a6 4. e3 e6 5. Nf3 c5 6. Bd3 Nc6 7. O-O Be7 8. Ne5',
  },
  {
    name: `${JOB}: 1...d5 2.Nc3 Nf6 3.Bf4 Bf5`,
    weight: JOBAVA_W,
    moves: '1. d4 d5 2. Nc3 Nf6 3. Bf4 Bf5 4. f3 e6 5. g4 Bg6 6. h4 h6 7. e3 c5 8. Bd3',
  },
  {
    name: `${JOB}: 1...d5 2.Nc3 Nf6 3.Bf4 g6`,
    weight: JOBAVA_W,
    moves: '1. d4 d5 2. Nc3 Nf6 3. Bf4 g6 4. e3 Bg7 5. h4 O-O 6. Nf3 c5 7. Be2 Nc6 8. Ne5',
  },
  {
    name: `${JOB}: 1...d5 2.Nc3 Nf6 3.Bf4 c6`,
    weight: JOBAVA_W,
    moves: '1. d4 d5 2. Nc3 Nf6 3. Bf4 c6 4. e3 Bf5 5. f3 e6 6. g4 Bg6 7. h4 h6 8. Bd3',
  },
  {
    name: `${JOB}: 1...d5 2.Nc3 Nf6 3.Bf4 e6 4.Nb5 Bd6`,
    weight: JOBAVA_W,
    moves: '1. d4 d5 2. Nc3 Nf6 3. Bf4 e6 4. Nb5 Bd6 5. Nxd6+ cxd6 6. e3 Nc6 7. Nf3 O-O 8. Bd3 Qe7 9. O-O',
  },
  {
    name: `${JOB}: 1...d5 2.Nc3 c5`,
    weight: JOBAVA_W,
    moves: '1. d4 d5 2. Nc3 c5 3. e4 dxe4 4. d5 Nf6 5. Bc4 e6 6. Nge2 exd5 7. Nxd5',
  },
  {
    name: `${JOB}: 1...d5 2.Nc3 c6`,
    weight: JOBAVA_W,
    moves: '1. d4 d5 2. Nc3 c6 3. Bf4 Nf6 4. e3 Bf5 5. f3 e6 6. g4 Bg6 7. h4',
  },
  {
    name: `${JOB}: 1...d5 2.Nc3 Bf5`,
    weight: JOBAVA_W,
    moves: '1. d4 d5 2. Nc3 Bf5 3. f3 Nf6 4. g4 Bg6 5. h4 h6 6. e3 e6 7. Bd3',
  },
  {
    name: `${JOB}: 1...d5 2.Nc3 e6`,
    weight: JOBAVA_W,
    moves: '1. d4 d5 2. Nc3 e6 3. Bf4 Nf6 4. Nb5 Na6 5. e3 Be7 6. Nf3 O-O 7. c3',
  },
  {
    name: `${JOB}: 1...d5 2.Nc3 g6`,
    weight: JOBAVA_W,
    moves: '1. d4 d5 2. Nc3 g6 3. Bf4 Bg7 4. e3 Nf6 5. h4 O-O 6. Nf3 c5 7. Be2 Nc6 8. Ne5',
  },
  {
    name: `${JOB}: 1...d5 2.Nc3 Nc6`,
    weight: JOBAVA_W,
    moves: '1. d4 d5 2. Nc3 Nc6 3. Bf4 Bf5 4. f3 e6 5. g4 Bg6 6. h4 h6 7. e3',
  },
  {
    name: `${JOB}: 1...d5 2.Nc3 Bg4`,
    weight: JOBAVA_W,
    moves: '1. d4 d5 2. Nc3 Bg4 3. f3 Bh5 4. Bf4 Nf6 5. e3 c6 6. g4 Bg6 7. h4',
  },
  {
    name: `${JOB}: 1...e6 2.Nc3 d5 3.Bf4`,
    weight: JOBAVA_W,
    moves: '1. d4 e6 2. Nc3 d5 3. Bf4 Nf6 4. Nb5 Na6 5. e3 Be7 6. Nf3 O-O 7. c3',
  },
  {
    name: `${JOB}: 1...e6 2.Nc3 Nf6`,
    weight: JOBAVA_W,
    moves: '1. d4 e6 2. Nc3 Nf6 3. Bf4 d5 4. Nb5 Bd6 5. Nxd6+ cxd6 6. e3 Nc6 7. Nf3',
  },
  {
    name: `${JOB}: 1...g6 2.Nc3`,
    weight: JOBAVA_W,
    moves: '1. d4 g6 2. Nc3 Bg7 3. Bf4 d6 4. e4 Nf6 5. Qd2 O-O 6. f3 c6 7. Bh6',
  },
  {
    name: `${JOB}: 1...g6 2.Nc3 Bg7 3.Bf4 d5`,
    weight: JOBAVA_W,
    moves: '1. d4 g6 2. Nc3 Bg7 3. Bf4 d5 4. e3 Nf6 5. h4 O-O 6. Nf3 c5 7. Be2 Nc6 8. Ne5',
  },
  {
    name: `${JOB}: 1...c5?! 2.Nc3`,
    weight: JOBAVA_W,
    moves: '1. d4 c5 2. Nc3 cxd4 3. Qxd4 Nc6 4. Qd1 d5 5. Bf4 Nf6 6. e3 e6 7. Nf3',
  },
  {
    name: `${JOB}: 1...c6 2.Nc3 d5`,
    weight: JOBAVA_W,
    moves: '1. d4 c6 2. Nc3 d5 3. Bf4 Nf6 4. e3 Bf5 5. f3 e6 6. g4 Bg6 7. h4',
  },
  {
    name: `${JOB}: 1...f5 2.Nc3`,
    weight: JOBAVA_W,
    moves: '1. d4 f5 2. Nc3 Nf6 3. Bg5 d5 4. Bxf6 exf6 5. e3 Be6 6. Bd3 c6 7. Nf3',
  },
  {
    name: `${JOB}: 1...b6 2.Nc3`,
    weight: JOBAVA_W,
    moves: '1. d4 b6 2. Nc3 Bb7 3. Bf4 e6 4. e4 Bb4 5. Bd3 Nf6 6. Nge2 d5 7. e5 Ne4 8. O-O',
  },
  {
    name: `${JOB}: 1...d6 2.Nc3`,
    weight: JOBAVA_W,
    moves: '1. d4 d6 2. Nc3 Nf6 3. Bf4 g6 4. e4 Bg7 5. Qd2 O-O 6. f3 c6 7. Bh6',
  },
  {
    name: `${JOB}: 1...Nc6 2.Nc3`,
    weight: JOBAVA_W,
    moves: '1. d4 Nc6 2. Nc3 d5 3. Bf4 Bf5 4. f3 e6 5. g4 Bg6 6. h4 h6 7. e3',
  },
  {
    name: `${JOB}: 1...e5?! (Englund)`,
    weight: JOBAVA_W,
    moves: '1. d4 e5 2. dxe5 Nc6 3. Nf3 Qe7 4. Bf4 Qb4+ 5. Bd2 Qxb2 6. Nc3 Bb4 7. Rb1 Qa3 8. Rb3',
  },
];
