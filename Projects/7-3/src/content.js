/* ============================================================
   7-3 — content

   Skills, items, the cast, and the things they say. Nothing here
   can end a run. The worst outcome available anywhere in this file
   is a mild inconvenience that resolves itself by morning.

   Prose is written unbroken; ui.js wraps it to the box. The only
   newlines are deliberate paragraph breaks.
   ============================================================ */

/* ---------- skills ---------- */

export const SKILLS = [
  {
    id: 'slam',
    name: 'SPREADSHEET SLAM',
    short: 'SPRDSHT SLAM',
    cost: 6,
    level: 1,
    kind: 'attack',
    power: 1.35,
    line: 'You drop a pivot table on it.',
  },
  {
    id: 'reply',
    name: 'REPLY ALL',
    short: 'REPLY ALL',
    cost: 10,
    level: 4,
    kind: 'attack',
    power: 0.72,
    hits: 2,
    line: 'Everyone is now involved.',
  },
  {
    id: 'passive',
    name: 'PASSIVE VOICE',
    short: 'PASSIVE VOICE',
    cost: 8,
    level: 8,
    kind: 'debuff',
    power: 0.9,
    line: 'Mistakes were made. By no one.',
  },
  {
    id: 'delegate',
    name: 'DELEGATE',
    short: 'DELEGATE',
    cost: 14,
    level: 12,
    kind: 'attack',
    power: 1.85,
    line: 'It becomes somebody else’s problem.',
  },
  {
    id: 'circle',
    name: 'CIRCLE BACK',
    short: 'CIRCLE BACK',
    cost: 12,
    level: 16,
    kind: 'heal',
    power: 0.4,
    line: 'You park it and feel briefly wonderful.',
  },
  {
    id: 'synergy',
    name: 'SYNERGY',
    short: 'SYNERGY',
    cost: 16,
    level: 22,
    kind: 'buff',
    power: 1.3,
    line: 'Nobody knows what it means. It works.',
  },
  {
    id: 'ratio',
    name: 'RATIO',
    short: 'RATIO',
    cost: 24,
    level: 30,
    kind: 'attack',
    power: 1.6,
    crit: true,
    line: 'You strike the point where seven meets three.',
  },
  {
    id: 'ooo',
    name: 'OUT OF OFFICE',
    short: 'OUT OF OFFICE',
    cost: 26,
    level: 45,
    kind: 'heal',
    power: 1,
    line: 'Auto-reply engaged. The world goes quiet.',
  },
  {
    id: 'hardstop',
    name: 'HARD STOP',
    short: 'HARD STOP',
    cost: 34,
    level: 60,
    kind: 'finish',
    power: 1,
    line: 'Sorry — hard stop. You simply leave.',
  },
];

export const SKILL_BY_ID = Object.fromEntries(SKILLS.map((s) => [s.id, s]));

export const skillsAt = (level) => SKILLS.filter((s) => s.level <= level);

/* ---------- items ---------- */

export const ITEMS = [
  {
    id: 'coffee',
    name: 'CANNED COFFEE',
    short: 'CANNED COFFEE',
    price: 120,
    kind: 'focus',
    amount: 0.45,
    line: 'Focus restored. Hands very slightly unsteady.',
  },
  {
    id: 'sandwich',
    name: 'EGG SANDWICH',
    short: 'EGG SANDWICH',
    price: 180,
    kind: 'hp',
    amount: 0.35,
    line: 'Crustless. Perfect. Gone in four bites.',
  },
  {
    id: 'energy',
    name: 'ENERGY DRINK',
    short: 'ENERGY DRINK',
    price: 260,
    kind: 'both',
    amount: 0.3,
    line: 'Tastes like a battery. Works like one too.',
  },
  {
    id: 'bento',
    name: 'CONVENIENCE BENTO',
    short: 'CONV. BENTO',
    price: 520,
    kind: 'hp',
    amount: 0.8,
    line: 'Ninety seconds on high. A real meal, technically.',
  },
  {
    id: 'aspirin',
    name: 'ASPIRIN',
    short: 'ASPIRIN',
    price: 90,
    kind: 'both',
    amount: 0.18,
    line: 'The fluorescent hum recedes a little.',
  },
];

export const ITEM_BY_ID = Object.fromEntries(ITEMS.map((i) => [i.id, i]));

/** Which shop stocks what. */
export const SHOPS = {
  konbini: ['coffee', 'sandwich', 'energy', 'bento', 'aspirin'],
  market: ['sandwich', 'bento', 'coffee'],
  break_room: ['coffee'],
};

/* ---------- the cast ----------
   Named, recurring people. They keep their own written voices and
   are never assigned one of the dialects in voices.js — a stranger
   can have an accent, a character you meet repeatedly should not
   change register every time you speak to them. */

export const CAST = [
  {
    id: 'kenji',
    name: 'KENJI',
    role: 'Accounts',
    kind: 'senior',
    lines: [
      'The system is down. The system is always down. I have made peace.',
      'Twelve years here. I have seen four logos. The chairs never change.',
      'If you file it before four, it goes out today. After four it goes nowhere. Ever.',
      'Do not ask about the third floor.',
    ],
  },
  {
    id: 'priya',
    name: 'PRIYA',
    role: 'Design',
    kind: 'bob',
    lines: [
      'They asked me to make the logo bigger. I made it bigger. They asked me to make it smaller.',
      'I have a folder called FINAL and a folder called FINAL_2. Neither is final.',
      'You look tired. That is not an insult, it is a diagnosis.',
      'Someone put a plant on my desk. I am responsible for it now, I suppose.',
    ],
  },
  {
    id: 'marcus',
    name: 'MARCUS',
    role: 'Facilities',
    kind: 'clerk',
    lines: [
      'The thermostat is decorative. I put it there myself.',
      'The printer on 2 is haunted. Use the one by the stairs.',
      'I fixed the door. Nobody noticed. That means I fixed it correctly.',
      'There is a whole floor of chairs up there. Just chairs.',
    ],
  },
  {
    id: 'yuki',
    name: 'YUKI',
    role: 'Intern',
    kind: 'bob',
    lines: [
      'Is this... is this what it is? Is this the whole thing?',
      'I finished the task. Should I ask for another one? Is that how it works?',
      'Everyone keeps saying "circle back". Back to where? We have never been anywhere.',
      'I am learning so much. I could not tell you what.',
    ],
  },
  {
    id: 'dale',
    name: 'DALE',
    role: 'Sales',
    kind: 'salaryman',
    lines: [
      'So anyway, long story short — and I will keep this brief — so anyway.',
      'Great question. I am going to park that and come back to it. I will not come back to it.',
      'We should grab lunch. We will not grab lunch. But we should.',
      'Numbers are up. Do not ask which numbers. They are up.',
    ],
  },
  {
    id: 'senior',
    name: 'THE SENIOR',
    role: 'Unclear',
    kind: 'senior',
    lines: [
      'Do good work. Go home at six. That is the whole secret and nobody wants it.',
      'You will not remember this week. That is not a tragedy. Most weeks are not for remembering.',
      'I used to think it built to something. It builds to Thursday.',
      'Eat properly. It is not a small thing. It is most of it.',
    ],
  },
];

export const CAST_BY_ID = Object.fromEntries(CAST.map((c) => [c.id, c]));

/* ---------- shopkeepers ---------- */

export const CLERK_LINES = [
  'Welcome. Bag?',
  'The bento is fresh. Fresher than yesterday, anyway.',
  'Long day? They are all long. Some are just wider.',
  'Point card? You have never had a point card.',
];

/* ---------- after-work activities ---------- */

export const AFTER_WORK = [
  {
    id: 'izakaya',
    name: 'GO FOR ONE DRINK',
    zone: 'izakaya',
    text: 'You go for one drink. It is one drink, and then it is three, and then it is a train you nearly miss.',
    money: -900,
    joy: 3,
  },
  {
    id: 'karaoke',
    name: 'KARAOKE',
    zone: 'izakaya',
    text: 'DALE books ninety minutes and sings for eighty of them. You do one song. It is the good one.',
    money: -1100,
    joy: 4,
  },
  {
    id: 'park',
    name: 'WALK THROUGH THE PARK',
    zone: 'park',
    text: 'You take the long way home past the pond. Nothing happens. It is the best part of the day.',
    money: 0,
    joy: 4,
  },
  {
    id: 'konbini',
    name: 'CONVENIENCE STORE RUN',
    zone: 'konbini',
    text: 'You buy more than you meant to and eat one of them standing up outside.',
    money: -600,
    joy: 2,
  },
  {
    id: 'home',
    name: 'GO STRAIGHT HOME',
    zone: 'apartment',
    text: 'You go straight home. You are in bed before eleven. Tomorrow you feel like a different person.',
    money: 0,
    joy: 5,
  },
];

/* ---------- idle flavour ---------- */

export const AMBIENT = {
  office_floor: [
    'Someone laughs two rows over.',
    'The air conditioning changes its mind about the temperature.',
    'A phone rings four times and stops.',
    'The lights over aisle three flicker and settle.',
  ],
  break_room: [
    'The kettle finishes and nobody claims it.',
    'There is one biscuit left. It has been there for two days.',
    'Someone has labelled a yoghurt with a threat.',
  ],
  office_lobby: [
    'The revolving door turns with nobody in it.',
    'A courier waits, entirely at peace.',
  ],
  meeting_room: [
    'The projector warms up, hopefully.',
    'Somebody has left a marker with the lid off. It is dead now.',
  ],
  street: [
    'A train passes somewhere above.',
    'The crossing chimes and everyone moves at once.',
    'Rain is being considered.',
  ],
  station: [
    'An announcement apologises for something.',
    'The whole platform checks the same board at the same moment.',
  ],
  market: [
    'The shop plays a song you almost know.',
    'A tannoy asks for someone by name.',
  ],
  konbini: [
    'The door chime plays its four notes.',
    'Something in the hot case shifts.',
  ],
  park: [
    'A dog is having the best day of anyone here.',
    'The pond is doing nothing, well.',
  ],
  izakaya: [
    'Somebody orders for the table.',
    'The grill flares and everyone leans back at once.',
  ],
  apartment: [
    'The fridge hums. It is a nice hum.',
    'Your neighbour is watching something with a laugh track.',
  ],
};

/* ---------- the game centre ----------
   The only place where spending money can pay you back. Costs and
   payouts are quoted as multiples of one task's pay so they stay
   meaningful at level 6 and at level 600. */

export const ARCADE_GAMES = [
  {
    id: 'punch',
    name: 'PUNCH KING',
    cost: 0.8,
    intro: 'A padded bag on a spring. A screen that shouts numbers in a language of its own.',
    win: 'The machine prints 998 and plays a fanfare. A child nearby applauds, sincerely.',
    lose: 'The machine prints 214 and says nothing at all. You look around. Nobody saw.',
    jackpot: 'The machine caps out, flashes every bulb it owns, and pays out in tokens.',
  },
  {
    id: 'rhythm',
    name: 'RHYTHM DIVISION',
    cost: 0.9,
    intro: 'Nine buttons. A song you half know. A crowd of nobody.',
    win: 'FULL COMBO on the easy chart. You take the win. A win is a win.',
    lose: 'You are graded D. The machine helpfully lists every note you missed.',
    jackpot: 'Perfect. Actually perfect. Your name goes on the board as AAA.',
  },
  {
    id: 'claw',
    name: 'THE CRANE GAME',
    cost: 0.7,
    claw: true,
    intro: 'The claw closes with all the grip strength of a wet napkin.',
    win: 'It lifts, it swings, it drops the thing directly into the chute. You are astonished.',
    lose: 'It lifts, it swings, and it drops the thing two centimetres from the chute.',
    jackpot: 'It comes up with two. Nobody is more surprised than the machine.',
  },
  {
    id: 'zombies',
    name: 'SHOOT THE UNDEAD 3',
    cost: 1,
    intro: 'A plastic pistol tethered by a coiled wire. The gun sight is two degrees off and always has been.',
    win: 'You clear stage one on a single credit. The machine calls you a HERO in orange.',
    lose: 'You die on the tutorial. It asks for another credit before your body hits the floor.',
    jackpot: 'You reach the boss. It takes eleven minutes. You are late for nothing in particular.',
  },
  {
    id: 'racer',
    name: 'MIDNIGHT TOURING',
    cost: 1.1,
    intro: 'A seated cabinet with a real gearstick and a seat that has held a thousand people.',
    win: 'Third place. The ghost car of somebody called "ASS" beat you by a length.',
    lose: 'You spin at the first corner and spend the race facing the wrong way, politely.',
    jackpot: 'Course record. The machine asks for three letters. You think about it far too long.',
  },
  {
    id: 'puzzle',
    name: 'PUZZLE BLOCKS DX',
    cost: 0.6,
    intro: 'You have played this exact machine before, in a different city, in a different decade.',
    win: 'You clear four rows at once and hear a sound you have not heard since school.',
    lose: 'You stack it badly and lose in ninety seconds. It was always going to be ninety seconds.',
    jackpot: 'You get into a state of flow and come out of it eleven minutes later, sweating.',
  },
];

export const ARCADE_FLAVOUR = [
  'The change machine is out of order. The change machine is always out of order.',
  'Somebody has left a drink balanced on a cabinet. It has been there a while.',
  'Every machine here is playing its attract loop at once, in different keys.',
  'A regular is doing something extraordinary on a fighting game and nobody is watching.',
];

/* ---------- snacks ----------
   These do nothing. That is the entire point of them: money you spend
   because you wanted to, not because it made a number go up. */

export const SNACKS = [
  { name: 'MELON BREAD', cost: 0.35, line: 'Enormous, sweet, and gone before you have finished walking away.' },
  { name: 'A SQUID SNACK', cost: 0.4, line: 'Salty and confusing. You eat the whole bag and learn nothing.' },
  { name: 'AN ICE CREAM', cost: 0.5, line: 'It is the wrong weather for this. You have made a decision and you stand by it.' },
  { name: 'A YAKITORI SKEWER', cost: 0.6, line: 'Eaten standing up, in one go, at slight personal risk.' },
  { name: 'A TAIYAKI', cost: 0.45, line: 'The custard is exclusively in the head. You knew that going in.' },
  { name: 'HOT CORN SOUP', cost: 0.3, line: 'From a can, from a machine, in the cold. Genuinely one of the great inventions.' },
  { name: 'A MYSTERY BAO', cost: 0.55, line: 'It is either pork or bean paste. You accept the risk. It is bean paste.' },
  { name: 'FRIED CHICKEN', cost: 0.7, line: 'Handed to you in a paper sleeve, too hot to hold and impossible not to.' },
  { name: 'A BAG OF CRISPS', cost: 0.3, line: 'Flavour: "consomme". You have never questioned this and you will not start now.' },
  { name: 'A CANNED COFFEE (HOT)', cost: 0.35, line: 'Not for drinking. For holding, until your hands work again.' },
];

/* ---------- level-up flavour ---------- */

export const PROMOTIONS = [
  [1, 'ASSOCIATE'],
  [10, 'SENIOR ASSOCIATE'],
  [20, 'SPECIALIST'],
  [30, 'SENIOR SPECIALIST'],
  [45, 'LEAD'],
  [60, 'PRINCIPAL'],
  [80, 'DIRECTOR'],
  [99, 'SENIOR DIRECTOR'],
  [130, 'VICE PRESIDENT'],
  [180, 'SENIOR VICE PRESIDENT'],
  [250, 'EXECUTIVE VICE PRESIDENT'],
  [340, 'CHIEF OF STAFF'],
  [450, 'DISTINGUISHED FELLOW'],
  [600, 'EMERITUS'],
  [800, 'THE LAST ONE HERE'],
  [1000, 'SEVEN TO THREE'],
];

export function titleFor(level) {
  let t = PROMOTIONS[0][1];
  for (const [lv, name] of PROMOTIONS) if (level >= lv) t = name;
  return t;
}

/** The title that unlocks exactly at this level, if any. */
export function promotionAt(level) {
  const hit = PROMOTIONS.find(([lv]) => lv === level);
  return hit ? hit[1] : null;
}
