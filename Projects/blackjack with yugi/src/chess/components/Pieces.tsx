/**
 * The piece set, drawn here rather than pulled from a chess library.
 *
 * The usual web sets (Cburnett and friends) are copylefted and, more to the
 * point, they are drawn for a bright tournament board — dropped onto this
 * palette they read as clip art. These are built from the same silhouette
 * language as the rest of the game: heavy bases, hard shoulders, a single
 * rim light. One 45x45 viewBox each, filled by CSS so the same path serves
 * both colours.
 */
import type { PieceSymbol } from 'chess.js';

/** Shared plinth so every piece sits at the same height on the square. */
const BASE = 'M 9.5 40.5 h 26 v 3.5 h -26 z M 12 35.5 h 21 l 2.5 5 h -26 z';

const PATHS: Record<PieceSymbol, string> = {
  p:
    'M 22.5 8 a 5.4 5.4 0 1 1 -0.01 0 z ' +
    'M 17.6 18.4 q 4.9 2.6 9.8 0 l 2.2 12.4 q -7.1 2.6 -14.2 0 z ' +
    'M 13.8 30.4 h 17.4 l 1.4 5.1 h -20.2 z ' +
    BASE,
  r:
    'M 11 9 h 5.2 v 3.4 h 4.1 V 9 h 4.4 v 3.4 h 4.1 V 9 H 34 v 8.6 l -3.2 3 v 10 l 3.2 3 v 1.9 H 11 v -1.9 l 3.2 -3 v -10 l -3.2 -3 z ' +
    BASE,
  n:
    'M 14.4 34.5 q -1.2 -7.4 2.6 -12.6 q 2.2 -3 5.4 -4.6 l -1.6 -2.8 l 2.9 -1.1 l -0.6 -3.1 l 3.5 1.9 l 1.1 -2.2 l 1.9 2.9 ' +
    'q 4.6 2.4 5.6 8.2 q 0.9 5.2 0.2 13.4 z ' +
    'M 18.4 20.6 q -2.6 2.6 -4.9 3.1 q -1.8 0.4 -2.4 -1 q -0.6 -1.5 1.1 -2.9 q 2.4 -2 4.6 -4.6 z ' +
    'M 20.6 17.8 a 1.3 1.3 0 1 1 -0.01 0 z ' +
    BASE,
  b:
    'M 22.5 7.2 a 2.5 2.5 0 1 1 -0.01 0 z ' +
    'M 22.5 10.4 q 6.6 4.4 6.6 11.4 q 0 5.2 -6.6 9.4 q -6.6 -4.2 -6.6 -9.4 q 0 -7 6.6 -11.4 z ' +
    'M 21.3 16.8 h 2.4 v 3.4 h 3.4 v 2.4 h -3.4 v 3.4 h -2.4 v -3.4 h -3.4 v -2.4 h 3.4 z ' +
    'M 14.4 30.4 h 16.2 l 1.6 5.1 h -19.4 z ' +
    BASE,
  q:
    'M 8.6 13.4 a 2.4 2.4 0 1 1 -0.01 0 z M 16.1 10.4 a 2.4 2.4 0 1 1 -0.01 0 z ' +
    'M 22.5 9 a 2.6 2.6 0 1 1 -0.01 0 z M 28.9 10.4 a 2.4 2.4 0 1 1 -0.01 0 z ' +
    'M 36.4 13.4 a 2.4 2.4 0 1 1 -0.01 0 z ' +
    'M 9.6 16.6 l 3.6 12.2 h 18.6 l 3.6 -12.2 l -6.2 3.4 l -3.4 -8.2 l -3.3 8.2 l -3.4 -8.2 l -3.3 8.2 z ' +
    'M 13.2 28.8 h 18.6 v 2.6 h -18.6 z M 12.6 31.4 h 19.8 l 1.4 4.1 h -22.6 z ' +
    BASE,
  k:
    'M 21.2 5.6 h 2.6 v 3 h 3 v 2.6 h -3 v 3.4 h -2.6 v -3.4 h -3 V 8.6 h 3 z ' +
    'M 22.5 15.4 q 7.4 0 10.4 5.4 q 2.4 4.4 -1.4 9.6 h -18 q -3.8 -5.2 -1.4 -9.6 q 3 -5.4 10.4 -5.4 z ' +
    'M 12.6 30.4 h 19.8 l 1.4 5.1 h -22.6 z ' +
    BASE,
};

type Props = {
  piece: PieceSymbol;
  color: 'w' | 'b';
  className?: string;
};

export function ChessPiece({ piece, color, className = '' }: Props) {
  return (
    <svg
      viewBox="0 0 45 45"
      className={`piece piece-${color} ${className}`}
      aria-hidden
      focusable="false"
    >
      <path d={PATHS[piece]} fillRule="evenodd" />
    </svg>
  );
}

const NAMES: Record<PieceSymbol, string> = {
  p: 'Pawn',
  n: 'Knight',
  b: 'Bishop',
  r: 'Rook',
  q: 'Queen',
  k: 'King',
};

export function pieceLabel(piece: PieceSymbol, color: 'w' | 'b'): string {
  return `${color === 'w' ? 'White' : 'Black'} ${NAMES[piece]}`;
}
