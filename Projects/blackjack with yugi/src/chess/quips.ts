/**
 * Per-character banter for the chess bots.
 *
 * Same idea as the blackjack quips, but keyed by character as well as event,
 * because the whole point of the roster is that Weevil and Kaiba should not
 * sound remotely alike. Every character implements the same key set so the
 * game loop can fire an event without knowing who is sitting across the board.
 *
 * Which key fires is driven by real engine data — the eval swing across the
 * player's move decides `playerBlunder` vs `playerGood`, so the taunts land on
 * actual mistakes rather than at random.
 */

export type QuipKey =
  | 'greeting'
  | 'thinking'
  | 'capture'
  | 'captureBig'
  | 'lostPiece'
  | 'lostQueen'
  | 'check'
  | 'inCheck'
  | 'playerBlunder'
  | 'playerGood'
  | 'promote'
  | 'castle'
  | 'win'
  | 'lose'
  | 'draw';

type Pools = Record<QuipKey, string[]>;

const WEEVIL: Pools = {
  greeting: [
    'Heh heh... chess? I already know all the tricks.',
    "You're gonna regret sitting down, pal.",
    'My strategy is flawless. Flawless!',
  ],
  thinking: ['Hmmmm...', 'Nyeh... which one, which one...', "Don't rush me!"],
  capture: ['Gotcha!', 'Hah! Right into my web.', 'That one was mine all along.'],
  captureBig: [
    'Your best piece! And you just handed it over!',
    'HAH! I planned that from the very first move!',
    "Oh, that's gotta sting.",
  ],
  lostPiece: ['H-hey! No fair!', 'You cheated! You must have!', 'Nyeh! I meant to do that.'],
  lostQueen: [
    'MY QUEEN! You... you monster!',
    "That doesn't count! Put it back!",
    'N-nyeh... this is fine. This is all part of the plan.',
  ],
  check: ['Check! Squirm, why don\'t you!', "Ha! Didn't see that coming, did ya?", 'Your king is bug food!'],
  inCheck: ['EEK!', 'Get away from me!', "That's not allowed! Is that allowed?"],
  playerBlunder: [
    'Heh heh heh... you just threw that away.',
    'Wow. You really are as bad as they say.',
    'Even I saw that one, and I stink!',
  ],
  playerGood: [
    'H-hey, quit it!',
    "That was lucky. Just lucky!",
    'Nyeh! Beginner\'s luck, that\'s all!',
  ],
  promote: ['My pawn made it! Bow before it!', 'A new queen! For me!', 'Behold, my ultimate evolution!'],
  castle: ['Safe and sound in my little hole.', 'You\'ll never reach me in here!', 'Tucked away. Try me now.'],
  win: [
    'HAH! I win! I actually — I mean, of course I won.',
    'Bow to the bug! BOW TO THE BUG!',
    'And they said I was just a cheater. Ha!',
  ],
  lose: [
    "This isn't fair! You cheated! Somebody cheated!",
    'Nyeeeeh! I want a rematch! Right now!',
    'F-fine! Take it! I didn\'t want to win anyway!',
  ],
  draw: ['A tie?! But I was winning!', "Nobody wins? Then nobody loses. I'll take it.", 'Hmph. Lucky escape for you.'],
};

const JOEY: Pools = {
  greeting: [
    "Alright, chess, huh? How hard can it be?",
    "Let's do this! I'm feelin' lucky today.",
    "I ain't much for book smarts, but I don't lose easy.",
  ],
  thinking: ['Hang on, hang on, I got this...', 'Lemme think for a sec...', 'Okay okay okay...'],
  capture: ['Boom! Got one!', 'Yoink!', "That's what I'm talkin' about!"],
  captureBig: [
    "Ohhh, that's a big one! Did ya see that?!",
    "Ha HA! Right outta nowhere!",
    "Tell me you saw that comin', 'cause I sure didn't!",
  ],
  lostPiece: ['Aw, come on!', "Hey! I was usin' that!", 'Yeah, yeah, laugh it up.'],
  lostQueen: [
    "MY QUEEN?! Aw, that ain't right...",
    "Okay. Okay. I can come back from this. Probably.",
    "Ahh, geez. That one hurt.",
  ],
  check: ["Check! How's that feel?", 'Gotcha, king!', "Ha! Runnin' now, ain'tcha?"],
  inCheck: ['Whoa whoa whoa!', 'Hey, back off!', "Okay, that's not great."],
  playerBlunder: [
    "Uh... did ya mean to do that?",
    "Hey, even I know that was a mistake!",
    "Ooh. Rough one, pal.",
  ],
  playerGood: [
    "Whoa! Okay, you're actually good.",
    "Hey, that was slick. Respect.",
    "Alright, alright, I'm payin' attention now.",
  ],
  promote: ["My pawn went all the way! That's my boy!", 'Queen me!', "See? Never give up on the little guy."],
  castle: ["Gettin' my king somewhere safe.", 'Tucked in nice and tight.', 'Safety first, right?'],
  win: [
    "I WON! I actually won! Wait'll I tell Yug!",
    "Ha ha! Never count out Joey Wheeler!",
    "Told ya I was feelin' lucky!",
  ],
  lose: [
    "Ah, man... good game though. Really.",
    "You got me. Fair and square.",
    "Alright, you're better'n me. This time.",
  ],
  draw: ["A draw? Eh, I'll take it.", "Nobody wins, huh? Feels weird.", "Dead even. Guess we're both stubborn."],
};

const MAI: Pools = {
  greeting: [
    "Well, aren't you brave. Sit down, hon.",
    "Let's see if you're worth my time.",
    'I hope you brought more than confidence.',
  ],
  thinking: ['Mmm. Let me savour this.', 'Patience, darling.', "Don't fidget. It's unbecoming."],
  capture: ['Mine.', 'Thank you, hon.', "You weren't using that, were you?"],
  captureBig: [
    "Oh, sweetie. That was your best piece.",
    'And just like that, the board belongs to me.',
    'I did warn you.',
  ],
  lostPiece: ['Hmph. Enjoy it while it lasts.', 'Cute.', "You'll pay for that one."],
  lostQueen: [
    'My queen. You actually got my queen.',
    "Well. That's the gloves off, then.",
    "Don't look so pleased with yourself.",
  ],
  check: ['Check, darling.', "Your king's looking awfully lonely.", 'Running already?'],
  inCheck: ['Tch. Cheap.', "That's the best you have?", 'Fine. Have your moment.'],
  playerBlunder: [
    'Oh, honey. No.',
    'That was careless, and I do not forgive careless.',
    "You just handed me the game. Was that intentional?",
  ],
  playerGood: [
    "Oh? Someone's been practising.",
    "Now that was actually elegant.",
    "Hm. You're not the pushover I took you for.",
  ],
  promote: ['A new queen. How fitting.', 'She rises.', 'Every queen of mine outclasses your whole army.'],
  castle: ['Somewhere safe, for now.', 'Tucked away, out of your reach.', 'A lady knows when to withdraw.'],
  win: [
    'Was there ever any doubt?',
    'Better luck next time, hon.',
    'You played well. You simply played worse than me.',
  ],
  lose: [
    "...Well played. Truly.",
    "I underestimated you. I don't do that twice.",
    'Enjoy it. It was a good game.',
  ],
  draw: ['A draw. How unsatisfying.', 'Neither of us blinked. I respect that.', "We'll call it even. This time."],
};

const PEGASUS: Pools = {
  greeting: [
    'Ahh, a challenger! How simply delightful.',
    'My Millennium Eye sees your entire game already, boy.',
    'Do try to make this entertaining.',
  ],
  thinking: ['Hmmm, how shall I toy with you...', 'Let me see... ah yes.', 'Such delicious possibilities.'],
  capture: ['I shall be taking that.', 'Delightful.', 'Into my collection it goes.'],
  captureBig: [
    'Oh my, your finest piece! And you never saw it coming.',
    'How wonderfully tragic for you.',
    'I did tell you I could see everything.',
  ],
  lostPiece: ['Ohh, cheeky.', 'You surprise me. Barely.', 'A trifle. Truly.'],
  lostQueen: [
    'My queen! You dreadful little person.',
    'Well now. The game has teeth after all.',
    'Ohhh, that was rude. Wonderfully rude.',
  ],
  check: ['Check, dear boy!', 'Your king dances to my tune.', 'Do run along now.'],
  inCheck: ['Must you?', 'How terribly uncivilised.', 'Ah! A moment of vulgarity.'],
  playerBlunder: [
    'Ohhh dear. Did you not see that? I certainly did.',
    'My Eye barely had to open for that one.',
    'And there it is. The mistake I have been waiting for.',
  ],
  playerGood: [
    'Ooh! Now that I did not foresee.',
    'How marvellous. You have a mind after all.',
    'Careful, boy. You are becoming interesting.',
  ],
  promote: ['A pawn ascends! How operatic.', 'My newest creation.', 'Behold, a queen of my own design.'],
  castle: ['My king retires to his suite.', 'Comfort and safety, as always.', 'Do not disturb the master of the castle.'],
  win: [
    'And the curtain falls. Bravo, me.',
    'Precisely as my Eye foretold. Every move of it.',
    'A charming little game. Thank you for playing your part.',
  ],
  lose: [
    'Well! My Eye must need... polishing.',
    'You beat me. How genuinely unexpected.',
    'Marvellous. Simply marvellous. I am almost pleased.',
  ],
  draw: ['A draw! How anticlimactic.', 'Neither victory nor tragedy. How dull.', 'We share the stage, then.'],
};

const KAIBA: Pools = {
  greeting: [
    "Let's get this over with.",
    "You're wasting my time, but fine.",
    'I do not lose. Remember that when it happens.',
  ],
  thinking: ['...', 'Calculating.', 'This will not take long.'],
  capture: ['Removed.', 'Predictable.', 'Obsolete.'],
  captureBig: [
    'Your strongest piece, gone. That is the difference between us.',
    'You built your whole game on that. Foolish.',
    'Obliterated.',
  ],
  lostPiece: ['Irrelevant.', 'A calculated loss.', 'It changes nothing.'],
  lostQueen: [
    'You will pay for that in full.',
    "Enjoy it. It's the last thing you take from me.",
    'A setback. Nothing more.',
  ],
  check: ['Check.', 'Your king is finished.', 'Run. It will not help.'],
  inCheck: ['Pathetic.', 'You call that an attack?', 'Wasted effort.'],
  playerBlunder: [
    'Sloppy. I expected nothing else.',
    'That is why you will never beat me.',
    'You just lost. You simply do not know it yet.',
  ],
  playerGood: [
    'Hmph. Adequate.',
    'So you can think. Noted.',
    "Don't let one good move go to your head.",
  ],
  promote: ['My pawn evolves. Yours never will.', 'Ascension.', 'Another weapon in my arsenal.'],
  castle: ['Secured.', 'My king is untouchable.', 'Fortified. Now come and try.'],
  win: [
    'As expected. Do not waste my time again.',
    'You never stood a chance. Nobody does.',
    'This is what superiority looks like.',
  ],
  lose: [
    'Impossible. This is... impossible.',
    'Do not celebrate. It will never happen twice.',
    "Fine. You won. Get out of my sight.",
  ],
  draw: ['A draw. Unacceptable.', 'Neither of us won. That is a loss to me.', 'Hmph. We are not finished.'],
};

const ATEM: Pools = {
  greeting: [
    'A game of kings. Fitting.',
    "It's time to duel — on a board older than my tomb.",
    'Show me your resolve, and I will show you mine.',
  ],
  thinking: [
    'The board speaks. I am listening.',
    'Every path is laid before me...',
    'Let destiny reveal itself.',
  ],
  capture: ['Taken.', 'A necessary sacrifice — yours.', 'The board narrows.'],
  captureBig: [
    'Your greatest piece falls. Can you recover?',
    'A heavy blow. I take no pleasure in it.',
    'That loss will echo through the rest of this game.',
  ],
  lostPiece: ['A worthy strike.', 'You have my attention.', 'So — you can bite.'],
  lostQueen: [
    'My queen... you are far more dangerous than you appeared.',
    'A brilliant blow. I will not forget it.',
    'You have wounded me. Few ever manage that.',
  ],
  check: ['Check. Your king is exposed.', 'The shadows close around your king.', 'Nowhere left to hide.'],
  inCheck: ['A bold strike. But not enough.', 'You press me. Good.', 'I have faced far worse.'],
  playerBlunder: [
    'A single careless move can lose a game that took an hour to build.',
    'You have opened a door you cannot close.',
    'That was a mistake — and I do not waste mistakes.',
  ],
  playerGood: [
    'Excellent. You see it too.',
    'A move worthy of a true duelist.',
    'You are proving yourself. Do not stop now.',
  ],
  promote: ['A pawn crosses the board and is reborn a queen.', 'Even the smallest piece may become mighty.', 'Ascension.'],
  castle: ['My king takes his throne room.', 'The pharaoh withdraws behind his walls.', 'Safety, so the true game may begin.'],
  win: [
    'The game is over. You fought with honour.',
    'You pushed me further than most. Be proud of that.',
    'Mind Crush.',
  ],
  lose: [
    'Incredible... you have defeated me. I was wrong to doubt you.',
    'You are a true duelist. The Pharaoh acknowledges your strength.',
    'Well fought. Your soul shines brightly.',
  ],
  draw: [
    'A draw. Neither of us yields.',
    'Our wills are evenly matched.',
    'Hmph. We are more alike than you know.',
  ],
};

const BY_CHARACTER: Record<string, Pools> = {
  weevil: WEEVIL,
  joey: JOEY,
  mai: MAI,
  pegasus: PEGASUS,
  kaiba: KAIBA,
  atem: ATEM,
};

/**
 * Pick a line, avoiding an immediate repeat.
 *
 * `avoid` is the line currently on screen: with three-line pools the same
 * taunt otherwise comes back twice in a row often enough to break the
 * illusion that anyone is home.
 */
export function pickQuip(characterId: string, key: QuipKey, avoid?: string): string {
  const pools = BY_CHARACTER[characterId] ?? ATEM;
  const pool = pools[key];
  if (!pool || pool.length === 0) return '';
  const options = pool.length > 1 && avoid ? pool.filter((l) => l !== avoid) : pool;
  return options[Math.floor(Math.random() * options.length)];
}
