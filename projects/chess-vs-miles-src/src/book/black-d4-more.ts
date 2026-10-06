/**
 * Black vs 1.d4 with 1...Nf6 (the Indians), and vs every other first move.
 * One compact line per White system; the engine handles the rest.
 */
import type { Line } from './types';

const QID = "Queen's Indian Defense";
const NIMZO = 'Nimzo-Indian Defense';
const W_QID = 1.2;
const W_NIMZO = 0.8;

export const BLACK_D4_MORE: Line[] = [
  // ─── Queen's Indian (after 3.Nf3) ─────────────────────────────────────────
  {
    name: `${QID}: Fianchetto, 4.g3 Ba6`,
    weight: W_QID,
    moves: '1. d4 Nf6 2. c4 e6 3. Nf3 b6 4. g3 Ba6 5. b3 Bb4+ 6. Bd2 Be7 7. Bg2 c6 8. Bc3 d5 9. Ne5 Nfd7 10. Nxd7 Nxd7 11. Nd2 O-O 12. O-O Rc8',
  },
  {
    name: `${QID}: Fianchetto, 4.g3 Ba6 5.Qa4`,
    weight: W_QID,
    moves: '1. d4 Nf6 2. c4 e6 3. Nf3 b6 4. g3 Ba6 5. Qa4 Bb7 6. Bg2 c5 7. dxc5 Bxc5 8. O-O O-O 9. Nc3 Be7 10. Bf4 Na6 11. Rfd1 Qb8',
  },
  {
    name: `${QID}: Fianchetto, 4.g3 Ba6 5.Qc2`,
    weight: W_QID,
    moves: '1. d4 Nf6 2. c4 e6 3. Nf3 b6 4. g3 Ba6 5. Qc2 Bb7 6. Bg2 c5 7. d5 exd5 8. cxd5 Nxd5 9. O-O Be7 10. Rd1 Nc6 11. Qa4 Nf6',
  },
  {
    name: `${QID}: Fianchetto, 4.g3 Ba6 5.Nbd2`,
    weight: W_QID,
    moves: '1. d4 Nf6 2. c4 e6 3. Nf3 b6 4. g3 Ba6 5. Nbd2 Bb4 6. Qc2 Bb7 7. Bg2 Be7 8. O-O O-O 9. e4 d5 10. e5 Ne4 11. Nxe4 dxe4 12. Ne1 c5',
  },
  {
    name: `${QID}: Fianchetto, 4.g3 Ba6 5.b3 Bb4+ 6.Bd2 Be7 7.Nc3`,
    weight: W_QID,
    moves: '1. d4 Nf6 2. c4 e6 3. Nf3 b6 4. g3 Ba6 5. b3 Bb4+ 6. Bd2 Be7 7. Nc3 O-O 8. Bg2 d5 9. cxd5 exd5 10. O-O Nbd7 11. Re1 c5',
  },
  {
    name: `${QID}: Fianchetto, 4.g3 Bb7`,
    weight: 0.6,
    moves: '1. d4 Nf6 2. c4 e6 3. Nf3 b6 4. g3 Bb7 5. Bg2 Be7 6. O-O O-O 7. Nc3 Ne4 8. Qc2 Nxc3 9. Qxc3 c5 10. Rd1 d6 11. b3 Bf6',
  },
  {
    name: `${QID}: Petrosian, 4.a3`,
    weight: W_QID,
    moves: '1. d4 Nf6 2. c4 e6 3. Nf3 b6 4. a3 Bb7 5. Nc3 d5 6. cxd5 Nxd5 7. Qc2 Nxc3 8. bxc3 Be7 9. e4 O-O 10. Bd3 c5 11. O-O Qc8 12. Qe2 Ba6',
  },
  {
    name: `${QID}: Petrosian, 4.a3 Bb7 5.Nc3 d5 6.cxd5 Nxd5 7.e3`,
    weight: W_QID,
    moves: '1. d4 Nf6 2. c4 e6 3. Nf3 b6 4. a3 Bb7 5. Nc3 d5 6. cxd5 Nxd5 7. e3 Be7 8. Bb5+ c6 9. Bd3 Nxc3 10. bxc3 c5 11. O-O Nc6 12. e4 O-O',
  },
  {
    name: `${QID}: Petrosian, 4.a3 Bb7 5.Nc3 d5 6.Bg5`,
    weight: W_QID,
    moves: '1. d4 Nf6 2. c4 e6 3. Nf3 b6 4. a3 Bb7 5. Nc3 d5 6. Bg5 Be7 7. Qa4+ c6 8. Bxf6 Bxf6 9. cxd5 exd5 10. g3 O-O 11. Bg2 Nd7',
  },
  {
    name: `${QID}: Petrosian, 4.a3 Bb7 5.Nc3 d5 6.Qc2`,
    weight: W_QID,
    moves: '1. d4 Nf6 2. c4 e6 3. Nf3 b6 4. a3 Bb7 5. Nc3 d5 6. Qc2 Nbd7 7. cxd5 exd5 8. Bg5 Be7 9. e3 O-O 10. Bd3 c5 11. O-O Rc8',
  },
  {
    name: `${QID}: 4.Nc3 Bb7 5.Bg5`,
    weight: W_QID,
    moves: '1. d4 Nf6 2. c4 e6 3. Nf3 b6 4. Nc3 Bb7 5. Bg5 h6 6. Bh4 Be7 7. e3 Ne4 8. Bxe7 Qxe7 9. Nxe4 Bxe4 10. Bd3 Bb7 11. O-O d6 12. Qe2 Nd7',
  },
  {
    name: `${QID}: 4.Nc3 Bb7 5.a3`,
    weight: W_QID,
    moves: '1. d4 Nf6 2. c4 e6 3. Nf3 b6 4. Nc3 Bb7 5. a3 d5 6. cxd5 Nxd5 7. e3 Be7 8. Bb5+ c6 9. Bd3 Nxc3 10. bxc3 c5 11. O-O Nc6 12. e4 O-O',
  },
  {
    name: `${QID}: 4.Nc3 Bb7 5.e3`,
    weight: W_QID,
    moves: '1. d4 Nf6 2. c4 e6 3. Nf3 b6 4. Nc3 Bb7 5. e3 Bb4 6. Bd3 O-O 7. O-O d5 8. cxd5 exd5 9. Qe2 c5 10. a3 Bxc3 11. bxc3 Nc6 12. Bb2 Re8',
  },
  {
    name: `${QID}: 4.Nc3 Bb7 5.Qc2`,
    weight: W_QID,
    moves: '1. d4 Nf6 2. c4 e6 3. Nf3 b6 4. Nc3 Bb7 5. Qc2 c5 6. d5 exd5 7. cxd5 Bxd5 8. Nxd5 Nxd5 9. e4 Nf6 10. e5 Qe7 11. Qe2 Ng8 12. Bg5 Qe6',
  },
  {
    name: `${QID}: 4.Nc3 Bb7 5.Qb3`,
    weight: W_QID,
    moves: '1. d4 Nf6 2. c4 e6 3. Nf3 b6 4. Nc3 Bb7 5. Qb3 c5 6. d5 exd5 7. cxd5 d6 8. e4 Be7 9. Bb5+ Nfd7 10. O-O O-O 11. Re1 a6 12. Bf1 Nf6',
  },
  {
    name: `${QID}: 4.Nc3 Bb7 5.Bd2`,
    weight: W_QID,
    moves: '1. d4 Nf6 2. c4 e6 3. Nf3 b6 4. Nc3 Bb7 5. Bd2 Be7 6. e3 O-O 7. Bd3 d5 8. cxd5 exd5 9. O-O c5 10. Qe2 Nc6 11. Rfd1 Rc8',
  },
  {
    name: `${QID}: 4.Nc3 Bb7 5.Bf4`,
    weight: W_QID,
    moves: '1. d4 Nf6 2. c4 e6 3. Nf3 b6 4. Nc3 Bb7 5. Bf4 Be7 6. e3 O-O 7. Bd3 d5 8. cxd5 exd5 9. O-O c5 10. Rc1 Nc6 11. dxc5 bxc5 12. Nb5 Ne4',
  },
  {
    name: `${QID}: 4.e3 Bb7 5.Bd3 d5`,
    weight: W_QID,
    moves: '1. d4 Nf6 2. c4 e6 3. Nf3 b6 4. e3 Bb7 5. Bd3 d5 6. O-O Bd6 7. b3 O-O 8. Bb2 Nbd7 9. Nbd2 Ne4 10. Qe2 f5 11. Ne5 Nxe5 12. dxe5 Bxe5',
  },
  {
    name: `${QID}: 4.e3 Bb7 5.Bd3 Be7`,
    weight: 0.6,
    moves: '1. d4 Nf6 2. c4 e6 3. Nf3 b6 4. e3 Bb7 5. Bd3 Be7 6. O-O O-O 7. Nc3 d5 8. cxd5 exd5 9. b3 Nbd7 10. Bb2 c5 11. Qe2 a6 12. Rfd1 Rc8',
  },
  {
    name: `${QID}: 4.e3 Bb7 5.Nc3`,
    weight: W_QID,
    moves: '1. d4 Nf6 2. c4 e6 3. Nf3 b6 4. e3 Bb7 5. Nc3 Bb4 6. Bd3 O-O 7. O-O d5 8. cxd5 exd5 9. Qe2 c5 10. a3 Bxc3 11. bxc3 Nc6 12. Bb2 Re8',
  },
  {
    name: `${QID}: 4.e3 Bb7 5.Bd3 d5 6.O-O Bd6 7.Nc3`,
    weight: W_QID,
    moves: '1. d4 Nf6 2. c4 e6 3. Nf3 b6 4. e3 Bb7 5. Bd3 d5 6. O-O Bd6 7. Nc3 O-O 8. b3 Nbd7 9. Bb2 a6 10. Qe2 Qe7 11. Rfd1 Rfd8 12. Rac1 dxc4',
  },
  {
    name: `${QID}: 4.Bg5`,
    weight: W_QID,
    moves: '1. d4 Nf6 2. c4 e6 3. Nf3 b6 4. Bg5 Bb7 5. e3 h6 6. Bh4 Be7 7. Nc3 Ne4 8. Bxe7 Qxe7 9. Nxe4 Bxe4 10. Bd3 Bb7 11. O-O d6 12. Qe2 Nd7',
  },
  {
    name: `${QID}: 4.Bf4`,
    weight: W_QID,
    moves: '1. d4 Nf6 2. c4 e6 3. Nf3 b6 4. Bf4 Bb7 5. e3 Be7 6. Nc3 O-O 7. Bd3 d5 8. cxd5 exd5 9. O-O c5 10. Rc1 Nc6 11. dxc5 bxc5 12. Nb5 Ne4',
  },
  {
    name: `${QID}: 4.Qc2`,
    weight: W_QID,
    moves: '1. d4 Nf6 2. c4 e6 3. Nf3 b6 4. Qc2 Bb7 5. Nc3 c5 6. d5 exd5 7. cxd5 Bxd5 8. Nxd5 Nxd5 9. e4 Nf6 10. e5 Qe7 11. Qe2 Ng8 12. Bg5 Qe6',
  },
  {
    name: `${QID}: 4.Nbd2`,
    weight: W_QID,
    moves: '1. d4 Nf6 2. c4 e6 3. Nf3 b6 4. Nbd2 Bb7 5. e3 c5 6. Bd3 Nc6 7. a3 d5 8. b3 Bd6 9. Bb2 O-O 10. O-O Qe7 11. Qe2 Rfd8',
  },
  {
    name: `${QID}: 4.Bd2`,
    weight: W_QID,
    moves: '1. d4 Nf6 2. c4 e6 3. Nf3 b6 4. Bd2 Bb7 5. e3 Be7 6. Nc3 O-O 7. Bd3 d5 8. cxd5 exd5 9. O-O c5 10. Rc1 Nc6 11. Qe2 Rc8',
  },
  {
    name: `${QID}: 4.b3`,
    weight: W_QID,
    moves: '1. d4 Nf6 2. c4 e6 3. Nf3 b6 4. b3 Bb7 5. e3 Be7 6. Bd3 O-O 7. O-O d5 8. Nc3 Nbd7 9. Bb2 c5 10. Qe2 a6 11. Rfd1 Rc8',
  },
  {
    name: `${QID}: 4.Nc3 Bb7 5.Qc2 c5 6.e4?!`,
    weight: 0.6,
    moves: '1. d4 Nf6 2. c4 e6 3. Nf3 b6 4. Nc3 Bb7 5. Qc2 c5 6. e4 cxd4 7. Nxd4 Nc6 8. Nxc6 Bxc6 9. Bd3 Bb4 10. O-O O-O 11. Bg5 h6 12. Bh4 Qe7',
  },
  // ─── Nimzo-Indian (after 3.Nc3) ───────────────────────────────────────────
  {
    name: `${NIMZO}: Classical, 4.Qc2 O-O`,
    weight: W_NIMZO,
    moves: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. Qc2 O-O 5. a3 Bxc3+ 6. Qxc3 b6 7. Bg5 Bb7 8. f3 h6 9. Bh4 d5 10. e3 Nbd7 11. cxd5 Nxd5 12. Bxd8 Nxc3',
  },
  {
    name: `${NIMZO}: Classical, 4.Qc2 O-O 5.Nf3`,
    weight: W_NIMZO,
    moves: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. Qc2 O-O 5. Nf3 c5 6. dxc5 Na6 7. g3 Nxc5 8. Bg2 Nce4 9. O-O Nxc3 10. bxc3 Be7 11. e4 d6 12. Nd4 Qc7',
  },
  {
    name: `${NIMZO}: Classical, 4.Qc2 O-O 5.e4`,
    weight: W_NIMZO,
    moves: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. Qc2 O-O 5. e4 d5 6. e5 Ne4 7. Bd3 c5 8. Nf3 cxd4 9. Nxd4 Nd7 10. Bxe4 dxe4 11. Qxe4 Nxe5 12. O-O Bd6',
  },
  {
    name: `${NIMZO}: Classical, 4.Qc2 O-O 5.Bg5`,
    weight: W_NIMZO,
    moves: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. Qc2 O-O 5. Bg5 h6 6. Bh4 c5 7. dxc5 Na6 8. a3 Bxc3+ 9. Qxc3 Nxc5 10. f3 d5 11. e3 b6 12. Bf2 Bb7',
  },
  {
    name: `${NIMZO}: Classical, 4.Qc2 O-O 5.a3 Bxc3+ 6.Qxc3 b6 7.Nf3`,
    weight: W_NIMZO,
    moves: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. Qc2 O-O 5. a3 Bxc3+ 6. Qxc3 b6 7. Nf3 Bb7 8. e3 d6 9. b4 Nbd7 10. Bb2 Ne4 11. Qc2 f5 12. Bd3 Ndf6',
  },
  {
    name: `${NIMZO}: Classical, 4.Qc2 O-O 5.a3 Bxc3+ 6.Qxc3 b6 7.e3`,
    weight: W_NIMZO,
    moves: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. Qc2 O-O 5. a3 Bxc3+ 6. Qxc3 b6 7. e3 Bb7 8. Nf3 d6 9. b4 Nbd7 10. Bb2 Ne4 11. Qc2 f5 12. Bd3 Ndf6',
  },
  {
    name: `${NIMZO}: Rubinstein, 4.e3 O-O 5.Bd3 d5 6.Nf3 c5 7.O-O Nc6`,
    weight: W_NIMZO,
    moves: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. e3 O-O 5. Bd3 d5 6. Nf3 c5 7. O-O Nc6 8. a3 Bxc3 9. bxc3 dxc4 10. Bxc4 Qc7 11. Bd3 e5 12. Qc2 Re8',
  },
  {
    name: `${NIMZO}: Rubinstein, 7.O-O Nc6 8.a3 Bxc3 9.bxc3 Qc7`,
    weight: W_NIMZO,
    moves: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. e3 O-O 5. Bd3 d5 6. Nf3 c5 7. O-O Nc6 8. a3 Bxc3 9. bxc3 Qc7 10. cxd5 exd5 11. Nh4 Re8 12. f3 Be6',
  },
  {
    name: `${NIMZO}: Rubinstein, 7.O-O dxc4`,
    weight: 0.6,
    moves: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. e3 O-O 5. Bd3 d5 6. Nf3 c5 7. O-O dxc4 8. Bxc4 Nbd7 9. Qe2 b6 10. Rd1 cxd4 11. exd4 Bxc3 12. bxc3 Bb7',
  },
  {
    name: `${NIMZO}: Rubinstein, 5.Nge2 (Reshevsky)`,
    weight: W_NIMZO,
    moves: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. e3 O-O 5. Nge2 d5 6. a3 Be7 7. cxd5 exd5 8. Nf4 c6 9. Bd3 Re8 10. O-O Bd6 11. Nce2 Nbd7 12. b4 Nf8',
  },
  {
    name: `${NIMZO}: Rubinstein, 5.Nf3 d5 6.Bd3 c5 7.O-O`,
    weight: W_NIMZO,
    moves: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. e3 O-O 5. Nf3 d5 6. Bd3 c5 7. O-O Nc6 8. a3 Bxc3 9. bxc3 dxc4 10. Bxc4 Qc7 11. Bd3 e5 12. Qc2 Re8',
  },
  {
    name: `${NIMZO}: Rubinstein, 5.Bd3 d5 6.cxd5 exd5`,
    weight: W_NIMZO,
    moves: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. e3 O-O 5. Bd3 d5 6. cxd5 exd5 7. Nge2 Re8 8. O-O Bd6 9. f3 c5 10. Kh1 Nc6 11. Qe1 cxd4 12. exd4 Qb6',
  },
  {
    name: `${NIMZO}: Rubinstein, 5.Bd3 d5 6.a3`,
    weight: W_NIMZO,
    moves: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. e3 O-O 5. Bd3 d5 6. a3 Bxc3+ 7. bxc3 dxc4 8. Bxc4 c5 9. Nf3 Qc7 10. Bd3 e5 11. O-O Nc6 12. Qc2 Re8',
  },
  {
    name: `${NIMZO}: Rubinstein, 5.Bd3 c5 6.Nf3 d5 7.O-O cxd4`,
    weight: 0.6,
    moves: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. e3 O-O 5. Bd3 c5 6. Nf3 d5 7. O-O cxd4 8. exd4 dxc4 9. Bxc4 b6 10. Bg5 Bb7 11. Re1 Nbd7 12. Rc1 Rc8',
  },
  {
    name: `${NIMZO}: Kmoch, 4.f3`,
    weight: W_NIMZO,
    moves: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. f3 d5 5. a3 Bxc3+ 6. bxc3 c5 7. cxd5 Nxd5 8. dxc5 Qa5 9. e4 Ne7 10. Be3 O-O 11. Qb3 Qc7 12. Bb5 Nd7',
  },
  {
    name: `${NIMZO}: Kmoch, 4.f3 d5 5.a3 Bxc3+ 6.bxc3 c5 7.cxd5 Nxd5 8.dxc5 f5`,
    weight: 0.6,
    moves: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. f3 d5 5. a3 Bxc3+ 6. bxc3 c5 7. cxd5 Nxd5 8. dxc5 f5 9. e4 fxe4 10. fxe4 Nf6 11. Nf3 O-O 12. Bd3 Nc6',
  },
  {
    name: `${NIMZO}: Kmoch, 4.f3 d5 5.a3 Be7`,
    weight: 0.6,
    moves: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. f3 d5 5. a3 Be7 6. e4 dxe4 7. fxe4 e5 8. d5 Bc5 9. Bg5 a5 10. Nf3 Nbd7 11. Bd3 h6 12. Bh4 O-O',
  },
  {
    name: `${NIMZO}: Kmoch, 4.f3 c5`,
    weight: 0.6,
    moves: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. f3 c5 5. d5 Nh5 6. Nh3 Qh4+ 7. Nf2 f5 8. e4 fxe4 9. fxe4 O-O 10. Bd3 exd5 11. cxd5 Bxc3+ 12. bxc3 d6',
  },
  {
    name: `${NIMZO}: 4.Nf3 b6 (hybrid)`,
    weight: W_NIMZO,
    moves: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. Nf3 b6 5. Bg5 Bb7 6. e3 h6 7. Bh4 Bxc3+ 8. bxc3 d6 9. Nd2 e5 10. f3 Nbd7 11. e4 g5 12. Bf2 Qe7',
  },
  {
    name: `${NIMZO}: 4.Nf3 c5`,
    weight: 0.6,
    moves: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. Nf3 c5 5. g3 cxd4 6. Nxd4 O-O 7. Bg2 d5 8. cxd5 Nxd5 9. Qb3 Qa5 10. Bd2 Nc6 11. Nxc6 bxc6 12. O-O Nxc3',
  },
  {
    name: `${NIMZO}: 4.Nf3 b6 5.Qb3`,
    weight: W_NIMZO,
    moves: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. Nf3 b6 5. Qb3 c5 6. a3 Ba5 7. Bg5 Bb7 8. e3 h6 9. Bh4 O-O 10. Be2 Bxc3+ 11. Qxc3 Ne4 12. Qc2 g5',
  },
  {
    name: `${NIMZO}: 4.Nf3 b6 5.e3`,
    weight: W_NIMZO,
    moves: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. Nf3 b6 5. e3 Bb7 6. Bd3 O-O 7. O-O d5 8. cxd5 exd5 9. Qe2 c5 10. a3 Bxc3 11. bxc3 Nc6 12. Bb2 Re8',
  },
  {
    name: `${NIMZO}: 4.Nf3 b6 5.Qc2`,
    weight: W_NIMZO,
    moves: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. Nf3 b6 5. Qc2 Bb7 6. a3 Bxc3+ 7. Qxc3 d6 8. e3 Nbd7 9. b4 O-O 10. Bb2 Ne4 11. Qc2 f5 12. Bd3 Ndf6',
  },
  {
    name: `${NIMZO}: Leningrad, 4.Bg5`,
    weight: W_NIMZO,
    moves: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. Bg5 h6 5. Bh4 c5 6. d5 d6 7. e3 Bxc3+ 8. bxc3 e5 9. Qc2 Nbd7 10. Bd3 Qe7 11. Nf3 g5 12. Bg3 Nh5',
  },
  {
    name: `${NIMZO}: Leningrad, 4.Bg5 h6 5.Bh4 c5 6.d5 b5`,
    weight: 0.6,
    moves: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. Bg5 h6 5. Bh4 c5 6. d5 b5 7. dxe6 fxe6 8. cxb5 d5 9. e3 O-O 10. Nf3 Bb7 11. Be2 Nbd7 12. O-O Qe8',
  },
  {
    name: `${NIMZO}: Saemisch, 4.a3`,
    weight: W_NIMZO,
    moves: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. a3 Bxc3+ 5. bxc3 c5 6. e3 Nc6 7. Bd3 O-O 8. Ne2 b6 9. e4 Ne8 10. O-O Ba6 11. f4 f5 12. Ng3 d6',
  },
  {
    name: `${NIMZO}: Saemisch, 4.a3 Bxc3+ 5.bxc3 c5 6.f3`,
    weight: W_NIMZO,
    moves: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. a3 Bxc3+ 5. bxc3 c5 6. f3 d5 7. cxd5 Nxd5 8. dxc5 Qa5 9. e4 Ne7 10. Be3 O-O 11. Qb3 Qc7 12. Bb5 Nd7',
  },
  {
    name: `${NIMZO}: Saemisch, 4.a3 Bxc3+ 5.bxc3 O-O`,
    weight: 0.6,
    moves: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. a3 Bxc3+ 5. bxc3 O-O 6. f3 d5 7. cxd5 exd5 8. e3 Bf5 9. Ne2 Nbd7 10. Nf4 c5 11. Bd3 Bxd3 12. Qxd3 Re8',
  },
  {
    name: `${NIMZO}: Romanishin, 4.g3`,
    weight: W_NIMZO,
    moves: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. g3 c5 5. Nf3 cxd4 6. Nxd4 O-O 7. Bg2 d5 8. cxd5 Nxd5 9. Qb3 Qa5 10. Bd2 Nc6 11. Nxc6 bxc6 12. O-O Nxc3',
  },
  {
    name: `${NIMZO}: Romanishin, 4.g3 d5`,
    weight: 0.6,
    moves: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. g3 d5 5. Bg2 dxc4 6. Nf3 O-O 7. O-O Nc6 8. Qa4 Bxc3 9. bxc3 Bd7 10. Qxc4 Na5 11. Qd3 Bc6 12. Ne5 Bxg2',
  },
  {
    name: `${NIMZO}: Romanishin, 4.g3 O-O`,
    weight: 0.6,
    moves: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. g3 O-O 5. Bg2 d5 6. Nf3 dxc4 7. O-O Nc6 8. Qa4 Bxc3 9. bxc3 Bd7 10. Qxc4 Na5 11. Qd3 Bc6 12. Ne5 Bxg2',
  },
  {
    name: `${NIMZO}: Spielmann, 4.Qb3`,
    weight: W_NIMZO,
    moves: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. Qb3 c5 5. dxc5 Nc6 6. Nf3 Ne4 7. Bd2 Nxc5 8. Qc2 f5 9. a3 Bxc3 10. Bxc3 O-O 11. e3 b6 12. Be2 Bb7',
  },
  {
    name: `${NIMZO}: 4.Bd2`,
    weight: W_NIMZO,
    moves: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. Bd2 O-O 5. Nf3 d5 6. e3 b6 7. cxd5 exd5 8. Bd3 Bb7 9. O-O Nbd7 10. Qc2 c5 11. Rfd1 Rc8 12. a3 Bxc3',
  },
  {
    name: `${NIMZO}: 4.Qd3?!`,
    weight: W_NIMZO,
    moves: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. Qd3 d5 5. cxd5 exd5 6. Bg5 h6 7. Bh4 c5 8. dxc5 Nc6 9. e3 Qa5 10. Nf3 Bxc3+ 11. bxc3 Qxc3+ 12. Qxc3 Ne4',
  },
  {
    name: `${NIMZO}: 4.e3 O-O 5.Bd3 d5 6.Nf3 c5 7.O-O Nc6 8.cxd5 exd5`,
    weight: 0.6,
    moves: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. e3 O-O 5. Bd3 d5 6. Nf3 c5 7. O-O Nc6 8. cxd5 exd5 9. a3 Bxc3 10. bxc3 Re8 11. Nh4 Ne4 12. f3 Nd6',
  },
  {
    name: `${NIMZO}: 4.e3 O-O 5.Bd3 d5 6.Nf3 c5 7.O-O Nc6 8.a3 cxd4?!`,
    weight: 0.6,
    moves: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. e3 O-O 5. Bd3 d5 6. Nf3 c5 7. O-O Nc6 8. a3 Bxc3 9. bxc3 dxc4 10. Bxc4 Qc7 11. Bd3 e5 12. Qc2 Re8',
  },
  // ─── 1.d4 Nf6 without 2.c4 ────────────────────────────────────────────────
  {
    name: 'London System (1...Nf6 2.Bf4)',
    weight: 1,
    moves: '1. d4 Nf6 2. Bf4 e6 3. e3 b6 4. Nf3 Bb7 5. Bd3 c5 6. c3 Be7 7. Nbd2 O-O 8. O-O d6 9. h3 Nbd7 10. Qe2 Re8',
  },
  {
    name: 'London System (1...Nf6 2.Nf3 e6 3.Bf4)',
    weight: 1,
    moves: '1. d4 Nf6 2. Nf3 e6 3. Bf4 b6 4. e3 Bb7 5. Bd3 c5 6. c3 Be7 7. Nbd2 O-O 8. O-O d6 9. h3 Nbd7 10. Qe2 Re8',
  },
  {
    name: 'London System (1...Nf6 2.Nf3 e6 3.Bf4 d5)',
    weight: 1,
    moves: '1. d4 Nf6 2. Nf3 e6 3. Bf4 d5 4. e3 c5 5. c3 Nc6 6. Nbd2 Bd6 7. Bg3 O-O 8. Bd3 b6 9. Ne5 Bb7 10. f4 Ne7 11. O-O Nf5',
  },
  {
    name: 'Torre Attack (1...Nf6 2.Nf3 e6 3.Bg5)',
    weight: 1,
    moves: '1. d4 Nf6 2. Nf3 e6 3. Bg5 h6 4. Bxf6 Qxf6 5. e4 d6 6. Nc3 Nd7 7. Qd2 c6 8. O-O-O Qe7 9. Kb1 Nf6 10. Bd3 e5',
  },
  {
    name: 'Torre Attack, 3.Bg5 b6',
    weight: 1,
    moves: '1. d4 Nf6 2. Nf3 e6 3. Bg5 b6 4. e3 Bb7 5. Bd3 Be7 6. Nbd2 d6 7. c3 Nbd7 8. O-O O-O 9. Qe2 c5 10. Rad1 Qc7',
  },
  {
    name: 'Trompowsky Attack (1...Nf6 2.Bg5)',
    weight: 1,
    moves: '1. d4 Nf6 2. Bg5 e6 3. e4 h6 4. Bxf6 Qxf6 5. Nc3 d6 6. Qd2 Nd7 7. O-O-O a6 8. f4 Qe7 9. Nf3 b5 10. Bd3 Bb7',
  },
  {
    name: 'Trompowsky Attack, 2.Bg5 Ne4',
    weight: 0.6,
    moves: '1. d4 Nf6 2. Bg5 Ne4 3. Bf4 c5 4. f3 Qa5+ 5. c3 Nf6 6. d5 e6 7. e4 exd5 8. exd5 d6 9. Nd2 Be7 10. Bd3 O-O',
  },
  {
    name: 'Trompowsky Attack, 2.Bg5 e6 3.e3',
    weight: 1,
    moves: '1. d4 Nf6 2. Bg5 e6 3. e3 h6 4. Bh4 b6 5. Nf3 Bb7 6. Bd3 Be7 7. Nbd2 d6 8. c3 Nbd7 9. O-O O-O 10. Qe2 c5',
  },
  {
    name: 'Colle / Zukertort (1...Nf6 2.Nf3 e6 3.e3)',
    weight: 1,
    moves: '1. d4 Nf6 2. Nf3 e6 3. e3 b6 4. Bd3 Bb7 5. O-O Be7 6. b3 O-O 7. Bb2 d5 8. Nbd2 c5 9. Ne5 Nbd7 10. f4 Ne4',
  },
  {
    name: 'Catalan-ish (1...Nf6 2.Nf3 e6 3.g3)',
    weight: 1,
    moves: '1. d4 Nf6 2. Nf3 e6 3. g3 b6 4. Bg2 Bb7 5. O-O Be7 6. c4 O-O 7. Nc3 Ne4 8. Qc2 Nxc3 9. Qxc3 c5 10. Rd1 d6 11. b3 Bf6',
  },
  {
    name: 'Veresov (1...Nf6 2.Nc3 d5 3.Bg5)',
    weight: 1,
    moves: '1. d4 Nf6 2. Nc3 d5 3. Bg5 Nbd7 4. Nf3 g6 5. e3 Bg7 6. Bd3 O-O 7. O-O c6 8. Qe2 Re8 9. e4 dxe4 10. Nxe4 Nxe4 11. Bxe4 Nf6',
  },
  {
    name: 'Richter-Veresov, 2.Nc3 d5 3.Bf4 (Jobava)',
    weight: 1,
    moves: '1. d4 Nf6 2. Nc3 d5 3. Bf4 a6 4. e3 e6 5. Nf3 c5 6. Bd3 Nc6 7. O-O Be7 8. Ne5 Qb6 9. Rb1 Nxe5 10. Bxe5 Nd7 11. Bg3 O-O',
  },
  {
    name: 'Richter-Veresov, 2.Nc3 d5 3.Bf4 c5',
    weight: 0.6,
    moves: '1. d4 Nf6 2. Nc3 d5 3. Bf4 c5 4. e3 cxd4 5. exd4 a6 6. Nf3 Nc6 7. Bd3 Bg4 8. O-O e6 9. h3 Bxf3 10. Qxf3 Bd6 11. Bxd6 Qxd6',
  },
  {
    name: 'Richter-Veresov, 2.Nc3 d5 3.e4',
    weight: 1,
    moves: '1. d4 Nf6 2. Nc3 d5 3. e4 dxe4 4. f3 exf3 5. Nxf3 e6 6. Bg5 Be7 7. Bd3 Nbd7 8. O-O O-O 9. Qe1 c5 10. Qh4 h6 11. Bxh6 gxh6',
  },
  {
    name: 'Pseudo-Trompowsky (1...Nf6 2.Nf3 e6 3.c4 b6 — QID)',
    weight: 1,
    moves: '1. d4 Nf6 2. Nf3 e6 3. c4 b6 4. g3 Ba6 5. b3 Bb4+ 6. Bd2 Be7 7. Bg2 c6 8. Bc3 d5 9. Ne5 Nfd7 10. Nxd7 Nxd7 11. Nd2 O-O 12. O-O Rc8',
  },
  {
    name: '1.d4 Nf6 2.Nf3 e6 3.Nc3 (Nimzo-ish without c4)',
    weight: 1,
    moves: '1. d4 Nf6 2. Nf3 e6 3. Nc3 d5 4. Bg5 Nbd7 5. e3 Be7 6. Bd3 c5 7. O-O O-O 8. Qe2 b6 9. Rad1 Bb7 10. Ne5 Nxe5 11. dxe5 Nd7',
  },
  {
    name: '1.d4 Nf6 2.Nf3 e6 3.e4?! (Blackmar-ish)',
    weight: 0.6,
    moves: '1. d4 Nf6 2. Nf3 e6 3. e4 Nxe4 4. Bd3 Nf6 5. O-O d5 6. c4 c6 7. Nc3 Be7 8. Re1 O-O 9. Bg5 Nbd7 10. Qc2 h6',
  },
  {
    name: '1.d4 Nf6 2.e3',
    weight: 1,
    moves: '1. d4 Nf6 2. e3 e6 3. Bd3 b6 4. Nf3 Bb7 5. O-O Be7 6. b3 O-O 7. Bb2 d5 8. Nbd2 c5 9. Ne5 Nbd7 10. f4 Ne4',
  },
  {
    name: '1.d4 Nf6 2.g3',
    weight: 1,
    moves: '1. d4 Nf6 2. g3 e6 3. Bg2 b6 4. Nf3 Bb7 5. O-O Be7 6. c4 O-O 7. Nc3 Ne4 8. Qc2 Nxc3 9. Qxc3 c5 10. Rd1 d6 11. b3 Bf6',
  },
  {
    name: '1.d4 Nf6 2.f3?!',
    weight: 1,
    moves: '1. d4 Nf6 2. f3 d5 3. e4 dxe4 4. Nc3 exf3 5. Nxf3 e6 6. Bg5 Be7 7. Bd3 Nbd7 8. O-O O-O 9. Qe1 c5 10. Qh4 h6 11. Bxh6 gxh6',
  },
  {
    name: '1.d4 Nf6 2.c4 e6 3.g3 (Catalan)',
    weight: 1,
    moves: '1. d4 Nf6 2. c4 e6 3. g3 d5 4. Bg2 Be7 5. Nf3 O-O 6. O-O dxc4 7. Qc2 a6 8. Qxc4 b5 9. Qc2 Bb7 10. Bd2 Be4 11. Qc1 Nbd7 12. Ba5 Rc8',
  },
  {
    name: '1.d4 Nf6 2.c4 e6 3.g3 d5 4.Nf3',
    weight: 1,
    moves: '1. d4 Nf6 2. c4 e6 3. g3 d5 4. Nf3 Be7 5. Bg2 O-O 6. O-O dxc4 7. Qc2 a6 8. a4 Bd7 9. Qxc4 Bc6 10. Bg5 Bd5 11. Qd3 c5',
  },
  {
    name: '1.d4 Nf6 2.c4 e6 3.Bg5?!',
    weight: 1,
    moves: '1. d4 Nf6 2. c4 e6 3. Bg5 h6 4. Bxf6 Qxf6 5. Nc3 Bb4 6. Qc2 d6 7. e3 Nd7 8. Bd3 c6 9. Nf3 Bxc3+ 10. Qxc3 e5 11. O-O O-O',
  },
  {
    name: '1.d4 Nf6 2.c4 e6 3.Bf4',
    weight: 1,
    moves: '1. d4 Nf6 2. c4 e6 3. Bf4 b6 4. e3 Bb7 5. Nf3 Be7 6. Nc3 O-O 7. Bd3 d5 8. cxd5 exd5 9. O-O c5 10. Rc1 Nc6 11. dxc5 bxc5 12. Nb5 Ne4',
  },
  {
    name: '1.d4 Nf6 2.c4 e6 3.e3',
    weight: 1,
    moves: '1. d4 Nf6 2. c4 e6 3. e3 b6 4. Nf3 Bb7 5. Bd3 d5 6. O-O Bd6 7. b3 O-O 8. Bb2 Nbd7 9. Nbd2 Ne4 10. Qe2 f5 11. Ne5 Nxe5 12. dxe5 Bxe5',
  },
  {
    name: '1.d4 Nf6 2.c4 e6 3.a3?!',
    weight: 1,
    moves: '1. d4 Nf6 2. c4 e6 3. a3 b6 4. Nc3 Bb7 5. Nf3 d5 6. cxd5 Nxd5 7. Qc2 Nxc3 8. bxc3 Be7 9. e4 O-O 10. Bd3 c5 11. O-O Qc8 12. Qe2 Ba6',
  },
  {
    name: '1.d4 Nf6 2.c4 e6 3.Qc2?!',
    weight: 1,
    moves: '1. d4 Nf6 2. c4 e6 3. Qc2 b6 4. Nf3 Bb7 5. Nc3 c5 6. d5 exd5 7. cxd5 Bxd5 8. Nxd5 Nxd5 9. e4 Nf6 10. e5 Qe7 11. Qe2 Ng8 12. Bg5 Qe6',
  },
  {
    name: '1.d4 Nf6 2.c4 e6 3.Nf3 b6 4.g3 Ba6 5.b3 Bb4+ 6.Bd2 Be7 7.Bg2 c6 8.O-O',
    weight: W_QID,
    moves: '1. d4 Nf6 2. c4 e6 3. Nf3 b6 4. g3 Ba6 5. b3 Bb4+ 6. Bd2 Be7 7. Bg2 c6 8. O-O d5 9. Ne5 Nfd7 10. Nxd7 Nxd7 11. Nc3 O-O 12. e4 b5',
  },
  // ─── Flank openings and the rest ──────────────────────────────────────────
  {
    name: 'English Opening: 1...e6, Semi-Slav transposition',
    moves: '1. c4 e6 2. Nc3 d5 3. d4 Nf6 4. Nf3 c6 5. e3 Nbd7 6. Bd3 dxc4 7. Bxc4 b5 8. Bd3 Bb7 9. O-O a6 10. e4 c5 11. d5 Qc7 12. dxe6 fxe6',
  },
  {
    name: 'English Opening: 1...e6 2.Nf3',
    moves: '1. c4 e6 2. Nf3 d5 3. d4 Nf6 4. Nc3 c6 5. e3 Nbd7 6. Bd3 dxc4 7. Bxc4 b5 8. Bd3 Bb7 9. O-O a6 10. e4 c5 11. d5 Qc7 12. dxe6 fxe6',
  },
  {
    name: 'English Opening: 1...e6 2.Nf3 d5 3.g3',
    moves: '1. c4 e6 2. Nf3 d5 3. g3 Nf6 4. Bg2 Be7 5. O-O O-O 6. b3 c5 7. Bb2 Nc6 8. e3 b6 9. Nc3 Bb7 10. cxd5 Nxd5 11. Nxd5 Qxd5 12. d4 Rfd8',
  },
  {
    name: 'English Opening: 1...e6 2.Nf3 d5 3.b3',
    moves: '1. c4 e6 2. Nf3 d5 3. b3 Nf6 4. Bb2 Be7 5. e3 O-O 6. Be2 c5 7. O-O Nc6 8. cxd5 exd5 9. d4 b6 10. Nc3 Bb7 11. Rc1 Rc8',
  },
  {
    name: 'English Opening: 1...e6 2.Nf3 d5 3.e3',
    moves: '1. c4 e6 2. Nf3 d5 3. e3 Nf6 4. b3 Be7 5. Bb2 O-O 6. Be2 c5 7. O-O Nc6 8. cxd5 exd5 9. d4 b6 10. Nc3 Bb7 11. Rc1 Rc8',
  },
  {
    name: 'English Opening: 1...e6 2.Nc3 d5 3.cxd5',
    moves: '1. c4 e6 2. Nc3 d5 3. cxd5 exd5 4. d4 Nf6 5. Bg5 c6 6. e3 Bd6 7. Bd3 O-O 8. Qc2 Re8 9. Nge2 Nbd7 10. O-O Nf8 11. f3 Ng6',
  },
  {
    name: 'English Opening: 1...e6 2.Nc3 d5 3.e4 (Mikenas)',
    moves: '1. c4 e6 2. Nc3 d5 3. e4 d4 4. Nce2 c5 5. Ng3 Nc6 6. Nf3 e5 7. Bd3 Nf6 8. O-O Bd6 9. Nf5 Bxf5 10. exf5 O-O 11. Re1 Re8',
  },
  {
    name: 'English Opening: 1...e6 2.Nc3 d5 3.e3',
    moves: '1. c4 e6 2. Nc3 d5 3. e3 Nf6 4. Nf3 c6 5. d4 Nbd7 6. Bd3 dxc4 7. Bxc4 b5 8. Bd3 Bb7 9. O-O a6 10. e4 c5 11. d5 Qc7 12. dxe6 fxe6',
  },
  {
    name: 'English Opening: 1...e6 2.Nc3 d5 3.g3',
    moves: '1. c4 e6 2. Nc3 d5 3. g3 Nf6 4. Bg2 c6 5. Nf3 Be7 6. O-O O-O 7. d4 Nbd7 8. Qc2 b6 9. e4 Bb7 10. Rd1 Qc7 11. e5 Ne8 12. b3 c5',
  },
  {
    name: 'English Opening: 1...e6 2.g3',
    moves: '1. c4 e6 2. g3 d5 3. Bg2 Nf6 4. Nf3 c6 5. O-O Be7 6. d4 O-O 7. Nc3 Nbd7 8. Qc2 b6 9. e4 Bb7 10. Rd1 Qc7 11. e5 Ne8 12. b3 c5',
  },
  {
    name: 'English Opening: 1...e6 2.e4 (Franco-Sicilian-ish)',
    moves: '1. c4 e6 2. e4 d5 3. cxd5 exd5 4. exd5 Nf6 5. Nc3 Nxd5 6. Nf3 Nc6 7. Bb5 Nxc3 8. bxc3 Bd7 9. O-O Bd6 10. d4 O-O 11. Bd3 Qf6',
  },
  {
    name: 'English Opening: 1...e6 2.d4 d5 (QGD/Semi-Slav)',
    moves: '1. c4 e6 2. d4 d5 3. Nc3 Nf6 4. Nf3 c6 5. e3 Nbd7 6. Bd3 dxc4 7. Bxc4 b5 8. Bd3 Bb7 9. O-O a6 10. e4 c5 11. d5 Qc7 12. dxe6 fxe6',
  },
  {
    name: 'English Opening: 1...e6 2.d4 d5 3.cxd5',
    moves: '1. c4 e6 2. d4 d5 3. cxd5 exd5 4. Nc3 Nf6 5. Bg5 c6 6. e3 Bd6 7. Bd3 O-O 8. Qc2 Re8 9. Nge2 Nbd7 10. O-O Nf8 11. f3 Ng6',
  },
  {
    name: 'English Opening: 1...e6 2.d4 d5 3.Nf3 Nf6 4.Bg5',
    moves: '1. c4 e6 2. d4 d5 3. Nf3 Nf6 4. Bg5 Be7 5. Nc3 h6 6. Bh4 O-O 7. e3 b6 8. Bd3 Bb7 9. O-O Nbd7 10. Qe2 c5 11. Rfd1 Ne4',
  },
  {
    name: 'English Opening: 1...e6 2.d4 d5 3.Nf3 Nf6 4.Bf4',
    moves: '1. c4 e6 2. d4 d5 3. Nf3 Nf6 4. Bf4 c5 5. e3 Nc6 6. Nc3 Bd6 7. Bg3 O-O 8. Rc1 dxc4 9. Bxc4 b6 10. O-O Bb7 11. Qe2 Rc8',
  },
  {
    name: 'English Opening: 1...e6 2.d4 d5 3.Nf3 Nf6 4.e3',
    moves: '1. c4 e6 2. d4 d5 3. Nf3 Nf6 4. e3 c6 5. Nc3 Nbd7 6. Bd3 dxc4 7. Bxc4 b5 8. Bd3 Bb7 9. O-O a6 10. e4 c5 11. d5 Qc7 12. dxe6 fxe6',
  },
  {
    name: 'English Opening: 1...e6 2.d4 d5 3.Nf3 Nf6 4.g3',
    moves: '1. c4 e6 2. d4 d5 3. Nf3 Nf6 4. g3 Be7 5. Bg2 O-O 6. O-O dxc4 7. Qc2 a6 8. a4 Bd7 9. Qxc4 Bc6 10. Bg5 Bd5 11. Qd3 c5',
  },
  {
    name: 'English Opening: 1...e6 2.d4 d5 3.Nf3 Nf6 4.Qc2',
    moves: '1. c4 e6 2. d4 d5 3. Nf3 Nf6 4. Qc2 c6 5. Nc3 Nbd7 6. e3 Bd6 7. Bd3 O-O 8. O-O dxc4 9. Bxc4 a6 10. Rd1 b5 11. Be2 Qc7 12. e4 e5',
  },
  {
    name: 'English Opening: 1...e6 2.d4 d5 3.Nf3 Nf6 4.Nbd2',
    moves: '1. c4 e6 2. d4 d5 3. Nf3 Nf6 4. Nbd2 c6 5. e3 Nbd7 6. Bd3 Bd6 7. O-O O-O 8. Qc2 dxc4 9. Nxc4 Bc7 10. Bd2 e5 11. dxe5 Nxe5 12. Nfxe5 Bxe5',
  },
  {
    name: 'English Opening: 1...e6 2.d4 d5 3.Nf3 Nf6 4.cxd5',
    moves: '1. c4 e6 2. d4 d5 3. Nf3 Nf6 4. cxd5 exd5 5. Nc3 c6 6. Bg5 Be7 7. e3 Nbd7 8. Bd3 O-O 9. Qc2 Re8 10. O-O Nf8 11. Rab1 Ng6 12. b4 Bd6',
  },
  {
    name: 'English Opening: 1...e6 2.d4 d5 3.Nf3 Nf6 4.Nc3 c6 5.Bg5 (Semi-Slav Moscow)',
    moves: '1. c4 e6 2. d4 d5 3. Nf3 Nf6 4. Nc3 c6 5. Bg5 h6 6. Bxf6 Qxf6 7. e3 Nd7 8. Bd3 dxc4 9. Bxc4 g6 10. O-O Bg7 11. e4 O-O 12. e5 Qe7',
  },
  {
    name: 'English Opening: 1...e6 2.d4 d5 3.Nf3 Nf6 4.Nc3 c6 5.e3 (Meran)',
    moves: '1. c4 e6 2. d4 d5 3. Nf3 Nf6 4. Nc3 c6 5. e3 Nbd7 6. Bd3 dxc4 7. Bxc4 b5 8. Bd3 Bb7 9. O-O a6 10. e4 c5 11. d5 Qc7 12. dxe6 fxe6',
  },
  {
    name: 'English Opening: 1...e6 2.d4 d5 3.Nf3 Nf6 4.Nc3 c6 5.Qc2',
    moves: '1. c4 e6 2. d4 d5 3. Nf3 Nf6 4. Nc3 c6 5. Qc2 Nbd7 6. e3 Bd6 7. Bd3 O-O 8. O-O dxc4 9. Bxc4 a6 10. Rd1 b5 11. Be2 Qc7 12. e4 e5',
  },
  {
    name: 'English Opening: 1...e6 2.d4 d5 3.Nf3 Nf6 4.Nc3 c6 5.Qb3',
    moves: '1. c4 e6 2. d4 d5 3. Nf3 Nf6 4. Nc3 c6 5. Qb3 dxc4 6. Qxc4 b5 7. Qd3 Nbd7 8. e4 b4 9. Na4 Bb7 10. Bg5 Be7 11. e5 Nd5 12. Bxe7 Qxe7',
  },
  {
    name: 'English Opening: 1...e6 2.d4 d5 3.Nf3 Nf6 4.Nc3 c6 5.g3',
    moves: '1. c4 e6 2. d4 d5 3. Nf3 Nf6 4. Nc3 c6 5. g3 dxc4 6. Bg2 Nbd7 7. O-O Be7 8. e4 O-O 9. Qe2 b5 10. Rd1 Bb7 11. d5 cxd5 12. exd5 e5',
  },
  {
    name: 'English Opening: 1...e6 2.d4 d5 3.Nf3 Nf6 4.Nc3 c6 5.cxd5',
    moves: '1. c4 e6 2. d4 d5 3. Nf3 Nf6 4. Nc3 c6 5. cxd5 exd5 6. Qc2 g6 7. Bg5 Bf5 8. Qb3 Qb6 9. Qxb6 axb6 10. e3 Nbd7 11. Bd3 Bxd3',
  },
  {
    name: 'English Opening: 1...e6 2.d4 d5 3.Nf3 Nf6 4.Nc3 c6 5.Bd2',
    moves: '1. c4 e6 2. d4 d5 3. Nf3 Nf6 4. Nc3 c6 5. Bd2 Nbd7 6. e3 Bd6 7. Bd3 O-O 8. O-O dxc4 9. Bxc4 e5 10. h3 Qe7 11. Qc2 exd4 12. exd4 Nb6',
  },
  {
    name: 'English Opening: 1...e6 2.d4 d5 3.Nf3 Nf6 4.Nc3 c6 5.a4',
    moves: '1. c4 e6 2. d4 d5 3. Nf3 Nf6 4. Nc3 c6 5. a4 Nbd7 6. e3 Bd6 7. Bd3 O-O 8. O-O dxc4 9. Bxc4 e5 10. h3 Qe7 11. Qc2 exd4 12. exd4 Nb6',
  },
  {
    name: 'English Opening: 1...e6 2.d4 d5 3.Nf3 Nf6 4.Nc3 c6 5.Qd3',
    moves: '1. c4 e6 2. d4 d5 3. Nf3 Nf6 4. Nc3 c6 5. Qd3 dxc4 6. Qxc4 b5 7. Qd3 Nbd7 8. e4 b4 9. Na4 Bb7 10. Bg5 Be7 11. e5 Nd5 12. Bxe7 Qxe7',
  },
  {
    name: 'English Opening: 1...e6 2.d4 d5 3.Nf3 Nf6 4.Nc3 c6 5.Bf4',
    moves: '1. c4 e6 2. d4 d5 3. Nf3 Nf6 4. Nc3 c6 5. Bf4 dxc4 6. e3 b5 7. a4 Bb4 8. axb5 cxb5 9. Be2 Bb7 10. O-O Nbd7 11. Qc2 Qb6 12. Rfd1 O-O',
  },
  {
    name: 'English Opening: 1...e6 2.d4 d5 3.Nf3 Nf6 4.Nc3 c6 5.e4?!',
    moves: '1. c4 e6 2. d4 d5 3. Nf3 Nf6 4. Nc3 c6 5. e4 dxe4 6. Nxe4 Nxe4 7. Qa4?! b5 8. Qb3 Qd5 9. Be2 Bb7 10. O-O Nd7',
  },
  {
    name: 'English Opening: 1...e6 2.d4 d5 3.Nf3 Nf6 4.Nc3 c6 5.b3',
    moves: '1. c4 e6 2. d4 d5 3. Nf3 Nf6 4. Nc3 c6 5. b3 Nbd7 6. e3 Bd6 7. Bd3 O-O 8. Bb2 Qe7 9. O-O e5 10. cxd5 cxd5 11. dxe5 Nxe5 12. Nxe5 Bxe5',
  },
  {
    name: 'English Opening: 1...e6 2.d4 d5 3.Nf3 Nf6 4.Nc3 c6 5.h3?!',
    moves: '1. c4 e6 2. d4 d5 3. Nf3 Nf6 4. Nc3 c6 5. h3 Nbd7 6. e3 Bd6 7. Bd3 O-O 8. O-O dxc4 9. Bxc4 e5 10. Qc2 Qe7 11. Rd1 exd4 12. exd4 Nb6',
  },
  {
    name: 'English Opening: 1...e6 2.d4 d5 3.Nf3 Nf6 4.Nc3 c6 5.Rb1?!',
    moves: '1. c4 e6 2. d4 d5 3. Nf3 Nf6 4. Nc3 c6 5. Rb1 Nbd7 6. e3 Bd6 7. Bd3 O-O 8. O-O dxc4 9. Bxc4 e5 10. h3 Qe7 11. Qc2 exd4 12. exd4 Nb6',
  },
  {
    name: 'English Opening: 1...e6 2.d4 d5 3.Nf3 Nf6 4.Nc3 c6 5.Nd2?!',
    moves: '1. c4 e6 2. d4 d5 3. Nf3 Nf6 4. Nc3 c6 5. Nd2 Nbd7 6. e3 Bd6 7. Bd3 O-O 8. O-O dxc4 9. Nxc4 Bc7 10. Bd2 e5 11. dxe5 Nxe5 12. Nxe5 Bxe5',
  },
  {
    name: 'English Opening: 1...e6 2.d4 d5 3.Nf3 Nf6 4.Nc3 c6 5.Ne5?!',
    moves: '1. c4 e6 2. d4 d5 3. Nf3 Nf6 4. Nc3 c6 5. Ne5 Nbd7 6. Nxd7 Bxd7 7. e3 Bd6 8. Bd3 O-O 9. O-O dxc4 10. Bxc4 e5 11. h3 Qe7 12. Qc2 exd4',
  },
  {
    name: 'English Opening: 1...e6 2.d4 d5 3.Nf3 Nf6 4.Nc3 c6 5.e3 Nbd7 6.Bd3 Bd6?!',
    weight: 0.6,
    moves: '1. c4 e6 2. d4 d5 3. Nf3 Nf6 4. Nc3 c6 5. e3 Nbd7 6. Bd3 dxc4 7. Bxc4 b5 8. Be2 Bb7 9. O-O Be7 10. e4 b4 11. e5 bxc3 12. exf6 Bxf6',
  },
  {
    name: 'Réti Opening: 1...d5 2.c4 c6',
    moves: '1. Nf3 d5 2. c4 c6 3. d4 Nf6 4. Nc3 e6 5. e3 Nbd7 6. Bd3 dxc4 7. Bxc4 b5 8. Bd3 Bb7 9. O-O a6 10. e4 c5 11. d5 Qc7 12. dxe6 fxe6',
  },
  {
    name: 'Réti Opening: 1...d5 2.c4 c6 3.e3',
    moves: '1. Nf3 d5 2. c4 c6 3. e3 Nf6 4. Nc3 e6 5. d4 Nbd7 6. Bd3 dxc4 7. Bxc4 b5 8. Bd3 Bb7 9. O-O a6 10. e4 c5 11. d5 Qc7 12. dxe6 fxe6',
  },
  {
    name: 'Réti Opening: 1...d5 2.c4 c6 3.g3',
    moves: '1. Nf3 d5 2. c4 c6 3. g3 Nf6 4. Bg2 e6 5. O-O Nbd7 6. b3 Bd6 7. Bb2 O-O 8. d3 Re8 9. Nbd2 e5 10. cxd5 cxd5 11. e4 d4',
  },
  {
    name: 'Réti Opening: 1...d5 2.c4 c6 3.b3',
    moves: '1. Nf3 d5 2. c4 c6 3. b3 Nf6 4. Bb2 Bg4 5. e3 e6 6. Be2 Nbd7 7. O-O Bd6 8. d4 O-O 9. Nbd2 Qe7 10. Rc1 Rfd8 11. Ne5 Bxe2',
  },
  {
    name: 'Réti Opening: 1...d5 2.c4 c6 3.cxd5',
    moves: '1. Nf3 d5 2. c4 c6 3. cxd5 cxd5 4. d4 Nf6 5. Nc3 Nc6 6. Bf4 Bf5 7. e3 e6 8. Bb5 Nd7 9. Qa4 Rc8 10. O-O a6 11. Bxc6 Rxc6 12. Rfc1 Be7',
  },
  {
    name: 'Réti Opening: 1...d5 2.c4 c6 3.Qc2?!',
    moves: '1. Nf3 d5 2. c4 c6 3. Qc2 Nf6 4. d4 e6 5. Nc3 Nbd7 6. e3 Bd6 7. Bd3 O-O 8. O-O dxc4 9. Bxc4 a6 10. Rd1 b5 11. Be2 Qc7 12. e4 e5',
  },
  {
    name: 'Réti Opening: 1...d5 2.c4 c6 3.Qb3',
    moves: '1. Nf3 d5 2. c4 c6 3. Qb3 Nf6 4. Nc3 dxc4 5. Qxc4 Bf5 6. d4 e6 7. g3 Nbd7 8. Bg2 Be7 9. O-O O-O 10. Re1 Ne4 11. Qb3 Qb6 12. Qxb6 Nxb6',
  },
  {
    name: 'Réti Opening: 1...d5 2.c4 c6 3.Nc3 Nf6 4.e3',
    moves: '1. Nf3 d5 2. c4 c6 3. Nc3 Nf6 4. e3 e6 5. d4 Nbd7 6. Bd3 dxc4 7. Bxc4 b5 8. Bd3 Bb7 9. O-O a6 10. e4 c5 11. d5 Qc7 12. dxe6 fxe6',
  },
  {
    name: 'Réti Opening: 1...d5 2.c4 c6 3.Nc3 Nf6 4.Qc2',
    moves: '1. Nf3 d5 2. c4 c6 3. Nc3 Nf6 4. Qc2 e6 5. d4 Nbd7 6. e3 Bd6 7. Bd3 O-O 8. O-O dxc4 9. Bxc4 a6 10. Rd1 b5 11. Be2 Qc7 12. e4 e5',
  },
  {
    name: 'Réti Opening: 1...d5 2.c4 c6 3.Nc3 Nf6 4.Qb3',
    moves: '1. Nf3 d5 2. c4 c6 3. Nc3 Nf6 4. Qb3 dxc4 5. Qxc4 Bf5 6. d4 e6 7. g3 Nbd7 8. Bg2 Be7 9. O-O O-O 10. Re1 Ne4 11. Qb3 Qb6 12. Qxb6 Nxb6',
  },
  {
    name: 'Réti Opening: 1...d5 2.c4 c6 3.Nc3 Nf6 4.g3',
    moves: '1. Nf3 d5 2. c4 c6 3. Nc3 Nf6 4. g3 e6 5. Bg2 Nbd7 6. O-O Be7 7. d4 O-O 8. Qc2 b6 9. e4 Bb7 10. Rd1 Qc7 11. e5 Ne8 12. b3 c5',
  },
  {
    name: 'Réti Opening: 1...d5 2.c4 c6 3.Nc3 Nf6 4.cxd5',
    moves: '1. Nf3 d5 2. c4 c6 3. Nc3 Nf6 4. cxd5 cxd5 5. d4 Nc6 6. Bf4 Bf5 7. e3 e6 8. Bb5 Nd7 9. Qa4 Rc8 10. O-O a6 11. Bxc6 Rxc6 12. Rfc1 Be7',
  },
  {
    name: 'Réti Opening: 1...d5 2.c4 c6 3.Nc3 Nf6 4.d4 e6 (Semi-Slav)',
    moves: '1. Nf3 d5 2. c4 c6 3. Nc3 Nf6 4. d4 e6 5. e3 Nbd7 6. Bd3 dxc4 7. Bxc4 b5 8. Bd3 Bb7 9. O-O a6 10. e4 c5 11. d5 Qc7 12. dxe6 fxe6',
  },
  {
    name: 'Réti Opening: 1...d5 2.c4 c6 3.Nc3 Nf6 4.d4 e6 5.Bg5',
    moves: '1. Nf3 d5 2. c4 c6 3. Nc3 Nf6 4. d4 e6 5. Bg5 h6 6. Bxf6 Qxf6 7. e3 Nd7 8. Bd3 dxc4 9. Bxc4 g6 10. O-O Bg7 11. e4 O-O 12. e5 Qe7',
  },
  {
    name: 'Réti Opening: 1...d5 2.c4 c6 3.Nc3 Nf6 4.d4 e6 5.Qc2',
    moves: '1. Nf3 d5 2. c4 c6 3. Nc3 Nf6 4. d4 e6 5. Qc2 Nbd7 6. e3 Bd6 7. Bd3 O-O 8. O-O dxc4 9. Bxc4 a6 10. Rd1 b5 11. Be2 Qc7 12. e4 e5',
  },
  {
    name: 'Réti Opening: 1...d5 2.c4 c6 3.Nc3 Nf6 4.d4 e6 5.Qb3',
    moves: '1. Nf3 d5 2. c4 c6 3. Nc3 Nf6 4. d4 e6 5. Qb3 dxc4 6. Qxc4 b5 7. Qd3 Nbd7 8. e4 b4 9. Na4 Bb7 10. Bg5 Be7 11. e5 Nd5 12. Bxe7 Qxe7',
  },
  {
    name: 'Réti Opening: 1...d5 2.c4 c6 3.Nc3 Nf6 4.d4 e6 5.g3',
    moves: '1. Nf3 d5 2. c4 c6 3. Nc3 Nf6 4. d4 e6 5. g3 dxc4 6. Bg2 Nbd7 7. O-O Be7 8. e4 O-O 9. Qe2 b5 10. Rd1 Bb7 11. d5 cxd5 12. exd5 e5',
  },
  {
    name: 'Réti Opening: 1...d5 2.c4 c6 3.Nc3 Nf6 4.d4 e6 5.cxd5',
    moves: '1. Nf3 d5 2. c4 c6 3. Nc3 Nf6 4. d4 e6 5. cxd5 exd5 6. Qc2 g6 7. Bg5 Bf5 8. Qb3 Qb6 9. Qxb6 axb6 10. e3 Nbd7 11. Bd3 Bxd3',
  },
  {
    name: 'Réti Opening: 1...d5 2.c4 c6 3.Nc3 Nf6 4.d4 e6 5.Bd2',
    moves: '1. Nf3 d5 2. c4 c6 3. Nc3 Nf6 4. d4 e6 5. Bd2 Nbd7 6. e3 Bd6 7. Bd3 O-O 8. O-O dxc4 9. Bxc4 e5 10. h3 Qe7 11. Qc2 exd4 12. exd4 Nb6',
  },
  {
    name: 'Réti Opening: 1...d5 2.c4 c6 3.Nc3 Nf6 4.d4 e6 5.a4',
    moves: '1. Nf3 d5 2. c4 c6 3. Nc3 Nf6 4. d4 e6 5. a4 Nbd7 6. e3 Bd6 7. Bd3 O-O 8. O-O dxc4 9. Bxc4 e5 10. h3 Qe7 11. Qc2 exd4 12. exd4 Nb6',
  },
  {
    name: 'Réti Opening: 1...d5 2.c4 c6 3.Nc3 Nf6 4.d4 e6 5.Qd3',
    moves: '1. Nf3 d5 2. c4 c6 3. Nc3 Nf6 4. d4 e6 5. Qd3 dxc4 6. Qxc4 b5 7. Qd3 Nbd7 8. e4 b4 9. Na4 Bb7 10. Bg5 Be7 11. e5 Nd5 12. Bxe7 Qxe7',
  },
  {
    name: 'Réti Opening: 1...d5 2.c4 c6 3.Nc3 Nf6 4.d4 e6 5.Bf4',
    moves: '1. Nf3 d5 2. c4 c6 3. Nc3 Nf6 4. d4 e6 5. Bf4 dxc4 6. e3 b5 7. a4 Bb4 8. axb5 cxb5 9. Be2 Bb7 10. O-O Nbd7 11. Qc2 Qb6 12. Rfd1 O-O',
  },
  {
    name: 'Réti Opening: 1...d5 2.c4 c6 3.Nc3 Nf6 4.d4 e6 5.e4?!',
    moves: '1. Nf3 d5 2. c4 c6 3. Nc3 Nf6 4. d4 e6 5. e4 dxe4 6. Nxe4 Nxe4 7. Qa4?! b5 8. Qb3 Qd5 9. Be2 Bb7 10. O-O Nd7',
  },
  {
    name: 'Réti Opening: 1...d5 2.c4 c6 3.Nc3 Nf6 4.d4 e6 5.b3',
    moves: '1. Nf3 d5 2. c4 c6 3. Nc3 Nf6 4. d4 e6 5. b3 Nbd7 6. e3 Bd6 7. Bd3 O-O 8. Bb2 Qe7 9. O-O e5 10. cxd5 cxd5 11. dxe5 Nxe5 12. Nxe5 Bxe5',
  },
  {
    name: 'Réti Opening: 1...d5 2.c4 c6 3.Nc3 Nf6 4.d4 e6 5.h3?!',
    moves: '1. Nf3 d5 2. c4 c6 3. Nc3 Nf6 4. d4 e6 5. h3 Nbd7 6. e3 Bd6 7. Bd3 O-O 8. O-O dxc4 9. Bxc4 e5 10. Qc2 Qe7 11. Rd1 exd4 12. exd4 Nb6',
  },
  {
    name: 'Réti Opening: 1...d5 2.c4 c6 3.Nc3 Nf6 4.d4 e6 5.Rb1?!',
    moves: '1. Nf3 d5 2. c4 c6 3. Nc3 Nf6 4. d4 e6 5. Rb1 Nbd7 6. e3 Bd6 7. Bd3 O-O 8. O-O dxc4 9. Bxc4 e5 10. h3 Qe7 11. Qc2 exd4 12. exd4 Nb6',
  },
  {
    name: 'Réti Opening: 1...d5 2.c4 c6 3.Nc3 Nf6 4.d4 e6 5.Nd2?!',
    moves: '1. Nf3 d5 2. c4 c6 3. Nc3 Nf6 4. d4 e6 5. Nd2 Nbd7 6. e3 Bd6 7. Bd3 O-O 8. O-O dxc4 9. Nxc4 Bc7 10. Bd2 e5 11. dxe5 Nxe5 12. Nxe5 Bxe5',
  },
  {
    name: 'Réti Opening: 1...d5 2.c4 c6 3.Nc3 Nf6 4.d4 e6 5.Ne5?!',
    moves: '1. Nf3 d5 2. c4 c6 3. Nc3 Nf6 4. d4 e6 5. Ne5 Nbd7 6. Nxd7 Bxd7 7. e3 Bd6 8. Bd3 O-O 9. O-O dxc4 10. Bxc4 e5 11. h3 Qe7 12. Qc2 exd4',
  },
  {
    name: 'Réti Opening: 1...d5 2.g3',
    moves: '1. Nf3 d5 2. g3 Nf6 3. Bg2 c6 4. O-O Bg4 5. d3 e6 6. Nbd2 Nbd7 7. e4 Bd6 8. Qe1 O-O 9. h3 Bh5 10. Nh4 dxe4 11. dxe4 e5',
  },
  {
    name: 'Réti Opening: 1...d5 2.g3 Nf6 3.Bg2 c6 4.O-O Bf5',
    weight: 0.6,
    moves: '1. Nf3 d5 2. g3 Nf6 3. Bg2 c6 4. O-O Bf5 5. d3 e6 6. Nbd2 h6 7. Qe1 Be7 8. e4 Bh7 9. Qe2 O-O 10. b3 a5 11. a3 Nbd7',
  },
  {
    name: 'Réti Opening: 1...d5 2.b3',
    moves: '1. Nf3 d5 2. b3 Nf6 3. Bb2 Bg4 4. e3 e6 5. Be2 Nbd7 6. O-O Bd6 7. d3 O-O 8. Nbd2 c6 9. c4 Qe7 10. Qc2 Rfd8 11. Rfe1 e5',
  },
  {
    name: 'Réti Opening: 1...d5 2.b3 Nf6 3.Bb2 e6',
    weight: 0.6,
    moves: '1. Nf3 d5 2. b3 Nf6 3. Bb2 e6 4. e3 Be7 5. Be2 O-O 6. O-O c5 7. c4 Nc6 8. cxd5 exd5 9. d4 b6 10. Nc3 Bb7 11. Rc1 Rc8',
  },
  {
    name: 'Réti Opening: 1...d5 2.b3 Nf6 3.Bb2 c6?!',
    weight: 0.6,
    moves: '1. Nf3 d5 2. b3 Nf6 3. Bb2 c6 4. e3 Bg4 5. Be2 e6 6. O-O Bd6 7. d3 Nbd7 8. Nbd2 O-O 9. c4 Qe7 10. Qc2 Rfd8 11. Rfe1 e5',
  },
  {
    name: 'Réti Opening: 1...d5 2.e3',
    moves: '1. Nf3 d5 2. e3 Nf6 3. b3 Bg4 4. Bb2 e6 5. Be2 Nbd7 6. O-O Bd6 7. d3 O-O 8. Nbd2 c6 9. c4 Qe7 10. Qc2 Rfd8 11. Rfe1 e5',
  },
  {
    name: 'Réti Opening: 1...d5 2.d4 Nf6 3.c4 c6 (Semi-Slav)',
    moves: '1. Nf3 d5 2. d4 Nf6 3. c4 c6 4. Nc3 e6 5. e3 Nbd7 6. Bd3 dxc4 7. Bxc4 b5 8. Bd3 Bb7 9. O-O a6 10. e4 c5 11. d5 Qc7 12. dxe6 fxe6',
  },
  {
    name: 'Réti Opening: 1...d5 2.d4 Nf6 3.e3',
    moves: '1. Nf3 d5 2. d4 Nf6 3. e3 e6 4. Bd3 c5 5. b3 Nc6 6. O-O Bd6 7. Bb2 O-O 8. Nbd2 Qe7 9. Ne5 Bxe5 10. dxe5 Nd7 11. f4 f6',
  },
  {
    name: 'Réti Opening: 1...d5 2.d4 Nf6 3.Bf4 (London)',
    moves: '1. Nf3 d5 2. d4 Nf6 3. Bf4 c5 4. e3 Nc6 5. c3 e6 6. Nbd2 Bd6 7. Bg3 O-O 8. Bd3 b6 9. Ne5 Bb7 10. f4 Ne7 11. O-O Nf5',
  },
  {
    name: 'Réti Opening: 1...d5 2.d4 Nf6 3.Bg5 (Torre)',
    moves: '1. Nf3 d5 2. d4 Nf6 3. Bg5 Ne4 4. Bf4 c5 5. e3 Nc6 6. c3 Qb6 7. Qb3 c4 8. Qxb6 axb6 9. Nbd2 Nxd2 10. Nxd2 b5 11. Be2 e6',
  },
  {
    name: 'Réti Opening: 1...d5 2.d4 Nf6 3.g3',
    moves: '1. Nf3 d5 2. d4 Nf6 3. g3 c6 4. Bg2 Bg4 5. O-O e6 6. c4 Nbd7 7. Nc3 Bd6 8. Qb3 Qb6 9. c5 Bxc5 10. dxc5 Qxc5 11. Be3 Qa5',
  },
  {
    name: 'Réti Opening: 1...d5 2.d4 Nf6 3.Nc3',
    moves: '1. Nf3 d5 2. d4 Nf6 3. Nc3 e6 4. Bg5 Nbd7 5. e3 Be7 6. Bd3 c5 7. O-O O-O 8. Qe2 b6 9. Rad1 Bb7 10. Ne5 Nxe5 11. dxe5 Nd7',
  },
  {
    name: 'Réti Opening: 1...d5 2.d4 Nf6 3.c4 e6 4.Nc3 c6 (Semi-Slav)',
    moves: '1. Nf3 d5 2. d4 Nf6 3. c4 e6 4. Nc3 c6 5. e3 Nbd7 6. Bd3 dxc4 7. Bxc4 b5 8. Bd3 Bb7 9. O-O a6 10. e4 c5 11. d5 Qc7 12. dxe6 fxe6',
  },
  {
    name: 'Réti Opening: 1...d5 2.d4 Nf6 3.c4 e6 4.g3 (Catalan)',
    moves: '1. Nf3 d5 2. d4 Nf6 3. c4 e6 4. g3 Be7 5. Bg2 O-O 6. O-O dxc4 7. Qc2 a6 8. a4 Bd7 9. Qxc4 Bc6 10. Bg5 Bd5 11. Qd3 c5',
  },
  {
    name: 'Réti Opening: 1...d5 2.d4 Nf6 3.c4 e6 4.Bg5',
    moves: '1. Nf3 d5 2. d4 Nf6 3. c4 e6 4. Bg5 Be7 5. Nc3 h6 6. Bh4 O-O 7. e3 b6 8. Bd3 Bb7 9. O-O Nbd7 10. Qe2 c5 11. Rfd1 Ne4',
  },
  {
    name: 'Réti Opening: 1...d5 2.d4 Nf6 3.c4 e6 4.e3',
    moves: '1. Nf3 d5 2. d4 Nf6 3. c4 e6 4. e3 c6 5. Nc3 Nbd7 6. Bd3 dxc4 7. Bxc4 b5 8. Bd3 Bb7 9. O-O a6 10. e4 c5 11. d5 Qc7 12. dxe6 fxe6',
  },
  {
    name: 'Réti Opening: 1...d5 2.d4 Nf6 3.c4 e6 4.Bf4',
    moves: '1. Nf3 d5 2. d4 Nf6 3. c4 e6 4. Bf4 c5 5. e3 Nc6 6. Nc3 Bd6 7. Bg3 O-O 8. Rc1 dxc4 9. Bxc4 b6 10. O-O Bb7 11. Qe2 Rc8',
  },
  {
    name: 'Réti Opening: 1...d5 2.d4 Nf6 3.c4 e6 4.Qc2',
    moves: '1. Nf3 d5 2. d4 Nf6 3. c4 e6 4. Qc2 c6 5. Nc3 Nbd7 6. e3 Bd6 7. Bd3 O-O 8. O-O dxc4 9. Bxc4 a6 10. Rd1 b5 11. Be2 Qc7 12. e4 e5',
  },
  {
    name: 'Réti Opening: 1...d5 2.d4 Nf6 3.c4 e6 4.Nbd2',
    moves: '1. Nf3 d5 2. d4 Nf6 3. c4 e6 4. Nbd2 c6 5. e3 Nbd7 6. Bd3 Bd6 7. O-O O-O 8. Qc2 dxc4 9. Nxc4 Bc7 10. Bd2 e5 11. dxe5 Nxe5 12. Nfxe5 Bxe5',
  },
  {
    name: 'Réti Opening: 1...d5 2.d4 Nf6 3.c4 e6 4.cxd5',
    moves: '1. Nf3 d5 2. d4 Nf6 3. c4 e6 4. cxd5 exd5 5. Nc3 c6 6. Bg5 Be7 7. e3 Nbd7 8. Bd3 O-O 9. Qc2 Re8 10. O-O Nf8 11. Rab1 Ng6 12. b4 Bd6',
  },
  {
    name: 'Réti Opening: 1...d5 2.d4 Nf6 3.c4 e6 4.Nc3 c6 5.Bg5 (Moscow)',
    moves: '1. Nf3 d5 2. d4 Nf6 3. c4 e6 4. Nc3 c6 5. Bg5 h6 6. Bxf6 Qxf6 7. e3 Nd7 8. Bd3 dxc4 9. Bxc4 g6 10. O-O Bg7 11. e4 O-O 12. e5 Qe7',
  },
  {
    name: 'Réti Opening: 1...d5 2.d4 Nf6 3.c4 e6 4.Nc3 c6 5.Qc2',
    moves: '1. Nf3 d5 2. d4 Nf6 3. c4 e6 4. Nc3 c6 5. Qc2 Nbd7 6. e3 Bd6 7. Bd3 O-O 8. O-O dxc4 9. Bxc4 a6 10. Rd1 b5 11. Be2 Qc7 12. e4 e5',
  },
  {
    name: 'Réti Opening: 1...d5 2.d4 Nf6 3.c4 e6 4.Nc3 c6 5.Qb3',
    moves: '1. Nf3 d5 2. d4 Nf6 3. c4 e6 4. Nc3 c6 5. Qb3 dxc4 6. Qxc4 b5 7. Qd3 Nbd7 8. e4 b4 9. Na4 Bb7 10. Bg5 Be7 11. e5 Nd5 12. Bxe7 Qxe7',
  },
  {
    name: 'Réti Opening: 1...d5 2.d4 Nf6 3.c4 e6 4.Nc3 c6 5.g3',
    moves: '1. Nf3 d5 2. d4 Nf6 3. c4 e6 4. Nc3 c6 5. g3 dxc4 6. Bg2 Nbd7 7. O-O Be7 8. e4 O-O 9. Qe2 b5 10. Rd1 Bb7 11. d5 cxd5 12. exd5 e5',
  },
  {
    name: 'Réti Opening: 1...d5 2.d4 Nf6 3.c4 e6 4.Nc3 c6 5.cxd5',
    moves: '1. Nf3 d5 2. d4 Nf6 3. c4 e6 4. Nc3 c6 5. cxd5 exd5 6. Qc2 g6 7. Bg5 Bf5 8. Qb3 Qb6 9. Qxb6 axb6 10. e3 Nbd7 11. Bd3 Bxd3',
  },
  {
    name: 'Réti Opening: 1...d5 2.d4 Nf6 3.c4 e6 4.Nc3 c6 5.e3 (Meran)',
    moves: '1. Nf3 d5 2. d4 Nf6 3. c4 e6 4. Nc3 c6 5. e3 Nbd7 6. Bd3 dxc4 7. Bxc4 b5 8. Bd3 Bb7 9. O-O a6 10. e4 c5 11. d5 Qc7 12. dxe6 fxe6',
  },
  {
    name: 'Réti Opening: 1...d5 2.d4 Nf6 3.c4 e6 4.Nc3 c6 5.Bd2',
    moves: '1. Nf3 d5 2. d4 Nf6 3. c4 e6 4. Nc3 c6 5. Bd2 Nbd7 6. e3 Bd6 7. Bd3 O-O 8. O-O dxc4 9. Bxc4 e5 10. h3 Qe7 11. Qc2 exd4 12. exd4 Nb6',
  },
  {
    name: 'Réti Opening: 1...d5 2.d4 Nf6 3.c4 e6 4.Nc3 c6 5.a4',
    moves: '1. Nf3 d5 2. d4 Nf6 3. c4 e6 4. Nc3 c6 5. a4 Nbd7 6. e3 Bd6 7. Bd3 O-O 8. O-O dxc4 9. Bxc4 e5 10. h3 Qe7 11. Qc2 exd4 12. exd4 Nb6',
  },
  {
    name: 'Réti Opening: 1...d5 2.d4 Nf6 3.c4 e6 4.Nc3 c6 5.Qd3',
    moves: '1. Nf3 d5 2. d4 Nf6 3. c4 e6 4. Nc3 c6 5. Qd3 dxc4 6. Qxc4 b5 7. Qd3 Nbd7 8. e4 b4 9. Na4 Bb7 10. Bg5 Be7 11. e5 Nd5 12. Bxe7 Qxe7',
  },
  {
    name: 'Réti Opening: 1...d5 2.d4 Nf6 3.c4 e6 4.Nc3 c6 5.Bf4',
    moves: '1. Nf3 d5 2. d4 Nf6 3. c4 e6 4. Nc3 c6 5. Bf4 dxc4 6. e3 b5 7. a4 Bb4 8. axb5 cxb5 9. Be2 Bb7 10. O-O Nbd7 11. Qc2 Qb6 12. Rfd1 O-O',
  },
  {
    name: 'Réti Opening: 1...d5 2.d4 Nf6 3.c4 e6 4.Nc3 c6 5.e4?!',
    moves: '1. Nf3 d5 2. d4 Nf6 3. c4 e6 4. Nc3 c6 5. e4 dxe4 6. Nxe4 Nxe4 7. Qa4?! b5 8. Qb3 Qd5 9. Be2 Bb7 10. O-O Nd7',
  },
  {
    name: 'Réti Opening: 1...d5 2.d4 Nf6 3.c4 e6 4.Nc3 c6 5.b3',
    moves: '1. Nf3 d5 2. d4 Nf6 3. c4 e6 4. Nc3 c6 5. b3 Nbd7 6. e3 Bd6 7. Bd3 O-O 8. Bb2 Qe7 9. O-O e5 10. cxd5 cxd5 11. dxe5 Nxe5 12. Nxe5 Bxe5',
  },
  {
    name: 'Réti Opening: 1...d5 2.d4 Nf6 3.c4 e6 4.Nc3 c6 5.h3?!',
    moves: '1. Nf3 d5 2. d4 Nf6 3. c4 e6 4. Nc3 c6 5. h3 Nbd7 6. e3 Bd6 7. Bd3 O-O 8. O-O dxc4 9. Bxc4 e5 10. Qc2 Qe7 11. Rd1 exd4 12. exd4 Nb6',
  },
  {
    name: 'Réti Opening: 1...d5 2.d4 Nf6 3.c4 e6 4.Nc3 c6 5.Rb1?!',
    moves: '1. Nf3 d5 2. d4 Nf6 3. c4 e6 4. Nc3 c6 5. Rb1 Nbd7 6. e3 Bd6 7. Bd3 O-O 8. O-O dxc4 9. Bxc4 e5 10. h3 Qe7 11. Qc2 exd4 12. exd4 Nb6',
  },
  {
    name: 'Réti Opening: 1...d5 2.d4 Nf6 3.c4 e6 4.Nc3 c6 5.Nd2?!',
    moves: '1. Nf3 d5 2. d4 Nf6 3. c4 e6 4. Nc3 c6 5. Nd2 Nbd7 6. e3 Bd6 7. Bd3 O-O 8. O-O dxc4 9. Nxc4 Bc7 10. Bd2 e5 11. dxe5 Nxe5 12. Nxe5 Bxe5',
  },
  {
    name: 'Réti Opening: 1...d5 2.d4 Nf6 3.c4 e6 4.Nc3 c6 5.Ne5?!',
    moves: '1. Nf3 d5 2. d4 Nf6 3. c4 e6 4. Nc3 c6 5. Ne5 Nbd7 6. Nxd7 Bxd7 7. e3 Bd6 8. Bd3 O-O 9. O-O dxc4 10. Bxc4 e5 11. h3 Qe7 12. Qc2 exd4',
  },
  {
    name: 'Réti Opening: 1...d5 2.d4 Nf6 3.c4 e6 4.Nc3 c6 5.e3 Nbd7 6.Bd3 dxc4 7.Bxc4 b5 8.Be2',
    weight: 0.6,
    moves: '1. Nf3 d5 2. d4 Nf6 3. c4 e6 4. Nc3 c6 5. e3 Nbd7 6. Bd3 dxc4 7. Bxc4 b5 8. Be2 Bb7 9. O-O Be7 10. e4 b4 11. e5 bxc3 12. exf6 Bxf6',
  },
  {
    name: 'Réti Opening: 1...d5 2.d4 Nf6 3.c4 e6 4.Nc3 c6 5.e3 Nbd7 6.Bd3 dxc4 7.Bxc4 b5 8.Bb3',
    weight: 0.6,
    moves: '1. Nf3 d5 2. d4 Nf6 3. c4 e6 4. Nc3 c6 5. e3 Nbd7 6. Bd3 dxc4 7. Bxc4 b5 8. Bb3 b4 9. Ne2 Bb7 10. O-O Be7 11. Ng3 O-O 12. e4 c5',
  },
  {
    name: 'Réti Opening: 1...d5 2.d4 Nf6 3.c4 e6 4.Nc3 c6 5.e3 Nbd7 6.Bd3 dxc4 7.Bxc4 b5 8.Bd3 a6 (Wade)',
    weight: 0.6,
    moves: '1. Nf3 d5 2. d4 Nf6 3. c4 e6 4. Nc3 c6 5. e3 Nbd7 6. Bd3 dxc4 7. Bxc4 b5 8. Bd3 a6 9. e4 c5 10. e5 cxd4 11. Nxb5 axb5 12. exf6 gxf6',
  },
  {
    name: 'Réti Opening: 1...d5 2.d4 Nf6 3.c4 e6 4.Nc3 c6 5.e3 Nbd7 6.Qc2 Bd6 7.Be2',
    weight: 0.6,
    moves: '1. Nf3 d5 2. d4 Nf6 3. c4 e6 4. Nc3 c6 5. e3 Nbd7 6. Qc2 Bd6 7. Be2 O-O 8. O-O dxc4 9. Bxc4 e5 10. h3 Qe7 11. Rd1 exd4 12. exd4 Nb6',
  },
  {
    name: 'Réti Opening: 1...d5 2.d4 Nf6 3.c4 e6 4.Nc3 c6 5.e3 Nbd7 6.Qc2 Bd6 7.g4 (Shirov-Shabalov)',
    weight: 0.6,
    moves: '1. Nf3 d5 2. d4 Nf6 3. c4 e6 4. Nc3 c6 5. e3 Nbd7 6. Qc2 Bd6 7. g4 Nxg4 8. Rg1 Qf6 9. Rxg4 Qxf3 10. Rxg7 Nf6 11. Bd2 Bd7',
  },
  {
    name: 'Réti Opening: 1...d5 2.d4 Nf6 3.c4 e6 4.Nc3 c6 5.e3 Nbd7 6.Qc2 Bd6 7.b3',
    weight: 0.6,
    moves: '1. Nf3 d5 2. d4 Nf6 3. c4 e6 4. Nc3 c6 5. e3 Nbd7 6. Qc2 Bd6 7. b3 O-O 8. Be2 b6 9. O-O Bb7 10. Bb2 Qe7 11. Rad1 Rad8',
  },
  {
    name: 'Réti Opening: 1...d5 2.d4 Nf6 3.c4 e6 4.Nc3 c6 5.e3 Nbd7 6.Qc2 Bd6 7.Bd3 O-O 8.O-O e5',
    weight: 0.6,
    moves: '1. Nf3 d5 2. d4 Nf6 3. c4 e6 4. Nc3 c6 5. e3 Nbd7 6. Qc2 Bd6 7. Bd3 O-O 8. O-O e5 9. cxd5 cxd5 10. e4 exd4 11. Nxd5 Nxd5 12. exd5 Nf6',
  },
  {
    name: 'Réti Opening: 1...d5 2.d4 Nf6 3.c4 e6 4.Nc3 c6 5.Bg5 h6 6.Bh4 (Anti-Moscow)',
    weight: 0.6,
    moves: '1. Nf3 d5 2. d4 Nf6 3. c4 e6 4. Nc3 c6 5. Bg5 h6 6. Bh4 dxc4 7. e4 g5 8. Bg3 b5 9. Be2 Bb7 10. O-O Nbd7 11. Ne5 Bg7 12. Nxd7 Nxd7',
  },
  {
    name: 'Réti Opening: 1...d5 2.d4 Nf6 3.c4 e6 4.Nc3 c6 5.Bg5 dxc4 (Botvinnik)',
    weight: 0.3,
    moves: '1. Nf3 d5 2. d4 Nf6 3. c4 e6 4. Nc3 c6 5. Bg5 dxc4 6. e4 b5 7. e5 h6 8. Bh4 g5 9. Nxg5 hxg5 10. Bxg5 Nbd7 11. exf6 Bb7 12. g3 c5',
  },
  {
    name: 'Réti Opening: 1...d5 2.d4 Nf6 3.c4 e6 4.Nc3 c6 5.Bg5 h6 6.Bxf6 Qxf6 7.Qb3',
    weight: 0.6,
    moves: '1. Nf3 d5 2. d4 Nf6 3. c4 e6 4. Nc3 c6 5. Bg5 h6 6. Bxf6 Qxf6 7. Qb3 Nd7 8. e4 dxe4 9. Nxe4 Qf4 10. Bd3 Be7 11. O-O O-O 12. Rfe1 e5',
  },
  {
    name: 'Réti Opening: 1...d5 2.d4 Nf6 3.c4 e6 4.Nc3 c6 5.Bg5 h6 6.Bxf6 Qxf6 7.e3 Nd7 8.Be2',
    weight: 0.6,
    moves: '1. Nf3 d5 2. d4 Nf6 3. c4 e6 4. Nc3 c6 5. Bg5 h6 6. Bxf6 Qxf6 7. e3 Nd7 8. Be2 g6 9. O-O Bg7 10. Rc1 O-O 11. c5 e5 12. b4 e4',
  },
  {
    name: 'Réti Opening: 1...d5 2.d4 Nf6 3.c4 e6 4.Nc3 c6 5.Bg5 h6 6.Bxf6 Qxf6 7.e3 Nd7 8.Qc2',
    weight: 0.6,
    moves: '1. Nf3 d5 2. d4 Nf6 3. c4 e6 4. Nc3 c6 5. Bg5 h6 6. Bxf6 Qxf6 7. e3 Nd7 8. Qc2 g6 9. Bd3 Bg7 10. O-O O-O 11. e4 dxc4 12. Bxc4 e5',
  },
  {
    name: 'Réti Opening: 1...d5 2.d4 Nf6 3.c4 e6 4.Nc3 c6 5.Bg5 h6 6.Bxf6 Qxf6 7.e3 Nd7 8.Rc1',
    weight: 0.6,
    moves: '1. Nf3 d5 2. d4 Nf6 3. c4 e6 4. Nc3 c6 5. Bg5 h6 6. Bxf6 Qxf6 7. e3 Nd7 8. Rc1 g6 9. Bd3 Bg7 10. O-O O-O 11. e4 dxc4 12. Bxc4 e5',
  },
  {
    name: 'Réti Opening: 1...d5 2.d4 Nf6 3.c4 e6 4.Nc3 c6 5.Bg5 h6 6.Bxf6 Qxf6 7.e3 Nd7 8.a3',
    weight: 0.6,
    moves: '1. Nf3 d5 2. d4 Nf6 3. c4 e6 4. Nc3 c6 5. Bg5 h6 6. Bxf6 Qxf6 7. e3 Nd7 8. a3 g6 9. Bd3 Bg7 10. O-O O-O 11. e4 dxc4 12. Bxc4 e5',
  },
  {
    name: 'Réti Opening: 1...d5 2.d4 Nf6 3.c4 e6 4.Nc3 c6 5.Bg5 h6 6.Bxf6 Qxf6 7.e3 Nd7 8.cxd5',
    weight: 0.6,
    moves: '1. Nf3 d5 2. d4 Nf6 3. c4 e6 4. Nc3 c6 5. Bg5 h6 6. Bxf6 Qxf6 7. e3 Nd7 8. cxd5 exd5 9. Bd3 Bd6 10. O-O O-O 11. e4 dxe4 12. Nxe4 Qe7',
  },
  {
    name: "Bird's Opening (1.f4)",
    moves: '1. f4 d5 2. Nf3 Nf6 3. e3 g6 4. b3 Bg7 5. Bb2 O-O 6. Be2 c5 7. O-O Nc6 8. Ne5 Qc7 9. Nxc6 Qxc6 10. d3 b6 11. Nd2 Bb7',
  },
  {
    name: "Bird's Opening, 2.Nf3 Nf6 3.e3 c5",
    weight: 0.6,
    moves: '1. f4 d5 2. Nf3 Nf6 3. e3 c5 4. b3 Nc6 5. Bb2 e6 6. Bb5 Bd6 7. O-O O-O 8. Bxc6 bxc6 9. d3 Qe7 10. Nbd2 Ba6 11. Qe1 Rab8',
  },
  {
    name: "Bird's Opening, 2.b3",
    moves: '1. f4 d5 2. b3 Nf6 3. Bb2 g6 4. Nf3 Bg7 5. e3 O-O 6. Be2 c5 7. O-O Nc6 8. Ne5 Qc7 9. Nxc6 Qxc6 10. d3 b6 11. Nd2 Bb7',
  },
  {
    name: "Bird's Opening, 2.Nf3 Nf6 3.g3 (Leningrad reversed)",
    moves: '1. f4 d5 2. Nf3 Nf6 3. g3 g6 4. Bg2 Bg7 5. O-O O-O 6. d3 c5 7. Qe1 Nc6 8. e4 dxe4 9. dxe4 e5 10. f5 gxf5 11. exf5 Nd4',
  },
  {
    name: "Bird's Opening, From Gambit declined (1...d5 2.e4?!)",
    weight: 0.6,
    moves: '1. f4 d5 2. e4 dxe4 3. Nc3 Nf6 4. g4 h6 5. g5 hxg5 6. fxg5 Nd5 7. Nxe4 e5 8. d3 Nc6 9. Nf3 Bg4 10. Bg2 Qd7',
  },
  {
    name: 'Nimzo-Larsen Attack (1.b3)',
    moves: '1. b3 d5 2. Bb2 Nf6 3. e3 e6 4. Nf3 Be7 5. c4 O-O 6. Be2 c5 7. O-O Nc6 8. cxd5 exd5 9. d4 b6 10. Nc3 Bb7 11. Rc1 Rc8',
  },
  {
    name: 'Nimzo-Larsen Attack, 2.Bb2 Nf6 3.Nf3',
    moves: '1. b3 d5 2. Bb2 Nf6 3. Nf3 Bg4 4. e3 e6 5. Be2 Nbd7 6. O-O Bd6 7. d3 O-O 8. Nbd2 c6 9. c4 Qe7 10. Qc2 Rfd8 11. Rfe1 e5',
  },
  {
    name: 'Nimzo-Larsen Attack, 2.Bb2 Bg4',
    weight: 0.6,
    moves: '1. b3 d5 2. Bb2 Bg4 3. e3 Nf6 4. Nf3 e6 5. Be2 Nbd7 6. O-O Bd6 7. d3 O-O 8. Nbd2 c6 9. c4 Qe7 10. Qc2 Rfd8 11. Rfe1 e5',
  },
  {
    name: 'Nimzo-Larsen Attack, 2.Bb2 Nf6 3.e3 Bf5',
    weight: 0.6,
    moves: '1. b3 d5 2. Bb2 Nf6 3. e3 Bf5 4. Nf3 e6 5. Be2 Nbd7 6. O-O Bd6 7. d3 O-O 8. Nbd2 c6 9. c4 Qe7 10. Qc2 Rfd8 11. Rfe1 e5',
  },
  {
    name: 'Nimzo-Larsen Attack, 2.Bb2 Nf6 3.e3 c5',
    weight: 0.6,
    moves: '1. b3 d5 2. Bb2 Nf6 3. e3 c5 4. Nf3 Nc6 5. Bb5 Bd7 6. O-O e6 7. d3 Be7 8. Nbd2 O-O 9. Bxc6 Bxc6 10. Ne5 Qc7 11. f4 Rfd8',
  },
  {
    name: 'Nimzo-Larsen Attack, 2.Bb2 Nf6 3.e3 e6 4.f4?!',
    weight: 0.6,
    moves: '1. b3 d5 2. Bb2 Nf6 3. e3 e6 4. f4 Be7 5. Nf3 O-O 6. Be2 c5 7. O-O Nc6 8. Ne5 Qc7 9. Nxc6 Qxc6 10. d3 b6 11. Nd2 Bb7',
  },
  {
    name: 'Nimzo-Larsen Attack, 2.Bb2 Nf6 3.e3 e6 4.Nf3 Be7 5.d4',
    weight: 0.6,
    moves: '1. b3 d5 2. Bb2 Nf6 3. e3 e6 4. Nf3 Be7 5. d4 O-O 6. Bd3 c5 7. O-O Nc6 8. Nbd2 b6 9. Ne5 Bb7 10. f4 Ne4 11. Nxe4 dxe4',
  },
  {
    name: 'Nimzo-Larsen Attack, 2.Bb2 Nf6 3.e3 e6 4.Nf3 Be7 5.c4 O-O 6.Nc3',
    weight: 0.6,
    moves: '1. b3 d5 2. Bb2 Nf6 3. e3 e6 4. Nf3 Be7 5. c4 O-O 6. Nc3 c5 7. cxd5 exd5 8. Be2 Nc6 9. O-O d4 10. exd4 cxd4 11. Nb5 Bg4',
  },
  {
    name: 'Nimzo-Larsen Attack, 2.Bb2 Nf6 3.e3 e6 4.Nf3 Be7 5.c4 O-O 6.Be2 c5 7.O-O Nc6 8.d4',
    weight: 0.6,
    moves: '1. b3 d5 2. Bb2 Nf6 3. e3 e6 4. Nf3 Be7 5. c4 O-O 6. Be2 c5 7. O-O Nc6 8. d4 b6 9. Nc3 Bb7 10. cxd5 exd5 11. Rc1 Rc8',
  },
  {
    name: 'Nimzo-Larsen Attack, 2.Bb2 Nf6 3.e3 e6 4.Nf3 Be7 5.c4 O-O 6.Be2 c5 7.O-O Nc6 8.cxd5 Nxd5?!',
    weight: 0.6,
    moves: '1. b3 d5 2. Bb2 Nf6 3. e3 e6 4. Nf3 Be7 5. c4 O-O 6. Be2 c5 7. O-O Nc6 8. cxd5 exd5 9. d4 b6 10. Nc3 Bb7 11. Rc1 Rc8',
  },
  {
    name: 'King\'s Fianchetto (1.g3)',
    moves: '1. g3 d5 2. Bg2 Nf6 3. Nf3 c6 4. O-O Bg4 5. d3 e6 6. Nbd2 Nbd7 7. e4 Bd6 8. Qe1 O-O 9. h3 Bh5 10. Nh4 dxe4 11. dxe4 e5',
  },
  {
    name: 'King\'s Fianchetto, 2.Bg2 Nf6 3.c4',
    moves: '1. g3 d5 2. Bg2 Nf6 3. c4 c6 4. Nf3 e6 5. O-O Nbd7 6. b3 Bd6 7. Bb2 O-O 8. d3 Re8 9. Nbd2 e5 10. cxd5 cxd5 11. e4 d4',
  },
  {
    name: 'King\'s Fianchetto, 2.Bg2 Nf6 3.d4',
    moves: '1. g3 d5 2. Bg2 Nf6 3. d4 c6 4. Nf3 Bg4 5. O-O e6 6. c4 Nbd7 7. Nc3 Bd6 8. Qb3 Qb6 9. c5 Bxc5 10. dxc5 Qxc5 11. Be3 Qa5',
  },
  {
    name: 'King\'s Fianchetto, 2.Bg2 Nf6 3.d3',
    weight: 0.6,
    moves: '1. g3 d5 2. Bg2 Nf6 3. d3 c6 4. Nf3 Bg4 5. O-O e6 6. Nbd2 Nbd7 7. e4 Bd6 8. Qe1 O-O 9. h3 Bh5 10. Nh4 dxe4 11. dxe4 e5',
  },
  {
    name: 'King\'s Fianchetto, 2.Bg2 c6?!',
    weight: 0.6,
    moves: '1. g3 d5 2. Bg2 c6 3. Nf3 Nf6 4. O-O Bg4 5. d3 e6 6. Nbd2 Nbd7 7. e4 Bd6 8. Qe1 O-O 9. h3 Bh5 10. Nh4 dxe4 11. dxe4 e5',
  },
  {
    name: 'Polish Opening (1.b4)',
    moves: '1. b4 d5 2. Bb2 Nf6 3. e3 e6 4. Nf3 Bd6 5. c4 O-O 6. c5 Be7 7. Be2 b6 8. cxb6 axb6 9. O-O c5 10. bxc5 bxc5 11. d4 Nc6',
  },
  {
    name: 'Polish Opening, 2.Bb2 Nf6 3.e3 Bf5',
    weight: 0.6,
    moves: '1. b4 d5 2. Bb2 Nf6 3. e3 Bf5 4. Nf3 e6 5. c4 c6 6. Nc3 Nbd7 7. Be2 Bd6 8. O-O O-O 9. b5 c5 10. cxd5 exd5 11. d4 c4',
  },
  {
    name: 'Polish Opening, 2.Bb2 Nf6 3.e3 Bg4',
    weight: 0.6,
    moves: '1. b4 d5 2. Bb2 Nf6 3. e3 Bg4 4. Nf3 e6 5. c4 c6 6. Nc3 Nbd7 7. Be2 Bd6 8. O-O O-O 9. b5 c5 10. cxd5 exd5 11. d4 c4',
  },
  {
    name: 'Polish Opening, 1...e5?!',
    weight: 0.3,
    moves: '1. b4 e5 2. Bb2 Bxb4 3. Bxe5 Nf6 4. c3 Be7 5. e3 O-O 6. Nf3 d5 7. Be2 c5 8. O-O Nc6 9. Bg3 b6 10. d4 Bb7 11. Nbd2 Qc7',
  },
  {
    name: 'Van Geet (1.Nc3)',
    moves: '1. Nc3 d5 2. e4 d4 3. Nce2 e5 4. Ng3 Nf6 5. Bc4 Nc6 6. d3 Bd6 7. Nf3 h6 8. O-O O-O 9. c3 dxc3 10. bxc3 Be6 11. Bxe6 fxe6',
  },
  {
    name: 'Van Geet, 2.d4 Nf6 3.Bg5 (Veresov)',
    moves: '1. Nc3 d5 2. d4 Nf6 3. Bg5 Nbd7 4. Nf3 g6 5. e3 Bg7 6. Bd3 O-O 7. O-O c6 8. Qe2 Re8 9. e4 dxe4 10. Nxe4 Nxe4 11. Bxe4 Nf6',
  },
  {
    name: 'Van Geet, 2.d4 Nf6 3.Bf4 (Jobava)',
    moves: '1. Nc3 d5 2. d4 Nf6 3. Bf4 a6 4. e3 e6 5. Nf3 c5 6. Bd3 Nc6 7. O-O Be7 8. Ne5 Qb6 9. Rb1 Nxe5 10. Bxe5 Nd7 11. Bg3 O-O',
  },
  {
    name: 'Van Geet, 2.e4 dxe4?!',
    weight: 0.6,
    moves: '1. Nc3 d5 2. e4 dxe4 3. Nxe4 Nd7 4. d4 Ngf6 5. Nxf6+ Nxf6 6. Nf3 c6 7. Bd3 Bg4 8. O-O e6 9. Be3 Be7 10. c4 O-O 11. Qb3 Qc7',
  },
  {
    name: 'Van Geet, 2.Nf3',
    moves: '1. Nc3 d5 2. Nf3 Nf6 3. d4 c6 4. Bg5 Nbd7 5. e3 g6 6. Bd3 Bg7 7. O-O O-O 8. Qe2 Re8 9. e4 dxe4 10. Nxe4 Nxe4 11. Bxe4 Nf6',
  },
  {
    name: "Van't Kruijs (1.e3)",
    moves: '1. e3 d5 2. d4 Nf6 3. Nf3 e6 4. Bd3 c5 5. b3 Nc6 6. O-O Bd6 7. Bb2 O-O 8. Nbd2 Qe7 9. Ne5 Bxe5 10. dxe5 Nd7 11. f4 f6',
  },
  {
    name: "Van't Kruijs, 2.Nf3",
    moves: '1. e3 d5 2. Nf3 Nf6 3. d4 e6 4. Bd3 c5 5. b3 Nc6 6. O-O Bd6 7. Bb2 O-O 8. Nbd2 Qe7 9. Ne5 Bxe5 10. dxe5 Nd7 11. f4 f6',
  },
  {
    name: "Van't Kruijs, 2.c4",
    moves: '1. e3 d5 2. c4 c6 3. Nc3 Nf6 4. d4 e6 5. Nf3 Nbd7 6. Bd3 dxc4 7. Bxc4 b5 8. Bd3 Bb7 9. O-O a6 10. e4 c5 11. d5 Qc7 12. dxe6 fxe6',
  },
  {
    name: "Van't Kruijs, 2.b3",
    moves: '1. e3 d5 2. b3 Nf6 3. Bb2 Bg4 4. Nf3 e6 5. Be2 Nbd7 6. O-O Bd6 7. d3 O-O 8. Nbd2 c6 9. c4 Qe7 10. Qc2 Rfd8 11. Rfe1 e5',
  },
  {
    name: 'Mieses Opening (1.d3)',
    moves: '1. d3 d5 2. Nf3 Nf6 3. g3 c6 4. Bg2 Bg4 5. O-O e6 6. Nbd2 Nbd7 7. e4 Bd6 8. Qe1 O-O 9. h3 Bh5 10. Nh4 dxe4 11. dxe4 e5',
  },
  {
    name: 'Mieses Opening, 2.e4 (reversed Philidor-ish)',
    moves: '1. d3 d5 2. e4 dxe4 3. dxe4 Qxd1+ 4. Kxd1 Nf6 5. f3 e5 6. Nc3 Bc5 7. Bc4 Nc6 8. Nge2 Be6 9. Bxe6 fxe6 10. Be3 Bxe3',
  },
  {
    name: 'Mieses Opening, 2.Nd2?!',
    weight: 0.6,
    moves: '1. d3 d5 2. Nd2 Nf6 3. g3 c6 4. Bg2 Bg4 5. Ngf3 e6 6. O-O Nbd7 7. e4 Bd6 8. Qe1 O-O 9. h3 Bh5 10. Nh4 dxe4 11. dxe4 e5',
  },
  {
    name: 'Saragossa (1.c3)',
    moves: '1. c3 d5 2. d4 Nf6 3. Bf4 c5 4. e3 Nc6 5. Nd2 e6 6. Ngf3 Bd6 7. Bg3 O-O 8. Bd3 b6 9. Ne5 Bb7 10. f4 Ne7 11. O-O Nf5',
  },
  {
    name: 'Saragossa, 2.d4 Nf6 3.Nf3',
    moves: '1. c3 d5 2. d4 Nf6 3. Nf3 e6 4. Bf4 c5 5. e3 Nc6 6. Nbd2 Bd6 7. Bg3 O-O 8. Bd3 b6 9. Ne5 Bb7 10. f4 Ne7 11. O-O Nf5',
  },
  {
    name: 'Sokolsky-ish (1.a3)',
    moves: '1. a3 d5 2. d4 Nf6 3. Nf3 e6 4. Bf4 c5 5. e3 Nc6 6. c3 Bd6 7. Bg3 O-O 8. Nbd2 b6 9. Bd3 Bb7 10. Ne5 Ne7 11. f4 Nf5',
  },
  {
    name: 'Grob (1.g4?!)',
    moves: '1. g4 d5 2. Bg2 Bxg4 3. c4 c6 4. cxd5 cxd5 5. Qb3 Nf6 6. Qxb7 Nbd7 7. Nc3 e6 8. Nxd5 Nxd5 9. Bxd5 Rb8 10. Qxa7 Rxb2',
  },
  {
    name: 'Grob, 2.h3?!',
    weight: 0.6,
    moves: '1. g4 d5 2. h3 e5 3. Bg2 c6 4. d4 e4 5. c4 Bd6 6. Nc3 Ne7 7. Bg5 f6 8. Bf4 Bxf4 9. e3 Bd6 10. cxd5 cxd5 11. Qb3 O-O',
  },
  {
    name: 'Grob, 2.e4?!',
    weight: 0.6,
    moves: '1. g4 d5 2. e4 dxe4 3. Nc3 Nf6 4. g5 Nd5 5. Nxe4 e5 6. Bg2 Nc6 7. d3 Be7 8. h4 h6 9. gxh6 Rxh6 10. Nf3 Bg4',
  },
  {
    name: 'Kadas / Clemenz (1.h4 / 1.h3)',
    weight: 0.6,
    moves: '1. h4 d5 2. d4 Nf6 3. Nf3 e6 4. Bf4 c5 5. e3 Nc6 6. c3 Bd6 7. Bg3 O-O 8. Nbd2 b6 9. Bd3 Bb7 10. Ne5 Ne7 11. f4 Nf5',
  },
  {
    name: 'Clemenz (1.h3)',
    weight: 0.6,
    moves: '1. h3 d5 2. d4 Nf6 3. Nf3 e6 4. Bf4 c5 5. e3 Nc6 6. c3 Bd6 7. Bg3 O-O 8. Nbd2 b6 9. Bd3 Bb7 10. Ne5 Ne7 11. f4 Nf5',
  },
  {
    name: 'Ware (1.a4)',
    weight: 0.6,
    moves: '1. a4 d5 2. d4 Nf6 3. Nf3 e6 4. Bf4 c5 5. e3 Nc6 6. c3 Bd6 7. Bg3 O-O 8. Nbd2 b6 9. Bd3 Bb7 10. Ne5 Ne7 11. f4 Nf5',
  },
  {
    name: 'Barnes (1.f3?!)',
    weight: 0.6,
    moves: '1. f3 d5 2. e4 dxe4 3. Nc3 Nf6 4. fxe4 Nxe4 5. Nxe4 e5 6. Nf3 Nc6 7. Bb5 Bd6 8. O-O O-O 9. d3 Bg4 10. Bxc6 bxc6',
  },
  {
    name: 'Amar (1.Nh3?!)',
    weight: 0.6,
    moves: '1. Nh3 d5 2. g3 e5 3. f4 Bxh3 4. Bxh3 exf4 5. O-O fxg3 6. hxg3 Nf6 7. d3 Nc6 8. Nc3 Bd6 9. Bg5 h6 10. Bxf6 Qxf6',
  },
  {
    name: 'Durkin (1.Na3?!)',
    weight: 0.6,
    moves: '1. Na3 d5 2. d4 Nf6 3. Nf3 e6 4. Bf4 c5 5. e3 Nc6 6. c3 Bd6 7. Bg3 O-O 8. Bd3 b6 9. Ne5 Bb7 10. f4 Ne7 11. O-O Nf5',
  },
];
