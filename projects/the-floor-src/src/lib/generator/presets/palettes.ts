/**
 * Preset colour palettes. Deliberately a short list with no custom picker:
 * limited choice is part of the point.
 *
 * Each palette declares which of its colours sit on which, so a unit test can
 * check the contrast of every pair that the templates actually use.
 */

export interface Palette {
  id: string;
  name: string;
  /** One line a non-designer can picture. */
  description: string;
  colors: {
    primary: string;
    onPrimary: string;
    accent: string;
    onAccent: string;
    bg: string;
    surface: string;
    text: string;
    muted: string;
    border: string;
  };
}

export const PALETTES: readonly Palette[] = [
  {
    id: "navy-gold",
    name: "Navy & Gold",
    description: "Dark blue with a warm gold button. The default look of a law firm.",
    colors: {
      primary: "#1F3A5F",
      onPrimary: "#FFFFFF",
      accent: "#D4A72C",
      onAccent: "#1B1B1B",
      bg: "#FFFFFF",
      surface: "#F3F5F8",
      text: "#1B1F24",
      muted: "#5A6472",
      border: "#DDE2E8",
    },
  },
  {
    id: "forest",
    name: "Forest",
    description: "Deep green and a soft sage. Landscapers and anything organic.",
    colors: {
      primary: "#2E5A3A",
      onPrimary: "#FFFFFF",
      accent: "#B9D49A",
      onAccent: "#1B2A1E",
      bg: "#FCFCF9",
      surface: "#EEF3EA",
      text: "#1E2A22",
      muted: "#5B6B5F",
      border: "#D8E0D3",
    },
  },
  {
    id: "ocean",
    name: "Ocean",
    description: "Bright blue with an orange button. Friendly and safe.",
    colors: {
      primary: "#0F6BAE",
      onPrimary: "#FFFFFF",
      accent: "#F2A541",
      onAccent: "#1B1B1B",
      bg: "#FFFFFF",
      surface: "#EFF5FA",
      text: "#1A2430",
      muted: "#5A6A7A",
      border: "#D6E1EB",
    },
  },
  {
    id: "coral",
    name: "Coral",
    description: "Warm red-orange on white. Restaurants, bakeries, anything cheerful.",
    colors: {
      primary: "#C4472F",
      onPrimary: "#FFFFFF",
      accent: "#2B2D42",
      onAccent: "#FFFFFF",
      bg: "#FFFFFF",
      surface: "#FBF1EE",
      text: "#2B2D42",
      muted: "#63667A",
      border: "#EBDAD5",
    },
  },
  {
    id: "slate",
    name: "Slate",
    description: "Grey-blue with a pale blue accent. Calm and corporate.",
    colors: {
      primary: "#3B4556",
      onPrimary: "#FFFFFF",
      accent: "#8FC1D4",
      onAccent: "#15202B",
      bg: "#FFFFFF",
      surface: "#F2F4F7",
      text: "#1F2630",
      muted: "#606A78",
      border: "#DADFE6",
    },
  },
  {
    id: "wine",
    name: "Wine",
    description: "Burgundy with a blush accent. Salons and boutiques.",
    colors: {
      primary: "#6E2C45",
      onPrimary: "#FFFFFF",
      accent: "#EBB9C4",
      onAccent: "#3A1524",
      bg: "#FFFDFC",
      surface: "#F8EFF2",
      text: "#2A1E24",
      muted: "#6B5A62",
      border: "#E6D7DC",
    },
  },
  {
    id: "sand",
    name: "Sand",
    description: "Tan and brown on cream. Cafés and anything rustic.",
    colors: {
      primary: "#7F5539",
      onPrimary: "#FFFFFF",
      accent: "#E0B98A",
      onAccent: "#2E2016",
      bg: "#FDF9F3",
      surface: "#F4EBDD",
      text: "#2E2418",
      muted: "#6E6152",
      border: "#E4D9C8",
    },
  },
  {
    id: "teal",
    name: "Teal",
    description: "Blue-green with a yellow button. Dentists, clinics, gyms.",
    colors: {
      primary: "#187470",
      onPrimary: "#FFFFFF",
      accent: "#F5C542",
      onAccent: "#1B1B1B",
      bg: "#FFFFFF",
      surface: "#EDF6F5",
      text: "#182524",
      muted: "#55696A",
      border: "#D3E3E2",
    },
  },
  {
    id: "charcoal",
    name: "Charcoal & Mint",
    description: "Near-black with a mint accent. Barbers, studios, trades.",
    colors: {
      primary: "#2A2D2E",
      onPrimary: "#FFFFFF",
      accent: "#5FE0B0",
      onAccent: "#0F1B17",
      bg: "#FFFFFF",
      surface: "#F1F2F2",
      text: "#1C1F20",
      muted: "#5F6667",
      border: "#DADDDE",
    },
  },
  {
    id: "midnight",
    name: "Midnight",
    description: "Very dark blue with a red accent. Bold, but still generic.",
    colors: {
      primary: "#141F3A",
      onPrimary: "#FFFFFF",
      accent: "#D62839",
      onAccent: "#FFFFFF",
      bg: "#FFFFFF",
      surface: "#EFF1F6",
      text: "#161B2A",
      muted: "#5A6070",
      border: "#D8DCE6",
    },
  },
];

export const DEFAULT_PALETTE_ID = PALETTES[0].id;

export function getPalette(id: string): Palette {
  return PALETTES.find((p) => p.id === id) ?? PALETTES[0];
}

/* ---- Contrast helpers (used by tests and by the palette picker) ---- */

function channel(hex: string, offset: number): number {
  const v = parseInt(hex.slice(offset, offset + 2), 16) / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

export function relativeLuminance(hex: string): number {
  const h = hex.replace("#", "");
  return 0.2126 * channel(h, 0) + 0.7152 * channel(h, 2) + 0.0722 * channel(h, 4);
}

/** WCAG contrast ratio between two hex colours, 1 to 21. */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [light, dark] = la > lb ? [la, lb] : [lb, la];
  return (light + 0.05) / (dark + 0.05);
}

/**
 * The colour pairs the templates actually put text on. Kept next to the
 * palettes so adding a palette forces the author to think about them.
 */
export function contrastPairs(p: Palette): Array<{ label: string; fg: string; bg: string; min: number }> {
  const c = p.colors;
  return [
    { label: "text on background", fg: c.text, bg: c.bg, min: 4.5 },
    { label: "text on surface", fg: c.text, bg: c.surface, min: 4.5 },
    { label: "muted on background", fg: c.muted, bg: c.bg, min: 4.5 },
    { label: "muted on surface", fg: c.muted, bg: c.surface, min: 4.5 },
    { label: "onPrimary on primary", fg: c.onPrimary, bg: c.primary, min: 4.5 },
    { label: "onAccent on accent", fg: c.onAccent, bg: c.accent, min: 4.5 },
    { label: "primary as link on background", fg: c.primary, bg: c.bg, min: 4.5 },
    { label: "primary as heading on surface", fg: c.primary, bg: c.surface, min: 3 },
  ];
}
