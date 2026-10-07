/**
 * What Miles says during a game.
 *
 * ── MILES: THIS IS YOUR FILE TO FILL IN ─────────────────────────────────────
 * Every key below fires on a real game event (listed next to it). Put as many
 * lines under each key as you like; one is picked at random and the same line
 * is never shown twice in a row. Keep them short — the bubble is small and
 * the clock is running. The lines here now are placeholders in roughly your
 * voice so the game works; replace freely.
 *
 * Miles only talks back to the player's moves. His own moves are silent, so
 * the keys for his captures, checks, castling and promotions below are kept
 * for the record but never fire. The two exceptions after his own move are
 * `punish` and the eval verdicts (`playerBlunder`, `playerGood`), which are
 * really about the player's last move.
 *
 * Opening quips react to what the *player's* move added to the opening name
 * the book reports (see book/*.ts): after 1.e4 c5 2.c3 the name grows from
 * "Sicilian Defense" to "Sicilian Defense: Alapin Variation", so only "Alapin"
 * is matched. Patterns are matched case-insensitively, most specific first,
 * and each fires at most once per game.
 * ────────────────────────────────────────────────────────────────────────────
 */

export type QuipKey =
  | "greeting" // game starts (both colours)
  | "greetingWhite" // game starts and Miles is White
  | "greetingBlack" // game starts and Miles is Black
  | "thinking" // shown while the engine searches (out of book)
  | "bookMove" // the player's move kept the game inside his repertoire
  | "leftBook" // the player's move left his book when it still had a reply
  | "punish" // Miles abandoned his book to take a hanging piece
  | "capture" // (unused: his own moves are silent)
  | "captureBig" // (unused: his own moves are silent)
  | "lostPiece" // the opponent took a minor piece or pawn from Miles
  | "lostQueen" // the opponent took his rook or queen
  | "check" // (unused: his own moves are silent)
  | "inCheck" // Miles is in check
  | "playerBlunder" // eval swung hard in Miles's favour after the opponent's move
  | "playerGood" // eval swung hard against Miles after the opponent's move
  | "castle" // (unused: his own moves are silent)
  | "castleLong" // (unused: his own moves are silent)
  | "promote" // (unused: his own moves are silent)
  | "lowTime" // Miles has under 30 seconds
  | "opponentLowTime" // the opponent has under 30 seconds
  | "winMate" // Miles delivered checkmate
  | "winTime" // the opponent ran out of time
  | "winResign" // the opponent resigned
  | "loseMate" // Miles got checkmated
  | "loseTime" // Miles ran out of time
  | "resign" // Miles resigned a hopeless position
  | "draw"; // stalemate, repetition, insufficient material, 50 moves

export const QUIPS: Record<QuipKey, string[]> = {
  greeting: [
    "We're friends until the clock starts.",
    "Time to duel!",
    "Can't escape from crossing fate!",
  ],
  greetingWhite: ["SURPRISE. I'm gonna play e4.", "Round 1. FIGHT!"],
  greetingBlack: [
    "I can win going second, too.",
    "We're friends until the clock starts.",
  ],
  thinking: [
    "Hmm.",
    "Lets take a moment to assess the situation.",
    "Time to lock in",
    "...",
    "What would Goku do in this situation...",
  ],
  bookMove: [
    "Yeah, I know this one.",
    "All according to plan",
    "Chillin.",
    "...so you read the same book I did...",
  ],
  leftBook: [
    "Okay that one was NOT in the book",
    "Biggest plot twist of [current year]",
    "Huh. Didn't expect that one.",
  ],
  punish: [
    "As the youngsters say... YEET.",
    "Thank you sir would you like another?",
    "No takesies backsies~",
  ],
  capture: ["Yoink.", "Thank you.", "Thank you sir, would you like another?"],
  captureBig: [
    "Oh that is a BIG one.",
    "Thank you sir, would you like another?.",
    "*surprised face*.",
  ],
  lostPiece: ["Ouch.", "Okay. Fine. Fine.", "I didn't need that."],
  lostQueen: ["...okay.", "not like this...", "AY YOOOO"],
  check: ["Check.", "You're in danger.", "Your king has questions."],
  inCheck: [
    "Yeah, I see it.",
    "I'll be reaching out to HR about this..",
    "HELP~!",
  ],
  playerBlunder: [
    "...I don't want to have to do this to you...",
    "You... might be cooked...",
    "Thank you for that.",
  ],
  playerGood: [
    "Okay, that's actually good.",
    "Hm. Nice.",
    "Alright, you're real.",
  ],
  castle: [
    "I'll make a tactical sidestep.",
    "Bro just wants to chill in the corner.",
  ],
  castleLong: ["Sidestep.", "*teleports two squares over*"],
  promote: ["YAAAAS QUEEN.", "TOUCHDOWN!"],
  lowTime: [
    "Clock. Clock clock clock.",
    "No time to think, just vibes.",
    "Gotta lock in.",
  ],
  opponentLowTime: [
    "Can't escape from crossing fate.",
    "Tick tock.",
    "I'd hurry.",
  ],
  winMate: [
    "Checkmate. Good game.",
    "Have fun in the Shadow Realm...",
    "We can run it back if you like",
  ],
  winTime: [
    "The clock is a piece as well.",
    "Time. It counts. It always counts.",
    "The clock got you. Good game though.",
  ],
  winResign: ["Good game..", "GG. Run it back?"],
  loseMate: [
    "I-...impossible...!.",
    "Am I cooked? Yes, I am cooked.",
    "That was clean. Good Game.",
  ],
  loseTime: ["I FLAGGED? Ugh. Good game.", "Lost on time. Classic me."],
  resign: [
    "Ah I see. I am cooked.",
    "Okay you got me.",
    "That's lost. Well played.",
  ],
  draw: [
    "...so it seems we're evenly matched...",
    "A peaceful ending.",
    "Draw. Maybe we should go to art school...",
  ],
};

/**
 * Opening-specific reactions. Matched against the opening name the book
 * reports when the position changes; the first pattern that appears in the
 * name wins, so list specific variations before their parent opening.
 */
/**
 * `side` is who plays that opening. A line fires only when that side is the
 * player's, so Miles never comments on his own choices: as Black his answer to
 * 1.e4 is always a Sicilian and the label says so immediately, but "Sicilian"
 * is Black's opening, so it only fires when the *player* plays 1...c5.
 */
export const OPENING_QUIPS: Array<{ match: string; side: "w" | "b"; lines: string[] }> = [
  {
    match: "Najdorf", side: "b",
    lines: [
      "Najdorf. Of course Najdorf.",
      "Najdorf. Hey, that's my opening.",
    ],
  },
  {
    match: "Hyper-Accelerated Dragon", side: "b",
    lines: [
      "Hyper-accelerated. Fast dragon.",
      "g6 on move two. Living dangerously.",
    ],
  },
  { match: "Classical Variation", side: "b", lines: ["Classical Variation. Respectable."] },
  {
    match: "Yugoslav", side: "w",
    lines: [
      "Yugoslav Attack. This gets violent.",
      "Dragon? Yugoslav. Every time.",
    ],
  },
  {
    match: "English Attack", side: "w",
    lines: [
      "English Attack. Be3, f3, Qd2, long castle. You know the drill.",
      "Castle long, push pawns at your king. Simple plan.",
    ],
  },
  { match: "Sveshnikov", side: "b", lines: ["Sveshnikov. Fine. Fine."] },
  { match: "Alapin", side: "w", lines: ["c3. The Alapin. You read a book once.", "Alapin. Fine, I know this too."] },
  { match: "Smith-Morra", side: "w", lines: ["A gambit. Cute.", "Smith-Morra. I will take the pawn and think about it later."] },
  { match: "Closed Sicilian", side: "w", lines: ["Closed Sicilian. Slow and sneaky.", "Nc3 and g3. Okay, we are doing the long game."] },
  { match: "Grand Prix", side: "w", lines: ["Grand Prix. f4 and vibes.", "f4 already? Okay."] },
  { match: "Rossolimo", side: "w", lines: ["Rossolimo. You want my knight. No."] },
  { match: "Canal Attack", side: "w", lines: ["Bb5 check. Trading my bishop early. Fine."] },
  { match: "Wing Gambit", side: "w", lines: ["Wing Gambit? Free pawn. Thank you."] },
  { match: "King's Indian Attack", side: "w", lines: ["KIA. The pizza setup. Nf3, g3, Bg2. I see you."] },
  { match: "Bowdler", side: "w", lines: ["Bc4 on move two. Bold. Wrong, but bold."] },
  { match: "Chekhover", side: "w", lines: ["Queen takes on d4. Okay, come here."] },
  { match: "Prins", side: "w", lines: ["f3. The Prins. Preparing something slow."] },
  {
    match: "Sicilian", side: "b",
    lines: ["Sicilian. A person of taste.", "c5. Respect."],
  },
  { match: "Scotch", side: "w", lines: ["Scotch. Okay, we're having fun."] },
  { match: "Berlin", side: "b", lines: ["Berlin. You want a draw already?"] },
  {
    match: "Ruy Lopez", side: "w",
    lines: [
      "Ruy Lopez. The Spanish torture begins.",
      "Bb5. We are doing this properly.",
    ],
  },
  { match: "Petrov", side: "b", lines: ["Petrov. Okay."] },
  { match: "Panov", side: "w", lines: ["Panov. c4 against the Caro. Correct."] },
  { match: "Caro-Kann", side: "b", lines: ["Caro-Kann. Solid. Annoying. Respect."] },
  {
    match: "French", side: "b",
    lines: [
      "French. e5 is coming and your bishop is going to hate it.",
      "French. I'm going to take all the space. Just so you know.",
    ],
  },
  { match: "Scandinavian", side: "b", lines: ["Scandi. Sure."] },
  { match: "Alekhine", side: "b", lines: ["Alekhine's. Bold."] },
  { match: "Pirc", side: "b", lines: ["Pirc. Alright."] },
  { match: "Modern", side: "b", lines: ["Modern. Alright."] },
  {
    match: "Réti", side: "w",
    lines: [
      "Réti? Nf3, b3, bishop on b2. Hey, that's my fun one.",
      "Flank opening. Okay, I see you.",
    ],
  },
  {
    match: "Jobava", side: "w",
    lines: [
      "Jobava London. I hate this opening. Even when I play it.",
      "Nc3 and Bf4. Yes, really. I do this too and I am not proud.",
    ],
  },
  { match: "Botvinnik", side: "b", lines: ["Botvinnik variation. Buckle up."] },
  { match: "Anti-Moscow", side: "w", lines: ["Anti-Moscow gambit. Okay then."] },
  { match: "Meran", side: "b", lines: ["Meran. The good Semi-Slav."] },
  { match: "Moscow", side: "w", lines: ["Moscow variation. Keep it calm."] },
  {
    match: "Semi-Slav", side: "b",
    lines: ["Semi-Slav. My d4 answer.", "c6 and e6. Semi-Slav, like always."],
  },
  { match: "Queen's Indian", side: "b", lines: ["Queen's Indian. Fine. Changing it up."] },
  { match: "Nimzo-Indian", side: "b", lines: ["Nimzo. Rare for me. Here we go."] },
  {
    match: "London", side: "w",
    lines: ["London System. Of course it is.", "The London. Sigh."],
  },
  { match: "Catalan", side: "w", lines: ["Catalan. Fancy."] },
  { match: "English Opening", side: "w", lines: ["English. Fine, we transpose."] },
  { match: "Grob", side: "w", lines: ["Grob? Grob.", "g4. Why."] },
];

let lastByKey: Partial<Record<QuipKey, string>> = {};
let usedPatterns = new Set<string>();

/** Pick a line for an event, never repeating the previous line for that key. */
export function quip(key: QuipKey): string {
  const pool = QUIPS[key];
  if (!pool || pool.length === 0) return "";
  if (pool.length === 1) return pool[0];
  let pick = pool[Math.floor(Math.random() * pool.length)];
  let guard = 0;
  while (pick === lastByKey[key] && guard++ < 5)
    pick = pool[Math.floor(Math.random() * pool.length)];
  lastByKey[key] = pick;
  return pick;
}

/**
 * A reaction to the part of the opening name the player's move just added,
 * for openings that are the player's to choose (see `side`).
 * `prev` is the name before their move; whatever the new name adds on top of
 * it is what gets matched, so a move that merely stays inside an opening says
 * nothing and a move that names one ("Alapin") gets its line.
 */
export function openingQuip(
  name: string | null,
  prev: string | null,
  playerSide: "w" | "b",
): string | null {
  if (!name) return null;
  const added = prev && name.startsWith(prev) ? name.slice(prev.length) : name;
  if (!added.trim()) return null;
  const hit = OPENING_QUIPS.find(
    (o) =>
      o.side === playerSide &&
      !usedPatterns.has(o.match) &&
      added.toLowerCase().includes(o.match.toLowerCase()),
  );
  if (!hit) return null;
  usedPatterns.add(hit.match);
  return hit.lines[Math.floor(Math.random() * hit.lines.length)];
}

export function resetQuips(): void {
  lastByKey = {};
  usedPatterns = new Set();
}
