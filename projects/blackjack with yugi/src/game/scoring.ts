import type { Card, Hand } from './types';

const FACE_VALUES: Record<string, number> = {
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
  J: 10, Q: 10, K: 10,
};

export function cardValue(card: Card): number {
  if (card.rank === 'A') return 11;
  return FACE_VALUES[card.rank];
}

export function handTotal(hand: Hand, includeFaceDown = true): number {
  const visible = includeFaceDown ? hand : hand.filter((c) => !c.faceDown);
  let total = visible.reduce((sum, c) => sum + cardValue(c), 0);
  let aces = visible.filter((c) => c.rank === 'A').length;
  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }
  return total;
}

export function isBlackjack(hand: Hand): boolean {
  return hand.length === 2 && handTotal(hand) === 21;
}

export function isBust(hand: Hand): boolean {
  return handTotal(hand) > 21;
}
