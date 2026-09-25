import { describe, expect, it } from "vitest";
import {
  generateSite,
  defaultAnswers,
  enabledPages,
  retypeAnswers,
  hasCustomText,
  PALETTES,
  LAYOUTS,
  FONT_STYLES,
  BUSINESS_TYPES,
  contrastRatio,
  contrastPairs,
  ICONS,
  type Answers,
  type ImageAsset,
} from "./index";

function fakeImage(id: string, name = "photo.jpg", type = "image/jpeg"): ImageAsset {
  return { id, name, type, blob: new Blob(["x"], { type }) };
}

function answersWith(patch: Partial<Answers> = {}): Answers {
  return { ...defaultAnswers("restaurant"), businessName: "Blue Door Café", ...patch };
}

describe("escaping", () => {
  it("renders pasted script tags as text everywhere", () => {
    const evil = `<script>alert(1)</script>`;
    const a = answersWith({
      businessName: evil,
      tagline: evil,
      pages: ["home", "about", "services", "gallery", "contact"],
    });
    a.home.headline = evil;
    a.home.subtext = evil;
    a.home.ctaText = evil;
    a.home.features[0].title = evil;
    a.home.features[0].text = evil;
    a.about.story = evil;
    a.about.team[0].name = evil;
    a.about.team[0].role = evil;
    a.services.items[0].name = evil;
    a.services.items[0].description = evil;
    a.services.items[0].price = evil;
    a.contact.address = evil;
    a.contact.phone = evil;
    a.contact.email = evil;
    a.contact.hours = evil;

    const site = generateSite(a, { year: 2026 });
    for (const [file, content] of Object.entries(site.files)) {
      if (!file.endsWith(".html")) continue;
      expect(content, file).not.toContain("<script>");
      expect(content, file).toContain("&lt;script&gt;");
    }
  });

  it("escapes attribute-breaking quotes in the title and description", () => {
    const a = answersWith({ businessName: `He said "hi" & left`, tagline: `it's <b>` });
    const site = generateSite(a);
    expect(site.files["index.html"]).toContain(`<title>He said &quot;hi&quot; &amp; left | it&#39;s &lt;b&gt;</title>`);
    expect(site.files["index.html"]).not.toContain(`content="it's`);
  });
});

describe("pages and navigation", () => {
  it("always includes home, caps at five, and keeps canonical order", () => {
    expect(enabledPages({ pages: [] }).map((p) => p.id)).toEqual(["home"]);
    expect(enabledPages({ pages: ["contact", "about"] }).map((p) => p.id)).toEqual(["home", "about", "contact"]);
    expect(enabledPages({ pages: ["home", "about", "services", "gallery", "contact"] })).toHaveLength(5);
  });

  it("emits one html file per page plus styles and readme", () => {
    const site = generateSite(answersWith({ pages: ["home", "about", "contact"] }));
    expect(Object.keys(site.files).sort()).toEqual(["README.txt", "about.html", "contact.html", "index.html", "styles.css"]);
  });

  it("links every page from every page's nav and marks the current one", () => {
    const site = generateSite(answersWith({ pages: ["home", "about", "services", "gallery", "contact"] }));
    const files = ["index.html", "about.html", "services.html", "gallery.html", "contact.html"];
    for (const file of files) {
      const html = site.files[file];
      for (const target of files) {
        expect(html, `${file} links ${target}`).toContain(`href="${target}"`);
      }
      expect(html).toContain(`href="${file}" aria-current="page"`);
    }
  });

  it("points the call to action at the contact page when present, else mailto", () => {
    const withContact = generateSite(answersWith({ pages: ["home", "contact"] }));
    expect(withContact.files["index.html"]).toContain(`class="button" href="contact.html"`);
    const without = generateSite(answersWith({ pages: ["home"] }));
    expect(without.files["index.html"]).toContain(`class="button" href="mailto:hello@example.com"`);
  });

  it("inlines css for the preview and links it for the download", () => {
    const linked = generateSite(answersWith());
    expect(linked.files["index.html"]).toContain(`<link rel="stylesheet" href="styles.css">`);
    expect(linked.files["styles.css"]).toContain("--color-primary");
    const inline = generateSite(answersWith(), { inlineCss: true });
    expect(inline.files["index.html"]).toContain("<style>");
    expect(inline.files["styles.css"]).toBeUndefined();
  });
});

describe("assets", () => {
  it("registers each uploaded image once and routes paths through resolveAsset", () => {
    const hero = fakeImage("h1", "big photo.PNG", "image/png");
    const logo = fakeImage("l1", "logo.svg", "image/svg+xml");
    const a = answersWith({ logo, pages: ["home", "gallery"] });
    a.home.heroImage = hero;
    a.gallery.images = [fakeImage("g1"), fakeImage("g2", "b.webp", "image/webp")];

    const seen: string[] = [];
    const site = generateSite(a, {
      resolveAsset: (p) => {
        seen.push(p);
        return `RESOLVED(${p})`;
      },
    });
    expect(site.images.map((i) => i.path)).toEqual([
      "assets/logo-l1.svg",
      "assets/hero-h1.png",
      "assets/gallery-1-g1.jpg",
      "assets/gallery-2-g2.webp",
    ]);
    expect(site.files["index.html"]).toContain(`src="RESOLVED(assets/hero-h1.png)"`);
    expect(site.files["gallery.html"]).toContain(`src="RESOLVED(assets/gallery-2-g2.webp)"`);
    // Logo appears on both pages but is only registered once.
    expect(site.images.filter((i) => i.asset.id === "l1")).toHaveLength(1);
    expect(seen.filter((p) => p.startsWith("assets/logo"))).toHaveLength(1);
  });

  it("lists the font files a style needs and none for system styles", () => {
    expect(generateSite(answersWith({ fontStyle: "plain" })).fonts).toEqual([]);
    const modern = generateSite(answersWith({ fontStyle: "modern" }));
    expect(modern.fonts.map((f) => f.path)).toEqual(["assets/fonts/montserrat-400.woff2", "assets/fonts/montserrat-700.woff2"]);
    expect(modern.files["styles.css"]).toContain(`url("assets/fonts/montserrat-700.woff2")`);
  });

  it("uses a text wordmark when no logo is uploaded", () => {
    const site = generateSite(answersWith());
    expect(site.files["index.html"]).toContain(`<a class="brand" href="index.html">Blue Door Café</a>`);
  });
});

describe("defaults", () => {
  it("produces a complete site from nothing but a business type", () => {
    for (const type of BUSINESS_TYPES) {
      const site = generateSite(defaultAnswers(type.id));
      expect(site.files["index.html"]).toContain("Your Business");
      expect(site.files["index.html"]).toContain(type.headline);
      expect(site.files["services.html"]).toContain(type.services[0].name);
    }
  });

  it("retyping swaps placeholder copy but keeps the user's own words", () => {
    const a = defaultAnswers("restaurant");
    a.home.headline = "My own headline";
    const b = retypeAnswers(a, "salon");
    expect(b.home.headline).toBe("My own headline");
    expect(b.home.subtext).toBe(BUSINESS_TYPES.find((t) => t.id === "salon")!.subtext);
    expect(b.services.items[0].name).toBe("Cut and style");
  });

  it("knows whether the user wrote anything", () => {
    const a = defaultAnswers("trades");
    expect(hasCustomText(a)).toBe(false);
    a.about.story = "We are great.";
    expect(hasCustomText(a)).toBe(true);
  });

  it("every default feature icon exists in the icon set", () => {
    for (const type of BUSINESS_TYPES) {
      for (const f of type.features) {
        expect(ICONS[f.icon], `${type.id} uses icon ${f.icon}`).toBeDefined();
      }
    }
  });
});

describe("every layout, palette and font style renders", () => {
  it("emits a body class and theme variables for each combination", () => {
    for (const layout of LAYOUTS) {
      for (const palette of PALETTES) {
        for (const font of FONT_STYLES) {
          const site = generateSite(answersWith({ layout: layout.id, palette: palette.id, fontStyle: font.id }));
          expect(site.files["index.html"]).toContain(`<body class="layout-${layout.id}">`);
          expect(site.files["styles.css"]).toContain(`--color-primary: ${palette.colors.primary}`);
          expect(site.files["styles.css"]).toContain(`--font-heading: ${font.headingFamily}`);
        }
      }
    }
  });
});

describe("palette contrast", () => {
  for (const palette of PALETTES) {
    for (const pair of contrastPairs(palette)) {
      it(`${palette.name}: ${pair.label} is at least ${pair.min}:1`, () => {
        expect(contrastRatio(pair.fg, pair.bg)).toBeGreaterThanOrEqual(pair.min);
      });
    }
  }
});
