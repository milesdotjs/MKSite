export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank =
  | 'A' | '2' | '3' | '4' | '5' | '6' | '7'
  | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export type Card = {
  id: string;
  rank: Rank;
  suit: Suit;
  faceDown: boolean;
};

export type Hand = Card[];

export type GamePhase =
  | 'idle'
  | 'shuffling'
  | 'dealing'
  | 'playerTurn'
  | 'dealerTurn'
  | 'roundOver'
  | 'gameOver'
  | 'exodia';

export type RoundOutcome =
  | 'playerWin'
  | 'dealerWin'
  | 'push'
  | 'playerBlackjack'
  | 'playerBust'
  | 'dealerBust'
  | 'exodia';

export type GameState = {
  deck: Card[];
  playerHand: Hand;
  dealerHand: Hand;
  phase: GamePhase;
  playerLP: number;
  dealerLP: number;
  outcome: RoundOutcome | null;
  message: string;
  roundNumber: number;
  /** Player doubled down this round — one card only, damage doubled. */
  doubled: boolean;
};
