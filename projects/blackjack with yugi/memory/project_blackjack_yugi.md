---
name: Project — Blackjack with Yugi
description: Browser-based React blackjack game where Yugi/Atem is the dealer; Yu-Gi-Oh! themed UI
type: project
---

Browser-based blackjack where the dealer is Yugi (Atem) from Yu-Gi-Oh! Duel Monsters.

**Stack chosen:** Vite + React + TypeScript.

**Visual direction:**
- Dealer art: Yu-Gi-Oh! Duel Links full-body portraits (multiple emotional poses).
- Card backs: classic Yu-Gi-Oh! TCG card-back design.
- Life Points: animated counter that drops dramatically from 4000 → 0 on a hand loss; uses the Matrix Book font from the actual cards (free download from amarillonmc/MSE201_w_ygos10 on GitHub).
- Exodia: animation triggered with low random probability when the player loses — a "you face Exodia" easter egg.

**Why:** Personal fan project. Distribution is not a stated goal, but the user has been informed that ripped sprites are Konami-copyrighted and not licensed for redistribution.

**How to apply:** Treat this as a single-developer hobby project. Default to a clean architecture but don't over-engineer. The dealer's emotional state (idle / dealing / smug-on-win / shocked-on-loss / Exodia-summon) drives most of the visual flair, so design components around easily swapping the active dealer pose.

**Asset sourcing decision:** User will manually download sprites into a `/public/sprites/` folder. Scaffold should reference expected filenames (e.g., `yugi-idle.png`, `yugi-win.png`) so they drop in cleanly.

**Animated dealer + PWA (2026-08-15, later pass):** `AtemPortrait.tsx` renders the Nightmare Troubadour sprite as body + eye/mouth overlay layers (`/public/sprites/atem/nt/`) so Atem blinks and lip-syncs every quip; `Dealer.tsx` `artFor()` picks this "live" portrait for quiet phases and a Saikyo bustup "still" for reaction beats. The app is installable (manifest + service worker + icons, `100dvh` safe-area shell, separate portrait and landscape mobile tiers). Fonts moved from `public/fonts/` to `src/fonts/` — the old location 404'd in production builds.

**2026-08 overhaul:** GSAP 3.15 + @gsap/react now drive all animation (card flights from the deck pile, 3D hole-card flip, riffle shuffle, SplitText quips/banners, Exodia timeline, LP drain/floaters); gothic-horror Shadow Game theme (AmbientLayer fog/embers/vignette, Wdjat watermark, Pirata One + IM Fell fonts); dealer art replaced with Saikyo Card Battle composites in `/public/sprites/atem/` (six expressions + pointing cut-in; the old Duel Links rips in /public/sprites/ are unused). Gameplay adds: `shuffling` phase, double down, keyboard shortcuts, WebAudio-synth SFX with mute. Dev-only `?debug=exodia|mindcrush|victory` jumps to endgame states for testing.
