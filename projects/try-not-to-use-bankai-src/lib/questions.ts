import bleach from "@/data/bleach.json";
import naruto from "@/data/naruto.json";
import dragonball from "@/data/dragonball.json";
import yugioh from "@/data/yugioh.json";
import jjk from "@/data/jjk.json";
import yyh from "@/data/yyh.json";
import fma from "@/data/fma.json";
import pokemon from "@/data/pokemon.json";

export type Series = "bleach" | "naruto" | "dragonball" | "yugioh" | "jjk" | "yyh" | "fma" | "pokemon";
export type Difficulty = "easy" | "medium" | "hard";

export interface Question {
  id: string;
  series: Series;
  difficulty: Difficulty;
  q: string;
  options: string[];
  answer: number;
  note?: string;
  tags?: string[];
}

export interface RunQuestion extends Question {
  shuffled: string[];
  correctIndex: number;
}

export const ALL: Question[] = [
  ...(bleach as Question[]),
  ...(naruto as Question[]),
  ...(dragonball as Question[]),
  ...(yugioh as Question[]),
  ...(jjk as Question[]),
  ...(yyh as Question[]),
  ...(fma as Question[]),
  ...(pokemon as Question[]),
];

export const ALL_SERIES: Series[] = ["bleach", "naruto", "dragonball", "yugioh", "jjk", "yyh", "fma", "pokemon"];
// Pokemon is the everyone-mode pool: deliberately easy, and never mixed into other hosts' runs.
const MIX_EXCLUDE: Series[] = ["pokemon"];

export const SERIES_LABEL: Record<Series, string> = {
  bleach: "BLEACH",
  naruto: "NARUTO",
  dragonball: "DRAGON BALL",
  yugioh: "YU-GI-OH!",
  jjk: "JUJUTSU KAISEN",
  yyh: "YU YU HAKUSHO",
  fma: "FULLMETAL ALCHEMIST",
  pokemon: "POKEMON",
};

export const RUN_LENGTH = 10;
export const MAX_STRIKES = 2;
export const DIFF_MULT: Record<Difficulty, number> = { easy: 1, medium: 2, hard: 3 };

// Seconds allowed per question: 40 on the first, shrinking to 22 on the tenth.
// Room to think, but the shrink keeps the pressure on.
export const timeFor = (index: number) => Math.max(20, 40 - index * 2);

// Difficulty ramps across the run: three easy, four medium, three hard.
const SLOTS: Difficulty[] = [
  "easy", "easy", "easy",
  "medium", "medium", "medium", "medium",
  "hard", "hard", "hard",
];

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Builds one interrogation: ten questions, half of them from the host's own
 * series and one each from five of the other series (Pokemon excluded). A
 * `solo` host draws all ten from its own series. Difficulty follows SLOTS.
 * `seen` holds ids from recent runs so the same question is not re-asked
 * until the pool has been worked through.
 */
export function buildRun(host: Series, seen: Set<string>, solo = false): RunQuestion[] {
  const others = shuffle(ALL_SERIES.filter((s) => s !== host && !MIX_EXCLUDE.includes(s))).slice(0, 5);
  const seriesPlan: Series[] = solo
    ? Array.from({ length: 10 }, () => host)
    : shuffle([host, host, host, host, host, ...others]);

  const used = new Set<string>();
  const out: RunQuestion[] = [];

  SLOTS.forEach((diff, i) => {
    const series = seriesPlan[i];
    const candidates = ALL.filter((q) => q.series === series && q.difficulty === diff && !used.has(q.id));
    const fresh = candidates.filter((q) => !seen.has(q.id));
    const pool = fresh.length ? fresh : candidates.length ? candidates : ALL.filter((q) => q.difficulty === diff && !used.has(q.id));
    const q = pick(pool);
    used.add(q.id);
    const order = shuffle(q.options.map((_, k) => k));
    out.push({
      ...q,
      shuffled: order.map((k) => q.options[k]),
      correctIndex: order.indexOf(q.answer),
    });
  });

  return out;
}
