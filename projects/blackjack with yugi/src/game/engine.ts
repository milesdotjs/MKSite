import { buildDeck, drawCard, shuffle } from './deck';
import { pickQuip } from './quips';
import { handTotal, isBlackjack, isBust } from './scoring';
import type { Card, GameState, RoundOutcome } from './types';

export const STARTING_LP = 4000;
export const HAND_DAMAGE = 1000;
export const BLACKJACK_DAMAGE = 2000;
/** Reshuffle the shoe between rounds once it runs this low. */
export const SHUFFLE_THRESHOLD = 15;
const EXODIA_CHANCE = 0.3;

export function initialState(): GameState {
  return {
    deck: shuffle(buildDeck()),
    playerHand: [],
    dealerHand: [],
    phase: 'idle',
    playerLP: STARTING_LP,
    dealerLP: STARTING_LP,
    outcome: null,
    message: pickQuip('gameStart'),
    roundNumber: 0,
    doubled: false,
  };
}

export function dealOpening(state: GameState): GameState {
  // Safety net — the shuffling phase should normally have refreshed the shoe.
  let deck = state.deck.length < SHUFFLE_THRESHOLD ? shuffle(buildDeck()) : state.deck;

  const playerHand: Card[] = [];
  const dealerHand: Card[] = [];

  // Standard blackjack opening: P, D, P, D (dealer's second card face-down)
  ({ card: playerHand[0], deck } = drawCard(deck));
  ({ card: dealerHand[0], deck } = drawCard(deck));
  ({ card: playerHand[1], deck } = drawCard(deck));
  ({ card: dealerHand[1], deck } = drawCard(deck, true));

  const playerHasBJ = isBlackjack(playerHand);

  return {
    ...state,
    deck,
    playerHand,
    dealerHand,
    phase: playerHasBJ ? 'dealerTurn' : 'playerTurn',
    outcome: null,
    doubled: false,
    message: playerHasBJ ? pickQuip('playerBlackjack') : pickQuip('roundStart'),
    roundNumber: state.roundNumber + 1,
  };
}

/** The shuffle animation has finished — actually deal the opening hands. */
export function finishShuffle(state: GameState): GameState {
  if (state.phase !== 'shuffling') return state;
  return dealOpening({ ...state, phase: 'dealing' });
}

export function playerHit(state: GameState): GameState {
  if (state.phase !== 'playerTurn') return state;
  const { card, deck } = drawCard(state.deck);
  const playerHand = [...state.playerHand, card];

  if (isBust(playerHand)) {
    // A bust is fully self-resolving — no dealer turn needed. Run resolveRound
    // so damage, critical-LP transitions, game-over checks, and the Exodia
    // easter egg all share one code path.
    return resolveRound({ ...state, deck, playerHand });
  }

  return { ...state, deck, playerHand, message: pickQuip('playerHit') };
}

export function playerStand(state: GameState): GameState {
  if (state.phase !== 'playerTurn') return state;
  // Reveal the dealer's hole card
  const dealerHand = state.dealerHand.map((c) => ({ ...c, faceDown: false }));
  return { ...state, dealerHand, phase: 'dealerTurn', message: pickQuip('playerStand') };
}

/** Double down: exactly one more card, then stand — the round's damage doubles. */
export function playerDouble(state: GameState): GameState {
  if (state.phase !== 'playerTurn' || state.playerHand.length !== 2 || state.doubled) {
    return state;
  }
  const { card, deck } = drawCard(state.deck);
  const playerHand = [...state.playerHand, card];
  const doubled = { ...state, deck, playerHand, doubled: true };

  if (isBust(playerHand)) {
    return resolveRound(doubled);
  }

  const dealerHand = state.dealerHand.map((c) => ({ ...c, faceDown: false }));
  return {
    ...doubled,
    dealerHand,
    phase: 'dealerTurn',
    message: pickQuip('doubleDown'),
  };
}

export function dealerHit(state: GameState): GameState {
  const { card, deck } = drawCard(state.deck);
  const dealerHand = [...state.dealerHand, card];
  return { ...state, deck, dealerHand, message: pickQuip('dealerHit') };
}

export function resolveRound(state: GameState): GameState {
  // Reveal hole card if still hidden
  const dealerHand = state.dealerHand.map((c) => ({ ...c, faceDown: false }));

  const playerScore = handTotal(state.playerHand);
  const dealerScore = handTotal(dealerHand);
  const playerBJ = isBlackjack(state.playerHand);
  const dealerBJ = isBlackjack(dealerHand);
  const playerBusted = isBust(state.playerHand);
  const dealerBusted = isBust(dealerHand);

  let outcome: RoundOutcome;
  let damage = state.doubled ? HAND_DAMAGE * 2 : HAND_DAMAGE;

  if (playerBusted) {
    outcome = 'playerBust';
  } else if (dealerBusted) {
    outcome = 'dealerBust';
  } else if (playerBJ && !dealerBJ) {
    outcome = 'playerBlackjack';
    damage = BLACKJACK_DAMAGE;
  } else if (playerScore > dealerScore) {
    outcome = 'playerWin';
  } else if (dealerScore > playerScore) {
    outcome = 'dealerWin';
  } else {
    outcome = 'push';
  }

  // Apply damage
  let { playerLP, dealerLP } = state;
  let message = '';

  switch (outcome) {
    case 'playerBust':
      playerLP = Math.max(0, playerLP - damage);
      message = pickQuip('playerBust');
      break;
    case 'dealerBust':
      dealerLP = Math.max(0, dealerLP - damage);
      message = pickQuip('dealerBust');
      break;
    case 'playerBlackjack':
      dealerLP = Math.max(0, dealerLP - damage);
      message = pickQuip('playerBlackjack');
      break;
    case 'playerWin':
      dealerLP = Math.max(0, dealerLP - damage);
      message = pickQuip('playerWin');
      break;
    case 'dealerWin':
      playerLP = Math.max(0, playerLP - damage);
      message = pickQuip('dealerWin');
      break;
    case 'push':
      message = pickQuip('push');
      break;
    default:
      message = '';
  }

  // Did this finish the duel?
  let phase: GameState['phase'] = 'roundOver';
  if (playerLP <= 0 || dealerLP <= 0) {
    phase = 'gameOver';
    message = playerLP <= 0 ? pickQuip('playerDefeat') : pickQuip('dealerDefeat');
  } else if (playerLP <= 1000 && state.playerLP > 1000) {
    // Just dropped into critical territory — taunt instead of stock outcome quip
    message = pickQuip('playerCritical');
  } else if (dealerLP <= 1000 && state.dealerLP > 1000) {
    message = pickQuip('dealerCritical');
  }

  // Exodia easter egg: only when the player loses a round (not the whole match yet)
  const playerJustLostRound = outcome === 'playerBust' || outcome === 'dealerWin';
  if (playerJustLostRound && phase === 'roundOver' && Math.random() < EXODIA_CHANCE) {
    phase = 'exodia';
    playerLP = 0;
    message = pickQuip('exodia');
    outcome = 'exodia';
  }

  return {
    ...state,
    dealerHand,
    phase,
    playerLP,
    dealerLP,
    outcome,
    message,
  };
}

export function nextRound(state: GameState): GameState {
  if (state.phase !== 'roundOver') return state;

  const cleared = {
    ...state,
    playerHand: [],
    dealerHand: [],
    outcome: null,
  };

  if (state.deck.length < SHUFFLE_THRESHOLD) {
    return {
      ...cleared,
      deck: shuffle(buildDeck()),
      phase: 'shuffling' as const,
      message: pickQuip('shuffle'),
    };
  }
  return dealOpening({ ...cleared, phase: 'dealing' });
}

export function newGame(): GameState {
  // Every duel opens with a ceremonial shuffle of a fresh shoe.
  return {
    ...initialState(),
    phase: 'shuffling',
    message: pickQuip('shuffle'),
  };
}
