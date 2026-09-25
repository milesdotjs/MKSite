/**
 * The team-member easter egg. Placeholder team names are world chess
 * champions, so "Mikhail Tal, Owner and head chef" reads like any other
 * template until someone looks twice.
 *
 * Undisputed champions from Steinitz to Gukesh, the FIDE title holders from
 * the years the title was split, and every Women's World Champion. One
 * champion is left out by the author's preference.
 *
 * Picks are seeded so a session's names stay put across refreshes and only
 * change on "Start over". Nothing here is AI; it's a shuffled list.
 */

export const CHAMPION_NAMES: readonly string[] = [
  // Classical lineage
  "Wilhelm Steinitz",
  "Emanuel Lasker",
  "José Raúl Capablanca",
  "Alexander Alekhine",
  "Max Euwe",
  "Mikhail Botvinnik",
  "Vasily Smyslov",
  "Mikhail Tal",
  "Tigran Petrosian",
  "Boris Spassky",
  "Bobby Fischer",
  "Anatoly Karpov",
  "Garry Kasparov",
  "Viswanathan Anand",
  "Magnus Carlsen",
  "Ding Liren",
  "Gukesh Dommaraju",
  // FIDE champions during the split title
  "Alexander Khalifman",
  "Ruslan Ponomariov",
  "Rustam Kasimdzhanov",
  "Veselin Topalov",
  // Women's World Champions
  "Vera Menchik",
  "Lyudmila Rudenko",
  "Elisaveta Bykova",
  "Olga Rubtsova",
  "Nona Gaprindashvili",
  "Maia Chiburdanidze",
  "Xie Jun",
  "Susan Polgar",
  "Zhu Chen",
  "Antoaneta Stefanova",
  "Xu Yuhua",
  "Alexandra Kosteniuk",
  "Hou Yifan",
  "Anna Ushenina",
  "Mariya Muzychuk",
  "Tan Zhongyi",
  "Ju Wenjun",
];

/** A fresh seed for a new session. */
export function randomSeed(): number {
  return Math.floor(Math.random() * 0x7fffffff);
}

/** Small, fast, deterministic PRNG (mulberry32). Good enough for shuffling names. */
function mulberry32(seed: number): () => number {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** `count` distinct names for this seed. Same seed, same names, every time. */
export function pickChampionNames(seed: number, count: number): string[] {
  const rand = mulberry32(seed);
  const pool = [...CHAMPION_NAMES];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.min(count, pool.length));
}
