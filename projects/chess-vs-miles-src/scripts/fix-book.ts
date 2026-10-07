/**
 * Repair the repertoire files in place: any line with an illegal move is cut
 * back to the last legal position in which the *opponent* is to move (so the
 * line still ends on one of Miles's moves). Shorter prep is fine — the engine
 * takes over wherever the book stops — while an illegal move would be a
 * silent hole at runtime.
 *
 *   npx tsx scripts/fix-book.ts
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { Chess } from 'chess.js';
import { tokens } from '../src/book/book';
import type { Line } from '../src/book/types';
import { WHITE_LINES } from '../src/book/white';
import { WHITE_SIDELINES } from '../src/book/white-sidelines';
import { BLACK_E4_LINES } from '../src/book/black-e4';
import { BLACK_E4_MORE } from '../src/book/black-e4-more';
import { BLACK_E4_ANTI } from '../src/book/black-e4-anti';
import { BLACK_D4_LINES } from '../src/book/black-d4';
import { BLACK_D4_MORE } from '../src/book/black-d4-more';

const files: Array<[string, 'w' | 'b', Line[]]> = [
  ['src/book/white.ts', 'w', WHITE_LINES],
  ['src/book/white-sidelines.ts', 'w', WHITE_SIDELINES],
  ['src/book/black-e4.ts', 'b', BLACK_E4_LINES],
  ['src/book/black-e4-more.ts', 'b', BLACK_E4_MORE],
  ['src/book/black-e4-anti.ts', 'b', BLACK_E4_ANTI],
  ['src/book/black-d4.ts', 'b', BLACK_D4_LINES],
  ['src/book/black-d4-more.ts', 'b', BLACK_D4_MORE],
];

function numbered(sans: string[]): string {
  const out: string[] = [];
  for (let i = 0; i < sans.length; i++) {
    if (i % 2 === 0) out.push(`${i / 2 + 1}.`);
    out.push(sans[i]);
  }
  return out.join(' ');
}

let fixed = 0;
let dropped = 0;

for (const [path, side, lines] of files) {
  let src = readFileSync(path, 'utf8');
  for (const line of lines) {
    const sans = tokens(line.moves);
    const chess = new Chess();
    let legal = sans.length;
    for (let i = 0; i < sans.length; i++) {
      try {
        chess.move(sans[i]);
      } catch {
        legal = i;
        break;
      }
    }
    // Also require the line to end right after one of Miles's moves.
    let keep = legal;
    while (keep > 0) {
      const mover = keep % 2 === 1 ? 'w' : 'b'; // ply index keep-1 was made by this colour
      if (mover === side) break;
      keep--;
    }
    if (keep === sans.length) continue;

    const original = `moves: '${line.moves}'`;
    if (!src.includes(original)) {
      console.log(`! could not locate in ${path}: ${line.name}`);
      continue;
    }
    if (keep < 2) {
      // Nothing useful left; blank the moves so the compiler ignores it.
      src = src.replace(original, `moves: ''`);
      dropped++;
      console.log(`- dropped  [${path}] ${line.name}`);
      continue;
    }
    const replacement = `moves: '${numbered(sans.slice(0, keep))}'`;
    src = src.replace(original, replacement);
    fixed++;
    console.log(`~ trimmed  [${path}] ${line.name}\n           ${sans.length} -> ${keep} plies`);
  }
  writeFileSync(path, src, 'utf8');
}

console.log(`\n${fixed} lines trimmed, ${dropped} dropped.`);
