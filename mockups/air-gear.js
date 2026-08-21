/* AIR GEAR mockup — minimal behaviour. Static look is what's being judged. */
(function () {
  "use strict";

  /* tuning bars fill when scrolled into view */
  var bars = document.querySelectorAll(".spec-list b[data-fill]");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.style.setProperty("--w", e.target.dataset.fill + "%");
        io.unobserve(e.target);
      });
    }, { threshold: 0.4 });
    bars.forEach(function (b) { io.observe(b); });
  } else {
    bars.forEach(function (b) { b.style.setProperty("--w", b.dataset.fill + "%"); });
  }

  /* nav active state */
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
