/* PARADIGM X mockup — just enough JS to make the readouts feel alive.
   No GSAP here on purpose: the mockup should be judged on the static
   look first, and screenshots of CSS-only motion are deterministic. */
(function () {
  "use strict";

  /* ---- flanking data rails: pseudo hex/kana telemetry ---- */
  var KANA = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
  var HEX = "0123456789ABCDEF";

  function rnd(set, n) {
    var s = "";
    for (var i = 0; i < n; i++) s += set[Math.floor(Math.random() * set.length)];
    return s;
  }

  function railLine() {
    var r = Math.random();
    if (r < 0.18) return "0x" + rnd(HEX, 4) + "  " + rnd(KANA, 3);
    if (r < 0.34) return rnd(KANA, 5);
    if (r < 0.5) return ">> " + rnd(HEX, 2) + ":" + rnd(HEX, 2) + ":" + rnd(HEX, 2);
    if (r < 0.62) return "[ " + (Math.random() < 0.5 ? "OK " : "ACK") + " ] " + rnd(HEX, 3);
    return rnd(HEX, 8);
  }

  document.querySelectorAll("[data-rail]").forEach(function (el) {
    var lines = [];
    for (var i = 0; i < 60; i++) lines.push(railLine());
    // duplicated so translateY(-50%) loops seamlessly
    el.textContent = lines.join("\n") + "\n" + lines.join("\n");
  });

  /* ---- nav clock ---- */
  var clock = document.querySelector("[data-clock]");
  function tickClock() {
    if (!clock) return;
    var d = new Date();
    clock.textContent = [d.getHours(), d.getMinutes(), d.getSeconds()]
      .map(function (n) { return String(n).padStart(2, "0"); })
      .join(":");
  }
  tickClock();
  setInterval(tickClock, 1000);

  /* ---- skill meters fill when scrolled into view ---- */
  var meters = document.querySelectorAll(".meter b[data-fill]");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.style.setProperty("--w", e.target.dataset.fill + "%");
        io.unobserve(e.target);
      });
    }, { threshold: 0.4 });
    meters.forEach(function (m) { io.observe(m); });
  } else {
    meters.forEach(function (m) { m.style.setProperty("--w", m.dataset.fill + "%"); });
  }

  /* ---- nav active state ---- */
  var links = Array.prototype.slice.call(document.querySelectorAll("#nav nav a"));
  var secs = links
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && secs.length) {
    var navIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle("is-on", a.getAttribute("href") === "#" + e.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    secs.forEach(function (s) { navIo.observe(s); });
  }
})();
