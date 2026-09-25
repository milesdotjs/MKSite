/**
 * The layouts. Deliberately stock. Each thumbnail is a tiny inline SVG
 * wireframe so the picker needs no image files.
 */

import type { LayoutId } from "../types";

export interface Layout {
  id: LayoutId;
  name: string;
  description: string;
  /** Inline SVG wireframe, 160x100 viewBox, uses currentColor. */
  thumbnail: string;
}

const wire = (inner: string) =>
  `<svg viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">` +
  `<rect x="0" y="0" width="160" height="12" fill="currentColor" opacity=".18"/>` +
  `<rect x="6" y="4" width="22" height="4" fill="currentColor" opacity=".6"/>` +
  `<rect x="118" y="4" width="36" height="4" fill="currentColor" opacity=".35"/>` +
  inner +
  `<rect x="0" y="90" width="160" height="10" fill="currentColor" opacity=".18"/>` +
  `</svg>`;

export const LAYOUTS: readonly Layout[] = [
  {
    id: "hero-columns",
    name: "Hero + three columns",
    description: "A big centred banner, then three matching boxes. The most common layout on the internet.",
    thumbnail: wire(
      `<rect x="0" y="12" width="160" height="42" fill="currentColor" opacity=".45"/>` +
        `<rect x="45" y="24" width="70" height="6" fill="#fff" opacity=".9"/>` +
        `<rect x="58" y="34" width="44" height="3" fill="#fff" opacity=".7"/>` +
        `<rect x="68" y="41" width="24" height="6" rx="3" fill="#fff"/>` +
        `<rect x="10" y="60" width="42" height="24" rx="2" fill="currentColor" opacity=".2"/>` +
        `<rect x="59" y="60" width="42" height="24" rx="2" fill="currentColor" opacity=".2"/>` +
        `<rect x="108" y="60" width="42" height="24" rx="2" fill="currentColor" opacity=".2"/>`,
    ),
  },
  {
    id: "split",
    name: "Split screen",
    description: "Words on the left, picture on the right. Feels a little more 'designed', isn't.",
    thumbnail: wire(
      `<rect x="80" y="12" width="80" height="44" fill="currentColor" opacity=".45"/>` +
        `<rect x="10" y="22" width="56" height="6" fill="currentColor" opacity=".7"/>` +
        `<rect x="10" y="32" width="48" height="3" fill="currentColor" opacity=".45"/>` +
        `<rect x="10" y="37" width="40" height="3" fill="currentColor" opacity=".45"/>` +
        `<rect x="10" y="45" width="22" height="6" rx="3" fill="currentColor" opacity=".8"/>` +
        `<rect x="10" y="63" width="140" height="8" fill="currentColor" opacity=".2"/>` +
        `<rect x="10" y="75" width="140" height="8" fill="currentColor" opacity=".2"/>`,
    ),
  },
  {
    id: "banner",
    name: "Big image banner",
    description: "One huge photo with the name in the corner. Photographers and restaurants love it.",
    thumbnail: wire(
      `<rect x="0" y="12" width="160" height="60" fill="currentColor" opacity=".5"/>` +
        `<rect x="10" y="50" width="60" height="7" fill="#fff" opacity=".9"/>` +
        `<rect x="10" y="61" width="40" height="3" fill="#fff" opacity=".7"/>` +
        `<rect x="14" y="66" width="132" height="18" rx="2" fill="#fff" opacity=".95"/>` +
        `<rect x="22" y="72" width="30" height="6" fill="currentColor" opacity=".3"/>` +
        `<rect x="65" y="72" width="30" height="6" fill="currentColor" opacity=".3"/>` +
        `<rect x="108" y="72" width="30" height="6" fill="currentColor" opacity=".3"/>`,
    ),
  },
  {
    id: "cards",
    name: "Card grid",
    description: "A short coloured band, then everything in tidy rounded cards with soft shadows.",
    thumbnail: wire(
      `<rect x="0" y="12" width="160" height="24" fill="currentColor" opacity=".45"/>` +
        `<rect x="50" y="20" width="60" height="7" fill="#fff" opacity=".9"/>` +
        `<rect x="10" y="42" width="42" height="42" rx="3" fill="currentColor" opacity=".2"/>` +
        `<rect x="59" y="42" width="42" height="42" rx="3" fill="currentColor" opacity=".2"/>` +
        `<rect x="108" y="42" width="42" height="42" rx="3" fill="currentColor" opacity=".2"/>`,
    ),
  },
];

export const DEFAULT_LAYOUT_ID: LayoutId = "hero-columns";

export function getLayout(id: LayoutId): Layout {
  return LAYOUTS.find((l) => l.id === id) ?? LAYOUTS[0];
}
