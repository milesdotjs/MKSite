/**
 * A tiny wireframe of a generic page, with one region highlighted. Shared by
 * the "What's this?" popover (React) and the glossary page (Astro), so it
 * returns an SVG string rather than a component.
 */

import type { WireframeRegion } from "../content/glossary";

const GREY = "#c9c9c5";
const GREY_2 = "#e6e6e3";
const TAPE = "#ffd400";
const INK = "#000";

interface Region {
  x: number;
  y: number;
  w: number;
  h: number;
  rx?: number;
}

const REGIONS: Record<Exclude<WireframeRegion, "none">, Region> = {
  browser: { x: 0, y: 0, w: 160, h: 14 },
  page: { x: 0, y: 14, w: 160, h: 96 },
  header: { x: 0, y: 14, w: 160, h: 16 },
  logo: { x: 8, y: 18, w: 30, h: 8 },
  nav: { x: 96, y: 19, w: 56, h: 6 },
  hero: { x: 0, y: 30, w: 160, h: 42 },
  "hero-image": { x: 0, y: 30, w: 160, h: 42 },
  tagline: { x: 50, y: 38, w: 60, h: 4 },
  cta: { x: 66, y: 60, w: 28, h: 8, rx: 4 },
  section: { x: 0, y: 74, w: 160, h: 26 },
  footer: { x: 0, y: 100, w: 160, h: 10 },
};

export function wireframeSvg(highlight: WireframeRegion): string {
  const hl = highlight === "none" ? null : REGIONS[highlight];
  const hlRect = hl
    ? `<rect x="${hl.x}" y="${hl.y}" width="${hl.w}" height="${hl.h}" rx="${hl.rx ?? 0}" fill="${TAPE}" stroke="${INK}" stroke-width="1.5" opacity="0.9"/>`
    : "";

  return `<svg viewBox="0 0 160 110" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Where this appears on a page">
<rect x="0" y="0" width="160" height="110" fill="#fff"/>
<!-- browser chrome -->
<rect x="0" y="0" width="160" height="14" fill="${GREY_2}"/>
<circle cx="6" cy="7" r="2" fill="${GREY}"/><circle cx="12" cy="7" r="2" fill="${GREY}"/><circle cx="18" cy="7" r="2" fill="${GREY}"/>
<rect x="28" y="4" width="100" height="6" rx="3" fill="#fff" stroke="${GREY}" stroke-width="0.8"/>
<!-- header -->
<rect x="0" y="14" width="160" height="16" fill="#fff" stroke="${GREY_2}" stroke-width="0.8"/>
<rect x="8" y="18" width="30" height="8" fill="${GREY}"/>
<rect x="96" y="19" width="12" height="6" fill="${GREY}"/><rect x="111" y="19" width="12" height="6" fill="${GREY}"/><rect x="126" y="19" width="12" height="6" fill="${GREY}"/><rect x="141" y="19" width="11" height="6" fill="${GREY}"/>
<!-- hero -->
<rect x="0" y="30" width="160" height="42" fill="${GREY}"/>
<rect x="50" y="38" width="60" height="4" fill="#fff" opacity="0.8"/>
<rect x="36" y="46" width="88" height="8" fill="#fff"/>
<rect x="66" y="60" width="28" height="8" rx="4" fill="#fff"/>
<!-- section -->
<rect x="0" y="74" width="160" height="26" fill="#fff"/>
<rect x="12" y="78" width="40" height="18" rx="2" fill="${GREY_2}"/><rect x="60" y="78" width="40" height="18" rx="2" fill="${GREY_2}"/><rect x="108" y="78" width="40" height="18" rx="2" fill="${GREY_2}"/>
<!-- footer -->
<rect x="0" y="100" width="160" height="10" fill="${GREY}"/>
${hlRect}
</svg>`;
}
