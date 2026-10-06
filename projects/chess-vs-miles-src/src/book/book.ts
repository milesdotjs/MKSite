/**
 * Compile the repertoire into a position-keyed book.
 *
 * Lines are written as move sequences, but the bot looks moves up by
 * *position*, so transpositions work for free: if the opponent reaches a Meran
 * through an odd move order, the book still knows what Miles plays there.
 *
 * Fork weights use max-over-lines, not a sum. The Ruy Lopez has twenty lines
 * in the file and the Scotch eight; if weights summed, the Scotch would nearly
 * vanish just because less of it was written down. With max, the file's
 * declared weights (3 vs 1) are what the odds actually are.
 */
import { Chess } from 'chess.js';
import type { Line } from './types';
import { WHITE_LINES } from './white';
import { WHITE_SIDELINES } from './white-sidelines';
import { BLACK_E4_LINES } from './black-e4';
import { BLACK_E4_MORE } from './black-e4-more';
import { BLACK_D4_LINES } from './black-d4';
import { BLACK_D4_MORE } from './black-d4-more';

export type Candidate = {
  san: string;
  weight: number;
  /** Opening name of the heaviest line that plays this move here. */
  name: string;
};

export type Book = {
  /** Bot moves available from a position. */
  moves: Map<string, Candidate[]>;
  /** Every opening name whose line passes through a position. */
  names: Map<string, string[]>;
  size: number;
};

/** Position key: piece placement, side to move, castling, en passant. */
export function bookKey(fen: string): string {
  return fen.split(' ').slice(0, 4).join(' ');
}

const MOVE_NUMBER = /^\d+\.(\.\.)?$/;

export function tokens(moves: string): string[] {
  return moves.split(/\s+/).filter((t) => t && !MOVE_NUMBER.test(t));
}

/**
 * Build the book for one colour. `side` is the colour Miles plays; only moves
 * made by that colour become candidates, while every position along the way
 * gets the line's name so the UI can say what opening the game is in.
 */
export function compileBook(lines: Line[], side: 'w' | 'b'): Book {
  const moves = new Map<string, Candidate[]>();
  const names = new Map<string, string[]>();

  for (const line of lines) {
    const chess = new Chess();
    const weight = line.weight ?? 1;
    addName(names, bookKey(chess.fen()), line.name);

    for (const san of tokens(line.moves)) {
      const key = bookKey(chess.fen());
      const mover = chess.turn();
      try {
        chess.move(san);
      } catch {
        // check-book.ts reports these; at runtime just stop following the line.
        break;
      }
      if (mover === side) {
        const list = moves.get(key) ?? [];
        const existing = list.find((c) => c.san === san);
        if (!existing) list.push({ san, weight, name: line.name });
        else if (weight > existing.weight) {
          existing.weight = weight;
          existing.name = line.name;
        }
        moves.set(key, list);
      }
      addName(names, bookKey(chess.fen()), line.name);
    }
  }

  return { moves, names, size: moves.size };
}

function addName(names: Map<string, string[]>, key: string, name: string) {
  const list = names.get(key) ?? [];
  if (!list.includes(name)) list.push(name);
  names.set(key, list);
}

/** Weighted random pick among the book's candidates, or null when out of book. */
export function pickBookMove(book: Book, fen: string, rng: () => number = Math.random): Candidate | null {
  const list = book.moves.get(bookKey(fen));
  if (!list || list.length === 0) return null;
  const total = list.reduce((a, c) => a + c.weight, 0);
  let roll = rng() * total;
  for (const c of list) {
    roll -= c.weight;
    if (roll <= 0) return c;
  }
  return list[list.length - 1];
}

/**
 * What to call the opening at this position: the longest common prefix of
 * every line name that passes through it, trimmed back to a clean boundary.
 * One line through → its full name. Many lines → whatever they agree on.
 */
export function openingName(book: Book, fen: string): string | null {
  const list = book.names.get(bookKey(fen));
  if (!list || list.length === 0) return null;
  if (list.length === 1) return list[0];

  let prefix = list[0];
  for (const n of list.slice(1)) {
    let i = 0;
    while (i < prefix.length && i < n.length && prefix[i] === n[i]) i++;
    prefix = prefix.slice(0, i);
    if (!prefix) break;
  }
  // Cut back to a word boundary so "Sicilian Defense: Najdorf, 6.B" becomes
  // "Sicilian Defense: Najdorf", then drop dangling punctuation.
  const boundary = Math.max(prefix.lastIndexOf(' '), prefix.lastIndexOf(':'), prefix.lastIndexOf(','));
  if (boundary > 0 && boundary < prefix.length - 1) prefix = prefix.slice(0, boundary);
  prefix = prefix.replace(/[\s:,(]+$/, '').trim();
  // A bare parenthetical or a single stray word is not a name worth showing.
  if (prefix.length < 4) return null;
  return prefix;
}

let whiteBook: Book | null = null;
let blackBook: Book | null = null;

/** The book for the colour Miles is playing. Compiled once, lazily. */
export function bookFor(side: 'w' | 'b'): Book {
  if (side === 'w') {
    whiteBook ??= compileBook([...WHITE_LINES, ...WHITE_SIDELINES], 'w');
    return whiteBook;
  }
  blackBook ??= compileBook([...BLACK_E4_LINES, ...BLACK_E4_MORE, ...BLACK_D4_LINES, ...BLACK_D4_MORE], 'b');
  return blackBook;
}
