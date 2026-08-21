/* ============================================================
   7-3 — the opposition

   Every enemy is a piece of ordinary administrative work drawn at
   44x44. None of them can actually hurt you in any lasting way.

   Prose is written unbroken and the text box wraps it. Hand
   breaking to a pixel width only works until the box changes.
   ============================================================ */

import { canvas, px, rect, box, frame, line, ellipse, disc, shade, ruled } from './artgen.js';

const S = 44;

/* ---------- sprite builders ---------- */

function envelopes() {
  const c = canvas(S, S);
  // two envelopes behind, fanned out
  box(c, 1, 14, 32, 20, 1, 3);
  line(c, 1, 14, 17, 25, 3);
  line(c, 32, 14, 17, 25, 3);
  box(c, 10, 8, 32, 20, 1, 3);
  line(c, 10, 8, 26, 19, 3);
  line(c, 41, 8, 26, 19, 3);
  // front envelope, brightest
  box(c, 5, 20, 34, 22, 0, 3);
  line(c, 5, 20, 22, 32, 3);
  line(c, 38, 20, 22, 32, 3);
  line(c, 5, 41, 18, 31, 2);
  line(c, 38, 41, 26, 31, 2);
  // unread badge
  disc(c, 38, 17, 5, 3);
  rect(c, 37, 14, 2, 4, 0);
  rect(c, 37, 19, 2, 1, 0);
  return c;
}

function paperStack() {
  const c = canvas(S, S);
  box(c, 3, 8, 28, 34, 1, 3);
  box(c, 6, 5, 28, 34, 1, 3);
  box(c, 9, 2, 30, 38, 0, 3);
  ruled(c, 13, 8, 22, 4, 3, 2);
  // a bar chart nobody will read
  const bars = [6, 11, 8, 14, 4];
  bars.forEach((h, i) => {
    box(c, 13 + i * 5, 34 - h, 4, h, 2, 3);
  });
  rect(c, 12, 35, 25, 1, 3);
  // staple
  rect(c, 12, 5, 4, 1, 3);
  rect(c, 12, 5, 1, 3, 3);
  return c;
}

function printer() {
  const c = canvas(S, S);
  // crumpled paper erupting from the top
  line(c, 12, 12, 18, 4, 3);
  line(c, 18, 4, 24, 11, 3);
  line(c, 24, 11, 31, 3, 3);
  line(c, 31, 3, 34, 13, 3);
  rect(c, 13, 12, 21, 3, 0);
  frame(c, 13, 11, 21, 4, 3);
  // body
  box(c, 4, 15, 36, 20, 1, 3);
  shade(c, 5, 16, 34, 6, 2);
  box(c, 9, 26, 26, 5, 0, 3);
  px(c, 12, 22, 3);
  px(c, 15, 22, 3);
  px(c, 18, 22, 3);
  rect(c, 7, 35, 5, 3, 3);
  rect(c, 32, 35, 5, 3, 3);
  return c;
}

function speakerphone() {
  const c = canvas(S, S);
  // the three-legged conference puck
  ellipse(c, 22, 28, 19, 10, 1);
  ellipse(c, 22, 28, 19, 10, 3, false);
  ellipse(c, 22, 25, 19, 10, 0);
  ellipse(c, 22, 25, 19, 10, 3, false);
  for (let i = 0; i < 3; i++) ellipse(c, 22, 25, 11 - i * 4, 5 - i * 2, 2, false);
  px(c, 8, 25, 3);
  px(c, 36, 25, 3);
  // sound waves — it is already talking
  for (const r of [7, 11, 15]) {
    for (let a = -50; a <= 50; a += 6) {
      const t = (a * Math.PI) / 180;
      px(c, Math.round(22 + Math.sin(t) * r), Math.round(12 - Math.cos(t) * r * 0.7), 3);
    }
  }
  return c;
}

function clock() {
  const c = canvas(S, S);
  disc(c, 22, 23, 18, 0, 3);
  disc(c, 22, 23, 15, 1, 2);
  for (let a = 0; a < 360; a += 30) {
    const t = (a * Math.PI) / 180;
    px(c, Math.round(22 + Math.sin(t) * 13), Math.round(23 - Math.cos(t) * 13), 3);
  }
  // hands, both just shy of the top
  line(c, 22, 23, 24, 12, 3);
  line(c, 22, 23, 20, 13, 3);
  px(c, 22, 23, 3);
  px(c, 23, 23, 3);
  rect(c, 20, 2, 4, 4, 3);
  return c;
}

function cardboard() {
  const c = canvas(S, S);
  // one box, which has quietly acquired two more
  box(c, 0, 26, 15, 15, 1, 3);
  line(c, 0, 26, 4, 22, 3);
  line(c, 14, 26, 10, 22, 3);
  box(c, 29, 2, 15, 15, 1, 3);
  line(c, 29, 2, 33, 6, 3);
  line(c, 43, 2, 39, 6, 3);
  // the original, agreed scope
  box(c, 11, 14, 24, 26, 0, 3);
  line(c, 11, 14, 5, 8, 3);
  line(c, 34, 14, 40, 8, 3);
  rect(c, 11, 14, 24, 1, 3);
  rect(c, 22, 15, 2, 25, 2);
  shade(c, 12, 28, 22, 11, 2);
  return c;
}

function mug() {
  const c = canvas(S, S);
  ellipse(c, 34, 24, 9, 8, 3);
  ellipse(c, 34, 24, 5, 5, -1);
  box(c, 8, 12, 24, 26, 0, 3);
  rect(c, 8, 36, 24, 3, 2);
  // the surface of something long cold
  rect(c, 11, 15, 18, 4, 2);
  frame(c, 10, 14, 20, 6, 3);
  shade(c, 11, 22, 18, 12, 1);
  ellipse(c, 20, 40, 20, 4, 1);
  ellipse(c, 20, 40, 20, 4, 3, false);
  return c;
}

function kiosk() {
  const c = canvas(S, S);
  box(c, 6, 2, 32, 26, 1, 3);
  box(c, 9, 5, 26, 18, 0, 3);
  // an error nobody can dismiss
  rect(c, 13, 9, 18, 2, 3);
  rect(c, 13, 13, 12, 2, 2);
  rect(c, 13, 17, 15, 2, 2);
  rect(c, 18, 28, 8, 6, 2);
  box(c, 2, 34, 40, 8, 1, 3);
  shade(c, 3, 35, 38, 6, 2);
  return c;
}

function brokenMonitor() {
  const c = canvas(S, S);
  box(c, 3, 4, 38, 28, 1, 3);
  box(c, 6, 7, 32, 22, 0, 3);
  // two versions of the same file, disagreeing
  ruled(c, 9, 10, 12, 5, 4, 2);
  ruled(c, 25, 10, 12, 5, 4, 2);
  line(c, 22, 7, 19, 14, 3);
  line(c, 19, 14, 24, 18, 3);
  line(c, 24, 18, 20, 28, 3);
  rect(c, 18, 32, 8, 5, 2);
  rect(c, 12, 37, 20, 3, 3);
  return c;
}

function speechBubble() {
  const c = canvas(S, S);
  ellipse(c, 22, 18, 20, 14, 0);
  ellipse(c, 22, 18, 20, 14, 3, false);
  line(c, 14, 30, 8, 41, 3);
  line(c, 8, 41, 22, 31, 3);
  rect(c, 12, 30, 8, 3, 0);
  for (let i = 0; i < 3; i++) disc(c, 13 + i * 9, 18, 2, 3);
  return c;
}

function receipt() {
  const c = canvas(S, S);
  // a receipt of unreasonable length
  box(c, 12, 1, 22, 38, 0, 3);
  for (let x = 12; x < 34; x += 4) {
    px(c, x + 1, 39, 3);
    px(c, x + 2, 40, 3);
    px(c, x + 3, 39, 3);
  }
  ruled(c, 15, 6, 16, 8, 4, 2);
  rect(c, 15, 4, 16, 1, 3);
  rect(c, 20, 34, 11, 2, 3);
  return c;
}

function cart() {
  const c = canvas(S, S);
  line(c, 6, 12, 40, 12, 3);
  line(c, 6, 12, 12, 30, 3);
  line(c, 40, 12, 34, 30, 3);
  line(c, 12, 30, 34, 30, 3);
  rect(c, 11, 14, 26, 15, 1);
  for (let x = 14; x < 36; x += 5) line(c, x, 13, x - 2, 29, 2);
  for (let y = 17; y < 30; y += 5) rect(c, 9 + (y - 12) / 3, y, 28 - ((y - 12) / 3) * 2, 1, 2);
  frame(c, 11, 13, 27, 17, 3);
  line(c, 40, 12, 42, 4, 3);
  disc(c, 15, 36, 4, 2, 3);
  disc(c, 32, 36, 4, 2, 3);
  return c;
}

/* ---------- colleagues ----------
   Half of what interrupts you at work is not a task, it is a person
   standing at the end of your desk. These are drawn as busts so they
   read at the same weight as the objects they share a roster with. */

/**
 * A colleague, from the shoulders up.
 *  hair: 'short' | 'bob' | 'bald' | 'bun' | 'cap'
 *  extras: glasses, tie, lanyard, headset
 */
function person({ hair = 'short', glasses = false, tie = true, lanyard = false, headset = false, beard = false }) {
  const c = canvas(S, S);
  // shoulders
  for (let y = 0; y < 12; y++) {
    const w = Math.round(26 + y * 1.4);
    rect(c, Math.round(22 - w / 2), 32 + y, w, 1, 1);
  }
  // collar
  ellipse(c, 22, 33, 8, 3, 0);
  if (tie) {
    line(c, 19, 34, 22, 38, 3);
    line(c, 25, 34, 22, 38, 3);
    rect(c, 21, 38, 3, 6, 3);
  }
  if (lanyard) {
    line(c, 16, 33, 21, 41, 2);
    line(c, 28, 33, 23, 41, 2);
    box(c, 20, 40, 5, 4, 0, 3);
  }
  // head
  ellipse(c, 22, 20, 11, 12, 0);
  ellipse(c, 22, 20, 11, 12, 3, false);
  // hair
  if (hair === 'short') ellipse(c, 22, 11, 11, 6, 3);
  else if (hair === 'bob') {
    ellipse(c, 22, 12, 13, 8, 3);
    rect(c, 10, 12, 4, 14, 3);
    rect(c, 31, 12, 4, 14, 3);
  } else if (hair === 'bun') {
    ellipse(c, 22, 11, 11, 5, 3);
    disc(c, 22, 3, 5, 3);
  } else if (hair === 'cap') {
    ellipse(c, 22, 11, 12, 6, 3);
    rect(c, 8, 14, 28, 2, 3);
  } else if (hair === 'bald') {
    ellipse(c, 12, 16, 3, 5, 3);
    ellipse(c, 32, 16, 3, 5, 3);
  }
  // face
  if (glasses) {
    frame(c, 14, 18, 7, 6, 3);
    frame(c, 24, 18, 7, 6, 3);
    rect(c, 21, 20, 3, 1, 3);
  } else {
    rect(c, 16, 20, 2, 2, 3);
    rect(c, 27, 20, 2, 2, 3);
  }
  rect(c, 19, 27, 7, 1, 3);
  if (beard) shade(c, 15, 25, 15, 6, 2);
  if (headset) {
    rect(c, 9, 12, 2, 8, 3);
    rect(c, 34, 12, 2, 8, 3);
    line(c, 10, 12, 22, 6, 3);
    line(c, 34, 12, 22, 6, 3);
    line(c, 34, 20, 28, 26, 3);
    disc(c, 27, 27, 2, 3);
  }
  return c;
}

const FACES = {
  rob: person({ hair: 'short', tie: true, beard: true }),
  intern: person({ hair: 'bob', lanyard: true, tie: false }),
  glasses: person({ hair: 'short', glasses: true, tie: true }),
  bun: person({ hair: 'bun', tie: false, lanyard: true }),
  bald: person({ hair: 'bald', tie: true, glasses: true }),
  cap: person({ hair: 'cap', tie: false }),
  headset: person({ hair: 'short', headset: true, tie: false }),
  suit: person({ hair: 'short', tie: true, glasses: false }),
  bob: person({ hair: 'bob', tie: false, glasses: true }),
};

/* ---------- the roster ---------- */

const ART = {
  envelopes: envelopes(),
  paperStack: paperStack(),
  printer: printer(),
  speakerphone: speakerphone(),
  clock: clock(),
  cardboard: cardboard(),
  mug: mug(),
  kiosk: kiosk(),
  brokenMonitor: brokenMonitor(),
  speechBubble: speechBubble(),
  receipt: receipt(),
  cart: cart(),
};

export const ENEMY_ART = ART;

/**
 * `tier` scales HP, damage and rewards together. `zones` are the
 * area kinds the task can appear in. `taunt` runs on appearance,
 * `bow` on defeat.
 */
export const ENEMIES = [
  {
    id: 'inbox',
    name: 'THE INBOX',
    art: ART.envelopes,
    tier: 1,
    zones: ['office_floor', 'office_lobby', 'street', 'station'],
    taunt: 'It has been quietly filling since Friday.',
    bow: 'Inbox zero. For roughly nine minutes.',
    verb: 'answered',
  },
  {
    id: 'report',
    name: 'QUARTERLY REPORT',
    art: ART.paperStack,
    tier: 1.5,
    zones: ['office_floor', 'meeting_room', 'office_lobby'],
    taunt: 'Nobody will read it. It must exist anyway.',
    bow: 'Filed. Somewhere. Probably.',
    verb: 'filed',
  },
  {
    id: 'printer',
    name: 'PRINTER JAM',
    art: ART.printer,
    tier: 1.2,
    zones: ['office_floor', 'break_room', 'office_lobby'],
    taunt: 'Tray 2 is open. Tray 2 has always been open.',
    bow: 'You removed a piece of paper the size of a stamp.',
    verb: 'cleared',
  },
  {
    id: 'meeting',
    name: 'THE 3PM MEETING',
    art: ART.speakerphone,
    tier: 1.8,
    zones: ['meeting_room', 'office_floor'],
    taunt: 'This could have been an email. It was, once.',
    bow: 'Adjourned. Someone says "quick last thing".',
    verb: 'survived',
  },
  {
    id: 'deadline',
    name: 'THE DEADLINE',
    art: ART.clock,
    tier: 2.2,
    zones: ['office_floor', 'meeting_room', 'street', 'station'],
    taunt: 'It was always going to be today.',
    bow: 'Met. A new one forms immediately.',
    verb: 'met',
  },
  {
    id: 'scope',
    name: 'SCOPE CREEP',
    art: ART.cardboard,
    tier: 2,
    zones: ['office_floor', 'meeting_room'],
    taunt: 'While you are in there, could you also...',
    bow: 'Descoped. Written down. Never spoken of.',
    verb: 'descoped',
  },
  {
    id: 'coffee',
    name: 'COLD COFFEE',
    art: ART.mug,
    tier: 0.7,
    zones: ['break_room', 'office_floor', 'street', 'park'],
    taunt: 'You made it at 9. It is now 2.',
    bow: 'Poured out. A fresh one is made and forgotten.',
    verb: 'dealt with',
  },
  {
    id: 'checkout',
    name: 'SELF-CHECKOUT',
    art: ART.kiosk,
    tier: 1.3,
    zones: ['market', 'konbini', 'arcade'],
    taunt: 'Unexpected item in the bagging area.',
    bow: 'An attendant waves a card. You are free.',
    verb: 'defeated',
  },
  {
    id: 'conflict',
    name: 'MERGE CONFLICT',
    art: ART.brokenMonitor,
    tier: 1.9,
    zones: ['office_floor'],
    taunt: 'Both versions are yours. From today.',
    bow: 'Resolved. You kept the wrong half, but it runs.',
    verb: 'resolved',
  },
  {
    id: 'smalltalk',
    name: 'SMALL TALK',
    art: ART.speechBubble,
    tier: 0.8,
    zones: ['break_room', 'office_lobby', 'street', 'station', 'izakaya', 'park', 'arcade'],
    taunt: 'So. Getting warmer, isn’t it.',
    bow: 'You both say "anyway" and escape.',
    verb: 'endured',
  },
  {
    id: 'expenses',
    name: 'EXPENSE REPORT',
    art: ART.receipt,
    tier: 1.6,
    zones: ['office_floor', 'office_lobby'],
    taunt: 'The receipt has faded to a blank strip.',
    bow: 'Submitted. It will bounce back in a week.',
    verb: 'submitted',
  },
  {
    id: 'groceries',
    name: 'THE SHOPPING LIST',
    art: ART.cart,
    tier: 1.1,
    zones: ['market', 'konbini'],
    taunt: 'You left it on the counter at home.',
    bow: 'You bought nine things. Two were on the list.',
    verb: 'completed',
  },
];

/**
 * People. Roughly half of everything that interrupts a working day is
 * a colleague, so the roster is split about evenly with the tasks
 * above. Their moves are conversational rather than administrative.
 */
export const COLLEAGUES = [
  {
    id: 'rob',
    name: 'ROB FROM MARKETING',
    art: FACES.rob,
    tier: 1.1,
    person: true,
    zones: ['office_floor', 'office_lobby', 'break_room', 'meeting_room', 'street'],
    taunt: 'He has had an idea. He wants to run it past you. It will take a while.',
    bow: 'He will send something over. He will not send anything over.',
    verb: 'humoured',
    moves: [
      'Rob says "quick one, promise".',
      'Rob explains the idea again, slower.',
      'Rob asks what you reckon.',
      'Rob says "so anyway" and continues.',
    ],
  },
  {
    id: 'intern43',
    name: 'INTERN #43',
    art: FACES.intern,
    tier: 0.6,
    person: true,
    zones: ['office_floor', 'office_lobby', 'break_room'],
    taunt: 'They have a question. They have had it for two hours and only now dared.',
    bow: 'You answered it in nine seconds. They look faintly betrayed.',
    verb: 'helped',
    moves: [
      'Intern #43 apologises for existing.',
      'Intern #43 asks if this is a stupid question.',
      'Intern #43 has written it down. All of it.',
      'Intern #43 says "sorry, one more thing".',
    ],
  },
  {
    id: 'manager',
    name: "SOMEBODY'S MANAGER",
    art: FACES.glasses,
    tier: 1.9,
    person: true,
    zones: ['office_floor', 'meeting_room', 'office_lobby'],
    taunt: 'Not your manager. Somebody\'s. He has found you anyway.',
    bow: 'He says "great, great" and walks off mid-sentence.',
    verb: 'survived',
    moves: [
      'He asks for a quick status.',
      'He says "just so I understand".',
      'He asks who owns this.',
      'He suggests a short sync about it.',
    ],
  },
  {
    id: 'dave',
    name: 'DAVE (IT)',
    art: FACES.bald,
    tier: 1.3,
    person: true,
    zones: ['office_floor', 'office_lobby', 'break_room'],
    taunt: 'Dave needs to restart something. Dave will not say which.',
    bow: 'It works now. Dave will not say why.',
    verb: 'appeased',
    moves: [
      'Dave asks if you saved recently.',
      'Dave sighs at your desktop.',
      'Dave says "that\'s not supposed to happen".',
      'Dave types very fast for eleven seconds.',
    ],
  },
  {
    id: 'sandra',
    name: 'SANDRA FROM COMPLIANCE',
    art: FACES.bun,
    tier: 1.7,
    person: true,
    zones: ['office_floor', 'meeting_room'],
    taunt: 'She has read the whole document. She has notes on the whole document.',
    bow: 'Signed off, with conditions, in an email you will find on Monday.',
    verb: 'satisfied',
    moves: [
      'Sandra references a policy by number.',
      'Sandra asks who approved this.',
      'Sandra produces a second document.',
      'Sandra says "that\'s an interesting interpretation".',
    ],
  },
  {
    id: 'greg',
    name: 'GREG, WHO IS LEAVING',
    art: FACES.suit,
    tier: 0.9,
    person: true,
    zones: ['office_floor', 'break_room', 'izakaya'],
    taunt: 'Two weeks left and absolutely nothing to lose.',
    bow: 'He tells you what he really thinks. It is all correct.',
    verb: 'heard out',
    moves: [
      'Greg says what everyone was thinking.',
      'Greg names the project that failed.',
      'Greg laughs at his own notice period.',
      'Greg says "honestly? do not bother".',
    ],
  },
  {
    id: 'newstart',
    name: 'A NEW STARTER',
    art: FACES.cap,
    tier: 0.7,
    person: true,
    zones: ['office_lobby', 'office_floor', 'street', 'station', 'arcade'],
    taunt: 'Lanyard still shiny. Genuinely, alarmingly, enthusiastic.',
    bow: 'They thank you far too much and you feel briefly wonderful.',
    verb: 'welcomed',
    moves: [
      'They ask what the acronym means.',
      'They say they are loving it so far.',
      'They ask when the social is.',
      'They offer to help with something.',
    ],
  },
  {
    id: 'salescaller',
    name: 'A COLD CALLER',
    art: FACES.headset,
    tier: 1.4,
    person: true,
    zones: ['office_floor'],
    taunt: 'They have you by name, title, and a slightly wrong company.',
    bow: 'You say you are not the right person. You are the right person.',
    verb: 'deflected',
    moves: [
      'They ask how your week is going.',
      'They mention a mutual connection.',
      'They ask for ten minutes on Thursday.',
      'They say they will try again next quarter.',
    ],
  },
  {
    id: 'neighbourdog',
    name: 'A MAN AND HIS DOG',
    art: FACES.cap,
    tier: 0.5,
    person: true,
    zones: ['park', 'street'],
    taunt: 'The dog wants to say hello. The man has accepted this about his life.',
    bow: 'The dog is delighted. You are delighted. The man is patient.',
    verb: 'greeted',
    moves: [
      'The dog leans its entire weight on you.',
      'The man says "she likes you".',
      'The dog has found your pocket.',
      'The man apologises, not sincerely.',
    ],
  },
  {
    id: 'chugger',
    name: 'SOMEONE WITH A CLIPBOARD',
    art: FACES.bob,
    tier: 1.2,
    person: true,
    zones: ['street', 'station', 'park', 'arcade'],
    taunt: 'They have made eye contact. It is already too late.',
    bow: 'You escape having agreed to nothing but a leaflet.',
    verb: 'evaded',
    moves: [
      'They ask if you have a minute for the planet.',
      'They compliment your coat.',
      'They step sideways to match you.',
      'They say "I love that, but hear me out".',
    ],
  },
  {
    id: 'shopper',
    name: 'A DETERMINED SHOPPER',
    art: FACES.bun,
    tier: 1,
    person: true,
    zones: ['market', 'konbini', 'arcade'],
    taunt: 'Their trolley is across the aisle and they are reading every label.',
    bow: 'They move. Eventually. Without ever acknowledging you.',
    verb: 'outlasted',
    moves: [
      'They compare two identical tins.',
      'The trolley moves four centimetres.',
      'They reverse without looking.',
      'They ask you to reach the top shelf.',
    ],
  },
  {
    id: 'karaokeguy',
    name: 'A COLLEAGUE, THREE IN',
    art: FACES.suit,
    tier: 0.8,
    person: true,
    zones: ['izakaya'],
    taunt: 'Tie on head. Phone out. Queueing a song for you, specifically.',
    bow: 'You sing it. You are, briefly, extremely popular.',
    verb: 'joined',
    moves: [
      'They insist you know this one.',
      'They order another round for the table.',
      'They tell you a secret about payroll.',
      'They put an arm around your shoulders.',
    ],
  },
];

for (const c of COLLEAGUES) ENEMIES.push(c);

export const ENEMY_BY_ID = Object.fromEntries(ENEMIES.map((e) => [e.id, e]));

/**
 * Prefixes act as this game's palette-swapped variants: same art,
 * different numbers and a different name in the box.
 */
export const PREFIXES = [
  { name: '', mult: 1, weight: 58, pal: null },
  { name: 'URGENT ', mult: 1.35, weight: 14, pal: 'alert' },
  { name: 'RECURRING ', mult: 1.2, weight: 12, pal: null },
  { name: 'ESCALATED ', mult: 1.7, weight: 7, pal: 'alert' },
  { name: 'MINOR ', mult: 0.65, weight: 7, pal: null },
  { name: 'CROSS-FUNCTIONAL ', mult: 2.1, weight: 2, pal: 'ot' },
];

/** Enemies that can appear in a given area kind. */
export function enemiesFor(zone) {
  const list = ENEMIES.filter((e) => e.zones.includes(zone));
  return list.length ? list : ENEMIES;
}
