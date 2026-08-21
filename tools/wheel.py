# -*- coding: utf-8 -*-
"""Air Treck wheel — the hero emblem.

The wings were dropped (they read as insect legs at small sizes), so the wheel
carries the hero alone and needs enough mechanical detail to hold it: tread
notches, a chrome rim, an internal drive-gear ring that ties into the gear
motif everywhere else, tapered spokes, a bolt circle and a motor core.

Everything is computed around a 400x400 box centred on (200, 200) so radii read
as plain numbers and the parts stay concentric.
"""
import math

C = 200.0

def polar(r, deg):
    a = math.radians(deg - 90.0)          # -90 so 0deg points up
    return C + r * math.cos(a), C + r * math.sin(a)

def ring(r_out, r_in):
    """Annulus as one path; even-odd fill punches the middle out."""
    return ('M %.1f %.1f A %.1f %.1f 0 1 1 %.1f %.1f A %.1f %.1f 0 1 1 %.1f %.1f Z '
            'M %.1f %.1f A %.1f %.1f 0 1 0 %.1f %.1f A %.1f %.1f 0 1 0 %.1f %.1f Z') % (
        C - r_out, C, r_out, r_out, C + r_out, C, r_out, r_out, C - r_out, C,
        C - r_in, C, r_in, r_in, C + r_in, C, r_in, r_in, C - r_in, C)

def tread(n, r_in, r_out, half_deg):
    """Radial notches cut into the tyre."""
    parts = []
    for i in range(n):
        a = i * 360.0 / n
        p = [polar(r_in, a - half_deg), polar(r_out, a - half_deg * 0.72),
             polar(r_out, a + half_deg * 0.72), polar(r_in, a + half_deg)]
        parts.append('M %.1f %.1f L %.1f %.1f L %.1f %.1f L %.1f %.1f Z' % (
            p[0][0], p[0][1], p[1][0], p[1][1], p[2][0], p[2][1], p[3][0], p[3][1]))
    return ' '.join(parts)

def gear_ring(n, r_root, r_tip, tw, fl):
    """Internal drive gear — same tooth construction as the page's gears."""
    pts = []
    step = 360.0 / n
    for i in range(n):
        a = i * step
        for ang, r in ((a - tw - fl, r_root), (a - tw, r_tip),
                       (a + tw, r_tip), (a + tw + fl, r_root)):
            pts.append(polar(r, ang))
    return 'M %.1f %.1f ' % pts[0] + ' '.join('L %.1f %.1f' % p for p in pts[1:]) + ' Z'

def spokes(n, r_in, r_out, w_in, w_out):
    """Tapered spokes, wider at the hub."""
    parts = []
    for i in range(n):
        a = i * 360.0 / n
        di = math.degrees(math.atan2(w_in, r_in))
        do = math.degrees(math.atan2(w_out, r_out))
        p = [polar(r_in, a - di), polar(r_out, a - do),
             polar(r_out, a + do), polar(r_in, a + di)]
        parts.append('M %.1f %.1f L %.1f %.1f L %.1f %.1f L %.1f %.1f Z' % (
            p[0][0], p[0][1], p[1][0], p[1][1], p[2][0], p[2][1], p[3][0], p[3][1]))
    return ' '.join(parts)

def circles(n, r_at, rad, start=0.0):
    return ''.join('<circle cx="%.1f" cy="%.1f" r="%.1f"/>' %
                   (polar(r_at, start + i * 360.0 / n) + (rad,)) for i in range(n))

# ---------------------------------------------------------------- parts
TYRE       = ring(192, 152)
TREAD      = tread(30, 154, 190, 4.6)
RIM        = ring(152, 142)
DRIVE      = gear_ring(24, 142, 122, 5.0, 2.6)
SPOKES     = spokes(6, 50, 122, 15, 9)
HUB_RING   = ring(52, 38)
BOLTS      = circles(6, 45, 5.5, 30)
BEARINGS   = circles(4, 86, 5.0)
VIEWBOX    = "0 0 400 400"

if __name__ == '__main__':
    print('viewBox', VIEWBOX)
    for name, d in (('tyre', TYRE), ('tread', TREAD), ('drive', DRIVE), ('spokes', SPOKES)):
        print('%-8s %d chars' % (name, len(d)))
