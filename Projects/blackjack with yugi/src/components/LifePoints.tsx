import { useRef } from 'react';
import { gsap, useGSAP } from '../anim/gsapSetup';
import { sound } from '../anim/sound';

type Props = {
  label: string;
  value: number;
  align?: 'left' | 'right';
};

export function LifePoints({ label, value, align = 'left' }: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLDivElement>(null);
  const floatHostRef = useRef<HTMLDivElement>(null);
  const displayed = useRef({ v: value });
  // Frozen at mount — the GSAP tween owns this text afterwards. If React
  // re-rendered it from `value`, the counter would snap before the tween runs.
  const initialText = useRef(String(Math.max(0, value)).padStart(4, '0'));

  useGSAP(
    () => {
      const delta = value - displayed.current.v;
      if (delta === 0 || !valueRef.current) return;

      // Anime-style LP drain: the counter ticks down over ~1s.
      gsap.to(displayed.current, {
        v: value,
        duration: 1.1,
        ease: 'power2.out',
        snap: { v: 1 },
        onUpdate: () => {
          if (valueRef.current) {
            valueRef.current.textContent = String(Math.max(0, Math.round(displayed.current.v))).padStart(4, '0');
          }
        },
      });

      if (delta < 0) {
        sound.thud(0.05);

        // Rattle the whole LP box.
        if (boxRef.current) {
          gsap.fromTo(
            boxRef.current,
            { x: 0 },
            {
              x: () => gsap.utils.random(-5, 5),
              duration: 0.05,
              repeat: 8,
              repeatRefresh: true,
              onComplete: () => {
                if (boxRef.current) gsap.set(boxRef.current, { x: 0 });
              },
            }
          );
        }

        // Floating damage number.
        if (floatHostRef.current) {
          const float = document.createElement('div');
          float.className = 'lp-damage-float';
          float.textContent = String(delta);
          floatHostRef.current.appendChild(float);
          gsap.fromTo(
            float,
            { y: 6, opacity: 0, scale: 0.7 },
            {
              y: -64,
              opacity: 1,
              scale: 1.25,
              duration: 0.5,
              ease: 'power2.out',
              onComplete: () => {
                gsap.to(float, {
                  y: -96,
                  opacity: 0,
                  duration: 0.7,
                  ease: 'power1.in',
                  onComplete: () => float.remove(),
                });
              },
            }
          );
        }
      }
    },
    { dependencies: [value] }
  );

  const isCritical = value <= 1000;
  const isZero = value <= 0;

  return (
    <div
      ref={boxRef}
      className={`life-points lp-${align} ${isCritical ? 'critical' : ''} ${isZero ? 'zero' : ''}`}
    >
      <div className="lp-label">{label}</div>
      <div className="lp-value" ref={valueRef}>
        {initialText.current}
      </div>
      <div className="lp-bar">
        <div
          className="lp-bar-fill"
          style={{ width: `${Math.max(0, Math.min(100, (value / 4000) * 100))}%` }}
        />
      </div>
      <div className="lp-float-host" ref={floatHostRef} aria-hidden />
    </div>
  );
}
