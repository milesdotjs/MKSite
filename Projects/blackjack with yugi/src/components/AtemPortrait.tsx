import { useRef } from 'react';
import { gsap, useGSAP } from '../anim/gsapSetup';

/**
 * The living dealer portrait, built from the Nightmare Troubadour (DS) sprite
 * the same way the game itself does it: one static body with small eye and
 * mouth tiles painted over the face. Keeping them as separate layers means
 * blinking and talking compose independently — he can blink mid-sentence.
 *
 * Slot geometry comes from the sheet (body 128x188, eyes 40x24 at 27,63,
 * mouth 8x8 at 46,86) expressed as percentages so it scales with the frame.
 */
const EYE_BOX = {
  left: `${(27 / 128) * 100}%`,
  top: `${(63 / 188) * 100}%`,
  width: `${(40 / 128) * 100}%`,
  height: `${(24 / 188) * 100}%`,
};
const MOUTH_BOX = {
  left: `${(46 / 128) * 100}%`,
  top: `${(86 / 188) * 100}%`,
  width: `${(8 / 128) * 100}%`,
  height: `${(8 / 188) * 100}%`,
};

const MOUTH_FRAMES = [1, 2, 3];

type Props = {
  /** Changes whenever Atem says something new — drives the lip flap. */
  message: string;
  /** Suppress idle motion during dramatic beats. */
  agitated?: boolean;
};

export function AtemPortrait({ message, agitated = false }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  // Blink on a loose, self-rescheduling loop, with the occasional double-blink.
  useGSAP(
    () => {
      const eye = rootRef.current?.querySelector('.atem-eyes');
      if (!eye) return;

      const blink = () => {
        const tl = gsap.timeline({ onComplete: schedule });
        tl.set(eye, { opacity: 1 })
          .set(eye, { opacity: 0 }, 0.085);
        if (Math.random() < 0.28) {
          tl.set(eye, { opacity: 1 }, 0.2).set(eye, { opacity: 0 }, 0.28);
        }
      };
      const schedule = () => {
        gsap.delayedCall(gsap.utils.random(2.4, 6.8), blink);
      };
      schedule();
    },
    { scope: rootRef, dependencies: [] }
  );

  // Lip-sync: flap the mouth for a stretch proportional to the line's length.
  useGSAP(
    () => {
      const mouths = gsap.utils.toArray<HTMLElement>('.atem-mouth', rootRef.current);
      if (!mouths.length) return;
      gsap.set(mouths, { opacity: 0 });

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
    { scope: rootRef, dependencies: [message] }
  );

  // Idle presence: a slow breath, plus a faint tilt so he isn't a statue.
  useGSAP(
    () => {
      const body = rootRef.current?.querySelector('.atem-stack');
      if (!body) return;
      gsap.to(body, {
        y: '-1.2%',
        duration: 2.4,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      });
      gsap.to(body, {
        rotation: agitated ? 0.9 : 0.35,
        duration: agitated ? 1.1 : 5.5,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        transformOrigin: '50% 100%',
      });
    },
    { scope: rootRef, dependencies: [agitated] }
  );

  return (
    <div className="atem-portrait" ref={rootRef}>
      <div className="atem-stack">
        <img className="atem-body" src="sprites/atem/nt/atem-body.png" alt="Atem" draggable={false} />
        <img
          className="atem-eyes"
          src="sprites/atem/nt/atem-eyes-closed.png"
          alt=""
          aria-hidden
          draggable={false}
          style={EYE_BOX}
        />
        {MOUTH_FRAMES.map((n) => (
          <img
            key={n}
            className="atem-mouth"
            src={`sprites/atem/nt/atem-mouth-${n}.png`}
            alt=""
            aria-hidden
            draggable={false}
            style={MOUTH_BOX}
          />
        ))}
      </div>
    </div>
  );
}
