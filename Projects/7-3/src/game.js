/* ============================================================
   7-3 — the machine that runs it

   Scene dispatch, the frame loop, screen transitions, and the
   glue between the pieces. Everything else is a scene or a system.
   ============================================================ */

import { Screen, W, H } from './gfx.js';
import { PAL, fade } from './pal.js';
import { Input } from './input.js';
import { sfx } from './audio.js';
import { World, KINDS } from './world.js';
import { Overworld } from './overworld.js';
import { Battle } from './battle.js';
import { Auto } from './auto.js';
import { TextBox, Menu } from './ui.js';
import { Player, newSave, loadSave, hasSave, clearSave, DAY_START } from './state.js';
import { commas, abbrev, money as fmtMoney, MAX_LEVEL } from './xp.js';
import {
  SKILLS,
  SKILL_BY_ID,
  ITEMS,
  ITEM_BY_ID,
  SHOPS,
  skillsAt,
  promotionAt,
  AFTER_WORK,
  ARCADE_GAMES,
  SNACKS,
} from './content.js';
import { rng } from './rng.js';
import { INTERACTION_COUNT } from './interactions.js';
import { voiceLine } from './voices.js';
import { payFor } from './state.js';
import { xpAward } from './xp.js';

const FIXED_DT = 1 / 60;

export class Game {
  constructor(canvas, shell) {
    this.canvas = canvas;
    this.shell = shell;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.ctx.imageSmoothingEnabled = false;
    this.s = new Screen(W, H);

    this.input = new Input();
    this.box = new TextBox();
    this.auto = new Auto(this);
    this.overworld = new Overworld(this);
    this.battle = new Battle(this);

    this.scene = 'boot';
    this.speed = 1;
    this.acc = 0;
    this.last = 0;
    this.frame = 0;
    this.trans = null;
    this.flashTimer = 0;

    this.titleMenu = new Menu([]);
    this.pauseMenu = new Menu([]);
    this.shopMenu = new Menu([]);
    this.statusPage = 0;

    this.player = null;
    this.world = null;
  }

  /* ---------- boot ---------- */

  attach() {
    this.input.attach(this.shell);
    this.input.attachSwipe(this.canvas);
    this.resize();
    addEventListener('resize', () => this.resize());
    this.toTitle();
    this.last = performance.now();
    requestAnimationFrame((t) => this.tick(t));
  }

  /**
   * Integer-scale the canvas. Never a fractional scale: at this
   * resolution a half pixel is the difference between a crisp panel
   * and a smeared one.
   */
  resize() {
    const host = this.canvas.parentElement;
    const availW = host.clientWidth || window.innerWidth;
    const availH = Math.max(H, Math.min(window.innerHeight * 0.66, 620));
    let scale = Math.floor(Math.min(availW / W, availH / H));
    if (!isFinite(scale) || scale < 1) scale = 1;
    this.scale = scale;
    this.canvas.style.width = W * scale + 'px';
    this.canvas.style.height = H * scale + 'px';
  }

  toTitle() {
    this.scene = 'title';
    this.titleMenu.set(
      [
        hasSave() ? { id: 'continue', label: 'CONTINUE' } : null,
        { id: 'new', label: hasSave() ? 'NEW EMPLOYEE' : 'CLOCK IN' },
        { id: 'auto', label: 'AUTOPILOT' },
      ].filter(Boolean)
    );
    this.titleT = 0;
  }

  startGame(save, autoStart = false) {
    this.player = new Player(save);
    this.world = new World(save.seed);
    this.auto.active = autoStart;

    /*
     * A resumed save always starts at home. The city is generated
     * lazily and not serialised, so rebuilding it from the seed and
     * waking up in your own flat is both cheaper and truer to the
     * premise than restoring a half-remembered corridor.
     */
    const area = this.world.create('apartment');
    const door = area.doors[0];

    this.scene = 'overworld';
    this.overworld.enter(area, door.inX, door.inY, 'up');
    sfx.setMood(this.player.overtime ? 'overtime' : 'day');
    this.announceArea(area, true);
    this.syncHud();
  }

  /* ---------- loop ---------- */

  tick(now) {
    requestAnimationFrame((t) => this.tick(t));
    let dt = (now - this.last) / 1000;
    this.last = now;
    if (dt > 0.25) dt = 0.25;
    this.acc += dt;
    let guard = 0;
    while (this.acc >= FIXED_DT && guard++ < 8) {
      this.step(FIXED_DT);
      this.acc -= FIXED_DT;
    }
    this.draw();
  }

  step(dt) {
    this.frame++;
    const scaled = dt * this.speed;

    this.auto.tick(scaled);
    this.input.beginFrame(scaled);

    if (this.trans) {
      this.trans.t += dt * 2.6;
      if (!this.trans.fired && this.trans.t >= 1) {
        this.trans.fired = true;
        this.trans.fn();
      }
      if (this.trans.t >= 2) this.trans = null;
      return;
    }

    switch (this.scene) {
      case 'title':
        this.updateTitle(scaled);
        break;
      case 'overworld':
        this.box.update(scaled);
        this.overworld.update(scaled);
        break;
      case 'battle':
        this.battle.update(scaled);
        break;
      case 'pause':
        this.updatePause();
        break;
      case 'status':
        this.updateStatus();
        break;
      case 'shop':
        this.updateShop();
        break;
    }

    if (this.frame % 30 === 0) this.syncHud();
  }

  draw() {
    const s = this.s;
    switch (this.scene) {
      case 'title':
        this.drawTitle(s);
        break;
      case 'overworld':
        this.overworld.draw(s);
        this.box.draw(s, PAL.ui);
        break;
      case 'battle':
        this.battle.draw(s);
        break;
      case 'pause':
        this.overworld.draw(s);
        this.drawPause(s);
        break;
      case 'status':
        this.overworld.draw(s);
        this.drawStatus(s);
        break;
      case 'shop':
        this.overworld.draw(s);
        this.drawShop(s);
        break;
      default:
        s.clear(PAL.mono, 3);
    }

    if (this.trans) this.drawTransition(s);
    s.present(this.ctx);
  }

  /* ---------- transitions ---------- */

  transition(fn) {
    this.trans = { t: 0, fn, fired: false };
  }

  drawTransition(s) {
    const t = this.trans.t;
    const k = t <= 1 ? t : 2 - t;
    const rows = Math.ceil(H * k);
    // close in from alternating edges, the way the hardware did it
    for (let y = 0; y < rows; y++) {
      const yy = y % 2 === 0 ? y >> 1 : H - 1 - (y >> 1);
      s.fillRect(0, yy, W, 1, PAL.mono, 3);
    }
  }

  /* ---------- title ---------- */

  updateTitle(dt) {
    this.titleT += dt;
    const r = this.titleMenu.handle(this.input);
    if (r === 'move') sfx.cursor();
    if (r === 'pick') {
      sfx.confirm();
      sfx.resume();
      const id = this.titleMenu.current.id;
      if (id === 'continue') {
        const save = loadSave() || newSave((Math.random() * 1e9) | 0);
        this.transition(() => this.startGame(save));
      } else if (id === 'new') {
        clearSave();
        this.transition(() => this.startGame(newSave((Math.random() * 1e9) | 0)));
      } else {
        const save = loadSave() || newSave((Math.random() * 1e9) | 0);
        this.transition(() => this.startGame(save, true));
      }
    }
  }

  drawTitle(s) {
    const pal = PAL.ui;
    s.clear(pal, 0);

    // the ratio, drawn literally: seven parts ink, three parts rest
    const barY = 22;
    s.fillRect(14, barY, 132, 8, pal, 1);
    s.fillRect(14, barY, 92, 8, pal, 3);
    s.rect(14, barY, 132, 8, pal, 3);
    s.text('7', 16, barY + 10, pal, { ink: 2 });
    s.textRight('3', 144, barY + 10, pal, { ink: 2 });

    const title = '7-3';
    const tw = Screen.scaledW(title, 4);
    s.textScaled(title, (W - tw) >> 1, 46, pal, 4, { ink: 3 });

    s.textCenter('A NEVERENDING WORKDAY RPG', W >> 1, 84, pal, { ink: 2 });

    s.window(36, 96, 88, 10 + this.titleMenu.items.length * 11, pal);
    this.titleMenu.draw(s, pal, 50, 102, { lineH: 11 });

    if (Math.floor(this.titleT) % 2 === 0) {
      s.textCenter('Z / ENTER', W >> 1, 134, pal, { ink: 1 });
    }
  }

  /* ---------- pause ---------- */

  openPause() {
    sfx.confirm();
    this.scene = 'pause';
    this.pauseMenu.set([
      { id: 'status', label: 'STATUS' },
      { id: 'skills', label: 'SKILLS' },
      { id: 'bag', label: 'BAG' },
      { id: 'auto', label: this.auto.active ? 'AUTO: ON' : 'AUTO: OFF' },
      { id: 'sound', label: sfx.musicOn ? 'SOUND: ON' : 'SOUND: OFF' },
      { id: 'save', label: 'SAVE' },
      { id: 'close', label: 'CLOSE' },
    ]);
  }

  updatePause() {
    const r = this.pauseMenu.handle(this.input);
    if (r === 'move') sfx.cursor();
    if (r === 'cancel' || this.input.pressed.start) {
      sfx.cancel();
      this.scene = 'overworld';
      return;
    }
    if (r !== 'pick') return;
    sfx.confirm();
    const id = this.pauseMenu.current.id;
    if (id === 'close') this.scene = 'overworld';
    else if (id === 'status' || id === 'skills' || id === 'bag') {
      this.statusPage = id;
      this.statusMenu = new Menu(
        id === 'bag'
          ? this.player.itemList.map(([iid, n]) => ({ id: iid, label: ITEM_BY_ID[iid].short, n }))
          : []
      );
      this.scene = 'status';
    } else if (id === 'auto') {
      const on = this.auto.toggle();
      this.pauseMenu.items[3].label = on ? 'AUTO: ON' : 'AUTO: OFF';
      this.syncHud();
    } else if (id === 'sound') {
      sfx.resume();
      const on = sfx.toggleMusic();
      this.pauseMenu.items[4].label = on ? 'SOUND: ON' : 'SOUND: OFF';
    } else if (id === 'save') {
      this.saveNow();
      this.scene = 'overworld';
      this.box.say('Saved.');
    }
  }

  drawPause(s) {
    const pal = PAL.ui;
    const h = 10 + this.pauseMenu.items.length * 11;
    s.window(96, 2, 62, h, pal);
    this.pauseMenu.draw(s, pal, 108, 7, { lineH: 11 });
    // a slim clock strip, so the day is always legible
    const p = this.player;
    s.window(2, 2, 90, 24, pal);
    s.text(`DAY ${p.day}  ${p.clockString()}`, 7, 6, pal);
    s.text(`Lv${p.level}  ${fmtMoney(p.money)}`, 7, 15, pal, { ink: 2 });
  }

  /* ---------- status pages ---------- */

  updateStatus() {
    if (this.statusPage === 'bag' && this.statusMenu.items.length) {
      const r = this.statusMenu.handle(this.input);
      if (r === 'move') sfx.cursor();
      if (r === 'pick') {
        const it = this.statusMenu.current;
        const item = ITEM_BY_ID[it.id];
        const p = this.player;
        if (p.useItem(it.id)) {
          if (item.kind === 'hp' || item.kind === 'both') p.hp += Math.round(p.maxHp * item.amount);
          if (item.kind === 'focus' || item.kind === 'both')
            p.focus += Math.round(p.maxFocus * item.amount);
          sfx.coin();
          this.statusMenu.set(
            p.itemList.map(([iid, n]) => ({ id: iid, label: ITEM_BY_ID[iid].short, n }))
          );
        }
        return;
      }
      if (r === 'cancel') {
        sfx.cancel();
        this.scene = 'pause';
      }
      return;
    }
    if (this.input.pressed.a || this.input.pressed.b || this.input.pressed.start) {
      sfx.cancel();
      this.scene = 'pause';
    }
  }

  drawStatus(s) {
    const pal = PAL.ui;
    const p = this.player;
    s.window(2, 2, 156, 140, pal);
    const x = 9;
    let y = 8;

    if (this.statusPage === 'status') {
      s.text(p.title, x, y, pal);
      y += 11;
      s.text(`LEVEL ${p.level}${p.atMaxLevel ? ' (MAX)' : ''}`, x, y, pal);
      s.textRight(`DAY ${p.day}`, 150, y, pal, { ink: 2 });
      y += 11;
      s.text('EXP ' + commas(p.xp), x, y, pal, { ink: 2 });
      y += 10;
      s.meter(x, y, 132, p.xpProgress, pal, { ink: 2, h: 5 });
      y += 8;
      s.text(
        p.atMaxLevel ? 'Nothing left to climb.' : `NEXT  ${commas(p.xpToNext)}`,
        x,
        y,
        pal,
        { ink: 1 }
      );
      y += 13;
      s.text('HP', x, y, pal);
      s.meter(x + 20, y + 1, 70, p.hp / p.maxHp, pal, { ink: 2 });
      s.textRight(`${p.hp}/${p.maxHp}`, 150, y, pal, { ink: 2 });
      y += 11;
      s.text('FP', x, y, pal);
      s.meter(x + 20, y + 1, 70, p.focus / p.maxFocus, pal, { ink: 2 });
      s.textRight(`${p.focus}/${p.maxFocus}`, 150, y, pal, { ink: 2 });
      y += 11;
      s.text('JOY', x, y, pal);
      s.meter(x + 20, y + 1, 70, p.joy / 100, pal, { ink: 2 });
      s.textRight(`x${p.joyMult.toFixed(2)} XP`, 150, y, pal, { ink: 2 });
      y += 13;
      s.text(`WALLET ${fmtMoney(p.money)}`, x, y, pal);
      y += 11;
      const t = p.s.totals;
      s.text(`TASKS ${commas(t.tasks)}`, x, y, pal, { ink: 2 });
      s.textRight(`STEPS ${abbrev(t.steps)}`, 150, y, pal, { ink: 2 });
      y += 10;
      s.text(`EARNED ${fmtMoney(t.earned)}`, x, y, pal, { ink: 2 });
      s.textRight(`EARLY ${t.clockedOut}`, 150, y, pal, { ink: 2 });
    } else if (this.statusPage === 'skills') {
      s.text('SKILLS', x, y, pal);
      y += 12;
      const known = skillsAt(p.level);
      for (const sk of known) {
        s.text(sk.short, x, y, pal);
        s.textRight(`FP ${sk.cost}`, 150, y, pal, { ink: 2 });
        y += 10;
      }
      const next = SKILLS.find((sk) => sk.level > p.level);
      if (next) {
        y += 6;
        s.text(`NEXT AT Lv${next.level}`, x, y, pal, { ink: 1 });
      }
    } else {
      s.text('BAG', x, y, pal);
      y += 12;
      if (!this.statusMenu.items.length) {
        s.text('Empty. There is a convenience', x, y, pal, { ink: 2 });
        s.text('store on every corner.', x, y + 10, pal, { ink: 2 });
      } else {
        this.statusMenu.draw(s, pal, x + 8, y, {
          lineH: 11,
          render: (it) => `${it.label}  x${it.n}`,
        });
      }
    }
    s.text('B: BACK', x, 130, pal, { ink: 1 });
  }

  /* ---------- shops ---------- */

  openShop(kind) {
    sfx.confirm();
    this.scene = 'shop';
    this.shopKind = kind;
    this.shopStock = SHOPS[kind] || SHOPS.konbini;
    this.shopMenu.set(this.shopStock.map((id) => ({ id, label: ITEM_BY_ID[id].short })));
    this.shopMsg = 'Anything else?';
  }

  closeShop() {
    sfx.cancel();
    this.scene = 'overworld';
  }

  buyItem(id) {
    const item = ITEM_BY_ID[id];
    const p = this.player;
    if (!p.canAfford(item.price)) {
      this.shopMsg = 'Not quite enough.';
      sfx.cancel();
      return false;
    }
    p.spend(item.price);
    p.addItem(id, 1);
    sfx.coin();
    this.shopMsg = `${item.short}. Thank you.`;
    return true;
  }

  updateShop() {
    const r = this.shopMenu.handle(this.input);
    if (r === 'move') sfx.cursor();
    if (r === 'cancel') return this.closeShop();
    if (r === 'pick') this.buyItem(this.shopMenu.current.id);
  }

  drawShop(s) {
    const pal = PAL.ui;
    const p = this.player;
    s.window(2, 2, 156, 84, pal);
    s.text(this.shopKind === 'market' ? 'SUPERMARKET' : 'CONVENIENCE STORE', 9, 7, pal);
    s.textRight(fmtMoney(p.money), 150, 7, pal, { ink: 2 });
    this.shopMenu.draw(s, pal, 18, 22, {
      lineH: 11,
      render: (it) => it.label,
    });
    const cur = this.shopMenu.current;
    if (cur) {
      const item = ITEM_BY_ID[cur.id];
      s.textRight(fmtMoney(item.price), 150, 22 + this.shopMenu.i * 11, pal, { ink: 2 });
      s.text(`HAVE ${p.itemCount(cur.id)}`, 100, 74, pal, { ink: 1 });
    }
    s.window(2, 90, 156, 52, pal);
    s.text(this.shopMsg, 9, 96, pal);
    s.text('B: LEAVE', 9, 126, pal, { ink: 1 });
  }

  /* ---------- battles ---------- */

  startBattle(zone, forcedEnemy = null) {
    sfx.encounter();
    this.transition(() => {
      this.scene = 'battle';
      this.battle.start(zone, forcedEnemy);
    });
  }

  endBattle(kind) {
    this.auto.noteTask();
    this.transition(() => {
      this.scene = 'overworld';
      sfx.setMood(this.player.overtime ? 'overtime' : 'day');
      this.player.advance(3);
      this.saveNow();
      this.syncHud();
    });
  }

  promotionFor(levels) {
    for (const L of levels) {
      const t = promotionAt(L);
      if (t) return t;
    }
    return null;
  }

  /* ---------- day flow ---------- */

  onNewDay() {
    this.transition(() => {
      const p = this.player;
      this.box.say(
        `Day ${p.day}.\nYou wake before the alarm and lie\nthere resenting that.`
      );
      sfx.setMood('day');
      this.saveNow();
    });
  }

  sleepUntilMorning() {
    this.transition(() => {
      this.player.sleep();
      this.box.say(
        `Day ${this.player.day}.\nThe city starts up again outside\nthe window.`
      );
      sfx.setMood('day');
      this.saveNow();
      this.syncHud();
    });
  }

  doActivity(act) {
    const p = this.player;
    p.spend(Math.abs(act.money));
    p.addJoy(act.joy);
    if (act.id === 'izakaya' || act.id === 'karaoke') p.s.totals.drinks++;
    p.advance(75);
    sfx.confirm();
    this.box.say(`${act.text}\n\nJOY +${act.joy}`);
    this.saveNow();
  }

  /**
   * Talk to a person or poke an object. Most hand over something
   * small; a few escalate into an encounter, which is the only way
   * any of them can cost you anything — and it still cannot cost
   * more than an afternoon.
   */
  resolveInteraction(entry, npc = null) {
    if (!entry) return;
    const p = this.player;
    const bits = [];

    if (entry.pay) {
      const amount = Math.max(1, Math.round(payFor(p.level) * Math.abs(entry.pay) * rng.float(0.8, 1.2)));
      if (entry.pay > 0) {
        p.earn(amount);
        bits.push(`+${fmtMoney(amount)}`);
      } else {
        const spent = p.spend(amount);
        if (spent > 0) bits.push(`-${fmtMoney(spent)}`);
      }
    }

    let levels = [];
    if (entry.xp) {
      const gain = Math.round(xpAward(p.level, entry.xp, p.overtime) * p.joyMult);
      levels = p.gainXp(gain);
      bits.push(`+${abbrev(gain)} XP`);
    }

    if (entry.item) {
      p.addItem(entry.item, 1);
      const it = ITEM_BY_ID[entry.item];
      if (it) bits.push(`got ${it.short}`);
    }

    if (entry.joy) {
      p.addJoy(entry.joy);
      bits.push(`${entry.joy > 0 ? '+' : ''}${entry.joy} JOY`);
    }

    p.advance(5);
    sfx.confirm();
    if (entry.pay > 0 || entry.item) sfx.coin();

    const tail = bits.length ? `

${bits.join('  ')}` : '';
    const escalates = entry.fight && rng.chance(entry.fight);
    // strangers speak first, in whatever dialect they turned up with
    const spoken = npc && npc.voice ? voiceLine(npc.voice, rng, npc.voiceLine) : null;
    const body = spoken ? `${spoken}
${entry.text}` : entry.text;

    this.box.say(`${entry.name}
${body}${tail}`, () => {
      if (levels.length) {
        sfx.levelUp();
        const promo = this.promotionFor(levels);
        this.box.say(
          `Level ${levels[levels.length - 1]}.` + (promo ? `
You are now a ${promo}.` : '')
        );
        return;
      }
      if (escalates) this.startBattle(this.overworld.area.kind, entry.enemy);
    });
    this.saveNow();
    this.syncHud();
  }

  /**
   * Feed a machine. Costs real money and usually returns nothing; the
   * point is that it is the one thing in the game you can lose at,
   * and losing costs pocket change.
   */
  playArcade(prop) {
    const p = this.player;
    const pool = prop.claw ? ARCADE_GAMES.filter((g) => g.claw) : ARCADE_GAMES.filter((g) => !g.claw);
    const game = rng.pick(pool.length ? pool : ARCADE_GAMES);
    const stake = Math.max(1, Math.round(payFor(p.level) * game.cost));

    if (!p.canAfford(stake)) {
      sfx.cancel();
      this.box.say(`${game.name}\n${game.intro}\n\nYou do not have ${fmtMoney(stake)}. The machine waits, patiently, forever.`);
      return;
    }

    p.spend(stake);
    const roll = rng.float();
    let outcome;
    let payout = 0;
    let xpGain = 0;
    if (roll < 0.06) {
      outcome = game.jackpot;
      payout = stake * rng.int(4, 7);
      xpGain = Math.round(xpAward(p.level, 1.2) * 0.8);
    } else if (roll < 0.34) {
      outcome = game.win;
      payout = Math.round(stake * rng.float(1.2, 2.4));
      xpGain = Math.round(xpAward(p.level, 0.5) * 0.6);
    } else {
      outcome = game.lose;
      xpGain = Math.round(xpAward(p.level, 0.2) * 0.5);
    }

    const bits = [`-${fmtMoney(stake)}`];
    if (payout > 0) {
      p.earn(payout);
      bits.push(`+${fmtMoney(payout)}`);
      sfx.coin();
    } else {
      sfx.cancel();
    }
    let levels = [];
    if (xpGain > 0) {
      levels = p.gainXp(xpGain);
      bits.push(`+${abbrev(xpGain)} XP`);
    }
    p.addJoy(payout > 0 ? 3 : 1);
    p.advance(10);

    this.box.say(`${game.name}\n${game.intro}\n\n${outcome}\n\n${bits.join('  ')}`, () => {
      if (levels.length) {
        sfx.levelUp();
        const promo = this.promotionFor(levels);
        this.box.say(`Level ${levels[levels.length - 1]}.` + (promo ? `\nYou are now a ${promo}.` : ''));
      }
    });
    this.saveNow();
    this.syncHud();
  }

  /**
   * Buy something you do not need. No stat moves. That is the joke and
   * it is also, quietly, the point of earning any of this.
   */
  buySnack() {
    const p = this.player;
    const snack = rng.pick(SNACKS);
    const price = Math.max(1, Math.round(payFor(p.level) * snack.cost));
    if (!p.canAfford(price)) {
      sfx.cancel();
      this.box.say(`${snack.name} — ${fmtMoney(price)}\n\nYou count what you have. You do not have it. You walk on, with dignity.`);
      return;
    }
    p.spend(price);
    p.addJoy(2);
    p.advance(5);
    sfx.coin();
    this.box.say(`${snack.name} — ${fmtMoney(price)}\n\n${snack.line}\n\n-${fmtMoney(price)}  +2 JOY`);
    this.saveNow();
    this.syncHud();
  }

  announceArea(area, quiet = false) {
    if (quiet) return;
    this.box.say(area.name);
  }

  /* ---------- persistence + shell ---------- */

  saveNow() {
    if (!this.player) return;
    this.player.save();
  }

  syncHud() {
    if (!this.shell || !this.player) return;
    const p = this.player;
    const set = (sel, v) => {
      const el = this.shell.querySelector(sel);
      if (el && el.textContent !== v) el.textContent = v;
    };
    set('[data-hud=level]', String(p.level));
    set('[data-hud=title]', p.title);
    set('[data-hud=xp]', commas(p.xp));
    set('[data-hud=next]', p.atMaxLevel ? '—' : commas(p.xpToNext));
    set('[data-hud=money]', fmtMoney(p.money));
    set('[data-hud=day]', String(p.day));
    set('[data-hud=clock]', p.clockString());
    set('[data-hud=tasks]', commas(p.s.totals.tasks));
    set('[data-hud=area]', this.overworld.area ? this.overworld.area.name : '—');
    const bar = this.shell.querySelector('[data-hud=xpbar]');
    if (bar) bar.style.setProperty('--p', (p.xpProgress * 100).toFixed(2) + '%');
    const ot = this.shell.querySelector('[data-hud=overtime]');
    if (ot) ot.hidden = !p.overtime;
    const auto = this.shell.querySelector('[data-auto-state]');
    if (auto) auto.dataset.autoState = this.auto.active ? 'on' : 'off';
  }
}
