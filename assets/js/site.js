/* ============================================================
   MILESKING.DEV — interactions & animation (GSAP)
   ============================================================ */
(function () {
  "use strict";

  gsap.registerPlugin(
    ScrollTrigger,
    ScrollToPlugin,
    SplitText,
    ScrambleTextPlugin,
    CustomEase,
    Physics2DPlugin
  );

  var RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var GLYPHS = "▓▒░<>/\\_■□01#*+=";
  var NEON = ["#ff2ec4", "#00f0ff", "#9b5cff", "#ffb86b", "#4dff9d"];

  CustomEase.create("boing", "M0,0 C0.2,0 0.25,1.2 0.5,1.05 0.7,0.95 0.8,1 1,1");

  /* ============================================================
     Boot sequence
     ============================================================ */
  var bootEl = document.getElementById("boot");
  var booted = false;

  function endBoot(instant) {
    if (booted || !bootEl) return;
    booted = true;
    try {
      sessionStorage.setItem("mkBooted", "1");
    } catch (e) {}
    document.body.classList.remove("is-booting");

    if (instant) {
      bootEl.remove();
      playHeroIntro(0.15);
      return;
    }

    var tl = gsap.timeline({
      onComplete: function () {
        bootEl.remove();
      }
    });
    tl.to(bootEl, { duration: 0.06, backgroundColor: "#ff2ec4" })
      .to(bootEl, { duration: 0.06, backgroundColor: "#00f0ff" })
      .to(bootEl, { duration: 0.05, backgroundColor: "#05010e" })
      .to(bootEl, {
        duration: 0.4,
        opacity: 0,
        scale: 1.06,
        filter: "blur(6px)",
        ease: "power2.in"
      });
    playHeroIntro(0.35);
  }

  function runBoot() {
    var skip = false;
    try {
      skip = !!sessionStorage.getItem("mkBooted");
    } catch (e) {}

    if (RM || skip || !bootEl) {
      endBoot(true);
      return;
    }

    var linesWrap = bootEl.querySelector(".boot-lines");
    var caret = bootEl.querySelector(".boot-caret");
    gsap.to(caret, { opacity: 0, repeat: -1, yoyo: true, duration: 0.4, ease: "steps(1)" });

    var LINES = [
      ["MILESKING.DEV BIOS v2.0.26", ""],
      ["(c) 1997–2026 MK SYSTEMS", ""],
      ["> init neon_drivers.sys ....... OK", "ok"],
      ["> load vaporwave.dll .......... OK", "ok"],
      ["> mount /dev/creativity ....... OK", "ok"],
      ["> inject gsap.exe ............. OK", "ok"],
      ["> boot sequence complete_", "warn"]
    ];

    var tl = gsap.timeline({
      delay: 0.2,
      onComplete: function () {
        gsap.delayedCall(0.4, endBoot);
      }
    });

    LINES.forEach(function (line) {
      var p = document.createElement("p");
      if (line[1]) p.className = line[1];
      linesWrap.appendChild(p);
      tl.to(p, {
        duration: Math.min(0.3, 0.05 + line[0].length * 0.008),
        scrambleText: { text: line[0], chars: "01<>/\\", speed: 2 },
        ease: "none"
      });
    });

    bootEl.addEventListener("pointerdown", function () {
      tl.kill();
      endBoot();
    });
  }

  /* ============================================================
     Click burst
     ============================================================ */
  function burst(x, y, count, power) {
    if (RM) return;
    count = count || 14;
    power = power || 1;
    for (var i = 0; i < count; i++) {
      var b = document.createElement("span");
      b.className = "burst-bit";
      b.style.background = NEON[(Math.random() * NEON.length) | 0];
      b.style.color = b.style.background;
      document.body.appendChild(b);
      gsap.set(b, { x: x, y: y, rotation: Math.random() * 360, scale: 0.6 + Math.random() * 0.8 });
      gsap.to(b, {
        duration: 0.6 + Math.random() * 0.5,
        physics2D: {
          velocity: (140 + Math.random() * 260) * power,
          angle: (360 / count) * i + Math.random() * 24,
          gravity: 640
        },
        scale: 0,
        opacity: 0.85,
        ease: "none",
        onComplete: function () {
          this.targets()[0].remove();
        }
      });
    }
  }

  document.addEventListener("pointerdown", function (e) {
    if (e.target.closest("#boot")) return;
    burst(e.clientX, e.clientY, 12, 0.85);
  });

  /* ============================================================
     Custom cursor
     ============================================================ */
  function initCursor() {
    if (RM) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    document.body.classList.add("has-cursor");

    var dotX = gsap.quickTo(".cursor-dot", "x", { duration: 0.06, ease: "power2.out" });
    var dotY = gsap.quickTo(".cursor-dot", "y", { duration: 0.06, ease: "power2.out" });
    var ringX = gsap.quickTo(".cursor-ring", "x", { duration: 0.32, ease: "power3.out" });
    var ringY = gsap.quickTo(".cursor-ring", "y", { duration: 0.32, ease: "power3.out" });

    window.addEventListener("pointermove", function (e) {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    });

    var HOVERABLE = "a, button, input, textarea, label, .chip";
    document.addEventListener("mouseover", function (e) {
      if (e.target.closest(HOVERABLE)) {
        gsap.to(".cursor-ring", { scale: 1.7, borderColor: "#ff2ec4", duration: 0.25 });
      }
    });
    document.addEventListener("mouseout", function (e) {
      if (e.target.closest(HOVERABLE)) {
        gsap.to(".cursor-ring", { scale: 1, borderColor: "#00f0ff", duration: 0.25 });
      }
    });
    document.addEventListener("pointerdown", function () {
      gsap.to(".cursor-ring", { scale: 0.7, duration: 0.1 });
    });
    document.addEventListener("pointerup", function () {
      gsap.to(".cursor-ring", { scale: 1, duration: 0.3, ease: "boing" });
    });
  }

  /* ============================================================
     Stars
     ============================================================ */
  function initStars() {
    var wrap = document.querySelector(".stars");
    if (!wrap) return;
    var n = 80;
    for (var i = 0; i < n; i++) {
      var s = document.createElement("span");
      s.className = "star";
      s.style.left = Math.random() * 100 + "%";
      s.style.top = Math.random() * 100 + "%";
      var sc = 0.5 + Math.random() * 1.2;
      s.style.transform = "scale(" + sc + ")";
      wrap.appendChild(s);
      if (!RM && Math.random() > 0.35) {
        gsap.to(s, {
          opacity: 0.15 + Math.random() * 0.4,
          duration: 0.8 + Math.random() * 2.2,
          repeat: -1,
          yoyo: true,
          delay: Math.random() * 3,
          ease: "sine.inOut"
        });
      }
    }
  }

  /* ============================================================
     Hero
     ============================================================ */
  var heroReady = false;
  var heroIntroDone = false;

  function setHeroInitial() {
    if (RM) return;
    gsap.set([".hero-pre", ".hero-kana", ".hero-sub", ".hero-cta .btn", ".scroll-cue"], {
      opacity: 0
    });
    gsap.set(".hero-name", { opacity: 0, scale: 0.94 });
    gsap.set(".shape", { opacity: 0 });
    heroReady = true;
  }

  function playHeroIntro(delay) {
    if (RM || heroIntroDone || !heroReady) return;
    heroIntroDone = true;

    var nameEl = document.querySelector(".hero-name");
    var tl = gsap.timeline({ delay: delay || 0 });

    tl.to(".hero-pre", {
      opacity: 1,
      duration: 0.5,
      scrambleText: { text: "// INCOMING TRANSMISSION_", chars: "01<>/", speed: 1.5 }
    })
      .to(
        ".hero-name",
        {
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
          scrambleText: { text: "MILES KING", chars: GLYPHS, speed: 0.8 },
          onComplete: function () {
            nameEl.classList.add("glitch-on");
          }
        },
        "-=0.1"
      )
      .to(".hero-kana", { opacity: 1, duration: 0.5, y: 0 }, "-=0.35")
      .to(".hero-sub", { opacity: 1, duration: 0.55 }, "-=0.2")
      .to(
        ".hero-cta .btn",
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: "boing" },
        "-=0.25"
      )
      .to(".scroll-cue", { opacity: 1, duration: 0.6 }, "-=0.1")
      .to(".shape", { opacity: 0.75, duration: 0.8, stagger: 0.1 }, "-=0.8");

    /* ambient loops */
    gsap.to(".scroll-cue-arrow", {
      y: 6,
      repeat: -1,
      yoyo: true,
      duration: 0.55,
      ease: "sine.inOut"
    });
    gsap.to(".gridfloor", {
      backgroundPosition: "0px 0px, 0px 52px",
      duration: 1.6,
      repeat: -1,
      ease: "none"
    });
    document.querySelectorAll(".shape").forEach(function (sh, i) {
      gsap.to(sh, {
        y: (i % 2 ? -1 : 1) * (14 + Math.random() * 14),
        rotation: i % 2 ? 8 : -8,
        duration: 2.4 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });
  }

  function initHeroParallax() {
    if (RM) return;
    var hero = document.getElementById("intro");
    if (!hero) return;

    var qName = gsap.quickTo(".hero-content", "x", { duration: 0.6, ease: "power3.out" });
    var qNameY = gsap.quickTo(".hero-content", "y", { duration: 0.6, ease: "power3.out" });
    var qSun = gsap.quickTo(".sun", "x", { duration: 0.9, ease: "power3.out" });
    var shapes = gsap.utils.toArray(".shape");
    var qShapes = shapes.map(function (sh) {
      return {
        x: gsap.quickTo(sh, "x", { duration: 1.1, ease: "power3.out" }),
        y: gsap.quickTo(sh, "y", { duration: 1.1, ease: "power3.out" })
      };
    });

    hero.addEventListener("pointermove", function (e) {
      var nx = (e.clientX / window.innerWidth - 0.5) * 2;
      var ny = (e.clientY / window.innerHeight - 0.5) * 2;
      qName(nx * -12);
      qNameY(ny * -8);
      qSun(nx * -22);
      qShapes.forEach(function (q, i) {
        var depth = 14 + i * 10;
        q.x(nx * depth);
        q.y(ny * depth * 0.6);
      });
    });

    /* scroll-out parallax */
    gsap.to(".hero-content", {
      yPercent: -36,
      opacity: 0,
      ease: "none",
      scrollTrigger: { trigger: "#intro", start: "top top", end: "72% top", scrub: true }
    });
    gsap.to(".sun", {
      yPercent: 34,
      ease: "none",
      scrollTrigger: { trigger: "#intro", start: "top top", end: "bottom top", scrub: true }
    });
  }

  /* ============================================================
     Nav
     ============================================================ */
  function initNav() {
    var nav = document.getElementById("nav");

    function syncNavBg() {
      nav.classList.toggle("is-scrolled", window.scrollY > 60);
    }
    window.addEventListener("scroll", syncNavBg, { passive: true });
    syncNavBg();

    /* scroll progress bar */
    var bar = document.createElement("div");
    bar.className = "scroll-progress";
    nav.appendChild(bar);
    gsap.to(bar, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 0.3 }
    });

    /* smooth scroll */
    document.querySelectorAll("[data-scroll]").forEach(function (link) {
      link.addEventListener("click", function (e) {
        var id = link.getAttribute("href");
        if (!id || id.charAt(0) !== "#") return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        gsap.to(window, {
          scrollTo: { y: target, autoKill: true },
          duration: RM ? 0 : 1.05,
          ease: "power3.inOut"
        });
        if (!RM) {
          gsap.fromTo(
            target,
            { skewX: 0.6, opacity: 0.85 },
            { skewX: 0, opacity: 1, duration: 0.5, delay: 0.9, ease: "power2.out" }
          );
        }
      });
    });

    /* active section tracking */
    ["intro", "stack", "operator", "work", "contact"].forEach(function (id) {
      var sec = document.getElementById(id);
      var link = document.querySelector('[data-nav][href="#' + id + '"]');
      if (!sec || !link) return;
      ScrollTrigger.create({
        trigger: sec,
        start: "top 55%",
        end: "bottom 45%",
        onToggle: function (self) {
          link.classList.toggle("is-active", self.isActive);
        }
      });
    });
  }

  /* ============================================================
     Marquees
     ============================================================ */
  function initMarquees() {
    document.querySelectorAll(".marquee").forEach(function (mq, idx) {
      var track = mq.querySelector(".marquee-track");
      var chunk = mq.querySelector(".marquee-chunk");
      if (!track || !chunk) return;

      while (track.scrollWidth < window.innerWidth * 1.6) {
        track.appendChild(chunk.cloneNode(true));
      }
      Array.prototype.slice.call(track.children).forEach(function (c) {
        track.appendChild(c.cloneNode(true));
      });

      if (RM) return;
      var dir = idx % 2 === 0 ? -50 : 0;
      var tween = gsap.fromTo(
        track,
        { xPercent: idx % 2 === 0 ? 0 : -50 },
        {
          xPercent: dir === -50 ? -50 : 0,
          duration: 26,
          repeat: -1,
          ease: "none"
        }
      );
      mq.addEventListener("pointerenter", function () {
        gsap.to(tween, { timeScale: 0.22, duration: 0.5 });
      });
      mq.addEventListener("pointerleave", function () {
        gsap.to(tween, { timeScale: 1, duration: 0.5 });
      });
    });
  }

  /* ============================================================
     Section titles
     ============================================================ */
  function initTitles() {
    document.querySelectorAll("[data-title]").forEach(function (el) {
      var split = new SplitText(el, { type: "words,chars", charsClass: "char" });
      el.classList.add("split");
      if (RM) return;
      gsap.from(split.chars, {
        scrollTrigger: { trigger: el, start: "top 84%" },
        y: 42,
        opacity: 0,
        skewX: -14,
        duration: 0.65,
        stagger: 0.035,
        ease: "power3.out"
      });
    });

    if (!RM) {
      gsap.utils.toArray(".section-tag").forEach(function (el) {
        var txt = el.childNodes[0] && el.childNodes[0].nodeValue
          ? el.childNodes[0].nodeValue.trim()
          : "";
        if (!txt) return;
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter: function () {
            var span = document.createElement("span");
            gsap.to(span, {
              duration: 0.7,
              scrambleText: { text: txt, chars: "01<>/", speed: 1.4 },
              onUpdate: function () {
                el.childNodes[0].nodeValue = span.textContent + " ";
              }
            });
          }
        });
      });
    }
  }

  /* ============================================================
     Terminal (what i do)
     ============================================================ */
  function initTerminal() {
    var term = document.getElementById("terminal-body");
    if (!term) return;
    var cmds = term.querySelectorAll(".tcmd");
    var outs = term.querySelectorAll("[data-out]");
    var caret = term.querySelector(".tcaret");

    if (RM) {
      cmds.forEach(function (c) {
        c.textContent = c.getAttribute("data-type");
      });
      return;
    }

    gsap.set(outs, { opacity: 0 });
    gsap.to(caret, { opacity: 0, repeat: -1, yoyo: true, duration: 0.45, ease: "steps(1)" });

    ScrollTrigger.create({
      trigger: term,
      start: "top 78%",
      once: true,
      onEnter: function () {
        var tl = gsap.timeline();
        cmds.forEach(function (cmd, i) {
          var text = cmd.getAttribute("data-type");
          tl.to(cmd, {
            duration: 0.28 + text.length * 0.014,
            scrambleText: { text: text, chars: "01_", speed: 1.6 },
            ease: "none"
          });
          if (outs[i]) {
            tl.fromTo(
              outs[i],
              { opacity: 0, x: -8 },
              { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" },
              "+=0.12"
            );
          }
          tl.to({}, { duration: 0.18 });
        });
      }
    });
  }

  /* ============================================================
     Chips
     ============================================================ */
  function initChips() {
    var chips = gsap.utils.toArray(".chip");
    if (!chips.length) return;

    if (!RM) {
      gsap.utils.toArray(".chips").forEach(function (list) {
        gsap.from(list.querySelectorAll(".chip"), {
          scrollTrigger: { trigger: list, start: "top 88%" },
          y: 22,
          opacity: 0,
          scale: 0.7,
          rotation: function () {
            return gsap.utils.random(-8, 8);
          },
          duration: 0.55,
          stagger: 0.05,
          ease: "boing"
        });
      });
    }

    chips.forEach(function (chip) {
      var original = chip.textContent;
      chip.addEventListener("mouseenter", function () {
        if (RM) return;
        gsap.to(chip, {
          duration: 0.4,
          scrambleText: { text: original, chars: GLYPHS, speed: 1.2 }
        });
        gsap.fromTo(chip, { y: 0 }, { y: -4, duration: 0.18, yoyo: true, repeat: 1 });
      });
    });
  }

  /* ============================================================
     Operator status — cycles through cheerfully meaningless states
     ============================================================ */
  var STATUSES = [
    "CAFFEINATED",
    "BUFFERING VIBES",
    "87% HYDRATED",
    "AWAITING ORDERS",
    "TOUCHING GRASS (BETA)",
    "SEMI-COLON OPTIONAL",
    "PROBABLY DEBUGGING",
    "SNACK-DRIVEN DEV",
    "MOSTLY OPERATIONAL",
    "REFACTORING BREAKFAST"
  ];

  function initStatusCycle() {
    var el = document.querySelector("[data-status]");
    if (!el) return;

    /* random starting point so it isn't the same line on every load */
    var i = Math.floor(Math.random() * STATUSES.length);
    el.textContent = STATUSES[i];
    if (RM || STATUSES.length < 2) return;

    function next() {
      i = (i + 1) % STATUSES.length;
      gsap.to(el, {
        duration: 0.55,
        scrambleText: { text: STATUSES[i], chars: GLYPHS, speed: 1.1 }
      });
    }
    setInterval(next, 4200);
  }

  /* ============================================================
     Tilt cards
     ============================================================ */
  function initTilt() {
    if (RM) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    gsap.utils.toArray(".tilt-card").forEach(function (card) {
      var qx = gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power3.out" });
      var qy = gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "power3.out" });
      gsap.set(card, { transformPerspective: 750 });

      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        var nx = (e.clientX - r.left) / r.width - 0.5;
        var ny = (e.clientY - r.top) / r.height - 0.5;
        qx(ny * -7);
        qy(nx * 9);
      });
      card.addEventListener("pointerleave", function () {
        qx(0);
        qy(0);
      });
    });

    /* holo sheen sweep on the id card */
    var sheen = document.querySelector(".idcard-sheen");
    var idcard = document.getElementById("idcard");
    if (sheen && idcard) {
      idcard.addEventListener("pointerenter", function () {
        gsap.fromTo(
          sheen,
          { x: 0, xPercent: -70 },
          { xPercent: 70, duration: 0.9, ease: "power2.inOut" }
        );
      });
    }
  }

  /* ============================================================
     Sections & work cards entrances
     ============================================================ */
  function initReveals() {
    if (RM) return;

    /* terminal + stack copy */
    gsap.from(".terminal", {
      scrollTrigger: { trigger: "#stack", start: "top 74%" },
      x: -70,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    });
    gsap.from([".stack-lede", ".stack-copy .btn-ghost"], {
      scrollTrigger: { trigger: "#stack", start: "top 74%" },
      x: 50,
      opacity: 0,
      duration: 0.7,
      stagger: 0.15,
      ease: "power3.out"
    });

    /* operator */
    gsap.from("#idcard", {
      scrollTrigger: { trigger: "#operator", start: "top 72%" },
      rotationY: -50,
      opacity: 0,
      transformPerspective: 900,
      duration: 0.9,
      ease: "power3.out"
    });
    gsap.from(".operator-copy > *", {
      scrollTrigger: { trigger: "#operator", start: "top 72%" },
      y: 34,
      opacity: 0,
      duration: 0.7,
      stagger: 0.14,
      ease: "power3.out"
    });

    /* work cards — alternate slide-in with clip reveal */
    gsap.utils.toArray(".project").forEach(function (card, i) {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: "top 86%" },
        x: i % 2 === 0 ? -80 : 80,
        opacity: 0,
        clipPath: "inset(0 " + (i % 2 === 0 ? "100% 0 0" : "0 0 100%") + ")",
        duration: 0.85,
        ease: "power3.out",
        clearProps: "clipPath"
      });
    });

    /* contact */
    gsap.from(".contact-form .field", {
      scrollTrigger: { trigger: "#contact", start: "top 70%" },
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.12,
      ease: "power3.out"
    });
    gsap.from(".btn-send", {
      scrollTrigger: { trigger: "#contact", start: "top 60%" },
      scale: 0.7,
      opacity: 0,
      duration: 0.6,
      ease: "boing"
    });

    /* footer */
    gsap.from(".social li", {
      scrollTrigger: { trigger: "#footer", start: "top 92%" },
      y: 26,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: "boing"
    });
  }

  /* ============================================================
     Work card hover glitch
     ============================================================ */
  function initProjectGlitch() {
    gsap.utils.toArray(".project").forEach(function (card) {
      var img = card.querySelector(".project-screen img");
      var glitch = card.querySelector(".project-glitch");
      if (!img || !glitch) return;

      function arm() {
        glitch.style.backgroundImage = "url('" + (img.currentSrc || img.src) + "')";
      }
      if (img.complete) arm();
      else img.addEventListener("load", arm);

      if (RM) return;

      var glitchTween = null;
      card.addEventListener("pointerenter", function () {
        if (glitchTween) glitchTween.kill();
        glitchTween = gsap.timeline({ repeat: 2 });
        glitchTween
          .set(glitch, { opacity: 0.55, filter: "hue-rotate(90deg) saturate(2)" })
          .set(glitch, { clipPath: "inset(8% 0 78% 0)", x: -8 })
          .set(glitch, { clipPath: "inset(62% 0 12% 0)", x: 9 }, "+=0.05")
          .set(glitch, { clipPath: "inset(34% 0 44% 0)", x: -5 }, "+=0.05")
          .set(glitch, { opacity: 0, x: 0 }, "+=0.05");
      });
      card.addEventListener("pointerleave", function () {
        if (glitchTween) glitchTween.kill();
        gsap.set(glitch, { opacity: 0, x: 0 });
      });
    });
  }

  /* ============================================================
     Contact form
     ============================================================ */
  function initForm() {
    var form = document.querySelector(".contact-form");
    if (!form) return;
    var btn = form.querySelector(".btn-send");
    var label = btn.querySelector(".btn-label");
    var DEFAULT = "TRANSMIT ▶";

    form.addEventListener("submit", function (e) {
      if (!window.fetch) return; /* old browsers: native post */
      e.preventDefault();
      btn.disabled = true;

      gsap.to(label, {
        duration: 0.5,
        scrambleText: { text: "TRANSMITTING...", chars: "01<>/", speed: 1.4 }
      });

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (res) {
          if (!res.ok) throw new Error("send failed");
          form.reset();
          var r = btn.getBoundingClientRect();
          burst(r.left + r.width / 2, r.top + r.height / 2, 26, 1.4);
          gsap.to(label, {
            duration: 0.5,
            scrambleText: { text: "TRANSMISSION SENT ✔", chars: "01", speed: 1.4 }
          });
          gsap.delayedCall(4, function () {
            btn.disabled = false;
            gsap.to(label, { duration: 0.4, scrambleText: { text: DEFAULT, chars: "01" } });
          });
        })
        .catch(function () {
          gsap.to(label, {
            duration: 0.4,
            scrambleText: { text: "ERROR — RETRY?", chars: "!#?", speed: 1.4 }
          });
          gsap.delayedCall(2.5, function () {
            btn.disabled = false;
            gsap.to(label, { duration: 0.4, scrambleText: { text: DEFAULT, chars: "01" } });
          });
        });
    });
  }

  /* ============================================================
     Logo hover scramble
     ============================================================ */
  function initLogo() {
    if (RM) return;
    var ext = document.querySelector(".logo-ext");
    if (!ext) return;
    document.querySelector(".logo").addEventListener("pointerenter", function () {
      gsap.to(ext, {
        duration: 0.5,
        scrambleText: { text: ".exe", chars: "01<>/#", speed: 1.2 }
      });
    });
  }

  /* ============================================================
     Ambient glitch jolts
     ============================================================ */
  function initAmbient() {
    if (RM) return;
    var targets = [".hero-kana", ".section-title", ".logo", ".project-num"];

    function jolt() {
      var sel = targets[(Math.random() * targets.length) | 0];
      var els = gsap.utils.toArray(sel);
      if (els.length) {
        var el = els[(Math.random() * els.length) | 0];
        gsap.fromTo(
          el,
          { skewX: gsap.utils.random(-8, 8), x: gsap.utils.random(-4, 4) },
          { skewX: 0, x: 0, duration: 0.18, ease: "power2.out" }
        );
      }
      gsap.delayedCall(gsap.utils.random(4, 9), jolt);
    }
    gsap.delayedCall(5, jolt);
  }

  /* ============================================================
     Konami — HYPER MODE
     ============================================================ */
  function initKonami() {
    var SEQ = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    var pos = 0;
    var hyper = false;

    document.addEventListener("keydown", function (e) {
      pos = e.keyCode === SEQ[pos] ? pos + 1 : 0;
      if (pos !== SEQ.length) return;
      pos = 0;
      hyper = !hyper;
      burst(window.innerWidth / 2, window.innerHeight / 2, 40, 2.2);
      if (hyper) {
        gsap.to(["main", "#nav", "#footer"], {
          filter: "hue-rotate(360deg)",
          duration: 6,
          repeat: -1,
          ease: "none"
        });
      } else {
        gsap.killTweensOf(["main", "#nav", "#footer"]);
        gsap.set(["main", "#nav", "#footer"], { clearProps: "filter" });
      }
    });
  }

  /* ============================================================
     Subpage enter (pages without the boot overlay)
     ============================================================ */
  function initPageEnter() {
    if (RM || bootEl) return;
    gsap.from("main", { opacity: 0, y: 18, duration: 0.55, ease: "power2.out" });
  }

  /* ============================================================
     Init
     ============================================================ */
  function init() {
    var yearEl = document.querySelector("[data-year]");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    setHeroInitial();
    initPageEnter();
    initStars();
    initCursor();
    initNav();
    initMarquees();
    initTitles();
    initTerminal();
    initChips();
    initStatusCycle();
    initTilt();
    initReveals();
    initProjectGlitch();
    initForm();
    initLogo();
    initAmbient();
    initKonami();
    initHeroParallax();
    runBoot();
  }

  /* wait for fonts so SplitText measures correctly (2s safety net) */
  var started = false;
  function start() {
    if (started) return;
    started = true;
    init();
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(start);
  }
  window.setTimeout(start, 2000);
})();
