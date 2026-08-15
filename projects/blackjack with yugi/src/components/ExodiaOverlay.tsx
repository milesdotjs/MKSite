import { useRef } from 'react';
import { gsap, useGSAP, SplitText } from '../anim/gsapSetup';
import { screenShake } from '../anim/fx';
import { sound } from '../anim/sound';

type Props = {
  active: boolean;
  onDismiss: () => void;
};

/**
 * Visual slots left-to-right, but the pieces slam in arms-first, legs next,
 * head last in the center — the classic summon order of dread.
 */
const PIECES = [
  { src: 'sprites/exodia/card-right-arm.png', alt: 'Right Arm of the Forbidden One', revealStep: 1 },
  { src: 'sprites/exodia/card-right-leg.png', alt: 'Right Leg of the Forbidden One', revealStep: 3 },
  { src: 'sprites/exodia/card-exodia-head.png', alt: 'Exodia the Forbidden One', revealStep: 5 },
  { src: 'sprites/exodia/card-left-leg.png', alt: 'Left Leg of the Forbidden One', revealStep: 4 },
  { src: 'sprites/exodia/card-left-arm.png', alt: 'Left Arm of the Forbidden One', revealStep: 2 },
];

export function ExodiaOverlay({ active, onDismiss }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !active) return;

      const cards = gsap.utils
        .toArray<HTMLElement>('.exodia-card', root)
        .sort((a, b) => Number(a.dataset.step) - Number(b.dataset.step));
      const flash = root.querySelector('.exodia-summon-flash');
      const gif = root.querySelector('.exodia-summon-image');
      const text = root.querySelector('.exodia-text');
      const btn = root.querySelector('.exodia-dismiss');
      if (!flash || !gif || !text || !btn) return;

      const split = new SplitText(text, { type: 'chars' });
      gsap.set([flash, gif, text, btn], { opacity: 0 });
      gsap.set(cards, { opacity: 0 });

      const tl = gsap.timeline();
      if (import.meta.env.DEV) {
        (window as unknown as { __extl?: unknown }).__extl = tl;
      }

      // Darkness falls. A low drone builds. Thunder rolls somewhere far off.
      tl.from(root, { opacity: 0, duration: 0.55, ease: 'power1.out' })
        .call(() => sound.sting())
        .to(flash, { opacity: 0.5, duration: 0.05 }, 0.75)
        .to(flash, { opacity: 0, duration: 0.3 }, 0.82)
        .call(() => sound.thunder(), [], 0.72);

      // The five pieces slam in, each one rattling the realm.
      cards.forEach((el, i) => {
        const at = 1.3 + i * 0.55;
        const isHead = i === cards.length - 1;
        tl.fromTo(
          el,
          { y: 150, opacity: 0, scale: 0.55, rotation: i % 2 === 0 ? -10 : 10 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: isHead ? 0.5 : 0.38,
            ease: 'back.out(1.6)',
          },
          at
        ).call(
          () => {
            sound.thud();
            screenShake(isHead ? 1.5 : 0.55);
          },
          [],
          at + 0.12
        );
      });

      // The summon: blinding light, the beast, the decree.
      const summonAt = 1.3 + cards.length * 0.55 + 0.45;
      tl.call(() => sound.thunder(), [], summonAt - 0.05)
        .to(flash, { opacity: 1, duration: 0.09 }, summonAt)
        .to(flash, { opacity: 0, duration: 0.8, ease: 'power2.out' }, summonAt + 0.12)
        .fromTo(
          gif,
          { opacity: 0, scale: 0.5 },
          { opacity: 1, scale: 1, duration: 1.7, ease: 'expo.out' },
          summonAt + 0.06
        )
        .set(text, { opacity: 1 }, summonAt + 0.5)
        .from(
          split.chars,
          {
            opacity: 0,
            scale: 3.2,
            filter: 'blur(10px)',
            duration: 0.4,
            stagger: 0.05,
            ease: 'power3.out',
          },
          summonAt + 0.5
        )
        .call(() => screenShake(1.2), [], summonAt + 0.5)
        .to(btn, { opacity: 1, duration: 0.6 }, summonAt + 2.1);

      return () => split.revert();
    },
    { scope: rootRef, dependencies: [active] }
  );

  if (!active) return null;

  return (
    <div className="exodia-overlay" role="dialog" aria-label="Exodia summoned" ref={rootRef}>
      <div className="exodia-cards">
        {PIECES.map((p) => (
          <div key={p.src} className="exodia-card" data-step={p.revealStep}>
            <img src={p.src} alt={p.alt} />
          </div>
        ))}
      </div>
      <div className="exodia-summon-flash" />
      <img
        className="exodia-summon-image"
        src="sprites/exodia/exodia-obliterate.gif"
        alt="Exodia obliterates"
      />
      <div className="exodia-text">EXODIA, OBLITERATE!</div>
      <button className="btn btn-primary exodia-dismiss" onClick={onDismiss}>
        Begin a New Duel
      </button>
    </div>
  );
}
