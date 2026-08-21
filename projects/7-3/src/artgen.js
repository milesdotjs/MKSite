/* ============================================================
   7-3 — sprite construction primitives

   Tiles and actors are hand-pixeled ASCII because they are organic
   shapes. The battle enemies are office objects — envelopes,
   monitors, boxes, clocks — which are geometric, so they are
   composed from primitives instead. Same output format either way:
   { w, h, data:Int8Array } of palette indices, -1 transparent.
   ============================================================ */

export function canvas(w, h) {
  return { w, h, data: new Int8Array(w * h).fill(-1) };
}

export function px(c, x, y, v) {
  x |= 0;
  y |= 0;
  if (x < 0 || y < 0 || x >= c.w || y >= c.h) return c;
  c.data[y * c.w + x] = v;
  return c;
}

export function rect(c, x, y, w, h, v) {
  for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) px(c, xx, yy, v);
  return c;
}

/** Filled box with a 1px outline. */
export function box(c, x, y, w, h, fill, line) {
  rect(c, x, y, w, h, fill);
  if (line !== undefined) frame(c, x, y, w, h, line);
  return c;
}

export function frame(c, x, y, w, h, v) {
  rect(c, x, y, w, 1, v);
  rect(c, x, y + h - 1, w, 1, v);
  rect(c, x, y, 1, h, v);
  rect(c, x + w - 1, y, 1, h, v);
  return c;
}

export function line(c, x0, y0, x1, y1, v) {
  let dx = Math.abs(x1 - x0);
  let dy = -Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  for (;;) {
    px(c, x0, y0, v);
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) {
      err += dy;
      x0 += sx;
    }
    if (e2 <= dx) {
      err += dx;
      y0 += sy;
    }
  }
  return c;
}

export function ellipse(c, cx, cy, rx, ry, v, fill = true) {
  for (let y = -ry; y <= ry; y++) {
    for (let x = -rx; x <= rx; x++) {
      const d = (x * x) / (rx * rx) + (y * y) / (ry * ry);
      if (fill ? d <= 1 : d <= 1 && d > 0.62) px(c, cx + x, cy + y, v);
    }
  }
  return c;
}

/** Outlined disc: filled with `fill`, ringed with `lineV`. */
export function disc(c, cx, cy, r, fill, lineV) {
  ellipse(c, cx, cy, r, r, fill, true);
  if (lineV !== undefined) {
    for (let a = 0; a < 360; a += 2) {
      const t = (a * Math.PI) / 180;
      px(c, Math.round(cx + Math.cos(t) * r), Math.round(cy + Math.sin(t) * r), lineV);
    }
  }
  return c;
}

/** 50% checkerboard shading over a region — the fifth shade. */
export function shade(c, x, y, w, h, v, phase = 0) {
  for (let yy = y; yy < y + h; yy++)
    for (let xx = x + ((yy + phase) & 1); xx < x + w; xx += 2) px(c, xx, yy, v);
  return c;
}

/** Horizontal rule lines — text on paper, without drawing text. */
export function ruled(c, x, y, w, rows, gap, v) {
  for (let i = 0; i < rows; i++) rect(c, x, y + i * gap, w, 1, v);
  return c;
}

/** Only paint where the target is currently transparent. */
export function behind(c, fn) {
  const before = c.data.slice();
  fn(c);
  for (let i = 0; i < c.data.length; i++) if (before[i] >= 0) c.data[i] = before[i];
  return c;
}

/** Add a 1px outline of `v` around every non-transparent pixel. */
export function outline(c, v) {
  const src = c.data.slice();
  const at = (x, y) => (x < 0 || y < 0 || x >= c.w || y >= c.h ? -1 : src[y * c.w + x]);
  for (let y = 0; y < c.h; y++) {
    for (let x = 0; x < c.w; x++) {
      if (at(x, y) >= 0) continue;
      if (at(x - 1, y) >= 0 || at(x + 1, y) >= 0 || at(x, y - 1) >= 0 || at(x, y + 1) >= 0) {
        px(c, x, y, v);
      }
    }
  }
  return c;
}
