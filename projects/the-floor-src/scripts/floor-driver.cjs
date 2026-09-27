// A small driver for The Floor's wizard, so a test can behave like a person:
// fill a step, look at the preview, go back, change something, look again,
// then download. Built on Puppeteer.
//
//   const { FloorSession } = require("./floor-driver.cjs");
//   const s = await FloorSession.open({ base: "https://mileskingdev.com/projects/the-floor/", outDir: "qa-shots/x" });
//   await s.basics({ name: "Corner Bakery", tagline: "Bread, daily", type: "Restaurant" });
//   await s.next();
//   await s.chooseLayout("Split screen");   await s.next();
//   await s.choosePalette("Sand");          await s.next();
//   await s.chooseFont("Classic");          await s.next();
//   await s.uploadLogo(null);               await s.next();      // or a PNG/JPG path
//   await s.setPages(["About", "Services", "Gallery", "Contact"]); await s.next();
//   await s.content({ headline: "...", hero: "photo.jpg", gallery: ["a.jpg"], services: [...] });
//   await s.next();                                              // preview step
//   const png = await s.previewShot("round1-home", { page: "Home", device: "Desktop" });
//   await s.goTo("Colours"); await s.choosePalette("Teal"); await s.goTo("Preview");
//   await s.next(); await s.next();                              // reality check, download
//   const zip = await s.download();
//   await s.close();
//
// Step titles, in order: Basics, Layout, Colours, Fonts, Logo, Pages, Your words,
// Preview, Reality check, Download. Choice cards are matched by the start of
// their title, e.g. "Restaurant", "Trades", "Big image", "Navy", "Festive".
const path = require("node:path");
const fs = require("node:fs");
const puppeteer = require("C:/Users/ilove/Documents/GitHub/MKSite/projects/blackjack with yugi/node_modules/puppeteer");

const STEPS = ["Basics", "Layout", "Colours", "Fonts", "Logo", "Pages", "Your words", "Preview", "Reality check", "Download"];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Set a React-controlled input/textarea value and fire the events React listens for. */
async function setValue(page, selector, value) {
  await page.$eval(
    selector,
    (el, v) => {
      const proto = el.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(proto, "value").set.call(el, v ?? "");
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
    },
    value,
  );
}

class FloorSession {
  static async open({ base, outDir, viewport = { width: 1280, height: 800 }, headless = true }) {
    const s = new FloorSession();
    s.base = base.replace(/\/+$/, "") + "/";
    s.outDir = path.resolve(outDir);
    s.downloadDir = path.join(s.outDir, "downloads");
    fs.mkdirSync(s.downloadDir, { recursive: true });
    s.browser = await puppeteer.launch({ headless });
    s.page = await s.browser.newPage();
    s.errors = [];
    s.page.on("pageerror", (e) => s.errors.push(`pageerror: ${e.message}`));
    s.page.on("console", (m) => {
      if (m.type() === "error" && !/googletagmanager|google-analytics|about:srcdoc/.test(m.text())) s.errors.push(`console: ${m.text()}`);
    });
    const cdp = await s.page.createCDPSession();
    await cdp.send("Browser.setDownloadBehavior", { behavior: "allow", downloadPath: s.downloadDir });
    await s.page.setViewport(viewport);
    await s.page.goto(s.base + "build/", { waitUntil: "networkidle0", timeout: 60000 });
    await s.page.waitForSelector("#business-name", { timeout: 30000 });
    return s;
  }

  /* ---------- navigation ---------- */

  async step() {
    const text = await this.page.$eval(".wizard-progress .wrap span", (el) => el.textContent || "");
    const m = /Step (\d+) of \d+:\s*(.+)/.exec(text.trim());
    return m ? { n: Number(m[1]), title: m[2].trim() } : { n: 0, title: "" };
  }

  async _navClick(side) {
    const buttons = await this.page.$$(".wizard-nav button");
    let target = null;
    for (const b of buttons) {
      const t = (await b.evaluate((el) => el.textContent || "")).trim();
      if (side === "back" && t === "Back") target = b;
      if (side === "next" && t !== "Back") target = b;
    }
    if (!target) throw new Error(`No ${side} button on step "${(await this.step()).title}"`);
    const disabled = await target.evaluate((el) => el.disabled);
    if (disabled) throw new Error(`${side} button is disabled on step "${(await this.step()).title}" (Basics needs a business name)`);
    const before = (await this.step()).n;
    await target.click();
    await this.page.waitForFunction(
      (prev) => !/Step (\d+)/.test(document.querySelector(".wizard-progress .wrap span")?.textContent || "") || Number(RegExp.$1) !== prev,
      { timeout: 10000 },
      before,
    );
    await sleep(200);
  }

  async next() {
    await this._navClick("next");
  }
  async back() {
    await this._navClick("back");
  }

  /** Walk Back/Next until the named step is showing. */
  async goTo(title) {
    const want = STEPS.findIndex((s) => s.toLowerCase() === title.toLowerCase());
    if (want < 0) throw new Error(`Unknown step "${title}". Use one of: ${STEPS.join(", ")}`);
    for (let i = 0; i < 12; i++) {
      const cur = (await this.step()).n - 1;
      if (cur === want) return;
      if (cur < want) await this.next();
      else await this.back();
    }
    throw new Error(`Couldn't reach step "${title}"`);
  }

  /** Text of any yellow notices on the current step (shape warnings, placeholder warnings, welcome back). */
  async notices() {
    return this.page.$$eval(".notice", (els) => els.map((e) => e.textContent.replace(/\s+/g, " ").trim()));
  }

  async shot(name, { fullPage = true } = {}) {
    const file = path.join(this.outDir, `${name}.png`);
    await this.page.evaluate(() => document.fonts.ready);
    await this.page.screenshot({ path: file, fullPage });
    return file;
  }

  /* ---------- steps ---------- */

  async _choose(titleStart) {
    const cards = await this.page.$$(".choice");
    for (const c of cards) {
      const t = (await c.evaluate((el) => (el.querySelector(".choice-title") || el).textContent || "")).trim();
      if (t.toLowerCase().startsWith(titleStart.toLowerCase())) {
        await c.evaluate((el) => el.scrollIntoView({ block: "center" }));
        await c.click();
        await sleep(120);
        return t;
      }
    }
    const all = [];
    for (const c of cards) all.push((await c.evaluate((el) => (el.querySelector(".choice-title") || el).textContent || "")).trim());
    throw new Error(`No choice starting with "${titleStart}". Available: ${all.join(" | ")}`);
  }

  async basics({ name, tagline, type }) {
    await this.goTo("Basics");
    if (name !== undefined) await setValue(this.page, "#business-name", name);
    if (tagline !== undefined) await setValue(this.page, "#tagline", tagline);
    if (type) await this._choose(type);
  }
  async chooseLayout(t) {
    await this.goTo("Layout");
    return this._choose(t);
  }
  async choosePalette(t) {
    await this.goTo("Colours");
    return this._choose(t);
  }
  async chooseFont(t) {
    await this.goTo("Fonts");
    await this.page.waitForSelector(".font-sample");
    return this._choose(t);
  }

  async _upload(selector, files) {
    const input = await this.page.$(selector);
    if (!input) throw new Error(`No file input ${selector} on this step`);
    await input.uploadFile(...(Array.isArray(files) ? files : [files]));
  }

  async uploadLogo(file) {
    await this.goTo("Logo");
    if (!file) return;
    await this._upload("#logo-upload", file);
    await this.page.waitForSelector(".upload-preview img", { timeout: 15000 });
    await sleep(500);
  }

  async setPages(labels) {
    await this.goTo("Pages");
    const wanted = new Set(labels);
    for (const c of await this.page.$$(".check")) {
      const name = (await c.$eval("strong", (el) => el.textContent)).trim();
      if (name === "Home") continue;
      const on = await c.$eval("input", (el) => el.checked);
      if (on !== wanted.has(name)) {
        await c.evaluate((el) => el.scrollIntoView({ block: "center" }));
        await c.click();
        await sleep(80);
      }
    }
  }

  /** Adjust a repeatable list (team, services) to `items.length` rows, then fill them. */
  async _fillList(prefixes, addLabel, items) {
    const countRows = async () => (await this.page.$$(`[id^="${prefixes[0]}-"]`)).length;
    let n = await countRows();
    while (n > items.length) {
      const removes = await this.page.$$(".repeat-remove");
      await removes[removes.length - 1].evaluate((el) => el.scrollIntoView({ block: "center" }));
      await removes[removes.length - 1].click();
      await sleep(80);
      n = await countRows();
    }
    while (n < items.length) {
      const btns = await this.page.$$("button.btn--ghost");
      let clicked = false;
      for (const b of btns) {
        const t = (await b.evaluate((el) => el.textContent || "")).trim();
        if (t === addLabel) {
          await b.evaluate((el) => el.scrollIntoView({ block: "center" }));
          await b.click();
          clicked = true;
          break;
        }
      }
      if (!clicked) throw new Error(`No "${addLabel}" button`);
      await sleep(80);
      n = await countRows();
    }
    for (let i = 0; i < items.length; i++) {
      for (const [key, prefix] of Object.entries(prefixes[1])) {
        if (items[i][key] !== undefined) await setValue(this.page, `#${prefix}-${i}`, items[i][key]);
      }
    }
  }

  /**
   * Fill the "Your words" step. Every field optional. Arrays replace the whole
   * list. Photos are file paths.
   */
  async content(c = {}) {
    await this.goTo("Your words");
    const p = this.page;
    if (c.headline !== undefined) await setValue(p, "#headline", c.headline);
    if (c.subtext !== undefined) await setValue(p, "#subtext", c.subtext);
    if (c.cta !== undefined) await setValue(p, "#cta-text", c.cta);
    if (c.features) {
      for (let i = 0; i < Math.min(3, c.features.length); i++) {
        if (c.features[i].title !== undefined) await setValue(p, `#feature-title-${i}`, c.features[i].title);
        if (c.features[i].text !== undefined) await setValue(p, `#feature-text-${i}`, c.features[i].text);
      }
    }
    if (c.hero !== undefined) {
      if (c.hero) {
        await this._upload("#hero-upload", c.hero);
        await p.waitForSelector("#hero-upload ~ * img, .upload-preview img", { timeout: 20000 });
        await sleep(600);
      } else {
        const removes = await p.$$(".upload-preview .btn--danger");
        if (removes[0]) await removes[0].click();
      }
    }
    if (c.secondTitle !== undefined) await setValue(p, "#second-title", c.secondTitle);
    if (c.secondText !== undefined) await setValue(p, "#second-text", c.secondText);
    if (c.secondImage !== undefined) {
      if (c.secondImage) {
        const before = await p.$$eval(".upload-preview img", (els) => els.length);
        await this._upload("#second-upload", c.secondImage);
        await p.waitForFunction((n) => document.querySelectorAll(".upload-preview img").length > n, { timeout: 20000 }, before);
        await sleep(400);
      }
    }
    if (c.story !== undefined && (await p.$("#story"))) await setValue(p, "#story", c.story);
    if (c.team && (await p.$("#story"))) await this._fillList(["team-name", { name: "team-name", role: "team-role" }], "Add a team member", c.team);
    if (c.services && (await p.$("#service-name-0"))) {
      await this._fillList(["service-name", { name: "service-name", description: "service-desc", price: "service-price" }], "Add a service", c.services);
    }
    if (c.gallery && (await p.$("#gallery-upload"))) {
      // Remove existing thumbs, then upload the new set.
      let thumbs = await p.$$(".thumb button");
      while (thumbs.length) {
        await thumbs[0].click();
        await sleep(60);
        thumbs = await p.$$(".thumb button");
      }
      if (c.gallery.length) {
        await this._upload("#gallery-upload", c.gallery);
        await p.waitForFunction((n) => document.querySelectorAll(".thumb img").length >= n, { timeout: 30000 }, c.gallery.length);
        await sleep(400);
      }
    }
    if (c.contact) {
      for (const [k, sel] of [
        ["address", "#address"],
        ["hours", "#hours"],
        ["phone", "#phone"],
        ["email", "#email"],
      ]) {
        if (c.contact[k] !== undefined && (await p.$(sel))) await setValue(p, sel, c.contact[k]);
      }
    }
  }

  /* ---------- preview ---------- */

  async _seg(groupLabel, text) {
    const groups = await this.page.$$(".preview-bar .seg");
    for (const g of groups) {
      const label = await g.evaluate((el) => el.getAttribute("aria-label") || "");
      if (label !== groupLabel) continue;
      for (const b of await g.$$("button")) {
        const t = (await b.evaluate((el) => el.textContent || "")).trim();
        if (t.toLowerCase() === text.toLowerCase()) {
          await b.click();
          await sleep(500);
          return;
        }
      }
    }
    throw new Error(`No "${text}" in preview ${groupLabel} switcher`);
  }

  /**
   * Screenshot the live preview. Shows the whole page of the generated site
   * (the iframe is temporarily stretched to its content height).
   */
  async previewShot(name, { page = "Home", device = "Desktop" } = {}) {
    await this.goTo("Preview");
    await this.page.waitForSelector(".preview-frame");
    await this._seg("Page", page);
    await this._seg("Screen size", device);
    await sleep(600);
    const frame = this.page.frames().find((f) => f.parentFrame() && f.url().startsWith("about:srcdoc"));
    if (frame) {
      await frame.evaluate(() => document.fonts.ready).catch(() => {});
      const h = await frame.evaluate(() => document.documentElement.scrollHeight);
      await this.page.$eval(".preview-frame", (el, hh) => (el.style.height = hh + "px"), h);
      await sleep(300);
    }
    // The wizard's sticky progress bar and fixed Back/Next bar would be
    // composited over a tall capture; hide them for the shot.
    await this.page.evaluate(() => {
      for (const sel of [".wizard-nav", ".wizard-progress"]) document.querySelector(sel)?.style.setProperty("visibility", "hidden");
    });
    const el = await this.page.$(".preview-frame");
    const file = path.join(this.outDir, `${name}.png`);
    await el.screenshot({ path: file });
    await this.page.evaluate(() => {
      for (const sel of [".wizard-nav", ".wizard-progress"]) document.querySelector(sel)?.style.removeProperty("visibility");
      const f = document.querySelector(".preview-frame");
      if (f) f.style.height = "";
    });
    return file;
  }

  /* ---------- finish ---------- */

  async download() {
    await this.goTo("Download");
    for (const f of fs.readdirSync(this.downloadDir)) fs.unlinkSync(path.join(this.downloadDir, f));
    const btn = (await this.page.$$(".download-box button"))[0];
    await btn.click();
    for (let i = 0; i < 240; i++) {
      await sleep(250);
      const zip = fs.readdirSync(this.downloadDir).find((f) => f.endsWith(".zip"));
      if (zip) {
        await sleep(300);
        return path.join(this.downloadDir, zip);
      }
    }
    throw new Error("ZIP did not download within 60s");
  }

  async close() {
    await this.browser.close();
  }
}

module.exports = { FloorSession, setValue, STEPS };
