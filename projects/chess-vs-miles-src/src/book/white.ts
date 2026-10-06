/**
 * Miles with the white pieces. Always 1.e4.
 *
 *   vs 1...e5      Ruy Lopez most of the time, the Scotch now and then
 *   vs 1...c5      Open Sicilian; English Attack / Yugoslav Attack where they fit
 *   vs 1...e6      French Advance
 *   vs 1...c6      Caro-Kann: Panov Attack mostly, Advance sometimes
 *   vs the rest    sensible mainline moves, then the engine takes over
 *
 * Lines are deliberately short-ish: this is a 1600's repertoire, not a GM's.
 * Where theory runs on for twenty moves we stop around move ten and let the
 * engine play the middlegame — that is what the real Miles does too.
 */
import type { Line } from './types';

const RUY = 'Ruy Lopez';
const SCOTCH = 'Scotch Game';

export const WHITE_LINES: Line[] = [
  // ─── 1...e5: Ruy Lopez (weight 3) and Scotch (weight 1) ─────────────────
  {
    name: `${RUY}: Closed, Main Line`,
    weight: 3,
    moves: '1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Na5 10. Bc2 c5 11. d4 Qc7 12. Nbd2',
  },
  {
    name: `${RUY}: Closed, Breyer`,
    weight: 3,
    moves: '1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Nb8 10. d4 Nbd7 11. Nbd2 Bb7 12. Bc2',
  },
  {
    name: `${RUY}: Closed, Zaitsev`,
    weight: 3,
    moves: '1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Bb7 10. d4 Re8 11. Nbd2 Bf8 12. a4',
  },
  {
    name: `${RUY}: Closed, Marshall Declined`,
    weight: 3,
    moves: '1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 O-O 8. h3 d6 9. c3 Na5 10. Bc2 c5 11. d4',
  },
  {
    name: `${RUY}: Closed, Arkhangelsk`,
    weight: 3,
    moves: '1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O b5 6. Bb3 Bc5 7. a4 Rb8 8. c3 d6 9. d4 Bb6 10. axb5 axb5 11. Na3',
  },
  {
    name: `${RUY}: Open Variation`,
    weight: 3,
    moves: '1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Nxe4 6. d4 b5 7. Bb3 d5 8. dxe5 Be6 9. c3 Bc5 10. Nbd2 O-O 11. Bc2',
  },
  {
    name: `${RUY}: Modern Steinitz`,
    weight: 3,
    moves: '1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 d6 5. c3 Bd7 6. d4 Nf6 7. O-O Be7 8. Re1 O-O 9. Nbd2',
  },
  {
    name: `${RUY}: Exchange-Avoiding, 4...Bc5`,
    weight: 3,
    moves: '1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Bc5 5. O-O Nge7 6. Nxe5 Nxe5 7. d4 Bxd4 8. Qxd4',
  },
  {
    name: `${RUY}: Berlin Defense`,
    weight: 3,
    moves: '1. e4 e5 2. Nf3 Nc6 3. Bb5 Nf6 4. O-O Nxe4 5. Re1 Nd6 6. Nxe5 Be7 7. Bf1 Nxe5 8. Rxe5 O-O 9. d4 Bf6 10. Re1 Re8 11. c3',
  },
  {
    name: `${RUY}: Berlin, Anti-Berlin d3`,
    weight: 2,
    moves: '1. e4 e5 2. Nf3 Nc6 3. Bb5 Nf6 4. O-O Be7 5. Re1 d6 6. c3 O-O 7. d4 Bd7 8. Nbd2',
  },
  {
    name: `${RUY}: Berlin, 4...Bc5`,
    weight: 3,
    moves: '1. e4 e5 2. Nf3 Nc6 3. Bb5 Nf6 4. O-O Bc5 5. c3 O-O 6. d4 Bb6 7. Bg5 h6 8. Bh4',
  },
  {
    name: `${RUY}: Classical`,
    weight: 3,
    moves: '1. e4 e5 2. Nf3 Nc6 3. Bb5 Bc5 4. c3 Nf6 5. d4 Bb6 6. O-O O-O 7. Re1 d6 8. h3',
  },
  {
    name: `${RUY}: Classical, 4...f5`,
    weight: 3,
    moves: '1. e4 e5 2. Nf3 Nc6 3. Bb5 Bc5 4. c3 f5 5. d4 fxe4 6. Bxc6 dxc6 7. Nfd2 Bd6 8. Nxe4',
  },
  {
    name: `${RUY}: Steinitz Defense`,
    weight: 3,
    moves: '1. e4 e5 2. Nf3 Nc6 3. Bb5 d6 4. d4 exd4 5. Nxd4 Bd7 6. Nc3 Nf6 7. O-O Be7 8. Bxc6 bxc6 9. Qd3',
  },
  {
    name: `${RUY}: Schliemann Defense`,
    weight: 3,
    moves: '1. e4 e5 2. Nf3 Nc6 3. Bb5 f5 4. Nc3 fxe4 5. Nxe4 d5 6. Nxe5 dxe4 7. Nxc6 Qg5 8. Qe2 Nf6 9. f4 Qxf4 10. Ne5+ c6 11. d4',
  },
  {
    name: `${RUY}: Schliemann, 4...Nf6`,
    weight: 3,
    moves: '1. e4 e5 2. Nf3 Nc6 3. Bb5 f5 4. Nc3 Nf6 5. exf5 Bc5 6. O-O O-O 7. Nxe5 Nxe5 8. d4',
  },
  {
    name: `${RUY}: Bird's Defense`,
    weight: 3,
    moves: '1. e4 e5 2. Nf3 Nc6 3. Bb5 Nd4 4. Nxd4 exd4 5. O-O Bc5 6. d3 c6 7. Ba4 Ne7 8. f4',
  },
  {
    name: `${RUY}: Cozio Defense`,
    weight: 3,
    moves: '1. e4 e5 2. Nf3 Nc6 3. Bb5 Nge7 4. O-O g6 5. c3 Bg7 6. d4 exd4 7. cxd4 d5 8. exd5 Nxd5 9. Re1+ Be6 10. Bg5',
  },
  {
    name: `${RUY}: Fianchetto Defense`,
    weight: 3,
    moves: '1. e4 e5 2. Nf3 Nc6 3. Bb5 g6 4. c3 a6 5. Ba4 d6 6. d4 Bd7 7. O-O Bg7 8. Re1 Nf6 9. Nbd2',
  },
  {
    name: `${RUY}: Norwegian Variation`,
    weight: 3,
    moves: '1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 b5 5. Bb3 Na5 6. O-O d6 7. d4 Nxb3 8. axb3 f6 9. Nc3',
  },

  // Scotch: the change-up.
  {
    name: `${SCOTCH}: Mieses Variation`,
    weight: 1,
    moves: '1. e4 e5 2. Nf3 Nc6 3. d4 exd4 4. Nxd4 Nf6 5. Nxc6 bxc6 6. e5 Qe7 7. Qe2 Nd5 8. c4 Ba6 9. b3 g6 10. f4 Bg7 11. Qf2',
  },
  {
    name: `${SCOTCH}: Mieses, 8...Nb6`,
    weight: 1,
    moves: '1. e4 e5 2. Nf3 Nc6 3. d4 exd4 4. Nxd4 Nf6 5. Nxc6 bxc6 6. e5 Qe7 7. Qe2 Nd5 8. c4 Nb6 9. Nd2 Qe6 10. b3 a5 11. Bb2',
  },
  {
    name: `${SCOTCH}: Classical Variation`,
    weight: 1,
    moves: '1. e4 e5 2. Nf3 Nc6 3. d4 exd4 4. Nxd4 Bc5 5. Be3 Qf6 6. c3 Nge7 7. Bc4 Ne5 8. Be2 Qg6 9. O-O d6 10. f3',
  },
  {
    name: `${SCOTCH}: Classical, 5...Bb6`,
    weight: 1,
    moves: '1. e4 e5 2. Nf3 Nc6 3. d4 exd4 4. Nxd4 Bc5 5. Be3 Qf6 6. c3 Nge7 7. Bc4 O-O 8. O-O Bb6 9. Nc2',
  },
  {
    name: `${SCOTCH}: Steinitz Variation`,
    weight: 1,
    moves: '1. e4 e5 2. Nf3 Nc6 3. d4 exd4 4. Nxd4 Qh4 5. Nc3 Bb4 6. Be2 Qxe4 7. Ndb5 Bxc3+ 8. bxc3 Kd8 9. O-O',
  },
  {
    name: `${SCOTCH}: 4...Nxd4`,
    weight: 1,
    moves: '1. e4 e5 2. Nf3 Nc6 3. d4 exd4 4. Nxd4 Nxd4 5. Qxd4 Qf6 6. e5 Qb6 7. Qd3 d6 8. Nc3',
  },
  {
    name: `${SCOTCH}: Schmidt Variation`,
    weight: 1,
    moves: '1. e4 e5 2. Nf3 Nc6 3. d4 exd4 4. Nxd4 Nf6 5. Nc3 Bb4 6. Nxc6 bxc6 7. Bd3 d5 8. exd5 cxd5 9. O-O O-O 10. Bg5',
  },
  {
    name: `${SCOTCH}: 3...d6`,
    weight: 1,
    moves: '1. e4 e5 2. Nf3 Nc6 3. d4 d6 4. Bb5 exd4 5. Nxd4 Bd7 6. Nc3 Nf6 7. O-O Be7 8. Nf5',
  },

  // Other 1...e5 replies.
  {
    name: 'Petrov Defense: Classical',
    moves: '1. e4 e5 2. Nf3 Nf6 3. Nxe5 d6 4. Nf3 Nxe4 5. d4 d5 6. Bd3 Nc6 7. O-O Be7 8. c4 Nb4 9. Be2 O-O 10. Nc3 Bf5 11. a3',
  },
  {
    name: 'Petrov Defense: Classical, 5...Be7',
    moves: '1. e4 e5 2. Nf3 Nf6 3. Nxe5 d6 4. Nf3 Nxe4 5. d4 Be7 6. Bd3 Nf6 7. O-O O-O 8. c4 c6 9. Nc3',
  },
  {
    name: 'Petrov Defense: Stafford Gambit (declined with 4.Nxc6)',
    moves: '1. e4 e5 2. Nf3 Nf6 3. Nxe5 Nc6 4. Nxc6 dxc6 5. d3 Bc5 6. Be2 h5 7. Nc3 Ng4 8. Bxg4 hxg4 9. Be3',
  },
  {
    name: 'Petrov Defense: 3...Nxe4?!',
    moves: '1. e4 e5 2. Nf3 Nf6 3. Nxe5 Nxe4 4. Qe2 Qe7 5. Qxe4 d6 6. d4 dxe5 7. dxe5 Nc6 8. Nc3',
  },
  {
    name: 'Philidor Defense',
    moves: '1. e4 e5 2. Nf3 d6 3. d4 exd4 4. Nxd4 Nf6 5. Nc3 Be7 6. Be2 O-O 7. O-O c6 8. a4 Nbd7 9. f4',
  },
  {
    name: 'Philidor Defense: Hanham',
    moves: '1. e4 e5 2. Nf3 d6 3. d4 Nf6 4. Nc3 Nbd7 5. Bc4 Be7 6. O-O O-O 7. a4 c6 8. Re1 b6 9. Ba2',
  },
  {
    name: 'Philidor Defense: Exchange, 3...Nd7',
    moves: '1. e4 e5 2. Nf3 d6 3. d4 Nd7 4. Bc4 c6 5. O-O Be7 6. dxe5 dxe5 7. Ng5 Bxg5 8. Qh5 Qe7 9. Bxg5',
  },
  {
    name: 'Latvian Gambit',
    moves: '1. e4 e5 2. Nf3 f5 3. Nxe5 Qf6 4. d4 d6 5. Nc4 fxe4 6. Nc3 Qg6 7. f3 exf3 8. Qxf3',
  },
  {
    name: 'Elephant Gambit',
    moves: '1. e4 e5 2. Nf3 d5 3. exd5 e4 4. Qe2 Nf6 5. d3 Qxd5 6. Nbd2 Be7 7. dxe4 Qe6 8. Nd4',
  },
  {
    name: "Damiano's Defense",
    moves: '1. e4 e5 2. Nf3 f6 3. Nxe5 fxe5 4. Qh5+ Ke7 5. Qxe5+ Kf7 6. Bc4+ d5 7. Bxd5+ Kg6 8. h4',
  },
  {
    name: 'Gunderam Defense',
    moves: '1. e4 e5 2. Nf3 Qe7 3. Nc3 Nf6 4. Bc4 c6 5. d4 d6 6. O-O',
  },
  {
    name: "Greco Defense (2...Qf6)",
    moves: '1. e4 e5 2. Nf3 Qf6 3. Nc3 c6 4. d4 exd4 5. Nxd4 Bc5 6. Be3',
  },

  // ─── 1...c5: Open Sicilian ────────────────────────────────────────────────
  {
    name: 'Sicilian Defense: Najdorf, English Attack',
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be3 e5 7. Nb3 Be6 8. f3 Be7 9. Qd2 O-O 10. O-O-O Nbd7 11. g4 b5 12. g5 b4 13. Ne2 Ne8 14. f4',
  },
  {
    name: 'Sicilian Defense: Najdorf, English Attack (6...e5 7.Nb3 Be6 8.f3 Nbd7)',
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be3 e5 7. Nb3 Be6 8. f3 Nbd7 9. g4 b5 10. g5 b4 11. Ne2 Nh5 12. Qd2',
  },
  {
    name: 'Sicilian Defense: Najdorf, English Attack (6...e5 7.Nb3 Be6 8.f3 h5)',
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be3 e5 7. Nb3 Be6 8. f3 h5 9. Qd2 Nbd7 10. O-O-O Be7 11. Kb1 Rc8 12. Nd5',
  },
  {
    name: 'Sicilian Defense: Scheveningen, English Attack',
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be3 e6 7. f3 b5 8. Qd2 Nbd7 9. g4 h6 10. O-O-O Bb7 11. h4 b4 12. Na4',
  },
  {
    name: 'Sicilian Defense: Scheveningen, English Attack (7...Be7)',
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be3 e6 7. f3 Be7 8. Qd2 O-O 9. O-O-O Nc6 10. g4 Nxd4 11. Bxd4 b5 12. g5',
  },
  {
    name: 'Sicilian Defense: Najdorf, 6.Be3 Ng4',
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be3 Ng4 7. Bg5 h6 8. Bh4 g5 9. Bg3 Bg7 10. h3 Ne5 11. f3 Nbc6 12. Bf2',
  },
  {
    name: 'Sicilian Defense: Najdorf, 6.Be3 e5 7.Nb3 Be7',
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be3 e5 7. Nb3 Be7 8. f3 Be6 9. Qd2 O-O 10. O-O-O',
  },
  {
    name: 'Sicilian Defense: Najdorf, 6.Be3 Nbd7',
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be3 Nbd7 7. f3 b5 8. Qd2 Bb7 9. g4 h6 10. O-O-O',
  },
  {
    name: 'Sicilian Defense: Najdorf, 6.Be3 Nc6',
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be3 Nc6 7. f3 e5 8. Nb3 Be6 9. Qd2 Be7 10. O-O-O O-O 11. g4',
  },
  {
    name: 'Sicilian Defense: Najdorf, 6.Be3 g6',
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be3 g6 7. f3 Bg7 8. Qd2 Nbd7 9. O-O-O O-O 10. g4 b5 11. h4',
  },
  {
    name: 'Sicilian Defense: Dragon, Yugoslav Attack',
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 g6 6. Be3 Bg7 7. f3 O-O 8. Qd2 Nc6 9. Bc4 Bd7 10. O-O-O Rc8 11. Bb3 Ne5 12. h4 Nc4 13. Bxc4 Rxc4 14. h5',
  },
  {
    name: 'Sicilian Defense: Dragon, Yugoslav Attack (9...Nxd4)',
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 g6 6. Be3 Bg7 7. f3 O-O 8. Qd2 Nc6 9. Bc4 Nxd4 10. Bxd4 Be6 11. Bb3 Qa5 12. O-O-O b5 13. Kb1',
  },
  {
    name: 'Sicilian Defense: Dragon, Yugoslav Attack (9...Bd7 10.O-O-O Qa5)',
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 g6 6. Be3 Bg7 7. f3 O-O 8. Qd2 Nc6 9. Bc4 Bd7 10. O-O-O Qa5 11. Bb3 Rfc8 12. h4 Ne5 13. Kb1',
  },
  {
    name: 'Sicilian Defense: Dragon, Yugoslav Attack (8...Nc6 9.Bc4 Qa5)',
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 g6 6. Be3 Bg7 7. f3 Nc6 8. Qd2 O-O 9. Bc4 Bd7 10. O-O-O Rc8 11. Bb3 Ne5 12. Kb1',
  },
  {
    name: 'Sicilian Defense: Dragon, Yugoslav Attack (7...a6)',
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 g6 6. Be3 Bg7 7. f3 a6 8. Qd2 Nbd7 9. O-O-O b5 10. g4 Nb6 11. h4',
  },
  {
    name: 'Sicilian Defense: Dragon, Yugoslav Attack (7...Nc6 8.Qd2 Bd7)',
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 g6 6. Be3 Bg7 7. f3 Nc6 8. Qd2 Bd7 9. O-O-O Rc8 10. g4 Ne5 11. h4 O-O 12. Kb1',
  },
  {
    name: 'Sicilian Defense: Dragon, 6.Be3 Ng4?!',
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 g6 6. Be3 Ng4 7. Bb5+ Bd7 8. Qxg4 Bxb5 9. Ndxb5 Qa5 10. Qd1',
  },
  {
    name: 'Sicilian Defense: Classical, English Attack treatment',
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Be3 e5 7. Nb3 Be6 8. f3 Be7 9. Qd2 O-O 10. O-O-O a5 11. Kb1 a4 12. Nc1',
  },
  {
    name: 'Sicilian Defense: Classical, 6.Be3 e6',
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Be3 e6 7. f3 Be7 8. Qd2 O-O 9. O-O-O a6 10. g4 Nxd4 11. Bxd4 b5 12. g5',
  },
  {
    name: 'Sicilian Defense: Classical, 6.Be3 Ng4',
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Be3 Ng4 7. Bb5 Nxe3 8. fxe3 Bd7 9. O-O e6 10. Qf3',
  },
  {
    name: 'Sicilian Defense: Classical, 6.Be3 a6',
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Be3 a6 7. f3 e5 8. Nb3 Be6 9. Qd2 Be7 10. O-O-O O-O 11. g4',
  },
  {
    name: 'Sicilian Defense: Classical, 6.Be3 g6 (Dragon by transposition)',
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Be3 g6 7. f3 Bg7 8. Qd2 O-O 9. Bc4 Bd7 10. O-O-O',
  },
  {
    name: 'Sicilian Defense: Sveshnikov',
    moves: '1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 e5 6. Ndb5 d6 7. Bg5 a6 8. Na3 b5 9. Nd5 Be7 10. Bxf6 Bxf6 11. c3 O-O 12. Nc2 Bg5 13. a4',
  },
  {
    name: 'Sicilian Defense: Sveshnikov, 9.Bxf6',
    moves: '1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 e5 6. Ndb5 d6 7. Bg5 a6 8. Na3 b5 9. Bxf6 gxf6 10. Nd5 f5 11. Bd3 Be6 12. O-O',
  },
  {
    name: 'Sicilian Defense: Sveshnikov, 7...Be6',
    moves: '1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 e5 6. Ndb5 d6 7. Bg5',
  },
  {
    name: 'Sicilian Defense: Kalashnikov',
    moves: '1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 e5 5. Nb5 d6 6. c4 Be7 7. N1c3 a6 8. Na3 Be6 9. Be2 Bg5 10. O-O Bxc1 11. Rxc1 Nf6 12. Nc2',
  },
  {
    name: 'Sicilian Defense: Lowenthal',
    moves: '1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 e5 5. Nb5 a6 6. Nd6+ Bxd6 7. Qxd6 Qf6 8. Qd1 Qg6 9. Nc3 Nge7 10. h4',
  },
  {
    name: 'Sicilian Defense: Accelerated Dragon, Maroczy Bind',
    moves: '1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 g6 5. c4 Nf6 6. Nc3 d6 7. Be2 Nxd4 8. Qxd4 Bg7 9. Bg5 O-O 10. Qd2 Be6 11. Rc1 Qa5 12. f3',
  },
  {
    name: 'Sicilian Defense: Accelerated Dragon, Maroczy Bind (5...Bg7)',
    moves: '1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 g6 5. c4 Bg7 6. Be3 Nf6 7. Nc3 O-O 8. Be2 d6 9. O-O Bd7 10. Qd2 Nxd4 11. Bxd4 Bc6 12. f3',
  },
  {
    name: 'Sicilian Defense: Accelerated Dragon, Maroczy Bind (5...Nf6 6.Nc3 Nxd4)',
    moves: '1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 g6 5. c4 Nf6 6. Nc3 Nxd4 7. Qxd4 d6 8. Be2 Bg7 9. Bg5 O-O 10. Qd2 Be6 11. O-O Qa5 12. Rab1',
  },
  {
    name: 'Sicilian Defense: Hyper-Accelerated Dragon',
    moves: '1. e4 c5 2. Nf3 g6 3. d4 cxd4 4. Nxd4 Nc6 5. c4 Nf6 6. Nc3 d6 7. Be2 Nxd4 8. Qxd4 Bg7 9. Bg5 O-O 10. Qd2 Be6 11. Rc1',
  },
  {
    name: 'Sicilian Defense: Hyper-Accelerated Dragon, 4...Bg7',
    moves: '1. e4 c5 2. Nf3 g6 3. d4 cxd4 4. Nxd4 Bg7 5. Nc3 Nc6 6. Be3 Nf6 7. Bc4 O-O 8. Bb3 d6 9. f3 Bd7 10. Qd2 Nxd4 11. Bxd4 b5 12. O-O-O',
  },
  {
    name: 'Sicilian Defense: Hyper-Accelerated Dragon, 4...Nf6',
    moves: '1. e4 c5 2. Nf3 g6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Be3 Bg7 7. Bc4 O-O 8. Bb3 d6 9. f3 Bd7 10. Qd2',
  },
  {
    name: 'Sicilian Defense: Taimanov, English Attack',
    moves: '1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4 Nc6 5. Nc3 Qc7 6. Be3 a6 7. Qd2 Nf6 8. O-O-O Be7 9. f3 O-O 10. g4 d6 11. g5 Nd7 12. h4',
  },
  {
    name: 'Sicilian Defense: Taimanov, English Attack (7...b5)',
    moves: '1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4 Nc6 5. Nc3 Qc7 6. Be3 a6 7. Qd2 b5 8. O-O-O Bb7 9. f3 Nf6 10. g4 Ne5 11. g5',
  },
  {
    name: 'Sicilian Defense: Taimanov, English Attack (7...Nf6 8.O-O-O Bb4)',
    moves: '1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4 Nc6 5. Nc3 Qc7 6. Be3 a6 7. Qd2 Nf6 8. O-O-O Bb4 9. f3 Ne5 10. Nb3 b5 11. Kb1 Rb8 12. Qe1',
  },
  {
    name: 'Sicilian Defense: Taimanov, 5...a6 6.Be3 Nf6',
    moves: '1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4 Nc6 5. Nc3 a6 6. Be3 Nf6 7. f3 Bb4 8. Qd2 d5 9. Nxc6 bxc6 10. O-O-O',
  },
  {
    name: 'Sicilian Defense: Taimanov, 5...a6 6.Be3 Qc7',
    moves: '1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4 Nc6 5. Nc3 a6 6. Be3 Qc7 7. Qd2 Nf6 8. O-O-O Be7 9. f3 O-O 10. g4',
  },
  {
    name: 'Sicilian Defense: Taimanov, 5...Nf6 (Four Knights)',
    moves: '1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4 Nc6 5. Nc3 Nf6 6. Ndb5 d6 7. Bf4 e5 8. Bg5 a6 9. Na3 b5 10. Nd5 Be7 11. Bxf6 Bxf6 12. c3',
  },
  {
    name: 'Sicilian Defense: Four Knights, 6.Ndb5 Bb4',
    moves: '1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4 Nc6 5. Nc3 Nf6 6. Ndb5 Bb4 7. a3 Bxc3+ 8. Nxc3 d5 9. exd5 exd5 10. Bd3 O-O 11. O-O d4 12. Ne2',
  },
  {
    name: 'Sicilian Defense: Taimanov, 5...d6 (Scheveningen)',
    moves: '1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4 Nc6 5. Nc3 d6 6. Be3 Nf6 7. f3 Be7 8. Qd2 O-O 9. O-O-O a6 10. g4',
  },
  {
    name: 'Sicilian Defense: Kan',
    moves: '1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4 a6 5. Nc3 Qc7 6. Be3 Nf6 7. Qd2 Bb4 8. f3 Nc6 9. O-O-O Ne5 10. Nb3',
  },
  {
    name: 'Sicilian Defense: Kan, 5...b5',
    moves: '1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4 a6 5. Nc3 b5 6. Bd3 Qb6 7. Nf3 Bc5 8. O-O Ne7 9. Be3',
  },
  {
    name: 'Sicilian Defense: Kan, 5...Nc6 (Taimanov)',
    moves: '1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4 a6 5. Nc3 Nc6 6. Be3 Qc7 7. Qd2 Nf6 8. O-O-O Be7 9. f3 O-O 10. g4',
  },
  {
    name: 'Sicilian Defense: Kan, 5...d6',
    moves: '1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4 a6 5. Nc3 d6 6. Be3 Nf6 7. f3 b5 8. Qd2 Nbd7 9. g4 Bb7 10. O-O-O',
  },
  {
    name: 'Sicilian Defense: Pin Variation',
    moves: '1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Bb4 6. e5 Nd5 7. Bd2 Nxc3 8. bxc3 Be7 9. Qg4 O-O 10. Bh6',
  },
  {
    name: 'Sicilian Defense: Scheveningen via 2...e6 Nf6 d6',
    moves: '1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 d6 6. Be3 a6 7. f3 Be7 8. Qd2 O-O 9. O-O-O Nc6 10. g4',
  },
  {
    name: 'Sicilian Defense: 2...d6 3.d4 Nf6',
    moves: '1. e4 c5 2. Nf3 d6 3. d4 Nf6 4. Nc3 cxd4 5. Nxd4 a6 6. Be3 e5 7. Nb3 Be6 8. f3',
  },
  {
    name: 'Sicilian Defense: 2...d6 3.d4 Nf6 4.Nc3 Nc6',
    moves: '1. e4 c5 2. Nf3 d6 3. d4 Nf6 4. Nc3 Nc6 5. d5 Nb8 6. Be2 e5 7. Nd2',
  },
  {
    name: 'Sicilian Defense: 4...Nf6 5.Nc3 Nbd7',
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nbd7 6. Be3 a6 7. f3 b5 8. Qd2 Bb7 9. g4',
  },
  {
    name: 'Sicilian Defense: 4...Nf6 5.Nc3 e5',
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 e5 6. Bb5+ Nbd7 7. Nf5 a6 8. Bxd7+ Bxd7 9. Bg5',
  },
  {
    name: 'Sicilian Defense: 4...Nf6 5.Nc3 Bd7',
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Bd7 6. Be3 Nc6 7. f3 e6 8. Qd2',
  },
  {
    name: 'Sicilian Defense: 4...Nf6 5.Nc3 e6 (Scheveningen)',
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 e6 6. Be3 a6 7. f3 b5 8. Qd2 Nbd7 9. g4 h6 10. O-O-O',
  },
  {
    name: 'Sicilian Defense: 4...Nf6 5.Nc3 e6 6.Be3 Be7',
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 e6 6. Be3 Be7 7. f3 O-O 8. Qd2 Nc6 9. O-O-O a6 10. g4',
  },
  {
    name: 'Sicilian Defense: 4...Nf6 5.Nc3 e6 6.Be3 Nc6',
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 e6 6. Be3 Nc6 7. f3 Be7 8. Qd2 O-O 9. O-O-O a6 10. g4',
  },
  {
    name: 'Sicilian Defense: 2...Nc6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 d6 (Classical)',
    moves: '1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 d6 6. Be3 e5 7. Nb3 Be6 8. f3 Be7 9. Qd2 O-O 10. O-O-O',
  },
  {
    name: 'Sicilian Defense: 2...Nc6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 e6',
    moves: '1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 e6 6. Ndb5 d6 7. Bf4 e5 8. Bg5 a6 9. Na3 b5 10. Nd5',
  },
  {
    name: 'Sicilian Defense: 2...Nc6 3.d4 cxd4 4.Nxd4 Qc7',
    moves: '1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 Qc7 5. Nc3 e6 6. Be3 a6 7. Qd2 Nf6 8. O-O-O',
  },
  {
    name: 'Sicilian Defense: 2...Nc6 3.d4 cxd4 4.Nxd4 Qb6',
    moves: '1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 Qb6 5. Nb3 Nf6 6. Nc3 e6 7. Be3 Qc7 8. f4',
  },
  {
    name: 'Sicilian Defense: 2...Nc6 3.d4 cxd4 4.Nxd4 d6',
    moves: '1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 d6 5. Nc3 Nf6 6. Be3 e5 7. Nb3 Be6 8. f3',
  },
  {
    name: 'Sicilian Defense: 2...Nc6 3.d4 cxd4 4.Nxd4 e6 (Taimanov)',
    moves: '1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 e6 5. Nc3 Qc7 6. Be3 a6 7. Qd2 Nf6 8. O-O-O Be7 9. f3 O-O 10. g4',
  },
  {
    name: 'Sicilian Defense: 2...Nc6 3.d4 d5?!',
    moves: '1. e4 c5 2. Nf3 Nc6 3. d4 d5 4. exd5 Qxd5 5. Nc3',
  },
  {
    name: 'Sicilian Defense: Nimzowitsch Variation',
    moves: '1. e4 c5 2. Nf3 Nf6 3. e5 Nd5 4. Nc3 Nxc3 5. dxc3 Nc6 6. Bf4 Qb6 7. Qd2 e6 8. O-O-O',
  },
  {
    name: 'Sicilian Defense: Nimzowitsch, 4...e6',
    moves: '1. e4 c5 2. Nf3 Nf6 3. e5 Nd5 4. Nc3 e6 5. Nxd5 exd5 6. d4 Nc6 7. dxc5 Bxc5 8. Qxd5 Qb6 9. Bc4 Bxf2+ 10. Ke2 O-O 11. Rf1',
  },
  {
    name: "Sicilian Defense: O'Kelly Variation",
    moves: '1. e4 c5 2. Nf3 a6 3. c3 d5 4. exd5 Qxd5 5. d4 Nf6 6. Be2 e6 7. O-O Nc6 8. Be3 cxd4 9. cxd4',
  },
  {
    name: "Sicilian Defense: O'Kelly, 3.c3 Nf6",
    moves: '1. e4 c5 2. Nf3 a6 3. c3 Nf6 4. e5 Nd5 5. d4 cxd4 6. cxd4 d6 7. Bc4 Nb6 8. Bb3 dxe5 9. Nxe5',
  },
  {
    name: "Sicilian Defense: O'Kelly, 3.c3 e6",
    moves: '1. e4 c5 2. Nf3 a6 3. c3 e6 4. d4 d5 5. e5 Nc6 6. Bd3 cxd4 7. cxd4 Qb6 8. Nc3',
  },
  {
    name: 'Sicilian Defense: 2...b6',
    moves: '1. e4 c5 2. Nf3 b6 3. d4 cxd4 4. Nxd4 Bb7 5. Nc3 a6 6. Bd3 e6 7. O-O Qc7 8. Qe2',
  },
  {
    name: 'Sicilian Defense: 2...Qc7',
    moves: '1. e4 c5 2. Nf3 Qc7 3. c3 Nf6 4. e5 Nd5 5. d4 cxd4 6. cxd4 e6 7. Nc3',
  },
  {
    name: 'Sicilian Defense: 2...Qa5?!',
    moves: '1. e4 c5 2. Nf3 Qa5 3. Nc3 Nc6 4. d4 cxd4 5. Nxd4 Nf6 6. Nb3 Qd8 7. Bg5',
  },
  {
    name: 'Sicilian Defense: 2...e5',
    moves: '1. e4 c5 2. Nf3 e5 3. Bc4 Nc6 4. d3 Nf6 5. Ng5 d5 6. exd5 Na5 7. Bb5+ Bd7 8. Bxd7+ Qxd7 9. Nc3',
  },
  {
    name: 'Sicilian Defense: 2...d5?!',
    moves: '1. e4 c5 2. Nf3 d5 3. exd5 Qxd5 4. Nc3 Qd8 5. d4 cxd4 6. Qxd4 Qxd4 7. Nxd4',
  },
  {
    name: 'Sicilian Defense: 2...h6?!',
    moves: '1. e4 c5 2. Nf3 h6 3. d4 cxd4 4. Nxd4 Nc6 5. Nc3 e6 6. Be3',
  },

  // ─── 1...e6: French Advance ──────────────────────────────────────────────
  {
    name: 'French Defense: Advance, 5...Qb6 6.a3',
    moves: '1. e4 e6 2. d4 d5 3. e5 c5 4. c3 Nc6 5. Nf3 Qb6 6. a3 c4 7. Nbd2 Na5 8. Be2 Bd7 9. O-O Ne7 10. Rb1 Nc8 11. g3',
  },
  {
    name: 'French Defense: Advance, 5...Qb6 6.a3 Nh6',
    moves: '1. e4 e6 2. d4 d5 3. e5 c5 4. c3 Nc6 5. Nf3 Qb6 6. a3 Nh6 7. b4 cxd4 8. cxd4 Nf5 9. Bb2 Be7 10. Bd3 Bd7 11. O-O',
  },
  {
    name: 'French Defense: Advance, 5...Qb6 6.a3 Bd7',
    moves: '1. e4 e6 2. d4 d5 3. e5 c5 4. c3 Nc6 5. Nf3 Qb6 6. a3 Bd7 7. b4 cxd4 8. cxd4 Rc8 9. Bb2 Nge7 10. Bd3 Nf5 11. O-O',
  },
  {
    name: 'French Defense: Advance, 5...Qb6 6.a3 a5',
    moves: '1. e4 e6 2. d4 d5 3. e5 c5 4. c3 Nc6 5. Nf3 Qb6 6. a3 a5 7. Bd3 Bd7 8. O-O cxd4 9. cxd4 Nxd4 10. Nxd4 Qxd4 11. Nc3',
  },
  {
    name: 'French Defense: Advance, 5...Bd7',
    moves: '1. e4 e6 2. d4 d5 3. e5 c5 4. c3 Nc6 5. Nf3 Bd7 6. a3 c4 7. Nbd2 Na5 8. Be2 Ne7 9. O-O Nc8 10. Rb1',
  },
  {
    name: 'French Defense: Advance, 5...Bd7 6.a3 f6',
    moves: '1. e4 e6 2. d4 d5 3. e5 c5 4. c3 Nc6 5. Nf3 Bd7 6. a3 f6 7. Bd3 Qc7 8. O-O cxd4 9. cxd4 Nxd4 10. Nxd4 Qxe5 11. Nf3',
  },
  {
    name: 'French Defense: Advance, 5...Nh6',
    moves: '1. e4 e6 2. d4 d5 3. e5 c5 4. c3 Nc6 5. Nf3 Nh6 6. Bd3 cxd4 7. cxd4 Nf5 8. Bxf5 exf5 9. Nc3 Be6 10. O-O',
  },
  {
    name: 'French Defense: Advance, 5...Nge7',
    moves: '1. e4 e6 2. d4 d5 3. e5 c5 4. c3 Nc6 5. Nf3 Nge7 6. Na3 cxd4 7. cxd4 Nf5 8. Nc2 Qb6 9. Bd3',
  },
  {
    name: 'French Defense: Advance, 5...Nge7 6.Na3 Nf5',
    moves: '1. e4 e6 2. d4 d5 3. e5 c5 4. c3 Nc6 5. Nf3 Nge7 6. Na3 Nf5 7. Nc2 Qb6 8. Bd3 cxd4 9. cxd4 Bb4+ 10. Kf1',
  },
  {
    name: 'French Defense: Advance, 5...f6',
    moves: '1. e4 e6 2. d4 d5 3. e5 c5 4. c3 Nc6 5. Nf3 f6 6. Bd3 fxe5 7. dxe5 Qc7 8. O-O Nxe5 9. Nxe5 Qxe5 10. Re1 Qd6 11. Qg4',
  },
  {
    name: 'French Defense: Advance, 4...Qb6',
    moves: '1. e4 e6 2. d4 d5 3. e5 c5 4. c3 Qb6 5. Nf3 Nc6 6. a3 c4 7. Nbd2 Na5 8. Be2 Bd7 9. O-O',
  },
  {
    name: 'French Defense: Advance, 4...Qb6 5.Nf3 Bd7',
    moves: '1. e4 e6 2. d4 d5 3. e5 c5 4. c3 Qb6 5. Nf3 Bd7 6. a3 Bb5 7. c4 Bxc4 8. Bxc4 dxc4 9. Nbd2',
  },
  {
    name: 'French Defense: Advance, 4...cxd4',
    moves: '1. e4 e6 2. d4 d5 3. e5 c5 4. c3 cxd4 5. cxd4 Nc6 6. Nf3 Qb6 7. Bd3 Bd7 8. O-O Nxd4 9. Nxd4 Qxd4 10. Nc3 Qxe5 11. Re1',
  },
  {
    name: 'French Defense: Advance, 4...Nc6 5.Nf3 Qb6 6.Bd3',
    weight: 1,
    moves: '1. e4 e6 2. d4 d5 3. e5 c5 4. c3 Nc6 5. Nf3 Qb6 6. Bd3 cxd4 7. cxd4 Bd7 8. O-O Nxd4 9. Nxd4 Qxd4 10. Nc3 a6 11. Qe2',
  },
  {
    name: 'French Defense: Advance, 4...Ne7',
    moves: '1. e4 e6 2. d4 d5 3. e5 c5 4. c3 Ne7 5. Nf3 Nec6 6. Bd3 Qb6 7. O-O',
  },
  {
    name: 'French Defense: Advance, 4...Bd7',
    moves: '1. e4 e6 2. d4 d5 3. e5 c5 4. c3 Bd7 5. Nf3 Qb6 6. a3 Nc6 7. b4 cxd4 8. cxd4 Rc8 9. Bb2',
  },
  {
    name: 'French Defense: Advance, 3...b6',
    moves: '1. e4 e6 2. d4 d5 3. e5 b6 4. c3 Qd7 5. Nf3 Ba6 6. Bxa6 Nxa6 7. O-O',
  },
  {
    name: 'French Defense: Advance, 3...Ne7',
    moves: '1. e4 e6 2. d4 d5 3. e5 Ne7 4. Nf3 c5 5. c3 Nec6 6. Bd3',
  },
  {
    name: 'French Defense: Advance, 3...Bd7',
    moves: '1. e4 e6 2. d4 d5 3. e5 Bd7 4. Nf3 c5 5. c3 Nc6 6. Bd3',
  },
  {
    name: 'French Defense: Advance, 3...c5 4.c3 Nc6 5.Nf3 cxd4',
    moves: '1. e4 e6 2. d4 d5 3. e5 c5 4. c3 Nc6 5. Nf3 cxd4 6. cxd4 Qb6 7. Bd3 Bd7 8. O-O',
  },
  {
    name: 'French Defense: 2...c5 (Franco-Benoni)',
    moves: '1. e4 e6 2. d4 c5 3. d5 exd5 4. exd5 d6 5. Nc3 Nf6 6. Nf3 Be7 7. Be2 O-O 8. O-O',
  },
  {
    name: 'French Defense: 2...c5 3.d5 e5',
    moves: '1. e4 e6 2. d4 c5 3. d5 e5 4. Nc3 d6 5. Nf3 Nf6 6. Be2 Be7 7. O-O',
  },
  {
    name: 'French Defense: 2...d6 (Reversed Philidor-ish)',
    moves: '1. e4 e6 2. d4 d6 3. Nc3 Nf6 4. Nf3 Be7 5. Bd3 O-O 6. O-O',
  },
  {
    name: 'French Defense: 2...Nf6',
    moves: '1. e4 e6 2. d4 Nf6 3. e5 Nd5 4. c4 Nb6 5. Nf3 d5 6. c5',
  },
  {
    name: 'French Defense: 2...b6 (Owen hybrid)',
    moves: '1. e4 e6 2. d4 b6 3. Nf3 Bb7 4. Bd3 Nf6 5. Qe2 c5 6. c3 Nc6 7. O-O',
  },
  {
    name: 'French Defense: 2...Nc6',
    moves: '1. e4 e6 2. d4 Nc6 3. Nf3 d5 4. e5 Nge7 5. c3 b6 6. Bd3',
  },

  // ─── 1...c6: Caro-Kann — Panov Attack (3) / Advance (1) ──────────────────
  {
    name: 'Caro-Kann Defense: Panov Attack, 5...e6 Main Line',
    weight: 3,
    moves: '1. e4 c6 2. d4 d5 3. exd5 cxd5 4. c4 Nf6 5. Nc3 e6 6. Nf3 Bb4 7. cxd5 Nxd5 8. Bd2 Nc6 9. Bd3 O-O 10. O-O Be7 11. Re1',
  },
  {
    name: 'Caro-Kann Defense: Panov Attack, 5...e6 6.Nf3 Be7',
    weight: 3,
    moves: '1. e4 c6 2. d4 d5 3. exd5 cxd5 4. c4 Nf6 5. Nc3 e6 6. Nf3 Be7 7. cxd5 Nxd5 8. Bd3 Nc6 9. O-O O-O 10. Re1 Nf6 11. a3',
  },
  {
    name: 'Caro-Kann Defense: Panov Attack, 5...e6 6.Nf3 Nc6',
    weight: 3,
    moves: '1. e4 c6 2. d4 d5 3. exd5 cxd5 4. c4 Nf6 5. Nc3 e6 6. Nf3 Nc6 7. c5 Be7 8. Bb5 O-O 9. O-O Ne4 10. Bxc6 bxc6 11. Ne5',
  },
  {
    name: 'Caro-Kann Defense: Panov Attack, 5...Nc6 6.Bg5',
    weight: 3,
    moves: '1. e4 c6 2. d4 d5 3. exd5 cxd5 4. c4 Nf6 5. Nc3 Nc6 6. Bg5 e6 7. Nf3 Be7 8. c5 O-O 9. Bb5 Ne4 10. Bxe7 Qxe7 11. O-O',
  },
  {
    name: 'Caro-Kann Defense: Panov Attack, 5...Nc6 6.Bg5 dxc4',
    weight: 3,
    moves: '1. e4 c6 2. d4 d5 3. exd5 cxd5 4. c4 Nf6 5. Nc3 Nc6 6. Bg5 dxc4 7. Bxc4 Qxd4 8. Qxd4 Nxd4 9. O-O-O e5 10. f4 Bg4 11. Nf3',
  },
  {
    name: 'Caro-Kann Defense: Panov Attack, 5...Nc6 6.Bg5 Be6',
    weight: 3,
    moves: '1. e4 c6 2. d4 d5 3. exd5 cxd5 4. c4 Nf6 5. Nc3 Nc6 6. Bg5 Be6 7. a3 Qd7 8. Nf3 Rd8 9. c5',
  },
  {
    name: 'Caro-Kann Defense: Panov Attack, 5...Nc6 6.Bg5 Qa5',
    weight: 3,
    moves: '1. e4 c6 2. d4 d5 3. exd5 cxd5 4. c4 Nf6 5. Nc3 Nc6 6. Bg5 Qa5 7. Bxf6 exf6 8. cxd5 Bb4 9. Qd2 Bxc3 10. bxc3 Qxd5 11. Nf3',
  },
  {
    name: 'Caro-Kann Defense: Panov Attack, 5...Nc6 6.Bg5 Qb6',
    weight: 3,
    moves: '1. e4 c6 2. d4 d5 3. exd5 cxd5 4. c4 Nf6 5. Nc3 Nc6 6. Bg5 Qb6 7. cxd5 Qxb2 8. Rc1 Nb4 9. Na4 Qxa2 10. Bc4 Bg4 11. Nf3',
  },
  {
    name: 'Caro-Kann Defense: Panov Attack, 5...g6',
    weight: 3,
    moves: '1. e4 c6 2. d4 d5 3. exd5 cxd5 4. c4 Nf6 5. Nc3 g6 6. Qb3 Bg7 7. cxd5 O-O 8. Be2 Nbd7 9. Bf3 Nb6 10. Nge2',
  },
  {
    name: 'Caro-Kann Defense: Panov Attack, 5...g6 6.Qb3 Bg7 7.cxd5 O-O 8.Be2 Na6',
    weight: 3,
    moves: '1. e4 c6 2. d4 d5 3. exd5 cxd5 4. c4 Nf6 5. Nc3 g6 6. Qb3 Bg7 7. cxd5 O-O 8. Be2 Na6 9. Bg5 Qb6 10. Qxb6 axb6 11. Nf3',
  },
  {
    name: 'Caro-Kann Defense: Panov Attack, 5...Be6',
    weight: 3,
    moves: '1. e4 c6 2. d4 d5 3. exd5 cxd5 4. c4 Nf6 5. Nc3 Be6 6. c5 g6 7. Bb5+ Nc6 8. Nge2 Bg7 9. O-O O-O 10. Bf4',
  },
  {
    name: 'Caro-Kann Defense: Panov Attack, 5...dxc4',
    weight: 3,
    moves: '1. e4 c6 2. d4 d5 3. exd5 cxd5 4. c4 Nf6 5. Nc3 dxc4 6. Bxc4 e6 7. Nf3 Be7 8. O-O O-O 9. Re1 Nc6 10. a3',
  },
  {
    name: 'Caro-Kann Defense: Panov Attack, 4...e6',
    weight: 3,
    moves: '1. e4 c6 2. d4 d5 3. exd5 cxd5 4. c4 e6 5. Nc3 Nf6 6. Nf3 Be7 7. cxd5 Nxd5 8. Bd3 Nc6 9. O-O O-O 10. Re1',
  },
  {
    name: 'Caro-Kann Defense: Panov Attack, 4...Nc6',
    weight: 3,
    moves: '1. e4 c6 2. d4 d5 3. exd5 cxd5 4. c4 Nc6 5. Nc3 Nf6 6. Bg5 e6 7. Nf3 Be7 8. c5',
  },
  {
    name: 'Caro-Kann Defense: Panov Attack, 4...dxc4',
    weight: 3,
    moves: '1. e4 c6 2. d4 d5 3. exd5 cxd5 4. c4 dxc4 5. Bxc4 Nf6 6. Nc3 e6 7. Nf3 Be7 8. O-O O-O 9. Re1',
  },
  {
    name: 'Caro-Kann Defense: Panov Attack, 3...Qxd5',
    weight: 3,
    moves: '1. e4 c6 2. d4 d5 3. exd5 Qxd5 4. Nc3 Qd8 5. Nf3 Nf6 6. Bc4 Bg4 7. h3 Bxf3 8. Qxf3 e6 9. O-O',
  },
  {
    name: 'Caro-Kann Defense: Panov Attack, 3...Nf6?!',
    weight: 3,
    moves: '1. e4 c6 2. d4 d5 3. exd5 Nf6 4. c4 cxd5 5. Nc3 e6 6. Nf3',
  },
  {
    name: 'Caro-Kann Defense: Advance, Short Variation',
    weight: 1,
    moves: '1. e4 c6 2. d4 d5 3. e5 Bf5 4. Nf3 e6 5. Be2 c5 6. Be3 Nd7 7. O-O Ne7 8. c4 dxc4 9. Na3 Nd5 10. Nxc4',
  },
  {
    name: 'Caro-Kann Defense: Advance, Short Variation (5...Nd7)',
    weight: 1,
    moves: '1. e4 c6 2. d4 d5 3. e5 Bf5 4. Nf3 e6 5. Be2 Nd7 6. O-O Bg6 7. Nbd2 Nh6 8. Nb3 Nf5 9. a4 Be7 10. a5',
  },
  {
    name: 'Caro-Kann Defense: Advance, Short Variation (5...c5 6.Be3 Qb6)',
    weight: 1,
    moves: '1. e4 c6 2. d4 d5 3. e5 Bf5 4. Nf3 e6 5. Be2 c5 6. Be3 Qb6 7. Nc3 Nc6 8. O-O Qxb2 9. Qe1 cxd4 10. Bxd4 Nxd4 11. Nxd4',
  },
  {
    name: 'Caro-Kann Defense: Advance, Short Variation (5...Ne7)',
    weight: 1,
    moves: '1. e4 c6 2. d4 d5 3. e5 Bf5 4. Nf3 e6 5. Be2 Ne7 6. O-O h6 7. Nbd2 Nd7 8. Nb3 g5 9. Ne1',
  },
  {
    name: 'Caro-Kann Defense: Advance, 3...c5',
    weight: 1,
    moves: '1. e4 c6 2. d4 d5 3. e5 c5 4. dxc5 Nc6 5. Nf3 Bg4 6. c3 e6 7. Be3 Nxe5 8. Nxe5 Bxd1 9. Bb5+',
  },
  {
    name: 'Caro-Kann Defense: Advance, 3...c5 4.dxc5 e6',
    weight: 1,
    moves: '1. e4 c6 2. d4 d5 3. e5 c5 4. dxc5 e6 5. Nf3 Bxc5 6. Bd3 Nc6 7. O-O Nge7 8. c3',
  },
  {
    name: 'Caro-Kann Defense: Advance, 3...Bf5 4.Nf3 e6 5.Be2 Nd7 6.O-O Bg6 7.c4',
    weight: 1,
    moves: '1. e4 c6 2. d4 d5 3. e5 Bf5 4. Nf3 e6 5. Be2 Nd7 6. O-O Bg6 7. c4 Ne7 8. Nc3 dxc4 9. Bxc4 Nb6 10. Bd3',
  },
  {
    name: 'Caro-Kann Defense: Advance, 3...Bf5 4.Nf3 e6 5.Be2 c5 6.Be3 cxd4',
    weight: 1,
    moves: '1. e4 c6 2. d4 d5 3. e5 Bf5 4. Nf3 e6 5. Be2 c5 6. Be3 cxd4 7. Nxd4 Ne7 8. Nd2 Nbc6 9. N2f3 Nxd4 10. Bxd4',
  },
  {
    name: 'Caro-Kann Defense: Advance, 3...Bf5 4.Nf3 e6 5.Be2 Bg6',
    weight: 1,
    moves: '1. e4 c6 2. d4 d5 3. e5 Bf5 4. Nf3 e6 5. Be2 Bg6 6. O-O Nd7 7. c3 c5 8. Nbd2 Rc8 9. Nb3',
  },
  {
    name: 'Caro-Kann Defense: Advance, 3...Bf5 4.Nf3 h6?!',
    weight: 1,
    moves: '1. e4 c6 2. d4 d5 3. e5 Bf5 4. Nf3 h6 5. Be2 e6 6. O-O Nd7 7. c4 Ne7 8. Nc3',
  },
  {
    name: 'Caro-Kann Defense: Advance, 3...Bf5 4.Nf3 Nd7',
    weight: 1,
    moves: '1. e4 c6 2. d4 d5 3. e5 Bf5 4. Nf3 Nd7 5. Be2 e6 6. O-O h6 7. c4 Ne7 8. Nc3 dxc4 9. Bxc4',
  },
  {
    name: 'Caro-Kann Defense: Advance, 3...Bf5 4.Nf3 Qb6',
    weight: 1,
    moves: '1. e4 c6 2. d4 d5 3. e5 Bf5 4. Nf3 Qb6 5. Be2 e6 6. O-O c5 7. c4 Nc6 8. Nc3 cxd4 9. Nxd4 Nxd4 10. Qxd4',
  },
  {
    name: 'Caro-Kann Defense: Advance, 3...g6',
    weight: 1,
    moves: '1. e4 c6 2. d4 d5 3. e5 g6 4. Nf3 Bg7 5. Be2 Nh6 6. c3 Bf5 7. O-O Nd7 8. Nbd2',
  },
  {
    name: 'Caro-Kann Defense: Advance, 3...Na6?!',
    weight: 1,
    moves: '1. e4 c6 2. d4 d5 3. e5 Na6 4. Nf3 Bg4 5. c3 e6 6. Bd3 Nc7 7. O-O',
  },
  {
    name: 'Caro-Kann Defense: Advance, 3...e6',
    weight: 1,
    moves: '1. e4 c6 2. d4 d5 3. e5 e6 4. Nf3 c5 5. c3 Nc6 6. Bd3 Qb6 7. O-O',
  },
  {
    name: 'Caro-Kann Defense: 2...e6 (French by transposition)',
    moves: '1. e4 c6 2. d4 e6 3. Nc3 d5 4. e5 c5 5. Nf3 Nc6 6. Bb5',
  },
  {
    name: 'Caro-Kann Defense: 2...g6 (Modern)',
    moves: '1. e4 c6 2. d4 g6 3. Nc3 d5 4. e5 Bg7 5. f4 h5 6. Nf3 Bg4 7. Be2',
  },
  {
    name: 'Caro-Kann Defense: 2...Nf6?!',
    moves: '1. e4 c6 2. d4 Nf6 3. e5 Nd5 4. c4 Nb6 5. Nc3 d6 6. exd6 exd6 7. Nf3',
  },

  // ─── Everything else after 1.e4 ──────────────────────────────────────────
  {
    name: 'Scandinavian Defense: 2...Qxd5 3.Nc3 Qa5',
    moves: '1. e4 d5 2. exd5 Qxd5 3. Nc3 Qa5 4. d4 Nf6 5. Nf3 c6 6. Bc4 Bf5 7. Bd2 e6 8. Qe2 Bb4 9. O-O-O Nbd7 10. a3',
  },
  {
    name: 'Scandinavian Defense: 2...Qxd5 3.Nc3 Qa5 4.d4 c6',
    moves: '1. e4 d5 2. exd5 Qxd5 3. Nc3 Qa5 4. d4 c6 5. Nf3 Bf5 6. Bc4 e6 7. Bd2 Bb4 8. Qe2 Nf6 9. O-O-O',
  },
  {
    name: 'Scandinavian Defense: 2...Qxd5 3.Nc3 Qd6',
    moves: '1. e4 d5 2. exd5 Qxd5 3. Nc3 Qd6 4. d4 Nf6 5. Nf3 a6 6. g3 Bg4 7. Bg2 Nc6 8. O-O O-O-O 9. Be3',
  },
  {
    name: 'Scandinavian Defense: 2...Qxd5 3.Nc3 Qd6 4.d4 c6',
    moves: '1. e4 d5 2. exd5 Qxd5 3. Nc3 Qd6 4. d4 c6 5. Nf3 Nf6 6. Ne5 Nbd7 7. Nc4 Qc7 8. Qf3',
  },
  {
    name: 'Scandinavian Defense: 2...Qxd5 3.Nc3 Qd8',
    moves: '1. e4 d5 2. exd5 Qxd5 3. Nc3 Qd8 4. d4 Nf6 5. Nf3 Bg4 6. h3 Bxf3 7. Qxf3 c6 8. Be3 e6 9. O-O-O',
  },
  {
    name: 'Scandinavian Defense: 2...Qxd5 3.Nc3 Qe5+',
    moves: '1. e4 d5 2. exd5 Qxd5 3. Nc3 Qe5+ 4. Be2 c6 5. Nf3 Qc7 6. d4 Nf6 7. O-O',
  },
  {
    name: 'Scandinavian Defense: 2...Qxd5 3.Nc3 Qe6+?!',
    moves: '1. e4 d5 2. exd5 Qxd5 3. Nc3 Qe6+ 4. Be2 Nf6 5. Nf3 c6 6. O-O',
  },
  {
    name: 'Scandinavian Defense: Modern (2...Nf6)',
    moves: '1. e4 d5 2. exd5 Nf6 3. d4 Nxd5 4. Nf3 Bg4 5. Be2 e6 6. O-O Nc6 7. c4 Nb6 8. Nc3 Be7 9. d5',
  },
  {
    name: 'Scandinavian Defense: Modern, 3...Bg4',
    moves: '1. e4 d5 2. exd5 Nf6 3. d4 Bg4 4. f3 Bf5 5. Bb5+ Nbd7 6. c4 e6 7. dxe6 Bxe6 8. d5',
  },
  {
    name: 'Scandinavian Defense: Modern, 3...Nxd5 4.c4',
    weight: 1,
    moves: '1. e4 d5 2. exd5 Nf6 3. d4 Nxd5 4. c4 Nb6 5. Nf3 Bg4 6. c5 N6d7 7. Bc4 e6 8. Nc3',
  },
  {
    name: 'Scandinavian Defense: Icelandic Gambit declined',
    moves: '1. e4 d5 2. exd5 Nf6 3. d4 e6 4. dxe6 Bxe6 5. Nf3 Qe7 6. Be2 Nc6 7. O-O O-O-O 8. c3',
  },
  {
    name: 'Scandinavian Defense: Portuguese Gambit',
    moves: '1. e4 d5 2. exd5 Nf6 3. d4 Bg4 4. f3 Bf5 5. c4 e6 6. dxe6 Nc6 7. exf7+ Kxf7 8. Be3',
  },
  {
    name: "Alekhine's Defense: Modern, 4...Bg4",
    moves: '1. e4 Nf6 2. e5 Nd5 3. d4 d6 4. Nf3 Bg4 5. Be2 e6 6. O-O Be7 7. c4 Nb6 8. Nc3 O-O 9. Be3 d5 10. c5',
  },
  {
    name: "Alekhine's Defense: Modern, 4...Bg4 5.Be2 c6",
    moves: '1. e4 Nf6 2. e5 Nd5 3. d4 d6 4. Nf3 Bg4 5. Be2 c6 6. O-O Bxf3 7. Bxf3 dxe5 8. dxe5 e6 9. Qe2 Nd7 10. c4',
  },
  {
    name: "Alekhine's Defense: Modern, 4...dxe5",
    moves: '1. e4 Nf6 2. e5 Nd5 3. d4 d6 4. Nf3 dxe5 5. Nxe5 c6 6. Be2 Bf5 7. O-O Nd7 8. Nf3 e6 9. c4 N5f6 10. Nc3',
  },
  {
    name: "Alekhine's Defense: Modern, 4...dxe5 5.Nxe5 g6",
    moves: '1. e4 Nf6 2. e5 Nd5 3. d4 d6 4. Nf3 dxe5 5. Nxe5 g6 6. Bc4 c6 7. O-O Bg7 8. Re1 O-O 9. Bb3 Nd7 10. Nf3',
  },
  {
    name: "Alekhine's Defense: Modern, 4...g6",
    moves: '1. e4 Nf6 2. e5 Nd5 3. d4 d6 4. Nf3 g6 5. Bc4 Nb6 6. Bb3 Bg7 7. Ng5 d5 8. f4 Nc6 9. c3 f6 10. Nf3',
  },
  {
    name: "Alekhine's Defense: Modern, 4...g6 5.Bc4 Nb6 6.Bb3 Bg7 7.Ng5 e6",
    moves: '1. e4 Nf6 2. e5 Nd5 3. d4 d6 4. Nf3 g6 5. Bc4 Nb6 6. Bb3 Bg7 7. Ng5 e6 8. Qf3 Qe7 9. Ne4 dxe5 10. Bg5 Qb4+ 11. c3',
  },
  {
    name: "Alekhine's Defense: Modern, 4...Nc6",
    moves: '1. e4 Nf6 2. e5 Nd5 3. d4 d6 4. Nf3 Nc6 5. c4 Nb6 6. e6 fxe6 7. Nc3 g6 8. h4 Bg7 9. Be3',
  },
  {
    name: "Alekhine's Defense: Modern, 4...Nb6",
    moves: '1. e4 Nf6 2. e5 Nd5 3. d4 d6 4. Nf3 Nb6 5. a4 Bg4 6. Be2 dxe5 7. Nxe5 Bxe2 8. Qxe2 Nc6 9. Nxc6 bxc6 10. O-O',
  },
  {
    name: "Alekhine's Defense: Modern, 4...c6",
    moves: '1. e4 Nf6 2. e5 Nd5 3. d4 d6 4. Nf3 c6 5. Be2 Bg4 6. Ng5 Bxe2 7. Qxe2 dxe5 8. dxe5 e6 9. O-O Nd7 10. c4',
  },
  {
    name: "Alekhine's Defense: 3...Nb6",
    moves: '1. e4 Nf6 2. e5 Nd5 3. d4 Nb6 4. Nf3 d6 5. a4 Bg4 6. Be2 dxe5 7. Nxe5 Bxe2 8. Qxe2 Nc6 9. Nxc6 bxc6 10. O-O',
  },
  {
    name: "Alekhine's Defense: 3...e6",
    moves: '1. e4 Nf6 2. e5 Nd5 3. d4 e6 4. Nf3 d6 5. c4 Nb6 6. exd6 cxd6 7. Nc3 Be7 8. Bd3 O-O 9. O-O Nc6 10. b3',
  },
  {
    name: "Alekhine's Defense: 3...c5?!",
    moves: '1. e4 Nf6 2. e5 Nd5 3. d4 c5 4. c4 Nb6 5. d5 e6 6. Nc3 exd5 7. cxd5 d6 8. Nf3 dxe5 9. Nxe5',
  },
  {
    name: "Alekhine's Defense: 3...d6 4.Nf3 Bf5",
    moves: '1. e4 Nf6 2. e5 Nd5 3. d4 d6 4. Nf3 Bf5 5. Bd3 Bxd3 6. Qxd3 e6 7. O-O Nc6 8. c4 Nb6 9. exd6 cxd6 10. Nc3',
  },
  {
    name: "Alekhine's Defense: 2...Ne4?!",
    moves: '1. e4 Nf6 2. e5 Ne4 3. d3 Nc5 4. d4 Nca6 5. Nf3 d6 6. Bxa6 Nxa6 7. O-O',
  },
  {
    name: "Alekhine's Defense: 2...Ng8?!",
    moves: '1. e4 Nf6 2. e5 Ng8 3. d4 d6 4. Nf3 Bg4 5. Bc4 e6 6. h3 Bh5 7. Nc3',
  },
  {
    name: 'Pirc Defense: Classical',
    moves: '1. e4 d6 2. d4 Nf6 3. Nc3 g6 4. Nf3 Bg7 5. Be2 O-O 6. O-O c6 7. a4 Nbd7 8. h3 e5 9. dxe5 dxe5 10. Be3',
  },
  {
    name: 'Pirc Defense: Classical, 6...Nc6',
    moves: '1. e4 d6 2. d4 Nf6 3. Nc3 g6 4. Nf3 Bg7 5. Be2 O-O 6. O-O Nc6 7. d5 Nb8 8. Re1 e5 9. Bg5',
  },
  {
    name: 'Pirc Defense: Classical, 6...Bg4',
    moves: '1. e4 d6 2. d4 Nf6 3. Nc3 g6 4. Nf3 Bg7 5. Be2 O-O 6. O-O Bg4 7. Be3 Nc6 8. Qd2 e5 9. d5 Nd4 10. Nxd4 exd4 11. Bxd4 Bxe2 12. Nxe2',
  },
  {
    name: 'Pirc Defense: Classical, 6...a6',
    moves: '1. e4 d6 2. d4 Nf6 3. Nc3 g6 4. Nf3 Bg7 5. Be2 O-O 6. O-O a6 7. a4 b6 8. Re1 Bb7 9. Bf4 Nbd7 10. Qd2',
  },
  {
    name: 'Pirc Defense: Classical, 5...c6',
    moves: '1. e4 d6 2. d4 Nf6 3. Nc3 g6 4. Nf3 Bg7 5. Be2 c6 6. O-O O-O 7. a4 Nbd7 8. h3 e5 9. dxe5 dxe5 10. Be3',
  },
  {
    name: 'Pirc Defense: 3...c6',
    moves: '1. e4 d6 2. d4 Nf6 3. Nc3 c6 4. f4 Qa5 5. Bd3 e5 6. Nf3 Bg4 7. Be3',
  },
  {
    name: 'Pirc Defense: 3...e5',
    moves: '1. e4 d6 2. d4 Nf6 3. Nc3 e5 4. Nf3 Nbd7 5. Bc4 Be7 6. O-O O-O 7. a4 c6 8. Re1',
  },
  {
    name: 'Pirc Defense: 3...Nbd7',
    moves: '1. e4 d6 2. d4 Nf6 3. Nc3 Nbd7 4. Nf3 e5 5. Bc4 Be7 6. O-O O-O 7. a4 c6 8. Re1',
  },
  {
    name: 'Pirc Defense: 2...g6 move order',
    moves: '1. e4 d6 2. d4 g6 3. Nc3 Bg7 4. Nf3 Nf6 5. Be2 O-O 6. O-O c6 7. a4 Nbd7 8. h3',
  },
  {
    name: 'Pirc Defense: 2...e5 (Philidor by transposition)',
    moves: '1. e4 d6 2. d4 e5 3. Nf3 exd4 4. Nxd4 Nf6 5. Nc3 Be7 6. Be2 O-O 7. O-O c6 8. a4',
  },
  {
    name: 'Pirc Defense: 2...e5 3.Nf3 Nd7 (Hanham)',
    moves: '1. e4 d6 2. d4 e5 3. Nf3 Nd7 4. Bc4 c6 5. O-O Be7 6. a4 Ngf6 7. Re1 O-O 8. h3',
  },
  {
    name: 'Pirc Defense: 2...e5 3.Nf3 Nf6',
    moves: '1. e4 d6 2. d4 e5 3. Nf3 Nf6 4. Nc3 Nbd7 5. Bc4 Be7 6. O-O O-O 7. a4 c6 8. Re1',
  },
  {
    name: 'Pirc Defense: 2...c6',
    moves: '1. e4 d6 2. d4 c6 3. Nc3 Nf6 4. f4 Qa5 5. Bd3 e5 6. Nf3 Bg4 7. Be3',
  },
  {
    name: 'Pirc Defense: 2...Nd7',
    moves: '1. e4 d6 2. d4 Nd7 3. Nc3 e5 4. Nf3 Ngf6 5. Bc4 Be7 6. O-O O-O 7. a4 c6 8. Re1',
  },
  {
    name: 'Pirc Defense: 2...c5 (Sicilian-ish)',
    moves: '1. e4 d6 2. d4 c5 3. Nf3 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be3 e5 7. Nb3 Be6 8. f3',
  },
  {
    name: 'Modern Defense: 3.Nc3 d6 4.Nf3',
    moves: '1. e4 g6 2. d4 Bg7 3. Nc3 d6 4. Nf3 Nf6 5. Be2 O-O 6. O-O c6 7. a4 Nbd7 8. h3',
  },
  {
    name: 'Modern Defense: 3.Nc3 d6 4.Nf3 a6',
    moves: '1. e4 g6 2. d4 Bg7 3. Nc3 d6 4. Nf3 a6 5. Be2 b5 6. O-O Nd7 7. a4 b4 8. Nd5 Bb7 9. c3',
  },
  {
    name: 'Modern Defense: 3.Nc3 d6 4.Nf3 Nd7',
    moves: '1. e4 g6 2. d4 Bg7 3. Nc3 d6 4. Nf3 Nd7 5. Bc4 e6 6. O-O Ne7 7. Re1 O-O 8. Bg5',
  },
  {
    name: 'Modern Defense: 3.Nc3 d6 4.Nf3 c6',
    moves: '1. e4 g6 2. d4 Bg7 3. Nc3 d6 4. Nf3 c6 5. Be2 Nf6 6. O-O O-O 7. a4 Nbd7 8. h3',
  },
  {
    name: 'Modern Defense: 3.Nc3 d6 4.Nf3 Bg4',
    moves: '1. e4 g6 2. d4 Bg7 3. Nc3 d6 4. Nf3 Bg4 5. Be3 Nc6 6. Bb5 a6 7. Bxc6+ bxc6 8. h3',
  },
  {
    name: 'Modern Defense: 3.Nc3 c6',
    moves: '1. e4 g6 2. d4 Bg7 3. Nc3 c6 4. Nf3 d5 5. h3 Nf6 6. Bd3 dxe4 7. Nxe4 Nxe4 8. Bxe4',
  },
  {
    name: 'Modern Defense: 3.Nc3 c6 4.Nf3 d6',
    moves: '1. e4 g6 2. d4 Bg7 3. Nc3 c6 4. Nf3 d6 5. Be2 Nf6 6. O-O O-O 7. a4',
  },
  {
    name: 'Modern Defense: 3.Nc3 c5',
    moves: '1. e4 g6 2. d4 Bg7 3. Nc3 c5 4. dxc5 Qa5 5. Bd2 Qxc5 6. Nd5 Na6 7. Nf3',
  },
  {
    name: 'Modern Defense: 3.Nc3 a6',
    moves: '1. e4 g6 2. d4 Bg7 3. Nc3 a6 4. Nf3 d6 5. Be2 b5 6. O-O Nd7 7. a4 b4 8. Nd5',
  },
  {
    name: 'Modern Defense: 3.Nc3 Nc6?!',
    moves: '1. e4 g6 2. d4 Bg7 3. Nc3 Nc6 4. Be3 d6 5. Qd2 Nf6 6. f3 O-O 7. O-O-O',
  },
  {
    name: 'Modern Defense: 3.Nc3 d5?!',
    moves: '1. e4 g6 2. d4 Bg7 3. Nc3 d5 4. exd5 Nf6 5. Bc4 O-O 6. Nge2',
  },
  {
    name: 'Modern Defense: 2...d6',
    moves: '1. e4 g6 2. d4 d6 3. Nc3 Bg7 4. Nf3 Nf6 5. Be2 O-O 6. O-O c6 7. a4',
  },
  {
    name: 'Modern Defense: 2...Nf6?!',
    moves: '1. e4 g6 2. d4 Nf6 3. e5 Nh5 4. Be2 d6 5. Bxh5 gxh5 6. Qxh5 dxe5 7. Qxe5',
  },
  {
    name: 'Modern Defense: 2...c6',
    moves: '1. e4 g6 2. d4 c6 3. Nc3 d5 4. e5 Bg7 5. f4 h5 6. Nf3 Bg4 7. Be2',
  },
  {
    name: 'Nimzowitsch Defense: 2.d4 d5',
    moves: '1. e4 Nc6 2. d4 d5 3. Nc3 dxe4 4. d5 Ne5 5. Bf4 Ng6 6. Bg3 Nf6 7. Qd4',
  },
  {
    name: 'Nimzowitsch Defense: 2.d4 d5 3.Nc3 e6',
    moves: '1. e4 Nc6 2. d4 d5 3. Nc3 e6 4. Nf3 Bb4 5. e5 Nge7 6. Bd2 O-O 7. Bd3',
  },
  {
    name: 'Nimzowitsch Defense: 2.d4 e5',
    moves: '1. e4 Nc6 2. d4 e5 3. Nf3 exd4 4. Nxd4 Nf6 5. Nxc6 bxc6 6. e5 Qe7 7. Qe2',
  },
  {
    name: 'Nimzowitsch Defense: 2.d4 e5 3.Nf3 Bb4+?!',
    moves: '1. e4 Nc6 2. d4 e5 3. Nf3 Bb4+ 4. c3 Ba5 5. d5 Nce7 6. Nxe5 d6 7. Qa4+ c6 8. dxc6',
  },
  {
    name: 'Nimzowitsch Defense: 2.d4 e6',
    moves: '1. e4 Nc6 2. d4 e6 3. Nf3 d5 4. e5 Nge7 5. c3 b6 6. Bd3',
  },
  {
    name: 'Nimzowitsch Defense: 2.d4 d6',
    moves: '1. e4 Nc6 2. d4 d6 3. Nc3 Nf6 4. Nf3 Bg4 5. Be3 e6 6. h3 Bh5 7. d5',
  },
  {
    name: 'Nimzowitsch Defense: 2.d4 Nf6',
    moves: '1. e4 Nc6 2. d4 Nf6 3. e5 Nd5 4. c4 Nb6 5. Nf3 d6 6. exd6 exd6 7. Nc3',
  },
  {
    name: 'Nimzowitsch Defense: 2.d4 g6',
    moves: '1. e4 Nc6 2. d4 g6 3. Nf3 Bg7 4. c3 d6 5. Bd3 Nf6 6. O-O',
  },
  {
    name: 'Owen Defense',
    moves: '1. e4 b6 2. d4 Bb7 3. Bd3 e6 4. Nf3 c5 5. c3 Nf6 6. Qe2 Nc6 7. O-O Be7 8. Nbd2',
  },
  {
    name: 'Owen Defense: 3...Nf6',
    moves: '1. e4 b6 2. d4 Bb7 3. Bd3 Nf6 4. Qe2 e6 5. Nf3 c5 6. c3 Nc6 7. O-O',
  },
  {
    name: 'Owen Defense: 3...f5?!',
    moves: '1. e4 b6 2. d4 Bb7 3. Bd3 f5 4. exf5 Bxg2 5. Qh5+ g6 6. fxg6 Nf6 7. gxh7+ Nxh5 8. Bg6+',
  },
  {
    name: 'Owen Defense: 3...g6',
    moves: '1. e4 b6 2. d4 Bb7 3. Bd3 g6 4. Nf3 Bg7 5. O-O e6 6. c3 Nf6 7. Qe2',
  },
  {
    name: 'St. George Defense',
    moves: '1. e4 a6 2. d4 b5 3. Nf3 Bb7 4. Bd3 e6 5. O-O Nf6 6. Qe2 c5 7. c3',
  },
  {
    name: 'St. George Defense: 2...e6',
    moves: '1. e4 a6 2. d4 e6 3. Nf3 b5 4. Bd3 c5 5. c3 Bb7 6. O-O Nf6 7. Qe2',
  },
  {
    name: 'Borg Defense (1...g5?!)',
    moves: '1. e4 g5 2. d4 Bg7 3. Nc3 h6 4. h4 g4 5. Be3 d6 6. Qd2',
  },
  {
    name: 'Duras Gambit (1...f5?!)',
    moves: '1. e4 f5 2. exf5 Nf6 3. d4 d5 4. Bd3 c5 5. c3 Nc6 6. Nf3',
  },
  {
    name: 'Barnes Defense (1...f6?!)',
    moves: '1. e4 f6 2. d4 e6 3. Nf3 d5 4. e5 c5 5. c3 Nc6 6. Bd3',
  },
  {
    name: 'Carr Defense (1...h6?!)',
    moves: '1. e4 h6 2. d4 e6 3. Nf3 d5 4. e5 c5 5. c3 Nc6 6. Bd3',
  },
  {
    name: 'Goldsmith Defense (1...h5?!)',
    moves: '1. e4 h5 2. d4 e6 3. Nf3 d5 4. e5 c5 5. c3 Nc6 6. Bd3',
  },
  {
    name: 'Ware Defense (1...a5?!)',
    moves: '1. e4 a5 2. d4 e6 3. Nf3 d5 4. e5 c5 5. c3 Nc6 6. Bd3',
  },
  {
    name: 'Hippopotamus-ish (1...b6 2.d4 e6)',
    moves: '1. e4 e6 2. d4 b6 3. Bd3 Bb7 4. Nf3 Nf6 5. Qe2 c5 6. c3 Nc6 7. O-O',
  },
  {
    name: "Lemming Defense (1...Na6?!)",
    moves: '1. e4 Na6 2. d4 d6 3. Nc3 e5 4. Nf3 Nf6 5. Bc4 Be7 6. O-O',
  },
  {
    name: 'Adams Defense (1...Nh6?!)',
    moves: '1. e4 Nh6 2. d4 e6 3. Nf3 d5 4. Bd3 c5 5. c3 Nc6 6. O-O',
  },
  {
    name: 'Fred Defense (1...f5 2.exf5 Kf7?!)',
    moves: '1. e4 f5 2. exf5 Kf7 3. d4 Nf6 4. Nf3 d5 5. Bd3 Qd6 6. O-O',
  },
];
