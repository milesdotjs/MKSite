/**
 * The living opponent portrait, generalised across the roster.
 *
 * Same trick as the blackjack dealer: one static bustup with small eye and
 * mouth tiles painted over the face, so blinking and talking compose
 * independently and the character can blink mid-sentence. The difference is
 * that every character's face sits somewhere else on their body, so the slot
 * rectangles arrive as data (see characters.ts) instead of being hard-coded,
 * and are converted to percentages here so the overlays track the face at any
 * render size.
 */
import { useRef } from 'react';
import { gsap, useGSAP } from '../../anim/gsapSetup';
import { portraitAsset, type Portrait } from '../characters';

type Props = {
  portrait: Portrait;
  /** Changes whenever the character says something new — drives the lip flap. */
  message: string;
  /** Suppress the calm idle sway while the engine is searching. */
  agitated?: boolean;
};

function pct(v: number, total: number): string {
  return `${(v / total) * 100}%`;
}

export function CharacterPortrait({ portrait, message, agitated = false }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { body, eyes, mouth } = portrait;

  const eyeBox = {
    left: pct(eyes.slot.x, body.w),
    top: pct(eyes.slot.y, body.h),
    width: pct(eyes.slot.w, body.w),
    height: pct(eyes.slot.h, body.h),
  };
  const mouthBox = {
    left: pct(mouth.slot.x, body.w),
    top: pct(mouth.slot.y, body.h),
    width: pct(mouth.slot.w, body.w),
    height: pct(mouth.slot.h, body.h),
  };

  // Blink on a loose, self-rescheduling loop, with the occasional double-blink.
  useGSAP(
    () => {
      if (!eyes.blink) return;
      const eye = rootRef.current?.querySelector('.char-eyes');
      if (!eye) return;

      const blink = () => {
        const tl = gsap.timeline({ onComplete: schedule });
        tl.set(eye, { opacity: 1 }).set(eye, { opacity: 0 }, 0.085);
        if (Math.random() < 0.28) {
          tl.set(eye, { opacity: 1 }, 0.2).set(eye, { opacity: 0 }, 0.28);
        }
      };
      const schedule = () => {
        gsap.delayedCall(gsap.utils.random(2.4, 6.8), blink);
      };
      schedule();
    },
    { scope: rootRef, dependencies: [eyes.blink, portrait.dir] }
  );

  // Lip-sync: flap for a stretch proportional to the line's length.
  useGSAP(
    () => {
      const mouths = gsap.utils.toArray<HTMLElement>('.char-mouth', rootRef.current);
      if (!mouths.length) return;
      gsap.set(mouths, { opacity: 0 });
      if (!message) return;

      const speech = gsap.utils.clamp(0.6, 2.6, message.length * 0.032);
      const tl = gsap.timeline();
      let t = 0;
      while (t < speech) {
        const m = mouths[Math.floor(Math.random() * mouths.length)];
        const open = gsap.utils.random(0.05, 0.11);
        tl.set(m, { opacity: 1 }, t).set(m, { opacity: 0 }, t + open);
        t += open + gsap.utils.random(0.045, 0.1);
      }
    },
    { scope: rootRef, dependencies: [message, portrait.dir] }
  );

  // Idle presence: a slow breath plus a faint tilt, tightening while thinking.
  useGSAP(
    () => {
      const stack = rootRef.current?.querySelector('.char-stack');
      if (!stack) return;
      gsap.to(stack, {
        y: '-1.2%',
        duration: 2.4,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      });
      gsap.to(stack, {
        rotation: agitated ? 0.9 : 0.35,
        duration: agitated ? 1.1 : 5.5,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        transformOrigin: '50% 100%',
      });
    },
    { scope: rootRef, dependencies: [agitated, portrait.dir] }
  );

  return (
    <div
      className="char-portrait"
      ref={rootRef}
      style={{ aspectRatio: `${body.w} / ${body.h}` }}
    >
      <div className="char-stack">
        <img
          className="char-body"
          src={portraitAsset(portrait, 'body.png')}
          alt=""
          aria-hidden
          draggable={false}
        />
        {eyes.blink && (
          <img
            className="char-eyes"
            src={portraitAsset(portrait, 'eyes-closed.png')}
            alt=""
            aria-hidden
            draggable={false}
            style={eyeBox}
          />
        )}
        {Array.from({ length: mouth.frames }, (_, i) => (
          <img
            key={i}
            className="char-mouth"
            src={portraitAsset(portrait, `mouth-${i + 1}.png`)}
            alt=""
            aria-hidden
            draggable={false}
            style={mouthBox}
          />
        ))}
      </div>
    </div>
  );
}
