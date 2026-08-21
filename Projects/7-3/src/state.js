/* ============================================================
   7-3 — player state, the clock, and saving

   Design rule for this whole file: nothing subtracts permanently.
   HP can hit zero, which costs you the rest of an afternoon and
   nothing else. Money can hit zero, which costs you a snack.
   Experience only ever goes up.
   ============================================================ */

import { levelFor, xpForLevel, xpToNext, levelProgress, MAX_LEVEL } from './xp.js';
import { titleFor } from './content.js';

export const DAY_START = 7 * 60; // 07:00
export const DAY_END = 23 * 60 + 30; // 23:30, then sleep
export const OVERTIME_AT = 17 * 60; // 17:00
export const LUNCH_AT = 12 * 60 + 30;

const SAVE_KEY = 'seven-three.save.v1';

/* ---------- derived stats ---------- */

export const maxHpFor = (L) => 30 + Math.round(L * 3.2);
export const maxFocusFor = (L) => 20 + Math.round(L * 1.1);
export const atkFor = (L) => 8 + Math.round(L * 1.6);
export const defFor = (L) => 5 + Math.round(L * 1.1);
export const payFor = (L) => Math.round(30 + L * 6);

export function newSave(seed) {
  return {
    v: 1,
    seed: seed >>> 0,
    xp: 0,
    money: 400,
    day: 1,
    time: DAY_START,
    hp: maxHpFor(1),
    focus: maxFocusFor(1),
    joy: 60,
    items: { coffee: 2, sandwich: 1 },
    // where the player is standing; resolved against the world graph
    at: { areaId: null, x: 0, y: 0, facing: 'down' },
    met: [],
    totals: {
      tasks: 0,
      days: 0,
      earned: 0,
      spent: 0,
      steps: 0,
      clockedOut: 0,
      drinks: 0,
      levelUps: 0,
    },
    settings: { music: true, sound: true, auto: false, speed: 1 },
  };
}

export class Player {
  constructor(save) {
    this.s = save;
    this.buffs = {};
  }

  /* ----- level and progression ----- */
  get level() {
    return levelFor(this.s.xp);
  }
  get xp() {
    return this.s.xp;
  }
  get title() {
    return titleFor(this.level);
  }
  get xpToNext() {
    return xpToNext(this.s.xp);
  }
  get xpProgress() {
    return levelProgress(this.s.xp);
  }
  get atMaxLevel() {
    return this.level >= MAX_LEVEL;
  }

  get maxHp() {
    return maxHpFor(this.level);
  }
  get maxFocus() {
    return maxFocusFor(this.level);
  }
  get atk() {
    return Math.round(atkFor(this.level) * (this.buffs.atk || 1));
  }
  get def() {
    return defFor(this.level);
  }

  get hp() {
    return Math.min(this.s.hp, this.maxHp);
  }
  set hp(v) {
    this.s.hp = Math.max(0, Math.min(this.maxHp, Math.round(v)));
  }
  get focus() {
    return Math.min(this.s.focus, this.maxFocus);
  }
  set focus(v) {
    this.s.focus = Math.max(0, Math.min(this.maxFocus, Math.round(v)));
  }

  get money() {
    return this.s.money;
  }
  get joy() {
    return this.s.joy;
  }

  /**
   * Joy is the only stat that reflects living well. It never blocks
   * anything — it just quietly multiplies experience, up to 1.5x.
   */
  get joyMult() {
    return 1 + this.s.joy / 200;
  }

  addJoy(n) {
    this.s.joy = Math.max(0, Math.min(100, this.s.joy + n));
  }

  /** Returns the levels gained, so the caller can celebrate. */
  gainXp(amount) {
    if (this.atMaxLevel) return [];
    const before = this.level;
    this.s.xp = Math.min(xpForLevel(MAX_LEVEL), this.s.xp + Math.max(0, Math.round(amount)));
    const after = this.level;
    const gained = [];
    for (let L = before + 1; L <= after; L++) gained.push(L);
    if (gained.length) {
      this.s.totals.levelUps += gained.length;
      // a level-up tops you back up, the way a good night does
      this.s.hp = this.maxHp;
      this.s.focus = this.maxFocus;
    }
    return gained;
  }

  earn(n) {
    const v = Math.max(0, Math.round(n));
    this.s.money += v;
    this.s.totals.earned += v;
    return v;
  }

  /** Spending is clamped at zero; you are never in debt. */
  spend(n) {
    const v = Math.min(this.s.money, Math.max(0, Math.round(n)));
    this.s.money -= v;
    this.s.totals.spent += v;
    return v;
  }

  canAfford(n) {
    return this.s.money >= n;
  }

  /* ----- items ----- */
  itemCount(id) {
    return this.s.items[id] || 0;
  }
  addItem(id, n = 1) {
    this.s.items[id] = (this.s.items[id] || 0) + n;
  }
  useItem(id) {
    if (!this.s.items[id]) return false;
    this.s.items[id]--;
    if (this.s.items[id] <= 0) delete this.s.items[id];
    return true;
  }
  get itemList() {
    return Object.entries(this.s.items).filter(([, n]) => n > 0);
  }

  /* ----- the clock ----- */
  get time() {
    return this.s.time;
  }
  get day() {
    return this.s.day;
  }
  get overtime() {
    return this.s.time >= OVERTIME_AT;
  }

  clockString() {
    const t = this.s.time % 1440;
    const h = Math.floor(t / 60);
    const m = t % 60;
    const ampm = h < 12 ? 'AM' : 'PM';
    const hh = h % 12 === 0 ? 12 : h % 12;
    return `${hh}:${String(m).padStart(2, '0')}${ampm}`;
  }

  /** Advance the clock. Returns true if the day rolled over. */
  advance(minutes) {
    this.s.time += minutes;
    if (this.s.time >= DAY_END) {
      this.sleep();
      return true;
    }
    return false;
  }

  /** End of day. Everything resets upward. */
  sleep() {
    this.s.day++;
    this.s.totals.days++;
    this.s.time = DAY_START;
    this.s.hp = this.maxHp;
    this.s.focus = this.maxFocus;
    this.addJoy(this.s.joy < 40 ? 22 : 12);
    this.buffs = {};
  }

  /**
   * Run out of HP and you simply stop for the day. You keep every
   * point of experience and every yen. This is the only "loss"
   * state in the game and it costs an afternoon.
   */
  clockOutEarly() {
    this.s.totals.clockedOut++;
    this.addJoy(-4);
    this.s.hp = Math.max(1, Math.round(this.maxHp * 0.35));
    this.s.focus = Math.round(this.maxFocus * 0.5);
    // lose the rest of the afternoon, never the progress
    this.s.time = Math.min(DAY_END - 1, this.s.time + 90);
  }

  /* ----- persistence ----- */
  save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(this.s));
      return true;
    } catch {
      return false;
    }
  }
}

export function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (!s || s.v !== 1) return null;
    // defensive merge, so an older save never hard-fails
    const base = newSave(s.seed || 1);
    return {
      ...base,
      ...s,
      totals: { ...base.totals, ...(s.totals || {}) },
      settings: { ...base.settings, ...(s.settings || {}) },
      items: { ...(s.items || {}) },
      at: { ...base.at, ...(s.at || {}) },
    };
  } catch {
    return null;
  }
}

export function hasSave() {
  try {
    return !!localStorage.getItem(SAVE_KEY);
  } catch {
    return false;
  }
}

export function clearSave() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {}
}
