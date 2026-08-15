import { useRef } from 'react';
import { gsap, useGSAP } from '../anim/gsapSetup';
import { sound } from '../anim/sound';

const CARD_COUNT = 10;

type Props = {
  onDone: () => void;
};

/**
 * Riffle-shuffle played over the deck pile: the stack cuts into two angled
 * halves, riffles back together card by card, twice, then squares up.
 */
export function ShuffleFX({ onDone }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const host = hostRef.current;
      if (!host) return;
      const cards = gsap.utils.toArray<HTMLElement>('.shuffle-card', host);
      const left = cards.filter((_, i) => i % 2 === 0);
      const right = cards.filter((_, i) => i % 2 === 1);

      // Stacked start.
      cards.forEach((el, i) => gsap.set(el, { x: 0, y: i * -1.6, rotation: 0, zIndex: i }));

      const tl = gsap.timeline({
        onComplete: () => {
          // Give the squared deck a beat before dealing begins.
          gsap.delayedCall(0.15, onDone);
        },
      });

      for (let pass = 0; pass < 2; pass++) {
        const t = pass * 1.05;
        // Cut into two halves.
        tl.call(() => sound.swish(), [], t)
          .to(left, { x: -44, rotation: -13, duration: 0.2, ease: 'power2.out', stagger: 0.015 }, t)
          .to(right, { x: 44, rotation: 13, duration: 0.2, ease: 'power2.out', stagger: 0.015 }, t);

        // Riffle back together, alternating halves.
        const riffleAt = t + 0.32;
        tl.call(() => sound.riffle(), [], riffleAt);
        cards.forEach((el, i) => {
          const half = i % 2 === 0 ? 0 : 0.024;
          tl.to(
            el,
            {
              x: 0,
              rotation: gsap.utils.random(-2, 2),
              duration: 0.16,
              ease: 'power1.inOut',
            },
            riffleAt + Math.floor(i / 2) * 0.048 + half
          );
        });
      }

      // Square up with a satisfying tap.
      tl.to(cards, { rotation: 0, duration: 0.12 }, '>')
        .to(host, { scale: 1.07, duration: 0.09, yoyo: true, repeat: 1, ease: 'power1.inOut' }, '<')
        .call(() => sound.flip(), [], '>');
    },
    { scope: hostRef, dependencies: [] }
  );

  return (
    <div className="shuffle-fx" ref={hostRef} aria-hidden>
      {Array.from({ length: CARD_COUNT }, (_, i) => (
        <div key={i} className="shuffle-card">
          <img src="sprites/card-back.png" alt="" draggable={false} />
        </div>
      ))}
    </div>
  );
}
