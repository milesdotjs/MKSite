import { gsap } from './gsapSetup';

/**
 * Imperative full-screen effects. AmbientLayer registers its overlay
 * elements here on mount; game code fires effects without caring about DOM.
 */
const els: {
  shakeTarget: HTMLElement | null;
  flash: HTMLElement | null;
  lightning: HTMLElement | null;
} = {
  shakeTarget: null,
  flash: null,
  lightning: null,
};

export function registerFx(name: keyof typeof els, el: HTMLElement | null) {
  els[name] = el;
}

export function screenShake(intensity = 1) {
  const t = els.shakeTarget;
  if (!t) return;
  gsap.fromTo(
    t,
    { x: 0, y: 0 },
    {
      x: () => gsap.utils.random(-7, 7) * intensity,
      y: () => gsap.utils.random(-5, 5) * intensity,
      duration: 0.05,
      repeat: 9,
      repeatRefresh: true,
      ease: 'none',
      onComplete: () => gsap.set(t, { x: 0, y: 0 }),
    }
  );
}

/** Quick colored wash over the whole screen (damage red, victory gold...). */
export function flash(color = 'rgba(140, 10, 20, 0.45)', peak = 0.85) {
  const f = els.flash;
  if (!f) return;
  gsap.set(f, { backgroundColor: color });
  gsap.fromTo(
    f,
    { opacity: 0 },
    { opacity: peak, duration: 0.08, ease: 'power1.in', yoyo: true, repeat: 1, repeatDelay: 0.05 }
  );
}

/** Storm strike: two-pulse white-violet flicker, like lightning through a window. */
export function lightning() {
  const l = els.lightning;
  if (!l) return;
  const tl = gsap.timeline();
  tl.set(l, { opacity: 0 })
    .to(l, { opacity: 0.9, duration: 0.05 })
    .to(l, { opacity: 0.15, duration: 0.08 })
    .to(l, { opacity: 0.7, duration: 0.05 })
    .to(l, { opacity: 0, duration: 0.45, ease: 'power2.out' });
}
