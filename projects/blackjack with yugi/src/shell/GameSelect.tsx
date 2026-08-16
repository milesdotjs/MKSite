/**
 * The landing screen: two doors, one shadow game behind each.
 *
 * This is the first thing anyone sees now, so it carries the title treatment
 * the blackjack splash used to own — the flicker and the char-by-char reveal
 * that set the tone before any rules appear.
 */
import { useRef } from 'react';
import { gsap, useGSAP, SplitText } from '../anim/gsapSetup';

export type GameId = 'blackjack' | 'chess';

type Props = {
  onPick: (game: GameId) => void;
};

export function GameSelect({ onPick }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const title = ref.current?.querySelector('.shell-title');
      if (!title) return;

      const split = new SplitText(title, { type: 'words,chars' });
      const tl = gsap.timeline();
      tl.from(split.chars, {
        opacity: 0,
        y: () => gsap.utils.random(-18, 18),
        filter: 'blur(6px)',
        duration: 0.6,
        stagger: { each: 0.05, from: 'random' },
        ease: 'power2.out',
      })
        .from('.shell-sub', { opacity: 0, y: 8, duration: 0.6 }, 0.5)
        .from('.game-door', { opacity: 0, y: 24, duration: 0.6, stagger: 0.12 }, 0.7);

      // Candle-gutter flicker, same as the old title card.
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
    <div className="shell-select" ref={ref}>
      <div className="shell-eyebrow">the pharaoh is waiting</div>
      <h1 className="shell-title">SHADOW GAMES</h1>
      <p className="shell-sub">Choose the game you would stake your soul on.</p>

      <div className="game-doors">
        <button className="game-door door-blackjack" onClick={() => onPick('blackjack')}>
          <span className="door-suits" aria-hidden>
            ♠ ♥ ♦ ♣
          </span>
          <span className="door-name">Blackjack</span>
          <span className="door-desc">
            Twenty-one against Atem himself. Every hand costs life points.
          </span>
        </button>

        <button className="game-door door-chess" onClick={() => onPick('chess')}>
          <span className="door-suits" aria-hidden>
            ♜ ♞ ♝ ♛
          </span>
          <span className="door-name">Chess</span>
          <span className="door-desc">
            Six duelists, six strengths — from a bug-brained novice to the Pharaoh.
          </span>
        </button>
      </div>
    </div>
  );
}
