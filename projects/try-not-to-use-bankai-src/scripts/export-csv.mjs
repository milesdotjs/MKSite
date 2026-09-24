// Exports every trivia question to trivia-export.csv for review in Google
// Sheets. The JSON files in data/ stay the source of truth; edit those (or
// tell me which rows to change) and re-run `npm run export:csv`.
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const FILES = ["bleach", "naruto", "dragonball", "fma", "pokemon", "yugioh", "jjk", "yyh"];
const LABEL = { bleach: "Bleach", naruto: "Naruto", dragonball: "Dragon Ball", fma: "Fullmetal Alchemist", pokemon: "Pokemon", yugioh: "Yu-Gi-Oh! Duel Monsters", jjk: "Jujutsu Kaisen", yyh: "Yu Yu Hakusho" };

const rows = [];
for (const f of FILES) {
  const qs = JSON.parse(readFileSync(resolve("data", `${f}.json`), "utf8"));
  for (const q of qs) rows.push(q);
}

const esc = (v) => {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const header = ["id", "series", "difficulty", "tags", "question", "correct_answer", "wrong_1", "wrong_2", "wrong_3", "source_note", "review_notes"];
const lines = [header.join(",")];
for (const q of rows) {
  const wrong = q.options.filter((_, i) => i !== q.answer);
  lines.push([
    q.id,
    LABEL[q.series] ?? q.series,
    q.difficulty,
    (q.tags ?? []).join(" "),
    q.q,
    q.options[q.answer],
    wrong[0] ?? "",
    wrong[1] ?? "",
    wrong[2] ?? "",
    q.note ?? "",
    "",
  ].map(esc).join(","));
}

const out = resolve("trivia-export.csv");
// BOM so Excel/Sheets read the UTF-8 correctly.
writeFileSync(out, "﻿" + lines.join("\r\n") + "\r\n", "utf8");
console.log(`Wrote ${rows.length} questions to ${out}`);
