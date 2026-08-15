import { useRef } from 'react';
import type { GameState } from '../game/types';
import { gsap, useGSAP, SplitText } from '../anim/gsapSetup';

type Banner = { text: string; tone: 'win' | 'loss' | 'neutral' };

function bannerFor(state: GameState): Banner | null {
  if (state.phase === 'roundOver') {
    switch (state.outcome) {
      case 'playerWin':
      case 'dealerBust':
        return { text: 'THE HAND IS YOURS', tone: 'win' };
      case 'playerBlackjack':
        return { text: 'BLACKJACK', tone: 'win' };
      case 'dealerWin':
        return { text: 'THE SHADOWS CLAIM YOU', tone: 'loss' };
      case 'playerBust':
        return { text: 'BUST', tone: 'loss' };
      case 'push':
        return { text: 'STALEMATE', tone: 'neutral' };
      default:
        return null;
    }
  }
  if (state.phase === 'gameOver') {
    return state.dealerLP <= 0
      ? { text: 'THE PHARAOH FALLS', tone: 'win' }
      : { text: 'MIND CRUSH', tone: 'loss' };
  }
  return null;
}

/** Big gothic verdict text that slams in when a hand resolves. */
export function RoundBanner({ state }: { state: GameState }) {
  const banner = bannerFor(state);
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current?.querySelector('.banner-text');
      if (!el || !banner) return;
      const split = new SplitText(el, { type: 'chars' });
      const tl = gsap.timeline();
      tl.from(split.chars, {
        opacity: 0,
        scale: 2.4,
        y: -26,
        filter: 'blur(9px)',
        duration: 0.42,
        stagger: 0.045,
        ease: 'back.out(1.8)',
      }).fromTo(
        ref.current!.querySelector('.banner-rule.left'),
        { scaleX: 0 },
        { scaleX: 1, duration: 0.5, ease: 'power2.out' },
        0.2
      ).fromTo(
        ref.current!.querySelector('.banner-rule.right'),
        { scaleX: 0 },
        { scaleX: 1, duration: 0.5, ease: 'power2.out' },
        0.2
      );
      return () => split.revert();
    },
    { scope: ref, dependencies: [banner?.text ?? ''] }
  );

  if (!banner) return null;

  return (
    <div className={`round-banner tone-${banner.tone}`} ref={ref} key={banner.text + state.roundNumber}>
      <div className="banner-rule left" />
      <div className="banner-text">{banner.text}</div>
      <div className="banner-rule right" />
    </div>
  );
}
