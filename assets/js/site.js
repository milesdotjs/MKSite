/* ============================================================
   MILESKING.DEV — motion (Air Gear / Halo Drive theme)
   GSAP 3.13 + ScrollTrigger, SplitText, ScrambleText, Physics2D.

   Two ideas drive almost everything here:

   1. SCROLL IS THE CRANK. Nothing is scrubbed to a scroll position;
      instead every rotating thing (hero machinery, gears, tape, logo)
      runs a free idle spin whose *timeScale* follows scroll velocity.
      Scroll down and the machine spools up; scroll up and it runs
      backwards; stop and it coasts back to idle.

   2. THE PROJECTION IS UNSTABLE. The chamber flickers, the wordmark's
      aberration snaps apart and settles, the sheens sweep the glass.

   PERFORMANCE — the previous build lagged on weaker devices, so:
     - drive tweens PAUSE while their host is off-screen (IntersectionObserver)
     - the sheen is ONE sweep at a time, on a panel that is actually visible,
       moving a transform (composited) rather than a background-position
     - the HUD rpm readout updates every 8th frame, not every frame
     - no per-frame skew/x glitch on the giant chrome name; the aberration
       snap tweens a CSS variable that only moves two transforms
     - `.is-lite` on coarse-pointer / low-core devices: no sheen scheduler,
       no data rain, fewer gears (see site.css)

   Note: anything GSAP animates must NOT also carry a CSS keyframe
   animation — GSAP samples the live computed style and can bake in a
   mid-animation value. `.is-gsap` (set below) kills the CSS fallbacks.
   ============================================================ */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var params = new URLSearchParams(location.search);
  var seenBoot = false;
  try { seenBoot = sessionStorage.getItem("mk-booted") === "1"; } catch (e) {}
  var skipBoot = params.get("boot") === "0" || reduce ||
                 (seenBoot && params.get("boot") !== "1");

  // Lite mode: phones/tablets and anything with few cores. ?lite=1 / ?lite=0 force it.
  var lite = params.get("lite") === "1" || (params.get("lite") !== "0" && (
    !window.matchMedia("(pointer: fine)").matches ||
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
    (navigator.deviceMemory && navigator.deviceMemory <= 4) ||
    (navigator.connection && navigator.connection.saveData)));
  if (lite) root.classList.add("is-lite");

  if (!window.gsap) {           // no GSAP: CSS fallbacks carry the page
    document.body.classList.remove("is-booting");
    var b0 = document.getElementById("boot");
    if (b0) b0.remove();
    return;
  }

  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText,
                      ScrambleTextPlugin, Physics2DPlugin);
  root.classList.add("is-gsap");

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var SCRAMBLE = "01234567890ABCDEF#%&/<>[]{}*";

  /* ==========================================================
     1. BOOT / ACCESS SEQUENCE
     ========================================================== */
  function boot(done) {
    var el = $("#boot");
    if (!el) { done(); return; }
    if (skipBoot) {
      el.remove();
      document.body.classList.remove("is-booting");
      done();
      return;
    }

    var tl = gsap.timeline({
      onComplete: function () {
        try { sessionStorage.setItem("mk-booted", "1"); } catch (e) {}
        el.remove();
        document.body.classList.remove("is-booting");
        ScrollTrigger.refresh();
        done();
      }
    });

    var counter = { v: 0 };

    tl.to($(".boot-gear svg"), { rotation: 720, duration: 3.4, ease: "power2.inOut", transformOrigin: "50% 50%" }, 0)
      .from($(".boot-core"), { opacity: 0, duration: .4 }, 0)
      .to($("[data-boot-id]"), {
        duration: .9, scrambleText: { text: "MK-AT-2026 :: HALO DRIVE CORE", chars: SCRAMBLE, speed: .5 }
      }, .1);

    // log lines land one at a time, each decoding into place
    $$("[data-boot-line]").forEach(function (line, i) {
      var text = line.textContent;
      tl.set(line, { opacity: 1 }, .5 + i * .32)
        .to(line, { duration: .34, scrambleText: { text: text, chars: SCRAMBLE, speed: .8 } }, .5 + i * .32);
    });

    tl.to($("[data-boot-bar]"), { width: "100%", duration: 2.4, ease: "power1.inOut" }, .5)
      .to(counter, {
        v: 100, duration: 2.4, ease: "power1.inOut",
        onUpdate: function () { $("[data-boot-pct]").textContent = Math.round(counter.v); }
      }, .5)
      .to($$("[data-boot-line]").slice(-1), {
        duration: .3, scrambleText: { text: "> handshake ....................... OK", chars: SCRAMBLE, speed: 1 }
      }, 2.5)
      .to($(".boot-core"), { opacity: 0, scale: .96, duration: .3, ease: "power2.in" }, 3.0)
      .set($("[data-boot-grant]"), { opacity: 1 }, 3.15)
      .from($("[data-boot-grant]"), { scale: 1.35, duration: .45, ease: "expo.out" }, 3.15)
      .to($("[data-boot-grant]"), { opacity: 0, duration: .12, repeat: 3, yoyo: true }, 3.4)
      .to(el, { clipPath: "inset(0 0 100% 0)", duration: .6, ease: "expo.inOut" }, 3.9);

    // let people bail out
    el.addEventListener("click", function () { tl.progress(1); });
  }

  /* ==========================================================
     2. THE MACHINE — idle spin whose speed follows scroll velocity.
        Every drive knows its host element; an IntersectionObserver
        pauses the tween while the host is off-screen, so a page with
        twenty gears only ever animates the handful you can see.
     ========================================================== */
  var drives = [];   // { tween, host, on }

  function addDrive(tween, host) {
    drives.push({ tween: tween, host: host, on: true });
  }

  function buildMachine() {
    // every gear / rotor stage: data-dur (s per cycle), data-rev (direction) —
    // and, for the meshing train, data-rot (mesh phase) + data-turn (degrees
    // per cycle = 360 * teeth ratio) so meshed gears stay meshed at any timeScale
    $$("[data-gear], [data-rotor]").forEach(function (g) {
      var svg = g.tagName.toLowerCase() === "svg" ? g : g.querySelector("svg");
      var dur = parseFloat(g.dataset.dur) || 24;
      var turn = g.dataset.turn ? parseFloat(g.dataset.turn) : (g.dataset.rev ? -360 : 360);
      var rot = parseFloat(g.dataset.rot) || 0;
      gsap.set(svg, { rotation: rot, transformOrigin: "50% 50%" });
      addDrive(gsap.to(svg, {
        rotation: (turn < 0 ? "-=" : "+=") + Math.abs(turn), duration: dur, ease: "none", repeat: -1
      }), g.closest("section, header, footer") || g);
    });

    // the small chrome parts in the nav / section tags / footer join the train
    $$(".logo-wheel svg, .tag-gear svg, .foot-gear svg, .hud-gear svg").forEach(function (svg, i) {
      addDrive(gsap.to(svg, {
        rotation: i % 2 ? -360 : 360, duration: 10 + i * 2, ease: "none",
        repeat: -1, transformOrigin: "50% 50%"
      }), svg.closest("section, header, footer, aside") || svg);
    });

    // every tape is part of the same drivetrain
    $$("[data-tape]").forEach(function (tape) {
      // four copies of the string; one copy's width per cycle keeps the loop seamless
      addDrive(gsap.to(tape, { xPercent: -25, duration: 24, ease: "none", repeat: -1 }), tape);
    });

    // pause what you can't see
    if ("IntersectionObserver" in window) {
      var byHost = new Map();
      drives.forEach(function (d) {
        if (!byHost.has(d.host)) byHost.set(d.host, []);
        byHost.get(d.host).push(d);
      });
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          var list = byHost.get(en.target) || [];
          list.forEach(function (d) {
            d.on = en.isIntersecting;
            if (d.on) d.tween.play(); else d.tween.pause();
          });
        });
      }, { rootMargin: "12% 0px 12% 0px" });
      byHost.forEach(function (_, host) {
        // fixed hosts (nav, hud) are always on screen; observe the rest
        var pos = getComputedStyle(host).position;
        if (pos !== "fixed") io.observe(host);
      });
    }

    // Scroll velocity drives the whole train. One shared timeScale,
    // lerped on the ticker, applied only to the drives that are running.
    var targetTS = 1, curTS = 1, lastScroll = 0, frame = 0;
    var rpm = $("[data-hud-rpm]");

    ScrollTrigger.create({
      start: 0, end: "max",
      onUpdate: function (self) {
        var v = self.getVelocity();
        targetTS = gsap.utils.clamp(-9, 9, 1 + v / 260);
        lastScroll = performance.now();
      }
    });

    gsap.ticker.add(function () {
      if (performance.now() - lastScroll > 140) targetTS = 1;
      var next = curTS + (targetTS - curTS) * 0.09;
      if (Math.abs(next) < 0.02) next = 0.02;
      // at idle nothing changes — skip the loop entirely
      if (Math.abs(next - curTS) > 0.0005 || Math.abs(next - 1) > 0.0005) {
        curTS = next;
        for (var i = 0; i < drives.length; i++) if (drives[i].on) drives[i].tween.timeScale(curTS);
      }
      if (rpm && (++frame & 7) === 0) {
        rpm.textContent = String(Math.min(9999, Math.round(Math.abs(curTS) * 620))).padStart(4, "0");
      }
    });
  }

  /* ==========================================================
     3. HERO — the halo drive assembles, the nameplate resolves
     ========================================================== */
  function hero() {
    if (!$("#hero")) return;
    var tl = gsap.timeline({ delay: .1 });

    // halo blooms, stages arrive from a fast spin down to idle
    tl.from(".ro-glow", { opacity: 0, scale: .6, duration: 1.4, ease: "expo.out" }, 0)
      .from(".ro-halo", { opacity: 0, scale: 1.18, duration: 1.1, ease: "expo.out" }, .05)
      .from(".ro-outer", { opacity: 0, scale: .8, rotation: -40, duration: 1.5, ease: "expo.out" }, .1)
      .from(".ro-ring", { opacity: 0, scale: .6, rotation: 60, duration: 1.3, ease: "expo.out" }, .2)
      .from(".ro-inner", { opacity: 0, scale: .4, rotation: -90, duration: 1.2, ease: "expo.out" }, .3)
      .from(".ro-hub", { opacity: 0, scale: .3, duration: .8, ease: "back.out(2)" }, .45)
      .from(".hero-light", { opacity: 0, duration: 1.4 }, 0);

    var chars = [];
    $$(".hero-name [data-split]").forEach(function (line) {
      var split = new SplitText(line, { type: "chars", charsClass: "char" });
      // Once split, the chars are inline-block. `background-clip:text` on
      // the parent cannot clip to text inside inline-block descendants, so
      // it paints a solid rectangle over the first glyph instead. Each
      // .char carries its own gradient now, so drop the parent's.
      line.classList.add("is-split");
      chars = chars.concat(split.chars);
    });
    if (chars.length) {
      tl.from(chars, {
        opacity: 0, yPercent: 40, scale: .86,
        transformOrigin: "50% 100%",
        stagger: { each: .04, from: "center" },
        duration: .7, ease: "power3.out"
      }, .3);
    }

    tl.from(".hero-kicker .tag", { opacity: 0, y: 14, stagger: .07, duration: .5, ease: "power2.out" }, .9)
      .from(".hero-dim", { opacity: 0, scaleX: .2, transformOrigin: "50% 50%", duration: .7, ease: "expo.out" }, .85)
      .from(".hero-lede", { opacity: 0, y: 14, duration: .55 }, .95)
      .from(".hero-cta .btn", { opacity: 0, y: 16, stagger: .09, duration: .5, ease: "back.out(1.5)" }, 1.05)
      .from(".bp-stamp, .bp-cross, .bp-call", { opacity: 0, stagger: .04, duration: .4 }, 1.1);

    // the kicker tags resolve out of noise
    $$(".hero-kicker .tag").forEach(function (t, i) {
      tl.to(t, {
        duration: .6,
        scrambleText: { text: t.dataset.final || t.textContent, chars: SCRAMBLE, speed: .8 }
      }, 1.0 + i * .09);
    });

    // the whole machine breathes (one transform on the container)
    if (!reduce) gsap.to(".rotor", { y: "-=9", duration: 5.5, ease: "sine.inOut", repeat: -1, yoyo: true });
  }

  /* ==========================================================
     4. GLITCH — the projection loses lock now and then.
        Cheap version: the aberration copies snap apart (two transforms)
        and the chamber gradient blinks (one opacity). No skew on the
        giant chrome text — that re-rasterised it every frame.
     ========================================================== */
  function glitch() {
    var name = $(".hero-name");
    if (name) {
      (function snap() {
        gsap.timeline({ onComplete: function () { gsap.delayedCall(gsap.utils.random(4, 9), snap); } })
          .to(name, { "--ab": 14, duration: .06 })
          .to(name, { "--ab": 3, duration: .5, ease: "power3.out" });
      })();
    }
    (function flicker() {
      gsap.timeline({ onComplete: function () { gsap.delayedCall(gsap.utils.random(8, 16), flicker); } })
        .to(".fx-chamber", { opacity: .6, duration: .05 })
        .to(".fx-chamber", { opacity: 1, duration: .05 })
        .to(".fx-chamber", { opacity: .75, duration: .04 })
        .to(".fx-chamber", { opacity: 1, duration: .12 });
    })();
  }

  /* ==========================================================
     5. IRIDESCENT SHEEN — one sweep at a time across a VISIBLE surface.
        Each surface reads --sx into translateX(); GSAP tweens the var.
     ========================================================== */
  function sheen() {
    var surfaces = $$(".glass, .card > a, .btn");
    if (!surfaces.length || !("IntersectionObserver" in window)) return;
    var visible = new Set();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) visible.add(en.target); else visible.delete(en.target);
      });
    }, { threshold: .25 });
    surfaces.forEach(function (s) { io.observe(s); });

    var last = null;
    (function sweep() {
      var pool = Array.from(visible).filter(function (s) { return s !== last; });
      if (pool.length) {
        var el = pool[Math.floor(Math.random() * pool.length)];
        last = el;
        gsap.fromTo(el, { "--sx": "0%" }, { "--sx": "270%", duration: 1.5, ease: "power2.inOut",
          onComplete: function () { gsap.set(el, { "--sx": "0%" }); } });
      }
      gsap.delayedCall(gsap.utils.random(2.2, 4.2), sweep);
    })();
  }

  /* ==========================================================
     6. SECTION TITLES — decode on approach
     ========================================================== */
  function cacheText() {
    $$("[data-scramble]").forEach(function (el) { el.dataset.final = el.textContent; });
  }

  function titles() {
    $$(".sec-title[data-scramble]").forEach(function (el) {
      var span = el.querySelector("span") || el;
      var text = span.textContent;
      ScrollTrigger.create({
        trigger: el, start: "top 82%", once: true,
        onEnter: function () {
          gsap.fromTo(el,
            { opacity: 0, y: 26 },
            { opacity: 1, y: 0, duration: .5, ease: "power2.out" });
          gsap.to(span, { duration: .9, scrambleText: { text: text, chars: SCRAMBLE, speed: .6 } });
          // the aberration snaps apart then settles
          gsap.fromTo(el, { "--ab": 16 }, { "--ab": 3, duration: .8, ease: "power3.out" });
        }
      });
    });

    // section furniture rises in
    $$(".sec-tag, .sec-sub, .head-link").forEach(function (el) {
      gsap.from(el, {
        opacity: 0, y: 18, duration: .5, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true }
      });
    });

    // hover-decode on nav, buttons and links
    $$("#nav nav a span[data-scramble], .nav-cta span[data-scramble], .btn span[data-scramble], .totop span[data-scramble], .head-link span[data-scramble]").forEach(function (span) {
      var host = span.closest("a, button") || span;
      var text = span.dataset.final || span.textContent;
      host.addEventListener("mouseenter", function () {
        gsap.to(span, { duration: .45, scrambleText: { text: text, chars: SCRAMBLE, speed: 1 } });
      });
    });
  }

  /* ==========================================================
     7. PANELS — assemble out of the projector
     ========================================================== */
  function panels() {
    $$("[data-panel]").forEach(function (el) {
      gsap.from(el, {
        opacity: 0, y: 42, rotateX: 8, scale: .97,
        transformPerspective: 900, transformOrigin: "50% 100%",
        duration: .85, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 84%", once: true }
      });
      var frame = el.querySelector(".g-frame");
      if (frame) {
        gsap.from(frame.children, {
          opacity: 0, scale: 2.4, duration: .5, stagger: .06, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 84%", once: true }
        });
      }
    });

    // work cards deal in
    ScrollTrigger.batch(".card", {
      start: "top 88%", once: true,
      onEnter: function (batch) {
        gsap.from(batch, {
          opacity: 0, y: 54, rotateY: -12, scale: .95,
          transformPerspective: 1000,
          duration: .75, stagger: .1, ease: "power3.out"
        });
      }
    });

    $$(".chips li").forEach(function (li, i) {
      gsap.from(li, {
        opacity: 0, scale: .7, duration: .35, ease: "back.out(2.4)",
        scrollTrigger: { trigger: li.closest(".chip-set"), start: "top 90%", once: true },
        delay: (i % 6) * .04
      });
    });

    $$(".factlist li, .sheet tr").forEach(function (row) {
      gsap.from(row, {
        opacity: 0, x: -18, duration: .45, ease: "power2.out",
        scrollTrigger: { trigger: row, start: "top 92%", once: true }
      });
    });
  }

  /* ==========================================================
     8. INSTRUMENTS — dials, bars and counters spin up
     ========================================================== */
  function instruments() {
    var SWEEP = 250;   // degrees between scale min and max, matches build_pages.py

    $$("[data-dial]").forEach(function (dial) {
      var val = parseFloat(dial.dataset.val) || 0;
      var needle = dial.querySelector(".d-needle");
      var arc = dial.querySelector(".d-arc");
      var out = dial.querySelector("[data-count]");
      var len = arc ? parseFloat(arc.getAttribute("stroke-dasharray")) : 0;
      var num = { v: 0 };

      ScrollTrigger.create({
        trigger: dial, start: "top 86%", once: true,
        onEnter: function () {
          gsap.to(needle, {
            rotation: SWEEP * val / 100, duration: 1.5,
            ease: "elastic.out(1, .62)", svgOrigin: "50 50"
          });
          if (arc) {
            gsap.to(arc, { strokeDashoffset: len * (1 - val / 100), duration: 1.4, ease: "power3.out" });
          }
          gsap.to(num, {
            v: val, duration: 1.4, ease: "power2.out",
            onUpdate: function () { if (out) out.textContent = Math.round(num.v); }
          });
        }
      });
    });

    $$(".spec-list b[data-fill]").forEach(function (bar) {
      var pct = parseFloat(bar.dataset.fill) || 0;
      var out = bar.parentElement.querySelector("[data-count]");
      var num = { v: 0 };
      ScrollTrigger.create({
        trigger: bar, start: "top 92%", once: true,
        onEnter: function () {
          gsap.to(bar, { "--w": pct + "%", duration: 1.1, ease: "power3.out" });
          gsap.to(num, {
            v: pct, duration: 1.1, ease: "power2.out",
            onUpdate: function () { if (out) out.textContent = Math.round(num.v); }
          });
        }
      });
    });
  }

  /* ==========================================================
     9. PARALLAX — depth in the chamber (scrubbed transforms only)
     ========================================================== */
  function parallax() {
    if ($("#hero")) parallaxHero();
    if (!lite) {
      gsap.to(".fx-floor", {
        yPercent: -18, ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 1 }
      });
    }
    // gears drift as well as spin
    $$("[data-gear]").forEach(function (g, i) {
      gsap.to(g, {
        yPercent: (i % 2 ? -1 : 1) * gsap.utils.random(14, 34), ease: "none",
        scrollTrigger: {
          trigger: g.closest("section") || document.body,
          start: "top bottom", end: "bottom top", scrub: .8
        }
      });
    });
  }

  function parallaxHero() {
    gsap.to(".rotor", {
      yPercent: 18, ease: "none",
      scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: .6 }
    });
    gsap.to(".hero-light", {
      yPercent: 22, opacity: .2, ease: "none",
      scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: .6 }
    });
    gsap.to(".hero-in", {
      yPercent: -10, opacity: .25, ease: "none",
      scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: .5 }
    });
  }

  /* ==========================================================
     10. POINTER — reticle, magnets, holo tilt, sparks
     ========================================================== */
  function pointer() {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    /* --- reticle --- */
    var ret = $(".reticle");
    var read = $("[data-reticle]");
    if (ret) {
      var xTo = gsap.quickTo(ret, "x", { duration: .18, ease: "power3" });
      var yTo = gsap.quickTo(ret, "y", { duration: .18, ease: "power3" });
      gsap.to(".r-ring", { rotation: 360, duration: 9, ease: "none", repeat: -1, transformOrigin: "50% 50%" });

      var shown = false;
      window.addEventListener("pointermove", function (e) {
        if (!shown) {                       // no reticle parked at 0,0
          shown = true;
          gsap.set(ret, { x: e.clientX, y: e.clientY });
          gsap.to(ret, { opacity: 1, duration: .3 });
        }
        xTo(e.clientX); yTo(e.clientY);
        if (read) {
          read.textContent = String(Math.round(e.clientX)).padStart(4, "0") + " : " +
                             String(Math.round(e.clientY)).padStart(4, "0");
        }
      }, { passive: true });

      // target lock over anything interactive
      $$("a, button, input, textarea, .card, .chips li").forEach(function (el) {
        el.addEventListener("mouseenter", function () {
          gsap.to(".r-ring", { scale: 1.9, borderColor: "#b6ff4f", duration: .22, ease: "power2.out" });
        });
        el.addEventListener("mouseleave", function () {
          gsap.to(".r-ring", { scale: 1, borderColor: "#4ff5ff", duration: .22 });
        });
      });
    }

    /* --- magnetic buttons --- */
    $$("[data-magnet]").forEach(function (el) {
      var mx = gsap.quickTo(el, "x", { duration: .35, ease: "power3" });
      var my = gsap.quickTo(el, "y", { duration: .35, ease: "power3" });
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        mx((e.clientX - (r.left + r.width / 2)) * .32);
        my((e.clientY - (r.top + r.height / 2)) * .42);
      });
      el.addEventListener("pointerleave", function () { mx(0); my(0); });
    });

    /* --- holographic card tilt: the sheen strip tracks the pointer, so
           the iridescence shifts with viewing angle like real foil --- */
    $$("[data-tilt]").forEach(function (el) {
      var target = el.querySelector("a") || el;
      var rx = gsap.quickTo(target, "rotationX", { duration: .5, ease: "power3" });
      var ry = gsap.quickTo(target, "rotationY", { duration: .5, ease: "power3" });
      var sheenEl = el.querySelector(".card-sheen, .rcard-sheen");
      var sx = sheenEl ? gsap.quickTo(sheenEl, "--sx", { duration: .4, ease: "power2" }) : null;

      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        gsap.set(target, { transformPerspective: 900, transformOrigin: "50% 50%" });
        ry((px - .5) * 15);
        rx((.5 - py) * 15);
        if (sx) sx(px * 270);
      });
      el.addEventListener("pointerleave", function () {
        rx(0); ry(0);
        if (sx) sx(0);
      });
    });

    /* --- click sparks (Physics2D) --- */
    var COLORS = ["#4ff5ff", "#ff4fd8", "#b6ff4f", "#9d6bff"];
    window.addEventListener("pointerdown", function (e) {
      var n = 12;
      for (var i = 0; i < n; i++) {
        var s = document.createElement("i");
        s.className = "spark";
        s.style.background = COLORS[i % COLORS.length];
        s.style.boxShadow = "0 0 8px " + COLORS[i % COLORS.length];
        document.body.appendChild(s);
        gsap.set(s, { x: e.clientX, y: e.clientY });
        gsap.to(s, {
          duration: gsap.utils.random(.5, 1.0),
          physics2D: {
            velocity: gsap.utils.random(160, 420),
            angle: gsap.utils.random(0, 360),
            gravity: 620
          },
          opacity: 0, scale: gsap.utils.random(.4, 1.4),
          ease: "power1.out",
          onComplete: function () { this.targets()[0].remove(); }
        });
      }
    }, { passive: true });
  }

  /* ==========================================================
     11. TELEMETRY — data rain, HUD, cycling readouts
     ========================================================== */
  function telemetry() {
    var KANA = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    var HEX = "0123456789ABCDEF";
    var rnd = function (set, n) {
      var s = "";
      for (var i = 0; i < n; i++) s += set[Math.floor(Math.random() * set.length)];
      return s;
    };
    function rainLine() {
      var r = Math.random();
      if (r < .2) return "0x" + rnd(HEX, 4) + "  " + rnd(KANA, 3);
      if (r < .38) return rnd(KANA, 5);
      if (r < .54) return ">> " + rnd(HEX, 2) + ":" + rnd(HEX, 2) + ":" + rnd(HEX, 2);
      if (r < .68) return "[ " + (Math.random() < .5 ? "OK " : "ACK") + " ] " + rnd(HEX, 3);
      return rnd(HEX, 8);
    }

    if (!lite) {
      $$("[data-rain]").forEach(function (el, i) {
        var lines = [];
        for (var n = 0; n < 70; n++) lines.push(rainLine());
        el.textContent = lines.join("\n") + "\n" + lines.join("\n");
        gsap.fromTo(el, { yPercent: i ? -50 : 0 }, {
          yPercent: i ? 0 : -50, duration: i ? 34 : 26, ease: "none", repeat: -1
        });
        // occasional re-roll so the stream never reads as a static block
        gsap.timeline({ repeat: -1, repeatDelay: 7 }).call(function () {
          var l2 = [];
          for (var n = 0; n < 70; n++) l2.push(rainLine());
          el.textContent = l2.join("\n") + "\n" + l2.join("\n");
        });
      });
    }

    /* scroll progress + section readout */
    var prog = $("[data-prog]");
    var hs = $("[data-hud-scroll]");
    var hsec = $("[data-hud-sect]");
    ScrollTrigger.create({
      start: 0, end: "max",
      onUpdate: function (self) {
        var p = self.progress;
        if (prog) gsap.set(prog, { scaleX: p, transformOrigin: "0 50%" });
        if (hs) hs.textContent = String(Math.round(p * 100)).padStart(3, "0");
      }
    });
    if (prog) gsap.set(prog, { width: "100%", scaleX: 0, transformOrigin: "0 50%" });

    $$("section[id]").forEach(function (el, i) {
      ScrollTrigger.create({
        trigger: el, start: "top 50%", end: "bottom 50%",
        onToggle: function (self) {
          if (!self.isActive) return;
          if (hsec) hsec.textContent = String(i + 1).padStart(2, "0");
          $$("#nav nav a").forEach(function (a) {
            var h = a.getAttribute("href");
            if (h && h.charAt(0) === "#") {
              a.classList.toggle("is-on", h === "#" + el.id);
            }
          });
        }
      });
    });

    /* readouts that jitter, because live data never sits still */
    $$("[data-jitter]").forEach(function (el) {
      var base = parseFloat(el.dataset.jitter);
      gsap.timeline({ repeat: -1, repeatDelay: 1.6 }).call(function () {
        var v = Math.max(1, Math.round(base + gsap.utils.random(-4, 4)));
        el.innerHTML = String(v).padStart(3, "0") + "&nbsp;ms";
      });
    });

    /* the rider card's STATUS field never settles on one mood */
    var STATUS = ["CAFFEINATED", "LOCKED IN", "KINDA TIRED", "DOWNLOADING...", "COMPILING",
                  "BUFFERING", "IN THE ZONE", "NEEDS SNACKS", "REFACTORING", "DEBUGGING",
                  "AFK / BRB", "OVERCLOCKED", "LOW BATTERY", "SHIPPING IT", "TOUCHING GRASS"];
    $$("[data-status]").forEach(function (el) {
      var cur = el.textContent;
      (function next() {
        gsap.delayedCall(gsap.utils.random(3.5, 6), function () {
          var pick;
          do { pick = STATUS[Math.floor(Math.random() * STATUS.length)]; } while (pick === cur);
          cur = pick;
          if (reduce) { el.textContent = pick; next(); return; }
          gsap.to(el, { duration: .6, scrambleText: { text: pick, chars: SCRAMBLE, speed: .7 }, onComplete: next });
        });
      })();
    });

    $$("[data-cycle]").forEach(function (el) {
      var text = el.textContent;
      gsap.timeline({ repeat: -1, repeatDelay: 5 })
        .to(el, { duration: .5, scrambleText: { text: text, chars: SCRAMBLE, speed: .7 } });
    });

    /* footer year */
    $$("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });

    /* a missing project screenshot falls back to the card gradient
       instead of a broken-image glyph */
    $$(".card-shot img").forEach(function (img) {
      img.addEventListener("error", function () { img.remove(); });
    });

    /* smooth anchor scrolling */
    $$('a[href^="#"]').forEach(function (a) {
      var id = a.getAttribute("href");
      if (id.length < 2 || !$(id)) return;
      a.addEventListener("click", function (e) {
        e.preventDefault();
        gsap.to(window, { duration: 1.1, ease: "power3.inOut", scrollTo: { y: id, offsetY: 0 } });
      });
    });
  }

  /* ==========================================================
     go
     ========================================================== */
  function start() {
    cacheText();
    buildMachine();
    if (!lite) sheen();
    hero();
    titles();
    panels();
    instruments();
    parallax();
    pointer();
    telemetry();
    if (!reduce) glitch();
    ScrollTrigger.refresh();
    watchdog();
    root.classList.add("is-ready");
  }

  /* ==========================================================
     12. WATCHDOG
     gsap.from() + ScrollTrigger renders the "from" state immediately,
     so anything whose trigger never fires stays at opacity 0 forever.
     That is a content-invisible failure, not a cosmetic one — worth
     insuring against. Five seconds in, force-reveal any reveal target
     that is still effectively transparent.
     ========================================================== */
  function watchdog() {
    // Only sweep what SHOULD already have fired: an element still below the
    // fold is legitimately waiting its turn, and force-revealing it would
    // silently kill its entrance animation. Re-arm after scrolling so the
    // net still covers the rest of the page.
    var SEL = "[data-panel], .card, .chips li, .factlist li, .sheet tr, .sec-tag, .sec-sub, .head-link";
    function sweep() {
      var stuck = $$(SEL).filter(function (el) {
        if (parseFloat(getComputedStyle(el).opacity) >= 0.05) return false;
        return el.getBoundingClientRect().top < window.innerHeight * 0.95;
      });
      if (!stuck.length) return;
      console.warn("[rotor] watchdog revealed " + stuck.length + " stuck element(s)");
      gsap.set(stuck, { clearProps: "opacity,transform" });
      gsap.to(stuck, { opacity: 1, duration: .3 });
    }
    gsap.delayedCall(5, sweep);
    var t;
    window.addEventListener("scroll", function () {
      clearTimeout(t);
      t = setTimeout(sweep, 900);
    }, { passive: true });
  }

  /* ==========================================================
     BOOTSTRAP

     Everything waits on document.fonts.ready. Two things break if it
     doesn't: SplitText measures glyph boxes with the fallback face and
     re-wraps when the real one lands, and — worse — ScrollTrigger
     records every start/end position against a layout that is about to
     shift, so reveals further down the page never fire and their
     panels stay at opacity 0. A 2s cap keeps a slow font CDN from
     holding the whole page hostage.
     ========================================================== */
  function whenReady(fn) {
    var done = false;
    var go = function () { if (!done) { done = true; fn(); } };
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(go);
      setTimeout(go, 2000);
    } else {
      setTimeout(go, 0);
    }
  }

  whenReady(function () {
    if (reduce) {
      // no theatre: land everything in its final state
      gsap.set("[data-panel], .card, .hero-in > *", { clearProps: "all" });
      boot(function () {
        cacheText();
        buildMachine();
        instruments();
        telemetry();
        titles();
        root.classList.add("is-ready");
      });
    } else {
      boot(start);
    }
    // late-loading images (project shots) change section heights
    window.addEventListener("load", function () { ScrollTrigger.refresh(); });
  });
})();
