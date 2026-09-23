# Try Not to Use Bankai

A totally fair anime trivia game in a 90s arcade-fighter cabinet. Pick your
interrogator, answer ten questions, make at most one mistake. On the second
mistake they use the move. They always use the move.

| Interrogator | Series weighting | Finisher | Rival who steals the win |
|---|---|---|---|
| Byakuya Kuchiki (default) | Bleach | Bankai: Senbonzakura Kageyoshi | Ichigo: "I WON!" |
| Pain | Naruto | Almighty Push | Naruto: "I WIN! BELIEVE IT!" |
| Piccolo | Dragon Ball | Special Beam Cannon | Goku: "HEH! I WIN!" |

Next.js (App Router, static export) + TypeScript + GSAP + a WebAudio synth.
No audio files. Sprites: Bleach: Dark Souls and The 3rd Phantom (DS), Naruto:
Shinobi Rumble (DS), Dragon Ball Z: Hyper Dimension and Super Butoden 3 (SNES),
all via The Spriters Resource.

## Run it

```
npm install
npm run dev          # http://localhost:3000/projects/try-not-to-use-bankai/
npm run build:site   # static export, copied to ../try-not-to-use-bankai/ (what GitHub Pages serves)
```

The public URL is baked in by `next.config.ts` (`basePath`), so the export only
works from `/projects/try-not-to-use-bankai/`. Change that constant if the folder moves.

## Trivia pool

Source of truth: one JSON file per series in `data/`. 375 questions:
100 Bleach (anime filler included, tagged `filler`), 100 Naruto (no filler, no
Boruto), 100 Dragon Ball (mostly Z, plus original Dragon Ball, Super and the
Z/Super films, no GT; tagged `db`, `dbz`, `super`, `movie`), and 25 each for
Yu-Gi-Oh! Duel Monsters, Jujutsu Kaisen and Yu Yu Hakusho. English anime names.
`answer` is the index of the correct option; options are shuffled at runtime.

```
npm run check:questions   # ids unique, 4 distinct options, per-series tally
npm run export:csv        # writes trivia-export.csv for review in Google Sheets
```

Each run asks 3 easy, 4 medium, 3 hard questions: five from the interrogator's
own series and one from each of the other five. Recently asked ids are
remembered in localStorage so the pool cycles before repeating.

## Where things live

- `lib/hosts.ts`: everything per interrogator: sprites, stage, meter labels,
  every line of dialogue, ranks. The host never names the finisher.
- `components/*Cutscene.tsx`: one finisher per host, plus the shared `WinCutscene`.
- `lib/sprites.json`: frame manifest (size and feet offset per frame).

## Dev hooks

- `?host=pain` (or `byakuya`, `piccolo`) preselects the interrogator.
- `?debug=1` marks the correct answer in the DOM (`data-correct`), used by the screenshot rig.
- `?debug=finisher`, `?debug=win`, `?debug=lose` jump to that beat (cutscenes start on the first key).
- Keys: `1-4` / `A-D` answer, `Enter`/`Space` advance, left/right pick a host on the title, `M` mute.
