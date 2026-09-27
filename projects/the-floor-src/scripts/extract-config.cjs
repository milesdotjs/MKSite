// Reads a site The Floor already produced and recovers the answers that made
// it, so it can be rebuilt through a newer version of the templates.
//
//   node scripts/extract-config.cjs <path to unzipped site> [out.json]
//
// The generated markup is ours, so this is a straight DOM read rather than
// guesswork. Palette and font are matched back by comparing the CSS variables
// against the presets.
const path = require("node:path");
const fs = require("node:fs");
const puppeteer = require("C:/Users/ilove/Documents/GitHub/MKSite/projects/blackjack with yugi/node_modules/puppeteer");

async function read(page, file) {
  const url = "file:///" + path.resolve(file).replace(/\\/g, "/");
  if (!fs.existsSync(file)) return null;
  await page.goto(url, { waitUntil: "domcontentloaded" });
  return true;
}

(async () => {
  const site = path.resolve(process.argv[2]);
  const outFile = process.argv[3];
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await read(page, path.join(site, "index.html"));
  const home = await page.evaluate(() => {
    const t = (el) => (el ? el.textContent.replace(/\s+/g, " ").trim() : "");
    const para = (el) => (el ? [...el.querySelectorAll("p")].map((p) => p.textContent.trim()).join("\n\n") : "");
    return {
      name: t(document.querySelector(".brand")) || (document.querySelector(".brand img") || {}).alt || "",
      title: document.title,
      layout: (document.body.className.match(/layout-([a-z-]+)/) || [])[1] || "",
      hasLogo: !!document.querySelector(".brand img"),
      tagline: t(document.querySelector(".hero-tagline")),
      headline: t(document.querySelector(".hero h1")),
      subtext: t(document.querySelector(".hero-text")),
      cta: t(document.querySelector(".hero .button")),
      features: [...document.querySelectorAll(".feature")].map((f) => ({ title: t(f.querySelector("h3")), text: t(f.querySelector("p")) })),
      hasHero: !!document.querySelector(".hero-bg, .hero-img:not(.hero-img--placeholder)"),
      pages: [...document.querySelectorAll(".site-nav a")].map((a) => a.textContent.trim()),
      primary: getComputedStyle(document.documentElement).getPropertyValue("--color-primary").trim(),
      headingFont: getComputedStyle(document.documentElement).getPropertyValue("--font-heading").trim(),
    };
  });

  const out = { ...home, story: "", team: [], services: [], contact: {}, gallery: 0 };

  if (await read(page, path.join(site, "about.html"))) {
    Object.assign(out, await page.evaluate(() => {
      const t = (el) => (el ? el.textContent.replace(/\s+/g, " ").trim() : "");
      return {
        story: [...document.querySelectorAll(".prose p")].map((p) => p.textContent.trim()).join("\n\n"),
        team: [...document.querySelectorAll(".team-member")].map((m) => ({ name: t(m.querySelector("h3")), role: t(m.querySelector("p")) })),
      };
    }));
  }
  if (await read(page, path.join(site, "services.html"))) {
    out.services = await page.evaluate(() =>
      [...document.querySelectorAll(".service")].map((s) => ({
        name: (s.querySelector("h3") || {}).textContent?.trim() || "",
        description: (s.querySelector("p") || {}).textContent?.trim() || "",
        price: (s.querySelector(".service-price") || {}).textContent?.trim() || "",
      })),
    );
  }
  if (await read(page, path.join(site, "gallery.html"))) {
    out.gallery = await page.evaluate(() => document.querySelectorAll(".gallery img").length);
  }
  if (await read(page, path.join(site, "contact.html"))) {
    out.contact = await page.evaluate(() => {
      const get = (label) => {
        for (const li of document.querySelectorAll(".contact-list li")) {
          const strong = li.querySelector("strong");
          if (strong && strong.textContent.trim().toLowerCase() === label) {
            const clone = li.querySelector("div").cloneNode(true);
            clone.querySelector("strong").remove();
            return clone.textContent.replace(/\n\s*\n/g, "\n").trim();
          }
        }
        return "";
      };
      return { address: get("address"), phone: get("phone"), email: get("email"), hours: get("hours") };
    });
  }

  await browser.close();
  const json = JSON.stringify(out, null, 2);
  if (outFile) fs.writeFileSync(outFile, json);
  else console.log(json);
})().catch((e) => { console.error(e); process.exit(1); });
