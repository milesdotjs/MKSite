/**
 * The opponent roster.
 *
 * Character and difficulty are deliberately separate axes. Locking each bot to
 * one rating — the chess.com model — means a 900-rated player who likes Kaiba
 * simply never gets a game against him, and a strong player never hears
 * Weevil's lines at all. So every character spans the whole ladder, and their
 * canon strength is just the tier marked as their signature.
 *
 * What keeps them from being interchangeable is that the tiers are *named in
 * character* — Weevil climbs through insect metamorphosis, Kaiba stops holding
 * back — and that `temperament` skews how a character plays at any given
 * rating. Two bots at 1200 are the same strength but not the same opponent:
 * Weevil throws pieces away and recovers, Kaiba grinds cleanly.
 *
 * Portrait geometry (body size, eye/mouth slot rects) was measured off the
 * Nightmare Troubadour bustup sheets by template-matching each tile against
 * the body — the same layering AtemPortrait.tsx uses for blackjack. Slots are
 * pixel coords inside the body; the component converts them to percentages so
 * overlays track the face at any render size.
 */

export type PortraitSlot = { x: number; y: number; w: number; h: number };

export type Portrait = {
  /** Folder under public/sprites/chars/. */
  dir: string;
  body: { w: number; h: number };
  eyes: { slot: PortraitSlot; blink: boolean };
  mouth: { slot: PortraitSlot; frames: number };
  /** Alternate bustup poses, pose-1.png … pose-N.png. */
  poses: number;
};

/** One rung on a character's ladder. */
export type Tier = {
  /** In-character name for this strength. */
  label: string;
  /** Approximate Elo. Approximate by nature — engine handicaps are not exact. */
  rating: number;
};

/** Concrete engine settings for a rating. Produced by `strengthFor`. */
export type Strength = {
  rating: number;
  /** Stockfish's native limiter. Null below its 1320 floor. */
  uciElo: number | null;
  /** 0–20. Stockfish's own handicap knob; used when uciElo is null. */
  skill: number;
  depth: number;
  movetimeMs: number;
  /** Candidates to request. Must exceed 1 for slips to have anywhere to go. */
  multiPV: number;
  /** Probability of not playing the top line. */
  slipChance: number;
  /** How far down the ranked candidates a slip may reach. */
  slipDepth: number;
};

export type Character = {
  id: string;
  name: string;
  epithet: string;
  blurb: string;
  /** Drives the card border, glow and in-game aura. */
  accent: string;
  /**
   * How erratic this character is at a given rating. 1 is neutral; above 1
   * they blunder more and recover, below 1 they play cleanly. Scales the slip
   * chance only, so the tier's rating stays the headline strength.
   */
  temperament: number;
  tiers: Tier[];
  /** Index into `tiers` of this character's canon strength. */
  signature: number;
  portrait: Portrait;
};

/**
 * Below Stockfish's 1320 floor the engine has to be hobbled by hand: a low
 * Skill Level, a shallow search, and a real chance of passing over the best
 * move. Depth is what does the heavy lifting — a Skill 0 engine searching
 * deeply still refuses to hang a piece, which is exactly the mistake a
 * beginner needs their opponent to make.
 */
const WEAK_BANDS = [
  { upTo: 500, skill: 0, depth: 1, movetimeMs: 250, multiPV: 6, slipChance: 0.62, slipDepth: 5 },
  { upTo: 750, skill: 1, depth: 2, movetimeMs: 320, multiPV: 6, slipChance: 0.5, slipDepth: 5 },
  { upTo: 1000, skill: 3, depth: 3, movetimeMs: 400, multiPV: 5, slipChance: 0.38, slipDepth: 4 },
  { upTo: 1180, skill: 5, depth: 4, movetimeMs: 480, multiPV: 5, slipChance: 0.28, slipDepth: 4 },
  { upTo: 1320, skill: 7, depth: 5, movetimeMs: 560, multiPV: 4, slipChance: 0.2, slipDepth: 3 },
];

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Turn a target rating plus a temperament into concrete engine settings. */
export function strengthFor(rating: number, temperament = 1): Strength {
  const skew = (s: number) => clamp(s * temperament, 0, 0.8);

  const band = WEAK_BANDS.find((b) => rating < b.upTo);
  if (band) {
    return {
      rating,
      uciElo: null,
      skill: band.skill,
      depth: band.depth,
      movetimeMs: band.movetimeMs,
      multiPV: band.multiPV,
      slipChance: skew(band.slipChance),
      slipDepth: band.slipDepth,
    };
  }

  // At and above the floor, hand the job to Stockfish's own strength model and
  // taper the remaining hand-rolled randomness away as the rating climbs.
  const over = rating - 1320;
  return {
    rating,
    uciElo: clamp(Math.round(rating), 1320, 3190),
    skill: 20,
    depth: clamp(Math.round(6 + over / 130), 6, 18),
    movetimeMs: clamp(Math.round(600 + over), 600, 1700),
    multiPV: over > 900 ? 1 : over > 400 ? 2 : 3,
    slipChance: skew(clamp(0.14 - over / 9000, 0, 0.14)),
    slipDepth: over > 900 ? 0 : over > 400 ? 1 : 2,
  };
}

export const CHARACTERS: Character[] = [
  {
    id: 'weevil',
    name: 'Weevil Underwood',
    epithet: 'The Bug Brain',
    blurb: 'Cheats when he can, whines when he cannot. He will hang a queen and call it a trap.',
    accent: '#5f8f2e',
    // Erratic even when he is strong — he never stops being Weevil.
    temperament: 1.35,
    signature: 0,
    tiers: [
      { label: 'Larva', rating: 320 },
      { label: 'Cocoon', rating: 700 },
      { label: 'Basic Insect', rating: 1050 },
      { label: 'Great Moth', rating: 1500 },
      { label: 'Perfectly Ultimate Great Moth', rating: 2000 },
    ],
    portrait: {
      dir: 'weevil',
      body: { w: 146, h: 173 },
      // His eyes sit behind opaque glasses — every alternate frame looks the
      // same, so there is nothing to animate. Blinking stays off.
      eyes: { slot: { x: 28, y: 44, w: 48, h: 16 }, blink: false },
      mouth: { slot: { x: 41, y: 60, w: 24, h: 16 }, frames: 3 },
      poses: 2,
    },
  },
  {
    id: 'joey',
    name: 'Joey Wheeler',
    epithet: 'Brooklyn Rage',
    blurb: 'All heart, no plan. Plays on instinct and gets further than he has any right to.',
    accent: '#d08a24',
    temperament: 1.2,
    signature: 2,
    tiers: [
      { label: 'Rookie', rating: 450 },
      { label: 'Scrappy', rating: 820 },
      { label: 'Brooklyn Rage', rating: 1150 },
      { label: 'Red-Eyes Awakened', rating: 1600 },
      { label: 'Heart of the Cards', rating: 2100 },
    ],
    portrait: {
      dir: 'joey',
      body: { w: 175, h: 192 },
      eyes: { slot: { x: 28, y: 42, w: 40, h: 16 }, blink: true },
      mouth: { slot: { x: 45, y: 59, w: 16, h: 16 }, frames: 3 },
      poses: 4,
    },
  },
  {
    id: 'mai',
    name: 'Mai Valentine',
    epithet: "Harpie's Gambit",
    blurb: 'Reads you before she reads the board. Punishes anything careless.',
    accent: '#9a5bc4',
    temperament: 0.95,
    signature: 2,
    tiers: [
      { label: 'Warming Up', rating: 520 },
      { label: 'Playing With You', rating: 900 },
      { label: "Harpie's Gambit", rating: 1350 },
      { label: 'Harpie Lady Sisters', rating: 1800 },
      { label: 'Amazoness Fury', rating: 2250 },
    ],
    portrait: {
      dir: 'mai',
      body: { w: 114, h: 184 },
      eyes: { slot: { x: 32, y: 37, w: 24, h: 24 }, blink: true },
      mouth: { slot: { x: 43, y: 60, w: 8, h: 8 }, frames: 3 },
      poses: 2,
    },
  },
  {
    id: 'pegasus',
    name: 'Maximillion Pegasus',
    epithet: 'The Millennium Eye',
    blurb: 'Claims to see your next three moves. Irritatingly often, he does.',
    accent: '#b02338',
    temperament: 0.9,
    signature: 3,
    tiers: [
      { label: 'Merely Toying', rating: 560 },
      { label: 'Mildly Amused', rating: 950 },
      { label: 'Genuinely Interested', rating: 1400 },
      { label: 'The Millennium Eye', rating: 1850 },
      { label: 'Toon World', rating: 2400 },
    ],
    portrait: {
      dir: 'pegasus',
      body: { w: 135, h: 192 },
      eyes: { slot: { x: 48, y: 24, w: 16, h: 8 }, blink: true },
      mouth: { slot: { x: 58, y: 40, w: 16, h: 8 }, frames: 3 },
      poses: 2,
    },
  },
  {
    id: 'kaiba',
    name: 'Seto Kaiba',
    epithet: 'Obliterate',
    blurb: 'No tricks, no mercy, no interest in your feelings. Simply better than you.',
    accent: '#3d76c4',
    // Even handicapped, Kaiba does not flail. He plays a clean weak game.
    temperament: 0.7,
    signature: 4,
    tiers: [
      { label: 'Holding Back', rating: 600 },
      { label: 'Barely Trying', rating: 1000 },
      { label: 'Serious', rating: 1500 },
      { label: 'No Mercy', rating: 2000 },
      { label: 'Blue-Eyes White Dragon', rating: 2450 },
    ],
    portrait: {
      dir: 'kaiba',
      body: { w: 139, h: 192 },
      eyes: { slot: { x: 43, y: 32, w: 40, h: 16 }, blink: true },
      mouth: { slot: { x: 56, y: 50, w: 16, h: 16 }, frames: 3 },
      poses: 3,
    },
  },
  {
    id: 'atem',
    name: 'Atem',
    epithet: 'The Nameless Pharaoh',
    blurb: 'Three thousand years of games, and he has not lost one that mattered. Yet.',
    accent: '#e8c55a',
    temperament: 0.8,
    signature: 4,
    tiers: [
      { label: 'Restrained', rating: 700 },
      { label: 'The Duelist', rating: 1200 },
      { label: 'Shadow Game', rating: 1700 },
      { label: "Pharaoh's Judgement", rating: 2250 },
      { label: 'The Nameless Pharaoh', rating: 2850 },
    ],
    portrait: {
      dir: 'atem',
      body: { w: 128, h: 188 },
      eyes: { slot: { x: 27, y: 63, w: 40, h: 24 }, blink: true },
      mouth: { slot: { x: 46, y: 86, w: 8, h: 8 }, frames: 3 },
      poses: 3,
    },
  },
];

export function characterById(id: string): Character {
  return CHARACTERS.find((c) => c.id === id) ?? CHARACTERS[0];
}

/** Clamp a tier index to something the character actually has. */
export function tierIndex(character: Character, raw: number): number {
  if (!Number.isFinite(raw)) return character.signature;
  return clamp(Math.round(raw), 0, character.tiers.length - 1);
}

export function strengthOf(character: Character, tier: number): Strength {
  const t = character.tiers[tierIndex(character, tier)];
  return strengthFor(t.rating, character.temperament);
}

/** Rough band label so the number is not the only signal. */
export function ratingBand(rating: number): string {
  if (rating < 600) return 'Beginner';
  if (rating < 1000) return 'Casual';
  if (rating < 1400) return 'Club';
  if (rating < 1900) return 'Strong';
  if (rating < 2400) return 'Expert';
  return 'Master';
}

/** Asset path helper — assets live in public/, so these are base-relative. */
export function portraitAsset(p: Portrait, file: string): string {
  return `sprites/chars/${p.dir}/${file}`;
}
