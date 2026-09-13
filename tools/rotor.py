# -*- coding: utf-8 -*-
"""Halo drive - the hero emblem.

Replaces tools/wheel.py. The Air Treck wheel read as a tyre, and the first
replacement (a spiral turbine around a lit core) read as a hypno-wheel with
an eye in it. This is the third try and it is deliberately NOT a spiral and
has NO pupil: an astrolabe of chrome rings.

    halo ring ......... 300   thin warm ring, tick bezel, light rays (static)
    ring gear ......... 226 -> 270   36 outward teeth, punched (slow spin)
    stator plates ..... 152 -> 214   12 chrome segments (counter-spin)
    bearing race ...... 118 -> 132   24 notches (spin)
    hub ............... 70 -> 96     6 bolts; the centre is OPEN and lit

Everything is computed in an 800x800 box around (400, 400). Each stage is
its own <g> in the sprite so the page can stack five <svg>s and rotate
them independently with a CSS transform (composited) instead of rotating
groups inside one SVG (a repaint per frame). Rotation reads through teeth,
plate gaps and notches passing - nothing converges on the centre.
"""
import math

C = 400.0

def polar(r, deg):
    a = math.radians(deg - 90.0)          # -90 so 0deg points up
    return C + r * math.cos(a), C + r * math.sin(a)

def fmt(pts):
    return 'M %.1f %.1f ' % pts[0] + ' '.join('L %.1f %.1f' % p for p in pts[1:]) + ' Z'

def ring(r_out, r_in):
    """Annulus as one path; even-odd fill punches the middle out."""
    return ('M %.1f %.1f A %.1f %.1f 0 1 1 %.1f %.1f A %.1f %.1f 0 1 1 %.1f %.1f Z '
            'M %.1f %.1f A %.1f %.1f 0 1 0 %.1f %.1f A %.1f %.1f 0 1 0 %.1f %.1f Z') % (
        C - r_out, C, r_out, r_out, C + r_out, C, r_out, r_out, C - r_out, C,
        C - r_in, C, r_in, r_in, C + r_in, C, r_in, r_in, C - r_in, C)

def circle_path(r):
    return ('M %.1f %.1f A %.1f %.1f 0 1 0 %.1f %.1f A %.1f %.1f 0 1 0 %.1f %.1f Z') % (
        C - r, C, r, r, C + r, C, r, r, C - r, C)

def gear_outline(n, r_root, r_tip, tw, fl):
    """Toothed outline, same construction as the page gears (build_pages.gear_path)."""
    pts = []
    step = 360.0 / n
    for i in range(n):
        a = i * step
        for ang, r in ((a - tw - fl, r_root), (a - tw, r_tip), (a + tw, r_tip), (a + tw + fl, r_root)):
            pts.append(polar(r, ang))
    return fmt(pts)

def sector(a0, a1, r0, r1):
    """Annular sector (a plate) drawn with real arcs."""
    (x0, y0), (x1, y1) = polar(r0, a0), polar(r0, a1)
    (x2, y2), (x3, y3) = polar(r1, a1), polar(r1, a0)
    return ('M %.1f %.1f A %.1f %.1f 0 0 1 %.1f %.1f L %.1f %.1f A %.1f %.1f 0 0 0 %.1f %.1f Z' % (
        x0, y0, r0, r0, x1, y1, x2, y2, r1, r1, x3, y3))

def arc(a0, a1, r):
    (x0, y0), (x1, y1) = polar(r, a0), polar(r, a1)
    return 'M %.1f %.1f A %.1f %.1f 0 0 1 %.1f %.1f' % (x0, y0, r, r, x1, y1)

def plates(n, r0, r1, span, inset=3.0):
    body, lines, rivets = [], [], []
    for i in range(n):
        c = i * 360.0 / n
        a0, a1 = c - span / 2.0, c + span / 2.0
        body.append(sector(a0, a1, r0, r1))
        # a machined groove near the outer edge, and one near the inner
        lines.append(arc(a0 + inset, a1 - inset, r1 - 9))
        lines.append(arc(a0 + inset, a1 - inset, r0 + 8))
        x, y = polar((r0 + r1) / 2.0, c)
        rivets.append('<circle cx="%.1f" cy="%.1f" r="3.4"/>' % (x, y))
    return ' '.join(body), ' '.join(lines), ''.join(rivets)

def notches(n, r0, r1, start=0.0):
    out = []
    for i in range(n):
        a = start + i * 360.0 / n
        (x0, y0), (x1, y1) = polar(r0, a), polar(r1, a)
        out.append('M %.1f %.1f L %.1f %.1f' % (x0, y0, x1, y1))
    return ' '.join(out)

def rays(n, r0, r1_long, r1_short, w0, w1):
    """Tapered light rays, long/short alternating."""
    out = []
    for i in range(n):
        a = i * 360.0 / n
        r1 = r1_long if i % 2 == 0 else r1_short
        d0, d1 = math.degrees(w0 / r0), math.degrees(w1 / r1)
        out.append(fmt([polar(r0, a - d0), polar(r1, a - d1), polar(r1, a + d1), polar(r0, a + d0)]))
    return ' '.join(out)

def circles(n, r_at, rad, start=0.0):
    return ''.join('<circle cx="%.1f" cy="%.1f" r="%.1f"/>' %
                   (polar(r_at, start + i * 360.0 / n) + (rad,)) for i in range(n))

# ---------------------------------------------------------------- parts
# ring gear: toothed outline + inner hole (even-odd), punched with 12 holes
GEAR_RING      = gear_outline(36, 248, 270, 3.2, 1.7) + ' ' + circle_path(226)
GEAR_HOLES     = circles(12, 237, 5.0, 5.0)
# stator plates
PLATES, PLATE_LINES, PLATE_RIVETS = plates(12, 152, 214, 22.0)
# bearing race
BEARING        = ring(132, 118)
BEARING_NOTCH  = notches(24, 119, 131, 7.5)
# hub (open centre)
HUB            = ring(96, 70)
HUB_BOLTS      = circles(6, 83, 4.0, 30.0)
# halo
HALO_TICK_S    = notches(60, 302, 308)
HALO_TICK_L    = notches(12, 302, 316)
HALO_RAYS      = rays(24, 320, 462, 372, 5.2, 0.5)
VIEWBOX        = "0 0 800 800"
MINI_VIEWBOX   = "176 176 448 448"      # plates + hub: an aperture mark for the logo

if __name__ == '__main__':
    print('viewBox', VIEWBOX)
    for name, d in (('gear', GEAR_RING), ('plates', PLATES), ('lines', PLATE_LINES),
                    ('bearing', BEARING), ('rays', HALO_RAYS)):
        print('%-9s %d chars' % (name, len(d)))
