/**
 * Font styles. Each is a fixed heading-plus-body pair presented to the user
 * as a named look, so the festive option gives cursive headings over readable
 * body text instead of an unreadable cursive paragraph.
 *
 * System fonts need no files. The others ship as woff2 inside the ZIP, and
 * the same files serve the wizard's preview from public/fonts.
 */

import type { FontStyleId } from "../types";

export interface FontFile {
  /** File name in public/fonts and in the ZIP's assets/fonts folder. */
  file: string;
  family: string;
  weight: 400 | 700;
}

export interface FontStyle {
  id: FontStyleId;
  name: string;
  /** The names, shown small under the label so the glossary has something to point at. */
  detail: string;
  headingFamily: string;
  bodyFamily: string;
  /** Weight for h1 to h3. Cursive faces only come in one weight. */
  headingWeight: 400 | 700;
  files: FontFile[];
}

const ARIAL = "Arial, Helvetica, sans-serif";
const GEORGIA = "Georgia, 'Times New Roman', serif";

export const FONT_STYLES: readonly FontStyle[] = [
  {
    id: "plain",
    name: "Plain",
    detail: "Arial for everything",
    headingFamily: ARIAL,
    bodyFamily: ARIAL,
    headingWeight: 700,
    files: [],
  },
  {
    id: "modern",
    name: "Modern",
    detail: "Montserrat headings, Arial text",
    headingFamily: `Montserrat, ${ARIAL}`,
    bodyFamily: ARIAL,
    headingWeight: 700,
    files: [
      { file: "montserrat-400.woff2", family: "Montserrat", weight: 400 },
      { file: "montserrat-700.woff2", family: "Montserrat", weight: 700 },
    ],
  },
  {
    id: "classic",
    name: "Classic",
    detail: "Georgia for everything",
    headingFamily: GEORGIA,
    bodyFamily: GEORGIA,
    headingWeight: 700,
    files: [],
  },
  {
    id: "elegant",
    name: "Elegant",
    detail: "Playfair Display headings, Georgia text",
    headingFamily: `'Playfair Display', ${GEORGIA}`,
    bodyFamily: GEORGIA,
    headingWeight: 700,
    files: [
      { file: "playfair-display-400.woff2", family: "Playfair Display", weight: 400 },
      { file: "playfair-display-700.woff2", family: "Playfair Display", weight: 700 },
    ],
  },
  {
    id: "festive",
    name: "Festive",
    detail: "Pacifico headings, Arial text",
    headingFamily: `Pacifico, 'Brush Script MT', cursive`,
    bodyFamily: ARIAL,
    headingWeight: 400,
    files: [{ file: "pacifico-400.woff2", family: "Pacifico", weight: 400 }],
  },
];

export const DEFAULT_FONT_STYLE_ID: FontStyleId = "plain";

export function getFontStyle(id: FontStyleId): FontStyle {
  return FONT_STYLES.find((f) => f.id === id) ?? FONT_STYLES[0];
}
