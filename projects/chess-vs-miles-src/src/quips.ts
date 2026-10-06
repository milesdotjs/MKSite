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
 * Opening quips are keyed by a *substring* of the opening name the book
 * reports (see book/*.ts), matched case-insensitively, most specific first.
 * ────────────────────────────────────────────────────────────────────────────
 */

export type QuipKey =
  | "greeting" // game starts (both colours)
  | "greetingWhite" // game starts and Miles is White
  | "greetingBlack" // game starts and Miles is Black
  | "thinking" // shown while the engine searches (out of book)
  | "bookMove" // Miles played a move straight from his repertoire
  | "leftBook" // the opponent left his book; first engine move
  | "punish" // Miles abandoned his book to take a hanging piece
  | "capture" // Miles took a minor piece or pawn
  | "captureBig" // Miles took a rook or queen
  | "lostPiece" // the opponent took a minor piece or pawn from Miles
  | "lostQueen" // the opponent took his rook or queen
  | "check" // Miles gave check
  | "inCheck" // Miles is in check
  | "playerBlunder" // eval swung hard in Miles's favour after the opponent's move
  | "playerGood" // eval swung hard against Miles after the opponent's move
  | "castle" // Miles castled
  | "castleLong" // Miles castled queenside (English Attack energy)
  | "promote" // Miles promoted a pawn
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
export const OPENING_QUIPS: Array<{ match: string; lines: string[] }> = [
  {
    match: "Najdorf",
    lines: [
      "Najdorf. Of course Najdorf.",
      "Najdorf. I have one opening and this is it.",
    ],
  },
  {
    match: "Hyper-Accelerated Dragon",
    lines: [
      "Hyper-accelerated. Fast dragon.",
      "g6 on move two. Living dangerously.",
    ],
  },
  { match: "Classical Variation", lines: ["Classical Sicilian. Respectable."] },
  {
    match: "Yugoslav",
    lines: [
      "Yugoslav Attack. This gets violent.",
      "Dragon? Yugoslav. Every time.",
    ],
  },
  {
    match: "English Attack",
    lines: [
      "English Attack. Be3, f3, Qd2, long castle. You know the drill.",
      "Castle long, push pawns at your king. Simple plan.",
    ],
  },
  { match: "Sveshnikov", lines: ["Sveshnikov. Fine. Fine."] },
  {
    match: "Sicilian",
    lines: ["Sicilian. A person of taste.", "c5. Respect."],
  },
  { match: "Scotch", lines: ["Scotch today. Felt like it."] },
  { match: "Berlin", lines: ["Berlin. You want a draw already?"] },
  {
    match: "Ruy Lopez",
    lines: [
      "Ruy Lopez. The Spanish torture begins.",
      "Bb5. We are doing this properly.",
    ],
  },
  { match: "Petrov", lines: ["Petrov. Okay."] },
  { match: "Panov", lines: ["Panov. c4 against the Caro, always."] },
  { match: "Caro-Kann", lines: ["Caro-Kann. Solid. Annoying. Respect."] },
  {
    match: "French",
    lines: [
      "French. e5 is coming and your bishop is going to hate it.",
      "Advance variation. I like space.",
    ],
  },
  { match: "Scandinavian", lines: ["Scandi. Sure."] },
  { match: "Alekhine", lines: ["Alekhine's. Bold."] },
  { match: "Pirc", lines: ["Pirc. Alright."] },
  { match: "Modern", lines: ["Modern. Alright."] },
  {
    match: "Réti",
    lines: [
      "Réti today. Nf3, b3, bishop on b2. This is my fun one.",
      "Flank opening. Humor me.",
    ],
  },
  {
    match: "Jobava",
    lines: [
      "Jobava London. I hate this opening. Playing it anyway.",
      "Nc3 and Bf4. Yes, really. No, I am not proud.",
    ],
  },
  { match: "Botvinnik", lines: ["Botvinnik variation. Buckle up."] },
  { match: "Anti-Moscow", lines: ["Anti-Moscow gambit. Okay then."] },
  { match: "Meran", lines: ["Meran. The good Semi-Slav."] },
  { match: "Moscow", lines: ["Moscow variation. Keep it calm."] },
  {
    match: "Semi-Slav",
    lines: ["Semi-Slav. My d4 answer.", "c6 and e6. Semi-Slav, like always."],
  },
  { match: "Queen's Indian", lines: ["Queen's Indian today. Changing it up."] },
  { match: "Nimzo-Indian", lines: ["Nimzo. Rare for me. Enjoy it."] },
  {
    match: "London",
    lines: ["London System. Of course it is.", "The London. Sigh."],
  },
  { match: "Catalan", lines: ["Catalan. Fancy."] },
  { match: "English Opening", lines: ["English. Fine, we transpose."] },
  { match: "Grob", lines: ["Grob? Grob.", "g4. Why."] },
];

let lastByKey: Partial<Record<QuipKey, string>> = {};
let lastOpening = "";

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

/** A reaction to an opening name, once per distinct name per game. */
export function openingQuip(name: string | null): string | null {
  if (!name || name === lastOpening) return null;
  const hit = OPENING_QUIPS.find((o) =>
    name.toLowerCase().includes(o.match.toLowerCase()),
  );
  if (!hit) return null;
  lastOpening = name;
  return hit.lines[Math.floor(Math.random() * hit.lines.length)];
}

export function resetQuips(): void {
  lastByKey = {};
  lastOpening = "";
}
