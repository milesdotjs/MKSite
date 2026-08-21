/* Seeded RNG — mulberry32. Every generated area derives its own
   stream from the world seed and its coordinates, so the same save
   always rebuilds the same city. */

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Cheap string -> 32-bit hash, for deriving per-area seeds. */
export function hash(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

export class RNG {
  constructor(seed) {
    this.next = typeof seed === 'number' ? mulberry32(seed) : mulberry32(hash(String(seed)));
  }

  float(a = 1, b) {
    return b === undefined ? this.next() * a : a + this.next() * (b - a);
  }

  /** Integer in [a, b] inclusive. */
  int(a, b) {
    if (b === undefined) {
      b = a - 1;
      a = 0;
    }
    return a + Math.floor(this.next() * (b - a + 1));
  }

  chance(p) {
    return this.next() < p;
  }

  pick(arr) {
    return arr[Math.floor(this.next() * arr.length)];
  }

  /** Pick from [{weight, ...}] entries. */
  weighted(arr, key = 'weight') {
    let total = 0;
    for (const it of arr) total += it[key] ?? 1;
    let r = this.next() * total;
    for (const it of arr) {
      r -= it[key] ?? 1;
      if (r <= 0) return it;
    }
    return arr[arr.length - 1];
  }

  shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = this.int(0, i);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
}

/** Module-level stream for things that need not be reproducible (damage rolls, idle flavour). */
export const rng = new RNG((Math.random() * 0xffffffff) >>> 0);
