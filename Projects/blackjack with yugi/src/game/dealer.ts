import type { Hand } from './types';
import { handTotal } from './scoring';

export function dealerShouldHit(dealerHand: Hand): boolean {
  return handTotal(dealerHand) < 17;
}
