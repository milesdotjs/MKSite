// Sanity checks on the trivia pool: ids unique, four distinct options, answer
// index valid, no duplicate question text, and a per-series/difficulty tally.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const FILES = ["bleach", "naruto", "dragonball", "yugioh", "jjk", "yyh"];
const all = [];
for (const f of FILES) {
  const qs = JSON.parse(readFileSync(resolve("data", `${f}.json`), "utf8"));
  for (const q of qs) all.push({ ...q, _file: f });
}

let bad = 0;
const ids = new Set();
const texts = new Map();
const tally = {};
for (const q of all) {
  const err = (m) => { bad++; console.log(`  ${q.id ?? "?"} (${q._file}): ${m}`); };
  if (!q.id) err("missing id");
  else if (ids.has(q.id)) err("duplicate id");
  ids.add(q.id);
  if (q.series !== q._file) err(`series '${q.series}' does not match file`);
  if (!["easy", "medium", "hard"].includes(q.difficulty)) err(`bad difficulty '${q.difficulty}'`);
  if (!Array.isArray(q.options) || q.options.length !== 4) err("needs exactly 4 options");
  else {
    const set = new Set(q.options.map((o) => String(o).trim().toLowerCase()));
    if (set.size !== 4) err("duplicate option text");
    if (q.options.some((o) => !String(o).trim())) err("empty option");
  }
  if (typeof q.answer !== "number" || q.answer < 0 || q.answer > 3) err("answer index out of range");
  if (!q.q || !String(q.q).trim()) err("empty question");
  const key = String(q.q).trim().toLowerCase();
  if (texts.has(key)) err(`same question text as ${texts.get(key)}`);
  texts.set(key, q.id);
  const k = `${q.series}/${q.difficulty}`;
  tally[k] = (tally[k] ?? 0) + 1;
}

console.log(`\n${all.length} questions`);
for (const f of FILES) {
  const e = tally[`${f}/easy`] ?? 0, m = tally[`${f}/medium`] ?? 0, h = tally[`${f}/hard`] ?? 0;
  console.log(`  ${f.padEnd(7)} ${String(e + m + h).padStart(3)}  (easy ${e}, medium ${m}, hard ${h})`);
}
const filler = all.filter((q) => (q.tags ?? []).includes("filler")).length;
console.log(`  filler-tagged: ${filler}`);
if (bad) {
  console.log(`\n${bad} problem(s) found`);
  process.exit(1);
}
console.log("\nOK");
