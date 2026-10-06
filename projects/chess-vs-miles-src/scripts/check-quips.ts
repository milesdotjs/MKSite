/**
 * Sanity-check quips.ts after editing: every event key has at least one line,
 * no opening pattern is duplicated, and more specific opening patterns come
 * before the general ones they contain (otherwise the general one always wins).
 *
 *   npx tsx scripts/check-quips.ts
 */
import { OPENING_QUIPS, QUIPS } from '../src/quips';

let bad = 0;
const empty = Object.entries(QUIPS).filter(([, v]) => !Array.isArray(v) || v.length === 0 || v.some((l) => !l.trim()));
for (const [k] of empty) {
  console.log(`✗ "${k}" has no usable lines`);
  bad++;
}

const seen = new Set<string>();
OPENING_QUIPS.forEach((o, i) => {
  const key = o.match.toLowerCase();
  if (seen.has(key)) {
    console.log(`✗ opening pattern "${o.match}" is listed twice`);
    bad++;
  }
  seen.add(key);
  if (o.lines.length === 0) {
    console.log(`✗ opening pattern "${o.match}" has no lines`);
    bad++;
  }
  // A general pattern listed before a specific one that contains it shadows it.
  for (let j = i + 1; j < OPENING_QUIPS.length; j++) {
    const later = OPENING_QUIPS[j].match.toLowerCase();
    if (later !== key && later.includes(key)) {
      console.log(`✗ "${o.match}" comes before the more specific "${OPENING_QUIPS[j].match}" and will shadow it`);
      bad++;
    }
  }
});

const total = Object.values(QUIPS).reduce((a, v) => a + v.length, 0);
console.log(`${Object.keys(QUIPS).length} event keys, ${total} lines, ${OPENING_QUIPS.length} opening patterns, ${bad} problem(s).`);
process.exit(bad ? 1 : 0);
