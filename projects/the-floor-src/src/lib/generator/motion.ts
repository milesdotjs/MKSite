/**
 * The "Pro" upgrade: the decoration people are charged extra for.
 *
 * Scroll reveals with a stagger, a hover lift on cards, a nav underline that
 * sweeps in, a shadow under the header once you scroll. Together they are
 * most of what "modern" and "custom" mean to someone buying a website.
 *
 * It is deliberately plain CSS plus one small observer: no library, no CDN,
 * no build step. The site still opens by double-clicking with no network at
 * all. The point of the feature is that anyone can see how little it is, so
 * the tool counts the lines and tells them.
 */

/** Everything that fades up as it comes into view. The hero is excluded: it animates on load. */
const REVEAL_TARGETS = [
  ".section-title",
  ".features .feature",
  ".services .service",
  ".team .team-member",
  ".gallery img",
  ".band-img",
  ".band-text",
  ".prose p",
  ".contact-list li",
  ".contact-form",
  ".cta-band h2",
  ".cta-band p",
  ".cta-band .button",
  ".page-header h1",
  ".page-header p",
].join(", ");

/** Runs in <head> so nothing flashes: the CSS only hides things once this class is on. */
export const MOTION_HEAD_SCRIPT = `<script>if(!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.className+=" js-motion";</script>`;

/** Runs at the end of <body>. Adds the class, watches for it to scroll in, and nothing else. */
export const MOTION_BODY_SCRIPT = `<script>
(function () {
  if (!document.documentElement.classList.contains("js-motion")) return;
  var items = document.querySelectorAll("${REVEAL_TARGETS}");
  for (var i = 0; i < items.length; i++) items[i].classList.add("reveal");
  var seen = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      seen.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8% 0px" });
  for (var j = 0; j < items.length; j++) seen.observe(items[j]);
  var header = document.querySelector(".site-header");
  if (header) addEventListener("scroll", function () {
    header.classList.toggle("is-stuck", window.scrollY > 8);
  }, { passive: true });
})();
</script>`;

/** Stagger for the children of a row, so three cards arrive one after another. */
const STAGGER = [".features", ".services", ".team", ".gallery", ".contact-list"]
  .map((parent) =>
    [2, 3, 4, 5, 6, 7, 8, 9]
      .map((n) => `.js-motion ${parent} .reveal:nth-child(${n}) { transition-delay: ${((n - 1) * 0.12).toFixed(2)}s; }`)
      .join("\n"),
  )
  .join("\n");

export const MOTION_CSS = `
/* ---------- Pro ---------- */
@media (prefers-reduced-motion: no-preference) {
  html { scroll-behavior: smooth; }

  .js-motion .reveal {
    opacity: 0;
    transform: translateY(26px);
    transition: opacity 1.1s cubic-bezier(0.16, 1, 0.3, 1), transform 1.1s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .js-motion .reveal.is-in { opacity: 1; transform: none; }
${STAGGER}

  .js-motion .hero-tagline { animation: floor-rise 1.1s 0.1s both; }
  .js-motion .hero h1 { animation: floor-rise 1.1s 0.25s both; }
  .js-motion .hero-text { animation: floor-rise 1.1s 0.4s both; }
  .js-motion .hero .button { animation: floor-rise 1.1s 0.55s both; }
  .js-motion .hero-img, .js-motion .hero-bg { animation: floor-settle 1.8s 0.1s both; }
  .js-motion .hero-tagline, .js-motion .hero h1, .js-motion .hero-text, .js-motion .hero .button, .js-motion .hero-img, .js-motion .hero-bg { animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1); }
  @keyframes floor-rise { from { opacity: 0; transform: translateY(22px); } }
  @keyframes floor-settle { from { opacity: 0; transform: scale(1.04); } }

  .feature, .service, .team-member { transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
  .feature:hover, .service:hover, .team-member:hover { transform: translateY(-5px); box-shadow: 0 18px 38px rgba(0, 0, 0, 0.12); }
  .gallery img, .band-img { transition: transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.9s cubic-bezier(0.16, 1, 0.3, 1); }
  .gallery img:hover, .band-img:hover { transform: scale(1.03); box-shadow: 0 18px 38px rgba(0, 0, 0, 0.16); }
  .button { transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease; }
  .button:hover { transform: translateY(-2px); box-shadow: 0 10px 22px rgba(0, 0, 0, 0.18); }

  .site-header { transition: box-shadow 0.6s ease; }
  .site-header.is-stuck { box-shadow: 0 6px 22px rgba(0, 0, 0, 0.09); }
  .site-nav a { position: relative; }
  .site-nav a::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: -5px;
    height: 2px;
    background: currentColor;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .site-nav a:hover::after, .site-nav a[aria-current="page"]::after { transform: scaleX(1); }
}
`;

/** How much the upgrade actually cost, counted from the real output. */
export function motionCost(): { css: number; js: number } {
  const lines = (s: string) => s.trim().split("\n").filter((l) => l.trim()).length;
  return {
    css: lines(MOTION_CSS),
    js: lines(MOTION_HEAD_SCRIPT.replace(/<\/?script>/g, "")) + lines(MOTION_BODY_SCRIPT.replace(/<\/?script>/g, "")),
  };
}
