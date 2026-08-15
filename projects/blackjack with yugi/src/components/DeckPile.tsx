import { useEffect, useRef } from 'react';
import { anchors } from '../anim/registry';
import { ShuffleFX } from './ShuffleFX';

type Props = {
  count: number;
  shuffling: boolean;
  onShuffleDone: () => void;
};

/** The shoe: a stack of card backs that dealt cards visually fly out of. */
export function DeckPile({ count, shuffling, onShuffleDone }: Props) {
  const stackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    anchors.deck = stackRef.current;
    return () => {
      if (anchors.deck === stackRef.current) anchors.deck = null;
    };
  }, []);

  // A thinner visual stack as the shoe depletes.
  const layers = Math.min(5, Math.max(1, Math.ceil(count / 11)));

  return (
    <div className="deck-pile" aria-label={`Deck: ${count} cards remaining`}>
      <div className="deck-stack" ref={stackRef}>
        <div className={`deck-cards ${shuffling ? 'hidden-for-shuffle' : ''}`}>
          {Array.from({ length: layers }, (_, i) => (
            <div
              key={i}
              className="deck-card"
              style={{ transform: `translate(${i * -1.5}px, ${i * -2}px)` }}
            >
              <img src="sprites/card-back.png" alt="" draggable={false} />
            </div>
          ))}
        </div>
        {shuffling && <ShuffleFX onDone={onShuffleDone} />}
      </div>
      <div className="deck-count">{count}</div>
    </div>
  );
}
