/* ============================================================
   7-3 — autopilot

   Drives the ordinary input path rather than a private back door:
   it holds directions and taps A, exactly as a person would. That
   keeps one set of rules for both, and means anything you watch it
   do, you could have done.
   ============================================================ */

import { tileById } from './tiles.js';
import { tileIdAt } from './world.js';
import { SKILL_BY_ID, ITEM_BY_ID, skillsAt } from './content.js';
import { rng } from './rng.js';
import { readingTime } from './ui.js';

/* How strongly each part of the day pulls toward each kind of door. */
const AGENDA_DOORS = {
  commute: { office_lobby: 8, office_floor: 8, street: 1.6, station: 1.2, konbini: 0.7, _other: 0.25 },
  // inside the building, the lobby means "leave"; outside it means "arrive"
  work_in: { office_floor: 5, meeting_room: 2.2, break_room: 1.6, office_lobby: 0.4, _other: 0.1 },
  work_out: { office_lobby: 9, office_floor: 9, street: 1.4, station: 1, _other: 0.15 },
  /*
   * After work, almost any door beats another block of pavement — hence
   * the high `_other` and the very low `street`. With street at 2 the
   * autopilot spent whole evenings walking from one street to the next
   * and never once went inside anywhere.
   */
  errands: { konbini: 4, market: 4, arcade: 3, izakaya: 1.5, park: 1.5, street: 0.8, _other: 0.8 },
  social: { izakaya: 4, arcade: 3.5, park: 3, konbini: 2, apartment: 1.2, street: 0.4, _other: 0.8 },
  home: { apartment: 7, street: 2.2, _other: 0.2 },
};

const OFFICE_KINDS = ['office_floor', 'office_lobby', 'break_room', 'meeting_room'];

const TASK_PULL = { commute: 1.6, work: 9, errands: 3, social: 2, home: 0.6 };

const DIRS = [
  ['up', 0, -1],
  ['down', 0, 1],
  ['left', -1, 0],
  ['right', 1, 0],
];

export class Auto {
  constructor(game) {
    this.g = game;
    this.active = false;
    this.path = [];
    this.goal = null;
    this.hold = 0;
    this.idle = 0;
    this.stuck = 0;
    // people and objects already pressed A on, keyed by area and tile
    this.visited = new Set();
    // how many things have been used in each area, so it eventually moves on
    this.areaActions = new Map();
  }

  /** A few random standable tiles, for aimless wandering. */
  randomSpots(n) {
    const ow = this.g.overworld;
    const a = ow.area;
    const out = [];
    for (let i = 0; i < n * 6 && out.length < n; i++) {
      const x = rng.int(1, a.w - 2);
      const y = rng.int(1, a.h - 2);
      if (!ow.solid(x, y)) out.push({ x, y });
    }
    return out;
  }

  toggle() {
    this.active = !this.active;
    this.path = [];
    this.hold = 0;
    if (!this.active) this.releaseAll();
    return this.active;
  }

  releaseAll() {
    for (const [d] of DIRS) this.g.input.held[d] = false;
  }

  /** Called once per frame, before Input.beginFrame. */
  tick(dt) {
    if (!this.active) return;
    this.releaseAll();
    this.hold -= dt;

    const g = this.g;

    // any text on screen: read it, then move on
    if (g.box.visible) {
      if (this.hold <= 0) {
        if (g.box.pageComplete) {
          g.input.inject('a');
          this.hold = 0.45 / g.speed;
        }
      }
      return;
    }

    if (g.scene === 'shop') {
      this.shop();
      return;
    }
    if (g.scene === 'pause') {
      if (this.hold <= 0) {
        g.input.inject('b');
        this.hold = 0.3;
      }
      return;
    }
    if (g.scene === 'title') {
      if (this.hold <= 0) {
        g.input.inject('a');
        this.hold = 0.5;
      }
      return;
    }
    if (g.scene !== 'overworld') return;

    this.walk(dt);
  }

  /* ---------- overworld ---------- */

  walk(dt) {
    const g = this.g;
    const ow = g.overworld;
    if (ow.moving || ow.turnTimer > 0) return;

    /*
     * Retire any nodes we are already standing on FIRST. The previous
     * version discovered arrival further down, where a zero delta made
     * the direction lookup fail and the function returned early — which
     * meant the goal-arrival branch below was unreachable and the
     * autopilot never once talked to anybody in a two-minute soak.
     */
    let arrived = false;
    while (this.path.length && this.path[0].x === ow.tx && this.path[0].y === ow.ty) {
      this.path.shift();
      this.stuck = 0;
      arrived = true;
    }

    if (!this.path.length) {
      // at the goal: do whatever the goal was for
      if (this.goal) {
        const gl = this.goal;
        this.goal = null;
        if (gl.act === 'talk' || gl.act === 'use') {
          this.visited.add(`${ow.area.id}:${gl.fx},${gl.fy}`);
          this.areaActions.set(ow.area.id, (this.areaActions.get(ow.area.id) || 0) + 1);
          this.faceAndPress(gl);
          this.hold = 0.7 / g.speed;
          return;
        }
        if (gl.act === 'stand') this.noteTask();
        // a door needs nothing: stepping onto it already triggered the move
        this.hold = 0.2 / g.speed;
        return;
      }
      if (this.hold > 0) return;
      this.plan();
      if (!this.path.length) {
        // nothing reachable: nudge in a random direction and retry
        const [d] = rng.pick(DIRS);
        g.input.held[d] = true;
        this.hold = 0.25;
        return;
      }
    }

    const next = this.path[0];
    const dir = DIRS.find(
      ([, ax, ay]) => ax === Math.sign(next.x - ow.tx) && ay === Math.sign(next.y - ow.ty)
    );
    if (!dir) {
      // not adjacent — the path is stale, so throw it away and re-plan
      this.path = [];
      this.goal = null;
      return;
    }
    g.input.held[dir[0]] = true;

    if (!arrived) {
      this.stuck += dt;
      if (this.stuck > 3) {
        this.path = [];
        this.goal = null;
        this.stuck = 0;
      }
    }
  }

  faceAndPress(goal) {
    const g = this.g;
    const ow = g.overworld;
    const dx = Math.sign(goal.fx - ow.tx);
    const dy = Math.sign(goal.fy - ow.ty);
    const dir = DIRS.find(([, ax, ay]) => ax === dx && ay === dy);
    if (dir) {
      ow.facing = dir[0];
      g.input.inject('a');
    }
  }

  /**
   * What the day is for, right now. Without this the autopilot just
   * drifts between streets and never actually goes to work, which is
   * both untrue to life and very boring to watch.
   */
  agenda() {
    const t = this.g.player.time;
    if (t < 9 * 60) return 'commute';
    if (t < 17 * 60) return 'work';
    if (t < 19 * 60) return 'errands';
    if (t < 22 * 60) return 'social';
    return 'home';
  }

  /**
   * Pick somewhere to be. Weighted toward the carpet, because that
   * is where the work is, but it also runs errands and talks to
   * people, which is the point of the mode.
   */
  plan() {
    const g = this.g;
    const ow = g.overworld;
    const a = ow.area;
    const p = g.player;

    const candidates = [];

    // task tiles
    for (let y = 1; y < a.h - 1; y++) {
      for (let x = 1; x < a.w - 1; x++) {
        const t = tileById(tileIdAt(a, x, y));
        if (t.task) candidates.push({ x, y, act: 'stand', w: 6 });
      }
    }
    // people worth a word
    for (const n of a.npcs) {
      for (const [, dx, dy] of DIRS) {
        const sx = n.x + dx;
        const sy = n.y + dy;
        if (!ow.solid(sx, sy)) candidates.push({ x: sx, y: sy, act: 'talk', fx: n.x, fy: n.y, w: n.shop ? 1.5 : 2.5 });
      }
    }
    /*
     * Props: beds, bars, shop counters.
     *
     * The bed and the bar are gated by the clock rather than merely
     * weighted down. A low weight still fires eventually, and "eventually"
     * meant walking back into the flat and going to sleep at 7:21 in the
     * morning, throwing away an entire day.
     */
    const late = p.time > 21 * 60;
    const evening = p.time > 17 * 60;
    for (const pr of a.props) {
      if (pr.type === 'bed' && !late) continue;
      if (pr.type === 'drink' && !evening) continue;
      for (const [, dx, dy] of DIRS) {
        const sx = pr.x + dx;
        const sy = pr.y + dy;
        if (ow.solid(sx, sy)) continue;
        // an arcade cabinet and a food stall are the whole reason to
        // have money, so the autopilot should be drawn to both
        const w =
          pr.type === 'bed' ? 8
          : pr.type === 'drink' ? 3
          : pr.type === 'arcade' ? 4
          : pr.type === 'vendor' ? 3
          : 1.2;
        candidates.push({ x: sx, y: sy, act: 'use', fx: pr.x, fy: pr.y, w });
      }
    }
    // doors, weighted by where the day says we ought to be heading
    const ag0 = this.agenda();
    const inOffice = OFFICE_KINDS.includes(a.kind);
    const wantKey = ag0 === 'work' ? (inOffice ? 'work_in' : 'work_out') : ag0;
    const want = AGENDA_DOORS[wantKey] || {};
    a.doors.forEach((d) => {
      const fresh = d.toId === null ? 1.8 : 1;
      const pull = want[d.kind] ?? want._other ?? 1;
      /*
       * Aim at the half of the doorway you can actually walk into. Since
       * doors became 2x2, the origin tile is no longer adjacent to any
       * floor — only the bottom row is — so targeting d.x,d.y made every
       * shopfront test as unreachable and got dropped. The autopilot
       * could then only ever take the 1x2 street exits, and spent whole
       * evenings walking from one block to the next without going in
       * anywhere.
       */
      const entry =
        d.tiles.find(([tx, ty]) => Math.abs(tx - d.inX) + Math.abs(ty - d.inY) === 1) || d.tiles[0];
      candidates.push({ x: entry[0], y: entry[1], act: 'door', w: 2.2 * fresh * pull });
    });

    // somewhere to wander to for no reason at all
    for (const spot of this.randomSpots(4)) {
      candidates.push({ x: spot.x, y: spot.y, act: 'wander', w: 1 });
    }

    if (!candidates.length) return;

    /*
     * Anything with something to say is worth far more the first time.
     * This is the whole personality of the mode: it plays the way a
     * child plays a Pokemon game — press A on every person and every
     * object in the room, once, then get bored and leave.
     */
    for (const c of candidates) {
      if (c.act !== 'talk' && c.act !== 'use') continue;
      const key = `${a.id}:${c.fx},${c.fy}`;
      c.w *= this.visited.has(key) ? 0.06 : 4;
    }

    /*
     * Normalise per category before choosing. A street has a hundred
     * pavement tiles and five doors; without this the sheer count of
     * floor tiles drowns out every door and the autopilot never leaves
     * the block it started on.
     */
    const ag = this.agenda();
    const taskPull = ag === 'work' && !inOffice ? 1.2 : (TASK_PULL[ag] ?? 1);
    const unseen = candidates.some(
      (c) => (c.act === 'talk' || c.act === 'use') && !this.visited.has(`${a.id}:${c.fx},${c.fy}`)
    );
    /*
     * Doors stay cheap while there is still something new in the room —
     * but only for the first few things. Without the cap, a street with
     * three curios and two strangers kept the exits suppressed all
     * morning and the autopilot never reached the office, the arcade or
     * a food stall in a whole simulated day.
     */
    // Three is the tuned figure. At five it never got out of the street
    // it started on; at zero it sprinted past everything without talking.
    const doneHere = this.areaActions.get(a.id) || 0;
    const settled = unseen && doneHere < 3;
    // when the clock says we are meant to be somewhere else, doors win
    const commuting = ag === 'commute' || (ag === 'work' && !inOffice) || ag === 'home';
    const budget = {
      stand: 10 * taskPull,
      talk: 20,
      use: 16,
      door: (settled ? 6 : 20) * (commuting ? 2 : 1) * (1 + Math.min(2.5, this.roomTasks || 0)),
      wander: 4,
    };
    const totals = {};
    for (const c of candidates) totals[c.act] = (totals[c.act] || 0) + c.w;
    for (const c of candidates) {
      const t = totals[c.act] || 1;
      c.w = (c.w / t) * (budget[c.act] ?? 5);
    }

    const reach = this.bfs(ow.tx, ow.ty);
    const reachable = candidates.filter((c) => reach.has(c.x + ',' + c.y));
    if (!reachable.length) return;

    const goal = rng.weighted(reachable, 'w');
    this.goal = goal;
    this.path = this.trace(reach, goal.x, goal.y);
    if (goal.act === 'door') this.roomTasks = 0;
  }

  /** Breadth-first flood from the player, over walkable tiles. */
  bfs(sx, sy) {
    const ow = this.g.overworld;
    const a = ow.area;
    const seen = new Map();
    seen.set(sx + ',' + sy, null);
    const q = [[sx, sy]];
    let head = 0;
    while (head < q.length) {
      const [x, y] = q[head++];
      for (const [, dx, dy] of DIRS) {
        const nx = x + dx;
        const ny = y + dy;
        const key = nx + ',' + ny;
        if (seen.has(key)) continue;
        if (nx < 0 || ny < 0 || nx >= a.w || ny >= a.h) continue;
        const isDoor = this.g.world.doorAt(a, nx, ny) >= 0;
        if (!isDoor && ow.solid(nx, ny)) continue;
        seen.set(key, [x, y]);
        if (!isDoor) q.push([nx, ny]);
      }
    }
    return seen;
  }

  trace(seen, gx, gy) {
    const out = [];
    let cur = [gx, gy];
    let guard = 0;
    while (cur && guard++ < 2000) {
      out.push({ x: cur[0], y: cur[1] });
      cur = seen.get(cur[0] + ',' + cur[1]);
    }
    out.pop(); // drop the starting tile
    return out.reverse();
  }

  noteTask() {
    this.roomTasks = (this.roomTasks || 0) + 1;
  }

  /* ---------- battle ---------- */

  /** Returns a command for the battle menu, or null while thinking. */
  chooseBattle(b) {
    if (this.hold > 0) return null;
    this.hold = 0.5 / this.g.speed;
    const p = this.g.player;
    const hpFrac = p.hp / p.maxHp;

    // top up if it is getting thin and there is something to use
    if (hpFrac < 0.34) {
      const heal = p.itemList.find(([id]) => {
        const it = ITEM_BY_ID[id];
        return it.kind === 'hp' || it.kind === 'both';
      });
      if (heal) return { kind: 'item', id: heal[0] };
      const skill = skillsAt(p.level).find((s) => s.kind === 'heal' && p.focus >= s.cost);
      if (skill) return { kind: 'skill', id: skill.id };
    }

    // finish it if that is on the table
    const finisher = skillsAt(p.level).find((s) => s.kind === 'finish' && p.focus >= s.cost);
    if (finisher && b.e.hp / b.e.maxHp > 0.5 && rng.chance(0.35)) {
      return { kind: 'skill', id: finisher.id };
    }

    const usable = skillsAt(p.level).filter(
      (s) => p.focus >= s.cost && (s.kind === 'attack' || s.kind === 'debuff' || s.kind === 'buff')
    );
    if (usable.length && rng.chance(0.6)) {
      const attacks = usable.filter((s) => s.kind === 'attack');
      const pick = attacks.length && rng.chance(0.8) ? rng.pick(attacks) : rng.pick(usable);
      return { kind: 'skill', id: pick.id };
    }
    return { kind: 'fight' };
  }

  /* ---------- shopping ---------- */

  shop() {
    const g = this.g;
    if (this.hold > 0) return;
    const p = g.player;
    const stock = g.shopStock || [];
    const bagSize = p.itemList.reduce((n, [, c]) => n + c, 0);
    const affordable = stock.filter((id) => p.canAfford(ITEM_BY_ID[id].price));
    if (bagSize < 8 && affordable.length && rng.chance(0.7)) {
      g.buyItem(rng.pick(affordable));
      this.hold = 0.6 / g.speed;
      return;
    }
    g.closeShop();
    this.hold = 0.5;
  }
}
