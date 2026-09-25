/**
 * Every "What's this?" explainer and the standalone glossary page read from
 * this one file. Edit copy here, not in components.
 *
 * `where` names a region of the mini wireframe to highlight so the popover
 * can show where the thing appears on the generated site.
 */

export type WireframeRegion =
  | "header"
  | "logo"
  | "nav"
  | "hero"
  | "hero-image"
  | "tagline"
  | "cta"
  | "section"
  | "footer"
  | "page"
  | "browser"
  | "none";

export interface GlossaryEntry {
  id: string;
  term: string;
  /** One plain sentence. */
  definition: string;
  where: WireframeRegion;
  /** Practical tips, each one short sentence. */
  tips?: string[];
  /** One line linking the concept to what you'd pay a developer for. */
  developer?: string;
}

export const GLOSSARY: readonly GlossaryEntry[] = [
  {
    id: "hero-image",
    term: "Hero image",
    definition: "The big picture at the top of your home page, usually the first thing visitors see.",
    where: "hero-image",
    tips: [
      "Use a wide, landscape photo. At least 1920 pixels across, and wider than it is tall.",
      "Avoid text baked into the image. It won't resize well on phones and screen readers can't read it.",
      "A photo of your actual place or work beats a stock photo every time.",
    ],
    developer: "A developer crops, compresses and serves it at the right size for each device so the page loads fast.",
  },
  {
    id: "tagline",
    term: "Tagline",
    definition: "A short line, usually under ten words, that says what you do or what you stand for.",
    where: "tagline",
    tips: ["Say what you do, not how great you are. 'Family dentist in Riverside' beats 'Excellence in care'."],
    developer: "A developer or copywriter tests a few and picks the one that makes people click.",
  },
  {
    id: "call-to-action",
    term: "Call to action (CTA)",
    definition: "The button that tells visitors what to do next, like 'Book now' or 'Get a quote'.",
    where: "cta",
    tips: ["Use a verb. Say what happens when they click.", "One main action per page. Two competing buttons means neither gets clicked."],
    developer: "A developer wires it to something that works: a booking system, a form that emails you, a phone number that dials.",
  },
  {
    id: "navigation",
    term: "Navigation (menu)",
    definition: "The list of links, usually at the top, that takes visitors to your other pages.",
    where: "nav",
    tips: ["Five links or fewer. If you need more, your site is probably too big for a template."],
    developer: "A developer decides what goes where based on what visitors are actually looking for.",
  },
  {
    id: "header",
    term: "Header",
    definition: "The strip across the top of every page that holds your logo and menu.",
    where: "header",
    developer: "Nothing, usually. This is the part that's free.",
  },
  {
    id: "footer",
    term: "Footer",
    definition: "The strip at the bottom of every page with your copyright line and a repeat of the menu.",
    where: "footer",
    tips: ["Real sites usually put a privacy policy and terms link here. This one doesn't have those."],
    developer: "A developer adds the legal links, social links, and anything a search engine wants to find on every page.",
  },
  {
    id: "favicon",
    term: "Favicon",
    definition: "The tiny icon that shows in the browser tab next to your page title.",
    where: "browser",
    tips: ["This tool doesn't make one. It's the sort of detail that separates a real site from a template."],
    developer: "A developer makes one from your logo in the several sizes browsers and phones expect.",
  },
  {
    id: "logo",
    term: "Logo (and wordmark)",
    definition: "Your brand image. A wordmark is a logo that's just your name in a particular font.",
    where: "logo",
    tips: [
      "Upload a PNG or SVG with a transparent background if you have one.",
      "Wide logos work better in a header than tall ones.",
      "If you skip this, the site uses your name as a wordmark. That's fine.",
    ],
    developer: "A designer, not a developer, makes a logo. Anyone who bundles a logo into a $500 website is giving you a font.",
  },
  {
    id: "color-palette",
    term: "Colour palette",
    definition: "The small set of colours a site uses: one main colour, one for buttons, and a few greys.",
    where: "page",
    tips: ["Dark text on a light background is readable. Everything else is a risk."],
    developer: "A designer picks colours that match your brand and checks that text is readable on every one of them.",
  },
  {
    id: "font-pairing",
    term: "Font pairing",
    definition: "The two typefaces a site uses: one for headings, one for everything else.",
    where: "hero",
    tips: ["A plain font for body text is always safe. Save the personality for headings."],
    developer: "A designer picks fonts that suit your business and licenses them properly.",
  },
  {
    id: "section",
    term: "Section",
    definition: "One horizontal band of a page with its own purpose, like 'our services' or 'get in touch'.",
    where: "section",
    developer: "A developer decides what sections a page needs and in what order, based on what you want visitors to do.",
  },
  {
    id: "landing-page",
    term: "Landing page",
    definition: "A page built for one purpose, usually for people arriving from an advert or a search.",
    where: "page",
    developer: "A developer builds landing pages for specific campaigns and measures which ones convert.",
  },
  {
    id: "alt-text",
    term: "Alt text",
    definition: "A hidden description of an image that screen readers read aloud and search engines index.",
    where: "hero-image",
    tips: ["Describe what's in the picture. 'Our team outside the shop on opening day', not 'image1.jpg'."],
    developer: "A developer writes proper alt text for every image. This tool uses a generic one.",
  },
  {
    id: "domain",
    term: "Domain",
    definition: "Your web address, like yourbusiness.com. You rent it yearly from a registrar.",
    where: "browser",
    tips: ["Register it yourself, in your own account. Never let a developer own your domain."],
    developer: "A developer connects the domain to the hosting. You should still own it.",
  },
  {
    id: "hosting",
    term: "Hosting",
    definition: "The computer that stores your website files and hands them to visitors' browsers.",
    where: "browser",
    tips: ["A site like the one this tool makes can be hosted for free. A site with a database or a booking system usually can't."],
    developer: "A developer chooses hosting that fits, sets it up, and keeps it running and secure.",
  },
  {
    id: "responsive",
    term: "Responsive (mobile-friendly)",
    definition: "A site that rearranges itself to fit phones, tablets and desktops.",
    where: "page",
    tips: ["Most visitors to a small-business site are on a phone. Check the phone view first."],
    developer: "Every template is responsive now. It's not a selling point; it's the floor.",
  },
  {
    id: "contact-form",
    term: "Contact form",
    definition: "The name, email and message boxes on a contact page.",
    where: "section",
    tips: ["The form this tool makes doesn't send anything. It needs a service behind it."],
    developer: "A developer connects it to something that delivers the message to you and filters spam.",
  },
  {
    id: "seo",
    term: "SEO (search engine optimisation)",
    definition: "The work that helps your site show up when people search for what you do.",
    where: "browser",
    tips: ["For a local business, your Google Business Profile matters more than anything on the site itself."],
    developer: "A developer sets up the technical side and a specialist works on what you rank for.",
  },
  {
    id: "meta-description",
    term: "Meta description",
    definition: "The short blurb Google shows under your page title in search results.",
    where: "browser",
    tips: ["This tool uses your tagline. A real site has a written one per page."],
    developer: "A developer writes one for every page, aimed at the searches you want to win.",
  },
  {
    id: "static-site",
    term: "Static site",
    definition: "A site that's just files: pages, pictures and styles. No database, no login, no server code.",
    where: "page",
    tips: ["That's what this tool makes. It's fast, cheap to host, and hard to hack. It also can't do much."],
    developer: "A developer decides whether static is enough for you, or whether you need something that does more.",
  },
];

export function getGlossaryEntry(id: string): GlossaryEntry | undefined {
  return GLOSSARY.find((g) => g.id === id);
}
