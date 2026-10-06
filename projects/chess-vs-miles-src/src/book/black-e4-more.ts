/**
 * The rest of Black vs 1.e4: other Najdorf sixth moves, the Classical, the
 * Hyper-Accelerated Dragon, and one answer to every Anti-Sicilian.
 */
import type { Line } from './types';

const SIC = 'Sicilian Defense';
const NAJ = `${SIC}: Najdorf Variation`;
const CLA = `${SIC}: Classical Variation`;
const HAD = `${SIC}: Hyper-Accelerated Dragon`;

const W_NAJ = 3;
const W_CLA = 2;
const W_HAD = 2;

export const BLACK_E4_MORE: Line[] = [
  // ─── Najdorf: the other sixth moves ───────────────────────────────────────
  {
    name: `${NAJ}, 6.Bc4 (Fischer-Sozin)`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bc4 e6 7. Bb3 b5 8. O-O Be7 9. Qf3 Qc7 10. Qg3 O-O 11. Bh6 Ne8 12. Rad1 Bd7',
  },
  {
    name: `${NAJ}, 6.Bc4 e6 7.Bb3 Nbd7`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bc4 e6 7. Bb3 Nbd7 8. f4 Nc5 9. f5 Nxb3 10. axb3 e5 11. Nde2 b5',
  },
  {
    name: `${NAJ}, 6.Bc4 e6 7.Bb3 b5 8.f4`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bc4 e6 7. Bb3 b5 8. f4 b4 9. Na4 Nxe4 10. O-O g6 11. f5 gxf5 12. Nxf5 exf5',
  },
  {
    name: `${NAJ}, 6.Bc4 e6 7.Bb3 b5 8.O-O Be7 9.f4`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bc4 e6 7. Bb3 b5 8. O-O Be7 9. f4 O-O 10. e5 dxe5 11. fxe5 Nfd7 12. Qh5 Nc5',
  },
  {
    name: `${NAJ}, 6.Bc4 e6 7.Bb3 b5 8.O-O Be7 9.Qf3 Qc7 10.Qg3 O-O 11.Bh6 Ne8 12.Rad1 Bd7 13.f4`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bc4 e6 7. Bb3 b5 8. O-O Be7 9. Qf3 Qc7 10. Qg3 O-O 11. Bh6 Ne8 12. Rad1 Bd7 13. f4 Nc6 14. Nxc6 Bxc6',
  },
  {
    name: `${NAJ}, 6.Bc4 e6 7.O-O`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bc4 e6 7. O-O b5 8. Bb3 Be7 9. Qf3 Qc7 10. Qg3 O-O 11. Bh6 Ne8',
  },
  {
    name: `${NAJ}, 6.Bc4 e6 7.a3`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bc4 e6 7. a3 Be7 8. Ba2 O-O 9. O-O b5 10. f4 Bb7 11. Qf3 Nbd7',
  },
  {
    name: `${NAJ}, 6.Bc4 e6 7.Bb3 b5 8.Bg5`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bc4 e6 7. Bb3 b5 8. Bg5 Be7 9. Qf3 Qc7 10. O-O-O Nbd7 11. Rhe1 Bb7',
  },
  {
    name: `${NAJ}, 6.f3 e5 7.Nb3 Be6`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. f3 e5 7. Nb3 Be6 8. Be3 Be7 9. Qd2 O-O 10. O-O-O Nbd7 11. g4 b5 12. g5 b4',
  },
  {
    name: `${NAJ}, 6.f3 e5 7.Nb3 Be6 8.Be3 Nbd7`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. f3 e5 7. Nb3 Be6 8. Be3 Nbd7 9. Qd2 b5 10. O-O-O Be7 11. g4 O-O 12. g5 b4',
  },
  {
    name: `${NAJ}, 6.f3 e5 7.Nb3 Be6 8.Be3 h5`,
    weight: 1,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. f3 e5 7. Nb3 Be6 8. Be3 h5 9. Qd2 Nbd7 10. O-O-O Be7 11. Kb1 Rc8',
  },
  {
    name: `${NAJ}, 6.f3 e5 7.Nde2`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. f3 e5 7. Nde2 Be7 8. Be3 O-O 9. Qd2 Be6 10. O-O-O Nbd7 11. g4 b5',
  },
  {
    name: `${NAJ}, 6.f3 e5 7.Nf5?!`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. f3 e5 7. Nf5 d5 8. Bg5 d4 9. Bxf6 Qxf6 10. Nd5 Qd8 11. Nxd4 exd4',
  },
  {
    name: `${NAJ}, 6.h3 e5 7.Nde2 h5`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. h3 e5 7. Nde2 h5 8. g3 Be6 9. Bg2 Nbd7 10. Be3 Be7 11. Qd2 b5 12. O-O-O Rc8',
  },
  {
    name: `${NAJ}, 6.h3 e5 7.Nde2 h5 8.Bg5`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. h3 e5 7. Nde2 h5 8. Bg5 Be6 9. Bxf6 Qxf6 10. Nd5 Qd8 11. Qd3 Nd7 12. O-O-O Be7',
  },
  {
    name: `${NAJ}, 6.h3 e5 7.Nde2 Be7`,
    weight: 1,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. h3 e5 7. Nde2 Be7 8. g4 Be6 9. Bg2 Nbd7 10. Be3 b5 11. Qd2 Rc8 12. O-O-O O-O',
  },
  {
    name: `${NAJ}, 6.h3 e5 7.Nf3`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. h3 e5 7. Nf3 Be7 8. Bc4 O-O 9. O-O Be6 10. Bb3 Nbd7 11. Re1 Qc7',
  },
  {
    name: `${NAJ}, 6.h3 e5 7.Nb3`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. h3 e5 7. Nb3 Be6 8. g4 d5 9. exd5 Nxd5 10. Nxd5 Qxd5 11. Qxd5 Bxd5 12. Bg2 Nc6',
  },
  {
    name: `${NAJ}, 6.h3 e6`,
    weight: 1,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. h3 e6 7. g4 d5 8. exd5 Nxd5 9. Nxd5 Qxd5 10. Be3 Nc6 11. Bg2 Qd8',
  },
  {
    name: `${NAJ}, 6.g3 e5 7.Nde2 Be7`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. g3 e5 7. Nde2 Be7 8. Bg2 O-O 9. O-O Nbd7 10. h3 b5 11. a3 Bb7 12. g4 Nb6',
  },
  {
    name: `${NAJ}, 6.g3 e5 7.Nde2 Be6`,
    weight: 1,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. g3 e5 7. Nde2 Be6 8. Bg2 Nbd7 9. O-O Be7 10. h3 O-O 11. g4 Rc8',
  },
  {
    name: `${NAJ}, 6.g3 e5 7.Nb3`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. g3 e5 7. Nb3 Be7 8. Bg2 O-O 9. O-O Be6 10. a4 Nbd7 11. a5 Rc8',
  },
  {
    name: `${NAJ}, 6.g3 e5 7.Nf3`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. g3 e5 7. Nf3 Be7 8. Bg2 O-O 9. O-O Nc6 10. h3 b5 11. a3 Bb7',
  },
  {
    name: `${NAJ}, 6.f4 e5`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. f4 e5 7. Nf3 Nbd7 8. a4 Be7 9. Bd3 O-O 10. O-O exf4 11. Bxf4 Nc5 12. Kh1 Be6',
  },
  {
    name: `${NAJ}, 6.f4 e5 7.Nf3 Nbd7 8.Bd3`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. f4 e5 7. Nf3 Nbd7 8. Bd3 Be7 9. O-O O-O 10. Kh1 exf4 11. Bxf4 Nc5 12. Qe2 Be6',
  },
  {
    name: `${NAJ}, 6.f4 e5 7.Nf3 Nbd7 8.a4 Be7 9.Bd3 O-O 10.O-O exf4 11.Kh1`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. f4 e5 7. Nf3 Nbd7 8. a4 Be7 9. Bd3 O-O 10. O-O exf4 11. Kh1 Nc5 12. Bxf4 Be6',
  },
  {
    name: `${NAJ}, 6.f4 e5 7.Nf5`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. f4 e5 7. Nf5 Bxf5 8. exf5 Nc6 9. fxe5 dxe5 10. Qxd8+ Rxd8 11. Bg5 Nd4',
  },
  {
    name: `${NAJ}, 6.f4 e5 7.fxe5?!`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. f4 e5 7. fxe5 dxe5 8. Nf3 Qxd1+ 9. Kxd1 Nxe4 10. Nxe4 Bf5',
  },
  {
    name: `${NAJ}, 6.f4 Qc7`,
    weight: 1,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. f4 Qc7 7. Bd3 g6 8. Nf3 Bg7 9. O-O O-O 10. Qe1 Nbd7 11. Kh1 b5',
  },
  {
    name: `${NAJ}, 6.a4 e5`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. a4 e5 7. Nf3 Be7 8. Bc4 O-O 9. O-O Nc6 10. h3 Be6 11. Bxe6 fxe6 12. Qe2 Qd7',
  },
  {
    name: `${NAJ}, 6.a4 e5 7.Nb3`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. a4 e5 7. Nb3 Be6 8. Be2 Be7 9. O-O O-O 10. Be3 Nc6 11. a5 Qc7',
  },
  {
    name: `${NAJ}, 6.a4 Nc6`,
    weight: 1,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. a4 Nc6 7. Be2 e5 8. Nb3 Be6 9. O-O Be7 10. f4 exf4 11. Bxf4 O-O',
  },
  {
    name: `${NAJ}, 6.Rg1 e5`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Rg1 e5 7. Nb3 Be6 8. g4 d5 9. exd5 Nxd5 10. Nxd5 Qxd5 11. Be3 Nc6',
  },
  {
    name: `${NAJ}, 6.Rg1 e5 7.Nf3`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Rg1 e5 7. Nf3 Be7 8. g4 Nc6 9. g5 Nd7 10. Be3 b5 11. Qd2 Nb6',
  },
  {
    name: `${NAJ}, 6.Rg1 e5 7.Nde2`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Rg1 e5 7. Nde2 Be7 8. g4 h6 9. Ng3 Be6 10. h4 Nbd7 11. Be3 b5',
  },
  {
    name: `${NAJ}, 6.Qf3 e5`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Qf3 e5 7. Nf5 Bxf5 8. exf5 Nc6 9. Bg5 Qa5 10. O-O-O Rc8',
  },
  {
    name: `${NAJ}, 6.Qd3 e5`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Qd3 e5 7. Nf5 Bxf5 8. exf5 Nc6 9. Bg5 Qa5 10. Bxf6 gxf6 11. O-O-O Nd4',
  },
  {
    name: `${NAJ}, 6.Qe2 e5`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Qe2 e5 7. Nf5 Bxf5 8. exf5 d5 9. Bg5 d4 10. Bxf6 Qxf6 11. Nd5 Qd8',
  },
  {
    name: `${NAJ}, 6.Nb3 e5`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Nb3 e5 7. Bg5 Be6 8. Bxf6 Qxf6 9. Nd5 Qd8 10. Bc4 Nd7 11. O-O Bxd5',
  },
  {
    name: `${NAJ}, 6.Bd3 e5`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bd3 e5 7. Nde2 Nbd7 8. O-O Nc5 9. Ng3 g6 10. Bg5 Bg7',
  },
  {
    name: `${NAJ}, 6.Nd5?!`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Nd5 Nxd5 7. exd5 g6 8. Be3 Bg7 9. Qd2 O-O 10. O-O-O Nd7',
  },
  {
    name: `${NAJ}, 6.Nf3?!`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Nf3 e5 7. Bc4 Be7 8. O-O O-O 9. Re1 Nc6 10. h3 b5 11. Bf1 Bb7',
  },
  {
    name: `${NAJ}, 6.Nxc6?! via Nc6`,
    weight: 1,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. a3 e5 7. Nf3 Be7 8. Bc4 O-O 9. O-O Nc6 10. h3 b5 11. Ba2 Bb7',
  },
  {
    name: `${NAJ}, 6.b3 e5`,
    weight: W_NAJ,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. b3 e5 7. Nf3 Be7 8. Bb2 O-O 9. Be2 Nc6 10. O-O Be6 11. Nd5 Bxd5',
  },
  {
    name: `${NAJ}, 6.Bg5 Nbd7?! (Polugaevsky-adjacent)`,
    weight: 1,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bg5 Nbd7 7. f4 Qc7 8. Qf3 h6 9. Bh4 e6 10. O-O-O b5 11. Bd3 Bb7',
  },
  // ─── Classical (5...Nc6) ──────────────────────────────────────────────────
  {
    name: `${CLA}, Richter-Rauzer, 6.Bg5 e6 7.Qd2 a6`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Bg5 e6 7. Qd2 a6 8. O-O-O Bd7 9. f4 b5 10. Bxf6 gxf6 11. Kb1 Qb6 12. Nxc6 Bxc6',
  },
  {
    name: `${CLA}, Richter-Rauzer, 7.Qd2 a6 8.O-O-O Bd7 9.f4 b5 10.Nxc6`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Bg5 e6 7. Qd2 a6 8. O-O-O Bd7 9. f4 b5 10. Nxc6 Bxc6 11. Qe1 Qb6 12. Bd3 b4',
  },
  {
    name: `${CLA}, Richter-Rauzer, 7.Qd2 a6 8.O-O-O Bd7 9.f4 Be7`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Bg5 e6 7. Qd2 a6 8. O-O-O Bd7 9. f4 Be7 10. Nf3 b5 11. Bxf6 gxf6 12. Kb1 Qb6',
  },
  {
    name: `${CLA}, Richter-Rauzer, 7.Qd2 a6 8.O-O-O h6`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Bg5 e6 7. Qd2 a6 8. O-O-O h6 9. Be3 Be7 10. f4 Nxd4 11. Bxd4 b5 12. Kb1 Bb7',
  },
  {
    name: `${CLA}, Richter-Rauzer, 7.Qd2 a6 8.O-O-O Bd7 9.f3`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Bg5 e6 7. Qd2 a6 8. O-O-O Bd7 9. f3 b5 10. Nxc6 Bxc6 11. Ne2 Qb6 12. Kb1 Be7',
  },
  {
    name: `${CLA}, Richter-Rauzer, 7.Qd2 a6 8.O-O-O Bd7 9.Nxc6`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Bg5 e6 7. Qd2 a6 8. O-O-O Bd7 9. Nxc6 Bxc6 10. f3 Be7 11. Kb1 O-O 12. Bd3 b5',
  },
  {
    name: `${CLA}, Richter-Rauzer, 7.Qd2 a6 8.O-O-O Bd7 9.f4 b5 10.Bxf6 gxf6 11.Nxc6`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Bg5 e6 7. Qd2 a6 8. O-O-O Bd7 9. f4 b5 10. Bxf6 gxf6 11. Nxc6 Bxc6 12. Qe1 Qb6',
  },
  {
    name: `${CLA}, Richter-Rauzer, 7.Qd2 a6 8.O-O-O Bd7 9.f4 b5 10.Bxf6 gxf6 11.Kb1 Qb6 12.f5`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Bg5 e6 7. Qd2 a6 8. O-O-O Bd7 9. f4 b5 10. Bxf6 gxf6 11. Kb1 Qb6 12. f5 Nxd4 13. Qxd4 Qxd4',
  },
  {
    name: `${CLA}, Richter-Rauzer, 7.Qd2 a6 8.O-O-O Bd7 9.f4 b5 10.Bxf6 gxf6 11.Kb1 Qb6 12.Nf3`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Bg5 e6 7. Qd2 a6 8. O-O-O Bd7 9. f4 b5 10. Bxf6 gxf6 11. Kb1 Qb6 12. Nf3 O-O-O 13. Qe1 Kb7',
  },
  {
    name: `${CLA}, Richter-Rauzer, 7.Qd2 a6 8.O-O-O Bd7 9.f4 b5 10.Bxf6 gxf6 11.Kb1 Qb6 12.Nxc6 Bxc6 13.Qe1`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Bg5 e6 7. Qd2 a6 8. O-O-O Bd7 9. f4 b5 10. Bxf6 gxf6 11. Kb1 Qb6 12. Nxc6 Bxc6 13. Qe1 h5 14. Bd3 Be7',
  },
  {
    name: `${CLA}, Richter-Rauzer, 7.Qd2 a6 8.O-O-O Bd7 9.f4 b5 10.Bxf6 gxf6 11.Kb1 Qb6 12.Nxc6 Bxc6 13.Bd3`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Bg5 e6 7. Qd2 a6 8. O-O-O Bd7 9. f4 b5 10. Bxf6 gxf6 11. Kb1 Qb6 12. Nxc6 Bxc6 13. Bd3 O-O-O 14. Qe1 Kb7',
  },
  {
    name: `${CLA}, Richter-Rauzer, 7.Qd2 Be7`,
    weight: 1,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Bg5 e6 7. Qd2 Be7 8. O-O-O O-O 9. f4 Nxd4 10. Qxd4 Qa5 11. Bc4 Bd7 12. e5 dxe5',
  },
  {
    name: `${CLA}, Richter-Rauzer, 7.Qd3`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Bg5 e6 7. Qd3 Be7 8. O-O-O O-O 9. f4 Nxd4 10. Qxd4 Qa5 11. Bc4 Bd7 12. e5 dxe5',
  },
  {
    name: `${CLA}, Richter-Rauzer, 7.Nb3`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Bg5 e6 7. Nb3 Be7 8. Qd2 a6 9. O-O-O O-O 10. f3 Qc7 11. Kb1 b5',
  },
  {
    name: `${CLA}, Richter-Rauzer, 7.Bb5?!`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Bg5 e6 7. Bb5 Bd7 8. Nxc6 Bxc6 9. Bxc6+ bxc6 10. Qd3 Qb6 11. O-O-O Be7',
  },
  {
    name: `${CLA}, Richter-Rauzer, 7.Be2`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Bg5 e6 7. Be2 Be7 8. O-O O-O 9. Qd2 a6 10. Rad1 Qc7 11. f4 Nxd4 12. Qxd4 b5',
  },
  {
    name: `${CLA}, Richter-Rauzer, 7.f4?!`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Bg5 e6 7. f4 Be7 8. Qf3 h6 9. Bh4 Nxd4 10. Rd1 O-O 11. Bxf6 Bxf6',
  },
  {
    name: `${CLA}, Richter-Rauzer, 6.Bg5 Bd7`,
    weight: 1,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Bg5 Bd7 7. Qd2 Rc8 8. O-O-O Nxd4 9. Qxd4 Qa5 10. f4 Rxc3 11. bxc3 e5',
  },
  {
    name: `${CLA}, Boleslavsky (6.Be2 e5)`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Be2 e5 7. Nb3 Be7 8. O-O O-O 9. Be3 Be6 10. Bf3 a5 11. Nd5 Bxd5 12. exd5 Nb4',
  },
  {
    name: `${CLA}, Boleslavsky, 7.Nf3`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Be2 e5 7. Nf3 h6 8. O-O Be7 9. Re1 O-O 10. h3 a6 11. Bf1 b5',
  },
  {
    name: `${CLA}, Boleslavsky, 7.Nxc6`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Be2 e5 7. Nxc6 bxc6 8. O-O Be7 9. Qd3 O-O 10. Bg5 Be6 11. Rad1 Qc7',
  },
  {
    name: `${CLA}, Boleslavsky, 7.Nb3 Be7 8.O-O O-O 9.Kh1`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Be2 e5 7. Nb3 Be7 8. O-O O-O 9. Kh1 a5 10. a4 Nb4 11. f4 Bd7',
  },
  {
    name: `${CLA}, Boleslavsky, 7.Nb3 Be7 8.O-O O-O 9.f4`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Be2 e5 7. Nb3 Be7 8. O-O O-O 9. f4 a5 10. a4 Nb4 11. Kh1 Bd7 12. Be3 Rc8',
  },
  {
    name: `${CLA}, Boleslavsky, 7.Nb3 Be7 8.Bg5`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Be2 e5 7. Nb3 Be7 8. Bg5 Be6 9. Bxf6 Bxf6 10. Nd5 O-O 11. O-O Bg5',
  },
  {
    name: `${CLA}, Boleslavsky, 7.Nf5?!`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Be2 e5 7. Nf5 Bxf5 8. exf5 d5 9. O-O d4 10. Nb5 Bb4 11. Bf3 O-O',
  },
  {
    name: `${CLA}, 6.Be2 e6 (Scheveningen)`,
    weight: 1,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Be2 e6 7. O-O Be7 8. Be3 O-O 9. f4 e5 10. Nb3 exf4 11. Bxf4 Be6',
  },
  {
    name: `${CLA}, Sozin (6.Bc4 Qb6)`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Bc4 Qb6 7. Nde2 e6 8. O-O Be7 9. Bb3 O-O 10. Bg5 Qc7 11. Kh1 a6',
  },
  {
    name: `${CLA}, Sozin, 6.Bc4 e6`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Bc4 e6 7. Bb3 Be7 8. Be3 O-O 9. O-O a6 10. f4 Nxd4 11. Bxd4 b5 12. e5 dxe5',
  },
  {
    name: `${CLA}, Sozin, 6.Bc4 e6 7.Be3`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Bc4 e6 7. Be3 Be7 8. Qe2 a6 9. O-O-O Qc7 10. Bb3 O-O 11. Rhg1 Nd7',
  },
  {
    name: `${CLA}, Sozin, 6.Bc4 e6 7.O-O`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Bc4 e6 7. O-O Be7 8. Bb3 O-O 9. Be3 a6 10. f4 Nxd4 11. Bxd4 b5',
  },
  {
    name: `${CLA}, Sozin, 6.Bc4 Qb6 7.Nb3`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Bc4 Qb6 7. Nb3 e6 8. O-O Be7 9. Be3 Qc7 10. f4 O-O 11. Bd3 b5',
  },
  {
    name: `${CLA}, Sozin, 6.Bc4 Qb6 7.Nxc6`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Bc4 Qb6 7. Nxc6 bxc6 8. O-O e5 9. Qe2 Be7 10. Be3 Qc7 11. f4 O-O',
  },
  {
    name: `${CLA}, Sozin, 6.Bc4 Qb6 7.Nb3 e6 8.O-O Be7 9.Be3 Qc7 10.f4 O-O 11.Bd3 b5 12.a3`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Bc4 Qb6 7. Nb3 e6 8. O-O Be7 9. Be3 Qc7 10. f4 O-O 11. Bd3 b5 12. a3 Bb7',
  },
  {
    name: `${CLA}, 6.Be3 e5`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Be3 e5 7. Nb3 Be6 8. f3 Be7 9. Qd2 O-O 10. O-O-O a5 11. Kb1 a4 12. Nc1 d5',
  },
  {
    name: `${CLA}, 6.Be3 e5 7.Nxc6`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Be3 e5 7. Nxc6 bxc6 8. f3 Be7 9. Qd2 O-O 10. O-O-O Qa5 11. Kb1 Rb8',
  },
  {
    name: `${CLA}, 6.Be3 e5 7.Nf3`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Be3 e5 7. Nf3 Be7 8. Bc4 O-O 9. O-O Be6 10. Bb3 a6 11. Qe2 Qc7',
  },
  {
    name: `${CLA}, 6.Be3 e5 7.Nde2`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Be3 e5 7. Nde2 Be7 8. f3 O-O 9. Qd2 Be6 10. O-O-O a5 11. Kb1 a4',
  },
  {
    name: `${CLA}, 6.Be3 e5 7.Nf5?!`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Be3 e5 7. Nf5 Bxf5 8. exf5 d5 9. Bb5 d4 10. Bxc6+ bxc6 11. Bxd4 exd4',
  },
  {
    name: `${CLA}, 6.Be3 e5 7.Nb3 Be6 8.Qd2`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Be3 e5 7. Nb3 Be6 8. Qd2 Be7 9. f3 O-O 10. O-O-O a5 11. Kb1 a4 12. Nc1 d5',
  },
  {
    name: `${CLA}, 6.f3 e5`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. f3 e5 7. Nb3 Be6 8. Be3 Be7 9. Qd2 O-O 10. O-O-O a5 11. Kb1 a4 12. Nc1 d5',
  },
  {
    name: `${CLA}, 6.f3 e5 7.Nxc6`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. f3 e5 7. Nxc6 bxc6 8. Be3 Be7 9. Qd2 O-O 10. O-O-O Qa5 11. Kb1 Rb8',
  },
  {
    name: `${CLA}, 6.f3 e5 7.Nde2`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. f3 e5 7. Nde2 Be7 8. Be3 O-O 9. Qd2 Be6 10. O-O-O a5 11. Kb1 a4',
  },
  {
    name: `${CLA}, 6.f4 Qb6`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. f4 Qb6 7. Nb3 e6 8. Qf3 Be7 9. Be3 Qc7 10. Bd3 O-O 11. O-O a6 12. Rae1 b5',
  },
  {
    name: `${CLA}, 6.f4 e5`,
    weight: 1,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. f4 e5 7. Nxc6 bxc6 8. fxe5 dxe5 9. Qxd8+ Kxd8 10. Bg5 Bb4',
  },
  {
    name: `${CLA}, 6.f4 Qb6 7.Nxc6`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. f4 Qb6 7. Nxc6 bxc6 8. Bd3 e5 9. f5 Be7 10. Qf3 O-O 11. g4 d5',
  },
  {
    name: `${CLA}, 6.f4 Qb6 7.Nf3`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. f4 Qb6 7. Nf3 Bg4 8. Be2 e6 9. Be3 Qc7 10. O-O Be7 11. h3 Bxf3 12. Bxf3 O-O',
  },
  {
    name: `${CLA}, 6.f4 Qb6 7.Be3?!`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. f4 Qb6 7. Be3 Qxb2 8. Ndb5 Qb4 9. Bd3 e5 10. a3 Qa5 11. O-O exf4 12. Bxf4 Be7',
  },
  {
    name: `${CLA}, 6.g3 e5`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. g3 e5 7. Nde2 Be7 8. Bg2 O-O 9. O-O Be6 10. h3 Rc8 11. Kh2 Nd4',
  },
  {
    name: `${CLA}, 6.g3 Bg4?!`,
    weight: 1,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. g3 Bg4 7. f3 Bd7 8. Bg2 e6 9. O-O Be7 10. Be3 O-O 11. Qe2 a6',
  },
  {
    name: `${CLA}, 6.g3 e5 7.Nxc6`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. g3 e5 7. Nxc6 bxc6 8. Bg2 Be7 9. O-O O-O 10. Qe2 Be6 11. Rd1 Qc7',
  },
  {
    name: `${CLA}, 6.g3 e5 7.Nb3`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. g3 e5 7. Nb3 Be7 8. Bg2 O-O 9. O-O Be6 10. Nd5 Bxd5 11. exd5 Nb4',
  },
  {
    name: `${CLA}, 6.g3 e5 7.Nf3`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. g3 e5 7. Nf3 Be7 8. Bg2 O-O 9. O-O Be6 10. h3 Qc7 11. Nd5 Bxd5 12. exd5 Nb4',
  },
  {
    name: `${CLA}, 6.h3 e5`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. h3 e5 7. Nde2 Be7 8. g4 Be6 9. Bg2 Nd7 10. Be3 Nb6 11. Qd2 Rc8',
  },
  {
    name: `${CLA}, 6.h3 e5 7.Nxc6`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. h3 e5 7. Nxc6 bxc6 8. Bc4 Be7 9. O-O O-O 10. Qf3 Be6 11. Bb3 Qc7',
  },
  {
    name: `${CLA}, 6.h3 e5 7.Nf3`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. h3 e5 7. Nf3 Be7 8. Bc4 O-O 9. O-O Be6 10. Bb3 Qc7 11. Re1 Rfd8',
  },
  {
    name: `${CLA}, 6.h3 e5 7.Nb3`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. h3 e5 7. Nb3 Be6 8. g4 d5 9. exd5 Nxd5 10. Nxd5 Qxd5 11. Qxd5 Bxd5 12. Bg2 Be6',
  },
  {
    name: `${CLA}, 6.Nxc6`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Nxc6 bxc6 7. e5 Nd5 8. exd6 Qxd6 9. Ne4 Qe5 10. Qd3 f5',
  },
  {
    name: `${CLA}, 6.Nxc6 bxc6 7.Bc4`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Nxc6 bxc6 7. Bc4 e5 8. O-O Be7 9. Qe2 O-O 10. Rd1 Qc7 11. Bg5 Be6',
  },
  {
    name: `${CLA}, 6.Nxc6 bxc6 7.Be2`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Nxc6 bxc6 7. Be2 e5 8. O-O Be7 9. Qd3 O-O 10. Rd1 Qc7 11. Bg5 Be6',
  },
  {
    name: `${CLA}, 6.Nxc6 bxc6 7.Bd3`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Nxc6 bxc6 7. Bd3 e5 8. O-O Be7 9. Qf3 O-O 10. Bg5 Be6 11. Rad1 Qc7',
  },
  {
    name: `${CLA}, 6.Nb3 e5`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Nb3 e5 7. Bg5 Be6 8. Bxf6 Qxf6 9. Nd5 Bxd5 10. exd5 Nd4 11. Nxd4 exd4',
  },
  {
    name: `${CLA}, 6.a4?!`,
    weight: 1,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. a4 e5 7. Nxc6 bxc6 8. Bc4 Be7 9. O-O O-O 10. Qe2 Be6 11. Bd3 Qc7',
  },
  {
    name: `${CLA}, 6.Nde2?!`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Nde2 e5 7. Bg5 Be7 8. Bxf6 Bxf6 9. Nd5 O-O 10. c3 Be6 11. Nxf6+ Qxf6',
  },
  {
    name: `${CLA}, 6.Bd3?!`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Bd3 e5 7. Nxc6 bxc6 8. O-O Be7 9. f4 O-O 10. Kh1 Qc7 11. Qf3 Be6',
  },
  {
    name: `${CLA}, 6.Bb5?!`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Bb5 Bd7 7. Nxc6 Bxc6 8. Bxc6+ bxc6 9. O-O e6 10. Re1 Be7 11. e5 dxe5 12. Rxe5 O-O',
  },
  {
    name: `${CLA}, 6.Bg5 g6 (Dragon-ish)`,
    weight: 1,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Bg5 g6 7. Bxf6 exf6 8. Bb5 Bd7 9. O-O Bg7 10. Nd5 O-O 11. c3 f5',
  },
  {
    name: `${CLA}, 6.Qd2?!`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Qd2 e5 7. Nxc6 bxc6 8. Bc4 Be7',
  },
  {
    name: `${CLA}, 6.Qd3?!`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Qd3 e5 7. Nxc6 bxc6 8. Qxd6 Qxd6 9. Bg5 Be7 10. Bxf6 Bxf6',
  },
  {
    name: `${CLA}, 6.Qd3 e5 7.Nf5`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Qd3 e5 7. Nf5 Bxf5 8. exf5 d5 9. Bg5 d4 10. Bxf6 Qxf6 11. Nd5 Qd8',
  },
  {
    name: `${CLA}, 6.Qd3 e5 7.Nb3`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Qd3 e5 7. Nb3 Be6 8. Bg5 Be7 9. Bxf6 Bxf6 10. Nd5 O-O 11. O-O-O Bg5+',
  },
  {
    name: `${CLA}, 6.Qd3 e5 7.Nde2`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Qd3 e5 7. Nde2 Be7 8. Bg5 Be6 9. Bxf6 Bxf6 10. Nd5 O-O 11. O-O-O Bg5+',
  },
  {
    name: `${CLA}, 6.Qd3 e5 7.Nf3`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Qd3 e5 7. Nf3 Be7 8. Bg5 O-O 9. O-O-O Be6 10. Bxf6 Bxf6 11. Nd5 Bg5+',
  },
  {
    name: `${CLA}, 6.Qd3 e5 7.Nxc6 bxc6 8.Bg5`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Qd3 e5 7. Nxc6 bxc6 8. Bg5 Be7 9. O-O-O O-O 10. f3 Be6 11. Kb1 Qa5',
  },
  {
    name: `${CLA}, 6.Qd3 e5 7.Nxc6 bxc6 8.Be2`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Qd3 e5 7. Nxc6 bxc6 8. Be2 Be7 9. O-O O-O 10. Bg5 Be6 11. Rad1 Qc7',
  },
  {
    name: `${CLA}, 6.Qd3 e5 7.Nxc6 bxc6 8.Bc4`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Qd3 e5 7. Nxc6 bxc6 8. Qxd6 Qxd6 9. Be3 Be7',
  },
  {
    name: `${CLA}, 6.Qd3 e5 7.Nxc6 bxc6 8.Bd2`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Qd3 e5 7. Nxc6 bxc6 8. Bd2 Be7 9. O-O-O O-O 10. f3 Be6 11. Kb1 Qa5',
  },
  {
    name: `${CLA}, 6.Qd3 e5 7.Nxc6 bxc6 8.Be3`,
    weight: W_CLA,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Qd3 e5 7. Nxc6 bxc6 8. Be3 Be7 9. O-O-O O-O 10. f3 Be6 11. Kb1 Qa5',
  },
  // ─── Hyper-Accelerated Dragon (2...g6) ────────────────────────────────────
  {
    name: `${HAD}, 3.d4 cxd4 4.Nxd4 Nc6 5.c4 (Maroczy)`,
    weight: W_HAD,
    moves: '1. e4 c5 2. Nf3 g6 3. d4 cxd4 4. Nxd4 Nc6 5. c4 Nf6 6. Nc3 d6 7. Be2 Nxd4 8. Qxd4 Bg7 9. Bg5 O-O 10. Qd2 Be6 11. Rc1 Qa5 12. f3 Rfc8',
  },
  {
    name: `${HAD}, Maroczy, 7.Be2 Nxd4 8.Qxd4 Bg7 9.Be3`,
    weight: W_HAD,
    moves: '1. e4 c5 2. Nf3 g6 3. d4 cxd4 4. Nxd4 Nc6 5. c4 Nf6 6. Nc3 d6 7. Be2 Nxd4 8. Qxd4 Bg7 9. Be3 O-O 10. Qd2 Be6 11. Rc1 Qa5 12. f3 Rfc8',
  },
  {
    name: `${HAD}, Maroczy, 7.Be2 Nxd4 8.Qxd4 Bg7 9.O-O`,
    weight: W_HAD,
    moves: '1. e4 c5 2. Nf3 g6 3. d4 cxd4 4. Nxd4 Nc6 5. c4 Nf6 6. Nc3 d6 7. Be2 Nxd4 8. Qxd4 Bg7 9. O-O O-O 10. Qd3 Be6 11. Bd2 Qa5 12. Rac1 Rfc8',
  },
  {
    name: `${HAD}, Maroczy, 7.f3`,
    weight: W_HAD,
    moves: '1. e4 c5 2. Nf3 g6 3. d4 cxd4 4. Nxd4 Nc6 5. c4 Nf6 6. Nc3 d6 7. f3 Nxd4 8. Qxd4 Bg7 9. Be3 O-O 10. Qd2 Be6 11. Rc1 Qa5 12. b3 Rfc8',
  },
  {
    name: `${HAD}, Maroczy, 7.Be3`,
    weight: W_HAD,
    moves: '1. e4 c5 2. Nf3 g6 3. d4 cxd4 4. Nxd4 Nc6 5. c4 Nf6 6. Nc3 d6 7. Be3 Ng4 8. Qxg4 Nxd4 9. Qd1 Ne6 10. Qd2 Bg7 11. Be2 O-O 12. O-O Qa5',
  },
  {
    name: `${HAD}, Maroczy, 7.Be3 Ng4 8.Qxg4 Nxd4 9.Qd1 e5`,
    weight: 1,
    moves: '1. e4 c5 2. Nf3 g6 3. d4 cxd4 4. Nxd4 Nc6 5. c4 Nf6 6. Nc3 d6 7. Be3 Ng4 8. Qxg4 Nxd4 9. Qd1 e5 10. Nb5 Nxb5 11. cxb5 Be7 12. Be2 O-O',
  },
  {
    name: `${HAD}, Maroczy, 6.Nc3 Nxd4`,
    weight: 1,
    moves: '1. e4 c5 2. Nf3 g6 3. d4 cxd4 4. Nxd4 Nc6 5. c4 Nf6 6. Nc3 Nxd4 7. Qxd4 d6 8. Be2 Bg7 9. Bg5 O-O 10. Qd2 Be6 11. O-O Qa5 12. Rab1 Rfc8',
  },
  {
    name: `${HAD}, Maroczy, 6.Nc3 d6 7.Be2 Bg7 8.Be3`,
    weight: W_HAD,
    moves: '1. e4 c5 2. Nf3 g6 3. d4 cxd4 4. Nxd4 Nc6 5. c4 Nf6 6. Nc3 d6 7. Be2 Bg7 8. Be3 O-O 9. O-O Bd7 10. Qd2 Nxd4 11. Bxd4 Bc6 12. f3 a5',
  },
  {
    name: `${HAD}, Maroczy, 5.c4 Bg7`,
    weight: W_HAD,
    moves: '1. e4 c5 2. Nf3 g6 3. d4 cxd4 4. Nxd4 Nc6 5. c4 Bg7 6. Be3 Nf6 7. Nc3 O-O 8. Be2 d6 9. O-O Bd7 10. Qd2 Nxd4 11. Bxd4 Bc6 12. f3 a5',
  },
  {
    name: `${HAD}, Maroczy, 5.c4 Nf6 6.Nc3 d6 7.Be2 Nxd4 8.Qxd4 Bg7 9.Bg5 O-O 10.Qd2 Be6 11.O-O`,
    weight: W_HAD,
    moves: '1. e4 c5 2. Nf3 g6 3. d4 cxd4 4. Nxd4 Nc6 5. c4 Nf6 6. Nc3 d6 7. Be2 Nxd4 8. Qxd4 Bg7 9. Bg5 O-O 10. Qd2 Be6 11. O-O Qa5 12. Rab1 Rfc8',
  },
  {
    name: `${HAD}, Maroczy, 5.c4 Nf6 6.Nc3 d6 7.Be2 Nxd4 8.Qxd4 Bg7 9.Bg5 O-O 10.Qd2 Be6 11.Rc1 Qa5 12.b3`,
    weight: W_HAD,
    moves: '1. e4 c5 2. Nf3 g6 3. d4 cxd4 4. Nxd4 Nc6 5. c4 Nf6 6. Nc3 d6 7. Be2 Nxd4 8. Qxd4 Bg7 9. Bg5 O-O 10. Qd2 Be6 11. Rc1 Qa5 12. b3 Rfc8',
  },
  {
    name: `${HAD}, Maroczy, 5.c4 Nf6 6.Nc3 d6 7.Be2 Nxd4 8.Qxd4 Bg7 9.Bg5 O-O 10.Qd2 Be6 11.O-O Qa5 12.Rac1`,
    weight: W_HAD,
    moves: '1. e4 c5 2. Nf3 g6 3. d4 cxd4 4. Nxd4 Nc6 5. c4 Nf6 6. Nc3 d6 7. Be2 Nxd4 8. Qxd4 Bg7 9. Bg5 O-O 10. Qd2 Be6 11. O-O Qa5 12. Rac1 Rfc8',
  },
  {
    name: `${HAD}, Maroczy, 5.c4 Nf6 6.Nc3 d6 7.Be2 Nxd4 8.Qxd4 Bg7 9.Bg5 O-O 10.Qd2 Be6 11.O-O Qa5 12.Rfc1`,
    weight: W_HAD,
    moves: '1. e4 c5 2. Nf3 g6 3. d4 cxd4 4. Nxd4 Nc6 5. c4 Nf6 6. Nc3 d6 7. Be2 Nxd4 8. Qxd4 Bg7 9. Bg5 O-O 10. Qd2 Be6 11. O-O Qa5 12. Rfc1 Rfc8',
  },
  {
    name: `${HAD}, 4.Nxd4 Nc6 5.Nc3 Bg7 6.Be3 Nf6 7.Bc4`,
    weight: W_HAD,
    moves: '1. e4 c5 2. Nf3 g6 3. d4 cxd4 4. Nxd4 Nc6 5. Nc3 Bg7 6. Be3 Nf6 7. Bc4 O-O 8. Bb3 a5 9. f3 d5 10. exd5 Nb4 11. Nde2 Nfxd5 12. Nxd5 Nxd5',
  },
  {
    name: `${HAD}, 5.Nc3 Bg7 6.Be3 Nf6 7.Bc4 Qa5`,
    weight: W_HAD,
    moves: '1. e4 c5 2. Nf3 g6 3. d4 cxd4 4. Nxd4 Nc6 5. Nc3 Bg7 6. Be3 Nf6 7. Bc4 Qa5 8. O-O O-O 9. Bb3 d6 10. h3 Bd7 11. f4 Rac8 12. Nf3 b5',
  },
  {
    name: `${HAD}, 5.Nc3 Bg7 6.Be3 Nf6 7.Bc4 O-O 8.Bb3 d6`,
    weight: W_HAD,
    moves: '1. e4 c5 2. Nf3 g6 3. d4 cxd4 4. Nxd4 Nc6 5. Nc3 Bg7 6. Be3 Nf6 7. Bc4 O-O 8. Bb3 d6 9. f3 Bd7 10. Qd2 Nxd4 11. Bxd4 b5 12. O-O-O a5',
  },
  {
    name: `${HAD}, 5.Nc3 Bg7 6.Be3 Nf6 7.Bc4 O-O 8.Bb3 a5 9.O-O`,
    weight: W_HAD,
    moves: '1. e4 c5 2. Nf3 g6 3. d4 cxd4 4. Nxd4 Nc6 5. Nc3 Bg7 6. Be3 Nf6 7. Bc4 O-O 8. Bb3 a5 9. O-O d6 10. h3 Bd7 11. f4 Nxd4 12. Bxd4 Bc6',
  },
  {
    name: `${HAD}, 5.Nc3 Bg7 6.Be3 Nf6 7.Bc4 O-O 8.Bb3 a5 9.f3 d5 10.Bxd5`,
    weight: W_HAD,
    moves: '1. e4 c5 2. Nf3 g6 3. d4 cxd4 4. Nxd4 Nc6 5. Nc3 Bg7 6. Be3 Nf6 7. Bc4 O-O 8. Bb3 a5 9. f3 d5 10. Bxd5 Nxd5 11. exd5 Nb4 12. Nde2 Bf5',
  },
  {
    name: `${HAD}, 5.Nc3 Bg7 6.Be3 Nf6 7.Bc4 O-O 8.Bb3 a5 9.O-O d6 10.f4`,
    weight: W_HAD,
    moves: '1. e4 c5 2. Nf3 g6 3. d4 cxd4 4. Nxd4 Nc6 5. Nc3 Bg7 6. Be3 Nf6 7. Bc4 O-O 8. Bb3 a5 9. O-O d6 10. f4 Bd7 11. h3 Rc8 12. Nde2 b5',
  },
  {
    name: `${HAD}, 5.Nc3 Bg7 6.Be3 Nf6 7.Bc4 O-O 8.Bb3 a5 9.a4`,
    weight: W_HAD,
    moves: '1. e4 c5 2. Nf3 g6 3. d4 cxd4 4. Nxd4 Nc6 5. Nc3 Bg7 6. Be3 Nf6 7. Bc4 O-O 8. Bb3 a5 9. a4 d6 10. f3 Bd7 11. Qd2 Nxd4 12. Bxd4 Bc6',
  },
  {
    name: `${HAD}, 5.Nc3 Bg7 6.Be3 Nf6 7.Bc4 O-O 8.Bb3 Ng4`,
    weight: 1,
    moves: '1. e4 c5 2. Nf3 g6 3. d4 cxd4 4. Nxd4 Nc6 5. Nc3 Bg7 6. Be3 Nf6 7. Bc4 O-O 8. Bb3 Ng4 9. Qxg4 Nxd4 10. Qd1 Nxb3 11. axb3 b6 12. O-O Bb7',
  },
  {
    name: `${HAD}, 5.Nc3 Bg7 6.Be3 Nf6 7.Bc4 d6`,
    weight: 1,
    moves: '1. e4 c5 2. Nf3 g6 3. d4 cxd4 4. Nxd4 Nc6 5. Nc3 Bg7 6. Be3 Nf6 7. Bc4 d6 8. f3 O-O 9. Qd2 Bd7 10. O-O-O Rc8 11. Bb3 Ne5 12. h4 Nc4',
  },
  {
    name: `${HAD}, 5.Nc3 Bg7 6.Be3 Nf6 7.Be2`,
    weight: W_HAD,
    moves: '1. e4 c5 2. Nf3 g6 3. d4 cxd4 4. Nxd4 Nc6 5. Nc3 Bg7 6. Be3 Nf6 7. Be2 O-O 8. Qd2 d5 9. exd5 Nxd5 10. Nxd5 Qxd5 11. Nxc6 Qxc6 12. O-O Bf5',
  },
  {
    name: `${HAD}, 5.Nc3 Bg7 6.Be3 Nf6 7.Nxc6`,
    weight: W_HAD,
    moves: '1. e4 c5 2. Nf3 g6 3. d4 cxd4 4. Nxd4 Nc6 5. Nc3 Bg7 6. Be3 Nf6 7. Nxc6 bxc6 8. e5 Ng8 9. Bd4 f6 10. exf6 Nxf6 11. Qd2 O-O 12. O-O-O d5',
  },
  {
    name: `${HAD}, 5.Nc3 Bg7 6.Be3 Nf6 7.f3`,
    weight: W_HAD,
    moves: '1. e4 c5 2. Nf3 g6 3. d4 cxd4 4. Nxd4 Nc6 5. Nc3 Bg7 6. Be3 Nf6 7. f3 O-O 8. Qd2 d5 9. exd5 Nxd5 10. Nxd5 Qxd5 11. Nxc6 Qxc6 12. Bc4 Bf5',
  },
  {
    name: `${HAD}, 5.Nc3 Bg7 6.Be3 Nf6 7.Bc4 O-O 8.f3`,
    weight: W_HAD,
    moves: '1. e4 c5 2. Nf3 g6 3. d4 cxd4 4. Nxd4 Nc6 5. Nc3 Bg7 6. Be3 Nf6 7. Bc4 O-O 8. f3 Qb6 9. Bb3 Nxe4 10. Nd5 Qa5+ 11. c3 Nc5 12. Nxc6 dxc6',
  },
  {
    name: `${HAD}, 5.Nc3 Bg7 6.Nxc6`,
    weight: W_HAD,
    moves: '1. e4 c5 2. Nf3 g6 3. d4 cxd4 4. Nxd4 Nc6 5. Nc3 Bg7 6. Nxc6 bxc6 7. Bc4 d6 8. O-O Nf6 9. Re1 O-O 10. Bf4 Nd7 11. Qd2 Nb6',
  },
  {
    name: `${HAD}, 5.Nc3 Bg7 6.Nb3`,
    weight: W_HAD,
    moves: '1. e4 c5 2. Nf3 g6 3. d4 cxd4 4. Nxd4 Nc6 5. Nc3 Bg7 6. Nb3 Nf6 7. Be2 O-O 8. O-O d6 9. Bg5 Be6 10. Kh1 a5 11. f4 Qb6',
  },
  {
    name: `${HAD}, 5.Nc3 Bg7 6.Bc4`,
    weight: W_HAD,
    moves: '1. e4 c5 2. Nf3 g6 3. d4 cxd4 4. Nxd4 Nc6 5. Nc3 Bg7 6. Bc4 Nf6 7. Nxc6 bxc6 8. e5 Ng4 9. Bf4 Qb6 10. Bb3 Qc5 11. Qe2 O-O',
  },
  {
    name: `${HAD}, 5.Nc3 Bg7 6.Be2`,
    weight: W_HAD,
    moves: '1. e4 c5 2. Nf3 g6 3. d4 cxd4 4. Nxd4 Nc6 5. Nc3 Bg7 6. Be2 Nf6 7. O-O O-O 8. Nb3 d6 9. Bg5 Be6 10. Kh1 a5 11. f4 Qb6',
  },
  {
    name: `${HAD}, 5.Nc3 Bg7 6.Be3 Nf6 7.Bc4 O-O 8.O-O`,
    weight: W_HAD,
    moves: '1. e4 c5 2. Nf3 g6 3. d4 cxd4 4. Nxd4 Nc6 5. Nc3 Bg7 6. Be3 Nf6 7. Bc4 O-O 8. O-O d6 9. Bb3 Bd7 10. h3 Rc8 11. f4 Nxd4 12. Bxd4 Bc6',
  },
  {
    name: `${HAD}, 4.Nxd4 Bg7`,
    weight: 1,
    moves: '1. e4 c5 2. Nf3 g6 3. d4 cxd4 4. Nxd4 Bg7 5. Nc3 Nc6 6. Be3 Nf6 7. Bc4 O-O 8. Bb3 d6 9. f3 Bd7 10. Qd2 Nxd4 11. Bxd4 b5 12. O-O-O a5',
  },
  {
    name: `${HAD}, 4.Nxd4 Nf6`,
    weight: 1,
    moves: '1. e4 c5 2. Nf3 g6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Be3 Bg7 7. Bc4 O-O 8. Bb3 d6 9. f3 Bd7 10. Qd2 Nxd4 11. Bxd4 b5 12. O-O-O a5',
  },
  {
    name: `${HAD}, 4.Qxd4 Nf6`,
    weight: W_HAD,
    moves: '1. e4 c5 2. Nf3 g6 3. d4 cxd4 4. Qxd4 Nf6 5. Nc3 Nc6 6. Qa4 d6 7. e5 dxe5 8. Nxe5 Bd7 9. Nxd7 Qxd7 10. Qb5 Rc8 11. Be3 Bg7',
  },
  {
    name: `${HAD}, 4.Qxd4 Nf6 5.e5`,
    weight: W_HAD,
    moves: '1. e4 c5 2. Nf3 g6 3. d4 cxd4 4. Qxd4 Nf6 5. e5 Nc6 6. Qa4 Nd5 7. Qe4 Nb6 8. Bb5 Bg7 9. Bxc6 dxc6 10. O-O O-O 11. Nc3 Bf5',
  },
  {
    name: `${HAD}, 4.Qxd4 Nf6 5.Nc3 Nc6 6.Qd1`,
    weight: W_HAD,
    moves: '1. e4 c5 2. Nf3 g6 3. d4 cxd4 4. Qxd4 Nf6 5. Nc3 Nc6 6. Qd1 Bg7 7. Be2 O-O 8. O-O d6 9. h3 Be6 10. Re1 Rc8 11. Bf1 Qa5',
  },
  {
    name: `${HAD}, 4.Qxd4 Nf6 5.Nc3 Nc6 6.Qd2`,
    weight: W_HAD,
    moves: '1. e4 c5 2. Nf3 g6 3. d4 cxd4 4. Qxd4 Nf6 5. Nc3 Nc6 6. Qd2 d6 7. b3 Bg7 8. Bb2 O-O 9. Bc4 Bg4 10. O-O-O Rc8 11. Bb5 Nd7',
  },
  {
    name: `${HAD}, 4.Qxd4 Nf6 5.Nc3 Nc6 6.Qa4 d6 7.Bb5`,
    weight: W_HAD,
    moves: '1. e4 c5 2. Nf3 g6 3. d4 cxd4 4. Qxd4 Nf6 5. Nc3 Nc6 6. Qa4 d6 7. Bb5 Bd7 8. O-O Bg7 9. Rd1 O-O 10. h3 a6 11. Bxc6 Bxc6',
  },
  {
    name: `${HAD}, 4.Qxd4 Nf6 5.Nc3 Nc6 6.Qa4 d6 7.e5 dxe5 8.Nxe5 Bd7 9.Nxd7 Qxd7 10.Bb5`,
    weight: W_HAD,
    moves: '1. e4 c5 2. Nf3 g6 3. d4 cxd4 4. Qxd4 Nf6 5. Nc3 Nc6 6. Qa4 d6 7. e5 dxe5 8. Nxe5 Bd7 9. Nxd7 Qxd7 10. Bb5 Rc8 11. O-O Bg7',
  },
  {
    name: `${HAD}, 3.c3 (Alapin-style)`,
    weight: W_HAD,
    moves: '1. e4 c5 2. Nf3 g6 3. c3 Bg7 4. d4 cxd4 5. cxd4 d5 6. e5 Nc6 7. Nc3 Nh6 8. Bb5 O-O 9. Bxc6 bxc6 10. O-O Bg4',
  },
  {
    name: `${HAD}, 3.c3 d5`,
    weight: 1,
    moves: '1. e4 c5 2. Nf3 g6 3. c3 d5 4. exd5 Qxd5 5. d4 Nf6 6. Be2 Bg7 7. O-O O-O 8. c4 Qd8 9. Nc3 cxd4 10. Nxd4 Nc6',
  },
  {
    name: `${HAD}, 3.c3 Bg7 4.d4 cxd4 5.cxd4 d5 6.exd5`,
    weight: W_HAD,
    moves: '1. e4 c5 2. Nf3 g6 3. c3 Bg7 4. d4 cxd4 5. cxd4 d5 6. exd5 Nf6 7. Bb5+ Nbd7 8. d6 exd6 9. Qe2+ Qe7 10. Qxe7+ Kxe7 11. Nc3 a6',
  },
  {
    name: `${HAD}, 3.c3 Bg7 4.d4 cxd4 5.cxd4 d5 6.e5 Nc6 7.Bb5`,
    weight: W_HAD,
    moves: '1. e4 c5 2. Nf3 g6 3. c3 Bg7 4. d4 cxd4 5. cxd4 d5 6. e5 Nc6 7. Bb5 Bg4 8. Nc3 Nh6 9. Bxc6+ bxc6 10. h3 Bxf3 11. Qxf3 O-O',
  },
  {
    name: `${HAD}, 3.c3 Bg7 4.d4 cxd4 5.cxd4 d5 6.e5 Nc6 7.Nc3 Bg4`,
    weight: W_HAD,
    moves: '1. e4 c5 2. Nf3 g6 3. c3 Bg7 4. d4 cxd4 5. cxd4 d5 6. e5 Nc6 7. Nc3 Bg4 8. Bb5 Bxf3 9. Qxf3 e6 10. O-O Nge7 11. Bg5 O-O',
  },
  {
    name: `${HAD}, 3.c3 Bg7 4.d4 d5`,
    weight: 1,
    moves: '1. e4 c5 2. Nf3 g6 3. c3 Bg7 4. d4 d5 5. e5 Nc6 6. Bb5 Bg4 7. Nbd2 cxd4 8. cxd4 Nh6 9. h3 Bxf3 10. Nxf3 O-O',
  },
  {
    name: `${HAD}, 3.c3 Bg7 4.d4 cxd4 5.cxd4 d5 6.e5 Nc6 7.Nc3 Nh6 8.Be2`,
    weight: W_HAD,
    moves: '1. e4 c5 2. Nf3 g6 3. c3 Bg7 4. d4 cxd4 5. cxd4 d5 6. e5 Nc6 7. Nc3 Nh6 8. Be2 O-O 9. O-O f6 10. exf6 exf6 11. Bf4 Nf5',
  },
  {
    name: `${HAD}, 3.c3 Bg7 4.d4 cxd4 5.cxd4 d5 6.e5 Nc6 7.Nc3 Nh6 8.Bf4`,
    weight: W_HAD,
    moves: '1. e4 c5 2. Nf3 g6 3. c3 Bg7 4. d4 cxd4 5. cxd4 d5 6. e5 Nc6 7. Nc3 Nh6 8. Bf4 Bg4 9. Be2 O-O 10. O-O f6 11. exf6 exf6',
  },
  {
    name: `${HAD}, 3.c3 Bg7 4.d4 cxd4 5.cxd4 d5 6.e5 Nc6 7.Nc3 Nh6 8.h3`,
    weight: W_HAD,
    moves: '1. e4 c5 2. Nf3 g6 3. c3 Bg7 4. d4 cxd4 5. cxd4 d5 6. e5 Nc6 7. Nc3 Nh6 8. h3 O-O 9. Bd3 f6 10. exf6 exf6 11. O-O Nf5',
  },
  {
    name: `${HAD}, 3.Bc4`,
    weight: W_HAD,
    moves: '1. e4 c5 2. Nf3 g6 3. Bc4 Bg7 4. c3 Nc6 5. d4 cxd4 6. cxd4 d6 7. O-O Nf6 8. Nc3 O-O 9. h3 Bd7 10. Re1 Rc8',
  },
  {
    name: `${HAD}, 3.Bc4 e6`,
    weight: 1,
    moves: '1. e4 c5 2. Nf3 g6 3. Bc4 e6 4. c3 Bg7 5. d4 cxd4 6. cxd4 Ne7 7. O-O O-O 8. Nc3 d5 9. exd5 exd5 10. Bb3 Nbc6',
  },
  {
    name: `${HAD}, 3.Nc3`,
    weight: W_HAD,
    moves: '1. e4 c5 2. Nf3 g6 3. Nc3 Bg7 4. d4 cxd4 5. Nxd4 Nc6 6. Be3 Nf6 7. Bc4 O-O 8. Bb3 d6 9. f3 Bd7 10. Qd2 Nxd4 11. Bxd4 b5 12. O-O-O a5',
  },
  {
    name: `${HAD}, 3.Nc3 Bg7 4.Bc4`,
    weight: W_HAD,
    moves: '1. e4 c5 2. Nf3 g6 3. Nc3 Bg7 4. Bc4 Nc6 5. d3 e6 6. O-O Nge7 7. Bg5 h6 8. Be3 d6 9. Qd2 O-O 10. Bh6 Bxh6 11. Qxh6 f5',
  },
  {
    name: `${HAD}, 3.Nc3 Bg7 4.g3`,
    weight: W_HAD,
    moves: '1. e4 c5 2. Nf3 g6 3. Nc3 Bg7 4. g3 Nc6 5. Bg2 d6 6. O-O e5 7. d3 Nge7 8. Be3 O-O 9. Qd2 Nd4 10. Nxd4 cxd4',
  },
  {
    name: `${HAD}, 3.Nc3 Bg7 4.Bb5`,
    weight: W_HAD,
    moves: '1. e4 c5 2. Nf3 g6 3. Nc3 Bg7 4. Bb5 Nc6 5. O-O Nd4 6. Nxd4 cxd4 7. Ne2 a6 8. Bd3 Nf6 9. c3 dxc3 10. bxc3 d6',
  },
  {
    name: `${HAD}, 3.Nc3 Bg7 4.d4 cxd4 5.Qxd4?!`,
    weight: W_HAD,
    moves: '1. e4 c5 2. Nf3 g6 3. Nc3 Bg7 4. d4 cxd4 5. Qxd4 Nf6 6. Qa4 Nc6 7. e5 Nd5 8. Nxd5 Qa5+ 9. Qxa5 Nxa5 10. Bd2 Nc6',
  },
  {
    name: `${HAD}, 3.d4 cxd4 4.c3?! (Morra-ish)`,
    weight: W_HAD,
    moves: '1. e4 c5 2. Nf3 g6 3. d4 cxd4 4. c3 dxc3 5. Nxc3 Bg7 6. Bc4 Nc6 7. O-O d6 8. Qe2 Nf6 9. Rd1 O-O 10. h3 Bd7',
  },
  {
    name: `${HAD}, 3.d4 cxd4 4.Bc4?!`,
    weight: W_HAD,
    moves: '1. e4 c5 2. Nf3 g6 3. d4 cxd4 4. Bc4 Bg7 5. c3 Nc6 6. cxd4 d6 7. O-O Nf6 8. Nc3 O-O 9. h3 Bd7 10. Re1 Rc8',
  },
  {
    name: `${HAD}, 3.d4 Bg7`,
    weight: 1,
    moves: '1. e4 c5 2. Nf3 g6 3. d4 Bg7 4. dxc5 Qa5+ 5. c3 Qxc5 6. Na3 Nc6 7. Be3 Qa5 8. Nb5 d6 9. Nbd4 Nf6 10. Bd3 O-O',
  },
];
