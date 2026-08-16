import { useEffect, useRef } from 'react';
import { gsap, useGSAP } from '../anim/gsapSetup';
import { registerFx } from '../anim/fx';

const EMBER_COUNT = 18;

/**
 * The shadow-realm atmosphere: drifting fog banks, rising embers/spirits,
 * a candle-flicker vignette, a faint Eye of Wdjat watermark, and the
 * full-screen flash/lightning elements that fx.ts drives.
 */
export function AmbientLayer() {
  const underRef = useRef<HTMLDivElement>(null);
  const overRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const lightningRef = useRef<HTMLDivElement>(null);
  const impactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerFx('flash', flashRef.current);
    registerFx('lightning', lightningRef.current);
    registerFx('impact', impactRef.current);
    return () => {
      registerFx('flash', null);
      registerFx('lightning', null);
      registerFx('impact', null);
    };
  }, []);

  useGSAP(
    () => {
      const under = underRef.current;
      const over = overRef.current;
      if (!under || !over) return;

      // Fog banks drift on long, offset loops so they never sync up.
      gsap.to('.fog-a', {
        xPercent: 9,
        yPercent: -4,
        duration: 53,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      });
      gsap.to('.fog-b', {
        xPercent: -11,
        yPercent: 5,
        duration: 41,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      });

      // Candle-flicker on the vignette.
      gsap.to('.vignette', {
        opacity: () => gsap.utils.random(0.8, 1),
        duration: () => gsap.utils.random(0.09, 0.4),
        repeat: -1,
        repeatRefresh: true,
        ease: 'none',
      });

      // The Eye watches, slowly pulsing.
      gsap.to('.wdjat', {
        opacity: 0.1,
        scale: 1.03,
        duration: 6,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      });

      // Embers/spirit motes rising from the floor of the shadow realm.
      const host = under.querySelector('.ember-host');
      if (host) {
        const h = window.innerHeight;
        for (let i = 0; i < EMBER_COUNT; i++) {
          const ember = document.createElement('div');
          ember.className = Math.random() < 0.65 ? 'ember gold' : 'ember violet';
          const size = gsap.utils.random(2, 5);
          ember.style.width = `${size}px`;
          ember.style.height = `${size}px`;
          ember.style.left = `${gsap.utils.random(2, 98)}%`;
          host.appendChild(ember);

          const dur = gsap.utils.random(9, 19);
          gsap.fromTo(
            ember,
            { y: h + 20, opacity: 0 },
            {
              y: -30,
              opacity: gsap.utils.random(0.35, 0.8),
              duration: dur,
              repeat: -1,
              delay: -gsap.utils.random(0, dur),
              ease: 'none',
              repeatRefresh: true,
            }
          );
          gsap.to(ember, {
            x: gsap.utils.random(-70, 70),
            duration: gsap.utils.random(3, 6),
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut',
          });
        }
      }
    },
    { dependencies: [] }
  );

  return (
    <>
      <div className="ambient-under" ref={underRef} aria-hidden>
        <div className="fog fog-a" />
        <div className="fog fog-b" />
        <div className="ember-host" />
        <svg className="wdjat" viewBox="0 0 200 130" fill="none">
          {/* Eye of Wdjat — the Millennium symbol, watching the table */}
          <path d="M18 42 Q100 4 182 42" stroke="currentColor" strokeWidth="3" />
          <path d="M24 62 Q100 20 176 62 Q100 100 24 62 Z" stroke="currentColor" strokeWidth="3" />
          <circle cx="100" cy="59" r="16" stroke="currentColor" strokeWidth="3" />
          <circle cx="100" cy="59" r="6" fill="currentColor" />
          <path d="M72 79 Q70 100 58 118" stroke="currentColor" strokeWidth="3" />
          <path d="M128 79 Q140 104 158 100 Q170 96 163 86 Q158 80 152 86" stroke="currentColor" strokeWidth="3" />
        </svg>
      </div>
      <div className="ambient-over" ref={overRef} aria-hidden>
        <div className="vignette" />
        <div className="fx-impact" ref={impactRef} />
        <div className="fx-flash" ref={flashRef} />
        <div className="fx-lightning" ref={lightningRef} />
      </div>
    </>
  );
}
