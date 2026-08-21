/* ============================================================
   7-3 — palettes
   Every drawing op resolves through a 4-entry palette, the way
   a real GBC tile does: 0 = lightest, 3 = darkest.
   Area palette swaps are therefore free.
   ============================================================ */

/** pack #rrggbb -> little-endian 0xAABBGGRR for direct Uint32 framebuffer writes */
function pack(hex) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return ((255 << 24) | (b << 16) | (g << 8) | r) >>> 0;
}

const def = (a, b, c, d) => [pack(a), pack(b), pack(c), pack(d)];

export const PAL = {
  // paper-white menu chrome — Pokemon's white box / black text
  ui:      def('#f8f8e8', '#b8c0b0', '#485058', '#101820'),
  // fluorescent-lit office interior
  office:  def('#e8f0f8', '#8fa8c8', '#41597a', '#101828'),
  // the open-plan carpet that functions as tall grass
  carpet:  def('#e0f8c8', '#88c070', '#386830', '#081820'),
  // supermarket: cold white + produce green
  market:  def('#f0f8f0', '#98d0a8', '#3a7050', '#0a1c14'),
  // night street / commute
  street:  def('#e8e0f8', '#9a86c4', '#4c3f74', '#100a20'),
  // izakaya, warm lamps, after-work
  warm:    def('#f8e8c0', '#d8a468', '#7a5232', '#20100a'),
  // apartment, cool and quiet
  home:    def('#dcf0f0', '#7fb8bc', '#365e64', '#08181a'),
  // damage flashes, low HP
  alert:   def('#f8dcdc', '#e08890', '#a03444', '#200808'),
  // the OVERTIME state — everything goes amber-hot
  ot:      def('#f8f0d0', '#e8b048', '#a05820', '#180800'),
  // pure mono, for fades and the boot screen
  mono:    def('#f8f8f8', '#b0b0b0', '#585858', '#101010'),
};

/** Blend a palette toward a flat colour index — used for fades and flashes. */
export function fade(pal, amount, targetIdx = 3) {
  if (amount <= 0) return pal;
  if (amount >= 1) return [pal[targetIdx], pal[targetIdx], pal[targetIdx], pal[targetIdx]];
  const t = pal[targetIdx];
  const tr = t & 255, tg = (t >> 8) & 255, tb = (t >> 16) & 255;
  return pal.map((c) => {
    const r = c & 255, g = (c >> 8) & 255, b = (c >> 16) & 255;
    const nr = Math.round(r + (tr - r) * amount);
    const ng = Math.round(g + (tg - g) * amount);
    const nb = Math.round(b + (tb - b) * amount);
    return ((255 << 24) | (nb << 16) | (ng << 8) | nr) >>> 0;
  });
}
