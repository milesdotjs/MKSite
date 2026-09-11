# -*- coding: utf-8 -*-
"""Generates index.html / about.html / projects.html for the spec-sheet theme.

The theme is aimed at five Air Gear volume covers, picked from a study of all
56 Japanese Kodansha covers (37 volumes + the 19-volume reprint edition):

    v30  paper over a black instrument band; the tachometer bezel; one red
    v18  the measuring rail down the left edge; outline-glass headings
    v01  the cobalt drafting sheet; blueprint parts; the tube-frame wordmark
    v15  lower half only -- the gear train and the chronograph sub-dials
    v37  the one spectrum glass plate, inside the name

The site can't use the art, so every cover contributes a SYSTEM (colour
strategy, construction, instrument) rather than a picture. The reasoning and
the rules live in the header of assets/css/site.css.

The three pages share nav, rail, footer, sprite and card markup, so they are
generated from one source. All geometry is computed: the wordmark
(tools/wordmark.py), dial / sub-dials / blueprints / gear train / roundel
(tools/instruments.py) and the Air Treck wheel (tools/wheel.py).

    cd tools && python build_pages.py

Edit this file, not the generated HTML -- a hand edit to index.html is lost the
next time this runs. Templates use {{token}} placeholders (see fill()), not
%-formatting, so literal % and generated SVG can go in without escaping.
"""
import io, os, sys, urllib.parse
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from wheel import TYRE, TREAD, RIM, DRIVE, SPOKES, HUB_RING, BOLTS, BEARINGS
from thumbs import thumbs
from wordmark import wordmark_svg
from instruments import dial_bezel, subdial, blueprint_a, blueprint_b, gear_train, roundel, arc

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = 'https://mileskingdev.com/'      # CNAME

def fill(tpl, **kw):
    for k, v in kw.items():
        tpl = tpl.replace('{{%s}}' % k, v)
    if '{{' in tpl:
        i = tpl.index('{{')
        raise ValueError('unfilled token near: ' + tpl[i:i + 40])
    return tpl

# the roundel (black disc, thick white ring) doubles as the favicon
FAVICON = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E"
           "%3Ccircle cx='32' cy='32' r='31' fill='%23040404'/%3E"
           "%3Ccircle cx='32' cy='32' r='25.5' fill='none' stroke='%23fff' stroke-width='5'/%3E"
           "%3Ctext x='32' y='40' font-family='Arial,sans-serif' font-size='21' font-weight='700' "
           "text-anchor='middle' fill='%23fff'%3EMK%3C/text%3E%3C/svg%3E")

FONTS = ("https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;800;900"
         "&family=Chakra+Petch:wght@400;500;600;700&display=swap")

# The kana appear in two places and are always this one string at weight 700, so
# the font is subset to exactly these glyphs (text=): ~2 KB instead of ~58 KB of
# render-blocking CJK @font-face CSS. The write loop asserts no other kana ship.
KANA = 'マイルス・キング'
KANA_FONT = ("https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@700&text="
             + urllib.parse.quote(KANA) + "&display=swap")

NEW_TAB = '<span class="sr"> (opens in a new tab)</span>'

# ---------------------------------------------------------------- shared blocks
SPRITE = fill('''<!-- ===== sprite: the Air Treck wheel as flat drafting + two-tone cel ===== -->
<svg class="sprite" aria-hidden="true" width="0" height="0" focusable="false">
  <defs>
    <pattern id="tone45" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><circle cx="2.5" cy="2.5" r="1.1" fill="#8a939b"/></pattern>
    <symbol id="wheel" viewBox="0 0 400 400">
      <path class="wh-tyre" fill-rule="evenodd" d="{{tyre}}"/>
      <path class="wh-tone" fill-rule="evenodd" d="{{tyre}}"/>
      <path class="wh-tread" d="{{tread}}"/>
      <path class="wh-rim" fill-rule="evenodd" d="{{rim}}"/>
      <path class="wh-drive" d="{{drive}}"/>
      <circle class="wh-well" cx="200" cy="200" r="122"/>
      <path class="wh-spoke" d="{{spokes}}"/>
      <path class="wh-hub" fill-rule="evenodd" d="{{hub}}"/>
      <g class="wh-bolt">{{bolts}}</g>
      <g class="wh-bear">{{bearings}}</g>
      <circle class="wh-core" cx="200" cy="200" r="31"/>
      <circle class="wh-ring" cx="200" cy="200" r="23.5"/>
      <circle class="wh-bore" cx="200" cy="200" r="8"/>
    </symbol>
    <!-- the rim light is its own symbol, drawn static over the turning wheel -->
    <symbol id="wheel-edge" viewBox="0 0 400 400"><path class="wh-edge" d="{{edge}}"/></symbol>
  </defs>
</svg>''', tyre=TYRE, tread=TREAD, rim=RIM, drive=DRIVE, spokes=SPOKES, hub=HUB_RING,
    bolts=BOLTS, bearings=BEARINGS, edge=arc(200, 200, 186, -84, -14) + ' ' + arc(200, 200, 147, -78, -18))

# v18's debug fragments, pinned along the ladder (decorative, aria-hidden)
# Kept high on the ladder: lower bits collided with the retyping foot fragment
# on 650-900px-tall laptop screens (measured clear from 540px up).
RAIL_BITS = [(1, 'MIL'), (3, 'M_ ERROR'), (5, 'KING')]

def rail():
    """v18's measuring rail: two tick ladders at mismatched pitch (CSS), numbered
    majors, fragments along the ladder, a red index that tracks scroll, and a
    fragment at the foot that retypes on section change."""
    nums = ''.join('<li style="top:%dpx">%d</li>' % (72 * i - 5, i) for i in range(1, 41))
    bits = ''.join('<li class="rail-bit" style="top:%dpx">%s</li>' % (72 * n + 14, t) for n, t in RAIL_BITS)
    return '''<div class="rail" aria-hidden="true">
  <i class="rail-a"></i><i class="rail-b"></i>
  <ol class="rail-num">%s%s</ol>
  <i class="rail-idx" data-rail-idx></i>
  <p class="rail-frag" data-frag-out>MILES KING</p>
</div>''' % (nums, bits)

def head(title, desc, page):
    url = SITE + ('' if page == 'index' else page + '.html')
    return fill('''<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{{title}}</title>
    <meta name="description" content="{{desc}}" />
    <meta property="og:title" content="{{title}}" />
    <meta property="og:description" content="{{desc}}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="{{url}}" />
    <meta name="theme-color" content="#ffffff" />
    <link rel="icon" href="{{icon}}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="{{fonts}}" rel="stylesheet" />
    <link href="{{kana}}" rel="stylesheet" />
    <link rel="stylesheet" href="assets/css/site.css" />
  </head>''', title=title, desc=desc, url=url, icon=FAVICON, fonts=FONTS, kana=KANA_FONT)

def nav(page):
    if page == 'index':
        items = [('#stack', 'Skills'), ('#rider', 'About'), ('#work', 'Work'), ('#contact', 'Contact')]
        home, cta = '#hero', '#contact'
    else:
        items = [('index.html', 'Home'), ('about.html', 'About'), ('projects.html', 'Projects'), ('index.html#contact', 'Contact')]
        home, cta = 'index.html', 'index.html#contact'
    here = {'about': 'about.html', 'projects': 'projects.html'}.get(page)
    links = '\n'.join('    <a href="%s"%s>%s</a>' % (h, ' aria-current="page"' if h == here else '', t) for h, t in items)
    # the "Contact" item hides wherever the "Say hello" pill shows (site.css) -- one name per place
    return fill('''<a class="skip" href="#main">Skip to content</a>
<header id="nav">
  <a class="logo" href="{{home}}" aria-label="MK, Miles King, home">{{rd}}</a>
  <nav aria-label="Main">
{{links}}
  </nav>
  <a class="btn btn-ink nav-cta" href="{{cta}}">Say hello</a>
</header>''', home=home, rd=roundel('MK'), links=links, cta=cta)

LI_PATH = "M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z"

def gear_bed():
    """v15's gear train rising from the footer's bottom edge: the viewBox stops
    a little below the hubs, so the band's edge cuts through the train."""
    g, (bx, by, bw, bh) = gear_train('gt')
    vb = '%.0f %.0f %.0f %.0f' % (bx - 20, by - 20, bw + 40, bh * .64 + 20)
    return ('<svg class="gear-bed" viewBox="%s" preserveAspectRatio="xMidYMin meet" aria-hidden="true" focusable="false">%s</svg>' % (vb, g))

def footer(page):
    # the cover credit stack as a signature -- the Latin name leads, the kana is a small credit line.
    # Contact surface is deliberate: LinkedIn is the only social link (no GitHub -- Miles's
    # commits are day-job work) and no email address anywhere (recruiter spam); the form
    # in #contact is the way in. Keep these notes here, not in the shipped HTML.
    return fill('''<footer id="footer">
  {{gears}}
  <div class="foot-in">
    <div class="sig" aria-hidden="true">
      <span class="sig-name">Miles King</span>
      <span class="sig-kana">マイルス・キング</span>
      <span class="cap cap-dark">Software developer</span>
    </div>
    <ul class="social">
      <li><a href="https://linkedin.com/in/miles-k" target="_blank" rel="noopener" aria-label="LinkedIn (opens in a new tab)"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="{{li}}"/></svg></a></li>
    </ul>
    <p class="foot-line"><span>&copy; <span data-year>2026</span> Miles King, Houston, TX</span><a class="totop" href="{{top}}">Back to top</a></p>
  </div>
</footer>''', gears=gear_bed(), li=LI_PATH, top='#hero' if page == 'index' else '#top')

SCRIPTS = '''<script src="assets/js/vendor/gsap.min.js"></script>
<script src="assets/js/vendor/ScrollTrigger.min.js"></script>
<script src="assets/js/vendor/ScrollToPlugin.min.js"></script>
<script src="assets/js/vendor/ScrambleTextPlugin.min.js"></script>
<script src="assets/js/site.js"></script>'''

# display widths of a card screenshot, for srcset's picker
SIZES = {
    'card': '(max-width:640px) calc(100vw - 40px), (max-width:1080px) 46vw, 380px',
    'wide': '(max-width:640px) calc(100vw - 40px), (max-width:1080px) 92vw, 780px',
    'feature': '(max-width:900px) calc(100vw - 40px), 690px',
}

def card_img(img, kind):
    """<picture> of the display-size WebP + JPEG exports (tools/thumbs.py)."""
    stem, dims = thumbs(img)
    base = 'assets/img/cards/%s-' % stem
    widths = sorted(dims)
    def srcset(ext):
        seen, parts = set(), []
        for w in widths:
            if dims[w][0] not in seen:          # a small source can't fill both sizes
                seen.add(dims[w][0])
                parts.append('%s%d.%s %dw' % (base, w, ext, dims[w][0]))
        return ', '.join(parts)
    w, h = dims[widths[0]]
    return ('<picture><source type="image/webp" srcset="%s" sizes="%s" />'
            '<img src="%s%d.jpg" srcset="%s" sizes="%s" width="%d" height="%d" alt="" loading="lazy" decoding="async" />'
            '</picture>') % (srcset('webp'), SIZES[kind], base, widths[0], srcset('jpg'), SIZES[kind], w, h)

def card(n, href, img, title, desc, tags, go='Open', flag=None, top=False, wide=False, feature=False):
    """One project card. The whole card is one link; its accessible name is the
    title (+ "New"), its description the one-line pitch. The screenshot is
    decorative inside the link (alt=""), and the drafting strip is aria-hidden."""
    cls = 'card' + (' is-top' if top else '') + (' is-wide' if wide else '') + (' is-feature' if feature else '')
    return fill('''      <article class="{{cls}}">
        <a href="{{href}}" aria-labelledby="c{{n}}-t{{fl}}" aria-describedby="c{{n}}-d">
          <div class="card-shot">{{img}}{{flag}}</div>
          <div class="card-body">
            <h3 id="c{{n}}-t">{{title}}</h3>
            <p class="card-desc" id="c{{n}}-d">{{desc}}</p>
            <ul class="card-tags">{{tags}}</ul>
            <p class="card-pn" aria-hidden="true"><i></i><span class="card-go">{{go}}</span></p>
          </div>
        </a>
      </article>''', cls=cls, href=href, n=n,
        fl=(' c%s-f' % n) if flag else '',
        img=card_img(img, 'feature' if feature else 'wide' if wide else 'card') if img else '',
        flag=('<span class="card-flag" id="c%s-f">%s</span>' % (n, flag)) if flag else '',
        title=title, desc=desc, tags=''.join('<li>%s</li>' % t for t in tags), go=go)

def chip_sets(sets, cls='tool-set', level=4):
    return '\n'.join('''        <div class="%s">
          <h%d class="tool-h">%s</h%d>
          <ul class="chips">%s</ul>
        </div>''' % (cls, level, name, level, ''.join('<li>%s</li>' % c for c in chips)) for name, chips in sets)

GAUGES = [('Front-end', 92), ('Back-end', 74), ('Analytics', 88), ('Data viz', 70), ('Ship speed', 84)]

def gauges():
    return '\n'.join('''        <li class="gauge" data-val="%d">%s<p class="g-read"><span>%s</span><b data-count>%d</b><span class="sr"> out of 100</span></p></li>''' % (
        v, subdial(v), label, v) for label, v in GAUGES)

# every cell is a fact already stated elsewhere on the site -- it's laid out as
# data, so it has to be data (the old theme's "Rev 2.6 / Sample 100%" is gone)
TITLE_BLOCK = '''<table class="tblock">
          <caption>Specification</caption>
          <tbody>
            <tr><th scope="row">Role</th><td>Software developer</td><th scope="row">Base</th><td>Houston, TX</td></tr>
            <tr><th scope="row">Stack</th><td>JavaScript / TypeScript / React / Node / PHP / SQL</td><th scope="row">Output</th><td>Web apps &amp; tools</td></tr>
            <tr><th scope="row">Analytics</th><td>GA4 / GTM / BigQuery</td><th scope="row">Background</th><td>Chemical engineering</td></tr>
          </tbody>
          <tfoot><tr><td colspan="4">Tuned for clean interfaces, fast pages, and tools that make a tedious thing simple.</td></tr></tfoot>
        </table>'''

def id_plate():
    return fill('''      <div class="idplate">
        <div class="idp-head">
          {{rd}}
          <p class="idp-name"><b>Miles King</b><span>Software developer</span></p>
          <span class="cap idp-badge">Dev</span>
        </div>
        <div class="idp-photo" aria-hidden="true"><svg viewBox="0 0 400 400"><use href="#wheel"/></svg></div>
        <dl class="idp-fields">
          <div><dt>Class</dt><dd>Developer &times; analytics</dd></div>
          <div><dt>Base</dt><dd>Houston, TX</dd></div>
          <div><dt>Route</dt><dd>Chem eng &rarr; software</dd></div>
          <div><dt>Status</dt><dd>Caffeinated</dd></div>
        </dl>
        <p class="idp-foot" aria-hidden="true"><span>mileskingdev.com</span><i></i></p>
      </div>''', rd=roundel('MK', 'roundel idp-rd'))

def bp_svg(which, cls):
    if which == 'a':
        return '<div class="bp %s" aria-hidden="true"><svg viewBox="0 0 440 420" focusable="false">%s</svg></div>' % (cls, blueprint_a('bpa-' + cls))
    return '<div class="bp %s" aria-hidden="true"><svg viewBox="0 0 470 420" focusable="false">%s</svg></div>' % (cls, blueprint_b('bpb-' + cls))

# ---------------------------------------------------------------- index
# (n, href, screenshot, title, description, tags, action, flag, top, wide)
INDEX_CARDS = [
    ('01', 'projects/7-3/', 'seven-three.png', '7-3',
     'A neverending workday RPG styled like a 1998 Game Boy Color game &mdash; '
     'email, reports and printer jams are turn-based encounters.',
     ['Game', 'Canvas', 'Custom engine'], 'Play', 'New', True, True),
    ('02', 'projects/study-something/', 'study-something.png', 'Study Something!',
     'Pulls random over-the-board games from top chess players so I can study unfamiliar positions.',
     ['Utility', 'Chess', 'Lichess API'], 'Open', 'New', False, False),
    ('03', 'projects/anime-blackjack/', 'anime-blackjack.jpg', 'Shadow Games',
     'Blackjack and chess against animated anime opponents &mdash; the chess bots run Stockfish right in your browser.',
     ['Game', 'React', 'Stockfish'], 'Play', None, False, False),
    ('04', 'projects/infinite-crayons/', 'infinite-crayons.png', 'InfiniteCrayons',
     'Color palette generator with per-swatch HSL control.',
     ['Tool', 'chroma.js'], 'Open', None, False, False),
    ('05', 'projects/jst-play/', 'jst-play.png', 'JSt Play',
     'Browser drum machine &amp; step sequencer.',
     ['Audio', 'HTML5 audio'], 'Open', None, False, False),
    ('06', 'projects/more-stock-images/', 'more-stock-images.png', 'MoreStockImages',
     'Royalty-free photo search built on the Pexels API.',
     ['Tool', 'Pexels API'], 'Open', None, False, False),
    ('07', 'projects/mettatonex.html', 'mettatonex.png', 'MettatonEX',
     'Discord bot that announces new YouTube uploads.',
     ['Bot', 'Node.js', 'Discord.js'], 'Read case study', None, False, False),
]

# fills the grid's last slot at three columns with a real destination, not a filler
CARD_MORE = '''      <article class="card card-more">
        <a href="projects.html" aria-labelledby="cm-t" aria-describedby="cm-d">
          <div class="more-in">
            <p class="more-title" id="cm-t">All projects</p>
            <p class="more-sub" id="cm-d">Longer descriptions of every build, grouped into utilities and experiments.</p>
            <p class="card-pn" aria-hidden="true"><i></i><span class="card-go">Open</span></p>
          </div>
        </a>
      </article>'''

TOOLS_INDEX = [('Languages', ['JavaScript', 'TypeScript', 'HTML', 'CSS', 'PHP', 'SQL', 'Python']),
               ('Frameworks &amp; platforms', ['React', 'Node.js', 'jQuery', 'WordPress', 'API integration']),
               ('Analytics &amp; data', ['GA4', 'GTM', 'Looker Studio', 'BigQuery', 'Data viz'])]

def hero_dial():
    # a ring 1400 units across, centred far below the band, so only the top of
    # its bezel sweeps the band -- v30's giant tachometer. It ends at 9 so the
    # Air Treck wheel on the right doesn't bury the last numerals.
    return ('<svg class="hero-dial" viewBox="0 0 1440 250" preserveAspectRatio="xMidYMin slice" focusable="false">%s</svg>'
            % dial_bezel(720, 1440, 1400, -32, 16, 9, (-6.0, 6.0), rest=7.2))

def build_index():
    cards = '\n\n'.join(card(*t) for t in INDEX_CARDS)
    return fill('''{{head}}
  <body>

{{sprite}}

{{rail}}

{{nav}}

<main id="main">

<!-- ===== HERO (v30: paper over a black instrument band) ===== -->
<section id="hero" class="hero" data-frag="MILES KING">
  <div class="hero-grid" aria-hidden="true"></div>
  <svg class="hero-orbit" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path pathLength="1" d="M-40 850C420 690 860 790 1480 210"/></svg>
  <div class="hero-band" aria-hidden="true">{{dial}}</div>
  <div class="hero-wheel" aria-hidden="true"><svg class="wh-turn" viewBox="0 0 400 400" focusable="false"><use href="#wheel"/></svg><svg class="wh-light" viewBox="0 0 400 400" focusable="false"><use href="#wheel-edge"/></svg></div>

  <div class="hero-in">
    <div class="hero-mark">
      <h1 class="hero-name"><span class="sr">Miles King</span>{{wm1}}{{wm2}}</h1>
      <span class="hero-plate" aria-hidden="true">Measured twice</span>
    </div>
    <p class="hero-kana" aria-hidden="true">マイルス・キング</p>
    <p class="hero-tags"><span class="cap">Software developer</span><span class="cap">Web analytics</span><span class="cap">Houston, TX</span></p>
    <p class="hero-lede">I build websites, web apps, and funny ideas &mdash; then I quantitatively analyze whether the funny ideas were actually any good.</p>
  </div>

  <div class="hero-card">
    <a class="btn btn-ink" href="#work">View my work</a>
    <a class="btn btn-line" href="#contact">Say hello</a>
  </div>
</section>

<!-- ===== WHAT I DO (v01 cobalt drafting sheet, then v15 calibration strip) ===== -->
<section id="stack" data-frag="SKILLS">
  <div class="sheet">
    <div class="sheet-grid" aria-hidden="true"></div>
    {{bpa}}
    {{bpb}}
    <div class="sec-in">
      <h2 class="sec-title">What I do</h2>
      <div class="stack-grid">
        <div class="stack-copy">
          <p class="lede">
            Most of my work sits where code meets measurement. I build <b>web apps</b>
            and <b>small tools</b> in JavaScript, PHP and SQL, and I set up the
            <b>analytics</b> &mdash; GA4, Tag Manager, BigQuery &mdash; that shows what
            people actually do with them.
          </p>
          <a class="btn btn-paper" href="assets/Miles-King.pdf" target="_blank" rel="noopener">View résumé (PDF){{newtab}}</a>
        </div>
        {{tblock}}
      </div>
    </div>
  </div>

  <div class="strip">
    <div class="sec-in">
      <h3 class="strip-title">Skills &amp; tools</h3>
      <p class="strip-key">Self-rated, out of 100. Nobody's a 100.</p>
      <ul class="gauges" aria-label="Skill levels">
{{gauges}}
      </ul>
      <div class="tools">
{{tools}}
      </div>
    </div>
  </div>
</section>

<!-- ===== WHO I AM ===== -->
<section id="rider" class="sec" data-frag="ABOUT">
  <div class="sec-in">
    <h2 class="sec-title">Who I am</h2>
    <div class="rider-grid">
{{plate}}
      <div class="rider-copy">
        <blockquote class="bigquote">
          I like building things that work cleanly &mdash; and knowing whether
          they actually do once people start using them.
        </blockquote>
        <p>
          I came to software from a chemical-engineering background &mdash; a
          problem-solving, quantitative route rather than a CS one. I welcome new
          challenges and treat unfamiliar problems as a chance to learn something
          I didn't know yesterday.
        </p>
        <ul class="facts">
          <li>Chemical engineering &rarr; software. The long way round.</li>
          <li>Ships small tools, then measures whether they get used.</li>
          <li>Houston, TX. Open to interesting problems.</li>
        </ul>
        <a class="btn btn-line" href="about.html">More about me</a>
      </div>
    </div>
  </div>
</section>

<!-- ===== MY WORK ===== -->
<section id="work" class="sec sec-work" data-frag="WORK">
  <div class="sec-in">
    <div class="sec-head">
      <h2 class="sec-title">My work</h2>
      <p class="sec-sub">Small tools I actually use, and web experiments I built to learn something. Most of them run right in your browser.</p>
      <a class="head-link" href="projects.html">All projects</a>
    </div>
    <div class="work-grid">
{{cards}}

{{more}}
    </div>
  </div>
</section>

<!-- ===== SAY HELLO (black band) ===== -->
<section id="contact" class="sec band-sec" data-frag="HELLO">
  <div class="sec-in contact-grid">
    <div class="contact-copy">
      <h2 class="sec-title">Say hello</h2>
      <p class="sec-sub">Reach out about a project, a collaboration, an interesting problem, or just to say hi.</p>
      <p class="contact-note">I usually reply within a day.</p>
    </div>
    <form class="form" action="https://formspree.io/f/mpznbgbl" method="POST" aria-describedby="f-note" data-form>
      <p class="f-note" id="f-note">All fields are required.</p>
      <div class="f-row">
        <label class="field"><span>Name</span><input type="text" name="name" autocomplete="name" required /></label>
        <label class="field"><span>Email</span><input type="email" name="email" autocomplete="email" required /></label>
      </div>
      <label class="field"><span>Message</span><textarea rows="6" name="message" required></textarea></label>
      <div class="form-foot">
        <button class="btn btn-ink" type="submit">Send message</button>
        <p class="form-status" role="status" aria-live="polite"></p>
      </div>
    </form>
  </div>
</section>

</main>

{{footer}}

{{scripts}}
  </body>
</html>
''', head=head('Miles King &mdash; Software developer &amp; web analytics',
               'Miles King is a software developer and web analytics specialist in Houston, TX. '
               'He builds web apps and small tools, then measures whether people use them.', 'index'),
        sprite=SPRITE, rail=rail(), nav=nav('index'), dial=hero_dial(),
        wm1=wordmark_svg('MILES KING', 'wmA', cls='wm wm-one'),
        wm2=wordmark_svg(['MILES', 'KING'], 'wmB', cls='wm wm-two'),
        bpa=bp_svg('a', 'bp-a'), bpb=bp_svg('b', 'bp-b'), tblock=TITLE_BLOCK, newtab=NEW_TAB,
        gauges=gauges(), tools=chip_sets(TOOLS_INDEX), plate=id_plate(), cards=cards, more=CARD_MORE,
        footer=footer('index'), scripts=SCRIPTS)

# ---------------------------------------------------------------- about
TOOLS_ABOUT = [('Languages', ['JavaScript', 'TypeScript', 'HTML', 'CSS', 'PHP', 'SQL', 'Python']),
               ('Frameworks &amp; platforms', ['React', 'Node.js', 'jQuery', 'WordPress', 'API integration']),
               ('Analytics &amp; data', ['Google Analytics (GA4)', 'Google Tag Manager', 'Looker Studio',
                                        'BigQuery', 'Data visualization', 'Marketing automation']),
               ('Foundations', ['Object-oriented programming', 'Mathematics'])]

def build_about():
    return fill('''{{head}}
  <body id="top">

{{sprite}}

{{rail}}

{{nav}}

<main id="main">

<section class="sec page-top" data-frag="PROFILE">
  <div class="page-grid" aria-hidden="true"></div>
  <div class="sec-in">
    <h1 class="sec-title">Who I am</h1>
    <div class="top-grid">
    <p class="page-lede">
      I'm a developer with a background in web development and digital
      analytics &mdash; I like building things that work cleanly, and I like
      knowing whether they actually do once people start using them. I
      originally trained as a chemical engineer, so I came to software from
      a problem-solving and quantitative background rather than a CS one &mdash;
      I welcome new challenges and treat unfamiliar problems as a chance to
      learn something I didn't know yesterday.
    </p>
{{plate}}
    </div>
  </div>
</section>

<section class="sheet sheet-slim" data-frag="SKILLS">
  <div class="sheet-grid" aria-hidden="true"></div>
  {{bpa}}
  {{bpb}}
  <div class="sec-in">
    <h2 class="sec-title">What I do</h2>
    <p class="lede sheet-lede">
      Day to day I work across the front end and back end of the web &mdash;
      building features, maintaining sites, and making sure the measurement story
      behind them is accurate. The dual focus on development and analytics means I
      think about how a thing is built, how it&rsquo;ll be observed, and what the
      resulting data is actually saying &mdash; usually in the same breath.
    </p>
  </div>
</section>

<section class="sec" id="profile" data-frag="TOOLS">
  <div class="sec-in">
    <h2 class="sec-title sec-title-s">Tools</h2>
    <div class="tools-paper">
{{tools}}
    </div>
    <div class="cta-row">
      <a class="btn btn-ink" href="assets/Miles-King.pdf" target="_blank" rel="noopener">View résumé (PDF){{newtab}}</a>
      <a class="btn btn-line" href="projects.html">See all projects</a>
    </div>
  </div>
</section>

</main>

{{footer}}

{{scripts}}
  </body>
</html>
''', head=head('About &mdash; Miles King',
               'About Miles King: a software developer with a background in web analytics and chemical engineering.', 'about'),
        sprite=SPRITE, rail=rail(), nav=nav('about'),
        bpa=bp_svg('a', 'bp-a'), bpb=bp_svg('b', 'bp-b'), newtab=NEW_TAB,
        plate=id_plate(), tools=chip_sets(TOOLS_ABOUT, 'tool-set is-paper', 3),
        footer=footer('about'), scripts=SCRIPTS)

# ---------------------------------------------------------------- projects
def build_projects():
    utilities = [card('01', 'projects/study-something/', 'study-something.png', 'Study Something!',
                      'Pulls random over-the-board games from top chess players so I can study unfamiliar positions.',
                      ['Utility', 'Chess', 'Lichess API'], 'Open', 'New', True, False, True)]
    experiments = [
        card('02', 'projects/7-3/', 'seven-three.png', '7-3',
             'A neverending workday RPG styled like a 1998 Game Boy Color game. Answer email, file reports and clear printer jams as turn-based encounters on an endlessly generated map &mdash; or flip on autopilot and watch it play itself. You cannot lose, and the level cap is 1000.',
             ['Game', 'Canvas', 'Custom engine'], 'Play', 'New', True),
        card('03', 'projects/anime-blackjack/', 'anime-blackjack.jpg', 'Shadow Games',
             'Two games against animated anime opponents, built in React and TypeScript with a full GSAP animation layer: blackjack against a dealer who reacts to every hand, and chess against six character bots running Stockfish in WebAssembly, each with its own difficulty ladder.',
             ['Game', 'React', 'Stockfish'], 'Play'),
        card('04', 'projects/infinite-crayons/', 'infinite-crayons.png', 'InfiniteCrayons',
             'A color palette generator with adjustable hue, brightness, and saturation per swatch.',
             ['Tool', 'chroma.js']),
        card('05', 'projects/jst-play/', 'jst-play.png', 'JSt Play',
             'A browser drum machine and step sequencer with switchable kit sounds.',
             ['Audio', 'HTML5 audio']),
        card('06', 'projects/more-stock-images/', 'more-stock-images.png', 'MoreStockImages',
             'Search the Pexels library of royalty-free photos from one simple search bar.',
             ['Tool', 'Pexels API']),
        card('07', 'projects/mettatonex.html', 'mettatonex.png', 'MettatonEX',
             'A customizable Discord bot that posts new YouTube uploads to a server channel.',
             ['Bot', 'Node.js', 'Discord.js'], 'Read case study'),
    ]
    return fill('''{{head}}
  <body id="top">

{{sprite}}

{{rail}}

{{nav}}

<main id="main">

<section class="sec page-top" data-frag="INDEX">
  <div class="page-grid" aria-hidden="true"></div>
  <div class="sec-in">
    <p class="page-sig">Miles King</p>
    <h1 class="sec-title">Things I've built</h1>
    <p class="page-lede">
      Small tools I actually use, and web experiments I built to learn
      something. Most of them run right in your browser.
    </p>
  </div>
</section>

<section class="sec sec-work" id="utilities" data-frag="TOOLS">
  <div class="sec-in">
    <div class="sec-head">
      <h2 class="sec-title sec-title-s">Utilities</h2>
      <p class="sec-sub">Things I actually use.</p>
    </div>
    <div class="work-grid">
{{utilities}}
    </div>
  </div>
</section>

<section class="sec band-sec sec-work" id="experiments" data-frag="LAB">
  <div class="sec-in">
    <div class="sec-head">
      <h2 class="sec-title sec-title-s">Web apps &amp; experiments</h2>
      <p class="sec-sub">For fun and practice.</p>
    </div>
    <div class="work-grid">
{{experiments}}
    </div>
  </div>
</section>

</main>

{{footer}}

{{scripts}}
  </body>
</html>
''', head=head('Projects &mdash; Miles King',
               'Games, utilities and a Discord bot by Miles King. Most of them run right in your browser.', 'projects'),
        sprite=SPRITE, rail=rail(), nav=nav('projects'),
        utilities='\n'.join(utilities), experiments='\n\n'.join(experiments),
        footer=footer('projects'), scripts=SCRIPTS)

# ---------------------------------------------------------------- write
if __name__ == '__main__':
    for name, html in (('index.html', build_index()),
                       ('about.html', build_about()),
                       ('projects.html', build_projects())):
        # the kana webfont is subset to KANA; any other kana would fall back to a system face
        stray = set(ch for ch in html if '぀' <= ch <= 'ヿ') - set(KANA)
        assert not stray, 'kana outside the font subset in %s: %s' % (name, ''.join(sorted(stray)))
        path = os.path.join(ROOT, name)
        io.open(path, 'w', encoding='utf-8', newline='\n').write(html)
        print('wrote %s (%d bytes)' % (name, len(html.encode('utf-8'))))
