# -*- coding: utf-8 -*-
"""Generates index.html / about.html / projects.html for the holo theme.

The three pages share their nav, footer, SVG sprite sheet and card markup, so
they are generated from one source rather than kept in sync by hand. Gear and
gauge geometry is computed (real meshing teeth, real dial scales) and the hero
wheel comes from tools/wheel.py.

    cd tools && python build_pages.py

Edit this file, not the generated HTML - a hand edit to index.html is lost the
next time this runs.
"""
import io, math, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from wheel import (TYRE, TREAD, RIM, DRIVE, SPOKES, HUB_RING, BOLTS,
                   BEARINGS, VIEWBOX as WHEEL_VB)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ---------------------------------------------------------------- geometry
def gear_path(n=12, root=44.0, tip=58.0, cx=60.0, cy=60.0, tw=7.0, fl=3.5):
    pts = []
    step = 360.0 / n
    for i in range(n):
        a = i * step
        for ang, r in ((a - tw - fl, root), (a - tw, tip), (a + tw, tip), (a + tw + fl, root)):
            rad = math.radians(ang - 90.0)
            pts.append((cx + r * math.cos(rad), cy + r * math.sin(rad)))
    return 'M %.2f %.2f ' % pts[0] + ' '.join('L %.2f %.2f' % p for p in pts[1:]) + ' Z'

def holes(n, r, cx=60.0, cy=60.0, rad=7.0):
    out = []
    for i in range(n):
        a = math.radians(i * 360.0 / n - 90.0)
        out.append('<circle cx="%.2f" cy="%.2f" r="%.1f"/>' % (cx + r * math.cos(a), cy + r * math.sin(a), rad))
    return ''.join(out)

GA_START, GA_END, GA_R = -215.0, 35.0, 39.0
GA_SWEEP = GA_END - GA_START
ARC_LEN = GA_R * math.radians(GA_SWEEP)

def gauge_ticks(cx=50.0, cy=50.0, r0=32.0, r1=39.0, n=11):
    out = []
    for i in range(n):
        a = math.radians(GA_START + GA_SWEEP * i / (n - 1.0))
        big = (i % 5 == 0)
        rr = r0 - (4 if big else 0)
        out.append('<path d="M%.2f %.2f L%.2f %.2f" stroke-width="%s"/>' % (
            cx + rr * math.cos(a), cy + rr * math.sin(a),
            cx + r1 * math.cos(a), cy + r1 * math.sin(a), '3' if big else '1.5'))
    return ''.join(out)

def gauge_arc(cx=50.0, cy=50.0, r=GA_R):
    a0, a1 = math.radians(GA_START), math.radians(GA_END)
    return 'M%.2f %.2f A%.0f %.0f 0 1 1 %.2f %.2f' % (
        cx + r * math.cos(a0), cy + r * math.sin(a0), r, r,
        cx + r * math.cos(a1), cy + r * math.sin(a1))

def needle_at_min(cx=50.0, cy=50.0, r=30.0):
    a = math.radians(GA_START)
    return 'M%.2f %.2f L%.2f %.2f' % (cx, cy, cx + r * math.cos(a), cy + r * math.sin(a))

G12 = gear_path(12)
G16 = gear_path(16, root=46, tip=58, tw=5.2, fl=2.6)
G8 = gear_path(8, root=40, tip=58, tw=10, fl=5)
H5, H6 = holes(5, 27, rad=8), holes(6, 28, rad=6.5)
TICKS, ARC, NEEDLE = gauge_ticks(), gauge_arc(), needle_at_min()

FAVICON = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E"
           "%3Crect width='64' height='64' rx='12' fill='%2305060d'/%3E"
           "%3Ctext x='32' y='42' font-family='monospace' font-size='28' font-weight='bold' "
           "text-anchor='middle' fill='%234ff5ff'%3EMK%3C/text%3E"
           "%3Cline x1='10' y1='52' x2='54' y2='52' stroke='%23ff4fd8' stroke-width='3'/%3E%3C/svg%3E")

FONTS = ("https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@500..900"
         "&family=Chakra+Petch:ital,wght@0,300;0,400;0,500;0,600;0,700;1,600;1,700"
         "&family=Space+Mono:wght@400;700&family=Zen+Kaku+Gothic+New:wght@500;700;900&display=swap")

# ---------------------------------------------------------------- shared blocks
SPRITE = '''<!-- ===== mechanical sprite sheet ===== -->
<svg class="sprite" aria-hidden="true" width="0" height="0">
  <defs>
    <linearGradient id="chr" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%%" stop-color="#ffffff"/><stop offset="22%%" stop-color="#eaf3ff"/>
      <stop offset="44%%" stop-color="#aabdd9"/><stop offset="50%%" stop-color="#6f80a2"/>
      <stop offset="57%%" stop-color="#edf5ff"/><stop offset="74%%" stop-color="#ffffff"/>
      <stop offset="100%%" stop-color="#b4c4dd"/>
    </linearGradient>

    <!-- Air Treck wheel: tyre + tread + rim + internal drive gear + spokes -->
    <g id="wheelSolid">
      <path d="%(tyre)s" fill="#070b16" fill-rule="evenodd" stroke="#8fd8ff" stroke-width="2"/>
      <path d="%(tread)s" fill="#16233f" stroke="#5fa8d8" stroke-width="1.2"/>
      <path d="%(rim)s" fill="url(#chr)" fill-rule="evenodd" stroke="#8fd8ff" stroke-width="1.6"/>
      <path d="%(drive)s" fill="url(#chr)" stroke="#8fd8ff" stroke-width="1.6" stroke-linejoin="round"/>
      <circle cx="200" cy="200" r="122" fill="#070b16"/>
      <path d="%(spokes)s" fill="url(#chr)" stroke="#8fd8ff" stroke-width="1.8" stroke-linejoin="round"/>
      <path d="%(hubring)s" fill="url(#chr)" fill-rule="evenodd" stroke="#8fd8ff" stroke-width="1.6"/>
      <g fill="#070b16" stroke="#8fd8ff" stroke-width="1.4">%(bolts)s</g>
      <circle cx="200" cy="200" r="30" fill="#ff4fd8" stroke="#070b16" stroke-width="4"/>
      <circle cx="200" cy="200" r="13" fill="#070b16"/>
      <g fill="#b6ff4f">%(bearings)s</g>
    </g>
    <g id="wheelWire">
      <path d="%(tyre)s" fill="none" stroke="#4ff5ff" stroke-width="2"/>
      <path d="%(drive)s" fill="none" stroke="#4ff5ff" stroke-width="1.4" stroke-linejoin="round"/>
      <path d="%(spokes)s" fill="none" stroke="#4ff5ff" stroke-width="1.4" stroke-linejoin="round"/>
      <circle cx="200" cy="200" r="52" fill="none" stroke="#4ff5ff" stroke-width="1.4"/>
      <circle cx="200" cy="200" r="30" fill="none" stroke="#4ff5ff" stroke-width="1.4"/>
    </g>

    <g id="gearA">
      <path d="%(g12)s" fill="url(#chr)" stroke="#8fd8ff" stroke-width="2" stroke-linejoin="round"/>
      <circle cx="60" cy="60" r="30" fill="none" stroke="#8fd8ff" stroke-width="1.6"/>
      <g fill="none" stroke="#8fd8ff" stroke-width="1.6">%(h5)s</g>
      <circle cx="60" cy="60" r="11" fill="#0a1020" stroke="#8fd8ff" stroke-width="1.6"/>
    </g>
    <g id="gearB">
      <path d="%(g16)s" fill="url(#chr)" stroke="#8fd8ff" stroke-width="2" stroke-linejoin="round"/>
      <circle cx="60" cy="60" r="32" fill="none" stroke="#8fd8ff" stroke-width="1.6"/>
      <g fill="none" stroke="#8fd8ff" stroke-width="1.6">%(h6)s</g>
      <circle cx="60" cy="60" r="10" fill="#0a1020" stroke="#8fd8ff" stroke-width="1.6"/>
    </g>
    <g id="gearC">
      <path d="%(g8)s" fill="url(#chr)" stroke="#8fd8ff" stroke-width="2" stroke-linejoin="round"/>
      <circle cx="60" cy="60" r="26" fill="none" stroke="#8fd8ff" stroke-width="1.6"/>
      <circle cx="60" cy="60" r="12" fill="#ff4fd8" stroke="#0a1020" stroke-width="2"/>
    </g>
    <g id="gearWire">
      <path d="%(g12)s" fill="none" stroke="#4ff5ff" stroke-width="1.6" stroke-linejoin="round"/>
      <circle cx="60" cy="60" r="30" fill="none" stroke="#4ff5ff" stroke-width="1.2"/>
      <circle cx="60" cy="60" r="11" fill="none" stroke="#4ff5ff" stroke-width="1.2"/>
    </g>
  </defs>
</svg>''' % {'tyre': TYRE, 'tread': TREAD, 'rim': RIM, 'drive': DRIVE, 'spokes': SPOKES,
             'hubring': HUB_RING, 'bolts': BOLTS, 'bearings': BEARINGS,
             'g12': G12, 'g16': G16, 'g8': G8, 'h5': H5, 'h6': H6}

FX = '''<!-- ===== fixed atmosphere ===== -->
<div class="fx-chamber" aria-hidden="true"></div>
<div class="fx-floor" aria-hidden="true"></div>
<div class="fx-tone" aria-hidden="true"></div>
<div class="fx-scan" aria-hidden="true"></div>
<div class="fx-grain" aria-hidden="true"></div>
<div class="fx-vig" aria-hidden="true"></div>

<div class="rain rain-l" aria-hidden="true"><span data-rain></span></div>
<div class="rain rain-r" aria-hidden="true"><span data-rain></span></div>

<!-- ===== HUD ===== -->
<div class="prog" aria-hidden="true"><i data-prog></i></div>

<aside class="hud" aria-hidden="true">
  <span class="hud-gear"><svg viewBox="0 0 120 120"><use href="#gearWire"/></svg></span>
  <dl>
    <div><dt>SCRL</dt><dd data-hud-scroll>000</dd></div>
    <div><dt>SECT</dt><dd data-hud-sect>01</dd></div>
    <div><dt>RPM</dt><dd data-hud-rpm>0000</dd></div>
    <div><dt>SYS</dt><dd class="ok">NOMINAL</dd></div>
  </dl>
</aside>

<div class="reticle" aria-hidden="true">
  <i class="r-ring"></i><i class="r-dot"></i>
  <span class="r-read" data-reticle>0000 : 0000</span>
</div>'''

def head(title, desc, is_index=False):
    og = ''
    if is_index:
        og = '''
    <meta property="og:title" content="Miles King — Software Developer" />
    <meta property="og:description" content="Software developer based in Houston, Texas." />
    <meta property="og:type" content="website" />'''
    noscript_extra = '#boot { display: none !important; }\n        body.is-booting { overflow: auto; height: auto; }\n        ' if is_index else ''
    return '''<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>%s</title>
    <meta name="description" content="%s" />%s
    <meta name="theme-color" content="#05060d" />
    <link rel="icon" href="%s" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="%s" rel="stylesheet" />
    <link rel="stylesheet" href="assets/css/site.css" />
    <noscript>
      <style>
        %s.reticle { display: none !important; }
      </style>
    </noscript>
  </head>''' % (title, desc, og, FAVICON, FONTS, noscript_extra)

def nav(page):
    if page == 'index':
        links = '''    <a href="#hero" class="is-on"><span data-scramble>INTRO</span></a>
    <a href="#stack"><span data-scramble>WHAT I DO</span></a>
    <a href="#rider"><span data-scramble>WHO I AM</span></a>
    <a href="#work"><span data-scramble>MY WORK</span></a>
    <a href="#contact"><span data-scramble>CONTACT</span></a>'''
        logo_href = '#hero'
        cta = '#contact'
    else:
        here = lambda p: ' class="is-here" aria-current="page"' if p == page else ''
        links = '''    <a href="index.html"><span data-scramble>HOME</span></a>
    <a href="about.html"%s><span data-scramble>ABOUT</span></a>
    <a href="projects.html"%s><span data-scramble>PROJECTS</span></a>
    <a href="index.html#contact"><span data-scramble>CONTACT</span></a>''' % (here('about'), here('projects'))
        logo_href = 'index.html'
        cta = 'index.html#contact'
    return '''<!-- ===== NAV ===== -->
<header id="nav">
  <a class="logo" href="%s">
    <span class="logo-wheel" aria-hidden="true"><svg viewBox="0 0 120 120"><use href="#gearC"/></svg></span>
    <b>MK</b>
  </a>
  <nav aria-label="Main">
%s
  </nav>
  <div class="nav-side">
    <span class="nav-kana">マイルス</span>
    <a class="nav-cta" href="%s"><span data-scramble>SAY HELLO</span></a>
  </div>
</header>''' % (logo_href, links, cta)

GH_PATH = "M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.69 1.25 3.35.95.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.7 5.38-5.26 5.66.41.35.77 1.05.77 2.12 0 1.54-.01 2.77-.01 3.15 0 .3.2.67.8.55A11.52 11.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"
LI_PATH = "M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z"

def footer(page):
    totop = '#hero' if page == 'index' else '#top'
    sig = '&mdash; HOLO LINK STABLE &mdash;'
    return '''<!-- ===== FOOTER ===== -->
<footer id="footer">
  <span class="foot-gear"><svg viewBox="0 0 120 120"><use href="#gearWire"/></svg></span>
  <ul class="social">
    <li><a href="https://github.com/milesdotjs" target="_blank" rel="noopener" aria-label="GitHub" data-magnet><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="%s"/></svg></a></li>
    <li><a href="https://linkedin.com/in/miles-k" target="_blank" rel="noopener" aria-label="LinkedIn" data-magnet><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="%s"/></svg></a></li>
  </ul>
  <p class="foot-line">&copy; <span data-year>2026</span> MILES KING <i>&#10022;</i> SOFTWARE DEVELOPER <i>&#10022;</i> MILESKING.DEV</p>
  <p class="foot-sig" data-cycle>%s</p>
  <a class="totop" href="%s"><span data-scramble>BACK TO TOP &uarr;</span></a>
</footer>''' % (GH_PATH, LI_PATH, sig, totop)

SCRIPTS = '''<script src="assets/js/vendor/gsap.min.js"></script>
<script src="assets/js/vendor/ScrollTrigger.min.js"></script>
<script src="assets/js/vendor/ScrollToPlugin.min.js"></script>
<script src="assets/js/vendor/SplitText.min.js"></script>
<script src="assets/js/vendor/ScrambleTextPlugin.min.js"></script>
<script src="assets/js/vendor/Physics2DPlugin.min.js"></script>
<script src="assets/js/site.js"></script>'''

def gear(cls, sym, dur, rev=False):
    return ('<span class="gear %s" data-gear data-dur="%s"%s>'
            '<svg viewBox="0 0 120 120"><use href="#%s"/></svg></span>') % (
            cls, dur, ' data-rev="1"' if rev else '', sym)

def sec_head(tag, kana, title, sub=None, link=None, h='h2'):
    parts = ['''  <div class="sec-head">
    <p class="sec-tag"><span class="tag-gear" aria-hidden="true"><svg viewBox="0 0 120 120"><use href="#gearC"/></svg></span><i>%s</i><span>%s</span></p>
    <%s class="sec-title" data-text="%s" data-scramble><span>%s</span></%s>''' % (tag, kana, h, title, title, h)]
    if sub:
        parts.append('    <p class="sec-sub">%s</p>' % sub)
    if link:
        parts.append('    <a class="head-link" href="%s"><span data-scramble>%s</span> <i>&rarr;</i></a>' % link)
    parts.append('  </div>')
    return '\n'.join(parts)

def dial(label, val, accent):
    return '''        <div class="dial" data-dial data-val="%(val)s">
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" class="d-case"/>
            <circle cx="50" cy="50" r="39" class="d-face"/>
            <g class="d-ticks">%(ticks)s</g>
            <path class="d-arc" d="%(arc)s" stroke="%(accent)s"
                  stroke-dasharray="%(len).1f" stroke-dashoffset="%(len).1f"/>
            <g class="d-needle"><path d="%(needle)s"/></g>
            <circle cx="50" cy="50" r="7" class="d-cap"/>
            <circle cx="50" cy="50" r="2.5" fill="%(accent)s"/>
          </svg>
          <span class="dial-val" data-count="%(val)s">0</span>
          <span class="dial-label">%(label)s</span>
        </div>''' % {'ticks': TICKS, 'arc': ARC, 'len': ARC_LEN, 'needle': NEEDLE,
                     'accent': accent, 'val': val, 'label': label}

def card(rank, href, img, alt, title, desc, tags, go='LAUNCH', flag=None, top=False, wide=False):
    cls = 'card'
    if top: cls += ' is-top'
    if wide: cls += ' is-wide'
    flag_html = ''
    if flag:
        flag_html = '\n            <span class="card-flag%s">%s</span>' % (' is-amber' if top else '', flag)
    img_html = ''
    if img:
        img_html = '\n            <img src="assets/img/%s" alt="%s" loading="lazy" />' % (img, alt)
    return '''      <article class="%s" data-tilt>
        <a href="%s">
          <span class="card-rank">%s</span>
          <div class="card-shot">%s
            <span class="card-tint" aria-hidden="true"></span>
            <span class="card-sheen" aria-hidden="true"></span>
            <span class="card-scan" aria-hidden="true"></span>
          </div>
          <div class="card-body">%s
            <h3 data-scramble>%s</h3>
            <p>%s</p>
            <span class="card-tags">%s</span>
            <span class="card-pn"><em>P/N</em>MK-2026-%s<i></i>REV 2.6</span>
            <span class="card-go">%s &rarr;</span>
          </div>
        </a>
        <span class="card-frame" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
      </article>''' % (cls, href, rank, img_html, flag_html, title, desc, tags, rank, go)

def tape(text):
    span = '<span>%s&nbsp;</span>' % text
    return '''<!-- ===== TAPE ===== -->
<div class="tape" aria-hidden="true">
  <div class="tape-track" data-tape>
    %s
    %s
  </div>
</div>''' % (span, span)

RIDER_CARD = '''    <div class="glass rcard" data-panel data-tilt>
      <span class="g-frame" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
      <div class="rcard-top">
        <span class="rcard-rank">01</span>
        <div class="rcard-name">
          <b>MILES KING</b>
          <span>マイルス・キング</span>
        </div>
        <span class="rcard-badge">DEV</span>
      </div>
      <div class="rcard-photo">
        <span class="rcard-mono">MK</span>
        <span class="rcard-sheen" aria-hidden="true"></span>
        <span class="rcard-scan" aria-hidden="true"></span>
      </div>
      <dl class="rcard-fields">
        <div><dt>CLASS</dt><dd>DEV &times; ANALYTICS</dd></div>
        <div><dt>BASE</dt><dd>HOUSTON, TX</dd></div>
        <div><dt>ROUTE</dt><dd>CHEM ENG &rarr; SOFTWARE</dd></div>
        <div><dt>STATUS</dt><dd class="ok">CAFFEINATED</dd></div>
      </dl>
      <div class="rcard-foot">
        <span class="rcard-serial">MK-2026-HTX</span>
        <span class="rcard-dots" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>
      </div>
    </div>'''

# ---------------------------------------------------------------- index
INDEX_CARDS = [
    ('01', 'projects/study-something/', 'study-something.png',
     'Study Something! chess study utility preview', 'Study Something!',
     'Pulls random over-the-board games from top chess players so I can study unfamiliar positions.',
     'UTILITY // CHESS // JS', 'LAUNCH', 'NEW &#10022; UTILITY', True, False),
    ('02', 'projects/anime-blackjack/', 'anime-blackjack.jpg',
     'Anime Blackjack game preview — animated dealer and card table', 'Anime Blackjack',
     'Blackjack against an animated anime dealer who reacts to every hand.',
     'GAME // REACT // GSAP', 'LAUNCH', 'NEW &#10022; GAME', False, False),
    ('03', 'projects/infinite-crayons/', 'infinite-crayons.png',
     'InfiniteCrayons color palette generator preview', 'InfiniteCrayons',
     'Color palette generator with per-swatch HSL control.',
     'TOOL // COLOR', 'LAUNCH', None, False, False),
    ('04', 'projects/jst-play/', 'jst-play.png',
     'JSt Play drum machine preview', 'JSt Play',
     'Browser drum machine &amp; step sequencer.',
     'AUDIO // FUN', 'LAUNCH', None, False, False),
    ('05', 'projects/more-stock-images/', 'more-stock-images.png',
     'MoreStockImages photo search preview', 'MoreStockImages',
     'Royalty-free photo search across providers.',
     'TOOL // API', 'LAUNCH', None, False, False),
    ('06', 'projects/mettatonex.html', 'mettatonex.png',
     'MettatonEX Discord bot preview', 'MettatonEX',
     'Discord bot that announces new YouTube uploads.',
     'NODE.JS // DISCORD.JS', 'CASE STUDY', None, False, False),
]

def build_index():
    def c(t):  # unpack card tuple
        return card(t[0], t[1], t[2], t[3], t[4], t[5], t[6], t[7], t[8], t[9], t[10])
    hero_gears = '\n'.join('    ' + g for g in [
        gear('g-a', 'gearA', 38), gear('g-b', 'gearB', 22, True), gear('g-c', 'gearC', 14),
        gear('g-d', 'gearA', 30, True), gear('g-e', 'gearB', 18), gear('g-f', 'gearC', 12, True),
        gear('g-g', 'gearB', 26), gear('g-h', 'gearC', 11, True),
    ])
    return '''%(head)s
  <body class="is-booting">

%(sprite)s

<!-- ===== BOOT / ACCESS SEQUENCE ===== -->
<div id="boot" aria-hidden="true">
  <div class="boot-scan"></div>
  <div class="boot-core">
    <span class="boot-gear"><svg viewBox="0 0 120 120"><use href="#gearWire"/></svg></span>
    <p class="boot-id" data-boot-id>MK-AT-2026 :: WING DRIVE CORE</p>
    <div class="boot-log">
      <p data-boot-line>&gt; mounting /dev/at0 .............. OK</p>
      <p data-boot-line>&gt; spinning up gear train ......... 12/12</p>
      <p data-boot-line>&gt; calibrating drive wheel W-01 ... OK</p>
      <p data-boot-line>&gt; projecting holo layer .......... OK</p>
      <p data-boot-line>&gt; loading portfolio manifest ..... 06 NODES</p>
      <p data-boot-line>&gt; handshake .......................</p>
    </div>
    <div class="boot-bar"><i data-boot-bar></i></div>
    <p class="boot-pct"><b data-boot-pct>0</b>%%</p>
  </div>
  <p class="boot-grant" data-boot-grant>ACCESS GRANTED</p>
</div>

%(fx)s

%(nav)s

<!-- ===== HERO ===== -->
<section id="hero">
  <div class="hero-bg" aria-hidden="true">
    <span class="cone"></span>
%(hero_gears)s
  </div>

  <!-- emblem: the chrome wheel plus a holographic twin a few px out of register -->
  <div class="emblem" aria-hidden="true">
    <svg class="em-wire" viewBox="@@WVB@@"><use href="#wheelWire"/></svg>
    <svg class="em-solid" viewBox="@@WVB@@"><use href="#wheelSolid"/></svg>
    <span class="em-scan"></span>
  </div>

  <!-- engineering annotation -->
  <div class="bp" aria-hidden="true">
    <span class="bp-cross bc1"></span><span class="bp-cross bc2"></span>
    <span class="bp-cross bc3"></span><span class="bp-cross bc4"></span>
    <span class="bp-stamp bs-tl">SCALE&nbsp;1:1</span>
    <span class="bp-stamp bs-tr">REV&nbsp;2.6&nbsp;/&nbsp;SHEET&nbsp;01&nbsp;OF&nbsp;04</span>
    <span class="bp-stamp bs-bl">UNIT&nbsp;MK-AT-2026</span>
    <span class="bp-stamp bs-br">TOL&nbsp;&plusmn;0.05</span>
    <span class="bp-dim"><i class="bp-arrow"></i><b>1240.00</b><i class="bp-arrow bp-arrow-r"></i></span>
    <span class="bp-call bp-c1"><em></em>DRIVE WHEEL / W-01</span>
    <span class="bp-call bp-c2"><em></em>MOTOR HUB / &#8709;96</span>
    <span class="bp-call bp-c3"><em></em>BEARING &times;4</span>
  </div>

  <div class="hero-in">
    <p class="hero-kicker">
      <span class="tag tag-pink" data-scramble>SOFTWARE DEVELOPER</span>
      <span class="tag tag-cyan" data-scramble>HOUSTON, TX</span>
    </p>
    <h1 class="hero-name" data-text="MILES KING"><span data-split>MILES KING</span></h1>
    <p class="hero-kana" data-scramble>マイルス・キング</p>
    <p class="hero-lede">
      I build web apps, small utilities, and the occasional weird side project &mdash;
      then I measure whether they actually get used.
    </p>
    <div class="hero-cta">
      <a class="btn btn-pink" data-magnet href="#work"><span data-scramble>VIEW MY WORK</span></a>
      <a class="btn btn-ghost" data-magnet href="#contact"><span data-scramble>SAY HELLO</span></a>
    </div>
  </div>

  <div class="stickers" aria-hidden="true">
    <span class="stk stk-1">RANK 01</span>
    <span class="stk stk-2">JS / NODE / SQL</span>
    <span class="stk stk-3">ANALYTICS</span>
    <span class="stk stk-4">&#10022; NEW BUILD &#10022;</span>
  </div>

  <a class="scroll-cue" href="#stack"><span>SCROLL</span><span class="scroll-arrow" aria-hidden="true"></span></a>
</section>

%(tape)s

<main>

<!-- ===== TRICK.01 — WHAT I DO ===== -->
<section id="stack" class="sec">
  <span class="sec-gears" aria-hidden="true">
    %(gs1)s
    %(gs2)s
  </span>
%(head1)s

  <div class="stack-grid">
    <div class="glass spec" data-panel>
      <span class="g-frame" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
      <div class="spec-head">
        <span class="spec-mark" aria-hidden="true"></span>
        <span>PARTS &amp; TUNING</span>
        <span class="spec-id">MK-01</span>
      </div>
      <div class="gauges">
%(dials)s
      </div>
      <ul class="spec-list">
        <li><span>FRONT-END</span><b data-fill="92"></b><em data-count="92">0</em></li>
        <li><span>BACK-END</span><b data-fill="74"></b><em data-count="74">0</em></li>
        <li><span>ANALYTICS</span><b data-fill="88"></b><em data-count="88">0</em></li>
        <li><span>DATA VIZ</span><b data-fill="70"></b><em data-count="70">0</em></li>
        <li><span>SHIP SPEED</span><b data-fill="84"></b><em data-count="84">0</em></li>
      </ul>
      <table class="sheet">
        <caption>SPECIFICATION &mdash; MK-AT-2026</caption>
        <tbody>
          <tr><th>PART NO.</th><td>MK-2026-HTX</td><th>REV</th><td>2.6</td></tr>
          <tr><th>DRIVE</th><td>JAVASCRIPT / NODE</td><th>OUTPUT</th><td>WEB APPS</td></tr>
          <tr><th>TELEMETRY</th><td>GA4 / GTM / BIGQUERY</td><th>SAMPLE</th><td>100%%</td></tr>
          <tr><th>BASE</th><td>HOUSTON, TX</td><th>STATUS</th><td class="ok">ACTIVE</td></tr>
        </tbody>
      </table>
      <div class="spec-foot">
        <span class="spec-note">TUNED FOR: clean interfaces, fast pages,<br />tools that make a tedious thing simple.</span>
        <span class="spec-stamp">CERTIFIED</span>
      </div>
    </div>

    <div class="stack-copy">
      <p class="lede">
        I build <b>web apps</b>, small <b>utilities</b>, and the occasional weird
        side project. And because I work in <b>digital analytics</b> too, I like
        knowing whether the things I build actually work once people use them.
      </p>
      <div class="chip-set">
        <p class="chip-label">LANGUAGES</p>
        <ul class="chips"><li>JAVASCRIPT</li><li>HTML</li><li>CSS</li><li>PHP</li><li>SQL</li><li>PYTHON</li></ul>
      </div>
      <div class="chip-set">
        <p class="chip-label">FRAMEWORKS &amp; PLATFORMS</p>
        <ul class="chips"><li>NODE.JS</li><li>JQUERY</li><li>WORDPRESS</li><li>API INTEGRATION</li></ul>
      </div>
      <div class="chip-set">
        <p class="chip-label">ANALYTICS &amp; DATA</p>
        <ul class="chips"><li>GA4</li><li>GTM</li><li>LOOKER STUDIO</li><li>BIGQUERY</li><li>DATA VIZ</li></ul>
      </div>
      <a class="btn btn-ghost" data-magnet href="assets/Miles-King.pdf" target="_blank" rel="noopener"><span data-scramble>RESUME.PDF &darr;</span></a>
    </div>
  </div>
</section>

<!-- ===== TRICK.02 — WHO I AM ===== -->
<section id="rider" class="sec">
  <span class="sec-gears" aria-hidden="true">
    %(gr1)s
    %(gr2)s
  </span>
%(head2)s

  <div class="rider-grid">
%(rcard)s

    <div class="rider-copy">
      <blockquote class="bigquote">
        I like building things that <em>work cleanly</em> &mdash; and knowing whether
        they actually do once people start using them.
      </blockquote>
      <p>
        I came to software from a chemical-engineering background &mdash; a
        problem-solving, quantitative route rather than a CS one. I welcome new
        challenges and treat unfamiliar problems as a chance to learn something
        I didn't know yesterday.
      </p>
      <ul class="factlist">
        <li><span>01</span>Chemical engineering &rarr; software. The long way round.</li>
        <li><span>02</span>Ships small tools, then measures whether they get used.</li>
        <li><span>03</span>Houston, TX. Open to interesting problems.</li>
      </ul>
      <a class="btn btn-ghost" data-magnet href="about.html"><span data-scramble>MORE ABOUT ME &rarr;</span></a>
    </div>
  </div>
</section>

</main>

<!-- ===== TRICK.03 — MY WORK ===== -->
<section id="work" class="sec sec-deep">
  <span class="deep-gears" aria-hidden="true">
    %(gw1)s
    %(gw2)s
    %(gw3)s
  </span>
  <div class="sec-inner">
%(head3)s

    <div class="work-grid">
%(cards)s
    </div>
  </div>
</section>

<!-- ===== TRICK.04 — SAY HELLO ===== -->
<section id="contact" class="sec">
  <span class="sec-gears" aria-hidden="true">
    %(gc1)s
    %(gc2)s
  </span>
%(head4)s

  <div class="glass console" data-panel>
    <span class="g-frame" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
    <div class="console-head">
      <span class="leds" aria-hidden="true"><i class="on"></i><i class="on"></i><i></i></span>
      <span>TRANSMISSION CONSOLE</span>
      <span class="console-id" data-cycle>CH-04 / OPEN</span>
    </div>
    <form class="form" action="https://formspree.io/f/mpznbgbl" method="POST">
      <div class="f-row">
        <label class="field"><span>NAME</span><input type="text" name="name" placeholder="operator name" required /></label>
        <label class="field"><span>EMAIL</span><input type="email" name="email" placeholder="you@cyberspace.net" required /></label>
      </div>
      <label class="field"><span>MESSAGE</span><textarea rows="6" name="message" placeholder="begin transmission..." required></textarea></label>
      <div class="console-foot">
        <button class="btn btn-pink btn-big" data-magnet type="submit"><span data-scramble>TRANSMIT &#9654;</span></button>
        <dl class="console-read">
          <div><dt>LATENCY</dt><dd data-jitter="14">014&nbsp;ms</dd></div>
          <div><dt>REPLY</dt><dd>&lt;&nbsp;24&nbsp;h</dd></div>
          <div><dt>NODE</dt><dd>HTX-01</dd></div>
        </dl>
      </div>
    </form>
  </div>
</section>

%(footer)s

%(scripts)s
  </body>
</html>
''' % {
        'head': head('Miles King &#10022; Software Developer',
                     'Miles King — software developer based in Houston, Texas. Web apps, utilities, and case studies.',
                     is_index=True),
        'sprite': SPRITE, 'fx': FX, 'nav': nav('index'),
        'hero_gears': hero_gears,
        'tape': tape('JAVASCRIPT &#10022; NODE.JS &#10022; PHP &#10022; SQL &#10022; PYTHON &#10022; GA4 &#10022; GTM &#10022; BIGQUERY &#10022; GSAP &#10022;'),
        'gs1': gear('g-s1', 'gearB', 40), 'gs2': gear('g-s2', 'gearC', 15, True),
        'gr1': gear('g-r1', 'gearA', 36, True), 'gr2': gear('g-r2', 'gearC', 13),
        'gw1': gear('g-w1', 'gearB', 44), 'gw2': gear('g-w2', 'gearC', 19, True), 'gw3': gear('g-w3', 'gearA', 33),
        'gc1': gear('g-c1', 'gearB', 42, True), 'gc2': gear('g-c2', 'gearC', 16),
        'dials': '\n'.join([dial('FRONT-END', '92', '#ff4fd8'),
                            dial('BACK-END', '74', '#4ff5ff'),
                            dial('ANALYTICS', '88', '#b6ff4f')]),
        'head1': sec_head('TRICK.01', 'スキル', 'WHAT I DO'),
        'head2': sec_head('TRICK.02', 'ライダー', 'WHO I AM'),
        'head3': sec_head('TRICK.03', 'プロジェクト', 'MY WORK',
                          'A mix of small utilities I actually use and web experiments I built to learn something. Click any card to play with it.',
                          ('projects.html', 'FULL PROJECT INDEX')),
        'head4': sec_head('TRICK.04', 'コンタクト', 'SAY HELLO',
                          'Reach out about a project, a collaboration, an interesting problem, or just to say hi.'),
        'rcard': RIDER_CARD,
        'cards': '\n\n'.join(c(t) for t in INDEX_CARDS),
        'footer': footer('index'), 'scripts': SCRIPTS,
    }

# ---------------------------------------------------------------- about
def build_about():
    return '''%(head)s
  <body id="top">

%(sprite)s

%(fx)s

%(nav)s

<main>

<section class="sec page-top" id="profile">
  <span class="sec-gears" aria-hidden="true">
    %(gs1)s
    %(gs2)s
  </span>
%(headline)s
  <p class="page-lede">
    I'm a developer with a background in web development and digital
    analytics &mdash; I like building things that work cleanly, and I like
    knowing whether they actually do once people start using them. I
    originally trained as a chemical engineer, so I came to software from
    a problem-solving and quantitative background rather than a CS one &mdash;
    I welcome new challenges and treat unfamiliar problems as a chance to
    learn something I didn't know yesterday.
  </p>
</section>

%(tape)s

<section class="sec" id="skills">
  <span class="sec-gears" aria-hidden="true">
    %(gr1)s
    %(gr2)s
  </span>
%(headskills)s

  <div class="rider-grid">
%(rcard)s

    <div class="rider-copy">
      <div class="chip-set">
        <p class="chip-label">LANGUAGES</p>
        <ul class="chips"><li>JAVASCRIPT</li><li>HTML</li><li>CSS</li><li>PHP</li><li>SQL</li><li>PYTHON</li></ul>
      </div>
      <div class="chip-set">
        <p class="chip-label">FRAMEWORKS &amp; PLATFORMS</p>
        <ul class="chips"><li>NODE.JS</li><li>JQUERY</li><li>WORDPRESS</li><li>API INTEGRATION</li></ul>
      </div>
      <div class="chip-set">
        <p class="chip-label">ANALYTICS &amp; DATA</p>
        <ul class="chips"><li>GOOGLE ANALYTICS (GA4)</li><li>GOOGLE TAG MANAGER</li><li>LOOKER STUDIO</li><li>BIGQUERY</li><li>DATA VISUALIZATION</li><li>MARKETING AUTOMATION</li></ul>
      </div>
      <div class="chip-set">
        <p class="chip-label">FOUNDATIONS</p>
        <ul class="chips"><li>OBJECT-ORIENTED PROGRAMMING</li><li>MATHEMATICS</li></ul>
      </div>

      <div class="cta-row">
        <a class="btn btn-pink" data-magnet href="assets/Miles-King.pdf" target="_blank" rel="noopener"><span data-scramble>VIEW RESUME &darr;</span></a>
        <a class="btn btn-cyan" data-magnet href="projects.html"><span data-scramble>SEE MY WORK</span></a>
      </div>
    </div>
  </div>
</section>

</main>

%(footer)s

%(scripts)s
  </body>
</html>
''' % {
        'head': head('About &mdash; Miles King',
                     'About Miles King — developer with a background in web development and digital analytics.'),
        'sprite': SPRITE, 'fx': FX, 'nav': nav('about'),
        'gs1': gear('g-s1', 'gearB', 40), 'gs2': gear('g-s2', 'gearC', 15, True),
        'gr1': gear('g-r1', 'gearA', 36, True), 'gr2': gear('g-r2', 'gearC', 13),
        'headline': sec_head('PROFILE.DAT', 'オペレーター', 'WHO I AM', h='h1'),
        'tape': tape('DEVELOPER &#10022; ANALYST &#10022; ENGINEER &#10022; PUZZLE ENJOYER &#10022; HOUSTON TX &#10022;'),
        'headskills': sec_head('TRICK.01', 'スキル', 'WHAT I DO',
                               'Day to day I work across the front end and back end of the web &mdash; building features, maintaining sites, and making sure the measurement story behind them is accurate. The dual focus on development and analytics means I think about how a thing is built, how it&rsquo;ll be observed, and what the resulting data is actually saying &mdash; usually in the same breath.'),
        'rcard': RIDER_CARD,
        'footer': footer('about'), 'scripts': SCRIPTS,
    }

# ---------------------------------------------------------------- projects
def build_projects():
    utilities = [card('01', 'projects/study-something/', 'study-something.png',
                      'Study Something! chess study utility preview', 'Study Something!',
                      'Pulls random over-the-board games from top chess players so I can study unfamiliar positions.',
                      'UTILITY // CHESS // JS', 'LAUNCH', 'NEW &#10022; UTILITY', True, True)]
    experiments = [
        card('02', 'projects/7-3/', 'seven-three.png',
             '7-3 game preview — a Game Boy Color styled office RPG', '7-3',
             'A neverending workday RPG in the shape of a 1998 Game Boy Color cartridge. Answer email, file reports and clear printer jams as turn-based encounters on an endlessly generated map &mdash; or flip on autopilot and watch it play itself. You cannot lose, and the level cap is 1000.',
             'GAME // CANVAS // NO ENGINE', 'LAUNCH', 'NEW &#10022; GAME', True, False),
        card('03', 'projects/anime-blackjack/', 'anime-blackjack.jpg',
             'Anime Blackjack game preview — animated dealer and card table', 'Anime Blackjack',
             'Blackjack against an animated anime dealer, built in React and TypeScript with a full GSAP animation layer &mdash; card flights, hole-card flips, and a dealer who reacts to every hand.',
             'GAME // REACT // GSAP'),
        card('04', 'projects/infinite-crayons/', 'infinite-crayons.png',
             'InfiniteCrayons color palette generator preview', 'InfiniteCrayons',
             'A color palette generator with adjustable hue, brightness, and saturation per swatch.',
             'TOOL // COLOR'),
        card('05', 'projects/jst-play/', 'jst-play.png',
             'JSt Play drum machine preview', 'JSt Play',
             'A browser drum machine and step sequencer with switchable kit sounds.',
             'AUDIO // FUN'),
        card('06', 'projects/more-stock-images/', 'more-stock-images.png',
             'MoreStockImages photo search preview', 'MoreStockImages',
             'Search royalty-free photos across providers from a single, simple search bar.',
             'TOOL // API'),
        card('07', 'projects/mettatonex.html', 'mettatonex.png',
             'MettatonEX Discord bot preview', 'MettatonEX',
             'A customizable Discord bot that posts new YouTube uploads to a server channel.',
             'NODE.JS // DISCORD.JS', 'CASE STUDY'),
    ]
    return '''%(head)s
  <body id="top">

%(sprite)s

%(fx)s

%(nav)s

<main>

<section class="sec page-top" id="built">
  <span class="sec-gears" aria-hidden="true">
    %(gp1)s
    %(gp2)s
  </span>
%(headline)s
  <p class="page-lede">
    A mix of small utilities I actually use and web experiments I built
    to learn something. Click any card to play with it.
  </p>
</section>

%(tape)s

<section class="sec" id="utilities">
%(headutil)s
  <div class="work-grid">
%(utilities)s
  </div>
</section>

</main>

<section class="sec sec-deep" id="experiments">
  <span class="deep-gears" aria-hidden="true">
    %(gw1)s
    %(gw2)s
    %(gw3)s
  </span>
  <div class="sec-inner">
%(headexp)s
    <div class="work-grid">
%(experiments)s
    </div>
  </div>
</section>

%(footer)s

%(scripts)s
  </body>
</html>
''' % {
        'head': head('Projects &mdash; Miles King',
                     'Projects by Miles King — web apps, utilities, and case studies.'),
        'sprite': SPRITE, 'fx': FX, 'nav': nav('projects'),
        'gp1': gear('g-p1', 'gearB', 40), 'gp2': gear('g-p2', 'gearC', 15, True),
        'gw1': gear('g-w1', 'gearB', 44), 'gw2': gear('g-w2', 'gearC', 19, True), 'gw3': gear('g-w3', 'gearA', 33),
        'headline': sec_head('DIR.00', 'プロジェクト', "THINGS I'VE BUILT", h='h1'),
        'tape': tape('UTILITIES &#10022; WEB APPS &#10022; EXPERIMENTS &#10022; CASE STUDIES &#10022; SIDE QUESTS &#10022;'),
        'headutil': sec_head('DIR.01', 'ユーティリティ', 'UTILITIES', 'Things I actually use.'),
        'headexp': sec_head('DIR.02', '実験', 'WEB APPS &amp; EXPERIMENTS', 'For fun and practice.'),
        'utilities': '\n'.join(utilities),
        'experiments': '\n\n'.join(experiments),
        'footer': footer('projects'), 'scripts': SCRIPTS,
    }

# ---------------------------------------------------------------- write
for name, html in (('index.html', build_index()),
                   ('about.html', build_about()),
                   ('projects.html', build_projects())):
    html = html.replace('@@WVB@@', WHEEL_VB)
    assert '@@' not in html, 'unresolved token in ' + name
    path = os.path.join(ROOT, name)
    io.open(path, 'w', encoding='utf-8', newline='\n').write(html)
    print('wrote %s (%d bytes)' % (name, len(html.encode('utf-8'))))
