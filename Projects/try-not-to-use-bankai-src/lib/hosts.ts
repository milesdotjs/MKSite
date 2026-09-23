// The three interrogators. Everything host-specific lives here: sprites,
// stage, meter labels, the rival who steals the win, and every line of
// dialogue. Rule for all of them: the host never names the finisher.
// The threat stays oblique; the cutscene is the punchline.

import type { Series } from "./questions";

export type HostId = "byakuya" | "pain" | "piccolo";
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
  rival: string;
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

export const HOSTS: Record<HostId, HostDef> = { byakuya, pain, piccolo };
export const HOST_ORDER: HostId[] = ["byakuya", "pain", "piccolo"];
export const isHostId = (v: unknown): v is HostId => typeof v === "string" && v in HOSTS;
