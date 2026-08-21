/* ============================================================
   7-3 — dialogue boxes and menus

   One text box, bottom-anchored, three lines, typed out a
   character at a time. One menu widget. Between them they carry
   the entire interface, which is roughly the right amount for a
   screen this size.
   ============================================================ */

import { wrap, textW, LINE_H } from './font.js';

export const BOX = { x: 2, y: 88, w: 156, h: 54 };
const TEXT_X = BOX.x + 6;
const TEXT_Y = BOX.y + 5;
const TEXT_W = BOX.w - 14;
// Four lines rather than three: the interaction writing runs long and
// three lines turned ordinary jokes into four pages of button pressing.
const LINES = 4;
const CPS = 52; // characters per second

/**
 * How long a finished page sits before the autopilot turns it.
 *
 * The clock starts only once the typewriter has finished printing, so
 * this is three full seconds of a complete page on screen regardless of
 * how long it took to type out. A flat figure beat scaling by length:
 * length-scaled timing made the long pages genuinely slow to sit
 * through without making the short ones any easier to catch.
 *
 * Nobody is trapped by it — A still turns the page instantly, and the
 * speed control divides straight into it (1.5s at 2x, 0.75s at 4x).
 */
export const PAGE_DWELL = 3;

/** A short beat after a conversation ends, before the autopilot moves on. */
export const SETTLE_AFTER_TALK = 0.6;

export class TextBox {
  constructor() {
    this.pages = [];
    this.page = 0;
    this.revealed = 0;
    this.visible = false;
    this.onDone = null;
    this.blink = 0;
    this.speed = 1;
  }

  /** Queue text. Wraps and paginates to three lines per page. */
  say(text, onDone = null) {
    const lines = wrap(text, TEXT_W);
    this.pages = [];
    for (let i = 0; i < lines.length; i += LINES) this.pages.push(lines.slice(i, i + LINES));
    if (!this.pages.length) this.pages = [['']];
    this.page = 0;
    this.revealed = 0;
    this.visible = true;
    this.onDone = onDone;
    return this;
  }

  /** Append more text to the queue without disturbing what is showing. */
  queue(text) {
    const lines = wrap(text, TEXT_W);
    for (let i = 0; i < lines.length; i += LINES) this.pages.push(lines.slice(i, i + LINES));
    this.visible = true;
    return this;
  }

  get currentLines() {
    return this.pages[this.page] || [];
  }

  get charCount() {
    return this.currentLines.reduce((n, l) => n + l.length, 0);
  }

  get pageComplete() {
    return this.revealed >= this.charCount;
  }

  get lastPage() {
    return this.page >= this.pages.length - 1;
  }

  /** A press: finish the page, or turn it, or close. Returns true if it closed. */
  advance() {
    if (!this.visible) return false;
    if (!this.pageComplete) {
      this.revealed = this.charCount;
      return false;
    }
    if (!this.lastPage) {
      this.page++;
      this.revealed = 0;
      return false;
    }
    this.close();
    return true;
  }

  close() {
    this.visible = false;
    this.pages = [];
    this.page = 0;
    this.revealed = 0;
    const cb = this.onDone;
    this.onDone = null;
    if (cb) cb();
  }

  update(dt) {
    if (!this.visible) return;
    this.blink += dt;
    if (!this.pageComplete) this.revealed = Math.min(this.charCount, this.revealed + CPS * this.speed * dt);
  }

  draw(s, pal, opts = {}) {
    if (!this.visible) return;
    const { x = BOX.x, y = BOX.y, w = BOX.w, h = BOX.h } = opts;
    s.window(x, y, w, h, pal);
    let left = Math.floor(this.revealed);
    let cy = y + 5;
    for (const line of this.currentLines) {
      const shown = line.slice(0, Math.max(0, left));
      s.text(shown, x + 6, cy, pal);
      left -= line.length;
      cy += LINE_H;
      if (left <= 0) break;
    }
    // the blinking "there is more" arrow
    if (this.pageComplete && this.blink % 1 < 0.6) {
      s.text('▼', x + w - 11, y + h - 10, pal);
    }
  }
}

/* ---------- menus ---------- */

export class Menu {
  constructor(items = [], opts = {}) {
    this.items = items;
    this.i = 0;
    this.cols = opts.cols || 1;
    this.onPick = opts.onPick || null;
    this.onCancel = opts.onCancel || null;
    this.wrapAround = opts.wrapAround !== false;
  }

  set(items) {
    this.items = items;
    this.i = Math.min(this.i, Math.max(0, items.length - 1));
    return this;
  }

  get current() {
    return this.items[this.i];
  }

  get rows() {
    return Math.ceil(this.items.length / this.cols);
  }

  move(dx, dy) {
    if (!this.items.length) return false;
    const n = this.items.length;
    let i = this.i;
    if (this.cols === 1) {
      i += dy;
      if (dx) i += dx;
    } else {
      const r = Math.floor(i / this.cols);
      const c = i % this.cols;
      let nr = r + dy;
      let nc = c + dx;
      if (nc < 0) nc = this.cols - 1;
      if (nc >= this.cols) nc = 0;
      if (nr < 0) nr = this.rows - 1;
      if (nr >= this.rows) nr = 0;
      i = nr * this.cols + nc;
      if (i >= n) i = n - 1;
    }
    if (this.wrapAround) i = ((i % n) + n) % n;
    else i = Math.max(0, Math.min(n - 1, i));
    const changed = i !== this.i;
    this.i = i;
    return changed;
  }

  /** Drive from an Input. Returns 'move' | 'pick' | 'cancel' | null. */
  handle(input) {
    if (input.pressed.up && this.move(0, -1)) return 'move';
    if (input.pressed.down && this.move(0, 1)) return 'move';
    if (this.cols > 1) {
      if (input.pressed.left && this.move(-1, 0)) return 'move';
      if (input.pressed.right && this.move(1, 0)) return 'move';
    }
    if (input.pressed.a) return 'pick';
    if (input.pressed.b) return 'cancel';
    return null;
  }

  /**
   * Draw inside an already-open window. `render` maps an item to its
   * label; a disabled item is dimmed rather than hidden.
   */
  draw(s, pal, x, y, opts = {}) {
    const { lineH = LINE_H, colW = 0, render = (it) => it.label ?? String(it), dim = () => false } = opts;
    this.items.forEach((it, n) => {
      const r = Math.floor(n / this.cols);
      const c = n % this.cols;
      const ix = x + c * (colW || 0);
      const iy = y + r * lineH;
      if (n === this.i) s.text('▶', ix - 6, iy, pal);
      s.text(render(it, n), ix, iy, pal, { ink: dim(it, n) ? 1 : 3 });
    });
  }
}

/** Centre a short label inside a window of width w. */
export function centered(s, str, x, y, w, pal, opts) {
  s.text(str, x + Math.round((w - textW(str)) / 2), y, pal, opts);
}
