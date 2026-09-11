# -*- coding: utf-8 -*-
"""Instrument drawings for the spec-sheet theme -- all computed, like the gears
and wheel before them. Each piece is lifted from a specific Air Gear cover:

    dial_bezel()     v30  the giant tachometer bezel in the hero's black band:
                          double hairline rings, long/short ticks, dot sub-ticks,
                          upright numerals, and the red 0-10 calibration sub-scale
                          with an index pointer that motion sweeps on load
    subdial()        v15  a chronograph sub-dial, used as a skill meter
    blueprint_a/b()  v01  line-drawn machine parts that share centres and mesh
    gear_train()     v15  a meshed gear plate: flat greys, keyline, edge light,
                          true tooth ratios exposed as data attributes for motion
    roundel()        every volume: black disc, thick white ring, glyphs

Angles: 0 deg points up and positive runs clockwise (same as tools/wheel.py).
Static markup always shows the FINAL state (needles at value, arcs drawn), so
the page reads correctly with JavaScript off; motion animates from rest.
"""
import math

def P(cx, cy, r, deg):
    a = math.radians(deg - 90.0)
    return cx + r * math.cos(a), cy + r * math.sin(a)

def arc(cx, cy, r, a0, a1):
    x0, y0 = P(cx, cy, r, a0)
    x1, y1 = P(cx, cy, r, a1)
    large = 1 if abs(a1 - a0) > 180 else 0
    sweep = 1 if a1 > a0 else 0
    return 'M%.1f %.1fA%.1f %.1f 0 %d %d %.1f %.1f' % (x0, y0, r, r, large, sweep, x1, y1)

def circle(cx, cy, r):
    return '<circle cx="%.1f" cy="%.1f" r="%.1f"/>' % (cx, cy, r)

# ------------------------------------------------------------------ v30 bezel
def dial_bezel(cx, cy, r, a0, a1, units, cal=(-6.0, 6.0), rest=0.0):
    """Arc of a big tachometer ring from angle a0 to a1 with `units` numbered
    majors. `cal` is the angular span of the red 0-10 calibration sub-scale.
    The ring and numerals sit in .dz-turn so scroll can rotate them about the
    centre; the index pointer is .dz-idx (data-* carry the geometry for JS)."""
    ticks, dots, nums = [], [], []
    step = (a1 - a0) / units
    for i in range(units * 4 + 1):
        a = a0 + step * i / 4.0
        if i % 4 == 0:
            ticks.append('M%.1f %.1fL%.1f %.1f' % (P(cx, cy, r - 30, a) + P(cx, cy, r - 8, a)))
            x, y = P(cx, cy, r - 50, a)
            nums.append('<text x="%.1f" y="%.1f">%d</text>' % (x, y + 6, i // 4))
        elif i % 2 == 0:
            ticks.append('M%.1f %.1fL%.1f %.1f' % (P(cx, cy, r - 20, a) + P(cx, cy, r - 8, a)))
        else:
            dots.append(circle(*(P(cx, cy, r - 14, a) + (1.6,))))
    c0, c1 = cal
    cal_t, cal_n = [], []
    for i in range(51):
        a = c0 + (c1 - c0) * i / 50.0
        big = i % 5 == 0
        cal_t.append('M%.1f %.1fL%.1f %.1f' % (P(cx, cy, r - 86 - (10 if big else 0), a) + P(cx, cy, r - 80, a)))
        if i in (0, 50):
            x, y = P(cx, cy, r - 112, a)
            cal_n.append('<text x="%.1f" y="%.1f">%d</text>' % (x, y + 5, i // 5))
    # index pointer: a slim wedge just inside the calibration arc, drawn at 0
    tip, b1, b2 = P(cx, cy, r - 99, c0), P(cx, cy, r - 121, c0 - 0.32), P(cx, cy, r - 121, c0 + 0.32)
    sweep = (c1 - c0) * rest / 10.0
    return ('<g class="dz">'
            '<g class="dz-turn"><path class="dz-ring" d="%s %s"/>'
            '<path class="dz-tick" d="%s"/><g class="dz-dot">%s</g><g class="dz-num">%s</g></g>'
            '<path class="dz-cal" d="%s %s"/><g class="dz-caln">%s</g>'
            '<g class="dz-idx" data-cx="%.1f" data-cy="%.1f" data-span="%.2f" data-rest="%.2f" transform="rotate(%.2f %.1f %.1f)">'
            '<path d="M%.1f %.1fL%.1f %.1fL%.1f %.1fZ"/></g></g>') % (
        # the rings end ON the last numeral: an overshoot ran out past the wheel
        # and stopped bare in the band on some screen sizes
        arc(cx, cy, r, a0 - 8, a1), arc(cx, cy, r - 6, a0 - 8, a1),
        ' '.join(ticks), ''.join(dots), ''.join(nums),
        arc(cx, cy, r - 80, c0, c1), ' '.join(cal_t), ''.join(cal_n),
        cx, cy, c1 - c0, rest, sweep, cx, cy, tip[0], tip[1], b1[0], b1[1], b2[0], b2[1])

# ------------------------------------------------------------------ v15 sub-dial
SUB_A0, SUB_SWEEP = -135.0, 270.0

def subdial(value):
    """100x100 chronograph sub-dial. The needle is DRAWN at rest (SUB_A0) and
    TRANSFORMED to the value, so JS can sweep it from 0 with one rotation."""
    t = []
    for i in range(51):
        a = SUB_A0 + SUB_SWEEP * i / 50.0
        big = i % 5 == 0
        t.append('M%.2f %.2fL%.2f %.2f' % (P(50, 50, 40 - (6 if big else 3), a) + P(50, 50, 40, a)))
    n = []
    for v in (0, 25, 50, 75, 100):
        x, y = P(50, 50, 27, SUB_A0 + SUB_SWEEP * v / 100.0)
        n.append('<text x="%.1f" y="%.1f">%d</text>' % (x, y + 2.6, v))
    nx, ny = P(50, 50, 34, SUB_A0)
    tx, ty = P(50, 50, 9, SUB_A0 + 180)
    rot = SUB_SWEEP * value / 100.0
    return ('<svg class="sd" viewBox="0 0 100 100" aria-hidden="true" focusable="false">'
            '<circle class="sd-case" cx="50" cy="50" r="48"/><circle class="sd-face" cx="50" cy="50" r="44"/>'
            '<path class="sd-tick" d="%s"/><g class="sd-num">%s</g>'
            '<path class="sd-val" d="%s" pathLength="100" stroke-dasharray="100" stroke-dashoffset="%.1f"/>'
            '<g class="sd-needle" transform="rotate(%.1f 50 50)"><path d="M%.2f %.2fL%.2f %.2f"/></g>'
            '<circle class="sd-cap" cx="50" cy="50" r="4.2"/><circle class="sd-pin" cx="50" cy="50" r="1.4"/></svg>') % (
        ' '.join(t), ''.join(n), arc(50, 50, 41.5, SUB_A0, SUB_A0 + SUB_SWEEP), 100 - value,
        rot, tx, ty, nx, ny)

# ------------------------------------------------------------------ v01 blueprints
def _hexagon(cx, cy, r, rot=0.0):
    return 'M' + 'L'.join('%.1f %.1f' % P(cx, cy, r, rot + 60 * i) for i in range(6)) + 'Z'

def _square_gear(cx, cy, z, r_root, r_tip, rot=0.0):
    pts, half = [], 360.0 / z / 4.0
    for i in range(z):
        a = rot + i * 360.0 / z
        for aa, rr in ((a - half * 1.1, r_root), (a - half * .9, r_tip), (a + half * .9, r_tip), (a + half * 1.1, r_root)):
            pts.append(P(cx, cy, rr, aa))
    return 'M' + 'L'.join('%.1f %.1f' % p for p in pts) + 'Z'

def _tooth_gear_at(cx, cy, z, m, rot=0.0):
    r = m * z / 2.0
    ra, rr, half = r + m, r - 1.25 * m, 90.0 / z
    pts = []
    for i in range(z):
        a = rot + i * 360.0 / z
        for aa, rad in ((a - half * 1.25, rr), (a - half * .62, ra), (a + half * .62, ra), (a + half * 1.25, rr)):
            pts.append(P(cx, cy, rad, aa))
    return 'M' + 'L'.join('%.1f %.1f' % p for p in pts) + 'Z'

def _sprocket(cx, cy, r, a0, a1, n):
    """Chain-sprocket edge: roller seats dip toward the centre between teeth."""
    out, step = [], (a1 - a0) / n
    for i in range(n):
        x0, y0 = P(cx, cy, r, a0 + step * i)
        x1, y1 = P(cx, cy, r, a0 + step * (i + 1))
        cr = math.hypot(x1 - x0, y1 - y0) * .55
        out.append(('M%.1f %.1f' % (x0, y0) if i == 0 else '') + 'A%.1f %.1f 0 0 1 %.1f %.1f' % (cr, cr, x1, y1))
    return ''.join(out)

def _centre(cx, cy, s):
    return 'M%.1f %.1fH%.1fM%.1f %.1fV%.1f' % (cx - s, cy, cx + s, cx, cy - s, cy + s)

def _hatch(uid, cx, cy, r_out, r_in, pitch=5.0):
    clip = ('<clipPath id="%s"><path clip-rule="evenodd" d="M%.1f %.1fm-%.1f 0a%.1f %.1f 0 1 0 %.1f 0a%.1f %.1f 0 1 0 -%.1f 0'
            'M%.1f %.1fm-%.1f 0a%.1f %.1f 0 1 1 %.1f 0a%.1f %.1f 0 1 1 -%.1f 0"/></clipPath>') % (
        uid, cx, cy, r_out, r_out, r_out, 2 * r_out, r_out, r_out, 2 * r_out, cx, cy, r_in, r_in, r_in, 2 * r_in, r_in, r_in, 2 * r_in)
    n = int(r_out * 2 / pitch) + 2
    lines = ' '.join('M%.1f %.1fL%.1f %.1f' % (cx - r_out + k * pitch - r_out, cy + r_out, cx - r_out + k * pitch + r_out, cy - r_out)
                     for k in range(-n // 2, n + n // 2))
    return clip, '<path class="bp-hatch" clip-path="url(#%s)" d="%s"/>' % (uid, lines)

def _dim(x0, y0, x1, y1, off, label, lift=7):
    """Dimension line between two points, offset perpendicular by `off`."""
    ang = math.atan2(y1 - y0, x1 - x0)
    nx, ny = -math.sin(ang), math.cos(ang)
    d0, d1 = (x0 + nx * off, y0 + ny * off), (x1 + nx * off, y1 + ny * off)
    e = 6 if off > 0 else -6
    path = 'M%.1f %.1fL%.1f %.1fM%.1f %.1fL%.1f %.1fM%.1f %.1fL%.1f %.1f' % (
        x0, y0, d0[0] + nx * e, d0[1] + ny * e, x1, y1, d1[0] + nx * e, d1[1] + ny * e, d0[0], d0[1], d1[0], d1[1])
    # arrowheads
    ux, uy = math.cos(ang), math.sin(ang)
    heads = ''.join('M%.1f %.1fL%.1f %.1fL%.1f %.1f' % (
        px + s * ux * 9 + nx * 3, py + s * uy * 9 + ny * 3, px, py, px + s * ux * 9 - nx * 3, py + s * uy * 9 - ny * 3)
        for (px, py), s in ((d0, 1), (d1, -1)))
    mx, my = (d0[0] + d1[0]) / 2 + nx * -lift, (d0[1] + d1[1]) / 2 + ny * -lift
    deg = math.degrees(ang)
    if deg > 90 or deg < -90:
        deg -= 180
    txt = '<text x="%.1f" y="%.1f" transform="rotate(%.1f %.1f %.1f)" text-anchor="middle">%s</text>' % (mx, my, deg, mx, my, label)
    return path + heads, txt

def blueprint_a(uid):
    """Bearing ring on a hex nut driving a square-tooth gear through a link
    plate; hatched hub, sprocket arc behind, construction through the centres.
    Local coords ~0..440 x 0..420."""
    ax, ay, bx, by = 140.0, 150.0, 310.0, 250.0
    line, thin, dash, lbl = [], [], [], []
    line += [circle(ax, ay, 62), circle(ax, ay, 34), circle(ax, ay, 11)]
    for i in range(12):
        line.append(circle(*(P(ax, ay, 48, i * 30) + (9.5,))))
    thin.append('<path d="%s"/>' % _hexagon(ax, ay, 22, 30))
    thin.append('<path d="%s"/>' % _square_gear(bx, by, 16, 70, 84, 4))
    line += [circle(bx, by, 58), circle(bx, by, 30), circle(bx, by, 12)]
    clip, hatch = _hatch('%s-h' % uid, bx, by, 30, 12)
    ang = math.atan2(by - ay, bx - ax)
    nx, ny = -math.sin(ang), math.cos(ang)
    thin.append('<path d="M%.1f %.1fL%.1f %.1fM%.1f %.1fL%.1f %.1f"/>' % (
        ax + nx * 22, ay + ny * 22, bx + nx * 18, by + ny * 18, ax - nx * 22, ay - ny * 22, bx - nx * 18, by - ny * 18))
    line.append('<path d="%s"/>' % _sprocket(ax, ay, 118, 150, 262, 18))
    dash.append('<path d="%s"/>' % arc(ax, ay, 110, 146, 266))
    dash.append('<path d="M%.1f %.1fL%.1f %.1f"/>' % (ax - math.cos(ang) * 100, ay - math.sin(ang) * 100,
                                                    bx + math.cos(ang) * 130, by + math.sin(ang) * 130))
    dash.append(circle(bx, by, 77))
    thin.append('<path d="%s %s"/>' % (_centre(ax, ay, 18), _centre(bx, by, 22)))
    dp, dt = _dim(ax, ay, bx, by, -104, 'C 197.2')
    thin.append('<path d="%s"/>' % dp)
    lbl += [dt, '<text x="%.1f" y="%.1f">BRG-12 / &#216;124</text>' % (ax - 52, ay - 80)]
    return _bp_group(uid, clip, line, thin, dash, hatch, lbl)

def blueprint_b(uid):
    """A spur gear with lightening holes and a keyed hub, an eccentric cam on
    a second shaft with its roller follower, a shared pitch line and dims.
    Local coords ~0..460 x 0..420."""
    gx, gy, cx, cy = 190.0, 220.0, 380.0, 120.0
    line, thin, dash, lbl = [], [], [], []
    thin.append('<path d="%s"/>' % _tooth_gear_at(gx, gy, 26, 8.0, 3))
    line += [circle(gx, gy, 78), circle(gx, gy, 26)]
    for i in range(6):
        line.append(circle(*(P(gx, gy, 54, i * 60 + 30) + (13,))))
    thin.append('<path d="M%.1f %.1fh8v-9h-8z"/>' % (gx - 4, gy - 26))            # keyway
    clip, hatch = _hatch('%s-h' % uid, gx, gy, 26, 11, 4.5)
    line.append(circle(gx, gy, 11))
    # eccentric cam: base circle offset from its shaft, follower roller on top
    line += [circle(cx + 10, cy + 8, 46), circle(cx, cy, 10), circle(cx + 10, cy - 50, 12)]
    thin.append('<path d="M%.1f %.1fV%.1fM%.1f %.1fV%.1f"/>' % (cx - 2, cy - 64, cy - 100, cx + 22, cy - 64, cy - 100))
    dash.append(circle(gx, gy, 104))
    dash.append('<path d="M%.1f %.1fL%.1f %.1fM%.1f %.1fV%.1f"/>' % (gx - 150, gy, cx + 70, gy, cx, cy - 110, gy + 30))
    thin.append('<path d="%s %s"/>' % (_centre(gx, gy, 22), _centre(cx, cy, 16)))
    dp, dt = _dim(gx - 112, gy, gx + 112, gy, 150, '&#216;224')
    thin.append('<path d="%s"/>' % dp)
    lp = 'M%.1f %.1fL%.1f %.1fH%.1f' % (cx + 44, cy + 34, cx + 76, cy + 70, cx + 104)
    thin.append('<path d="%s"/>' % lp)
    lbl += [dt, '<text x="%.1f" y="%.1f">R46 ECC 10</text>' % (cx + 50, cy + 64), '<text x="%.1f" y="%.1f">SPUR Z26 M8</text>' % (gx - 60, gy - 118)]
    return _bp_group(uid, clip, line, thin, dash, hatch, lbl)

def _bp_group(uid, clip, line, thin, dash, hatch, lbl):
    return ('<g class="bp-set"><defs>%s</defs><g class="bp-line">%s</g><g class="bp-thin">%s</g>'
            '<g class="bp-dash">%s</g>%s<g class="bp-lbl">%s</g></g>') % (
        clip, ''.join(line), ''.join(thin), ''.join(dash), hatch, ''.join(lbl))

# ------------------------------------------------------------------ v15 gear train
def _tooth_gear(z, m):
    r = m * z / 2.0
    return _tooth_gear_at(0, 0, z, m), r, r - 1.25 * m

def _windows(r_in, r_hub, n, spoke_deg):
    out = []
    for i in range(n):
        a0 = i * 360.0 / n + spoke_deg / 2
        a1 = (i + 1) * 360.0 / n - spoke_deg / 2
        o0, o1 = P(0, 0, r_in, a0), P(0, 0, r_in, a1)
        i1, i0 = P(0, 0, r_hub, a1 - 4), P(0, 0, r_hub, a0 + 4)
        out.append('M%.1f %.1fA%.1f %.1f 0 0 1 %.1f %.1fL%.1f %.1fA%.1f %.1f 0 0 0 %.1f %.1fZ' % (
            o0 + (r_in, r_in) + o1 + i1 + (r_hub, r_hub) + i0))
    return ''.join(out)

def _ring_hole(r):
    return 'M0 0m-%.1f 0a%.1f %.1f 0 1 0 %.1f 0a%.1f %.1f 0 1 0 -%.1f 0' % (r, r, r, 2 * r, r, r, 2 * r)

GT_SPEC = [(40, None, 6, 1), (16, 72, 0, 2), (30, 104, 5, 0), (12, 66, 0, 2),
           (44, 112, 6, 1), (18, 70, 0, 0), (32, 106, 5, 2)]

def gear_train(uid, m=6.0, spec=None):
    """Chain meshing gears; `spec` rows are (teeth, direction from previous
    gear in degrees, spokes, tone). Returns (svg group, bbox). Each gear
    carries data-z / data-dir / data-phase so motion can drive the whole
    train from one crank at true tooth ratios."""
    spec = spec or GT_SPEC
    gears, prev = [], None
    for z, ang, spokes, tone in spec:
        if prev is None:
            x = y = phase = 0.0
            direction = 1
        else:
            pz, px, py, pphase, pdir = prev
            x, y = P(px, py, m * (pz + z) / 2.0, ang)
            # phase so a gap on this gear faces the previous gear's tooth
            d1 = (ang - pphase) % (360.0 / pz)
            phase = (ang + 180.0 + 180.0 / z + d1 * pz / z) % (360.0 / z)
            direction = -pdir
        gears.append((z, x, y, phase, direction, spokes, tone))
        prev = (z, x, y, phase, direction)
    out, xs, ys = [], [], []
    for z, gx, gy, ph, dr, spokes, tone in gears:
        d, r, rr = _tooth_gear(z, m)
        rim_in = rr - m * 1.6
        hub = max(m * 2.2, r * .26)
        xs += [gx - r - m, gx + r + m]
        ys += [gy - r - m, gy + r + m]
        if spokes:
            cut = _windows(rim_in, hub + m * .9, spokes, 360.0 / spokes * .28)
        elif z > 13:
            cut = ''.join(_ring_hole(m * .9).replace('M0 0', 'M%.1f %.1f' % P(0, 0, rr * .56, k * 120)) for k in range(3))
        else:
            cut = ''
        out.append(('<g class="gt-g gt-t%d" data-z="%d" data-dir="%d" data-phase="%.2f" transform="translate(%.1f %.1f)">'
                    '<g class="gt-rot" transform="rotate(%.2f)">'
                    '<path class="gt-body" fill-rule="evenodd" d="%s %s %s"/>'
                    '<circle class="gt-hub" r="%.1f"/><circle class="gt-bore" r="%.1f"/></g>'
                    '<path class="gt-edge" d="%s"/></g>') % (
            # The edge light sits OUTSIDE .gt-rot: it's the light, not the metal, so the
            # gear turns under it and every highlight keeps pointing upper-left. It rides
            # the rim band, inside the root circle, so it never crosses the teeth.
            tone, z, dr, ph, gx, gy, ph, d, cut, _ring_hole(m * .8), hub, m * .8, arc(0, 0, rr - m * .45, -80, 10)))
    bbox = (min(xs), min(ys), max(xs) - min(xs), max(ys) - min(ys))
    return '<g class="gt" id="%s">%s</g>' % (uid, ''.join(out)), bbox

# ------------------------------------------------------------------ roundel
def roundel(text, cls='roundel'):
    return ('<svg class="%s" viewBox="0 0 100 100" aria-hidden="true" focusable="false">'
            '<circle cx="50" cy="50" r="49" class="rd-disc"/>'
            '<circle cx="50" cy="50" r="40.5" class="rd-ring"/>'
            '<text x="50" y="51" class="rd-txt" dominant-baseline="central" text-anchor="middle">%s</text></svg>') % (cls, text)
