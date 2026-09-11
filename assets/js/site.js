/* ============================================================
   MILESKING.DEV — motion (Air Gear / Holo theme)
   GSAP 3.13 + ScrollTrigger, SplitText, ScrambleText, Physics2D, Observer.

   Two ideas drive almost everything here:

   1. SCROLL IS THE CRANK. Nothing is scrubbed to a scroll position;
      instead every rotating thing (gears, tape, logo) runs a free
      idle spin whose *timeScale* is driven by scroll velocity. Scroll
      down and the machine spools up; scroll up and it runs backwards;
      stop and it coasts back to idle. A gear train that only moves
      while you scroll feels dead — this feels driven.

   2. THE PROJECTION IS UNSTABLE. Holograms flicker, slip out of
      register and re-scan. The chromatic aberration offsets, the
      wire twin, the sheen sweeps and the scramble decodes are all
      the same idea at different scales.

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
        duration: .9, scrambleText: { text: "MK-AT-2026 :: WING DRIVE CORE", chars: SCRAMBLE, speed: .5 }
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
      // handshake resolves, then the chamber floods
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
     2. THE MACHINE — idle spin whose speed follows scroll velocity
     ========================================================== */
  var drives = [];   // every tween whose timeScale scroll should drive

  function buildMachine() {
    $$("[data-gear]").forEach(function (g) {
      var svg = g.querySelector("svg");
      var dur = parseFloat(g.dataset.dur) || 24;
      var dir = g.dataset.rev ? -360 : 360;
      drives.push(gsap.to(svg, {
        rotation: dir, duration: dur, ease: "none", repeat: -1,
        transformOrigin: "50% 50%"
      }));
    });

    // the chrome gears in the nav / section tags / footer join the train
    $$(".logo-wheel svg, .tag-gear svg, .foot-gear svg, .hud-gear svg").forEach(function (svg, i) {
      drives.push(gsap.to(svg, {
        rotation: i % 2 ? -360 : 360, duration: 10 + i * 2, ease: "none",
        repeat: -1, transformOrigin: "50% 50%"
      }));
    });

    // every tape is part of the same drivetrain
    $$("[data-tape]").forEach(function (tape) {
      drives.push(gsap.to(tape, { xPercent: -50, duration: 24, ease: "none", repeat: -1 }));
    });

    // Scroll velocity drives the whole train. One shared timeScale,
    // lerped on the ticker — spawning a tween per gear per scroll tick
    // was ~15 overlapping tweens a frame for no visible gain.
    var targetTS = 1, curTS = 1, lastScroll = 0;
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
      curTS += (targetTS - curTS) * 0.09;
      if (Math.abs(curTS) < 0.02) curTS = 0.02;
      for (var i = 0; i < drives.length; i++) drives[i].timeScale(curTS);
      if (rpm) rpm.textContent = String(Math.min(9999, Math.round(Math.abs(curTS) * 620))).padStart(4, "0");
    });
  }

  /* ==========================================================
     3. HERO — the projection powers on
     ========================================================== */
  function hero() {
    if (!$("#hero")) return;
    var name = $(".hero-name span[data-split]");
    var tl = gsap.timeline({ delay: .1 });

    if (name) {
      var split = new SplitText(name, { type: "chars", charsClass: "char" });
      // Once split, the chars are inline-block. `background-clip:text` on
      // the parent cannot clip to text inside inline-block descendants, so
      // it paints a solid rectangle over the first glyph instead. Each
      // .char carries its own gradient now, so drop the parent's.
      name.classList.add("is-split");
      tl.from(split.chars, {
        opacity: 0, yPercent: 60, rotateX: -80, scale: .8,
        transformOrigin: "50% 100% -30px",
        stagger: { each: .035, from: "start" },
        duration: .7, ease: "back.out(1.8)"
      }, 0);
    }

    tl.from(".hero-kicker .tag", { opacity: 0, y: 14, stagger: .07, duration: .5, ease: "power2.out" }, .15)
      .from(".hero-kana", { opacity: 0, y: 12, duration: .5 }, .5)
      .from(".hero-lede", { opacity: 0, y: 14, duration: .55 }, .6)
      .from(".hero-cta .btn", { opacity: 0, y: 16, stagger: .09, duration: .5, ease: "back.out(1.5)" }, .7)
      .from(".emblem", { opacity: 0, scale: .9, rotate: -16, duration: 1.2, ease: "expo.out" }, .1)
      .from(".stk", { opacity: 0, scale: .6, rotate: 0, stagger: .08, duration: .5, ease: "back.out(2)" }, .8)
      .from(".bp-stamp, .bp-cross, .bp-call, .bp-dim", { opacity: 0, stagger: .04, duration: .4 }, .9)
      .from(".cone", { opacity: 0, duration: 1.4 }, 0);

    // the kicker tags resolve out of noise
    $$(".hero-kicker .tag").forEach(function (t, i) {
      tl.to(t, {
        duration: .6,
        scrambleText: { text: t.dataset.final || t.textContent, chars: SCRAMBLE, speed: .8 }
      }, .25 + i * .09);
    });

    // the emblem's holo twin drifts out of register, forever
    gsap.to(".em-wire", {
      x: "+=9", y: "-=6", duration: 3.2, ease: "sine.inOut",
      repeat: -1, yoyo: true
    });
    gsap.to(".em-wire", { opacity: .22, duration: .09, repeat: -1, repeatDelay: 2.6, yoyo: true });

    // scan bar sweeping the emblem
    gsap.fromTo(".em-scan", { top: "-18%" }, {
      top: "100%", duration: 3.6, ease: "none", repeat: -1, repeatDelay: 1.1
    });

    // the whole emblem breathes
    gsap.to(".emblem", { y: -18, duration: 6, ease: "sine.inOut", repeat: -1, yoyo: true });
  }

  /* ==========================================================
     4. GLITCH — the projection loses lock now and then
     ========================================================== */
  function glitch() {
    var name = $(".hero-name");
    if (!name) return;

    function burst() {
      var tl = gsap.timeline({
        onComplete: function () { gsap.delayedCall(gsap.utils.random(3.5, 8), burst); }
      });
      var n = gsap.utils.random(2, 4, 1);
      for (var i = 0; i < n; i++) {
        tl.set(name, {
          x: gsap.utils.random(-7, 7),
          skewX: gsap.utils.random(-9, 9),
          opacity: gsap.utils.random(.72, 1)
        }, i * .055);
      }
      tl.set(name, { x: 0, skewX: 0, opacity: 1 }, n * .055);
    }
    gsap.delayedCall(2.4, burst);

    // the whole chamber flickers occasionally
    function flicker() {
      gsap.timeline({ onComplete: function () { gsap.delayedCall(gsap.utils.random(6, 14), flicker); } })
        .to(".fx-chamber", { opacity: .55, duration: .05 })
        .to(".fx-chamber", { opacity: 1, duration: .05 })
        .to(".fx-chamber", { opacity: .7, duration: .04 })
        .to(".fx-chamber", { opacity: 1, duration: .12 });
    }
    gsap.delayedCall(5, flicker);
  }

  /* ==========================================================
     5. IRIDESCENT SHEEN — sweeps across every projected surface
     ========================================================== */
  function sheen() {
    // A pseudo-element can't be tweened directly, so each rule reads a
    // registered --sx custom property and GSAP sweeps that instead.
    $$(".glass, .stk, .btn").forEach(function (el, i) {
      gsap.fromTo(el,
        { "--sx": "130%" },
        {
          "--sx": "-70%", duration: 3.2, ease: "power2.inOut",
          repeat: -1, repeatDelay: gsap.utils.random(2.6, 6.5), delay: i * .28
        });
    });
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
          gsap.fromTo(el, { "--ab": 18 }, { "--ab": 5, duration: .8, ease: "power3.out" });
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
    var SWEEP = 250;   // degrees between scale min and max, matches _build-holo.py

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
     9. PARALLAX — depth in the chamber
     ========================================================== */
  function parallax() {
    if ($("#hero")) parallaxHero();
    gsap.to(".fx-floor", {
      yPercent: -18, ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 1 }
    });
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
    gsap.to(".emblem", {
      yPercent: 16, ease: "none",
      scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: .6 }
    });
    gsap.to(".cone", {
      yPercent: 22, opacity: .2, ease: "none",
      scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: .6 }
    });
    gsap.to(".hero-in", {
      yPercent: -12, opacity: .25, ease: "none",
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

    /* --- holographic card tilt: the sheen tracks the pointer, so the
           iridescence shifts with viewing angle like real foil --- */
    $$("[data-tilt]").forEach(function (el) {
      var target = el.querySelector("a") || el;
      var rx = gsap.quickTo(target, "rotationX", { duration: .5, ease: "power3" });
      var ry = gsap.quickTo(target, "rotationY", { duration: .5, ease: "power3" });
      var sheenEl = el.querySelector(".card-sheen, .rcard-sheen");

      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        gsap.set(target, { transformPerspective: 900, transformOrigin: "50% 50%" });
        ry((px - .5) * 15);
        rx((.5 - py) * 15);
        if (sheenEl) gsap.to(sheenEl, { backgroundPositionX: (140 - px * 190) + "%", duration: .4 });
      });
      el.addEventListener("pointerleave", function () {
        rx(0); ry(0);
        if (sheenEl) gsap.to(sheenEl, { backgroundPositionX: "130%", duration: .7 });
      });
    });

    /* --- click sparks (Physics2D) --- */
    var COLORS = ["#4ff5ff", "#ff4fd8", "#b6ff4f", "#9d6bff"];
    window.addEventListener("pointerdown", function (e) {
      var n = 14;
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

    $$("[data-rain]").forEach(function (el, i) {
      var lines = [];
      for (var n = 0; n < 70; n++) lines.push(rainLine());
      el.textContent = lines.join("\n") + "\n" + lines.join("\n");
      gsap.fromTo(el, { yPercent: i ? -50 : 0 }, {
        yPercent: i ? 0 : -50, duration: i ? 34 : 26, ease: "none", repeat: -1
      });
      // occasional re-roll so the stream never reads as a static block
      gsap.timeline({ repeat: -1, repeatDelay: 2.2 }).call(function () {
        var l2 = [];
        for (var n = 0; n < 70; n++) l2.push(rainLine());
        el.textContent = l2.join("\n") + "\n" + l2.join("\n");
      });
    });

    /* scroll progress + section readout */
    var prog = $("[data-prog]");
    var hs = $("[data-hud-scroll]");
    var hsec = $("[data-hud-sect]");
    ScrollTrigger.create({
      start: 0, end: "max",
      onUpdate: function (self) {
        var p = self.progress;
        if (prog) gsap.set(prog, { width: (p * 100).toFixed(2) + "%" });
        if (hs) hs.textContent = String(Math.round(p * 100)).padStart(3, "0");
      }
    });
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
       instead of a broken-image glyph (7-3 has no shot yet) */
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
    sheen();
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
      console.warn("[holo] watchdog revealed " + stuck.length + " stuck element(s)");
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
