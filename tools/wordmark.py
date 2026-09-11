# -*- coding: utf-8 -*-
"""MILES KING as a tube-frame wordmark, built the way the Air Gear logo is built.

The エア・ギア wordmark on the Kodansha covers is not chrome-gradient type. Each
letter is plumbing: a chrome tube bent round the letter's outline, a black
keyline outside it, and a tinted glass plate inside it that the drawing behind
shows through (v01 lavender, v18 clear, v37 spectrum). Clamp collars and split
rings sit where parts join. This module rebuilds that CONSTRUCTION for original
Latin letters. Nothing is traced from the Kodansha logo; only how it is built
is borrowed.

How the frame is drawn:
  each letter is a set of centreline polylines. The tube frame is a MASK RING:
  the union of wide strokes minus the union of narrow strokes. Because it is a
  union, junctions (the E's middle arm meeting its stem, the K's arms) open into
  one continuous channel the way a hollow letter would, instead of every bar
  being outlined on its own. The glass is the narrow stroke region filled with
  the plate gradient; the tube shading is concentric strokes clipped to the ring.

Rejected on real renders (so nobody re-tries them):
  - a solid cel-shaded bar: bands built from shifted copies blotch at every
    corner, and any single global shift runs parallel to some bar and floods it.
  - sharp miters where a diagonal meets a stem (M, N): the join is so acute it
    bevels into a notch. Those corners get a short flat run before the diagonal.

Every bar carries data-bar="<n>" (on each of its copies) so motion can assemble
the name bar by bar.

    from wordmark import wordmark_svg
    wordmark_svg('MILES KING', 'hero')                 # one line
    wordmark_svg(['MILES', 'KING'], 'hero-m')          # stacked, for phones
"""
import math

H = 100.0          # cap height, centreline box
W = 24.0           # tube-frame stroke width
TUBE = 6.0         # width of one tube; the glass is W - 2*TUBE
KW = 3.8           # outer keyline
SPUR = 15.0        # S / G terminal spurs (without them they read 5 and 6)
FLAT = 12.0        # flat run before a diagonal leaves a stem (M, N)
LINE_GAP = 30.0

def _chamfer(pts, c):
    """Cut right-angle corners into 45-degree mitres (never past half a segment)."""
    out = [pts[0]]
    for i in range(1, len(pts) - 1):
        (ax, ay), (bx, by), (cx, cy) = pts[i - 1], pts[i], pts[i + 1]
        ux, uy, vx, vy = bx - ax, by - ay, cx - bx, cy - by
        lu, lv = math.hypot(ux, uy), math.hypot(vx, vy)
        ux, uy, vx, vy = ux / lu, uy / lu, vx / lv, vy / lv
        if abs(ux * vx + uy * vy) < 0.2:
            ce = min(c, 0.45 * lu, 0.45 * lv)
            out.append((bx - ux * ce, by - uy * ce))
            out.append((bx + vx * ce, by + vy * ce))
        else:
            out.append((bx, by))
    out.append(pts[-1])
    return out

def _glyphs():
    IN = W / 2 + 1
    T, B, M = IN, H - IN, H / 2
    ch = W * 0.44
    k = (W - 17.0) * 0.9                      # heavy strokes need wider letters to keep counters open
    def g(w, *lines, **kw):
        return {'w': w, 'lines': [_chamfer(l, ch) for l in lines], 'collar': kw.get('collar'), 'ring': kw.get('ring')}
    wm, wl, we, ws, wk, wn, wg = 84 + 2 * k, 58 + k, 60 + k, 62 + k, 64 + k, 70 + 1.5 * k, 66 + k
    return {
        'M': g(wm, [(IN, B), (IN, T), (IN + FLAT, T), (wm / 2, 60), (wm - IN - FLAT, T), (wm - IN, T), (wm - IN, B)]),
        # No collar on the I. Any band across a hollow I reads as part of the
        # letter: at mid-height a hyphen ("M-ILES"), in the upper third the dot
        # of a lowercase i ("MiLES"). The K's coupling ring carries the plumbing.
        'I': g(2 * IN, [(IN, T), (IN, B)]),
        'L': g(wl, [(IN, T), (IN, B), (wl - IN, B)]),
        'E': g(we, [(we - IN, T), (IN, T), (IN, B), (we - IN, B)], [(IN, M), (we - IN - 9, M)]),
        'S': g(ws, [(ws - IN, T + SPUR), (ws - IN, T), (IN, T), (IN, M), (ws - IN, M),
                    (ws - IN, B), (IN, B), (IN, B - SPUR)]),
        # K arms finish on a short vertical so the terminals sit flat on the cap/base line
        'K': g(wk, [(IN, T), (IN, B)],
               # the upper arm stops short of the stem's centre: a free arm ending on
               # a stem must end INSIDE it, or its square cap pokes past the keyline
               [(wk - IN, T), (wk - IN, T + 9), (IN + 7, M + 1)],
               [(IN + 16 + k * .4, M - 7), (wk - IN, B - 9), (wk - IN, B)], ring=(IN, M + 5)),
        'N': g(wn, [(IN, B), (IN, T), (IN + FLAT, T), (wn - IN - FLAT, B), (wn - IN, B), (wn - IN, T)]),
        'G': g(wg, [(wg - IN, T + SPUR), (wg - IN, T), (IN, T), (IN, B), (wg - IN, B),
                    (wg - IN, M - 3), (38 + k * .5, M - 3)]),
    }

GLYPHS = _glyphs()

def _layout(lines, track, space, align):
    def measure(t):
        x = 0.0
        for ch in t:
            x += space if ch == ' ' else GLYPHS[ch]['w'] + track
        return x - track
    widths = [measure(t) for t in lines]
    width = max(widths)
    polys, collars, rings, bounds = [], [], [], []
    for li, t in enumerate(lines):
        x = (width - widths[li]) / 2 if align == 'center' else 0.0
        y0 = li * (H + LINE_GAP)
        for ch in t:
            if ch == ' ':
                x += space
                continue
            g = GLYPHS[ch]
            for l in g['lines']:
                polys.append([(x + px, y0 + py) for px, py in l])
            if g['collar']:
                collars.append((x + g['collar'][0], y0 + g['collar'][1]))
            if g['ring']:
                rings.append((x + g['ring'][0], y0 + g['ring'][1]))
            bounds.append((x, x + g['w'], y0))
            x += g['w'] + track
    height = len(lines) * H + (len(lines) - 1) * LINE_GAP
    return polys, collars, rings, bounds, width, height

def _d(pts):
    return 'M' + 'L'.join('%.1f %.1f' % p for p in pts)

# plate tints. spectrum = v37 measured top to bottom through one letter plate
PLATES = {
    'spectrum': (('0', '#0da6a1'), ('.17', '#229ad6'), ('.34', '#8898d3'), ('.5', '#9b7ebc'),
                 ('.67', '#ae70b2'), ('.84', '#ce86a8'), ('1', '#c9b3b2')),
    'lavender': (('0', '#b7c0e4'), ('1', '#a6b0d9')),
    'clear':    (('0', '#ffffff'), ('1', '#e8eef3')),
}

# tube cross-section, painted wide -> narrow and clipped to the ring: outer shade,
# body, specular line at mid-tube, inner body, inner shade, inner keyline
def _tube(inner):
    # darker body than a pastel outline, so it reads as chrome plumbing
    return ((W, '#5f6772'), (W - 2.2, '#c3c9d0'), (W - TUBE + 1.8, '#ffffff'),
            (W - TUBE - 1.4, '#aab1b9'), (inner + 2.6, '#747c86'), (inner, '#0c0d11'))

def _fittings(collars, rings):
    parts = []
    for cx, cy in collars:
        # a sleeve that only just clears the tube's keyline -- wider and it
        # stuck out past the letter like punctuation
        ow, oh = W + 2 * KW + 2, 10.5
        bw, bh = ow - 3.6, 7.0
        parts.append('<g class="wm-cl"><rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" rx="1.2" class="kf"/>'
                     '<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" class="mf"/>'
                     '<rect x="%.1f" y="%.1f" width="%.1f" height="2" class="hf"/>'
                     '<rect x="%.1f" y="%.1f" width="%.1f" height="1.6" class="sf"/></g>' % (
                         cx - ow / 2, cy - oh / 2, ow, oh,
                         cx - bw / 2, cy - bh / 2, bw, bh, cx - bw / 2, cy - bh / 2, bw, cx - bw / 2, cy + bh / 2 - 1.6, bw))
    for cx, cy in rings:
        r = W * .42          # ring + keyline stay inside the stem; bigger read as a bullet
        parts.append('<g class="wm-rg"><circle cx="%.1f" cy="%.1f" r="%.1f" class="kf"/>'
                     '<circle cx="%.1f" cy="%.1f" r="%.1f" class="mf"/>'
                     '<path d="M%.1f %.1fA%.1f %.1f 0 0 1 %.1f %.1f" class="hs"/>'
                     '<circle cx="%.1f" cy="%.1f" r="%.1f" class="kf"/>'
                     '<circle cx="%.1f" cy="%.1f" r="%.1f" class="sf"/></g>' % (
                         cx, cy, r + KW, cx, cy, r, cx - r * .7, cy - r * .2, r * .72, r * .72, cx + r * .2, cy - r * .7,
                         cx, cy, r * .46, cx, cy, r * .2))
    return ''.join(parts)

def wordmark_svg(text, uid, plate='spectrum', cls='wm', pad=16.0, align='left', track=13.0):
    """Returns an inline <svg>. `uid` must be unique per page (ids are scoped with it)."""
    lines = [text] if isinstance(text, str) else list(text)
    polys, collars, rings, bounds, width, height = _layout(lines, track, 36.0, align)
    inner = W - 2 * TUBE
    # construction drawing behind the glass: cap line, baseline, a dashed centre
    # line and ticks at every letter's edges. The plate is tinted glass, and
    # glass needs a real drawing behind it or it's just gradient text.
    # the right overshoot is short: the hero's kana credit sits just past the name
    top_off, bot_off, ext, ext_r = 1 - KW, H - 1 + KW, 60.0, 24.0
    rules, mids, ticks = [], [], []
    for li in range(len(lines)):
        y0 = li * (H + LINE_GAP)
        for yy in (y0 + top_off, y0 + bot_off):
            rules.append('M%.1f %.1fH%.1f' % (-pad - ext, yy, width + pad + ext_r))
        mids.append('M%.1f %.1fH%.1f' % (-pad - ext, y0 + H / 2, width + pad + ext_r))
    for bx0, bx1, by0 in bounds:
        for bx in (bx0, bx1):
            ticks.append('M%.1f %.1fv-7M%.1f %.1fv7' % (bx, by0 + top_off, bx, by0 + bot_off))
    cons = '<g class="wm-cons"><path d="%s %s"/><path class="mid" d="%s"/></g>' % (
        ' '.join(rules), ' '.join(ticks), ' '.join(mids))
    # each bar is defined ONCE (data-bar on the def); the nine layers <use> it,
    # so motion tweens one element per bar and every copy follows
    defs = ['<path id="%s-%d" data-bar="%d" d="%s"/>' % (uid, i, i, _d(p)) for i, p in enumerate(polys)]
    uses = ''.join('<use href="#%s-%d"/>' % (uid, i) for i in range(len(polys)))
    mw, mh = width + 160, height + 160
    defs.append('<mask id="%(u)s-fr" maskUnits="userSpaceOnUse" x="-80" y="-80" width="%(mw).0f" height="%(mh).0f">'
                '<g stroke="#fff" stroke-width="%(a).1f">%(uses)s</g><g stroke="#000" stroke-width="%(b).1f">%(uses)s</g></mask>'
                '<mask id="%(u)s-gl" maskUnits="userSpaceOnUse" x="-80" y="-80" width="%(mw).0f" height="%(mh).0f">'
                '<g stroke="#fff" stroke-width="%(c).1f">%(uses)s</g></mask>' % {
                    'u': uid, 'mw': mw, 'mh': mh, 'uses': uses, 'a': W + 2 * KW, 'b': inner - 1.6, 'c': inner + 0.8})
    stops = ''.join('<stop offset="%s" stop-color="%s"/>' % s for s in PLATES[plate])
    glass = []
    for li in range(len(lines)):
        y0 = li * (H + LINE_GAP)
        defs.append('<linearGradient id="%s-pl%d" gradientUnits="userSpaceOnUse" x1="0" y1="%.1f" x2="0" y2="%.1f">%s</linearGradient>' % (
            uid, li, y0 + W / 2, y0 + H - W / 2, stops))
        glass.append('<rect x="-20" y="%.1f" width="%.0f" height="%.1f" fill="url(#%s-pl%d)"/>' % (y0 - 10, width + 40, H + 20, uid, li))
    defs.append('<linearGradient id="%s-sh" x1="0" y1="0" x2="1" y2="1">'
                '<stop offset=".3" stop-color="#fff" stop-opacity="0"/><stop offset=".46" stop-color="#fff" stop-opacity=".55"/>'
                '<stop offset=".54" stop-color="#fff" stop-opacity="0"/></linearGradient>' % uid)
    rings_ = ''.join('<g stroke="%s" stroke-width="%.1f">%s</g>' % (c, w, uses) for w, c in _tube(inner))
    return ('<svg class="%(cls)s" viewBox="%(vx).1f %(vy).1f %(vw).1f %(vh).1f" aria-hidden="true" focusable="false">'
            '<defs>%(defs)s</defs>%(cons)s'
            '<g class="wm-glass" mask="url(#%(u)s-gl)">%(glass)s'
            '<rect class="wm-sheen" x="-20" y="-20" width="%(tw).0f" height="%(th).0f" fill="url(#%(u)s-sh)"/></g>'
            '<g class="wm-frame" mask="url(#%(u)s-fr)"><rect x="-40" y="-40" width="%(tw).0f" height="%(th).0f" class="kf"/>%(rings)s</g>'
            '<g class="wm-fit">%(fit)s</g></svg>') % {
        'cls': cls, 'u': uid, 'vx': -pad, 'vy': -pad, 'vw': width + 2 * pad, 'vh': height + 2 * pad,
        'defs': ''.join(defs), 'cons': cons, 'glass': ''.join(glass), 'tw': width + 80, 'th': height + 80,
        'rings': rings_, 'fit': _fittings(collars, rings)}

if __name__ == '__main__':
    one = wordmark_svg('MILES KING', 'a')
    print('one-line %d bytes' % len(one))
