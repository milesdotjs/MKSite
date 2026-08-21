/* ============================================================
   7-3 — experience curve

   Levels 1-99 are the exact Old School RuneScape table:
       xp(L) = floor( 1/4 * sum_{n=1..L-1} floor(n + 300 * 2^(n/7)) )
   which puts level 99 at 13,034,431 as it should.

   Past 99 the real formula doubles every 7 levels forever and
   reaches ~10^42 by level 1000, which is unusable. So the curve
   continues with the same per-level increment but a doubling
   period that stretches with level:

       d(L) = d(98) * 2^( (L-98) / (7 + A*(L-98)) )

   At L=98 the local growth rate is exactly 1/7 doublings per
   level, so this is tangent to the OSRS exponential at the seam —
   no visible kink — and the period relaxes from 7 levels to ~52
   by level 1000. With A = 0.10 the table lands at:

       L100  14.39M     L200  2.84B
       L500  84.41B     L1000 399.70B

   Big enough to feel absurd, small enough that it never needs a
   suffix past "B" and stays far inside Number.MAX_SAFE_INTEGER.
   ============================================================ */

export const MAX_LEVEL = 1000;
const SEAM = 98;
const A = 0.1;

/** xp[L] = total experience required to *be* level L. xp[1] = 0. */
export const XP_TABLE = (() => {
  const xp = new Array(MAX_LEVEL + 1).fill(0);
  let acc = 0;
  for (let n = 1; n < SEAM + 1; n++) {
    acc += Math.floor(n + 300 * Math.pow(2, n / 7));
    xp[n + 1] = Math.floor(acc / 4);
  }
  const dSeam = xp[SEAM + 1] - xp[SEAM];
  let cur = xp[SEAM + 1];
  for (let L = SEAM + 1; L < MAX_LEVEL; L++) {
    const t = L - SEAM;
    cur += dSeam * Math.pow(2, t / (7 + A * t));
    xp[L + 1] = Math.round(cur);
  }
  return xp;
})();

export const MAX_XP = XP_TABLE[MAX_LEVEL];

/** Level for a given total experience. Binary search; the table is sorted. */
export function levelFor(xp) {
  if (xp >= MAX_XP) return MAX_LEVEL;
  let lo = 1;
  let hi = MAX_LEVEL;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (XP_TABLE[mid] <= xp) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

export const xpForLevel = (L) => XP_TABLE[Math.min(MAX_LEVEL, Math.max(1, L | 0))];

/** Experience still owed before the next level-up. */
export function xpToNext(xp) {
  const L = levelFor(xp);
  if (L >= MAX_LEVEL) return 0;
  return XP_TABLE[L + 1] - xp;
}

/** Progress through the current level, 0..1. */
export function levelProgress(xp) {
  const L = levelFor(xp);
  if (L >= MAX_LEVEL) return 1;
  const base = XP_TABLE[L];
  const span = XP_TABLE[L + 1] - base;
  return span > 0 ? (xp - base) / span : 1;
}

/**
 * Experience awarded for clearing one task.
 *
 * Awards are quoted as a fraction of the *current* level's span,
 * so progress never stalls no matter how steep the curve gets —
 * the payoff numbers grow with the curve instead. `k` decays
 * slowly with level so late levels take noticeably longer without
 * ever becoming a wall.
 */
export function xpAward(level, mult = 1, overtime = false) {
  const L = Math.min(MAX_LEVEL, Math.max(1, level | 0));
  if (L >= MAX_LEVEL) return 0;
  const span = XP_TABLE[L + 1] - XP_TABLE[L];
  const k = 0.2 - 0.14 * ((L - 1) / (MAX_LEVEL - 1)); // 0.20 -> 0.06
  return Math.max(1, Math.round(span * k * mult * (overtime ? 2 : 1)));
}

/* ---------- number formatting ---------- */

const UNITS = [
  [1e12, 'T'],
  [1e9, 'B'],
  [1e6, 'M'],
  [1e3, 'K'],
];

/** 1234567 -> "1.23M". Keeps big payouts readable in a 160px screen. */
export function abbrev(n) {
  const v = Math.floor(n);
  for (const [scale, suffix] of UNITS) {
    if (v >= scale) {
      const s = v / scale;
      return (s >= 100 ? s.toFixed(0) : s >= 10 ? s.toFixed(1) : s.toFixed(2)) + suffix;
    }
  }
  return String(v);
}

/** 1234567 -> "1,234,567". For the stats screen, where it fits. */
export function commas(n) {
  return Math.floor(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function money(n) {
  return '$' + abbrev(n);
}
