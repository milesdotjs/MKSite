/**
 * Life Points for chess.
 *
 * The duel HUD carries over from blackjack: every capture bleeds the piece's
 * owner. Checkmate still decides the game — this is a second, faster pressure
 * that gives every exchange a visible cost and lets a bot resign when the
 * position is hopeless instead of playing on to bare kings.
 *
 * Values are the familiar 1/3/3/5/9 scale stretched over the 4000 LP pool.
 * A full army is 5675, so a player has to shed roughly two thirds of their
 * material before LP alone finishes them — by which point the game is lost on
 * the board anyway. The bar reads as drama, not as a second win condition
 * firing at odd moments.
 */
import type { PieceSymbol } from 'chess.js';

export const STARTING_LP = 4000;

export const PIECE_DAMAGE: Record<PieceSymbol, number> = {
  p: 150,
  n: 450,
  b: 475,
  r: 700,
  q: 1350,
  k: 0, // never actually captured
};

/** A capture worth a reaction shot rather than a shrug. */
export function isHeavyLoss(piece: PieceSymbol): boolean {
  return piece === 'q' || piece === 'r';
}

export const PIECE_NAMES: Record<PieceSymbol, string> = {
  p: 'pawn',
  n: 'knight',
  b: 'bishop',
  r: 'rook',
  q: 'queen',
  k: 'king',
};
