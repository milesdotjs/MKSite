/**
 * Miles with Black against everything that is not 1.e4.
 *
 *   1.d4   Semi-Slav most of the time (weight 3); sometimes the Queen's Indian
 *          (weight 1.2), occasionally the Nimzo-Indian (weight 0.8). The fork
 *          is at move one: 1...d5 heads for the Semi-Slav, 1...Nf6 for the
 *          Indians, and which Indian it becomes depends on White's third move.
 *   1.c4 / 1.Nf3 / the rest   steer back into Semi-Slav structures where
 *          possible, otherwise sensible development and let the engine play.
 */
import type { Line } from './types';

const SS = 'Semi-Slav Defense';

const W_SS = 3;

export const BLACK_D4_LINES: Line[] = [
  // ─── Semi-Slav ────────────────────────────────────────────────────────────
  {
    name: `${SS}: Meran Variation`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. Nf3 e6 5. e3 Nbd7 6. Bd3 dxc4 7. Bxc4 b5 8. Bd3 Bb7 9. O-O a6 10. e4 c5 11. d5 Qc7 12. dxe6 fxe6',
  },
  {
    name: `${SS}: Meran, 8.Be2`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. Nf3 e6 5. e3 Nbd7 6. Bd3 dxc4 7. Bxc4 b5 8. Be2 Bb7 9. O-O Be7 10. e4 b4 11. e5 bxc3 12. exf6 Bxf6',
  },
  {
    name: `${SS}: Meran, 8.Bd3 Bb7 9.e4`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. Nf3 e6 5. e3 Nbd7 6. Bd3 dxc4 7. Bxc4 b5 8. Bd3 Bb7 9. e4 b4 10. Na4 c5 11. e5 Nd5 12. O-O cxd4',
  },
  {
    name: `${SS}: Meran, 8.Bd3 a6 (Wade)`,
    weight: 1,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. Nf3 e6 5. e3 Nbd7 6. Bd3 dxc4 7. Bxc4 b5 8. Bd3 a6 9. e4 c5 10. e5 cxd4 11. Nxb5 axb5 12. exf6 gxf6',
  },
  {
    name: `${SS}: Meran, 8.Bb3`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. Nf3 e6 5. e3 Nbd7 6. Bd3 dxc4 7. Bxc4 b5 8. Bb3 b4 9. Ne2 Bb7 10. O-O Be7 11. Ng3 O-O 12. e4 c5',
  },
  {
    name: `${SS}: Meran, 7.Bxc4 b5 8.Bd3 Bb7 9.a3`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. Nf3 e6 5. e3 Nbd7 6. Bd3 dxc4 7. Bxc4 b5 8. Bd3 Bb7 9. a3 b4 10. Ne4 Nxe4 11. Bxe4 bxa3 12. O-O Be7',
  },
  {
    name: `${SS}: Meran, 7.Bxc4 b5 8.Bd3 Bb7 9.O-O b4`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. Nf3 e6 5. e3 Nbd7 6. Bd3 dxc4 7. Bxc4 b5 8. Bd3 Bb7 9. O-O b4 10. Ne4 Be7 11. Nxf6+ Nxf6 12. e4 O-O',
  },
  {
    name: `${SS}: Anti-Meran, 6.Qc2 Bd6`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. Nf3 e6 5. e3 Nbd7 6. Qc2 Bd6 7. Bd3 O-O 8. O-O dxc4 9. Bxc4 a6 10. Rd1 b5 11. Be2 Qc7 12. e4 e5',
  },
  {
    name: `${SS}: Anti-Meran, 6.Qc2 Bd6 7.Be2`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. Nf3 e6 5. e3 Nbd7 6. Qc2 Bd6 7. Be2 O-O 8. O-O dxc4 9. Bxc4 e5 10. h3 Qe7 11. Rd1 exd4 12. exd4 Nb6',
  },
  {
    name: `${SS}: Anti-Meran, 6.Qc2 Bd6 7.g4 (Shirov-Shabalov)`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. Nf3 e6 5. e3 Nbd7 6. Qc2 Bd6 7. g4 Nxg4 8. Rg1 Qf6 9. Rxg4 Qxf3 10. Rxg7 Nf6 11. Bd2 Bd7',
  },
  {
    name: `${SS}: Anti-Meran, 6.Qc2 Bd6 7.b3`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. Nf3 e6 5. e3 Nbd7 6. Qc2 Bd6 7. b3 O-O 8. Be2 b6 9. O-O Bb7 10. Bb2 Qe7 11. Rad1 Rad8',
  },
  {
    name: `${SS}: Anti-Meran, 6.Qc2 Bd6 7.Bd3 O-O 8.O-O dxc4 9.Bxc4 e5`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. Nf3 e6 5. e3 Nbd7 6. Qc2 Bd6 7. Bd3 O-O 8. O-O dxc4 9. Bxc4 e5 10. h3 Qe7 11. Rd1 exd4 12. exd4 Nb6',
  },
  {
    name: `${SS}: Anti-Meran, 6.Qc2 Bd6 7.Bd3 O-O 8.O-O dxc4 9.Bxc4 a6 10.a4`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. Nf3 e6 5. e3 Nbd7 6. Qc2 Bd6 7. Bd3 O-O 8. O-O dxc4 9. Bxc4 a6 10. a4 c5 11. Rd1 Qc7 12. dxc5 Bxc5',
  },
  {
    name: `${SS}: Anti-Meran, 6.Qc2 Bd6 7.Bd3 O-O 8.O-O e5`,
    weight: 1,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. Nf3 e6 5. e3 Nbd7 6. Qc2 Bd6 7. Bd3 O-O 8. O-O e5 9. cxd5 cxd5 10. e4 exd4 11. Nxd5 Nxd5 12. exd5 Nf6',
  },
  {
    name: `${SS}: Moscow Variation (5.Bg5 h6)`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. Nf3 e6 5. Bg5 h6 6. Bxf6 Qxf6 7. e3 Nd7 8. Bd3 dxc4 9. Bxc4 g6 10. O-O Bg7 11. e4 O-O 12. e5 Qe7',
  },
  {
    name: `${SS}: Moscow, 7.Qb3`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. Nf3 e6 5. Bg5 h6 6. Bxf6 Qxf6 7. Qb3 Nd7 8. e4 dxe4 9. Nxe4 Qf4 10. Bd3 Be7 11. O-O O-O 12. Rfe1 e5',
  },
  {
    name: `${SS}: Moscow, 7.e3 Nd7 8.Bd3 dxc4 9.Bxc4 g6 10.O-O Bg7 11.Rc1`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. Nf3 e6 5. Bg5 h6 6. Bxf6 Qxf6 7. e3 Nd7 8. Bd3 dxc4 9. Bxc4 g6 10. O-O Bg7 11. Rc1 O-O 12. e4 e5',
  },
  {
    name: `${SS}: Moscow, 7.e3 Nd7 8.Bd3 dxc4 9.Bxc4 Bd6`,
    weight: 1,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. Nf3 e6 5. Bg5 h6 6. Bxf6 Qxf6 7. e3 Nd7 8. Bd3 dxc4 9. Bxc4 Bd6 10. O-O O-O 11. e4 e5 12. d5 Nb6',
  },
  {
    name: `${SS}: Moscow, 7.e3 Nd7 8.Be2`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. Nf3 e6 5. Bg5 h6 6. Bxf6 Qxf6 7. e3 Nd7 8. Be2 g6 9. O-O Bg7 10. Rc1 O-O 11. c5 e5 12. b4 e4',
  },
  {
    name: `${SS}: Moscow, 7.e3 Nd7 8.Qc2`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. Nf3 e6 5. Bg5 h6 6. Bxf6 Qxf6 7. e3 Nd7 8. Qc2 g6 9. Bd3 Bg7 10. O-O O-O 11. e4 dxc4 12. Bxc4 e5',
  },
  {
    name: `${SS}: Moscow, 7.e3 Nd7 8.Rc1`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. Nf3 e6 5. Bg5 h6 6. Bxf6 Qxf6 7. e3 Nd7 8. Rc1 g6 9. Bd3 Bg7 10. O-O O-O 11. e4 dxc4 12. Bxc4 e5',
  },
  {
    name: `${SS}: Moscow, 7.e3 Nd7 8.a3`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. Nf3 e6 5. Bg5 h6 6. Bxf6 Qxf6 7. e3 Nd7 8. a3 g6 9. Bd3 Bg7 10. O-O O-O 11. e4 dxc4 12. Bxc4 e5',
  },
  {
    name: `${SS}: Moscow, 7.e3 Nd7 8.cxd5`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. Nf3 e6 5. Bg5 h6 6. Bxf6 Qxf6 7. e3 Nd7 8. cxd5 exd5 9. Bd3 Bd6 10. O-O O-O 11. e4 dxe4 12. Nxe4 Qe7',
  },
  {
    name: `${SS}: Moscow, 7.e3 Nd7 8.Bd3 dxc4 9.Bxc4 g6 10.e4`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. Nf3 e6 5. Bg5 h6 6. Bxf6 Qxf6 7. e3 Nd7 8. Bd3 dxc4 9. Bxc4 g6 10. e4 Bg7 11. O-O O-O 12. e5 Qe7',
  },
  {
    name: `${SS}: Anti-Moscow Gambit (6.Bh4)`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. Nf3 e6 5. Bg5 h6 6. Bh4 dxc4 7. e4 g5 8. Bg3 b5 9. Be2 Bb7 10. O-O Nbd7 11. Ne5 Bg7 12. Nxd7 Nxd7',
  },
  {
    name: `${SS}: Anti-Moscow Gambit, 9.Be2 Bb7 10.h4`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. Nf3 e6 5. Bg5 h6 6. Bh4 dxc4 7. e4 g5 8. Bg3 b5 9. Be2 Bb7 10. h4 g4 11. Ne5 h5 12. O-O Nbd7',
  },
  {
    name: `${SS}: Anti-Moscow Gambit, 9.Ne5`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. Nf3 e6 5. Bg5 h6 6. Bh4 dxc4 7. e4 g5 8. Bg3 b5 9. Ne5 h5 10. h4 g4 11. Be2 Bb7 12. O-O Nbd7',
  },
  {
    name: `${SS}: Anti-Moscow Gambit, 7.e3`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. Nf3 e6 5. Bg5 h6 6. Bh4 dxc4 7. e3 b5 8. a4 Bb4 9. Be2 Bb7 10. O-O a6 11. Ne5 Nd5 12. Nxd5 cxd5',
  },
  {
    name: `${SS}: Anti-Moscow Gambit, 7.a4`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. Nf3 e6 5. Bg5 h6 6. Bh4 dxc4 7. a4 Bb4 8. e3 b5 9. axb5 cxb5 10. Be2 Bb7 11. O-O Nbd7 12. Qc2 Qb6',
  },
  {
    name: `${SS}: Botvinnik Variation (5...dxc4)`,
    weight: 0.8,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. Nf3 e6 5. Bg5 dxc4 6. e4 b5 7. e5 h6 8. Bh4 g5 9. Nxg5 hxg5 10. Bxg5 Nbd7 11. exf6 Bb7 12. g3 c5',
  },
  {
    name: `${SS}: Botvinnik, 11.g3`,
    weight: 0.8,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. Nf3 e6 5. Bg5 dxc4 6. e4 b5 7. e5 h6 8. Bh4 g5 9. Nxg5 hxg5 10. Bxg5 Nbd7 11. g3 Bb7 12. Bg2 Qb6',
  },
  {
    name: `${SS}: Botvinnik, 9.exf6`,
    weight: 0.8,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. Nf3 e6 5. Bg5 dxc4 6. e4 b5 7. e5 h6 8. Bh4 g5 9. exf6 gxh4 10. Ne5 Qxf6 11. g3 Nd7 12. Nxd7 Bxd7',
  },
  {
    name: `${SS}: Botvinnik, 7.a4`,
    weight: 0.8,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. Nf3 e6 5. Bg5 dxc4 6. e4 b5 7. a4 Bb4 8. e5 h6 9. exf6 hxg5 10. fxg7 Rg8 11. g3 Bb7 12. Bg2 c5',
  },
  {
    name: `${SS}: Botvinnik, 6.e3`,
    weight: 0.8,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. Nf3 e6 5. Bg5 dxc4 6. e3 b5 7. a4 Bb4 8. Be2 Bb7 9. O-O a6 10. Ne5 Nd5 11. Nxd5 cxd5 12. Bf3 Qd6',
  },
  {
    name: `${SS}: Botvinnik, 6.a4`,
    weight: 0.8,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. Nf3 e6 5. Bg5 dxc4 6. a4 Bb4 7. e4 Qa5 8. Bd2 c5 9. Bxc4 cxd4 10. Nxd4 Qc5 11. Nb3 Qe5 12. Qe2 Nbd7',
  },
  {
    name: `${SS}: 5.Qb3`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. Nf3 e6 5. Qb3 dxc4 6. Qxc4 b5 7. Qd3 Nbd7 8. e4 b4 9. Na4 Bb7 10. Bg5 Be7 11. e5 Nd5 12. Bxe7 Qxe7',
  },
  {
    name: `${SS}: 5.Qd3`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. Nf3 e6 5. Qd3 dxc4 6. Qxc4 b5 7. Qd3 Nbd7 8. e4 b4 9. Na4 Bb7 10. Bg5 Be7 11. e5 Nd5 12. Bxe7 Qxe7',
  },
  {
    name: `${SS}: 5.g3`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. Nf3 e6 5. g3 dxc4 6. Bg2 Nbd7 7. O-O Be7 8. e4 O-O 9. Qe2 b5 10. Rd1 Bb7 11. d5 cxd5 12. exd5 e5',
  },
  {
    name: `${SS}: 5.g3 dxc4 6.Bg2 b5`,
    weight: 1,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. Nf3 e6 5. g3 dxc4 6. Bg2 b5 7. O-O Bb7 8. Ne5 a6 9. a4 Nfd7 10. Nxd7 Nxd7 11. axb5 cxb5 12. Nxb5 axb5',
  },
  {
    name: `${SS}: Exchange, 5.cxd5 exd5 6.Qc2`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. Nf3 e6 5. cxd5 exd5 6. Qc2 g6 7. Bg5 Bf5 8. Qb3 Qb6 9. Qxb6 axb6 10. e3 Nbd7 11. Bd3 Bxd3',
  },
  {
    name: `${SS}: Exchange, 5.cxd5 exd5 6.Bg5`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. Nf3 e6 5. cxd5 exd5 6. Bg5 Be7 7. e3 Nbd7 8. Bd3 O-O 9. Qc2 Re8 10. O-O Nf8 11. Rab1 Ng6 12. b4 Bd6',
  },
  {
    name: `${SS}: Exchange, 5.cxd5 exd5 6.e3`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. Nf3 e6 5. cxd5 exd5 6. e3 Bd6 7. Bd3 O-O 8. O-O Re8 9. Qc2 Nbd7 10. Bd2 Nf8 11. Rae1 Ng6 12. e4 dxe4',
  },
  {
    name: `${SS}: 5.Bd2`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. Nf3 e6 5. Bd2 Nbd7 6. e3 Bd6 7. Bd3 O-O 8. O-O dxc4 9. Bxc4 e5 10. h3 Qe7 11. Qc2 exd4 12. exd4 Nb6',
  },
  {
    name: `${SS}: 5.Bf4?!`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. Nf3 e6 5. Bf4 dxc4 6. e3 b5 7. a4 Bb4 8. axb5 cxb5 9. Be2 Bb7 10. O-O Nbd7 11. Qc2 Qb6 12. Rfd1 O-O',
  },
  {
    name: `${SS}: 5.a4`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. Nf3 e6 5. a4 Nbd7 6. e3 Bd6 7. Bd3 O-O 8. O-O dxc4 9. Bxc4 e5 10. h3 Qe7 11. Qc2 exd4 12. exd4 Nb6',
  },
  {
    name: `${SS}: 4.e3 (Semi-Slav via e3)`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. e3 e6 5. Nf3 Nbd7 6. Bd3 dxc4 7. Bxc4 b5 8. Bd3 Bb7 9. O-O a6 10. e4 c5 11. d5 Qc7 12. dxe6 fxe6',
  },
  {
    name: `${SS}: 4.e3 e6 5.Nf3 Nbd7 6.Qc2`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. e3 e6 5. Nf3 Nbd7 6. Qc2 Bd6 7. Bd3 O-O 8. O-O dxc4 9. Bxc4 a6 10. Rd1 b5 11. Be2 Qc7 12. e4 e5',
  },
  {
    name: `${SS}: 4.e3 e6 5.Bd3`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. e3 e6 5. Bd3 dxc4 6. Bxc4 b5 7. Bd3 Bb7 8. Nf3 Nbd7 9. O-O a6 10. e4 c5 11. d5 Qc7 12. dxe6 fxe6',
  },
  {
    name: `${SS}: 4.e3 e6 5.Qc2`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. e3 e6 5. Qc2 Nbd7 6. Nf3 Bd6 7. Bd3 O-O 8. O-O dxc4 9. Bxc4 a6 10. Rd1 b5 11. Be2 Qc7 12. e4 e5',
  },
  {
    name: `${SS}: 4.cxd5 (Exchange Slav)`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. cxd5 cxd5 5. Bf4 Nc6 6. e3 a6 7. Bd3 Bg4 8. Nge2 e6 9. O-O Bd6 10. Bxd6 Qxd6 11. f3 Bh5 12. Ng3 Bg6',
  },
  {
    name: `${SS}: 4.cxd5 cxd5 5.Nf3 Nc6 6.Bf4`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. cxd5 cxd5 5. Nf3 Nc6 6. Bf4 Bf5 7. e3 e6 8. Bb5 Nd7 9. Qa4 Rc8 10. O-O a6 11. Bxc6 Rxc6 12. Rfc1 Be7',
  },
  {
    name: `${SS}: 4.cxd5 cxd5 5.Nf3 Nc6 6.Bg5`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. cxd5 cxd5 5. Nf3 Nc6 6. Bg5 Ne4 7. Bh4 Qb6 8. Qb3 Qxb3 9. axb3 Bf5 10. e3 e6 11. Bd3 Bb4 12. O-O O-O',
  },
  {
    name: `${SS}: 4.cxd5 cxd5 5.Nf3 Nc6 6.e3`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. cxd5 cxd5 5. Nf3 Nc6 6. e3 e6 7. Bd3 Bd6 8. O-O O-O 9. b3 a6 10. Bb2 b5 11. Rc1 Bb7 12. Ne2 Rc8',
  },
  {
    name: `${SS}: 4.cxd5 cxd5 5.Bg5`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. cxd5 cxd5 5. Bg5 Nc6 6. e3 e6 7. Bd3 Bd6 8. Nf3 O-O 9. O-O h6 10. Bh4 Bd7 11. Rc1 Rc8 12. a3 a6',
  },
  {
    name: `${SS}: 3.cxd5 cxd5 4.Nc3 Nf6 5.Bf4 (Exchange)`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. cxd5 cxd5 4. Nc3 Nf6 5. Bf4 Nc6 6. e3 a6 7. Bd3 Bg4 8. Nge2 e6 9. O-O Bd6 10. Bxd6 Qxd6 11. f3 Bh5 12. Ng3 Bg6',
  },
  {
    name: `${SS}: 3.cxd5 cxd5 4.Nc3 Nf6 5.Nf3 Nc6 6.Bf4 Bf5`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. cxd5 cxd5 4. Nc3 Nf6 5. Nf3 Nc6 6. Bf4 Bf5 7. e3 e6 8. Bb5 Nd7 9. Qa4 Rc8 10. O-O a6 11. Bxc6 Rxc6 12. Rfc1 Be7',
  },
  {
    name: `${SS}: 3.cxd5 cxd5 4.Nf3`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. cxd5 cxd5 4. Nf3 Nf6 5. Nc3 Nc6 6. Bf4 Bf5 7. e3 e6 8. Bb5 Nd7 9. Qa4 Rc8 10. O-O a6 11. Bxc6 Rxc6 12. Rfc1 Be7',
  },
  {
    name: `${SS}: 3.cxd5 cxd5 4.Bf4`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. cxd5 cxd5 4. Bf4 Nc6 5. e3 Nf6 6. Nc3 a6 7. Bd3 Bg4 8. Nge2 e6 9. O-O Bd6 10. Bxd6 Qxd6 11. f3 Bh5 12. Ng3 Bg6',
  },
  {
    name: `${SS}: 3.Nf3 Nf6 4.Nc3 e6 (Semi-Slav move order)`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nf3 Nf6 4. Nc3 e6 5. e3 Nbd7 6. Bd3 dxc4 7. Bxc4 b5 8. Bd3 Bb7 9. O-O a6 10. e4 c5 11. d5 Qc7 12. dxe6 fxe6',
  },
  {
    name: `${SS}: 3.Nf3 Nf6 4.e3`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nf3 Nf6 4. e3 e6 5. Nc3 Nbd7 6. Bd3 dxc4 7. Bxc4 b5 8. Bd3 Bb7 9. O-O a6 10. e4 c5 11. d5 Qc7 12. dxe6 fxe6',
  },
  {
    name: `${SS}: 3.Nf3 Nf6 4.Qc2`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nf3 Nf6 4. Qc2 e6 5. Nc3 Nbd7 6. e3 Bd6 7. Bd3 O-O 8. O-O dxc4 9. Bxc4 a6 10. Rd1 b5 11. Be2 Qc7 12. e4 e5',
  },
  {
    name: `${SS}: 3.Nf3 Nf6 4.Qb3`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nf3 Nf6 4. Qb3 dxc4 5. Qxc4 Bf5 6. Nc3 e6 7. g3 Nbd7 8. Bg2 Be7 9. O-O O-O 10. Re1 Ne4 11. Qb3 Qb6 12. Qxb6 Nxb6',
  },
  {
    name: `${SS}: 3.Nf3 Nf6 4.g3`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nf3 Nf6 4. g3 e6 5. Bg2 Nbd7 6. O-O Be7 7. Nc3 O-O 8. Qc2 b6 9. e4 Bb7 10. Rd1 Qc7 11. e5 Ne8 12. b3 c5',
  },
  {
    name: `${SS}: 3.Nf3 Nf6 4.Bg5?!`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nf3 Nf6 4. Bg5 Qb6 5. Qc1 dxc4 6. e3 Bf5 7. Nc3 Nbd7 8. Bxc4 e6 9. O-O Be7 10. Bh4 O-O 11. Qc2 Bg6 12. Rfd1 Rfd8',
  },
  {
    name: `${SS}: 3.Nf3 Nf6 4.Nbd2`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nf3 Nf6 4. Nbd2 e6 5. e3 Nbd7 6. Bd3 Bd6 7. O-O O-O 8. Qc2 dxc4 9. Nxc4 Bc7 10. Bd2 e5 11. dxe5 Nxe5 12. Nfxe5 Bxe5',
  },
  {
    name: `${SS}: 3.Nf3 Nf6 4.cxd5`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nf3 Nf6 4. cxd5 cxd5 5. Nc3 Nc6 6. Bf4 Bf5 7. e3 e6 8. Bb5 Nd7 9. Qa4 Rc8 10. O-O a6 11. Bxc6 Rxc6 12. Rfc1 Be7',
  },
  {
    name: `${SS}: 3.Nf3 e6 4.Nc3 Nf6`,
    weight: 1,
    moves: '1. d4 d5 2. c4 c6 3. Nf3 e6 4. Nc3 Nf6 5. e3 Nbd7 6. Bd3 dxc4 7. Bxc4 b5 8. Bd3 Bb7 9. O-O a6 10. e4 c5 11. d5 Qc7 12. dxe6 fxe6',
  },
  {
    name: `${SS}: 3.Nc3 e6 (Semi-Slav via e6)`,
    weight: 1,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 e6 4. Nf3 Nf6 5. e3 Nbd7 6. Bd3 dxc4 7. Bxc4 b5 8. Bd3 Bb7 9. O-O a6 10. e4 c5 11. d5 Qc7 12. dxe6 fxe6',
  },
  {
    name: `${SS}: 3.Nc3 e6 4.e4 (Marshall Gambit declined)`,
    weight: 1,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 e6 4. e4 dxe4 5. Nxe4 Bb4+ 6. Bd2 Qxd4 7. Bxb4 Qxe4+ 8. Be2 Na6 9. Bd6 b6 10. Nf3 Bb7 11. O-O Nf6',
  },
  {
    name: `${SS}: 3.Nc3 Nf6 4.e4?! (Geller-ish)`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. e4 dxe4 5. Nxe4 Nxe4 6. Qa4?! b5 7. Qb3 Qd5 8. Nf3 Bf5 9. Be2 e6 10. O-O Nd7',
  },
  {
    name: `${SS}: 3.Nc3 Nf6 4.Bg5`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. Bg5 dxc4 5. e4 b5 6. e5 h6 7. Bh4 g5 8. Bg3 Bg7 9. Nf3 Nd5 10. Be2 Be6 11. O-O Nd7 12. Ne4 O-O',
  },
  {
    name: `${SS}: 3.Nc3 Nf6 4.Qb3`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. Qb3 dxc4 5. Qxc4 Bf5 6. Nf3 e6 7. g3 Nbd7 8. Bg2 Be7 9. O-O O-O 10. Re1 Ne4 11. Qb3 Qb6 12. Qxb6 Nxb6',
  },
  {
    name: `${SS}: 3.Nc3 Nf6 4.Qc2`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. Qc2 e6 5. Nf3 Nbd7 6. e3 Bd6 7. Bd3 O-O 8. O-O dxc4 9. Bxc4 a6 10. Rd1 b5 11. Be2 Qc7 12. e4 e5',
  },
  {
    name: `${SS}: 3.Nc3 Nf6 4.g3`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. g3 e6 5. Nf3 Nbd7 6. Bg2 Be7 7. O-O O-O 8. Qc2 b6 9. e4 Bb7 10. Rd1 Qc7 11. e5 Ne8 12. b3 c5',
  },
  {
    name: `${SS}: 3.Nc3 Nf6 4.Bf4`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. Bf4 dxc4 5. e3 b5 6. a4 e6 7. axb5 cxb5 8. Nxb5 Bb4+ 9. Nc3 Nd5 10. Nf3 Nxc3 11. bxc3 Bxc3+ 12. Ke2 Ba6',
  },
  {
    name: `${SS}: 2.c4 c6 3.e3`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. e3 Nf6 4. Nc3 e6 5. Nf3 Nbd7 6. Bd3 dxc4 7. Bxc4 b5 8. Bd3 Bb7 9. O-O a6 10. e4 c5 11. d5 Qc7 12. dxe6 fxe6',
  },
  {
    name: `${SS}: 2.c4 c6 3.Nf3 Nf6 4.e3 e6 5.b3`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Nf3 Nf6 4. e3 e6 5. b3 Nbd7 6. Bd3 Bd6 7. O-O O-O 8. Bb2 Qe7 9. Nbd2 e5 10. cxd5 cxd5 11. dxe5 Nxe5 12. Nxe5 Bxe5',
  },
  {
    name: `${SS}: 2.c4 c6 3.Nf3 Nf6 4.e3 Bg4?!`,
    weight: 1,
    moves: '1. d4 d5 2. c4 c6 3. Nf3 Nf6 4. e3 e6 5. Bd3 Nbd7 6. Nc3 dxc4 7. Bxc4 b5 8. Bd3 Bb7 9. O-O a6 10. e4 c5 11. d5 Qc7 12. dxe6 fxe6',
  },
  {
    name: `${SS}: 2.c4 c6 3.Qc2?!`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Qc2 Nf6 4. Nc3 e6 5. Nf3 Nbd7 6. e3 Bd6 7. Bd3 O-O 8. O-O dxc4 9. Bxc4 a6 10. Rd1 b5 11. Be2 Qc7 12. e4 e5',
  },
  {
    name: `${SS}: 2.c4 c6 3.Qb3`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. Qb3 Nf6 4. Nc3 dxc4 5. Qxc4 Bf5 6. Nf3 e6 7. g3 Nbd7 8. Bg2 Be7 9. O-O O-O 10. Re1 Ne4 11. Qb3 Qb6 12. Qxb6 Nxb6',
  },
  {
    name: `${SS}: 2.c4 c6 3.g3`,
    weight: W_SS,
    moves: '1. d4 d5 2. c4 c6 3. g3 Nf6 4. Bg2 e6 5. Nf3 Nbd7 6. O-O Be7 7. Nc3 O-O 8. Qc2 b6 9. e4 Bb7 10. Rd1 Qc7 11. e5 Ne8 12. b3 c5',
  },
  {
    name: `${SS}: 2.c4 c6 3.Nc3 dxc4?! (Slav Gambit-ish)`,
    weight: 0.5,
    moves: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. Nf3 dxc4 5. a4 Bf5 6. e3 e6 7. Bxc4 Bb4 8. O-O Nbd7 9. Qe2 Bg6 10. e4 O-O 11. Bd3 Bh5 12. e5 Nd5',
  },
  // ─── 1.d4 d5 without 2.c4 ─────────────────────────────────────────────────
  {
    name: 'London System',
    moves: '1. d4 d5 2. Bf4 Nf6 3. e3 c5 4. c3 Nc6 5. Nd2 e6 6. Ngf3 Bd6 7. Bg3 O-O 8. Bd3 b6 9. Ne5 Bb7 10. f4 Ne7 11. O-O Nf5',
  },
  {
    name: 'London System, 2.Nf3 Nf6 3.Bf4',
    moves: '1. d4 d5 2. Nf3 Nf6 3. Bf4 c5 4. e3 Nc6 5. c3 e6 6. Nbd2 Bd6 7. Bg3 O-O 8. Bd3 b6 9. Ne5 Bb7 10. f4 Ne7 11. O-O Nf5',
  },
  {
    name: 'London System, 3.e3 c5 4.c3 Nc6 5.Nd2 Qb6',
    weight: 0.6,
    moves: '1. d4 d5 2. Bf4 Nf6 3. e3 c5 4. c3 Nc6 5. Nd2 Qb6 6. Qb3 c4 7. Qc2 Bf5 8. Qc1 e6 9. Ngf3 Be7 10. Be2 O-O 11. O-O h6',
  },
  {
    name: 'London System, 4.Nd2',
    moves: '1. d4 d5 2. Bf4 Nf6 3. e3 c5 4. Nd2 Nc6 5. c3 e6 6. Ngf3 Bd6 7. Bg3 O-O 8. Bd3 b6 9. Ne5 Bb7 10. f4 Ne7 11. O-O Nf5',
  },
  {
    name: 'London System, 4.dxc5',
    moves: '1. d4 d5 2. Bf4 Nf6 3. e3 c5 4. dxc5 Nc6 5. Nf3 e6 6. c3 Bxc5 7. Nbd2 O-O 8. Bd3 Nh5 9. Bg5 f6 10. Bh4 e5 11. O-O Be7',
  },
  {
    name: 'London System, 4.Nf3 Nc6 5.c3 Qb6',
    weight: 0.6,
    moves: '1. d4 d5 2. Bf4 Nf6 3. e3 c5 4. Nf3 Nc6 5. c3 Qb6 6. Qb3 c4 7. Qxb6 axb6 8. Nbd2 b5 9. Be2 Bf5 10. O-O e6 11. a3 Be7',
  },
  {
    name: 'London System, 4.Nf3 Nc6 5.c3 e6 6.Bd3',
    moves: '1. d4 d5 2. Bf4 Nf6 3. e3 c5 4. Nf3 Nc6 5. c3 e6 6. Bd3 Bd6 7. Bg3 O-O 8. Nbd2 b6 9. Ne5 Bb7 10. f4 Ne7 11. O-O Nf5',
  },
  {
    name: 'London System, 4.Nf3 Nc6 5.Nbd2 e6 6.c3 Bd6 7.Bg3 O-O 8.Bd3 b6 9.Ne5 Bb7 10.Nxc6',
    moves: '1. d4 d5 2. Bf4 Nf6 3. e3 c5 4. Nf3 Nc6 5. Nbd2 e6 6. c3 Bd6 7. Bg3 O-O 8. Bd3 b6 9. Ne5 Bb7 10. Nxc6 Bxc6 11. O-O Bxg3 12. hxg3 Qd6',
  },
  {
    name: 'London System, 4.Nf3 Nc6 5.Nbd2 e6 6.c3 Bd6 7.Bg3 O-O 8.Bd3 b6 9.O-O',
    moves: '1. d4 d5 2. Bf4 Nf6 3. e3 c5 4. Nf3 Nc6 5. Nbd2 e6 6. c3 Bd6 7. Bg3 O-O 8. Bd3 b6 9. O-O Bb7 10. Qe2 Qe7 11. Rfe1 Rfe8 12. e4 dxe4',
  },
  {
    name: 'London System, 4.Nf3 Nc6 5.Nbd2 e6 6.c3 Bd6 7.Bg3 O-O 8.Bb5',
    moves: '1. d4 d5 2. Bf4 Nf6 3. e3 c5 4. Nf3 Nc6 5. Nbd2 e6 6. c3 Bd6 7. Bg3 O-O 8. Bb5 Qe7 9. Ne5 Bxe5 10. Bxe5 Nxe5 11. dxe5 Nd7 12. f4 a6',
  },
  {
    name: 'Torre Attack (2.Nf3 Nf6 3.Bg5)',
    moves: '1. d4 d5 2. Nf3 Nf6 3. Bg5 Ne4 4. Bf4 c5 5. e3 Nc6 6. c3 Qb6 7. Qb3 c4 8. Qxb6 axb6 9. Nbd2 Nxd2 10. Nxd2 b5 11. Be2 e6',
  },
  {
    name: 'Torre Attack, 3.Bg5 e6',
    weight: 0.6,
    moves: '1. d4 d5 2. Nf3 Nf6 3. Bg5 e6 4. e3 c5 5. c3 Nc6 6. Nbd2 Bd6 7. Bd3 h6 8. Bh4 O-O 9. O-O e5 10. dxe5 Nxe5 11. Nxe5 Bxe5',
  },
  {
    name: 'Trompowsky Attack (2.Bg5)',
    moves: '1. d4 d5 2. Bg5 h6 3. Bh4 c6 4. Nf3 Qb6 5. b3 Bf5 6. e3 Nd7 7. Be2 e6 8. O-O Ngf6 9. c4 Be7 10. Nc3 O-O 11. Rc1 Rac8',
  },
  {
    name: 'Trompowsky Attack, 2.Bg5 c6',
    moves: '1. d4 d5 2. Bg5 c6 3. Nf3 Qb6 4. b3 Bf5 5. e3 Nd7 6. Be2 e6 7. O-O Ngf6 8. c4 Be7 9. Nc3 O-O 10. Rc1 Rac8 11. Bh4 Bd6',
  },
  {
    name: 'Trompowsky Attack, 2.Bg5 Nf6',
    weight: 0.6,
    moves: '1. d4 d5 2. Bg5 Nf6 3. Bxf6 exf6 4. e3 Bd6 5. c4 dxc4 6. Bxc4 O-O 7. Nc3 c6 8. Qc2 Nd7 9. Nf3 Nb6 10. Bd3 Be6 11. O-O Qe7',
  },
  {
    name: 'Veresov Attack (2.Nc3)',
    moves: '1. d4 d5 2. Nc3 Nf6 3. Bg5 Nbd7 4. Nf3 g6 5. e3 Bg7 6. Bd3 O-O 7. O-O c6 8. Qe2 Re8 9. e4 dxe4 10. Nxe4 Nxe4 11. Bxe4 Nf6',
  },
  {
    name: 'Veresov Attack, 3.Bg5 c5',
    weight: 0.6,
    moves: '1. d4 d5 2. Nc3 Nf6 3. Bg5 c5 4. Bxf6 gxf6 5. e4 dxe4 6. dxc5 Qa5 7. Qd2 Qxc5 8. Nxe4 Qe5 9. Bd3 f5',
  },
  {
    name: 'Veresov Attack, 3.e4 (Blackmar-Diemer-ish)',
    moves: '1. d4 d5 2. Nc3 Nf6 3. e4 dxe4 4. f3 exf3 5. Nxf3 e6 6. Bg5 Be7 7. Bd3 Nbd7 8. O-O O-O 9. Qe1 c5 10. Qh4 h6 11. Bxh6 gxh6',
  },
  {
    name: 'Blackmar-Diemer Gambit (2.e4)',
    moves: '1. d4 d5 2. e4 dxe4 3. Nc3 Nf6 4. f3 exf3 5. Nxf3 e6 6. Bg5 Be7 7. Bd3 Nbd7 8. O-O O-O 9. Qe1 c5 10. Qh4 h6 11. Bxh6 gxh6',
  },
  {
    name: 'Blackmar-Diemer Gambit, 4.f3 exf3 5.Qxf3',
    moves: '1. d4 d5 2. e4 dxe4 3. Nc3 Nf6 4. f3 exf3 5. Qxf3 Qxd4 6. Be3 Qg4 7. Qf2 e5 8. Nf3 Bb4 9. O-O-O Nc6 10. Bd3 O-O',
  },
  {
    name: 'Blackmar-Diemer Gambit, 3.Nc3 e5',
    weight: 0.6,
    moves: '1. d4 d5 2. e4 dxe4 3. Nc3 e5 4. dxe5 Qxd1+ 5. Kxd1 Nc6 6. Nxe4 Nxe5 7. Bf4 Nc6 8. Bb5 Bd7 9. Nf3 f6 10. Kc1 O-O-O',
  },
  {
    name: 'Colle System / Zukertort (2.Nf3 Nf6 3.e3)',
    moves: '1. d4 d5 2. Nf3 Nf6 3. e3 e6 4. Bd3 c5 5. b3 Nc6 6. O-O Bd6 7. Bb2 O-O 8. Nbd2 Qe7 9. Ne5 Bxe5 10. dxe5 Nd7 11. f4 f6',
  },
  {
    name: 'Colle System, 3.e3 e6 4.Bd3 c5 5.c3',
    moves: '1. d4 d5 2. Nf3 Nf6 3. e3 e6 4. Bd3 c5 5. c3 Nc6 6. Nbd2 Bd6 7. O-O O-O 8. dxc5 Bxc5 9. e4 Qc7 10. Qe2 Ng4 11. h3 Nge5',
  },
  {
    name: 'Colle System, 3.e3 Bf5',
    weight: 0.6,
    moves: '1. d4 d5 2. Nf3 Nf6 3. e3 Bf5 4. Bd3 Bxd3 5. Qxd3 e6 6. O-O Nbd7 7. c4 Bd6 8. Nc3 O-O 9. e4 dxe4 10. Nxe4 Nxe4 11. Qxe4 Nf6',
  },
  {
    name: 'Colle System, 3.e3 e6 4.Bd3 c5 5.O-O',
    moves: '1. d4 d5 2. Nf3 Nf6 3. e3 e6 4. Bd3 c5 5. O-O Nc6 6. b3 Bd6 7. Bb2 O-O 8. Nbd2 Qe7 9. Ne5 Bxe5 10. dxe5 Nd7 11. f4 f6',
  },
  {
    name: 'Colle System, 3.e3 e6 4.Bd3 c5 5.b3 Nc6 6.O-O Bd6 7.Bb2 O-O 8.Nbd2 Qe7 9.a3',
    moves: '1. d4 d5 2. Nf3 Nf6 3. e3 e6 4. Bd3 c5 5. b3 Nc6 6. O-O Bd6 7. Bb2 O-O 8. Nbd2 Qe7 9. a3 b6 10. Ne5 Bb7 11. f4 Ne4',
  },
  {
    name: 'Colle System, 3.e3 e6 4.Bd3 c5 5.b3 Nc6 6.O-O Bd6 7.Bb2 O-O 8.Nbd2 Qe7 9.c4',
    moves: '1. d4 d5 2. Nf3 Nf6 3. e3 e6 4. Bd3 c5 5. b3 Nc6 6. O-O Bd6 7. Bb2 O-O 8. Nbd2 Qe7 9. c4 Rd8 10. Rc1 b6 11. cxd5 exd5',
  },
];
