import { useRef } from 'react';
import { gsap, useGSAP, SplitText } from '../anim/gsapSetup';

/** Idle-screen title card: flickers in like a dying candle. */
export function TitleSplash() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const title = root.querySelector('.title-main');
      if (!title) return;

      const split = new SplitText(title, { type: 'chars' });
      const tl = gsap.timeline();
      tl.from(split.chars, {
        opacity: 0,
        y: () => gsap.utils.random(-18, 18),
        filter: 'blur(6px)',
        duration: 0.6,
        stagger: { each: 0.06, from: 'random' },
        ease: 'power2.out',
      })
        .from('.title-sub', { opacity: 0, y: 8, duration: 0.7 }, 0.7)
        .from('.title-hint', { opacity: 0, duration: 0.9 }, 1.1);

      // Occasional candle-gutter flicker on the whole title.
      gsap.to(title, {
        opacity: () => gsap.utils.random(0.82, 1),
        duration: () => gsap.utils.random(0.06, 0.3),
        repeat: -1,
        repeatRefresh: true,
        delay: 1.4,
        ease: 'none',
      });

      return () => split.revert();
    },
    { scope: ref, dependencies: [] }
  );

  return (
    <div className="title-splash" ref={ref}>
      <div className="title-eyebrow">a shadow game of</div>
      <div className="title-main">BLACKJACK</div>
      <div className="title-sub">against the Pharaoh himself</div>
      <div className="title-hint">The duel begins when you dare to press the button.</div>
    </div>
  );
}
