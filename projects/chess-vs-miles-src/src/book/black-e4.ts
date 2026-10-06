/**
 * Miles with the black pieces against 1.e4: the Sicilian, every single time.
 *
 *   Open Sicilian   Najdorf (weight 3), Classical (2), Hyper-Accelerated Dragon (2)
 *   Anti-Sicilians  one solid answer each; the engine takes it from there
 *
 * Forks are at Black's second and fifth moves: 2...d6 leads to the Najdorf or
 * the Classical, 2...g6 is the Hyper-Accelerated Dragon, 2...Nc6 is the
 * Classical move order that sidesteps nothing but is comfortable.
 */
import type { Line } from './types';

const SIC = 'Sicilian Defense';
const NAJ = `${SIC}: Najdorf Variation`;

const W_NAJ = 3;

export const BLACK_E4_LINES: Line[] = [
  {
    name: `${NAJ}, English Attack`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be3 e5 7. Nb3 Be6 8. f3 Be7 9. Qd2 O-O 10. O-O-O Nbd7 11. g4 b5 12. g5 b4 13. Ne2 Ne8 14. f4 a5',
  },
  {
    name: `${NAJ}, English Attack (8.f3 Nbd7)`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be3 e5 7. Nb3 Be6 8. f3 Nbd7 9. g4 b5 10. g5 b4 11. Ne2 Nh5 12. Qd2 Be7 13. O-O-O Rc8',
  },
  {
    name: `${NAJ}, English Attack (8.Qd2)`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be3 e5 7. Nb3 Be6 8. Qd2 Nbd7 9. f3 Be7 10. O-O-O O-O 11. g4 b5 12. g5 b4',
  },
  {
    name: `${NAJ}, English Attack (7.Nf3)`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be3 e5 7. Nf3 Be7 8. Bc4 O-O 9. O-O Be6 10. Bb3 Nc6 11. Qe2 Rc8',
  },
  {
    name: `${NAJ}, English Attack (7.Nb3 Be6 8.f3 Be7 9.Qd2 Nbd7)`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be3 e5 7. Nb3 Be6 8. f3 Be7 9. Qd2 Nbd7 10. g4 h6 11. O-O-O b5 12. h4 Nb6',
  },
  {
    name: `${NAJ}, English Attack (8.f3 Be7 9.g4)`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be3 e5 7. Nb3 Be6 8. f3 Be7 9. g4 O-O 10. g5 Nfd7 11. h4 b5 12. Qd2 Nb6',
  },
  {
    name: `${NAJ}, English Attack (7.Nde2)`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be3 e5 7. Nde2 Be7 8. f3 O-O 9. Qd2 Be6 10. O-O-O Nbd7 11. g4 b5',
  },
  {
    name: `${NAJ}, English Attack (7.Nb3 Be6 8.Qd2 Be7 9.f3 O-O 10.O-O-O a5)`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be3 e5 7. Nb3 Be6 8. Qd2 Be7 9. f3 O-O 10. O-O-O a5 11. Kb1 a4 12. Nc1 Nbd7',
  },
  {
    name: `${NAJ}, 6.Bg5 (Classical Bg5, 6...e6 7.f4 Be7)`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bg5 e6 7. f4 Be7 8. Qf3 Qc7 9. O-O-O Nbd7 10. g4 b5 11. Bxf6 Nxf6 12. g5 Nd7 13. f5 Nc5',
  },
  {
    name: `${NAJ}, 6.Bg5 e6 7.f4 Be7 8.Qf3 Qc7 9.O-O-O Nbd7 10.Bd3`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bg5 e6 7. f4 Be7 8. Qf3 Qc7 9. O-O-O Nbd7 10. Bd3 b5 11. Rhe1 Bb7 12. Qg3 b4',
  },
  {
    name: `${NAJ}, 6.Bg5 e6 7.f4 Be7 8.Qf3 Qc7 9.O-O-O Nbd7 10.Be2`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bg5 e6 7. f4 Be7 8. Qf3 Qc7 9. O-O-O Nbd7 10. Be2 b5 11. Bxf6 Nxf6 12. e5 Bb7',
  },
  {
    name: `${NAJ}, 6.Bg5 e6 7.f4 Be7 8.Qf3 h6`,
    weight: 1,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bg5 e6 7. f4 Be7 8. Qf3 h6 9. Bh4 Qc7 10. O-O-O Nbd7 11. Be2 g5',
  },
  {
    name: `${NAJ}, 6.Bg5 e6 7.f4 Be7 8.Qf3 Qc7 9.O-O-O Nbd7 10.Qg3`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bg5 e6 7. f4 Be7 8. Qf3 Qc7 9. O-O-O Nbd7 10. Qg3 b5 11. Bxf6 Nxf6 12. e5 Nd7',
  },
  {
    name: `${NAJ}, 6.Bg5 e6 7.f4 Be7 8.Qf3 Qc7 9.O-O-O Nbd7 10.g4 b5 11.Bxf6 Nxf6 12.g5 Nd7 13.a3`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bg5 e6 7. f4 Be7 8. Qf3 Qc7 9. O-O-O Nbd7 10. g4 b5 11. Bxf6 Nxf6 12. g5 Nd7 13. a3 Rb8 14. h4 b4',
  },
  {
    name: `${NAJ}, 6.Bg5 e6 7.f4 Be7 8.Qf3 Qc7 9.O-O-O Nbd7 10.Bd3 b5 11.Rhe1 Bb7 12.Nd5`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bg5 e6 7. f4 Be7 8. Qf3 Qc7 9. O-O-O Nbd7 10. Bd3 b5 11. Rhe1 Bb7 12. Nd5 exd5 13. exd5 Kd8',
  },
  {
    name: `${NAJ}, 6.Bg5 e6 7.f4 Be7 8.Qf3 Qc7 9.O-O-O Nbd7 10.Bd3 b5 11.Rhe1 Bb7 12.Qh3`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bg5 e6 7. f4 Be7 8. Qf3 Qc7 9. O-O-O Nbd7 10. Bd3 b5 11. Rhe1 Bb7 12. Qh3 b4 13. Nd5 exd5 14. exd5 Nc5',
  },
  {
    name: `${NAJ}, 6.Bg5 e6 7.f4 Be7 8.Qf3 Qc7 9.O-O-O Nbd7 10.Bd3 b5 11.Rhe1 Bb7 12.Qg3`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bg5 e6 7. f4 Be7 8. Qf3 Qc7 9. O-O-O Nbd7 10. Bd3 b5 11. Rhe1 Bb7 12. Qg3 b4 13. Nd5 exd5 14. exd5 O-O',
  },
  {
    name: `${NAJ}, 6.Bg5 e6 7.f4 Be7 8.Qf3 Qc7 9.O-O-O Nbd7 10.Bd3 b5 11.Rhe1 Bb7 12.e5`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bg5 e6 7. f4 Be7 8. Qf3 Qc7 9. O-O-O Nbd7 10. Bd3 b5 11. Rhe1 Bb7 12. e5 dxe5 13. fxe5 Nd5',
  },
  {
    name: `${NAJ}, 6.Bg5 e6 7.f4 Be7 8.Qf3 Qc7 9.O-O-O Nbd7 10.Bd3 b5 11.Rhe1 Bb7 12.Nxe6?!`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bg5 e6 7. f4 Be7 8. Qf3 Qc7 9. O-O-O Nbd7 10. Bd3 b5 11. Rhe1 Bb7 12. Nxe6 fxe6 13. Bxf6 Nxf6',
  },
  {
    name: `${NAJ}, 6.Bg5 e6 7.f4 Be7 8.Qf3 Qc7 9.O-O-O Nbd7 10.Bd3 b5 11.Rhe1 Bb7 12.Kb1`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bg5 e6 7. f4 Be7 8. Qf3 Qc7 9. O-O-O Nbd7 10. Bd3 b5 11. Rhe1 Bb7 12. Kb1 b4 13. Nd5 exd5 14. exd5 O-O',
  },
  {
    name: `${NAJ}, 6.Bg5 e6 7.f4 Be7 8.Qf3 Qc7 9.O-O-O Nbd7 10.Bd3 b5 11.Rhe1 Bb7 12.a3`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bg5 e6 7. f4 Be7 8. Qf3 Qc7 9. O-O-O Nbd7 10. Bd3 b5 11. Rhe1 Bb7 12. a3 Rb8 13. Qg3 O-O',
  },
  {
    name: `${NAJ}, 6.Bg5 e6 7.f4 Nbd7 (Gelfand)`,
    weight: 1,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bg5 e6 7. f4 Nbd7 8. Qf3 Qc7 9. O-O-O b5 10. Bd3 Bb7 11. Rhe1 Qb6 12. Nd5 exd5',
  },
  {
    name: `${NAJ}, 6.Bg5 e6 7.Qf3`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bg5 e6 7. Qf3 Nbd7 8. O-O-O Qc7',
  },
  {
    name: `${NAJ}, 6.Bg5 e6 7.Qd2`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bg5 e6 7. Qd2 Be7 8. O-O-O Nbd7 9. f4 b5 10. Bd3 Bb7 11. Rhe1 Qc7',
  },
  {
    name: `${NAJ}, 6.Bg5 e6 7.Qd3`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bg5 e6 7. Qd3 Be7 8. O-O-O Nbd7 9. f4 Qc7 10. Be2 b5',
  },
  {
    name: `${NAJ}, 6.Bg5 e6 7.Be2`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bg5 e6 7. Be2 Be7 8. O-O O-O 9. Qd3 Nbd7 10. Rad1 Qc7 11. f4 b5',
  },
  {
    name: `${NAJ}, 6.Bg5 e6 7.Nb3`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bg5 e6 7. Nb3 Be7 8. Qf3 Nbd7 9. O-O-O Qc7 10. Bd3 b5',
  },
  {
    name: `${NAJ}, 6.Bg5 e6 7.Bxf6?!`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bg5 e6 7. Bxf6 gxf6 8. Qd2 Nc6 9. O-O-O Bd7 10. f4 Qb6 11. Nb3 O-O-O',
  },
  {
    name: `${NAJ}, 6.Bg5 e6 7.f4 Be7 8.Qf3 Qc7 9.O-O-O Nbd7 10.g4 b5 11.Bxf6 Nxf6 12.g5 Nd7 13.f5 Nc5 14.Rhe1`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bg5 e6 7. f4 Be7 8. Qf3 Qc7 9. O-O-O Nbd7 10. g4 b5 11. Bxf6 Nxf6 12. g5 Nd7 13. f5 Nc5',
  },
  {
    name: `${NAJ}, 6.Be2 e5 7.Nb3 Be7 (Opocensky)`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be2 e5 7. Nb3 Be7 8. O-O O-O 9. Be3 Be6 10. Qd2 Nbd7 11. a4 Rc8 12. a5 Qc7',
  },
  {
    name: `${NAJ}, 6.Be2 e5 7.Nb3 Be7 8.O-O O-O 9.Kh1`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be2 e5 7. Nb3 Be7 8. O-O O-O 9. Kh1 Be6 10. f4 exf4 11. Bxf4 Nc6 12. Qd2 Rc8',
  },
  {
    name: `${NAJ}, 6.Be2 e5 7.Nb3 Be7 8.O-O O-O 9.Be3 Be6 10.f4`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be2 e5 7. Nb3 Be7 8. O-O O-O 9. Be3 Be6 10. f4 exf4 11. Bxf4 Nc6 12. Kh1 Rc8',
  },
  {
    name: `${NAJ}, 6.Be2 e5 7.Nb3 Be7 8.O-O O-O 9.Be3 Be6 10.Qd2 Nbd7 11.a4 Rc8 12.a5 Qc7 13.Rfd1`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be2 e5 7. Nb3 Be7 8. O-O O-O 9. Be3 Be6 10. Qd2 Nbd7 11. a4 Rc8 12. a5 Qc7 13. Rfd1 Rfe8',
  },
  {
    name: `${NAJ}, 6.Be2 e5 7.Nb3 Be7 8.Bg5`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be2 e5 7. Nb3 Be7 8. Bg5 Be6 9. Bxf6 Bxf6 10. Qd3 Nc6 11. O-O-O O-O',
  },
  {
    name: `${NAJ}, 6.Be2 e5 7.Nb3 Be7 8.O-O O-O 9.a4`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be2 e5 7. Nb3 Be7 8. O-O O-O 9. a4 Nc6 10. Be3 Be6 11. a5 Qc7 12. Qd2 Rfc8',
  },
  {
    name: `${NAJ}, 6.Be2 e5 7.Nb3 Be7 8.O-O Be6`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be2 e5 7. Nb3 Be7 8. O-O Be6 9. f4 Qc7 10. f5 Bc4 11. a4 Nbd7 12. Be3 O-O',
  },
  {
    name: `${NAJ}, 6.Be2 e5 7.Nb3 Be7 8.O-O O-O 9.f4`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be2 e5 7. Nb3 Be7 8. O-O O-O 9. f4 b5 10. a3 Bb7 11. Bf3 Nbd7 12. Kh1 exf4',
  },
  {
    name: `${NAJ}, 6.Be2 e5 7.Nf3`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be2 e5 7. Nf3 Be7 8. O-O O-O 9. Re1 Nc6 10. h3 b5 11. Bf1 Bb7',
  },
  {
    name: `${NAJ}, 6.Be2 e5 7.Nf5?!`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be2 e5 7. Nf5 d5 8. Bg5 d4 9. Bxf6 Qxf6 10. Nd5 Qd8 11. Nxd4 exd4',
  },
  {
    name: `${NAJ}, 6.Be2 e5 7.Nb3 Be7 8.O-O O-O 9.Be3 Be6 10.Qd2 Nbd7 11.a4 Rc8 12.a5 Qc7 13.Nd5`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be2 e5 7. Nb3 Be7 8. O-O O-O 9. Be3 Be6 10. Qd2 Nbd7 11. a4 Rc8 12. a5 Qc7 13. Nd5 Bxd5 14. exd5 Nb8',
  },
];
