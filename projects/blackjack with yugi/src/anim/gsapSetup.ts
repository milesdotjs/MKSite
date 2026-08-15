import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(useGSAP, MotionPathPlugin, SplitText);

// Respect users who ask for reduced motion: keep the animations but make
// them near-instant so game flow still works.
if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  gsap.globalTimeline.timeScale(8);
}

if (import.meta.env.DEV && typeof window !== 'undefined') {
  // Headless-browser screenshot rig: rAF is heavily throttled, and GSAP's
  // lag smoothing would turn sparse ticks into slow motion. Advancing by
  // real elapsed time instead keeps captured frames at the true timeline
  // position. (Dev-only; users get the default smoothing.)
  gsap.ticker.lagSmoothing(0);
  // Screenshot-rig diagnostics: count ticker frames.
  gsap.ticker.add(() => {
    const w = window as unknown as { __ticks?: number };
    w.__ticks = (w.__ticks ?? 0) + 1;
  });
}

export { gsap, useGSAP, SplitText };
