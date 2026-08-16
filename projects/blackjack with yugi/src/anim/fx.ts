import { gsap } from './gsapSetup';

/**
 * Imperative full-screen effects. AmbientLayer registers its overlay
 * elements here on mount; game code fires effects without caring about DOM.
 */
const els: {
  shakeTarget: HTMLElement | null;
  flash: HTMLElement | null;
  lightning: HTMLElement | null;
  impact: HTMLElement | null;
} = {
  shakeTarget: null,
  flash: null,
  lightning: null,
  impact: null,
};

export function registerFx(name: keyof typeof els, el: HTMLElement | null) {
  els[name] = el;
}

/**
 * Dev-only handle for tuning effects from a screenshot rig or the console.
 *
 * These fire on a real hit and are gone in a few hundred milliseconds, which
 * makes them nearly impossible to catch at their peak by playing the game and
 * hoping. Being able to trigger one on demand is the difference between
 * tuning the damage bloom and guessing at it.
 */
declare global {
  interface Window {
    __fx?: Record<string, unknown>;
  }
}

/**
 * Impact shake: a directional kick that decays, rather than uniform jitter.
 *
 * The old version shook at a constant amplitude for a fixed number of frames,
 * which reads as a rumble — fine for a distant storm, wrong for being hit. A
 * hit should land hardest on the first frame and settle, so the eye reads a
 * direction and a weight instead of a vibration.
 *
 * `from` biases the initial kick: -1 shoves the view up (damage arriving from
 * below/you), +1 down (from above/them), 0 stays neutral.
 */
export function screenShake(intensity = 1, from = 0) {
  const t = els.shakeTarget;
  if (!t) return;
  gsap.killTweensOf(t);

  const tl = gsap.timeline({
    onComplete: () => gsap.set(t, { x: 0, y: 0, rotation: 0 }),
  });

  tl.to(t, {
    x: gsap.utils.random(-3, 3) * intensity,
    y: 9 * intensity * (from || 1) * -1,
    duration: 0.05,
    ease: 'power3.out',
  });

  const steps = 7;
  for (let i = 0; i < steps; i++) {
    const decay = Math.pow(1 - (i + 1) / (steps + 1), 1.6);
    tl.to(t, {
      x: gsap.utils.random(-9, 9) * intensity * decay,
      y: gsap.utils.random(-7, 7) * intensity * decay,
      rotation: gsap.utils.random(-0.4, 0.4) * intensity * decay,
      duration: 0.045,
      ease: 'none',
    });
  }

  tl.to(t, { x: 0, y: 0, rotation: 0, duration: 0.1, ease: 'power2.out' });
}

/**
 * Damage bloom: colour rushes in from the edges and leaves the middle clear.
 *
 * This replaces the flat full-screen wash for taking damage. Washing the whole
 * viewport in red hides the thing the player is trying to watch — the board,
 * the cards — at the exact moment they want to see what just happened, and a
 * uniform rectangle of colour has no direction to it. A vignette that blooms
 * inward from one edge keeps the centre readable and says where the hit came
 * from, which is the whole job.
 */
export function impact(
  side: 'player' | 'opponent' = 'player',
  intensity = 1,
  color?: string
) {
  const el = els.impact;
  if (!el) return;

  // Player damage bleeds up from below (their side of the table), the
  // opponent's down from above.
  const originY = side === 'player' ? 118 : -18;
  const tint = color ?? (side === 'player' ? '150, 12, 26' : '116, 58, 178');
  const peak = gsap.utils.clamp(0.35, 0.95, 0.5 * intensity);

  gsap.killTweensOf(el);
  gsap.set(el, {
    opacity: 0,
    scale: 1.22,
    transformOrigin: `50% ${side === 'player' ? '100%' : '0%'}`,
    background:
      `radial-gradient(ellipse 95% 78% at 50% ${originY}%, ` +
      `rgba(${tint}, 0.95) 0%, rgba(${tint}, 0.5) 34%, rgba(${tint}, 0) 68%)`,
  });

  gsap
    .timeline()
    .to(el, { opacity: peak, duration: 0.07, ease: 'power2.out' })
    .to(el, { scale: 1, duration: 0.55, ease: 'power2.out' }, 0)
    .to(el, { opacity: 0, duration: 0.5, ease: 'power2.in' }, 0.14);
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

if (import.meta.env.DEV && typeof window !== 'undefined') {
  // gsap comes along so a screenshot rig can slow the global timeline down and
  // sample an effect at its peak — headless capture takes longer than these
  // animations run, so real-time sampling always lands on the decay.
  window.__fx = { impact, screenShake, flash, lightning, gsap };
}
