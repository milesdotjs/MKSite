/* ============================================================
   7-3 — input

   Four directions plus A / B / START, mapped from the keyboard,
   from on-screen buttons, and from swipes on the canvas itself.
   Exposes both level state (`held`) and edge state (`pressed`),
   because menus want taps and walking wants holds.
   ============================================================ */

export const BUTTONS = ['up', 'down', 'left', 'right', 'a', 'b', 'start'];

const KEYMAP = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  KeyW: 'up',
  KeyS: 'down',
  KeyA: 'left',
  KeyD: 'right',
  KeyZ: 'a',
  KeyX: 'b',
  Enter: 'a',
  Space: 'a',
  Backspace: 'b',
  Escape: 'start',
  ShiftLeft: 'b',
  Tab: 'start',
};

export class Input {
  constructor() {
    this.held = Object.fromEntries(BUTTONS.map((b) => [b, false]));
    this.pressed = Object.fromEntries(BUTTONS.map((b) => [b, false]));
    this._queued = new Set();
    this._repeat = Object.fromEntries(BUTTONS.map((b) => [b, 0]));
    this.anyActivity = false;
  }

  attach(root) {
    addEventListener('keydown', (e) => {
      const b = KEYMAP[e.code];
      if (!b) return;
      e.preventDefault();
      if (!this.held[b]) this._queued.add(b);
      this.held[b] = true;
      this.anyActivity = true;
    });
    addEventListener('keyup', (e) => {
      const b = KEYMAP[e.code];
      if (!b) return;
      e.preventDefault();
      this.held[b] = false;
      this._repeat[b] = 0;
    });
    addEventListener('blur', () => {
      for (const b of BUTTONS) this.held[b] = false;
    });

    // on-screen controls
    if (root) {
      for (const el of root.querySelectorAll('[data-btn]')) {
        const b = el.dataset.btn;
        const down = (e) => {
          e.preventDefault();
          if (!this.held[b]) this._queued.add(b);
          this.held[b] = true;
          this.anyActivity = true;
          el.classList.add('is-down');
        };
        const up = (e) => {
          e.preventDefault();
          this.held[b] = false;
          this._repeat[b] = 0;
          el.classList.remove('is-down');
        };
        el.addEventListener('pointerdown', down);
        el.addEventListener('pointerup', up);
        el.addEventListener('pointercancel', up);
        el.addEventListener('pointerleave', up);
        el.addEventListener('contextmenu', (e) => e.preventDefault());
      }
    }
  }

  /** Swipe + tap on the screen itself, for phones held one-handed. */
  attachSwipe(el) {
    let sx = 0;
    let sy = 0;
    let t0 = 0;
    let fired = false;
    el.addEventListener(
      'pointerdown',
      (e) => {
        sx = e.clientX;
        sy = e.clientY;
        t0 = performance.now();
        fired = false;
      },
      { passive: true }
    );
    el.addEventListener('pointermove', (e) => {
      if (fired || !t0) return;
      const dx = e.clientX - sx;
      const dy = e.clientY - sy;
      if (Math.hypot(dx, dy) < 24) return;
      fired = true;
      const b =
        Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up';
      this._queued.add(b);
      this.held[b] = true;
      this.anyActivity = true;
      setTimeout(() => {
        this.held[b] = false;
      }, 160);
    });
    el.addEventListener('pointerup', () => {
      if (!fired && performance.now() - t0 < 300) {
        this._queued.add('a');
        this.anyActivity = true;
      }
      t0 = 0;
    });
  }

  /** Call once per frame, before the scene updates. */
  beginFrame(dt) {
    for (const b of BUTTONS) this.pressed[b] = false;
    for (const b of this._queued) this.pressed[b] = true;
    this._queued.clear();
    // key repeat for menu navigation
    for (const b of ['up', 'down', 'left', 'right']) {
      if (this.held[b]) {
        this._repeat[b] += dt;
        if (this._repeat[b] > 0.35) {
          this._repeat[b] -= 0.09;
          this.pressed[b] = true;
        }
      }
    }
  }

  /** Direction currently held, or null. */
  dir() {
    if (this.held.up) return 'up';
    if (this.held.down) return 'down';
    if (this.held.left) return 'left';
    if (this.held.right) return 'right';
    return null;
  }

  consumeActivity() {
    const a = this.anyActivity;
    this.anyActivity = false;
    return a;
  }

  /** Synthesise a press — used by autopilot to drive the same code path a player would. */
  inject(button) {
    this._queued.add(button);
  }
}
