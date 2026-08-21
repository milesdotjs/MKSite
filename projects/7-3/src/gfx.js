/* ============================================================
   7-3 — software framebuffer

   Everything is drawn into a 160x144 Uint32Array (a real Game
   Boy screen) and blitted once per frame. Nothing anti-aliases,
   nothing sub-pixels, and integer scaling keeps it crisp.
   ============================================================ */

import { glyph, charW, textW, LINE_H, TRACKING } from './font.js';

const SPACE_ADVANCE = 3;

export const W = 160;
export const H = 144;

/** Parse ASCII sprite art into { w, h, data:Int8Array } of palette indices, -1 = transparent. */
export function sprite(art) {
  const rows = String(art).trim().split('\n').map((r) => r.replace(/\s+$/, ''));
  const w = Math.max(...rows.map((r) => r.length));
  const h = rows.length;
  const data = new Int8Array(w * h).fill(-1);
  for (let y = 0; y < h; y++) {
    const row = rows[y];
    for (let x = 0; x < w; x++) {
      const c = row[x];
      if (c >= '0' && c <= '3') data[y * w + x] = +c;
    }
  }
  return { w, h, data };
}

export class Screen {
  constructor(w = W, h = H) {
    this.w = w;
    this.h = h;
    this.img = new ImageData(w, h);
    this.buf = new Uint32Array(this.img.data.buffer);
    this.clipY0 = 0;
    this.clipY1 = h;
  }

  /** Restrict drawing to a horizontal band. Used for the battle/overworld split. */
  clip(y0 = 0, y1 = this.h) {
    this.clipY0 = Math.max(0, y0);
    this.clipY1 = Math.min(this.h, y1);
  }

  clear(pal, idx = 0) {
    this.buf.fill(pal[idx]);
  }

  px(x, y, pal, idx) {
    x |= 0;
    y |= 0;
    if (x < 0 || x >= this.w || y < this.clipY0 || y >= this.clipY1) return;
    this.buf[y * this.w + x] = pal[idx];
  }

  fillRect(x, y, w, h, pal, idx) {
    const c = pal[idx];
    const x0 = Math.max(0, x | 0);
    const x1 = Math.min(this.w, (x | 0) + w);
    const y0 = Math.max(this.clipY0, y | 0);
    const y1 = Math.min(this.clipY1, (y | 0) + h);
    for (let yy = y0; yy < y1; yy++) {
      const row = yy * this.w;
      this.buf.fill(c, row + x0, row + x1);
    }
  }

  /** Filled ellipse — the battle platforms stand on these. */
  ellipse(x, y, rx, ry, pal, idx) {
    for (let dy = -ry; dy <= ry; dy++) {
      const k = 1 - (dy * dy) / (ry * ry);
      if (k < 0) continue;
      const dx = Math.round(rx * Math.sqrt(k));
      this.fillRect(x - dx, y + dy, dx * 2 + 1, 1, pal, idx);
    }
  }

  /** 1px outline rectangle. */
  rect(x, y, w, h, pal, idx) {
    this.fillRect(x, y, w, 1, pal, idx);
    this.fillRect(x, y + h - 1, w, 1, pal, idx);
    this.fillRect(x, y, 1, h, pal, idx);
    this.fillRect(x + w - 1, y, 1, h, pal, idx);
  }

  /** 50% checkerboard fill — the classic way to fake a fifth shade. */
  dither(x, y, w, h, pal, idx, phase = 0) {
    const c = pal[idx];
    const y0 = Math.max(this.clipY0, y | 0);
    const y1 = Math.min(this.clipY1, (y | 0) + h);
    const x0 = Math.max(0, x | 0);
    const x1 = Math.min(this.w, (x | 0) + w);
    for (let yy = y0; yy < y1; yy++) {
      for (let xx = x0 + (((yy + phase) & 1) ? 1 : 0); xx < x1; xx += 2) {
        this.buf[yy * this.w + xx] = c;
      }
    }
  }

  blit(spr, x, y, pal, opts = {}) {
    const { flipX = false, flipY = false, tint = null } = opts;
    const { w, h, data } = spr;
    for (let sy = 0; sy < h; sy++) {
      const dy = (y | 0) + (flipY ? h - 1 - sy : sy);
      if (dy < this.clipY0 || dy >= this.clipY1) continue;
      for (let sx = 0; sx < w; sx++) {
        const v = data[sy * w + sx];
        if (v < 0) continue;
        const dx = (x | 0) + (flipX ? w - 1 - sx : sx);
        if (dx < 0 || dx >= this.w) continue;
        this.buf[dy * this.w + dx] = pal[tint === null ? v : tint];
      }
    }
  }

  /**
   * Draw text. Returns the advance width.
   * `ink` is the palette index of the glyph body; `shadow`, when set,
   * paints a 1px offset copy first — Pokemon's drop-shadowed font.
   */
  text(str, x, y, pal, opts = {}) {
    const { ink = 3, shadow = null, max = Infinity } = opts;
    let cx = x | 0;
    for (const ch of String(str)) {
      if (cx - x > max) break;
      if (ch !== ' ') {
        const g = glyph(ch);
        if (shadow !== null) this._glyph(g, cx + 1, (y | 0) + 1, pal, shadow);
        this._glyph(g, cx, y | 0, pal, ink);
      }
      cx += charW(ch);
    }
    return cx - x - TRACKING;
  }

  _glyph(g, x, y, pal, idx) {
    const c = pal[idx];
    const { w, bits } = g;
    for (let gy = 0; gy < 8; gy++) {
      const m = bits[gy];
      if (!m) continue;
      const dy = y + gy;
      if (dy < this.clipY0 || dy >= this.clipY1) continue;
      const row = dy * this.w;
      for (let gx = 0; gx < w; gx++) {
        if (!(m & (0x80 >> gx))) continue;
        const dx = x + gx;
        if (dx < 0 || dx >= this.w) continue;
        this.buf[row + dx] = c;
      }
    }
  }

  /**
   * Chunky title text: every glyph pixel becomes an NxN block.
   * Period-correct — the hardware had one font and title screens
   * simply drew it bigger.
   */
  textScaled(str, x, y, pal, scale = 2, opts = {}) {
    const { ink = 3, shadow = null } = opts;
    let cx = x | 0;
    for (const ch of String(str)) {
      if (ch === ' ') {
        cx += (SPACE_ADVANCE + 1) * scale;
        continue;
      }
      const g = glyph(ch);
      for (let gy = 0; gy < 8; gy++) {
        const m = g.bits[gy];
        if (!m) continue;
        for (let gx = 0; gx < g.w; gx++) {
          if (!(m & (0x80 >> gx))) continue;
          if (shadow !== null)
            this.fillRect(cx + gx * scale + scale, (y | 0) + gy * scale + scale, scale, scale, pal, shadow);
        }
      }
      for (let gy = 0; gy < 8; gy++) {
        const m = g.bits[gy];
        if (!m) continue;
        for (let gx = 0; gx < g.w; gx++) {
          if (!(m & (0x80 >> gx))) continue;
          this.fillRect(cx + gx * scale, (y | 0) + gy * scale, scale, scale, pal, ink);
        }
      }
      cx += (g.w + 1) * scale;
    }
    return cx - x - scale;
  }

  /** Width of textScaled output, for centring. */
  static scaledW(str, scale) {
    let w = 0;
    for (const ch of str) w += ((ch === ' ' ? SPACE_ADVANCE : glyph(ch).w) + 1) * scale;
    return Math.max(0, w - scale);
  }

  textCenter(str, cx, y, pal, opts) {
    return this.text(str, (cx - textW(str) / 2) | 0, y, pal, opts);
  }

  textRight(str, rx, y, pal, opts) {
    return this.text(str, (rx - textW(str)) | 0, y, pal, opts);
  }

  /** Multi-line block. Returns the y just past the last line. */
  textBlock(lines, x, y, pal, opts = {}) {
    let cy = y;
    for (const line of lines) {
      this.text(line, x, cy, pal, opts);
      cy += opts.lineH || LINE_H;
    }
    return cy;
  }

  /**
   * The signature Game Boy dialogue frame: paper fill, dark 1px
   * border with the four corner pixels knocked out, and a light
   * inner bevel so it reads as raised.
   */
  window(x, y, w, h, pal, opts = {}) {
    const { fill = 0, border = 3, bevel = 1 } = opts;
    this.fillRect(x, y, w, h, pal, fill);
    this.rect(x, y, w, h, pal, border);
    // knock the corners out to round the frame
    this.px(x, y, pal, fill);
    this.px(x + w - 1, y, pal, fill);
    this.px(x, y + h - 1, pal, fill);
    this.px(x + w - 1, y + h - 1, pal, fill);
    if (bevel !== null) {
      this.fillRect(x + 2, y + 2, w - 4, 1, pal, bevel);
      this.fillRect(x + 2, y + 2, 1, h - 4, pal, bevel);
    }
  }

  /** Horizontal meter (HP / focus / XP). Filled portion uses `ink`. */
  meter(x, y, w, frac, pal, opts = {}) {
    const { ink = 2, back = 1, border = 3, h = 4 } = opts;
    this.rect(x, y, w, h, pal, border);
    this.fillRect(x + 1, y + 1, w - 2, h - 2, pal, back);
    const inner = w - 2;
    const n = Math.max(frac > 0 ? 1 : 0, Math.round(inner * Math.min(1, Math.max(0, frac))));
    if (n > 0) this.fillRect(x + 1, y + 1, n, h - 2, pal, ink);
  }

  present(ctx) {
    ctx.putImageData(this.img, 0, 0);
  }
}
