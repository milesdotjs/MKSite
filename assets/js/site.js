/* ============================================================
   MILESKING.DEV — motion (spec-sheet theme)
   GSAP 3 + ScrollTrigger, ScrollTo, ScrambleText.

   Motion here is mechanical, every piece of it does a job, and all of it
   comes to rest on its own (WCAG 2.2.2: nothing moves for more than a few
   seconds without the visitor driving it):

     1. ASSEMBLY. The name is fitted together once, bar by bar; the clamps
        snap on; the glass plate goes in last. It starts the moment this
        script runs -- the wordmark is SVG geometry and doesn't wait on
        webfonts -- and it is SKIPPED if the page has already painted (slow
        scripts, a throttled CPU), so it never takes back a name the visitor
        has already read. Trade-off: fast loads get the entrance; slower
        phones mostly get the finished name, which is the correct end state.
     2. CALIBRATION. The hero dial's red index sweeps up its 0-10 scale and
        settles; the orbit hairline draws across the page. Same timing rule.
     3. SCROLL IS THE CRANK. The Air Treck wheel and the footer gear train run
        off ONE crank angle, the train at true tooth ratios, so meshing gears
        actually mesh. They spin up briefly on load, then only turn while you
        scroll; at rest the ticker listener is removed so the page goes idle.
     4. GAUGES. Each skill needle sweeps to its value the first time the
        calibration strip comes into view.
     5. THE RAIL tracks your place in the page with its red index; its debug
        fragment retypes when you enter a new section.

   The static markup already shows every FINAL state (needles at value, arcs
   drawn, index at rest), and nothing starts at opacity 0, so the page reads
   correctly if any of this fails to run.
   ============================================================ */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  /* a missing project screenshot falls back to the card's steel panel */
  $$(".card-shot img").forEach(function (img) {
    img.addEventListener("error", function () { (img.closest("picture") || img).remove(); });
  });

  /* ==========================================================
     CONTACT FORM — send in place and say what happened. The plain POST to
     Formspree stays as the no-JS fallback.
     ========================================================== */
  (function () {
    var f = $("[data-form]");
    if (!f || !window.fetch || !window.FormData) return;
    var status = $(".form-status", f);
    var btn = $('button[type="submit"]', f);
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      status.classList.remove("is-err");
      status.textContent = "Sending…";
      btn.disabled = true;
      fetch(f.action, { method: "POST", body: new FormData(f), headers: { Accept: "application/json" } })
        .then(function (r) {
          if (!r.ok) throw new Error("HTTP " + r.status);
          f.reset();
          status.textContent = "Sent. I'll reply within a day.";
        })
        .catch(function () {
          status.classList.add("is-err");
          status.textContent = "That didn't go through. Try again in a minute, or message me on LinkedIn.";
        })
        .then(function () { btn.disabled = false; });
    });
  })();

  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, ScrambleTextPlugin);
  root.classList.add("is-gsap");

  function shown(el) { return !!(el && el.getClientRects().length); }

  /* ==========================================================
     1. ASSEMBLY — only the wordmark variant actually on screen
     ========================================================== */
  function assemble() {
    var mark = $$(".hero-name .wm").filter(shown)[0];
    if (!mark) return;
    // Each bar's geometry lives ONCE in <defs> (data-bar) and every layer --
    // both masks included -- <use>s it, so tweening the def moves all nine
    // copies. Tweening the copies themselves was 108 tweens and stuttered on
    // mid-tier phones.
    var bars = $$("defs [data-bar]", mark);
    var tl = gsap.timeline({ delay: 0.08 });
    bars.forEach(function (el, i) {
      tl.from(el, { opacity: 0, y: (i % 2 ? 1 : -1) * 22, duration: 0.42, ease: "power3.out" }, i * 0.03);
    });
    tl.from($$(".wm-fit > g", mark), {
        opacity: 0, scale: 1.7, transformOrigin: "50% 50%",
        duration: 0.2, ease: "steps(2)", stagger: 0.05
      }, ">-0.08")
      .from($(".wm-glass", mark), { opacity: 0, duration: 0.6, ease: "power1.out" }, ">-0.1");

    // headless tabs throttle rAF; never leave the name half-built
    gsap.delayedCall(4, function () { if (tl.progress() < 1) tl.progress(1); });
  }

  /* ==========================================================
     2. CALIBRATION — the hero dial's index + the orbit hairline
     ========================================================== */
  function calibrate() {
    var idx = $(".dz-idx");
    if (idx) {
      var o = idx.getAttribute("data-cx") + " " + idx.getAttribute("data-cy");
      var span = parseFloat(idx.getAttribute("data-span"));
      var rest = parseFloat(idx.getAttribute("data-rest"));
      gsap.fromTo(idx, { rotation: 0, svgOrigin: o }, {
        rotation: span * rest / 10, svgOrigin: o,
        duration: 1.8, delay: 0.55, ease: "elastic.out(1, 0.5)"
      });
    }
    var orbit = $(".hero-orbit path");
    if (orbit) {
      gsap.fromTo(orbit, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.6, delay: 0.2, ease: "power2.inOut" });
    }
  }

  // the bezel turns a few degrees as the hero scrolls away (needs settled layout)
  function bezelScroll() {
    var idx = $(".dz-idx");
    if (!idx) return;
    var o = idx.getAttribute("data-cx") + " " + idx.getAttribute("data-cy");
    gsap.to(".dz-turn", {
      rotation: -6, svgOrigin: o, ease: "none",
      scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: 0.6 }
    });
  }

  /* ==========================================================
     3. THE CRANK — wheel + gear train off one shared angle
     ========================================================== */
  function crank() {
    var gears = $$(".gt-g").map(function (g) {
      return {
        el: g.querySelector(".gt-rot"),
        z: parseFloat(g.getAttribute("data-z")),
        dir: parseFloat(g.getAttribute("data-dir")),
        ph: parseFloat(g.getAttribute("data-phase")),
        last: ""
      };
    });
    var wheelEl = $(".hero-wheel .wh-turn");
    if (!gears.length && !wheelEl) return;
    // Hidden on portrait phones: never write to it -- but look again on every
    // refresh (resize, rotation), or a phone turned to landscape gets a dead wheel.
    var wheel = shown(wheelEl) ? wheelEl : null;
    ScrollTrigger.addEventListener("refresh", function () { wheel = shown(wheelEl) ? wheelEl : null; });

    var zDrive = gears.length ? gears[0].z : 40;
    var angle = 0, speed = 0, target = 0, lastScroll = 0, running = false, lastW = "";
    var spinUntil = performance.now() + 2500;           // a short spin-up on load, well under 5s

    // only spend frames on what's on screen
    var gearsOn = gears.length ? ScrollTrigger.create({ trigger: "#footer", start: "top bottom", end: "bottom top" }) : null;
    var wheelOn = wheelEl ? ScrollTrigger.create({ trigger: "#hero", start: "top bottom", end: "bottom top" }) : null;

    function tick(time, dt) {
      var now = performance.now();
      if (now - lastScroll > 140) target = now < spinUntil ? 1 : 0;   // idle means stopped
      speed += (target - speed) * 0.08;
      if (target === 0 && Math.abs(speed) < 0.02) {                  // at rest: let the page sleep
        speed = 0;
        gsap.ticker.remove(tick);
        running = false;
        return;
      }
      angle += speed * Math.min(dt, 64) * 0.01;
      if (gearsOn && gearsOn.isActive) {
        for (var i = 0; i < gears.length; i++) {
          var g = gears[i];
          // meshing gears turn opposite ways at the inverse tooth ratio
          var v = "rotate(" + (g.ph + g.dir * angle * zDrive / g.z).toFixed(1) + ")";
          if (v !== g.last) { g.el.setAttribute("transform", v); g.last = v; }
        }
      }
      if (wheel && wheelOn && wheelOn.isActive) {
        var w = "rotate(" + (angle * 0.75).toFixed(1) + "deg)";
        if (w !== lastW) { wheel.style.transform = w; lastW = w; }
      }
    }
    function wake() { if (!running) { running = true; gsap.ticker.add(tick); } }

    ScrollTrigger.create({
      start: 0, end: "max",
      onUpdate: function (self) {
        target = gsap.utils.clamp(-12, 12, self.getVelocity() / 240);
        lastScroll = performance.now();
        wake();
      }
    });
    wake();
  }

  /* ==========================================================
     4. GAUGES — needles sweep once, with a tachometer overshoot
     ========================================================== */
  function gauges() {
    $$(".gauge").forEach(function (g) {
      var v = parseFloat(g.getAttribute("data-val")) || 0;
      var needle = $(".sd-needle", g), arcEl = $(".sd-val", g), out = $("[data-count]", g);
      ScrollTrigger.create({
        trigger: g, start: "top 90%", once: true,
        onEnter: function () {
          gsap.fromTo(needle, { rotation: 0, svgOrigin: "50 50" },
                      { rotation: 2.7 * v, svgOrigin: "50 50", duration: 1.1, ease: "back.out(1.7)" });
          gsap.fromTo(arcEl, { strokeDashoffset: 100 }, { strokeDashoffset: 100 - v, duration: 1, ease: "power2.out" });
          var n = { v: 0 };
          gsap.to(n, { v: v, duration: 1, ease: "power2.out", onUpdate: function () { out.textContent = Math.round(n.v); } });
        }
      });
    });
  }

  /* ==========================================================
     5. RAIL — red index tracks the page; the fragment retypes
     ========================================================== */
  function rail() {
    var el = $(".rail");
    if (!shown(el)) return;
    var idx = $("[data-rail-idx]", el);
    var frag = $("[data-frag-out]", el);
    var secs = $$("[data-frag]");

    var current = "", tl = null;
    function retype(word) {
      if (word === current) return;
      current = word;
      if (tl) tl.kill();
      if (reduce) { frag.textContent = word; return; }
      // v18's debug fragments: truncate, fault, resolve -- stepped, not faded
      tl = gsap.timeline()
        .call(function () { frag.textContent = word.slice(0, Math.max(1, Math.ceil(word.length / 2))) + "_"; })
        .call(function () { frag.textContent = word + " ERROR"; }, null, 0.14)
        .to(frag, { duration: 0.45, scrambleText: { text: word, chars: "ERROR_/01", speed: 1 } }, 0.32);
    }
    // The current section is the last one whose top has passed a reading line.
    // The line starts at the top of the page and slides down to 55% of the
    // viewport as you scroll, so a short first section (the sub-pages' headers)
    // still owns the rail at scroll 0 -- per-section triggers never saw it.
    function pick() {
      var line = Math.min(window.innerHeight * 0.55, window.scrollY), cur = secs[0];
      for (var i = 0; i < secs.length; i++) {
        if (secs[i].getBoundingClientRect().top <= line) cur = secs[i];
      }
      if (cur) retype(cur.getAttribute("data-frag"));
    }
    ScrollTrigger.create({
      start: 0, end: "max",
      onUpdate: function (self) {
        idx.style.transform = "translateY(" + (self.progress * (el.clientHeight - 4)).toFixed(1) + "px)";
        pick();
      }
    });
    ScrollTrigger.addEventListener("refresh", pick);   // a resize re-picks the label before the next scroll
    pick();
  }

  /* ==========================================================
     NAV — current section on the one-pager; smooth anchors that move
     keyboard focus to where they land (WCAG 2.4.3)
     ========================================================== */
  function navState() {
    // the "Say hello" pill stands in for the nav's Contact link where that one
    // is hidden, so it takes the marker too ([href^="#"]: in-page links only)
    $$('#nav nav a[href^="#"], #nav .nav-cta[href^="#"]').forEach(function (a) {
      var sec = $(a.getAttribute("href"));
      if (!sec) return;
      ScrollTrigger.create({
        trigger: sec, start: "top 45%", end: "bottom 45%",
        onToggle: function (s) {
          a.classList.toggle("is-on", s.isActive);
          if (s.isActive) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        }
      });
    });
  }

  function focusTarget(t, top) {
    var f = top ? ($("#main h1") || t) : (t.querySelector("h1, h2") || t);
    if (!f.hasAttribute("tabindex")) f.setAttribute("tabindex", "-1");
    f.focus({ preventScroll: true });
  }

  function anchors() {
    $$('a[href^="#"]').forEach(function (a) {
      var id = a.getAttribute("href");
      if (id.length < 2 || a.classList.contains("skip")) return;
      a.addEventListener("click", function (e) {
        var t = $(id);
        if (!t) return;
        e.preventDefault();
        var top = id === "#hero" || id === "#top";
        var navH = top ? 0 : ($("#nav") ? $("#nav").offsetHeight - 1 : 0);
        gsap.to(window, {
          duration: reduce ? 0 : 0.9, ease: "power3.inOut",
          scrollTo: { y: top ? 0 : t, offsetY: navH },
          onComplete: function () {
            focusTarget(t, top);
            if (history.replaceState) history.replaceState(null, "", id);
          }
        });
      });
    });
  }

  /* ==========================================================
     go
     ========================================================== */

  // The entrance starts now, unless the page has ALREADY painted (slow vendor
  // scripts, a throttled CPU): then the visitor has seen the finished name and
  // the static final state stays put. On fast loads this script runs before
  // first paint, so the entrance plays.
  var paint = performance.getEntriesByType ? performance.getEntriesByType("paint") : [];
  var late = paint.length > 0;
  if (!reduce && !late) {
    assemble();
    calibrate();
  }

  function start() {
    if (!reduce) {
      bezelScroll();
      crank();
      gauges();
    }
    rail();
    navState();
    anchors();
    ScrollTrigger.refresh();
    root.classList.add("is-ready");
  }

  /* Wait for webfonts: ScrollTrigger measures start/end positions against the
     current layout, and a late font swap shifts every section below the fold.
     A 2s cap keeps a slow font CDN from holding the page hostage. The extra
     frame keeps this setup out of the assembly's first frame. */
  function whenReady(fn) {
    var done = false;
    var go = function () { if (!done) { done = true; requestAnimationFrame(fn); } };
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(go);
      setTimeout(go, 2000);
    } else {
      setTimeout(go, 0);
    }
  }

  whenReady(start);
  // late-loading project shots change section heights
  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
