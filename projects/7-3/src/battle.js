/* ============================================================
   7-3 — battles

   Turn-based, Pokemon-shaped, and unloseable in any way that
   lasts. Running out of HP costs you ninety minutes of an
   afternoon and half the experience you had already earned. It
   never costs a level, an item, or a yen.
   ============================================================ */

import { W, H } from './gfx.js';
import { PAL, fade } from './pal.js';
import { PLAYER_BACK } from './actors.js';
import { enemiesFor, PREFIXES, ENEMY_BY_ID } from './enemies.js';
import { SKILL_BY_ID, ITEM_BY_ID, skillsAt } from './content.js';
import { xpAward, abbrev, money as fmtMoney } from './xp.js';
import { payFor } from './state.js';
import { Menu, PAGE_DWELL } from './ui.js';
import { rng } from './rng.js';
import { sfx } from './audio.js';

const LAYOUT = {
  enemySprite: { x: 108, y: 0 },
  enemyBox: { x: 2, y: 4, w: 102, h: 32 },
  playerSprite: { x: 6, y: 42 },
  playerBox: { x: 64, y: 46, w: 94, h: 44 },
  msg: { x: 2, y: 88, w: 156, h: 54 },
  cmd: { x: 84, y: 88, w: 74, h: 54 },
};

const ENEMY_MOVES = [
  'It requires clarification.',
  'It adds a stakeholder.',
  'It is marked high priority.',
  'It asks if you have a minute.',
  'It reopens a settled question.',
  'It arrives with no context at all.',
  'It loops in three more people.',
  'It says "just checking in".',
];

export class Battle {
  constructor(game) {
    this.g = game;
    this.state = 'idle';
    this.queue = [];
    this.timer = 0;
    this.waitingForKey = false;
    this.shake = 0;
    this.enemyFlash = 0;
    this.playerFlash = 0;
    this.enemyHidden = false;
    this.result = null;

    this.cmd = new Menu([
      { id: 'fight', label: 'WORK' },
      { id: 'skill', label: 'SKILL' },
      { id: 'item', label: 'ITEM' },
      { id: 'flee', label: 'CLOCK OUT' },
    ]);
    this.sub = new Menu([]);
  }

  /* ---------- setup ---------- */

  start(zone, forcedEnemy = null) {
    const p = this.g.player;
    const pool = enemiesFor(zone);
    const base = (forcedEnemy && ENEMY_BY_ID[forcedEnemy]) || rng.pick(pool);
    const prefix = rng.weighted(PREFIXES);
    const mult = base.tier * prefix.mult;

    this.e = {
      def: base,
      name: (prefix.name + base.name).trim(),
      baseName: base.name,
      prefixName: prefix.name.trim(),
      art: base.art,
      pal: prefix.pal ? PAL[prefix.pal] : null,
      mult,
      maxHp: Math.max(4, Math.round(p.atk * (2.2 + 0.8 * base.tier) * prefix.mult)),
      atkScale: 0.055 * mult * (p.overtime ? 1.35 : 1),
      buff: 1,
    };
    this.e.hp = this.e.maxHp;
    this.e.shownHp = this.e.maxHp;

    this.shownPlayerHp = p.hp;
    this.shownFocus = p.focus;
    this.state = 'intro';
    this.queue = [];
    this.result = null;
    this.enemyHidden = true;
    this.turns = 0;
    p.buffs = {};

    sfx.setMood('battle');
    this.msg(`${this.e.name} appears!`);
    this.push({ t: 'fn', fn: () => (this.enemyHidden = false) });
    this.msg(this.e.def.taunt);
    this.push({ t: 'fn', fn: () => this.toCommand() });
  }

  /* ---------- the step queue ---------- */

  push(step) {
    this.queue.push(step);
  }

  msg(text, wait = true) {
    this.push({ t: 'msg', text, wait });
  }

  wait(time) {
    this.push({ t: 'wait', time });
  }

  runQueue(dt) {
    // the typewriter runs whether or not anyone has to press a key
    this.g.box.update(dt);
    if (this.waitingForKey) {
      const auto = this.g.auto.active;
      if (auto) {
        this.autoHold = (this.autoHold || 0) + dt;
        const dwell = PAGE_DWELL / this.g.speed;
        if (this.g.box.pageComplete && this.autoHold > dwell) {
          this.autoHold = 0;
          if (this.g.box.advance()) this.waitingForKey = false;
        }
        return true;
      }
      if (this.g.input.pressed.a || this.g.input.pressed.b) {
        if (this.g.box.advance()) this.waitingForKey = false;
        else sfx.cursor();
      }
      return true;
    }

    if (this.timer > 0) {
      this.timer -= dt;
      return true;
    }

    if (!this.queue.length) return false;
    const step = this.queue.shift();
    switch (step.t) {
      case 'msg':
        this.g.box.say(step.text);
        this.autoHold = 0;
        if (step.wait) this.waitingForKey = true;
        // Lines that turn themselves get half the dwell plus their print
        // time: they are short beats between blows, and a manual player
        // sits through these too, so a full 3s each would drag a fight.
        else this.timer = (step.text.length / 52 + PAGE_DWELL * 0.5) / this.g.speed;
        break;
      case 'wait':
        this.timer = step.time / this.g.speed;
        break;
      case 'fn':
        step.fn();
        break;
      case 'fx':
        if (step.kind === 'hitEnemy') {
          this.enemyFlash = 0.3;
          sfx.hit();
        } else if (step.kind === 'crit') {
          this.enemyFlash = 0.45;
          this.shake = 0.3;
          sfx.crit();
        } else if (step.kind === 'hitPlayer') {
          this.playerFlash = 0.3;
          this.shake = 0.22;
          sfx.hurt();
        }
        this.timer = 0.22 / this.g.speed;
        break;
    }
    return true;
  }

  /* ---------- turns ---------- */

  toCommand() {
    this.state = 'command';
    this.g.box.visible = false;
  }

  playerDamage(power, forceCrit = false) {
    const p = this.g.player;
    const crit = forceCrit || rng.chance(1 / 16);
    const roll = rng.float(0.88, 1.12);
    const dmg = Math.max(1, Math.round(p.atk * power * roll * (crit ? 1.8 : 1)));
    return { dmg, crit };
  }

  chooseFight() {
    const { dmg, crit } = this.playerDamage(1);
    this.state = 'busy';
    this.msg('You put your head down and work.', false);
    this.push({ t: 'fx', kind: crit ? 'crit' : 'hitEnemy' });
    this.push({ t: 'fn', fn: () => this.hurtEnemy(dmg) });
    if (crit) this.msg('Straight through it!');
    this.push({ t: 'fn', fn: () => this.afterPlayerTurn() });
  }

  chooseSkill(skill) {
    const p = this.g.player;
    if (p.focus < skill.cost) {
      this.state = 'busy';
      this.msg('Not enough focus. You stare at the\nwall for a moment instead.');
      this.push({ t: 'fn', fn: () => this.toCommand() });
      return;
    }
    p.focus -= skill.cost;
    this.state = 'busy';
    this.msg(`You use ${skill.name}!`, false);
    this.msg(skill.line, false);

    if (skill.kind === 'heal') {
      const amt = Math.round(p.maxHp * skill.power);
      this.push({
        t: 'fn',
        fn: () => {
          p.hp += amt;
          sfx.coin();
        },
      });
      this.msg(`You recover ${amt} HP.`);
    } else if (skill.kind === 'buff') {
      this.push({
        t: 'fn',
        fn: () => {
          p.buffs.atk = skill.power;
          sfx.confirm();
        },
      });
      this.msg('Everything aligns. Briefly.');
    } else if (skill.kind === 'debuff') {
      this.push({
        t: 'fn',
        fn: () => {
          this.e.buff *= skill.power;
          sfx.confirm();
        },
      });
      this.msg('It loses some of its urgency.');
    } else if (skill.kind === 'finish') {
      this.push({ t: 'fx', kind: 'crit' });
      this.push({ t: 'fn', fn: () => this.hurtEnemy(this.e.hp) });
    } else {
      const hits = skill.hits || 1;
      for (let i = 0; i < hits; i++) {
        const { dmg, crit } = this.playerDamage(skill.power, skill.crit);
        this.push({ t: 'fx', kind: crit ? 'crit' : 'hitEnemy' });
        this.push({ t: 'fn', fn: () => this.hurtEnemy(dmg) });
      }
      if (hits > 1) this.msg(`Hit ${hits} times.`);
    }
    this.push({ t: 'fn', fn: () => this.afterPlayerTurn() });
  }

  chooseItem(id) {
    const p = this.g.player;
    const item = ITEM_BY_ID[id];
    if (!item || !p.useItem(id)) {
      this.state = 'busy';
      this.msg('You have none left.');
      this.push({ t: 'fn', fn: () => this.toCommand() });
      return;
    }
    this.state = 'busy';
    this.msg(`You use the ${item.name}.`, false);
    this.push({
      t: 'fn',
      fn: () => {
        if (item.kind === 'hp' || item.kind === 'both') p.hp += Math.round(p.maxHp * item.amount);
        if (item.kind === 'focus' || item.kind === 'both')
          p.focus += Math.round(p.maxFocus * item.amount);
        sfx.coin();
      },
    });
    this.msg(item.line);
    this.push({ t: 'fn', fn: () => this.afterPlayerTurn() });
  }

  chooseFlee() {
    this.state = 'busy';
    sfx.cancel();
    this.msg('You clock out. It will still be\nthere tomorrow. It is very good\nat waiting.');
    this.push({ t: 'fn', fn: () => this.finish('fled') });
  }

  hurtEnemy(dmg) {
    this.e.hp = Math.max(0, this.e.hp - dmg);
    this.lastDamage = dmg;
  }

  afterPlayerTurn() {
    if (this.e.hp <= 0) {
      this.victory();
      return;
    }
    this.enemyTurn();
  }

  enemyTurn() {
    const p = this.g.player;
    this.turns++;
    const dmg = Math.max(
      1,
      Math.round(p.maxHp * this.e.atkScale * this.e.buff * rng.float(0.85, 1.15))
    );
    // people say their own things; paperwork gets the generic set
    const moves = this.e.def.moves || ENEMY_MOVES;
    this.msg(rng.pick(moves), false);
    this.push({ t: 'fx', kind: 'hitPlayer' });
    this.push({
      t: 'fn',
      fn: () => {
        p.hp -= dmg;
        p.focus += 2; // you get a little of it back just by staying
      },
    });
    this.push({
      t: 'fn',
      fn: () => {
        if (p.hp <= 0) this.defeat();
        else this.toCommand();
      },
    });
  }

  /* ---------- endings ---------- */

  victory() {
    const p = this.g.player;
    const gainedXp = Math.round(
      xpAward(p.level, this.e.mult, p.overtime) * p.joyMult
    );
    const cash = Math.round(payFor(p.level) * this.e.mult * rng.float(0.85, 1.15));
    this.state = 'busy';
    this.push({ t: 'fn', fn: () => (this.enemyHidden = true) });
    this.msg(`${this.e.name} is ${this.e.def.verb}.`, false);
    this.msg(this.e.def.bow);
    this.push({
      t: 'fn',
      fn: () => {
        p.s.totals.tasks++;
        // the double experience is not free; it comes out of the evening
        if (p.overtime) p.addJoy(-1);
        sfx.coin();
      },
    });
    this.msg(
      `+${abbrev(gainedXp)} XP` +
        (p.overtime ? '  (OVERTIME x2)' : '') +
        `\n+${fmtMoney(cash)}`
    );
    this.push({
      t: 'fn',
      fn: () => {
        p.earn(cash);
        const levels = p.gainXp(gainedXp);
        if (levels.length) {
          sfx.levelUp();
          const top = levels[levels.length - 1];
          this.msg(
            levels.length === 1
              ? `Level ${top}.\nHP and focus fully restored.`
              : `Level ${top}!  (+${levels.length} levels)\nHP and focus fully restored.`
          );
          const promo = this.g.promotionFor(levels);
          if (promo) this.msg(`You are now a ${promo}.\nNobody mentions it.`);
        }
      },
    });
    this.push({ t: 'fn', fn: () => this.finish('won') });
  }

  defeat() {
    const p = this.g.player;
    this.state = 'busy';
    const consolation = Math.round(xpAward(p.level, this.e.mult, p.overtime) * 0.5);
    this.msg('You are done. Not finished — done.');
    this.msg('You pack up ninety minutes early\nand nobody says a word about it.');
    this.push({
      t: 'fn',
      fn: () => {
        p.gainXp(consolation);
        p.clockOutEarly();
      },
    });
    this.msg(`You still keep +${abbrev(consolation)} XP.\nIt counted. It all counts.`);
    this.push({ t: 'fn', fn: () => this.finish('lost') });
  }

  finish(kind) {
    this.result = kind;
    this.state = 'done';
    this.g.box.visible = false;
    this.g.endBattle(kind);
  }

  /* ---------- update ---------- */

  update(dt) {
    this.enemyFlash = Math.max(0, this.enemyFlash - dt);
    this.playerFlash = Math.max(0, this.playerFlash - dt);
    this.shake = Math.max(0, this.shake - dt);

    // bars chase their real values
    const p = this.g.player;
    const rate = 60 * dt * this.g.speed;
    this.e.shownHp += Math.sign(this.e.hp - this.e.shownHp) * Math.min(Math.abs(this.e.hp - this.e.shownHp), Math.max(1, this.e.maxHp * 0.9 * dt * this.g.speed));
    this.shownPlayerHp += Math.sign(p.hp - this.shownPlayerHp) * Math.min(Math.abs(p.hp - this.shownPlayerHp), Math.max(1, p.maxHp * 0.9 * dt * this.g.speed));
    this.shownFocus += Math.sign(p.focus - this.shownFocus) * Math.min(Math.abs(p.focus - this.shownFocus), Math.max(1, p.maxFocus * 1.2 * dt * this.g.speed));

    if (this.runQueue(dt)) return;
    if (this.state === 'command') this.updateCommand();
    else if (this.state === 'skill') this.updateSub('skill');
    else if (this.state === 'item') this.updateSub('item');
  }

  updateCommand() {
    const g = this.g;
    if (g.auto.active) {
      const pick = g.auto.chooseBattle(this);
      if (pick) this.execute(pick);
      return;
    }
    const r = this.cmd.handle(g.input);
    if (r === 'move') sfx.cursor();
    if (r === 'pick') {
      sfx.confirm();
      this.execute({ kind: this.cmd.current.id });
    }
  }

  execute(pick) {
    const p = this.g.player;
    if (pick.kind === 'fight') this.chooseFight();
    else if (pick.kind === 'flee') this.chooseFlee();
    else if (pick.kind === 'skill') {
      if (pick.id) return this.chooseSkill(SKILL_BY_ID[pick.id]);
      const list = skillsAt(p.level);
      if (!list.length) return this.chooseFight();
      this.sub.set(list.map((s) => ({ id: s.id, label: s.short, cost: s.cost })));
      this.state = 'skill';
    } else if (pick.kind === 'item') {
      if (pick.id) return this.chooseItem(pick.id);
      const list = p.itemList.map(([id, n]) => ({ id, label: ITEM_BY_ID[id].short, n }));
      if (!list.length) {
        this.state = 'busy';
        this.msg('Your bag is empty. There is a\nconvenience store literally\neverywhere.');
        this.push({ t: 'fn', fn: () => this.toCommand() });
        return;
      }
      this.sub.set(list);
      this.state = 'item';
    }
  }

  updateSub(kind) {
    const g = this.g;
    const r = this.sub.handle(g.input);
    if (r === 'move') sfx.cursor();
    if (r === 'cancel') {
      sfx.cancel();
      this.toCommand();
    }
    if (r === 'pick') {
      sfx.confirm();
      const it = this.sub.current;
      if (!it) return this.toCommand();
      if (kind === 'skill') this.chooseSkill(SKILL_BY_ID[it.id]);
      else this.chooseItem(it.id);
    }
  }

  /* ---------- draw ---------- */

  draw(s) {
    const p = this.g.player;
    const pal = p.overtime ? PAL.ot : PAL.office;
    const ui = PAL.ui;
    const sx = this.shake > 0 ? (Math.random() < 0.5 ? -1 : 1) * 2 : 0;

    s.clear(pal, 0);
    // two platforms, the way a Game Boy battle always staged it
    s.fillRect(0, 0, W, H, pal, 0);
    s.ellipse(130, 44, 30, 7, pal, 1);
    s.ellipse(130, 43, 30, 7, pal, 2);
    s.ellipse(130, 42, 30, 7, pal, 1);
    s.ellipse(34, 90, 36, 8, pal, 1);
    s.ellipse(34, 89, 36, 8, pal, 2);
    s.ellipse(34, 88, 36, 8, pal, 1);

    // enemy
    if (!this.enemyHidden) {
      const epal = this.enemyFlash > 0 && Math.floor(this.enemyFlash * 24) % 2 === 0
        ? fade(this.e.pal || ui, 0.75, 0)
        : this.e.pal || ui;
      s.blit(this.e.art, LAYOUT.enemySprite.x + sx, LAYOUT.enemySprite.y, epal);
    }

    // player, from behind
    const ppal = this.playerFlash > 0 && Math.floor(this.playerFlash * 24) % 2 === 0
      ? fade(ui, 0.75, 0)
      : ui;
    s.blit(PLAYER_BACK, LAYOUT.playerSprite.x + sx, LAYOUT.playerSprite.y, ppal);

    // enemy info — the prefix gets its own line so long names survive
    const eb = LAYOUT.enemyBox;
    s.window(eb.x, eb.y, eb.w, eb.h, ui);
    if (this.e.prefixName) {
      s.text(this.e.prefixName, eb.x + 5, eb.y + 4, ui, { ink: 2 });
      s.text(this.e.baseName, eb.x + 5, eb.y + 13, ui);
    } else {
      s.text(this.e.baseName, eb.x + 5, eb.y + 8, ui);
    }
    s.text('HP', eb.x + 5, eb.y + 23, ui);
    s.meter(eb.x + 20, eb.y + 24, eb.w - 27, this.e.shownHp / this.e.maxHp, ui, { ink: 2 });

    // player info
    const pb = LAYOUT.playerBox;
    s.window(pb.x, pb.y, pb.w, pb.h, ui);
    s.text('YOU', pb.x + 5, pb.y + 4, ui);
    s.textRight('Lv' + p.level, pb.x + pb.w - 5, pb.y + 4, ui);
    s.text('HP', pb.x + 5, pb.y + 15, ui);
    s.meter(pb.x + 20, pb.y + 16, pb.w - 27, this.shownPlayerHp / p.maxHp, ui, { ink: 2 });
    s.textRight(
      `${Math.round(this.shownPlayerHp)}/${p.maxHp}`,
      pb.x + pb.w - 5,
      pb.y + 23,
      ui
    );
    s.text('FP', pb.x + 5, pb.y + 33, ui, { ink: 2 });
    s.meter(pb.x + 20, pb.y + 34, pb.w - 27, this.shownFocus / p.maxFocus, ui, { ink: 1 });

    // message / command
    if (this.state === 'command') {
      const m = LAYOUT.msg;
      s.window(m.x, m.y, m.w, m.h, ui);
      s.text('FP ' + p.focus + '/' + p.maxFocus, m.x + 8, m.y + 8, ui, { ink: 2 });
      s.text(this.g.player.clockString(), m.x + 8, m.y + 20, ui, { ink: 2 });
      if (p.overtime) s.text('OVERTIME', m.x + 8, m.y + 32, ui, { ink: 3 });
      const c = LAYOUT.cmd;
      s.window(c.x, c.y, c.w, c.h, ui);
      this.cmd.draw(s, ui, c.x + 12, c.y + 8, { lineH: 11, render: (it) => it.label });
    } else if (this.state === 'skill' || this.state === 'item') {
      const m = LAYOUT.msg;
      s.window(m.x, m.y, m.w, m.h, ui);
      const it = this.sub.current;
      this.sub.draw(s, ui, m.x + 12, m.y + 6, {
        lineH: 11,
        render: (o) =>
          this.state === 'item' ? `${o.label}  x${o.n}` : `${o.label}`,
        dim: (o) => this.state === 'skill' && p.focus < o.cost,
      });
      if (it && this.state === 'skill') s.textRight(`FP ${it.cost}`, m.x + m.w - 6, m.y + 6, ui, { ink: 2 });
    } else {
      this.g.box.draw(s, ui, LAYOUT.msg);
    }
  }
}
