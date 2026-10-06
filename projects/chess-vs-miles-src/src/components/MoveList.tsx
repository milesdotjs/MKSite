import { useEffect, useRef } from 'react';

type Props = {
  /** SAN moves in order. */
  history: string[];
  opening: string | null;
  /** The position is still in Miles's book even if it has no single name yet. */
  inBook: boolean;
};

export function MoveList({ history, opening, inBook }: Props) {
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [history.length]);

  const pairs: Array<[string, string | undefined]> = [];
  for (let i = 0; i < history.length; i += 2) pairs.push([history[i], history[i + 1]]);

  return (
    <div className="moves">
      <div className="moves-opening" title="What the opening book calls this position">
        {opening ?? (history.length === 0 ? 'Starting position' : inBook ? 'Opening' : 'Out of book')}
      </div>
      <ol className="moves-list" ref={ref}>
        {pairs.map(([w, b], i) => (
          <li key={i}>
            <span className="moves-no">{i + 1}.</span>
            <span className="moves-san">{w}</span>
            <span className="moves-san">{b ?? ''}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
