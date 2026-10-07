/**
 * Black vs the Anti-Sicilians. One solid answer each; the engine takes over
 * once the setup is in place. Names carry the White system so the opening
 * label (and Miles's reaction) is about what the opponent chose.
 */
import type { Line } from './types';

const SIC = 'Sicilian Defense';

export const BLACK_E4_ANTI: Line[] = [
  {
    name: `${SIC}: Alapin Variation, 2...Nf6`,
    weight: 2,
    moves: '1. e4 c5 2. c3 Nf6 3. e5 Nd5 4. d4 cxd4 5. Nf3 Nc6 6. cxd4 d6 7. Bc4 Nb6 8. Bb5 dxe5 9. Nxe5 Bd7 10. Nxd7 Qxd7 11. Nc3 e6 12. O-O Be7',
  },
  {
    name: `${SIC}: Alapin Variation, 2...Nf6 3.e5 Nd5 4.Nf3`,
    weight: 2,
    moves: '1. e4 c5 2. c3 Nf6 3. e5 Nd5 4. Nf3 Nc6 5. Bc4 Nb6 6. Bb3 c4 7. Bc2 Qc7 8. Qe2 g5 9. h3 Bg7 10. O-O Nxe5 11. Nxe5 Qxe5',
  },
  {
    name: `${SIC}: Alapin Variation, 2...Nf6 3.e5 Nd5 4.d4 cxd4 5.cxd4`,
    weight: 2,
    moves: '1. e4 c5 2. c3 Nf6 3. e5 Nd5 4. d4 cxd4 5. cxd4 d6 6. Nf3 Nc6 7. Bc4 Nb6 8. Bb5 dxe5 9. Nxe5 Bd7 10. Nxd7 Qxd7 11. Nc3 e6 12. O-O Be7',
  },
  {
    name: `${SIC}: Alapin Variation, 2...Nf6 3.e5 Nd5 4.Bc4`,
    weight: 2,
    moves: '1. e4 c5 2. c3 Nf6 3. e5 Nd5 4. Bc4 Nb6 5. Bb3 c4 6. Bc2 Qc7 7. Qe2 g5 8. Nf3 Nc6 9. h3 Bg7 10. O-O Nxe5 11. Nxe5 Qxe5',
  },
  {
    name: `${SIC}: Alapin Variation, 2...d5`,
    weight: 1,
    moves: '1. e4 c5 2. c3 d5 3. exd5 Qxd5 4. d4 Nf6 5. Nf3 Bg4 6. Be2 e6 7. h3 Bh5 8. O-O Nc6 9. Be3 cxd4 10. cxd4 Be7 11. Nc3 Qd6 12. Qb3 O-O',
  },
  {
    name: `${SIC}: Alapin Variation, 2...Nf6 3.Nf3?!`,
    weight: 2,
    moves: '1. e4 c5 2. c3 Nf6 3. Nf3 Nxe4 4. Qa4 Nf6',
  },
  {
    name: `${SIC}: Smith-Morra Gambit Declined`,
    weight: 2,
    moves: '1. e4 c5 2. d4 cxd4 3. c3 Nf6 4. e5 Nd5 5. Nf3 Nc6 6. cxd4 d6 7. Bc4 Nb6 8. Bb5 dxe5 9. Nxe5 Bd7 10. Nxd7 Qxd7 11. Nc3 e6 12. O-O Be7',
  },
  {
    name: `${SIC}: Smith-Morra Gambit Declined, 4.Qxd4`,
    weight: 2,
    moves: '1. e4 c5 2. d4 cxd4 3. c3 Nf6 4. Qxd4 Nc6 5. Qd1 d5 6. e5 Ne4 7. Nf3 e6 8. Bd3 Nc5 9. Bc2 Bd7 10. O-O Be7 11. Re1 Qc7',
  },
  {
    name: `${SIC}: Smith-Morra Gambit Accepted`,
    weight: 1,
    moves: '1. e4 c5 2. d4 cxd4 3. c3 dxc3 4. Nxc3 Nc6 5. Nf3 d6 6. Bc4 e6 7. O-O Nf6 8. Qe2 Be7 9. Rd1 e5 10. Be3 O-O 11. Rac1 Be6 12. Bxe6 fxe6',
  },
  {
    name: `${SIC}: Classical Variation, via 2.d4 cxd4 3.Nf3`,
    weight: 2,
    moves: '1. e4 c5 2. d4 cxd4 3. Nf3 Nc6 4. Nxd4 Nf6 5. Nc3 d6 6. Be3 e5 7. Nb3 Be6 8. f3 Be7 9. Qd2 O-O 10. O-O-O a5 11. Kb1 a4 12. Nc1 d5',
  },
  {
    name: `${SIC}: Smith-Morra, 3.Qxd4 (Chekhover-ish)`,
    weight: 2,
    moves: '1. e4 c5 2. d4 cxd4 3. Qxd4 Nc6 4. Qe3 Nf6 5. Nc3 e6 6. Nf3 Bb4 7. Bd2 O-O 8. a3 Be7 9. Bd3 d5 10. e5 Nd7 11. O-O f6',
  },
  {
    name: `${SIC}: Closed Sicilian, 3.g3`,
    weight: 2,
    moves: '1. e4 c5 2. Nc3 Nc6 3. g3 g6 4. Bg2 Bg7 5. d3 d6 6. Be3 e5 7. Qd2 Nge7 8. f4 Nd4 9. Nf3 Bg4 10. O-O O-O 11. Rae1 exf4 12. Bxf4 Qd7',
  },
  {
    name: `${SIC}: Closed Sicilian, 3.g3 g6 4.Bg2 Bg7 5.d3 d6 6.f4`,
    weight: 2,
    moves: '1. e4 c5 2. Nc3 Nc6 3. g3 g6 4. Bg2 Bg7 5. d3 d6 6. f4 e6 7. Nf3 Nge7 8. O-O O-O 9. Be3 Nd4 10. e5 Nef5 11. Bf2 dxe5 12. fxe5 b6',
  },
  {
    name: `${SIC}: Closed Sicilian, 3.g3 g6 4.Bg2 Bg7 5.d3 d6 6.Nh3`,
    weight: 2,
    moves: '1. e4 c5 2. Nc3 Nc6 3. g3 g6 4. Bg2 Bg7 5. d3 d6 6. Nh3 e5 7. O-O Nge7 8. f4 exf4 9. Nxf4 O-O 10. Be3 Nd4 11. Qd2 Be6 12. Rf2 Qd7',
  },
  {
    name: `${SIC}: Hyper-Accelerated Dragon, via 2.Nc3 Nc6 3.Nge2`,
    weight: 2,
    moves: '1. e4 c5 2. Nc3 Nc6 3. Nge2 g6 4. d4 cxd4 5. Nxd4 Bg7 6. Be3 Nf6 7. Bc4 O-O 8. Bb3 a5 9. f3 d5 10. exd5 Nb4 11. Nde2 Nfxd5 12. Nxd5 Nxd5',
  },
  {
    name: `${SIC}: Hyper-Accelerated Dragon, via 2.Nc3 Nc6 3.Nf3`,
    weight: 2,
    moves: '1. e4 c5 2. Nc3 Nc6 3. Nf3 g6 4. d4 cxd4 5. Nxd4 Bg7 6. Be3 Nf6 7. Bc4 O-O 8. Bb3 a5 9. f3 d5 10. exd5 Nb4 11. Nde2 Nfxd5 12. Nxd5 Nxd5',
  },
  {
    name: `${SIC}: Closed Sicilian, 3.Bb5 (Rossolimo-style)`,
    weight: 2,
    moves: '1. e4 c5 2. Nc3 Nc6 3. Bb5 Nd4 4. Bc4 e6 5. Nge2 Nf6 6. O-O a6 7. d3 d5 8. exd5 exd5 9. Bb3 Nxb3 10. axb3 Be7 11. Bg5 O-O 12. Nf4 Be6',
  },
  {
    name: `${SIC}: Closed Sicilian, 3.d3`,
    weight: 2,
    moves: '1. e4 c5 2. Nc3 Nc6 3. d3 g6 4. g3 Bg7 5. Bg2 d6 6. f4 e6 7. Nf3 Nge7 8. O-O O-O 9. Be3 Nd4 10. e5 Nef5 11. Bf2 dxe5 12. fxe5 b6',
  },
  {
    name: `${SIC}: Grand Prix Attack`,
    weight: 2,
    moves: '1. e4 c5 2. Nc3 Nc6 3. f4 g6 4. Nf3 Bg7 5. Bb5 Nd4 6. O-O Nxb5 7. Nxb5 d5 8. exd5 a6 9. Nc3 Nf6 10. d3 O-O 11. Qe1 Nxd5 12. Nxd5 Qxd5',
  },
  {
    name: `${SIC}: Grand Prix Attack, 5.Bc4`,
    weight: 2,
    moves: '1. e4 c5 2. Nc3 Nc6 3. f4 g6 4. Nf3 Bg7 5. Bc4 e6 6. f5 Nge7 7. fxe6 fxe6 8. d3 d5 9. Bb3 O-O 10. O-O Na5 11. Qe1 Nxb3 12. axb3 Qd6',
  },
  {
    name: `${SIC}: Grand Prix Attack, 5.Bb5 Nd4 6.Bd3`,
    weight: 2,
    moves: '1. e4 c5 2. Nc3 Nc6 3. f4 g6 4. Nf3 Bg7 5. Bb5 Nd4 6. Bd3 d6 7. Nxd4 cxd4 8. Ne2 Nf6 9. O-O O-O 10. c3 dxc3 11. bxc3 Qb6+ 12. Kh1 Ng4',
  },
  {
    name: `${SIC}: Grand Prix Attack, 2.f4 move order`,
    weight: 2,
    moves: '1. e4 c5 2. f4 d5 3. exd5 Nf6 4. Bb5+ Bd7 5. Bxd7+ Qxd7 6. c4 e6 7. Qe2 Bd6 8. dxe6 Qxe6 9. Qxe6+ fxe6 10. Nf3 Nc6 11. O-O O-O 12. d3 Rae8',
  },
  {
    name: `${SIC}: Grand Prix Attack, 2.f4 d5 3.Nc3`,
    weight: 2,
    moves: '1. e4 c5 2. f4 d5 3. Nc3 d4 4. Nce2 Nc6 5. Nf3 g6 6. d3 Bg7 7. g3 e5 8. Bg2 Nge7 9. O-O O-O 10. Nd2 exf4 11. gxf4 f5',
  },
  {
    name: `${SIC}: Closed Sicilian, 2.Nc3 d6`,
    weight: 1,
    moves: '1. e4 c5 2. Nc3 d6 3. f4 g6 4. Nf3 Bg7 5. Bc4 Nc6 6. O-O e6 7. d3 Nge7 8. Qe1 O-O 9. f5 exf5 10. Qh4 d5 11. Bb3 fxe4 12. dxe4 dxe4',
  },
  {
    name: `${SIC}: Canal Attack (3.Bb5+)`,
    weight: 2,
    moves: '1. e4 c5 2. Nf3 d6 3. Bb5+ Bd7 4. Bxd7+ Qxd7 5. O-O Nc6 6. c3 Nf6 7. Re1 e6 8. d4 cxd4 9. cxd4 d5 10. e5 Ne4 11. Nbd2 Nxd2 12. Bxd2 Be7',
  },
  {
    name: `${SIC}: Canal Attack, 4.Bxd7+ Qxd7 5.c4`,
    weight: 2,
    moves: '1. e4 c5 2. Nf3 d6 3. Bb5+ Bd7 4. Bxd7+ Qxd7 5. c4 Nc6 6. Nc3 g6 7. d4 cxd4 8. Nxd4 Bg7 9. Nde2 Nf6 10. O-O O-O 11. f3 a6 12. Be3 Rfc8',
  },
  {
    name: `${SIC}: Canal Attack, 4.Bxd7+ Qxd7 5.O-O Nc6 6.Re1`,
    weight: 2,
    moves: '1. e4 c5 2. Nf3 d6 3. Bb5+ Bd7 4. Bxd7+ Qxd7 5. O-O Nc6 6. Re1 Nf6 7. c3 e6 8. d4 cxd4 9. cxd4 d5 10. e5 Ne4 11. Nbd2 Nxd2 12. Bxd2 Be7',
  },
  {
    name: `${SIC}: Canal Attack, 3...Nd7`,
    weight: 1,
    moves: '1. e4 c5 2. Nf3 d6 3. Bb5+ Nd7 4. d4 cxd4 5. Qxd4 a6 6. Bxd7+ Bxd7 7. Nc3 e5 8. Qd3 h6 9. Nd5 Rc8 10. O-O Bc6 11. c4 Nf6 12. Nxf6+ Qxf6',
  },
  {
    name: `${SIC}: Canal Attack, 4.a4`,
    weight: 2,
    moves: '1. e4 c5 2. Nf3 d6 3. Bb5+ Bd7 4. a4 Nc6 5. O-O Nf6 6. Re1 a6 7. Bf1 Bg4 8. c3 e6 9. h3 Bh5 10. d3 Be7 11. Nbd2 O-O',
  },
  {
    name: `${SIC}: Rossolimo Variation (2...g6 3.Bb5)`,
    weight: 2,
    moves: '1. e4 c5 2. Nf3 g6 3. Bb5 Bg7 4. O-O Nc6 5. Re1 e5 6. Bxc6 dxc6 7. d3 Qe7 8. Nbd2 Nf6 9. Nc4 Nd7 10. a4 O-O 11. Be3 b6 12. Qd2 Bb7',
  },
  {
    name: `${SIC}: Rossolimo Variation, 4.O-O Nc6 5.c3`,
    weight: 2,
    moves: '1. e4 c5 2. Nf3 g6 3. Bb5 Bg7 4. O-O Nc6 5. c3 Nf6 6. Re1 O-O 7. d4 cxd4 8. cxd4 d5 9. e5 Ne4 10. Nc3 Nxc3 11. bxc3 Na5 12. Bd3 b6',
  },
  {
    name: `${SIC}: Rossolimo Variation, 3.Bb5 Bg7 4.Bxc6?!`,
    weight: 2,
    moves: '1. e4 c5 2. Nf3 g6 3. Bb5 Bg7 4. c3 Nf6 5. e5 Nd5 6. O-O O-O 7. d4 cxd4 8. cxd4 d6 9. exd6 exd6 10. Nc3 Nc6 11. Bg5 Qb6 12. Na4 Qa5',
  },
  {
    name: `${SIC}: Wing Gambit`,
    weight: 2,
    moves: '1. e4 c5 2. b4 cxb4 3. a3 d5 4. exd5 Qxd5 5. Nf3 e5 6. axb4 Bxb4 7. c3 Be7 8. Na3 Nc6 9. Nb5 Kf8 10. d4 exd4 11. Nbxd4 Nxd4 12. Qxd4 Qxd4',
  },
  {
    name: `${SIC}: Wing Gambit, 3.a3 d5 4.exd5 Qxd5 5.axb4`,
    weight: 2,
    moves: '1. e4 c5 2. b4 cxb4 3. a3 d5 4. exd5 Qxd5 5. axb4 Qe5+ 6. Be2 Qxa1 7. Nc3 Qxc3 8. dxc3 Nf6 9. Nf3 e6 10. O-O Nc6 11. b5 Nb8 12. Bb2 Be7',
  },
  {
    name: `${SIC}: Wing Gambit, 3.c3`,
    weight: 2,
    moves: '1. e4 c5 2. b4 cxb4 3. c3 bxc3 4. Nxc3 Nc6 5. Nf3 d6 6. Bc4 e6 7. O-O Nf6 8. Qe2 Be7 9. Rd1 O-O 10. d4 d5 11. exd5 exd5 12. Bb5 Bg4',
  },
  {
    name: `${SIC}: Wing Gambit, 3.Bb2?!`,
    weight: 2,
    moves: '1. e4 c5 2. b4 cxb4 3. Bb2 Nf6 4. e5 Nd5 5. Nf3 Nc6 6. c4 bxc3 7. Nxc3 Nxc3 8. Bxc3 d6 9. exd6 Qxd6 10. Be2 e5 11. O-O Be7 12. d4 exd4',
  },
  {
    name: `${SIC}: Snyder Variation (2.b3)`,
    weight: 2,
    moves: '1. e4 c5 2. b3 Nc6 3. Bb2 d6 4. Nf3 Nf6 5. Bb5 Bd7 6. O-O e6 7. Bxc6 Bxc6 8. Re1 Be7 9. d4 cxd4',
  },
  {
    name: `${SIC}: Snyder Variation, 2.b3 Nc6 3.Bb2 e5`,
    weight: 1,
    moves: '1. e4 c5 2. b3 Nc6 3. Bb2 e5 4. Bb5 d6 5. Ne2 Nf6 6. O-O Be7 7. c3 O-O 8. d4 Bd7 9. Nd2 a6 10. Bxc6 Bxc6 11. d5 Bd7 12. c4 b5',
  },
  {
    name: `${SIC}: King's Indian Attack (2.d3)`,
    weight: 2,
    moves: '1. e4 c5 2. d3 Nc6 3. Nf3 g6 4. g3 Bg7 5. Bg2 d6 6. O-O e5 7. c3 Nge7 8. Nbd2 O-O 9. a3 a5 10. Re1 h6 11. Nf1 Be6 12. Ne3 Qd7',
  },
  {
    name: `${SIC}: King's Indian Attack (2.Nf3 d6 3.d3)`,
    weight: 2,
    moves: '1. e4 c5 2. Nf3 d6 3. d3 Nc6 4. g3 g6 5. Bg2 Bg7 6. O-O e5 7. c3 Nge7 8. Nbd2 O-O 9. a3 a5 10. Re1 h6 11. Nf1 Be6 12. Ne3 Qd7',
  },
  {
    name: `${SIC}: King's Indian Attack (2.Nf3 d6 3.g3)`,
    weight: 2,
    moves: '1. e4 c5 2. Nf3 d6 3. g3 Nc6 4. Bg2 g6 5. O-O Bg7 6. c3 e5 7. d3 Nge7 8. Nbd2 O-O 9. a3 a5 10. Re1 h6 11. Nf1 Be6 12. Ne3 Qd7',
  },
  {
    name: `${SIC}: King's Indian Attack (2.g3)`,
    weight: 2,
    moves: '1. e4 c5 2. g3 Nc6 3. Bg2 g6 4. d3 Bg7 5. f4 d6 6. Nf3 e6 7. O-O Nge7 8. c3 O-O 9. Be3 b6 10. Na3 Bb7 11. Qe2 d5 12. e5 d4',
  },
  {
    name: `${SIC}: Bowdler Attack (2.Bc4)`,
    weight: 2,
    moves: '1. e4 c5 2. Bc4 e6 3. Nc3 Nc6 4. Nf3 a6 5. a3 d6 6. d4 cxd4 7. Nxd4 Nf6 8. Nxc6 bxc6 9. e5 dxe5 10. Qxd8+ Kxd8',
  },
  {
    name: `${SIC}: Bowdler Attack, 2.Bc4 e6 3.Nf3`,
    weight: 2,
    moves: '1. e4 c5 2. Bc4 e6 3. Nf3 Nc6 4. O-O a6 5. a4 Nf6 6. Nc3 d5 7. exd5 exd5 8. Ba2 Be7 9. d4 c4 10. Re1 O-O 11. Ne5 Nxe5 12. dxe5 Ng4',
  },
  {
    name: `${SIC}: Bowdler Attack, 2.Bc4 e6 3.d3`,
    weight: 2,
    moves: '1. e4 c5 2. Bc4 e6 3. d3 Nc6 4. Nf3 a6 5. a4 d5 6. exd5 exd5 7. Ba2 Nf6 8. O-O Be7 9. Re1 O-O 10. Nc3 Be6 11. Bg5 h6 12. Bh4 Qb6',
  },
  {
    name: `${SIC}: Chekhover Variation (4.Qxd4)`,
    weight: 2,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Qxd4 Nc6 5. Bb5 Bd7 6. Bxc6 Bxc6 7. Nc3 Nf6 8. Bg5 e6 9. O-O-O Be7 10. Rhe1 O-O 11. Kb1 Qa5 12. Qd2 Rfd8',
  },
  {
    name: `${SIC}: Chekhover Variation, 5.Bb5 Bd7 6.Bxc6 Bxc6 7.c4`,
    weight: 2,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Qxd4 Nc6 5. Bb5 Bd7 6. Bxc6 Bxc6 7. c4 Nf6 8. Nc3 g6 9. O-O Bg7 10. Qd3 O-O 11. Nd4 Qb6 12. Nxc6 bxc6',
  },
  {
    name: `${SIC}: Prins Variation (5.f3)`,
    weight: 2,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. f3 e5 6. Nb3 Be7 7. c4 O-O 8. Be3 a5 9. Nc3 a4 10. Nd2 a3 11. b3 Nc6 12. Be2 Nd7',
  },
  {
    name: `${SIC}: Prins Variation, 5.f3 e5 6.Bb5+`,
    weight: 2,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. f3 e5 6. Bb5+ Nbd7 7. Nf5 d5 8. exd5 a6 9. Bxd7+ Bxd7 10. Ne3 Bb4+ 11. c3 Bd6 12. O-O O-O',
  },
  {
    name: `${SIC}: 2.Nf3 d6 3.c3 (Delayed Alapin)`,
    weight: 2,
    moves: '1. e4 c5 2. Nf3 d6 3. c3 Nf6 4. Be2 Nc6 5. d4 cxd4 6. cxd4 Nxe4 7. d5 Qa5+ 8. Nc3 Nxc3 9. bxc3 Ne5 10. Nxe5 dxe5 11. Qb3 Qc7 12. O-O Bd7',
  },
  {
    name: `${SIC}: 2.Nf3 d6 3.c3 Nf6 4.Bd3`,
    weight: 2,
    moves: '1. e4 c5 2. Nf3 d6 3. c3 Nf6 4. Bd3 Nc6 5. Bc2 Bg4 6. d3 e6 7. Nbd2 Be7 8. h3 Bh5 9. O-O O-O 10. Re1 d5 11. Qe2 Qc7 12. Nf1 Rad8',
  },
  {
    name: `${SIC}: 2.Nf3 d6 3.c3 Nf6 4.h3`,
    weight: 2,
    moves: '1. e4 c5 2. Nf3 d6 3. c3 Nf6 4. h3 Nc6 5. Bd3 g6 6. O-O Bg7 7. Bc2 O-O 8. d3 e5 9. Nbd2 b6 10. Re1 Bb7 11. Nf1 d5 12. Ng3 Qc7',
  },
  {
    name: `${SIC}: 2.Nf3 d6 3.Bc4`,
    weight: 2,
    moves: '1. e4 c5 2. Nf3 d6 3. Bc4 Nf6 4. d3 Nc6 5. O-O e6 6. Bb3 Be7 7. c3 O-O 8. Re1 d5 9. exd5 exd5 10. Nbd2 Re8 11. Nf1 h6 12. Ng3 Bd6',
  },
  {
    name: `${SIC}: Najdorf Variation, via 3.Nc3`,
    weight: 2,
    moves: '1. e4 c5 2. Nf3 d6 3. Nc3 Nf6 4. d4 cxd4 5. Nxd4 a6 6. Be3 e5 7. Nb3 Be6 8. f3 Be7 9. Qd2 O-O 10. O-O-O Nbd7 11. g4 b5 12. g5 b4',
  },
  {
    name: `${SIC}: 2.Nf3 d6 3.b3`,
    weight: 2,
    moves: '1. e4 c5 2. Nf3 d6 3. b3 Nf6 4. Nc3 Nc6 5. Bb5 Bd7 6. Bb2 e6 7. O-O Be7 8. Re1 O-O 9. Bxc6 Bxc6 10. d4 cxd4 11. Nxd4 Qb6 12. Nxc6 Qxc6',
  },
  {
    name: `${SIC}: 2.Nf3 d6 3.Bb5+ Bd7 4.Bxd7+ Nxd7`,
    weight: 1,
    moves: '1. e4 c5 2. Nf3 d6 3. Bb5+ Bd7 4. Bxd7+ Nxd7 5. O-O Ngf6 6. Re1 e6 7. c3 Be7 8. d4 O-O 9. Nbd2 cxd4 10. cxd4 d5 11. e5 Ne8 12. Nf1 Nc7',
  },
  {
    name: `${SIC}: Hyper-Accelerated Dragon, Maroczy Bind via 3.c4`,
    weight: 2,
    moves: '1. e4 c5 2. Nf3 g6 3. c4 Bg7 4. d4 cxd4 5. Nxd4 Nc6 6. Be3 Nf6 7. Nc3 O-O 8. Be2 d6 9. O-O Bd7 10. Qd2 Nxd4 11. Bxd4 Bc6 12. f3 a5',
  },
  {
    name: `${SIC}: 2.Nf3 g6 3.h4?!`,
    weight: 2,
    moves: '1. e4 c5 2. Nf3 g6 3. h4 Bg7 4. h5 Nc6 5. hxg6 hxg6 6. Rxh8 Bxh8 7. c3 Nf6 8. d3 d5 9. e5 Ng4 10. d4 cxd4 11. cxd4 Qb6 12. Qe2 Bf5',
  },
  {
    name: `${SIC}: 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Bd3?!`,
    weight: 2,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Bd3 Nc6 6. Nxc6 bxc6 7. O-O e5 8. Nd2 Be7 9. Nc4 O-O 10. Bg5 Nd7 11. Bxe7 Qxe7 12. Qg4 Nb6',
  },
  {
    name: `${SIC}: Najdorf Variation, via 3.d4 Nf6 4.Nc3`,
    weight: 2,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 Nf6 4. Nc3 cxd4 5. Nxd4 a6 6. Be3 e5 7. Nb3 Be6 8. f3 Be7 9. Qd2 O-O 10. O-O-O Nbd7 11. g4 b5 12. g5 b4',
  },
  {
    name: `${SIC}: 2.Nf3 d6 3.d4 cxd4 4.c3 (Morra-style)`,
    weight: 2,
    moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. c3 Nf6 5. e5 dxe5 6. Nxe5 e6 7. cxd4 Bb4+ 8. Nc3 O-O 9. Bd3 Nc6 10. Nxc6 bxc6 11. O-O Bxc3 12. bxc3 Qd5',
  },
  {
    name: `${SIC}: Hyper-Accelerated Dragon, via 2.Ne2`,
    weight: 2,
    moves: '1. e4 c5 2. Ne2 Nc6 3. Nbc3 g6 4. d4 cxd4 5. Nxd4 Bg7 6. Be3 Nf6 7. Bc4 O-O 8. Bb3 a5 9. f3 d5 10. exd5 Nb4 11. Nde2 Nfxd5 12. Nxd5 Nxd5',
  },
  {
    name: `${SIC}: 2.Ne2 Nc6 3.g3`,
    weight: 2,
    moves: '1. e4 c5 2. Ne2 Nc6 3. g3 g6 4. Bg2 Bg7 5. c3 d6 6. d4 cxd4 7. cxd4 Nf6 8. Nbc3 O-O 9. O-O Bg4 10. f3 Bd7 11. Be3 Rc8 12. d5 Ne5',
  },
  {
    name: `${SIC}: 2.c4 (Staunton-Cochrane)`,
    weight: 2,
    moves: '1. e4 c5 2. c4 Nc6 3. Nc3 g6 4. g3 Bg7 5. Bg2 d6 6. Nge2 e6 7. O-O Nge7 8. d3 O-O 9. Be3 Nd4 10. Qd2 Nec6 11. Rab1 Rb8 12. a3 a6',
  },
  {
    name: `${SIC}: 2.Na3?!`,
    weight: 2,
    moves: '1. e4 c5 2. Na3 Nc6 3. Nf3 g6 4. Bc4 Bg7 5. O-O e6 6. c3 Nge7 7. d4 cxd4 8. cxd4 d5 9. exd5 Nxd5 10. Re1 O-O 11. Bg5 Qb6 12. Nc2 Bd7',
  },
  {
    name: `${SIC}: 2.d3 Nc6 3.g3 g6 4.Bg2 Bg7 5.f4 (Big Clamp)`,
    weight: 2,
    moves: '1. e4 c5 2. d3 Nc6 3. g3 g6 4. Bg2 Bg7 5. f4 d6 6. Nf3 e6 7. O-O Nge7 8. c3 O-O 9. Be3 b6 10. Na3 Bb7 11. Qe2 d5 12. e5 d4',
  },
  {
    name: `${SIC}: 2.a3?!`,
    weight: 2,
    moves: '1. e4 c5 2. a3 Nc6 3. b4 cxb4 4. axb4 Nxb4 5. c3 Nc6 6. d4 d5 7. exd5 Qxd5 8. Na3 Nf6 9. Nb5 Qd8 10. Nf3 e6 11. Bd3 Be7 12. O-O O-O',
  },
  {
    name: `${SIC}: 2.Bb5?!`,
    weight: 2,
    moves: '1. e4 c5 2. Bb5 Nc6 3. Nf3 g6 4. O-O Bg7 5. Re1 e5 6. Bxc6 dxc6 7. d3 Qe7 8. Nbd2 Nf6 9. Nc4 Nd7 10. a4 O-O 11. Be3 b6 12. Qd2 Bb7',
  },
];
