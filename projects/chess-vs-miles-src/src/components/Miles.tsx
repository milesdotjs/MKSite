/**
 * Miles himself: the pixel avatar plus his speech bubble.
 *
 * Moods map to sprite frames in public/avatar/. The idle frame blinks on a
 * loose timer; any other mood holds for a moment and then relaxes back to
 * idle unless the game loop keeps asserting it (thinking does).
 */
import { useEffect, useState } from 'react';

export type Mood = 'idle' | 'think' | 'happy' | 'grin' | 'annoyed' | 'shock' | 'sad';

type Props = {
  mood: Mood;
  text: string;
  /** Short line under the name, e.g. the opening being played. */
  caption?: string | null;
};

const BASE = import.meta.env.BASE_URL;

export function Miles({ mood, text, caption }: Props) {
  const [blink, setBlink] = useState(false);

  // Blink only while idle. Irregular interval so it does not look mechanical.
  useEffect(() => {
    if (mood !== 'idle') {
      setBlink(false);
      return;
    }
    let cancelled = false;
    let timer = 0;
    const schedule = () => {
      timer = window.setTimeout(() => {
        if (cancelled) return;
        setBlink(true);
        window.setTimeout(() => {
          if (cancelled) return;
          setBlink(false);
          schedule();
        }, 120);
      }, 2200 + Math.random() * 3200);
    };
    schedule();
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [mood]);

  const frame = mood === 'idle' && blink ? 'blink' : mood;

  return (
    <div className={`miles mood-${mood}`}>
      <div className="miles-portrait">
        <img src={`${BASE}avatar/${frame}.png`} alt="Miles, as a Game Boy sprite" width={128} height={128} draggable={false} />
      </div>
      <div className="miles-side">
        <div className="miles-name">
          Miles
          {caption && <span className="miles-caption">{caption}</span>}
        </div>
        <div className="bubble" key={text} aria-live="polite">
          {text || ' '}
        </div>
      </div>
    </div>
  );
}
