# -*- coding: utf-8 -*-
"""Generates mockups/air-gear-holo.html.

Gear/gauge geometry is computed rather than hand-authored so the teeth
actually mesh and the dial ticks sit on a real scale. Run:  python _build-holo.py
"""
import math, io

# ---------------------------------------------------------------- geometry
def gear_path(n=12, root=44.0, tip=58.0, cx=60.0, cy=60.0, tw=7.0, fl=3.5):
    """Outline of an n-tooth spur gear as one closed path."""
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
    """Full-sweep arc path. GSAP reveals a fraction of it via dashoffset."""
    a0, a1 = math.radians(GA_START), math.radians(GA_END)
    return 'M%.2f %.2f A%.0f %.0f 0 1 1 %.2f %.2f' % (
        cx + r * math.cos(a0), cy + r * math.sin(a0), r, r,
        cx + r * math.cos(a1), cy + r * math.sin(a1))

ARC_LEN = GA_R * math.radians(GA_SWEEP)

def needle_at_min(cx=50.0, cy=50.0, r=30.0):
    """Needle drawn at the scale minimum; GSAP rotates it up to the value."""
    a = math.radians(GA_START)
    return 'M%.2f %.2f L%.2f %.2f' % (cx, cy, cx + r * math.cos(a), cy + r * math.sin(a))

G12, G16, G8 = gear_path(12), gear_path(16, root=46, tip=58, tw=5.2, fl=2.6), gear_path(8, root=40, tip=58, tw=10, fl=5)
H5, H6 = holes(5, 27, rad=8), holes(6, 28, rad=6.5)
TICKS, ARC, NEEDLE = gauge_ticks(), gauge_arc(), needle_at_min()

# ---------------------------------------------------------------- fragments
def gear(cls, sym, dur, rev=False):
    return ('<span class="gear %s" data-gear data-dur="%s"%s>'
            '<svg viewBox="0 0 120 120"><use href="#%s"/></svg></span>') % (
            cls, dur, ' data-rev="1"' if rev else '', sym)

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

WING_PATHS = '''
      <path d="M342 196 C 250 150 158 116 66 92 C 100 130 154 168 232 196 C 274 210 318 216 344 214Z"/>
      <path d="M340 220 C 244 208 148 200 52 200 C 96 232 158 262 244 274 C 288 280 324 276 346 268Z"/>
      <path d="M344 246 C 258 262 174 288 100 326 C 152 342 216 344 288 322 C 324 310 348 292 356 274Z"/>
      <path d="M356 268 C 296 302 240 348 196 404 C 250 402 306 378 350 334 C 372 312 382 290 382 272Z"/>
      <path d="M418 196 C 510 150 602 116 694 92 C 660 130 606 168 528 196 C 486 210 442 216 416 214Z"/>
      <path d="M420 220 C 516 208 612 200 708 200 C 664 232 602 262 516 274 C 472 280 436 276 414 268Z"/>
      <path d="M416 246 C 502 262 586 288 660 326 C 608 342 544 344 472 322 C 436 310 412 292 404 274Z"/>
      <path d="M404 268 C 464 302 520 348 564 404 C 510 402 454 378 410 334 C 388 312 378 290 378 272Z"/>'''

PROJECTS = [
    ('01', 'Study Something!', 'Pulls random over-the-board games from top chess players so I can study unfamiliar positions.', 'UTILITY / CHESS / JS', 'chess', 'LAUNCH', 'NEW &#10022; UTILITY', True),
    ('02', 'Anime Blackjack', 'Blackjack against an animated dealer who reacts to every hand.', 'GAME / REACT / GSAP', 'cards', 'LAUNCH', 'NEW &#10022; GAME', False),
    ('03', 'InfiniteCrayons', 'Colour palette generator with per-swatch HSL control.', 'TOOL / COLOR', 'color', 'LAUNCH', None, False),
    ('04', 'JSt Play', 'Browser drum machine &amp; step sequencer.', 'AUDIO / FUN', 'audio', 'LAUNCH', None, False),
    ('05', 'MoreStockImages', 'Royalty-free photo search across providers.', 'TOOL / API', 'stock', 'LAUNCH', None, False),
    ('06', 'MettatonEX', 'Discord bot that announces new YouTube uploads.', 'NODE.JS / DISCORD.JS', 'bot', 'CASE STUDY', None, False),
]

def card(rank, title, desc, tags, shot, go, flag, top):
    flag_html = ''
    if flag:
        flag_html = '\n            <span class="card-flag%s">%s</span>' % (' is-amber' if top else '', flag)
    return '''      <article class="card%(top)s" data-tilt>
        <a href="#">
          <span class="card-rank">%(rank)s</span>
          <div class="card-shot" data-shot="%(shot)s">
            <span class="card-sheen" aria-hidden="true"></span>
            <span class="card-scan" aria-hidden="true"></span>
          </div>
          <div class="card-body">%(flag)s
            <h3 data-scramble>%(title)s</h3>
            <p>%(desc)s</p>
            <span class="card-tags">%(tags)s</span>
            <span class="card-pn"><em>P/N</em>MK-2026-%(rank)s<i></i>REV 2.6</span>
            <span class="card-go">%(go)s &rarr;</span>
          </div>
        </a>
        <span class="card-frame" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
      </article>''' % {'top': ' is-top' if top else '', 'rank': rank, 'shot': shot,
                       'flag': flag_html, 'title': title, 'desc': desc, 'tags': tags, 'go': go}

def sec_head(num, kana, title, sub=None, link=None, light=False):
    parts = ['''    <div class="sec-head">
      <p class="sec-tag"><span class="tag-gear" aria-hidden="true"><svg viewBox="0 0 120 120"><use href="#gearC"/></svg></span><i>TRICK.%s</i><span>%s</span></p>
      <h2 class="sec-title%s" data-text="%s" data-scramble><span>%s</span></h2>''' % (
        num, kana, ' is-light' if light else '', title, title)]
    if sub:
        parts.append('      <p class="sec-sub">%s</p>' % sub)
    if link:
        parts.append('      <a class="head-link" href="#"><span data-scramble>%s</span> <i>&rarr;</i></a>' % link)
    parts.append('    </div>')
    return '\n'.join(parts)

# ---------------------------------------------------------------- document
DOC = '''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>MK &#10022; AIR GEAR / HOLO &mdash; visual mockup</title>
<meta name="theme-color" content="#05060d" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62..125,400..900;1,62..125,400..900&amp;family=Chakra+Petch:ital,wght@0,300;0,400;0,500;0,600;0,700;1,600&amp;family=Space+Mono:wght@400;700&amp;family=Zen+Kaku+Gothic+New:wght@500;700;900&amp;display=swap" rel="stylesheet" />
<link rel="stylesheet" href="air-gear-holo.css" />
</head>
<body class="is-booting">

<!-- ===== mechanical sprite sheet ===== -->
<svg class="sprite" aria-hidden="true" width="0" height="0">
  <defs>
    <linearGradient id="chr" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%%" stop-color="#ffffff"/><stop offset="26%%" stop-color="#cfe0f5"/>
      <stop offset="45%%" stop-color="#6c7fa0"/><stop offset="51%%" stop-color="#2c3550"/>
      <stop offset="58%%" stop-color="#dfeaff"/><stop offset="80%%" stop-color="#7d8dae"/>
      <stop offset="100%%" stop-color="#e8f2ff"/>
    </linearGradient>
    <linearGradient id="iris" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%%" stop-color="#4ff5ff"/><stop offset="34%%" stop-color="#9d6bff"/>
      <stop offset="67%%" stop-color="#ff4fd8"/><stop offset="100%%" stop-color="#b6ff4f"/>
    </linearGradient>

    <g id="wingShape">%(wings)s
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
</svg>

<!-- ===== BOOT / ACCESS SEQUENCE ===== -->
<div id="boot" aria-hidden="true">
  <div class="boot-scan"></div>
  <div class="boot-core">
    <span class="boot-gear"><svg viewBox="0 0 120 120"><use href="#gearWire"/></svg></span>
    <p class="boot-id" data-boot-id>MK-AT-2026 :: PARADIGM CORE</p>
    <div class="boot-log">
      <p data-boot-line>&gt; mounting /dev/at0 .............. OK</p>
      <p data-boot-line>&gt; spinning up gear train ......... 12/12</p>
      <p data-boot-line>&gt; calibrating wing unit A-01 ..... OK</p>
      <p data-boot-line>&gt; projecting holo layer .......... OK</p>
      <p data-boot-line>&gt; loading portfolio manifest ..... 06 NODES</p>
      <p data-boot-line>&gt; handshake .......................</p>
    </div>
    <div class="boot-bar"><i data-boot-bar></i></div>
    <p class="boot-pct"><b data-boot-pct>0</b>%%</p>
  </div>
  <p class="boot-grant" data-boot-grant>ACCESS GRANTED</p>
</div>

<!-- ===== fixed atmosphere ===== -->
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
</div>

<!-- ===== NAV ===== -->
<header id="nav">
  <a class="logo" href="#hero">
    <span class="logo-wheel" aria-hidden="true"><svg viewBox="0 0 120 120"><use href="#gearC"/></svg></span>
    <b>MK</b>
  </a>
  <nav aria-label="Main">
    <a href="#hero" class="is-on"><span data-scramble>INTRO</span></a>
    <a href="#stack"><span data-scramble>WHAT I DO</span></a>
    <a href="#rider"><span data-scramble>WHO I AM</span></a>
    <a href="#work"><span data-scramble>MY WORK</span></a>
    <a href="#contact"><span data-scramble>CONTACT</span></a>
  </nav>
  <div class="nav-side">
    <span class="nav-kana">&#12510;&#12452;&#12523;&#12473;</span>
    <a class="nav-cta" href="#contact"><span data-scramble>SAY HELLO</span></a>
  </div>
</header>

<!-- ===== HERO ===== -->
<section id="hero">
  <div class="hero-bg" aria-hidden="true">
    <span class="cone"></span>
%(hero_gears)s
  </div>

  <!-- emblem: a physical chrome machine with a holographic twin that
       drifts a few pixels out of register -->
  <div class="emblem" aria-hidden="true">
    <svg class="em-wire" viewBox="0 0 760 470"><use href="#wingShape"/></svg>
    <svg class="em-solid" viewBox="0 0 760 470">
      <use href="#wingShape"/>
      <g class="em-hub">
        <circle cx="380" cy="240" r="96" fill="#070b16"/>
        <circle cx="380" cy="240" r="82" fill="none" stroke="url(#chr)" stroke-width="9"/>
        <g stroke="#cfe6ff" stroke-width="7" stroke-linecap="round">
          <path d="M380 168v26M380 286v26M308 240h26M426 240h26"/>
          <path d="M329 189l18 18M413 273l18 18M431 189l-18 18M347 273l-18 18"/>
        </g>
        <circle cx="380" cy="240" r="30" fill="#ff4fd8" stroke="#070b16" stroke-width="5"/>
        <circle cx="380" cy="240" r="13" fill="#070b16"/>
        <g fill="#b6ff4f">
          <circle cx="380" cy="196" r="5"/><circle cx="380" cy="284" r="5"/>
          <circle cx="336" cy="240" r="5"/><circle cx="424" cy="240" r="5"/>
        </g>
      </g>
    </svg>
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
    <span class="bp-call bp-c1"><em></em>WING UNIT / A-01</span>
    <span class="bp-call bp-c2"><em></em>MOTOR HUB / &#8709;96</span>
    <span class="bp-call bp-c3"><em></em>BEARING &times;4</span>
  </div>

  <div class="hero-in">
    <p class="hero-kicker">
      <span class="tag tag-pink" data-scramble>SOFTWARE DEVELOPER</span>
      <span class="tag tag-cyan" data-scramble>HOUSTON, TX</span>
      <span class="tag tag-out" data-scramble>EST. 2026</span>
    </p>
    <h1 class="hero-name" data-text="MILES KING"><span data-split>MILES KING</span></h1>
    <p class="hero-kana" data-scramble>&#12510;&#12452;&#12523;&#12473;&#12539;&#12461;&#12531;&#12464;</p>
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

<!-- ===== TAPE ===== -->
<div class="tape" aria-hidden="true">
  <div class="tape-track" data-tape>
    <span>JAVASCRIPT &#10022; NODE.JS &#10022; PHP &#10022; SQL &#10022; PYTHON &#10022; GA4 &#10022; GTM &#10022; BIGQUERY &#10022; GSAP &#10022;&nbsp;</span>
    <span>JAVASCRIPT &#10022; NODE.JS &#10022; PHP &#10022; SQL &#10022; PYTHON &#10022; GA4 &#10022; GTM &#10022; BIGQUERY &#10022; GSAP &#10022;&nbsp;</span>
  </div>
</div>

<main>

<!-- ===== TRICK.01 ===== -->
<section id="stack" class="sec">
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
      <a class="btn btn-ghost" data-magnet href="#"><span data-scramble>RESUME.PDF &darr;</span></a>
    </div>
  </div>
</section>

<!-- ===== TRICK.02 ===== -->
<section id="rider" class="sec">
%(head2)s

  <div class="rider-grid">
    <div class="glass rcard" data-panel data-tilt>
      <span class="g-frame" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
      <div class="rcard-top">
        <span class="rcard-rank">01</span>
        <div class="rcard-name">
          <b>MILES KING</b>
          <span>&#12510;&#12452;&#12523;&#12473;&#12539;&#12461;&#12531;&#12464;</span>
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
    </div>

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
      <a class="btn btn-ghost" data-magnet href="#"><span data-scramble>MORE ABOUT ME &rarr;</span></a>
    </div>
  </div>
</section>

</main>

<!-- ===== TRICK.03 ===== -->
<section id="work" class="sec sec-deep">
  <span class="deep-gears" aria-hidden="true">
%(work_gears)s
  </span>
  <div class="sec-inner">
%(head3)s

    <div class="work-grid">
%(cards)s
    </div>
  </div>
</section>

<!-- ===== TRICK.04 ===== -->
<section id="contact" class="sec">
%(head4)s

  <div class="glass console" data-panel>
    <span class="g-frame" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
    <div class="console-head">
      <span class="leds" aria-hidden="true"><i class="on"></i><i class="on"></i><i></i></span>
      <span>TRANSMISSION CONSOLE</span>
      <span class="console-id" data-cycle>CH-04 / OPEN</span>
    </div>
    <form class="form" onsubmit="return false">
      <div class="f-row">
        <label class="field"><span>NAME</span><input type="text" placeholder="your name" /></label>
        <label class="field"><span>EMAIL</span><input type="email" placeholder="you@somewhere.com" /></label>
      </div>
      <label class="field"><span>MESSAGE</span><textarea rows="6" placeholder="say something..."></textarea></label>
      <div class="console-foot">
        <button class="btn btn-pink btn-big" data-magnet type="submit"><span data-scramble>SEND IT &rarr;</span></button>
        <dl class="console-read">
          <div><dt>LATENCY</dt><dd data-jitter="14">014&nbsp;ms</dd></div>
          <div><dt>REPLY</dt><dd>&lt;&nbsp;24&nbsp;h</dd></div>
          <div><dt>NODE</dt><dd>HTX-01</dd></div>
        </dl>
      </div>
    </form>
  </div>
</section>

<!-- ===== FOOTER ===== -->
<footer id="footer">
  <span class="foot-gear"><svg viewBox="0 0 120 120"><use href="#gearWire"/></svg></span>
  <ul class="social">
    <li><a href="#" aria-label="GitHub" data-magnet><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.69 1.25 3.35.95.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.7 5.38-5.26 5.66.41.35.77 1.05.77 2.12 0 1.54-.01 2.77-.01 3.15 0 .3.2.67.8.55A11.52 11.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"/></svg></a></li>
    <li><a href="#" aria-label="LinkedIn" data-magnet><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z"/></svg></a></li>
  </ul>
  <p class="foot-line">&copy; 2026 MILES KING <i>&#10022;</i> SOFTWARE DEVELOPER <i>&#10022;</i> MILESKING.DEV</p>
  <p class="foot-sig" data-cycle>&mdash; HOLO LINK STABLE &mdash;</p>
  <a class="totop" href="#hero"><span data-scramble>BACK TO TOP &uarr;</span></a>
</footer>

<script src="../assets/js/vendor/gsap.min.js"></script>
<script src="../assets/js/vendor/ScrollTrigger.min.js"></script>
<script src="../assets/js/vendor/ScrollToPlugin.min.js"></script>
<script src="../assets/js/vendor/SplitText.min.js"></script>
<script src="../assets/js/vendor/ScrambleTextPlugin.min.js"></script>
<script src="../assets/js/vendor/Physics2DPlugin.min.js"></script>
<script src="../assets/js/vendor/Observer.min.js"></script>
<script src="../assets/js/vendor/CustomEase.min.js"></script>
<script src="air-gear-holo.js"></script>
</body>
</html>
'''

hero_gears = '\n'.join('    ' + g for g in [
    gear('g-a', 'gearA', 38), gear('g-b', 'gearB', 22, True), gear('g-c', 'gearC', 14),
    gear('g-d', 'gearA', 30, True), gear('g-e', 'gearB', 18), gear('g-f', 'gearC', 12, True),
])
work_gears = '\n'.join('    ' + g for g in [gear('g-w1', 'gearB', 44), gear('g-w2', 'gearC', 19, True)])

html = DOC % {
    'wings': WING_PATHS, 'g12': G12, 'g16': G16, 'g8': G8, 'h5': H5, 'h6': H6,
    'hero_gears': hero_gears, 'work_gears': work_gears,
    'dials': '\n'.join([dial('FRONT-END', '92', '#ff4fd8'),
                        dial('BACK-END', '74', '#4ff5ff'),
                        dial('ANALYTICS', '88', '#b6ff4f')]),
    'head1': sec_head('01', 'スキル', 'WHAT I DO'),
    'head2': sec_head('02', 'ライダー', 'WHO I AM'),
    'head3': sec_head('03', 'プロジェクト', 'MY WORK',
                      'A mix of small utilities I actually use and web experiments I built to learn something. Click any one to open it.',
                      'FULL PROJECT INDEX', light=True),
    'head4': sec_head('04', 'コンタクト', 'SAY HELLO',
                      'Reach out about a project, a collaboration, an interesting problem, or just to say hi.'),
    'cards': '\n\n'.join(card(*c) for c in PROJECTS),
}

io.open('air-gear-holo.html', 'w', encoding='utf-8', newline='').write(html)
print('wrote air-gear-holo.html  (%d bytes, arc len %.1f)' % (len(html), ARC_LEN))
