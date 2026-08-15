/**
 * Shared DOM anchors for cross-component animations. Components register
 * their elements on mount; animations (e.g. a card flying off the deck)
 * read positions from here at tween time.
 */
export const anchors: {
  deck: HTMLElement | null;
} = {
  deck: null,
};
