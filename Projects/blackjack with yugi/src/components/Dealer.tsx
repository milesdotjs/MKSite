import { useRef } from 'react';
import type { GameState } from '../game/types';
import { gsap, useGSAP, SplitText } from '../anim/gsapSetup';

type Props = {
  state: GameState;
};

/**
 * Sprites are Saikyo Card Battle bustups with the six face expressions
 * composited in — one uniform art style across every dealer state. The
 * "cutin" is the same game's dramatic pointing panel, used for the two
 * moments Atem goes for the kill.
 */
function spriteFor(state: GameState): { src: string; alt: string; cutin?: boolean } {
  if (state.phase === 'exodia') {
    return { src: 'sprites/atem/atem-cutin.png', alt: 'Atem summons Exodia', cutin: true };
  }
  if (state.phase === 'gameOver') {
    return state.dealerLP <= 0
      ? { src: 'sprites/atem/atem-shock.png', alt: 'Atem defeated' }
      : { src: 'sprites/atem/atem-cutin.png', alt: 'Atem triumphant', cutin: true };
  }
  if (state.phase === 'roundOver') {
    switch (state.outcome) {
      case 'playerWin':
      case 'dealerBust':
        return { src: 'sprites/atem/atem-uneasy.png', alt: 'Atem rattled' };
      case 'dealerWin':
        return { src: 'sprites/atem/atem-sly.png', alt: 'Atem smug' };
      case 'playerBust':
        return { src: 'sprites/atem/atem-shout.png', alt: 'Atem triumphant' };
      case 'playerBlackjack':
        return { src: 'sprites/atem/atem-shock.png', alt: 'Atem shocked' };
      case 'push':
        return { src: 'sprites/atem/atem-closed.png', alt: 'Atem unmoved' };
      default:
        return { src: 'sprites/atem/atem-serious.png', alt: 'Atem' };
    }
  }
  if (state.phase === 'shuffling') {
    return { src: 'sprites/atem/atem-closed.png', alt: 'Atem shuffles, eyes closed' };
  }
  if (state.phase === 'dealerTurn') {
    return { src: 'sprites/atem/atem-shout.png', alt: 'Atem draws' };
  }
  if (state.phase === 'playerTurn') {
    return { src: 'sprites/atem/atem-sly.png', alt: 'Atem watching your move' };
  }
  return { src: 'sprites/atem/atem-serious.png', alt: 'Atem' };
}

export function Dealer({ state }: Props) {
  const { src, alt, cutin } = spriteFor(state);
  const frameRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const msgRef = useRef<HTMLSpanElement>(null);

  const auraActive = state.phase === 'dealerTurn' || state.phase === 'exodia';

  // Slow "breathing" on the monitor screen — keeps Atem feeling alive.
  useGSAP(
    () => {
      if (!screenRef.current) return;
      gsap.to(screenRef.current, {
        scale: 1.012,
        duration: 2.6,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      });
    },
    { scope: frameRef, dependencies: [] }
  );

  // Materialize the new sprite out of the shadows whenever the pose changes.
  useGSAP(
    () => {
      const img = frameRef.current?.querySelector('.dealer-sprite');
      if (!img) return;
      gsap.fromTo(
        img,
        { opacity: 0, filter: 'brightness(0.15) blur(7px)', scale: 1.05 },
        {
          opacity: 1,
          filter: 'brightness(1) blur(0px)',
          scale: 1,
          duration: 0.5,
          ease: 'power2.out',
        }
      );
    },
    { scope: frameRef, dependencies: [src] }
  );

  // Quips whisper in character by character.
  useGSAP(
    () => {
      if (!msgRef.current) return;
      const split = new SplitText(msgRef.current, { type: 'chars' });
      gsap.from(split.chars, {
        opacity: 0,
        filter: 'blur(4px)',
        y: 3,
        duration: 0.3,
        stagger: 0.013,
        ease: 'power1.out',
      });
      return () => split.revert();
    },
    { scope: frameRef, dependencies: [state.message] }
  );

  return (
    <div className="dealer-frame" ref={frameRef}>
      <div className="dealer-monitor">
        <div className={`dealer-aura ${auraActive ? 'active' : ''}`} />
        <div className="dealer-monitor-corner tl" />
        <div className="dealer-monitor-corner tr" />
        <div className="dealer-monitor-corner bl" />
        <div className="dealer-monitor-corner br" />
        <div className="dealer-monitor-nameplate">ATEM</div>
        <div className="dealer-monitor-screen" ref={screenRef}>
          <img
            key={src}
            className={`dealer-sprite ${cutin ? 'cutin' : ''} ${state.phase === 'exodia' ? 'shake' : ''}`}
            src={src}
            alt={alt}
          />
        </div>
      </div>
      <div className="dealer-message">
        <span ref={msgRef} key={state.message}>
          {state.message}
        </span>
      </div>
    </div>
  );
}
