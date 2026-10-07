/**
 * Validate every repertoire line: each SAN move must be legal from the
 * position before it, and every line must end right after one of Miles's
 * moves (so the book never leaves him without a reply mid-line). Also prints
 * the compiled book's size and the first-move odds so the fork weights can
 * be eyeballed.
 *
 *   npm run book:check
 */
import { Chess } from 'chess.js';
import { WHITE_LINES } from '../src/book/white';
import { WHITE_SIDELINES } from '../src/book/white-sidelines';
import { BLACK_E4_LINES } from '../src/book/black-e4';
import { BLACK_E4_MORE } from '../src/book/black-e4-more';
import { BLACK_E4_ANTI } from '../src/book/black-e4-anti';
import { BLACK_D4_LINES } from '../src/book/black-d4';
import { BLACK_D4_MORE } from '../src/book/black-d4-more';
import { bookFor, bookKey, openingName, tokens } from '../src/book/book';
import type { Line } from '../src/book/types';

const sets: Array<[string, 'w' | 'b', Line[]]> = [
  ['white', 'w', WHITE_LINES],
  ['white-sidelines', 'w', WHITE_SIDELINES],
  ['black-e4', 'b', BLACK_E4_LINES],
  ['black-e4-more', 'b', BLACK_E4_MORE],
  ['black-e4-anti', 'b', BLACK_E4_ANTI],
  ['black-d4', 'b', BLACK_D4_LINES],
  ['black-d4-more', 'b', BLACK_D4_MORE],
];

let bad = 0;
let total = 0;

for (const [label, side, lines] of sets) {
  for (const line of lines) {
    if (!line.moves) continue; // blanked by fix-book
    total++;
    const chess = new Chess();
    let ok = true;
    for (const san of tokens(line.moves)) {
      try {
        chess.move(san);
      } catch {
        console.log(`✗ [${label}] ${line.name}\n    illegal "${san}" after: ${chess.history().join(' ')}`);
        ok = false;
        bad++;
        break;
      }
    }
    if (ok && chess.turn() === side) {
      console.log(`✗ [${label}] ${line.name}\n    ends on the opponent's move (bot has no reply recorded)`);
      bad++;
    }
  }
}

const white = bookFor('w');
const black = bookFor('b');
console.log(`\n${total} lines, ${bad} problems. Book positions: ${white.size} as White, ${black.size} as Black.`);

const odds = (list: { san: string; weight: number }[]) => {
  const sum = list.reduce((a, c) => a + c.weight, 0);
  return list.map((c) => `${c.san} ${((c.weight / sum) * 100).toFixed(1)}%`).join(', ');
};

const start = new Chess();
console.log('White move 1:    ', odds(white.moves.get(bookKey(start.fen())) ?? []));
const e4 = new Chess();
e4.move('e4');
console.log('Black vs 1.e4:   ', odds(black.moves.get(bookKey(e4.fen())) ?? []));
const d4 = new Chess();
d4.move('d4');
console.log('Black vs 1.d4:   ', odds(black.moves.get(bookKey(d4.fen())) ?? []));
const ruy = new Chess();
for (const m of ['e4', 'e5', 'Nf3', 'Nc6']) ruy.move(m);
console.log('White vs 2...Nc6:', odds(white.moves.get(bookKey(ruy.fen())) ?? []));
const naj = new Chess();
for (const m of ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3']) naj.move(m);
console.log('Black move 5:    ', odds(black.moves.get(bookKey(naj.fen())) ?? []));
naj.move('a6');
console.log('Name after 5...a6:', openingName(black, naj.fen()));
const sic = new Chess();
for (const m of ['e4', 'c5']) sic.move(m);
console.log('Name after 1...c5:', openingName(white, sic.fen()));

process.exit(bad ? 1 : 0);
