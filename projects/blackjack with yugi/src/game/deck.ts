import type { Card, Rank, Suit } from './types';

const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export function buildDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ id: `${rank}-${suit}`, rank, suit, faceDown: false });
    }
  }
  return deck;
}

export function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function drawCard(deck: Card[], faceDown = false): { card: Card; deck: Card[] } {
  if (deck.length === 0) {
    throw new Error('Deck is empty');
  }
  const [card, ...rest] = deck;
  return { card: { ...card, faceDown }, deck: rest };
}
