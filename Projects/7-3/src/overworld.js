/* ============================================================
   7-3 — the overworld

   Grid movement on 8px tiles, a camera that follows and clamps,
   and encounters that fire when you step on the carpet. One minute
   of the working day passes per step, which is not far off.
   ============================================================ */

import { W, H } from './gfx.js';
import { textW } from './font.js';
import { PAL } from './pal.js';
import { TILE, tileById } from './tiles.js';
import { tileIdAt, KINDS } from './world.js';
import { actorFrame, SHADOW } from './actors.js';
import { CAST_BY_ID, AMBIENT, AFTER_WORK } from './content.js';
import { INTERACTION_BY_ID } from './interactions.js';
import { rng } from './rng.js';
import { sfx } from './audio.js';

const STEP_TIME = 0.16; // seconds per tile
const TURN_TIME = 0.07;

/** Prop types that get a blinking "you can use this" tag. */
const MARKED_PROPS = new Set(['curio', 'shop', 'bed', 'drink', 'arcade', 'vendor', 'speakerphone']);

export class Overworld {
  constructor(game) {
    this.g = game;
    this.area = null;
    this.tx = 2;
    this.ty = 2;
    this.facing = 'down';
    this.moving = false;
    this.from = { x: 0, y: 0 };
    this.t = 0;
    this.phase = 0;
    this.turnTimer = 0;
    this.cam = { x: 0, y: 0 };
    this.stepsSinceEncounter = 0;
    this.pendingDoor = -1;
  }

  enter(area, x, y, facing = 'down') {
    this.area = area;
    this.tx = x;
    this.ty = y;
    this.facing = facing;
    this.moving = false;
    this.t = 0;
    this.pendingDoor = -1;
    this.updateCamera();
    this.g.player.s.at = { areaId: area.id, x, y, facing };
  }

  get pal() {
    const p = this.g.player;
    if (p.overtime && !KINDS[this.area.kind].indoor) return PAL.ot;
    if (p.overtime && this.area.kind.startsWith('office')) return PAL.ot;
    return PAL[this.area.pal] || PAL.office;
  }

  /* ---------- geometry ---------- */

  solid(x, y) {
    const t = tileById(tileIdAt(this.area, x, y));
    if (t.solid) return true;
    return this.area.npcs.some((n) => n.x === x && n.y === y);
  }

  ahead(dx = 0, dy = 0) {
    const d = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[this.facing];
    return { x: this.tx + d[0] + dx, y: this.ty + d[1] + dy };
  }

  updateCamera() {
    const px = this.pixelX();
    const py = this.pixelY();
    const maxX = Math.max(0, this.area.w * 8 - W);
    const maxY = Math.max(0, this.area.h * 8 - H);
    this.cam.x = Math.max(0, Math.min(maxX, px + 8 - W / 2));
    this.cam.y = Math.max(0, Math.min(maxY, py + 8 - H / 2));
  }

  pixelX() {
    if (!this.moving) return this.tx * 8;
    const k = Math.min(1, this.t / STEP_TIME);
    return Math.round((this.from.x + (this.tx - this.from.x) * k) * 8);
  }

  pixelY() {
    if (!this.moving) return this.ty * 8;
    const k = Math.min(1, this.t / STEP_TIME);
    return Math.round((this.from.y + (this.ty - this.from.y) * k) * 8);
  }

  /* ---------- update ---------- */

  update(dt) {
    const g = this.g;
    if (g.box.visible) {
      if (g.input.pressed.a || g.input.pressed.b) {
        const closed = g.box.advance();
        if (!closed) sfx.cursor();
      }
      this.updateCamera();
      return;
    }

    if (this.moving) {
      this.t += dt;
      if (this.t >= STEP_TIME) {
        this.moving = false;
        this.t = 0;
        this.phase++;
        this.onArrive();
      }
      this.updateCamera();
      return;
    }

    if (this.turnTimer > 0) {
      this.turnTimer -= dt;
      return;
    }

    if (g.input.pressed.start) {
      g.openPause();
      return;
    }

    if (g.input.pressed.a) {
      this.interact();
      return;
    }

    const dir = g.input.dir();
    if (dir) {
      if (this.facing !== dir) {
        this.facing = dir;
        this.turnTimer = TURN_TIME;
        return;
      }
      const d = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[dir];
      const nx = this.tx + d[0];
      const ny = this.ty + d[1];
      const doorIdx = this.g.world.doorAt(this.area, nx, ny);
      if (doorIdx >= 0) {
        this.pendingDoor = doorIdx;
        this.beginStep(nx, ny);
        return;
      }
      if (nx < 0 || ny < 0 || nx >= this.area.w || ny >= this.area.h) return;
      if (this.solid(nx, ny)) {
        this.phase++;
        this.turnTimer = TURN_TIME;
        return;
      }
      this.beginStep(nx, ny);
    }
  }

  beginStep(nx, ny) {
    this.from = { x: this.tx, y: this.ty };
    this.tx = nx;
    this.ty = ny;
    this.moving = true;
    this.t = 0;
    sfx.step();
  }

  onArrive() {
    const g = this.g;
    const p = g.player;
    p.s.totals.steps++;
    p.s.at = { areaId: this.area.id, x: this.tx, y: this.ty, facing: this.facing };
    if (p.advance(1)) {
      g.onNewDay();
      return;
    }

    if (this.pendingDoor >= 0) {
      const idx = this.pendingDoor;
      this.pendingDoor = -1;
      g.transition(() => {
        const dest = g.world.travel(this.area, idx);
        this.enter(dest.area, dest.x, dest.y, this.facing);
        g.announceArea(dest.area);
      });
      return;
    }

    const t = tileById(tileIdAt(this.area, this.tx, this.ty));
    if (t.task) {
      this.stepsSinceEncounter++;
      const rate = t.rate * (this.area.encounterScale ?? 1);
      // a short grace period after each fight, so it never feels punishing
      const eff = this.stepsSinceEncounter < 4 ? rate * 0.25 : rate;
      if (rng.chance(eff)) {
        this.stepsSinceEncounter = 0;
        g.startBattle(this.area.kind);
      }
    }
  }

  /* ---------- interaction ---------- */

  interact() {
    const g = this.g;
    const { x, y } = this.ahead();

    const npc = this.area.npcs.find((n) => n.x === x && n.y === y);
    if (npc) {
      npc.facing = { up: 'down', down: 'up', left: 'right', right: 'left' }[this.facing];
      if (npc.shop) {
        g.openShop(npc.shop);
        return;
      }
      if (npc.interId) {
        g.resolveInteraction(INTERACTION_BY_ID[npc.interId], npc);
        return;
      }
      const c = CAST_BY_ID[npc.castId];
      if (c) {
        if (!g.player.s.met.includes(c.id)) g.player.s.met.push(c.id);
        sfx.confirm();
        g.box.say(`${c.name} (${c.role}):\n${rng.pick(c.lines)}`);
      }
      return;
    }

    const prop = this.area.props.find((p) => p.x === x && p.y === y);
    if (prop) {
      this.useProp(prop);
      return;
    }

    const doorIdx = g.world.doorAt(this.area, x, y);
    if (doorIdx >= 0) {
      const d = this.area.doors[doorIdx];
      sfx.confirm();
      g.box.say(`A door. It leads to the ${d.label}.`);
      return;
    }

    const t = tileById(tileIdAt(this.area, x, y));
    if (t.name === 'BENCH' && rng.chance(0.65)) {
      const act = AFTER_WORK.find((a) => a.id === 'park');
      if (act) return g.doActivity(act);
    }

    const line = FURNITURE_LINES[t.name];
    if (line) {
      sfx.confirm();
      g.box.say(typeof line === 'function' ? line(g) : rng.pick([].concat(line)));
      return;
    }

    const amb = AMBIENT[this.area.kind];
    if (amb && rng.chance(0.55)) g.box.say(rng.pick(amb));
  }

  useProp(prop) {
    const g = this.g;
    if (prop.type === 'curio') {
      g.resolveInteraction(INTERACTION_BY_ID[prop.interId]);
      return;
    }
    if (prop.type === 'shop') {
      g.openShop(prop.shop);
      return;
    }
    if (prop.type === 'arcade') {
      g.playArcade(prop);
      return;
    }
    if (prop.type === 'vendor') {
      g.buySnack();
      return;
    }
    if (prop.type === 'bed') {
      sfx.confirm();
      g.box.say('You lie down. The day closes over you like a lid.', () => g.sleepUntilMorning());
      return;
    }
    if (prop.type === 'drink') {
      const act = rng.pick(AFTER_WORK.filter((a) => a.zone === 'izakaya'));
      g.doActivity(act);
      return;
    }
    if (prop.type === 'speakerphone') {
      sfx.confirm();
      g.box.say('The speakerphone is warm. It has been used recently, and will be used again shortly.');
    }
  }

  /* ---------- draw ---------- */

  draw(s) {
    const pal = this.pal;
    const a = this.area;
    const cx = Math.round(this.cam.x);
    const cy = Math.round(this.cam.y);
    s.clear(pal, 0);

    const t0x = Math.max(0, (cx / 8) | 0);
    const t0y = Math.max(0, (cy / 8) | 0);
    const t1x = Math.min(a.w, t0x + (W >> 3) + 2);
    const t1y = Math.min(a.h, t0y + (H >> 3) + 2);

    const talls = [];
    for (let ty = t0y; ty < t1y; ty++) {
      for (let tx = t0x; tx < t1x; tx++) {
        const t = tileById(tileIdAt(a, tx, ty));
        const dx = tx * 8 - cx;
        const dy = ty * 8 - cy;
        if (t.tall) {
          // ground under it, then the top half again over the actors
          s.blit(a.indoor ? TILE.FLOOR.art : TILE.SIDEWALK.art, dx, dy, pal);
          talls.push([t, dx, dy]);
        } else {
          s.blit(t.art, dx, dy, pal);
        }
      }
    }

    // actors, sorted so lower ones overlap higher ones
    const actors = a.npcs.map((n) => ({
      x: n.x * 8 - cx,
      y: n.y * 8 - cy,
      kind: n.kind,
      facing: n.facing,
      phase: 0,
    }));
    actors.push({
      x: this.pixelX() - cx,
      y: this.pixelY() - cy,
      kind: 'salaryman',
      facing: this.facing,
      phase: this.moving ? this.phase + 1 : 0,
    });
    actors.sort((p, q) => p.y - q.y);
    for (const act of actors) {
      s.blit(SHADOW, act.x + 4, act.y + 6, pal);
      const [spr, flip] = actorFrame(act.kind, act.facing, act.phase);
      s.blit(spr, act.x, act.y - 8, pal, { flipX: flip });
    }

    for (const [t, dx, dy] of talls) s.blit(t.art, dx, dy, pal);

    /*
     * Mark everything you can press A on. The map is generated, so
     * there is no learned vocabulary of "that shape is a thing" — a
     * blinking tag is the only honest way to tell a desk you can use
     * from a desk that is scenery.
     */
    const bob = this.g.frame % 44 < 22 ? 0 : 1;
    for (const pr of a.props) {
      if (!MARKED_PROPS.has(pr.type)) continue;
      const mx = pr.x * 8 - cx;
      const my = pr.y * 8 - cy - 7 + bob;
      if (mx < -8 || mx > W || my < -6 || my > H) continue;
      // light arrow first, dark arrow inset over it: the pale rim that
      // leaves behind is what keeps it legible on both floor and wall
      for (let i = 0; i < 4; i++) s.fillRect(mx + i, my + i, 7 - i * 2, 1, pal, 0);
      for (let i = 0; i < 3; i++) s.fillRect(mx + 1 + i, my + i, 5 - i * 2, 1, pal, 3);
    }

    /*
     * Shopfront signs. Outdoors you have to be able to read a street at
     * a glance, or every block looks identical — the whole map is
     * generated, so there are no landmarks to learn.
     */
    if (!a.indoor) {
      let lastRight = -Infinity;
      for (const d of a.doors) {
        if (d.face !== 'down' || !d.sign) continue;
        const lw = textW(d.sign);
        let lx = Math.round(d.x * 8 + 4 - lw / 2) - cx;
        const ly = d.y * 8 - 10 - cy;
        if (lx < 1) lx = 1;
        if (lx + lw > W - 1) lx = W - 1 - lw;
        if (ly < -8 || ly > H) continue;
        if (lx - 3 <= lastRight) lx = lastRight + 4; // never collide with the previous sign
        if (lx + lw > W) continue;
        s.fillRect(lx - 2, ly - 2, lw + 4, 11, pal, 3);
        s.text(d.sign, lx, ly, pal, { ink: 0 });
        lastRight = lx + lw + 2;
      }
    }
  }
}

/* Flavour for scenery with no interaction attached. */
const FURNITURE_LINES = {
  DESK: [
    'Somebody else’s desk. A photo, a mug, and a drawer that does not open.',
    'A monitor asleep, showing your own face back at you.',
  ],
  COOLER: 'The water cooler gurgles once, in agreement with nothing.',
  PRINTER: 'The printer is warm and quiet. It is resting before its next crime.',
  PLANT: 'The plant is doing fine. Better than fine. It has no idea.',
  WHITEBOARD: 'Someone has drawn a diagram. Four boxes and an arrow that leaves the board entirely.',
  VENDING: 'Row C is sold out. Row C is always sold out.',
  TV: 'The television plays a programme about people renovating a house they already like.',
  BED: 'Made, for once.',
  SHELF: 'Shelves of things, arranged by someone who thought about it a lot.',
  FREEZER: 'Cold air rolls out and pools around your ankles.',
  TREE: 'A tree, minding its own business in the middle of a city.',
  BENCH: 'A bench. You could sit down. You could sit down right now.',
  LANTERN: 'The lantern is lit. That means they are open.',
  COUNTER: 'A counter, wiped down and waiting.',
  TABLE: 'A table with four chairs and one long scratch across the middle.',
  BAR_STOOL: 'A stool, still warm.',
  RUG: 'The rug you bought because the floor felt unfinished.',
  WALL: 'A wall. It is holding up its end of things.',
  FACADE: 'A building front. Somebody works in there. Somebody is in there right now.',
};
