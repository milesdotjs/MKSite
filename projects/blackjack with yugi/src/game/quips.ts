/**
 * Atem's quips, channeling the 4Kids dub voice. Each phase has a pool of lines;
 * we pick at random when the phase changes. Match the tone — confident,
 * slightly theatrical, occasional "Pharaoh" gravitas.
 */

export type QuipKey =
  | 'gameStart'
  | 'shuffle'
  | 'doubleDown'
  | 'roundStart'
  | 'playerHit'
  | 'playerStand'
  | 'dealerThinking'
  | 'dealerHit'
  | 'dealerStand'
  | 'playerWin'
  | 'dealerWin'
  | 'playerBust'
  | 'dealerBust'
  | 'playerBlackjack'
  | 'push'
  | 'playerCritical'
  | 'dealerCritical'
  | 'playerDefeat'
  | 'dealerDefeat'
  | 'exodia';

const POOLS: Record<QuipKey, string[]> = {
  gameStart: [
    "It's time to duel!",
    "The heart of the cards will guide me.",
    "I accept your challenge.",
    "Prepare yourself. This duel will test your soul.",
  ],
  shuffle: [
    "The shadows shuffle the deck tonight...",
    "Fate rearranges itself. Watch closely.",
    "Every card finds its destined place.",
    "The heart of the cards stirs...",
  ],
  doubleDown: [
    "Doubling down?! You gamble with your very soul.",
    "Such reckless courage. I almost admire it.",
    "All or nothing — the mark of a true duelist. Or a fool.",
  ],
  roundStart: [
    "My move.",
    "Here we go again.",
    "The next hand begins.",
    "Don't lose focus.",
    "Show me your resolve.",
  ],
  playerHit: [
    "A bold move.",
    "Are you sure about that?",
    "You play with fire.",
    "Tempting fate, are you?",
    "Interesting choice.",
  ],
  playerStand: [
    "Holding your ground? Very well.",
    "You believe in your hand. We'll see.",
    "Then it's my turn.",
    "A wise decision... perhaps.",
  ],
  dealerThinking: [
    "Let me consult the cards...",
    "The heart of the cards never fails me.",
    "I trust in my deck.",
  ],
  dealerHit: [
    "I draw!",
    "One more card.",
    "The cards are with me.",
  ],
  dealerStand: [
    "I stand firm.",
    "My hand is sufficient.",
    "Now we settle this.",
  ],
  playerWin: [
    "Impressive... this round goes to you.",
    "You've earned this victory. But the duel is far from over.",
    "A worthy strike. I won't underestimate you again.",
    "Don't get cocky. I'm just getting started.",
  ],
  dealerWin: [
    "The heart of the cards prevails!",
    "You fought well, but this hand is mine.",
    "Did you really think you could best the Pharaoh?",
    "My faith in my deck rewards me.",
  ],
  playerBust: [
    "You pushed too far. A duelist must know their limit.",
    "Greed is the enemy of strategy.",
    "Such a pity. You sealed your own fate.",
    "Overconfidence is a fragile thing.",
  ],
  dealerBust: [
    "Impossible! The cards have... abandoned me?",
    "Even the Pharaoh can fall. Well played.",
    "An unexpected turn. You've earned my respect.",
  ],
  playerBlackjack: [
    "A perfect hand?! ...You're more dangerous than I thought.",
    "Twenty-one. The heart of the cards favors you this time.",
    "Blackjack! I won't let that happen again.",
  ],
  push: [
    "A draw. Neither of us yields.",
    "Our wills are evenly matched.",
    "Hmph. We're more alike than you know.",
  ],
  playerCritical: [
    "Your life points are dwindling. Surrender while you still can.",
    "One more strike and you're finished.",
    "You're on the edge of defeat. I can see it in your eyes.",
  ],
  dealerCritical: [
    "You've pushed me to the brink. But I have not yet begun to duel.",
    "My life points may be low, but my faith is strong.",
    "Don't celebrate yet. The Pharaoh is at his strongest when cornered.",
  ],
  playerDefeat: [
    "The duel is over. You fought with honor.",
    "A noble effort. But the heart of the cards was with me tonight.",
    "Mind Crush!",
  ],
  dealerDefeat: [
    "Incredible... you've defeated me. I was wrong to doubt you.",
    "You are a true duelist. The Pharaoh acknowledges your strength.",
    "Well fought. Your soul shines brightly.",
  ],
  exodia: [
    "EXODIA! OBLITERATE!",
  ],
};

export function pickQuip(key: QuipKey, seed?: number): string {
  const pool = POOLS[key];
  if (!pool || pool.length === 0) return '';
  const idx = seed === undefined
    ? Math.floor(Math.random() * pool.length)
    : seed % pool.length;
  return pool[idx];
}
