# The Floor

A free, no-code tool that turns a few clicks into a generic small-business
website, on purpose. The point isn't to make great websites. The point is to
show exactly what an effortless template looks like, so people can recognise
it and refuse to pay thousands for it.

Live at `mileskingdev.com/projects/the-floor/`. No server, no accounts, no AI.
Nothing the user enters leaves their browser.

## Layout

```
the-floor-src/          this folder: the source
../the-floor/           the built site that GitHub Pages serves (astro build writes here)

src/lib/generator/      pure function: (answers) => { files, images, fonts }
  presets/              palettes, font styles, layouts, icons, business-type placeholder copy
  css.ts                the generated site's stylesheet, hand-written, no framework
  pages.ts              page body renderers; every user value is escaped
  shell.ts              <html> wrapper, header with no-JS <details> menu, footer
src/content/            glossary, Reality Check cards, red flags: edit copy here
src/components/wizard/  the React island: ten steps, explainer popover, preview, download
src/lib/                storage (IndexedDB), object URLs, preview builder, ZIP builder
src/pages/              Astro pages: landing, build, glossary, red-flags, for-developers
src/styles/app.css      the tool's own look (white, black, one yellow, Barlow)
public/fonts/           woff2 files bundled into ZIPs when a style needs them
scripts/                font sync, sample renderer, Puppeteer QA drives
```

## Commands

```
npm install
npm run fonts:sync      # copies woff2 files out of the Fontsource packages (run once)
npm run dev             # http://127.0.0.1:4321/projects/the-floor/
npm test                # generator unit tests, including palette contrast
npm run check           # astro type check
npm run build           # writes ../the-floor
```

## Visual QA

The generator is pure, so you can render sample sites without the UI:

```
npx tsx scripts/render-samples.ts samples
node scripts/qa-shoot-samples.cjs samples qa-shots/samples
```

And drive the whole wizard, including uploads, the preview iframe, the ZIP
download and the IndexedDB restore, against a running dev or preview server:

```
node scripts/qa-drive-wizard.cjs http://127.0.0.1:4321/projects/the-floor/ qa-shots/wizard
```

Both scripts load Puppeteer from `Projects/blackjack with yugi/node_modules`,
where it already lives for the rest of this repo.

## Deployment notes

- Git tracks the parent folder as lowercase `projects/` even though Windows
  shows it capitalised. GitHub Pages is case-sensitive, so `base` in
  `astro.config.mjs` stays lowercase and new files should be added with the
  lowercase path.
- **Run `npm run build` from the folder spelled the way Windows spells it**
  (`...\Projects\the-floor-src`, capital P, until the folder is renamed).
  Run from the lowercase spelling, Astro's build silently drops the app
  stylesheet: it emits the fonts but no `_astro/*.css` and no `<link>`, and
  the whole tool renders unstyled. `astro dev` is not affected. If a build
  ever comes out with no `.css` file in `_astro/`, this is why.
- The built folder is committed like the other projects in this repo.
  Run `npm run build` before committing.
- The generated sites are meant to look respectable and hollow. If a change
  makes them look either broken or genuinely good, it's the wrong change.

## Splitting off into its own repo

The plan is to move this to its own repository and domain. Nothing in the
code depends on living inside MKSite. When that happens:

1. Copy this folder to the new repo root.
2. In `astro.config.mjs`, set `site` to the new domain, `base` to `"/"`
   (or delete the `PUBLIC_BASE_PATH` logic), and `outDir` to `"dist"`.
3. Point the two QA scripts at a local Puppeteer install (`npm i -D puppeteer`)
   instead of the blackjack project's `node_modules`.
4. Deploy `dist/` to any static host. There's no server to configure.

`withBase()` in `src/lib/base.ts` reads Astro's `BASE_URL`, so every in-app
link and font URL follows the config change without edits.

## Beginner persona tests

Four scripted beginners (a café on desktop, a plumber on a phone, a solo
salon owner on a tablet with a portrait photo, a gym that uploads nothing)
build a site with real royalty-free photos, download the ZIP, open it from
disk at two widths, and serve it on a throwaway static host. Each run writes
screenshots and a report.json.

```
node scripts/qa-prep-images.cjs scripts/personas/images   # once; fetches the photos
node scripts/qa-persona.cjs http://127.0.0.1:4322/projects/the-floor/ scripts/personas/cafe.json qa-shots/cafe
```

Swap `cafe` for `trades`, `salon` or `fitness`. Serve the production build
first with `./node_modules/.bin/astro preview --port 4322` (built from the
capital-P path, see above).

## The examples gallery

`/examples/` publishes ten demo sites built with the tool, with a credits list
for the Creative Commons photographs they use. To rebuild it after a template
change, serve the new build locally first, because the demos must be built
against the version you just changed:

```
./node_modules/.bin/astro build                 # from the capital-P path
./node_modules/.bin/astro preview --port 4322
FLOOR_BASE=http://127.0.0.1:4322/projects/the-floor/ node scripts/build-examples.cjs
FLOOR_BASE=http://127.0.0.1:4322/projects/the-floor/ node scripts/rebuild-legacy.cjs
node scripts/build-examples.cjs --publish
node scripts/shoot-example-thumbs.cjs
./node_modules/.bin/astro build                 # again, to ship the new files
```

If the photographs are re-fetched, the credits in `src/content/examples.ts`
are regenerated with them. Don't hand-edit that file.

## The "Pro" upgrade

The preview step offers a free "Upgrade to Pro": scroll reveals with a
stagger, hover lifts, a nav underline, a header shadow. It exists to show what
"animations and interactions" on a quote actually are. Everything about it
lives in `src/lib/generator/motion.ts`: plain CSS plus two small inline
scripts, no library, so the download stays dependency-free and still opens
offline. `motionCost()` counts the lines from the real output; the developers
page prints that number, the wizard deliberately does not (a buyer measures
effort and result, not lines).

The preview iframe is `sandbox="allow-same-origin allow-scripts"` so the
motion runs in the preview. That is safe only because the frame holds nothing
but HTML this generator wrote, with every user string escaped and no inline
handlers. Keep it that way.

## Full-screen preview

The preview bar has a "Full screen" button. It takes over the viewport with
one floating control strip (page, screen size, exit) so the site looks the
way it will in a browser tab, and asks the browser for real full screen where
that's allowed. Escape or the button leaves it; `fullscreenchange` is watched
so the browser's own exit also closes the overlay. It is an in-app overlay
first and native full screen second, because iPhones only allow the latter
for video. Geometry is checked by `qa-shots/pro/check-fullscreen.cjs`.
