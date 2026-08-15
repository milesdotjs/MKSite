import { useRef } from 'react';
import type { Card } from '../game/types';
import { gsap, useGSAP } from '../anim/gsapSetup';
import { anchors } from '../anim/registry';
import { sound } from '../anim/sound';

const SUIT_GLYPHS: Record<Card['suit'], string> = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
};

function isRed(suit: Card['suit']) {
  return suit === 'hearts' || suit === 'diamonds';
}

type Props = {
  card: Card;
  /** Seconds to wait before this card flies off the deck (opening-deal stagger). */
  dealDelay?: number;
};

export function PlayingCard({ card, dealDelay = 0 }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const prevFaceDown = useRef(card.faceDown);

  // Deal-in: fly from the deck pile to this card's slot, flipping face-up
  // mid-flight (unless it's the hole card, which stays on its back).
  useGSAP(
    () => {
      const root = rootRef.current;
      const inner = innerRef.current;
      if (!root || !inner) return;

      gsap.set(inner, { rotationY: 180 });

      const deckEl = anchors.deck;
      const tl = gsap.timeline({ delay: dealDelay });

      if (deckEl) {
        const deckRect = deckEl.getBoundingClientRect();
        const cardRect = root.getBoundingClientRect();
        const dx = deckRect.left + deckRect.width / 2 - (cardRect.left + cardRect.width / 2);
        const dy = deckRect.top + deckRect.height / 2 - (cardRect.top + cardRect.height / 2);

        gsap.set(root, { x: dx, y: dy, rotation: gsap.utils.random(-9, 9), zIndex: 40 });
        tl.call(() => sound.swish())
          .to(root, {
            duration: 0.55,
            ease: 'power2.out',
            motionPath: {
              path: [
                { x: dx * 0.45, y: dy * 0.45 - 46 },
                { x: 0, y: 0 },
              ],
              curviness: 1.4,
            },
            rotation: 0,
          })
          .set(root, { clearProps: 'zIndex' });
      } else {
        // No deck anchor mounted (shouldn't happen mid-game) — simple drop-in.
        tl.fromTo(
          root,
          { y: -36, opacity: 0, rotation: -4 },
          { y: 0, opacity: 1, rotation: 0, duration: 0.4, ease: 'power2.out' }
        );
      }

      if (!card.faceDown) {
        tl.call(() => sound.flip(), [], 0.2).to(
          inner,
          { rotationY: 0, duration: 0.38, ease: 'power2.inOut' },
          0.18
        );
      }
    },
    { scope: rootRef, dependencies: [] }
  );

  // Hole-card reveal: lift, flip over, settle.
  useGSAP(
    () => {
      const root = rootRef.current;
      const inner = innerRef.current;
      const wasDown = prevFaceDown.current;
      prevFaceDown.current = card.faceDown;
      if (!root || !inner || !wasDown || card.faceDown) return;

      sound.flip(0.1);
      gsap
        .timeline()
        .to(root, { y: -16, scale: 1.12, duration: 0.18, ease: 'power2.out' }, 0)
        .to(inner, { rotationY: 0, duration: 0.42, ease: 'power2.inOut' }, 0.06)
        .to(root, { y: 0, scale: 1, duration: 0.3, ease: 'back.out(2.5)' }, 0.3);
    },
    { scope: rootRef, dependencies: [card.faceDown] }
  );

  const glyph = SUIT_GLYPHS[card.suit];

  return (
    <div className="card3d" ref={rootRef}>
      <div className="card-inner" ref={innerRef}>
        <div className={`card-face card-front ${isRed(card.suit) ? 'red' : 'black'}`}>
          <div className="card-frame" />
          <div className="card-corner top">
            <div className="card-rank">{card.rank}</div>
            <div className="card-suit">{glyph}</div>
          </div>
          <div className="card-center">{glyph}</div>
          <div className="card-corner bottom">
            <div className="card-rank">{card.rank}</div>
            <div className="card-suit">{glyph}</div>
          </div>
        </div>
        <div className="card-face card-back">
          <img src="sprites/card-back.png" alt="" draggable={false} />
        </div>
      </div>
    </div>
  );
}
