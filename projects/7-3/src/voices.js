/* ============================================================
   7-3 — voices

   The anonymous people you meet are strangers, so each one gets a
   dialect when the area is generated. The narration in
   interactions.js stays in the game's own flat register; the voice
   only supplies the spoken line above it.

   Lines are hand-written per dialect rather than produced by
   running plain English through substitutions. That route reliably
   produces something that reads as mockery rather than a
   character. The named cast in content.js keep their own written
   voices and are never given one of these.

   Prose is unbroken; ui.js wraps it.
   ============================================================ */

const V = (id, label, weight, lines) => ({ id, label, weight, lines });

export const VOICES = [
  // No quote at all — much the commonest case, so an accent stays a
  // surprise rather than a gimmick that fires on every conversation.
  V('plain', null, 34, []),

  V('neutral', 'plain english', 10, [
    'Morning. Long one already.',
    'You get used to it. Mostly.',
    'Third coffee. Not proud.',
    'Is it Thursday? It feels like Thursday.',
    'Nearly the weekend. It is Tuesday, but nearly.',
  ]),

  V('texas', 'texan', 7, [
    'Well now, y’all look like you been rode hard and put up wet.',
    'I tell you what — this here buildin’ is colder than a well digger’s belt buckle.',
    'Bless your heart. You keep at it.',
    'Back home we’d have had this done ’fore breakfast and gone fishin’.',
    'That there meetin’ was longer than a month of Sundays.',
    'Y’all take care now. And I mean that, I ain’t just sayin’ it.',
  ]),

  V('british', 'british', 7, [
    'Sorry — sorry, no, after you. Sorry.',
    'It’s not ideal, is it. Not the end of the world. Not ideal.',
    'I won’t keep you. I will keep you, but I’ll say I won’t.',
    'Bit of a nightmare, that. Anyway.',
    'Right. Well. Yes. Best crack on.',
    'To be fair, it could be worse. I don’t know how, but it could.',
  ]),

  V('australian', 'australian', 6, [
    'Yeah nah, she’ll be right, mate.',
    'Reckon that’s a you-problem for future-you, eh.',
    'Flat out like a lizard drinkin’, this week.',
    'No dramas. Chuck it on the pile with the rest of ’em.',
    'Nah yeah, it’s good. Nah yeah.',
    'Onya. Go get a coffee, you’ve earned it.',
  ]),

  V('anime', 'isekai protagonist', 6, [
    'So... I was hit by a truck, and now I am here. In... "Accounts"?',
    'This "spreadsheet" — is it a grimoire? Does it grant power?',
    'I have trained my whole life for battle. Nothing prepared me for the photocopier.',
    'Wait. WAIT. If I master the expense report... will I finally become strong?!',
    'They said I would be summoned to another world. They did not mention the quarterly review.',
    'My true power awakens at 5:30 PM. Until then I am merely an intern.',
    'Do not underestimate me. I have read the entire employee handbook.',
    'Is the one by the window the final boss? She said good morning to me. I am shaken.',
  ]),

  V('scottish', 'scottish', 5, [
    'Aye, it’s a shambles, but it’s our shambles.',
    'Away and boil yer heid. Nicely, like. I mean it nicely.',
    'Ach, it’ll do. It’ll have to.',
    'That’s pure baltic in here, so it is.',
    'Yer no wrong, but yer no right either.',
  ]),

  V('newyork', 'new york', 5, [
    'Fuhgeddaboudit. It’s handled. Probably.',
    'What do you want from me, huh? I got fourteen of these.',
    'I’m walkin’ here. In the corridor. But still. I’m walkin’.',
    'Ay, you want the good printer? Third floor. Don’t tell nobody.',
    'This coffee? This ain’t coffee. I grew up on coffee.',
  ]),

  V('valley', 'californian', 5, [
    'Okay so like, literally nobody read the doc? Cool. Cool cool cool.',
    'I’m just gonna say it once and then never say it again.',
    'Honestly? Slay. Wrong, but slay.',
    'It’s giving Q3. And not in a good way.',
    'No because I actually love that for you.',
  ]),

  V('surfer', 'surfer', 4, [
    'Whoa. Heavy. Anyway, bro.',
    'Dude, the wifi in here is like... spiritually broken.',
    'Just gotta ride the wave, man. The wave is admin, but still.',
    'Righteous. Or, y’know. Fine.',
  ]),

  V('noir', 'hardboiled', 5, [
    'It was 2 PM. The kind of 2 PM that gets in your bones.',
    'She walked in with a request. They always walk in with a request.',
    'I’ve seen a lot of spreadsheets in this town. None of them ended well.',
    'Somewhere a printer was jamming. Somewhere a printer is always jamming.',
    'I had a bad feeling. Turned out to be the sandwich.',
  ]),

  V('shakespeare', 'elizabethan', 4, [
    'Alack, the inbox swelleth once again, and no man stems the tide.',
    'What light through yonder window breaks? None. It does not open.',
    'Friends, colleagues, countrymen — lend me a charger.',
    'Thus doth the quarter end, not with a bang, but a summary.',
    'To reply, or not to reply. ’Tis a question, though not a good one.',
  ]),

  V('corporate', 'pure jargon', 6, [
    'Let’s socialise the deck offline and circle back with a POV.',
    'I want to double-click on that, but at a higher altitude.',
    'Directionally we’re aligned. Operationally we are not.',
    'Can we take this to a breakout and land the plane?',
    'Low-hanging fruit first, then we boil the ocean.',
    'I’m going to park that, put a pin in it, and come back to it. I will not come back to it.',
  ]),

  V('pirate', 'pirate', 3, [
    'Arr, the grog machine be broken again, an’ row C be empty.',
    'Ye’ll be wantin’ the good stapler. It be on the fourth floor. Guard it with yer life.',
    'I’ve sailed the seven shared drives, an’ none be worse than this one.',
    'Mutiny? Nay. But the biscuits in the break room be an outrage.',
  ]),

  V('canadian', 'canadian', 4, [
    'Sorry — no, sorry, that was my fault. Sorry.',
    'Beauty. That’s a beauty of a spreadsheet, bud.',
    'Gonna be honest with ya there, that’s a bit of a gong show.',
    'Take ’er easy, eh.',
  ]),

  V('french', 'french', 4, [
    'Pff. This deadline. It is not serious.',
    'Bof. It is fine. It is not good, but it is fine.',
    'In my country we take two hours for lunch. Here you take a sandwich. At the desk. Like an animal.',
    'Voila. Done. Do not ask me how.',
  ]),

  V('robot', 'monotone sysadmin', 4, [
    'Ticket received. Ticket closed. Ticket reopened.',
    'Working as intended. The intent was poor.',
    'Have you tried turning it off. Have you tried turning yourself off. I am joking. Partially.',
    'Access denied. Access granted. Access denied again. Enjoy.',
    'I have been here since the merger. I do not know which merger.',
  ]),
];

export const VOICE_BY_ID = Object.fromEntries(VOICES.map((v) => [v.id, v]));

/** Pick a dialect for a stranger. Seeded, so an area stays stable. */
export function pickVoice(rng) {
  return rng.weighted(VOICES.map((v) => ({ id: v.id, weight: v.weight }))).id;
}

/**
 * A quoted line for this voice, or null for the plain register.
 * Pass `n` to select deterministically, so a given stranger says
 * the same thing every time you talk to them.
 */
export function voiceLine(voiceId, rng, n = null) {
  const v = VOICE_BY_ID[voiceId];
  if (!v || !v.lines.length) return null;
  const line = n === null ? rng.pick(v.lines) : v.lines[n % v.lines.length];
  return `"${line}"`;
}

export const VOICE_COUNT = VOICES.length;
