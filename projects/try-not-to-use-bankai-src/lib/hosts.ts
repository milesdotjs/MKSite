// The interrogators. Everything host-specific lives here: sprites, stage,
// meter labels, the rival who steals the win, and every line of dialogue.
// Rule for all of them: the host never names the finisher. The threat stays
// oblique; the cutscene is the punchline.

import type { Series } from "./questions";

export type HostId = "byakuya" | "pain" | "piccolo" | "mustang" | "pikachu";
export type AnimKey = "idle" | "idle2" | "ack" | "strike";
export interface AnimDef { seq: string; fps: number; loop: boolean; then?: AnimKey }

export interface HostLines {
  intro: string[];
  askPrefix: (index: number, strikes: number) => string;
  correct: (index: number, strikes: number, fast: boolean) => string;
  wrong: (answer: string, strikesAfter: number, timedOut: boolean) => string[];
  win: string[];
  rivalShout: string;
  afterRival: string;
}

export interface HostDef {
  id: HostId;
  name: string;
  series: Series;
  seriesLabel: string;
  wordmark: string;      // second line of the title logo
  wordmarkSize: number;  // in --u units, landscape
  rule: string;          // title-screen rule line
  meterLabel: string;
  dangerLabel: string;
  finisher: string;      // shown on the lose screen and in the cutscene
  stage: string;         // public path
  face: string;          // sprite sequence for the HUD portrait
  cutin: string;         // sprite sequence for the cutscene cut-in art
  anims: Partial<Record<AnimKey, AnimDef>> & { idle: AnimDef; ack: AnimDef; strike: AnimDef };
  /** extra sprite scale for small sprites (Pikachu) */
  scaleMul?: number;
  /** when true, a run draws only from the host's own series */
  solo?: boolean;
  /** dust streaks blow across the stage while the host stands there */
  windy?: boolean;
  rival: string;
  rivalScaleMul?: number;
  lose: { head: string; sub: string };
  winSub: string;
  ranks: (score: number, strikes: number) => { title: string; blurb: string };
  lines: HostLines;
}

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const ORD = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];

// ---------------------------------------------------------------- Byakuya
const byakuya: HostDef = {
  id: "byakuya",
  name: "BYAKUYA",
  series: "bleach",
  seriesLabel: "BLEACH",
  wordmark: "BANKAI",
  wordmarkSize: 13,
  rule: "TWO MISTAKES. DO NOT TEST HIS PATIENCE.",
  meterLabel: "SPIRITUAL PRESSURE",
  dangerLabel: "BANKAI",
  finisher: "BANKAI",
  stage: "bg/central.png",
  face: "face",
  cutin: "cutin_sword",
  anims: {
    idle:   { seq: "byk_idle",  fps: 7,  loop: true },
    ack:    { seq: "byk_hmph",  fps: 8,  loop: false, then: "idle" },
    strike: { seq: "byk_raise", fps: 12, loop: false },            // holds the sword up
  },
  rival: "ICHIGO",
  lose: { head: "BANKAI WAS USED.", sub: "You tested his patience." },
  winSub: "Bankai was not used. This has never happened before.",
  ranks: (score, strikes) => {
    if (strikes === 0 && score >= 4000) return { title: "CAPTAIN CLASS", blurb: "Byakuya said nothing. That is the highest praise he has." };
    if (strikes === 0) return { title: "LIEUTENANT", blurb: "Flawless, if a little slow. Renji would be proud." };
    if (score >= 2800) return { title: "SEATED OFFICER", blurb: "One slip. He noticed. He will always have noticed." };
    return { title: "UNSEATED", blurb: "You survived. Barely. Do not bring it up around him." };
  },
  lines: {
    intro: [
      "You will answer ten questions.",
      "One mistake, I will tolerate. A second, I will not.",
      "...Do not test my patience.",
    ],
    askPrefix: (i, strikes) => {
      if (i === 0) return "Question one.";
      if (i === 9) return "The final question.";
      if (strikes > 0) return pick(["Carefully.", "Again.", "Do not miss.", `Question ${ORD[i]}.`, ""]);
      return pick([`Question ${ORD[i]}.`, "Next.", "Continue.", "", "", "Answer."]);
    },
    correct: (i, strikes, fast) => {
      if (i === 9) return "...That is all ten.";
      if (strikes > 0) return pick(["Correct. My patience holds.", "...Good. Do not make me regret my restraint.", "Correct. Continue. Carefully."]);
      if (fast) return pick(["Correct. Quick.", "...Adequate.", "Correct. Do not become comfortable."]);
      return pick(["Correct.", "Hmph.", "...Continue.", "That was not difficult.", "I expected as much.", "Acceptable."]);
    },
    wrong: (answer, strikesAfter, timedOut) => {
      const first = timedOut ? "You did not answer. Silence is also incorrect." : "Wrong.";
      const reveal = `The answer was ${answer}.`;
      if (strikesAfter >= 2) return [first, reveal, "...I told you not to test my patience.", "...So be it."];
      return [first, reveal, pick([
        "That is one. I will not tolerate a second.",
        "...I said not to test my patience. You are testing it.",
        "One mistake. It is the only one I will permit.",
      ])];
    },
    win: ["...That is all ten.", "You have passed. Go, before I reconsider."],
    rivalShout: "I WON!",
    afterRival: "...You were not even here.",
  },
};

// ---------------------------------------------------------------- Pain
const pain: HostDef = {
  id: "pain",
  name: "PAIN",
  series: "naruto",
  seriesLabel: "NARUTO",
  wordmark: "ALMIGHTY PUSH",
  wordmarkSize: 7.2,
  rule: "TWO MISTAKES. THEN YOU WILL KNOW PAIN.",
  meterLabel: "CHAKRA",
  dangerLabel: "RINNEGAN",
  finisher: "ALMIGHTY PUSH",
  stage: "bg/rocky.png",
  face: "pain_face",
  cutin: "pain_group",
  anims: {
    idle:   { seq: "pain_idle", fps: 5,  loop: true },             // standing, cloak swaying in the wind
    ack:    { seq: "pain_ack",  fps: 6,  loop: false, then: "idle" },
    strike: { seq: "pain_palm", fps: 10, loop: false },            // holds the open palm
  },
  windy: true,
  rival: "NARUTO",
  lose: { head: "ALMIGHTY PUSH WAS USED.", sub: "Now you know pain." },
  winSub: "Almighty Push was not used. The village is still there.",
  ranks: (score, strikes) => {
    if (strikes === 0 && score >= 4000) return { title: "HOKAGE", blurb: "Pain said nothing else. He had no lesson left to teach." };
    if (strikes === 0) return { title: "JONIN", blurb: "Flawless. Slow, but the village is still standing." };
    if (score >= 2800) return { title: "CHUNIN", blurb: "One mistake. He let it teach you. That was mercy." };
    return { title: "GENIN", blurb: "You survived. Everyone else in the village is asking how." };
  },
  lines: {
    intro: [
      "Ten questions.",
      "Fail once, and you will learn something. Fail twice, and you will know pain.",
      "...This village learned it the same way.",
    ],
    askPrefix: (i, strikes) => {
      if (i === 0) return "Question one.";
      if (i === 9) return "The last question.";
      if (strikes > 0) return pick(["Carefully.", "Again.", "...Speak.", `Question ${ORD[i]}.`]);
      return pick([`Question ${ORD[i]}.`, "Next.", "Answer.", "", "", "...Speak."]);
    },
    correct: (i, strikes, fast) => {
      if (i === 9) return "...That is all ten.";
      if (strikes > 0) return pick(["Correct. Remember what one mistake felt like.", "...Good. You are beginning to understand.", "Correct. Pain is a good teacher."]);
      if (fast) return pick(["Correct. Quick, for a child.", "...Yes.", "Correct. Do not mistake speed for understanding."]);
      return pick(["Correct.", "...Yes.", "That is what someone who understands would say.", "Correct. Understanding is the first step.", "Acceptable.", "...Continue."]);
    },
    wrong: (answer, strikesAfter, timedOut) => {
      const first = timedOut ? "You did not answer. Silence teaches nothing." : "Wrong.";
      const reveal = `The answer was ${answer}.`;
      if (strikesAfter >= 2) return [first, reveal, "...Then there is only one way left to teach you.", "...Know pain."];
      return [first, reveal, pick([
        "That was the first. Feel it. That feeling is pain.",
        "...One. Do not make me teach the second lesson.",
        "You do not understand yet. One more, and you will.",
      ])];
    },
    win: ["...That is all ten.", "You understand. ...Perhaps there is such a thing as peace."],
    rivalShout: "I WIN! BELIEVE IT!",
    afterRival: "...You did not answer a single question.",
  },
};

// ---------------------------------------------------------------- Piccolo
const piccolo: HostDef = {
  id: "piccolo",
  name: "PICCOLO",
  series: "dragonball",
  seriesLabel: "DRAGON BALL",
  wordmark: "SPECIAL BEAM CANNON",
  wordmarkSize: 6.4,
  rule: "TWO MISTAKES. DO NOT INTERRUPT THE AURA FARMING.",
  meterLabel: "AURA",
  dangerLabel: "CHARGING",
  finisher: "SPECIAL BEAM CANNON",
  stage: "bg/canyon.png",
  face: "pic_portrait",
  cutin: "pic_face",
  anims: {
    idle:   { seq: "pic_cape",    fps: 7, loop: true },               // arms crossed, cape billowing (aura farming)
    idle2:  { seq: "pic_idle",    fps: 6, loop: true },               // cape off
    ack:    { seq: "pic_aura",    fps: 9, loop: false, then: "idle" },
    strike: { seq: "pic_capeoff", fps: 8, loop: false, then: "idle2" },
  },
  windy: true,
  rival: "GOKU",
  lose: { head: "SPECIAL BEAM CANNON WAS USED.", sub: "He was farming aura. You interrupted." },
  winSub: "The cape stayed on. Aura: preserved.",
  ranks: (score, strikes) => {
    if (strikes === 0 && score >= 4000) return { title: "INFINITE AURA", blurb: "He uncrossed his arms. Once. Nobody saw it, but he did." };
    if (strikes === 0) return { title: "AURA FARMER", blurb: "Flawless. Stand next to him in silence. You have earned it." };
    if (score >= 2800) return { title: "AURA: RECOVERING", blurb: "One slip. The cape came off. It will go back on. Eventually." };
    return { title: "AURA DEBT", blurb: "You survived. Your aura did not." };
  },
  lines: {
    intro: [
      "Ten questions.",
      "I have been standing here with my arms crossed for three hours. Do not waste that.",
      "...Every wrong answer costs you aura. Do not test me.",
    ],
    askPrefix: (i, strikes) => {
      if (i === 0) return "Question one.";
      if (i === 9) return "Last one. Do not embarrass yourself.";
      if (strikes > 0) return pick(["Carefully.", "Again.", "...", "Focus."]);
      return pick(["Next.", "", "", "Answer.", `Question ${ORD[i]}.`, "...Hm."]);
    },
    correct: (i, strikes, fast) => {
      if (i === 9) return "...That is all ten.";
      if (strikes > 0) return pick(["Correct. Your aura is recovering.", "...Good. Keep it that way.", "Correct. Gohan would have gotten it faster, but fine."]);
      if (fast) return pick(["Fast. Your aura is climbing.", "Correct. Quick. I will not smile about it.", "Correct. +500 aura."]);
      return pick(["Correct. +100 aura.", "...Hmph. Adequate aura.", "Correct. Gohan got that one at four years old.", "Correct. I felt that from here.", "Acceptable.", "...Continue."]);
    },
    wrong: (answer, strikesAfter, timedOut) => {
      const first = timedOut ? "You did not answer. Silence is not aura. Silence is nothing." : "Wrong.";
      const reveal = `The answer was ${answer}.`;
      if (strikesAfter >= 2) return [first, reveal, "...Your aura is gone.", "...I only need five seconds."];
      return [first, reveal, pick([
        "-10,000 aura. ...The cape comes off. That is not a good sign for you.",
        "One. The cape comes off. Do not make me take off anything else.",
        "...That cost you everything you farmed. The cape is coming off.",
      ])];
    },
    win: ["...That is all ten.", "Your aura is... acceptable. Now leave. I have to stand here."],
    rivalShout: "HEH! I WIN!",
    afterRival: "...Goku. You were not here. You were eating.",
  },
};

// ---------------------------------------------------------------- Mustang
const mustang: HostDef = {
  id: "mustang",
  name: "MUSTANG",
  series: "fma",
  seriesLabel: "FULLMETAL ALCHEMIST",
  wordmark: "FLAME ALCHEMY",
  wordmarkSize: 7.2,
  rule: "TWO MISTAKES. IT IS NOT RAINING TODAY.",
  meterLabel: "IGNITION",
  dangerLabel: "DRY",
  finisher: "FLAME ALCHEMY",
  stage: "bg/central_hq.png",
  face: "mus_face",
  cutin: "mus_eyes",
  anims: {
    idle:   { seq: "mus_idle",   fps: 6,  loop: true },
    ack:    { seq: "mus_ack",    fps: 8,  loop: false, then: "idle" },
    strike: { seq: "mus_gloves", fps: 6,  loop: false },            // holds the hand up, glove on
  },
  rival: "EDWARD",
  rivalScaleMul: 1.15,
  lose: { head: "FLAME ALCHEMY WAS USED.", sub: "It was not raining." },
  winSub: "Nobody snapped. Havoc owes the Colonel a dinner.",
  ranks: (score, strikes) => {
    if (strikes === 0 && score >= 4000) return { title: "STATE ALCHEMIST", blurb: "The Colonel said nothing. He is already drafting your promotion." };
    if (strikes === 0) return { title: "MAJOR", blurb: "Flawless, if slow. Hawkeye noted the time." };
    if (score >= 2800) return { title: "SECOND LIEUTENANT", blurb: "One mistake. He checked the sky. It stayed clear." };
    return { title: "PRIVATE", blurb: "You survived. The gloves are back in the drawer. For now." };
  },
  lines: {
    intro: [
      "Ten questions.",
      "One mistake, I can overlook. Two... let's just say it isn't raining today.",
      "...Don't make me put my gloves on.",
    ],
    askPrefix: (i, strikes) => {
      if (i === 0) return "Question one.";
      if (i === 9) return "Last question.";
      if (strikes > 0) return pick(["Carefully.", "Again.", "Think.", `Question ${ORD[i]}.`]);
      return pick([`Question ${ORD[i]}.`, "Next.", "", "", "Go on.", "Answer."]);
    },
    correct: (i, strikes, fast) => {
      if (i === 9) return "...That's ten.";
      if (strikes > 0) return pick(["Correct. The gloves stay on, but the hand stays down.", "...Good. Still clear out.", "Correct. Don't make me raise it."]);
      if (fast) return pick(["Quick. Good. Fullmetal would have argued about it first.", "Correct. Lieutenant, note the time.", "Correct. That was fast for a civilian."]);
      return pick(["Correct.", "Hm.", "Correct. Next.", "Not bad.", "...Acceptable.", "Correct. I've had worse subordinates."]);
    },
    wrong: (answer, strikesAfter, timedOut) => {
      const first = timedOut ? "Nothing? Silence counts as wrong. Ask Havoc." : "Wrong.";
      const reveal = `The answer was ${answer}.`;
      if (strikesAfter >= 2) return [first, reveal, "...I did warn you it wasn't raining.", "...Nothing personal."];
      return [first, reveal, pick([
        "That's one. ...The gloves are going on. Consider that a courtesy.",
        "One. I'm checking the weather. It is clear.",
        "...One. My hand is raised. It is not a wave.",
      ])];
    },
    win: ["...That's ten.", "Passed. Get out of my office before the weather changes."],
    rivalShout: "I WON! AND I'M NOT SHORT!",
    afterRival: "...Fullmetal. You weren't here. And you are short.",
  },
};

// ---------------------------------------------------------------- Pikachu
// Pokemon-speak first, the deadpan translation in brackets.
const pikachu: HostDef = {
  id: "pikachu",
  name: "PIKACHU",
  series: "pokemon",
  seriesLabel: "POKEMON",
  wordmark: "THUNDERBOLT",
  wordmarkSize: 8.4,
  rule: "TWO MISTAKES. DO NOT MAKE THE CHEEKS SPARK.",
  meterLabel: "STATIC",
  dangerLabel: "PIKA",
  finisher: "THUNDERBOLT",
  stage: "bg/meadow.png",
  face: "pika_face",
  cutin: "pika_idle",
  anims: {
    idle:   { seq: "pika_idle", fps: 12, loop: true },
    ack:    { seq: "pika_idle", fps: 18, loop: false, then: "idle" },
    strike: { seq: "pika_idle", fps: 14, loop: true },             // the sparks are drawn on top
  },
  scaleMul: 1.7,
  solo: true,
  rival: "ASH",
  rivalScaleMul: 1.55,
  lose: { head: "THUNDERBOLT WAS USED.", sub: "You blacked out." },
  winSub: "Thunderbolt was not used. Pikachu is still on your shoulder.",
  ranks: (score, strikes) => {
    if (strikes === 0 && score >= 4000) return { title: "POKEMON MASTER", blurb: "Pikachu said 'pika'. Twice. That has never happened." };
    if (strikes === 0) return { title: "GYM LEADER", blurb: "Flawless, if slow. Pikachu had time to finish a ketchup packet." };
    if (score >= 2800) return { title: "TRAINER", blurb: "One mistake. The cheeks sparked. You will remember the cheeks." };
    return { title: "YOUNGSTER JOEY", blurb: "You survived. Your Rattata is in the top percentage of Rattata." };
  },
  lines: {
    intro: [
      "Pika pika. (Ten questions.)",
      "Pi-ka. Pika pika chu. (One mistake is fine. Two is not.)",
      "...Pika. (Do not make the cheeks spark.)",
    ],
    askPrefix: (i, strikes) => {
      if (i === 0) return "Pika! (Question one.)";
      if (i === 9) return "Pi-ka. (Last one.)";
      if (strikes > 0) return pick(["Pika. (Carefully.)", "...Pika. (Again.)", "Chu. (Focus.)", `Pika. (Question ${ORD[i]}.)`]);
      return pick([`Pika. (Question ${ORD[i]}.)`, "Pika! (Next.)", "Chu. (Next.)", "Pika pika. (Answer.)", "Pi. (Go.)"]);
    },
    correct: (i, strikes, fast) => {
      if (i === 9) return "Pika pika. (That is all ten.)";
      if (strikes > 0) return pick(["Pika. (Correct. The cheeks are calming down.)", "...Chu. (Good. Keep it that way.)", "Pika pika. (Correct. Do not make me spark again.)"]);
      if (fast) return pick(["Pika pika! (Quick. Good.)", "Chu! (Correct. Fast. Ketchup for you.)", "Pika! (Correct. Do not get comfortable.)"]);
      return pick(["Pika! (Correct.)", "Pi-kachu. (Adequate.)", "Chaaa. (Correct. Next.)", "Pika. (Correct. Even Ash knew that one.)", "Pika pika. (Acceptable.)", "Chu. (Continue.)"]);
    },
    wrong: (answer, strikesAfter, timedOut) => {
      const first = timedOut ? "...Pika? (You said nothing. Silence is also wrong.)" : "Pika. (Wrong.)";
      const reveal = `Pi-ka. (The answer was ${answer}.)`;
      if (strikesAfter >= 2) return [first, reveal, "...Pikaaa. (I told you not to make the cheeks spark.)", "...Pi. (So be it.)"];
      return [first, reveal, pick([
        "...Pika. (That is one. The cheeks are sparking. That is not a good sign for you.)",
        "Pika pika. (One. Feel that static? That is your fault.)",
        "...Chu. (One. Do not make me do the thing I did to the bike.)",
      ])];
    },
    win: ["Pika pika. (That is all ten.)", "Chu. (You passed. The ketchup is on you.)"],
    rivalShout: "WE WON, PIKACHU!",
    afterRival: "...Pika. (You were not here. You overslept. Again.)",
  },
};

export const HOSTS: Record<HostId, HostDef> = { byakuya, pain, piccolo, mustang, pikachu };
export const HOST_ORDER: HostId[] = ["byakuya", "pain", "piccolo", "mustang", "pikachu"];
export const isHostId = (v: unknown): v is HostId => typeof v === "string" && v in HOSTS;
