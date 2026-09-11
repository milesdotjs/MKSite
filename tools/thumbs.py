# -*- coding: utf-8 -*-
"""Display-size exports of the project screenshots.

The screenshots in assets/img/ are 1700-1900px-wide PNGs drawn into ~380px
cards (more-stock-images.png alone is 1.6 MB), so the build writes WebP + JPEG
copies at 760w and 1140w into assets/img/cards/ and the cards use <picture>
with srcset. Outputs are only rewritten when the source is newer.

    from thumbs import thumbs
    stem, dims = thumbs('jst-play.png')     # dims = {760: (w, h), 1140: (w, h)}
"""
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'assets', 'img')
OUT = os.path.join(SRC, 'cards')
WIDTHS = (760, 1140)

def _flatten(im):
    if im.mode in ('RGBA', 'LA') or (im.mode == 'P' and 'transparency' in im.info):
        im = im.convert('RGBA')
        bg = Image.new('RGB', im.size, (255, 255, 255))
        bg.paste(im, mask=im.split()[-1])
        return bg
    return im.convert('RGB')

def thumbs(name):
    src = os.path.join(SRC, name)
    stem = os.path.splitext(name)[0]
    os.makedirs(OUT, exist_ok=True)
    im = Image.open(src)
    dims, rgb = {}, None
    for w in WIDTHS:
        tw = min(w, im.width)                       # never upscale
        th = round(im.height * tw / im.width)
        dims[w] = (tw, th)
        outs = [os.path.join(OUT, '%s-%d.%s' % (stem, w, ext)) for ext in ('webp', 'jpg')]
        if all(os.path.exists(o) and os.path.getmtime(o) >= os.path.getmtime(src) for o in outs):
            continue
        if rgb is None:
            rgb = _flatten(im)
        small = rgb.resize((tw, th), Image.LANCZOS)
        small.save(outs[0], 'WEBP', quality=80, method=6)
        small.save(outs[1], 'JPEG', quality=82, optimize=True, progressive=True)
    return stem, dims
