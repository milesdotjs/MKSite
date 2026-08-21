/* Art atlas — renders every glyph, tile and actor frame so they can be
   checked in a real render instead of read out of the source. */

import { Screen } from '../src/gfx.js';
import { PAL } from '../src/pal.js';
import { CHARSET, textW } from '../src/font.js';
import { TILES_BY_ID, TILE } from '../src/tiles.js';
import { ACTORS, ACTOR_KINDS, SHADOW } from '../src/actors.js';
import { ENEMIES } from '../src/enemies.js';

/** Size the canvas to the screen and return both. */
function mount(id, w, h) {
  const cv = document.getElementById(id);
  cv.width = w;
  cv.height = h;
  cv.style.width = w * 3 + 'px';
  cv.style.height = h * 3 + 'px';
  return [new Screen(w, h), cv.getContext('2d')];
}

/* ---------- font ---------- */
{
  const [s, ctx] = mount('font', 176, 150);
  s.clear(PAL.ui, 0);
  let x = 2;
  let y = 2;
  for (const ch of CHARSET) {
    const w = textW(ch) || 3;
    if (x + w > s.w - 3) {
      x = 2;
      y += 10;
    }
    s.text(ch, x, y, PAL.ui, { ink: 3 });
    x += w + 3;
  }
  y += 13;
  for (const line of [
    'The quick brown fox',
    'jumps over 13 lazy dogs.',
    '$1,234.56 (99%) [x2] @9am',
    'OVERTIME! +2.84B XP',
    '▶FIGHT ♥HP ♪BGM ♦ ▼',
    'Miles filed a report;',
    'nobody read it. 47/380',
  ]) {
    s.text(line, 2, y, PAL.ui);
    y += 10;
  }
  s.present(ctx);
}

/* ---------- tiles: each shown as a 3x3 patch so tiling shows ---------- */
{
  const COLS = 12;
  const CW = 28;
  const CH = 40;
  const rows = Math.ceil(TILES_BY_ID.length / COLS);
  const [s, ctx] = mount('tiles', COLS * CW + 4, rows * CH + 4);
  s.clear(PAL.office, 0);
  TILES_BY_ID.forEach((t, i) => {
    const x = 4 + (i % COLS) * CW;
    const y = 4 + ((i / COLS) | 0) * CH;
    for (let ty = 0; ty < 3; ty++)
      for (let tx = 0; tx < 3; tx++) s.blit(t.art, x + tx * 8, y + ty * 8, PAL.office);
    s.rect(x - 1, y - 1, 26, 26, PAL.office, 2);
    s.text(t.name.slice(0, 9), x - 1, y + 27, PAL.office, { ink: 3 });
    if (t.task) s.text('*', x + 20, y + 27, PAL.office, { ink: 2 });
  });
  s.present(ctx);
}

/* ---------- actors ---------- */
{
  const [s, ctx] = mount('actors', 200, 4 + ACTOR_KINDS.length * 26);
  s.clear(PAL.office, 0);
  // carpet backdrop so sprites are judged against a real background
  for (let ty = 0; ty * 8 < s.h; ty++)
    for (let tx = 0; tx * 8 < s.w; tx++) s.blit(TILE.CARPET.art, tx * 8, ty * 8, PAL.office);

  ACTOR_KINDS.forEach((k, ki) => {
    const a = ACTORS[k];
    const frames = [
      [a.down[0], false],
      [a.down[1], false],
      [a.up[0], false],
      [a.up[1], false],
      [a.side[0], false],
      [a.side[1], false],
      [a.side[0], true],
      [a.side[1], true],
    ];
    const y = 4 + ki * 26;
    frames.forEach(([fr, flip], fi) => {
      const x = 2 + fi * 19;
      s.blit(SHADOW, x + 4, y + 14, PAL.office);
      s.blit(fr, x, y, PAL.office, { flipX: flip });
    });
    s.text(k, 2 + frames.length * 19 + 4, y + 5, PAL.office, { ink: 3 });
  });
  s.present(ctx);
}

/* ---------- ui chrome, at true screen size ---------- */
{
  const [s, ctx] = mount('chrome', 160, 144);
  s.clear(PAL.office, 0);
  for (let ty = 0; ty < 8; ty++)
    for (let tx = 0; tx < 20; tx++) s.blit(TILE.CARPET.art, tx * 8, ty * 8, PAL.office);

  // status strip
  s.window(2, 2, 100, 30, PAL.ui);
  s.text('SALARYMAN', 6, 6, PAL.ui);
  s.textRight('Lv47', 98, 6, PAL.ui);
  s.text('HP', 6, 18, PAL.ui);
  s.meter(20, 19, 48, 0.62, PAL.ui, { ink: 2 });
  s.textRight('312/380', 98, 17, PAL.ui);

  // command menu
  s.window(104, 2, 54, 42, PAL.ui);
  s.text('▶FIGHT', 108, 6, PAL.ui);
  s.text(' SKILL', 108, 16, PAL.ui);
  s.text(' ITEM', 108, 26, PAL.ui);
  s.text(' CLOCK', 108, 36, PAL.ui);

  // dialogue box, the standard bottom-anchored frame
  s.window(2, 94, 156, 48, PAL.ui);
  s.text('A wild QUARTERLY REPORT', 8, 100, PAL.ui);
  s.text('lurches out of the shared', 8, 110, PAL.ui);
  s.text('drive!', 8, 120, PAL.ui);
  s.text('▼', 148, 131, PAL.ui);
  s.present(ctx);
}

/* ---------- palette sweep ---------- */
{
  const names = Object.keys(PAL);
  const [s, ctx] = mount('pals', 176, names.length * 14);
  names.forEach((n, i) => {
    const y = i * 14;
    const p = PAL[n];
    s.fillRect(0, y, s.w, 14, p, 0);
    for (let k = 0; k < 4; k++) s.fillRect(2 + k * 10, y + 2, 9, 9, p, k);
    s.text(n, 46, y + 3, p, { ink: 3 });
    s.blit(TILE.CARPET.art, 92, y + 3, p);
    s.blit(TILE.DESK.art, 102, y + 3, p);
    s.blit(ACTORS.salaryman.down[0], 114, y - 1, p);
    s.meter(134, y + 5, 20, 0.6, p, { ink: 2 });
    s.text('♥', 158, y + 3, p, { ink: 3 });
  });
  s.present(ctx);
}

/* ---------- enemies ---------- */
{
  const COLS = 6;
  const CW = 50;
  const CH = 58;
  const rows = Math.ceil(ENEMIES.length / COLS);
  const [s, ctx] = mount('enemies', COLS * CW + 4, rows * CH + 4);
  s.clear(PAL.ui, 0);
  ENEMIES.forEach((e, i) => {
    const x = 4 + (i % COLS) * CW;
    const y = 4 + ((i / COLS) | 0) * CH;
    s.blit(e.art, x, y, PAL.ui);
    s.rect(x - 1, y - 1, 46, 46, PAL.ui, 1);
    s.text(e.name.slice(0, 15), x - 1, y + 47, PAL.ui, { ink: 3 });
  });
  s.present(ctx);
}

window.__ready = true;
