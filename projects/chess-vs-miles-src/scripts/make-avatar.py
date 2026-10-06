# -*- coding: utf-8 -*-
"""Draw the Miles avatar: a 32x32 Game Boy Color style bust, several expressions.

Hand-placed pixels, scaled 8x with nearest-neighbour to public/avatar/<name>.png.
Not a likeness - a cartoon the people who know him will recognise: bronze skin,
shoulder-length dreadlocks, rectangular glasses.

    python scripts/make-avatar.py
"""
import os
import tempfile
from PIL import Image

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'public', 'avatar')
SCALE = 8

PALETTE = {
    '.': None,                 # transparent
    'K': (26, 18, 38),         # outline
    'H': (58, 34, 20),         # dreads, dark
    'h': (96, 60, 32),         # dreads, highlight
    'S': (201, 138, 75),       # skin
    's': (165, 106, 51),       # skin shadow
    'G': (20, 20, 26),         # glasses frame
    'L': (142, 206, 224),      # lens
    'l': (232, 247, 251),      # lens glint
    'E': (26, 18, 38),         # eye
    'B': (46, 26, 14),         # brow
    'M': (122, 56, 44),        # mouth
    'O': (60, 22, 24),         # open mouth interior
    'W': (244, 241, 234),      # teeth
    'T': (56, 112, 220),       # shirt
    't': (38, 80, 168),        # shirt shadow
}

# Rows 0-8: hair (three lock tips on top). Rows 9-21: face, interior columns
# 9..22, flanked by two shaded locks per side. Rows 22-27: locks hanging to
# different lengths over the shoulders, two falling in front. Rows 25+: shirt.
BASE = [
    "..........KK....KK....KK........",
    ".........KhHK..KhHK..KhHK.......",
    "........KKhHHKKKHhHKKKhHHKK.....",
    "......KKHHhHHhHHhHHHhHHHHhKK....",
    ".....KHHhHHHhHHHhHHhHHhHHhHHK...",
    "....KHhHHHhHHHHHhHHHHhHHhHHK....",
    "....KHHHhHHHHhHHHHhHHHHHHhHK....",
    "...KHhHHHHhHHHHHHHhHHHhHHHHHK...",
    "...KHHhHKKKKKKKKKKKKKKKKHhHHK...",
    "...KHhHhKSSSSSSSSSSSSSSKhHhHK...",
    "...KhHhHKSBBBSSSSSBBBSSKHhHhK...",
    "...KHhHhKGGGGGGGGGGGGGGKhHhHK...",
    "...KHhHhKGlLELGSSGlLELGKhHhHK...",
    "...KHhHhKGLLLLGSSGLLLLGKhHhHK...",
    "...KhHhHKGGGGGGSSGGGGGGKHhHhK...",
    "...KHhHhKsSSSSSSSSSSSSsKhHhHK...",
    "...KHhHhKsSSSMMMMMMSSSsKhHhHK...",
    "...KHhHhKsSSSSSSSSSSSSsKhHhHK...",
    "...KhHhHKKsSSSSSSSSSSsKKHhHhK...",
    "...KHhHh.KKsSSSSSSSSsKK.hHhHK...",
    "...KHhHh..KKKsSSSSsKKK..hHhHK...",
    "...KHhHh....KsSSSSsK....hHhHK...",
    "...KHhHhKHhKKsSSSSsKKhHKhHhHK...",
    "...KHhHhKHhKKsSSSSsKKhHKhHhHK...",
    "...KKKHhKHhKTKssssKTKhHKhHKKK...",
    "..KKTKHhKKKTTTTtKKtTThHKhHKTTKK.",
    ".KTTTKHhKTTTTTtttttTTKKKKKTTTTTK",
    ".KTTTKKKKTTTTTTTTTTTTTTTTTTTTTTK",
    ".KtTTTTTTTTTTTTTTTTTTTTTTTTTTTtK",
    ".KtTTTTTTTTTTTTTTTTTTTTTTTTTTTtK",
    ".KttTTTTTTTTTTTTTTTTTTTTTTTTTttK",
    ".KttTTTTTTTTTTTTTTTTTTTTTTTTTttK",
]


def patch(rows, edits):
    """Return a copy of rows with (y, x, text) edits applied."""
    out = [list(r) for r in rows]
    for y, x, text in edits:
        for i, ch in enumerate(text):
            out[y][x + i] = ch
    return [''.join(r) for r in out]


# Face interior spans x=9..22. Brows row 10, lenses rows 12-13, mouth rows 16-17.
FRAMES = {
    # neutral, eyes forward
    'idle': BASE,
    # eyes shut: lens with a dark line where the eye was
    'blink': patch(BASE, [(12, 9, 'GlLLLGSSGlLLLG'), (13, 9, 'GEEELGSSGEEELG')]),
    # eyes up and to the side, mouth pulled small, one brow raised
    'think': patch(BASE, [
        (9, 9, 'SSSSSSSSSBBBSS'),
        (10, 9, 'SBBBSSSSSSSSSS'),
        (12, 9, 'GlLLEGSSGlLLEG'),
        (16, 9, 'sSSSSMMMMSSSSs'),
    ]),
    # smile: corners up
    'happy': patch(BASE, [(16, 9, 'sSSMSSSSSSMSSs'), (17, 9, 'sSSSMMMMMMSSSs')]),
    # grin with teeth, brows up
    'grin': patch(BASE, [
        (9, 9, 'SBBBSSSSSBBBSS'),
        (10, 9, 'SSSSSSSSSSSSSS'),
        (16, 9, 'sSSMWWWWWWMSSs'),
        (17, 9, 'sSSSMMMMMMSSSs'),
    ]),
    # furrowed brows (inner ends dropped), flat mouth lower
    'annoyed': patch(BASE, [
        (10, 9, 'SBBBBSSSBBBBSS'),
        (16, 9, 'sSSSSSSSSSSSSs'),
        (17, 9, 'sSSSMMMMMMSSSs'),
    ]),
    # brows up, mouth open
    'shock': patch(BASE, [
        (9, 9, 'SBBBSSSSSBBBSS'),
        (10, 9, 'SSSSSSSSSSSSSS'),
        (16, 9, 'sSSSSMMMMSSSSs'),
        (17, 9, 'sSSSSMOOMSSSSs'),
        (18, 10, 'sSSSSMMMMSSSs'),
    ]),
    # lost: brows angled sad (outer ends up), mouth down-turned
    'sad': patch(BASE, [
        (9, 9, 'SSSSBSSSSBSSSS'),
        (10, 9, 'SBBBSSSSSSBBBS'),
        (16, 9, 'sSSSSMMMMSSSSs'),
        (17, 9, 'sSSSMSSSSMSSSs'),
    ]),
}


def render(rows, path):
    img = Image.new('RGBA', (32, 32), (0, 0, 0, 0))
    px = img.load()
    for y, row in enumerate(rows):
        assert len(row) == 32, (y, len(row), row)
        for x, ch in enumerate(row):
            col = PALETTE[ch]
            if col is not None:
                px[x, y] = col + (255,)
    img = img.resize((32 * SCALE, 32 * SCALE), Image.NEAREST)
    img.save(path)


def main():
    os.makedirs(OUT, exist_ok=True)
    for name, rows in FRAMES.items():
        render(rows, os.path.join(OUT, name + '.png'))
        print('wrote', name)
    # Contact sheet for eyeballing; kept out of public/ so it is not deployed.
    sheet = Image.new('RGBA', (32 * SCALE * len(FRAMES), 32 * SCALE), (120, 160, 110, 255))
    for i, name in enumerate(FRAMES):
        sheet.paste(Image.open(os.path.join(OUT, name + '.png')), (i * 32 * SCALE, 0))
    sheet_path = os.path.join(tempfile.gettempdir(), 'miles-avatar-sheet.png')
    sheet.save(sheet_path)
    print('sheet', sheet_path)


if __name__ == '__main__':
    main()
