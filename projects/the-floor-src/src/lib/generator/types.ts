/**
 * Everything the wizard collects, and everything the generator emits.
 *
 * The generator is a pure function from `Answers` to `GeneratedSite`. It never
 * touches the DOM, the network, or storage, so the same output feeds both the
 * live preview and the ZIP download, and it can be unit tested in Node.
 */

export type BusinessType =
  | "restaurant"
  | "salon"
  | "trades"
  | "professional"
  | "retail"
  | "fitness"
  | "nonprofit"
  | "other";

export type LayoutId = "hero-columns" | "split" | "banner" | "cards";

export type FontStyleId = "plain" | "modern" | "classic" | "elegant" | "festive";

export type PageId = "home" | "about" | "services" | "gallery" | "contact";

export const ALL_PAGES: readonly PageId[] = ["home", "about", "services", "gallery", "contact"];

export const MAX_PAGES = 5;
export const MAX_SERVICES = 6;
export const MAX_GALLERY_IMAGES = 9;
export const MAX_TEAM = 4;
export const FEATURE_COUNT = 3;

/** An image the user uploaded. Lives in memory and IndexedDB, never on a server. */
export interface ImageAsset {
  /** Stable id used to build the file name inside the ZIP. */
  id: string;
  /** Original file name, kept for the extension and for display. */
  name: string;
  /** MIME type, e.g. image/jpeg. */
  type: string;
  blob: Blob;
}

export interface Feature {
  /** Key into the icon set. */
  icon: string;
  title: string;
  text: string;
}

export interface TeamMember {
  name: string;
  role: string;
}

export interface Service {
  name: string;
  description: string;
  /** Free text so "from $40" and "Call for quote" both work. Empty hides it. */
  price: string;
}

export interface HomeContent {
  heroImage: ImageAsset | null;
  headline: string;
  subtext: string;
  features: Feature[];
  ctaText: string;
}

export interface AboutContent {
  story: string;
  team: TeamMember[];
}

export interface ServicesContent {
  items: Service[];
}

export interface GalleryContent {
  images: ImageAsset[];
}

export interface ContactContent {
  address: string;
  phone: string;
  email: string;
  hours: string;
}

export interface Answers {
  businessName: string;
  tagline: string;
  businessType: BusinessType;
  layout: LayoutId;
  palette: string;
  fontStyle: FontStyleId;
  logo: ImageAsset | null;
  /** Always contains "home". Order is fixed by ALL_PAGES, not by this array. */
  pages: PageId[];
  home: HomeContent;
  about: AboutContent;
  services: ServicesContent;
  gallery: GalleryContent;
  contact: ContactContent;
}

export interface GenerateOptions {
  /**
   * Rewrites a relative asset path (e.g. `assets/hero.jpg` or
   * `assets/fonts/montserrat-700.woff2`) into whatever URL the HTML will be
   * viewed from. The ZIP uses the identity; the preview maps images to object
   * URLs and fonts to the app's own font files.
   */
  resolveAsset?: (path: string, asset?: ImageAsset) => string;
  /** Put the stylesheet inline in each page instead of linking styles.css. Used by the preview. */
  inlineCss?: boolean;
  /** Footer year. Defaults to the current year. */
  year?: number;
}

export interface GeneratedPage {
  id: PageId;
  /** File name inside the site, e.g. `about.html`. */
  file: string;
  /** Navigation label. */
  label: string;
}

export interface GeneratedImage {
  /** Path inside the site, e.g. `assets/hero-abc123.jpg`. */
  path: string;
  asset: ImageAsset;
}

export interface GeneratedFont {
  /** Path inside the site, e.g. `assets/fonts/montserrat-700.woff2`. */
  path: string;
  /** File name inside the app's public/fonts folder. */
  file: string;
}

export interface GeneratedSite {
  /** Text files keyed by path: every page, styles.css, README.txt. */
  files: Record<string, string>;
  pages: GeneratedPage[];
  images: GeneratedImage[];
  fonts: GeneratedFont[];
}
