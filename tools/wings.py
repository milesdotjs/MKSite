# -*- coding: utf-8 -*-
"""Air Gear style wing generator.

CURRENTLY UNUSED. The wings were pulled from the site on 2026-08-21 - at small
sizes the separated blades read as insect legs. Kept because the generator is
sound and the look may come back; nothing imports it. tools/wheel.py draws the
hero emblem instead.


The first pass drew four fat blobby feathers per side. Air Gear's wings are
blade-like: many narrow primaries with hard points, swept hard back and up,
layered over a short row of coverts near the hub. So each feather is built
from a spine (an arc from base angle to tip angle) with a width profile that
tapers to an actual point, rather than being a hand-drawn quad.
"""
import math

HUB = (380.0, 258.0)

def feather(a0, a1, r0, r1, w0, samples=14, taper=0.62, belly=0.22):
    """One blade. a0/a1 in screen degrees (0 = right, negative = up)."""
    cx, cy = HUB
    pts_out, pts_in = [], []
    for i in range(samples + 1):
        t = i / float(samples)
        # ease the spine so the blade curves hardest near the tip
        te = t * t * (3 - 2 * t)
        a = math.radians(a0 + (a1 - a0) * te)
        r = r0 + (r1 - r0) * t
        sx, sy = cx + r * math.cos(a), cy + r * math.sin(a)
        # width tapers to zero at the tip; belly pushes the widest point out
        w = w0 * ((1.0 - t) ** taper) * (1.0 + belly * math.sin(math.pi * t))
        nx, ny = -math.sin(a), math.cos(a)          # perpendicular to the spine
        pts_out.append((sx + nx * w, sy + ny * w))
        pts_in.append((sx - nx * w, sy - ny * w))
    path = ['M %.1f %.1f' % pts_out[0]]
    for p in pts_out[1:]:
        path.append('L %.1f %.1f' % p)
    for p in reversed(pts_in[:-1]):                  # tip is shared
        path.append('L %.1f %.1f' % p)
    path.append('Z')
    return ' '.join(path), pts_out + pts_in

# right wing: long primaries up top, short coverts tucked underneath
PRIMARIES = [
    # a0    a1     r0    r1    w0   — swept up and back; tips ride above the base
    (-58,  -78,  56,  296,  14),
    (-44,  -61,  56,  320,  15),
    (-30,  -45,  56,  326,  16),
    (-16,  -29,  56,  312,  15),
    ( -2,  -13,  56,  278,  13),
    ( 12,    3,  56,  234,  11),
]
COVERTS = [
    (-48,  -62,  46,  146,  12),
    (-32,  -44,  46,  154,  12),
    (-16,  -26,  46,  146,  11),
    (  0,   -8,  46,  124,  10),
]

def mirror(d):
    """Reflect a path string about x = HUB[0]."""
    out, i, toks = [], 0, d.split()
    while i < len(toks):
        cmd = toks[i]
        if cmd == 'Z':
            out.append('Z'); i += 1
        else:
            x, y = float(toks[i + 1]), float(toks[i + 2])
            out.append('%s %.1f %.1f' % (cmd, 2 * HUB[0] - x, y)); i += 3
    return ' '.join(out)

right, left, allpts = [], [], []
for spec in COVERTS + PRIMARIES:                     # coverts first = drawn under
    d, pts = feather(*spec)
    right.append(d)
    left.append(mirror(d))
    allpts += pts
    allpts += [(2 * HUB[0] - x, y) for x, y in pts]

# the emblem draws a hub wheel over the feather bases; include its extent or
# the viewBox crops the wheel off the bottom
HUB_R = 74.0
allpts += [(HUB[0] - HUB_R, HUB[1] - HUB_R), (HUB[0] + HUB_R, HUB[1] + HUB_R)]

xs = [p[0] for p in allpts]; ys = [p[1] for p in allpts]
PAD = 14
vb = (min(xs) - PAD, min(ys) - PAD, max(xs) - min(xs) + 2 * PAD, max(ys) - min(ys) + 2 * PAD)

wingpts = allpts[:-2]
lxs = [p[0] for p in wingpts if p[0] <= HUB[0] + 2]
lys = [p[1] for p in wingpts if p[0] <= HUB[0] + 2]
vbL = (min(lxs) - PAD, min(lys) - PAD, HUB[0] - min(lxs) + PAD, max(lys) - min(lys) + 2 * PAD)

def fmt(v):
    return ' '.join('%.0f' % n for n in v)

WING_L = '\n'.join('      <path d="%s"/>' % d for d in left)
WING_R = '\n'.join('      <path d="%s"/>' % d for d in right)

if __name__ == '__main__':
    print('viewBox full : %s' % fmt(vb))
    print('viewBox left : %s' % fmt(vbL))
    print('hub          : %.0f %.0f' % HUB)
    print('feathers     : %d per side' % len(right))
    print()
    print(WING_L[:300])
