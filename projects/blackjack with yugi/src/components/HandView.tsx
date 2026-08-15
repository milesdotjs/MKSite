import { useEffect, useRef } from 'react';
import type { Hand } from '../game/types';
import { handTotal } from '../game/scoring';
import { gsap, useGSAP } from '../anim/gsapSetup';
import { PlayingCard } from './PlayingCard';

type Props = {
  label: string;
  hand: Hand;
  hideTotal?: boolean;
  /** Extra deal-stagger offset so player/dealer opening cards interleave. */
  dealOffset?: number;
};

export function HandView({ label, hand, hideTotal = false, dealOffset = 0 }: Props) {
  const totalRef = useRef<HTMLSpanElement>(null);
  const prevLen = useRef(0);

  // True only on the opening deal of a round (this component remounts per
  // round via key={roundNumber} in App, so the ref starts at 0 each round).
  const isOpeningDeal = prevLen.current === 0 && hand.length >= 2;
  useEffect(() => {
    prevLen.current = hand.length;
  });

  const showableTotal = handTotal(hand, !hand.some((c) => c.faceDown));

  // Pulse the total whenever it changes.
  useGSAP(
    () => {
      if (!totalRef.current) return;
      gsap.fromTo(
        totalRef.current,
        { scale: 1.35, color: '#f3e09a' },
        { scale: 1, clearProps: 'color', duration: 0.45, ease: 'back.out(2)', delay: 0.5 }
      );
    },
    { dependencies: [showableTotal, hideTotal] }
  );

  return (
    <div className="hand-view">
      <div className="hand-header">
        <span className="hand-label">{label}</span>
        {!hideTotal && hand.length > 0 && (
          <span className="hand-total" ref={totalRef}>
            {showableTotal}
          </span>
        )}
      </div>
      <div className="hand-cards">
        {hand.map((card, i) => (
          <PlayingCard
            key={card.id}
            card={card}
            dealDelay={isOpeningDeal ? dealOffset + i * 0.32 : 0}
          />
        ))}
      </div>
    </div>
  );
}
