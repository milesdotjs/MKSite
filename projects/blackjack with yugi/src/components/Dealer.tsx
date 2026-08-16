import { useRef } from 'react';
import type { GameState } from '../game/types';
import { gsap, useGSAP, SplitText } from '../anim/gsapSetup';
import { AtemPortrait } from './AtemPortrait';

type Props = {
  state: GameState;
};

/**
 * Two registers of dealer art, cut like an anime duel:
 *
 * - "live" — the Nightmare Troubadour portrait that blinks and talks. This is
 *   Atem as you actually sit across from him, and it carries the quiet phases.
 * - "still" — a Saikyo Card Battle bustup held for a single emotional beat,
 *   the equivalent of cutting to a reaction shot. `cutin` marks the two
 *   moments he goes for the kill, which fill the frame instead.
 */
type DealerArt =
  | { kind: 'live' }
  | { kind: 'still'; src: string; alt: string; cutin?: boolean };

function artFor(state: GameState): DealerArt {
  if (state.phase === 'exodia') {
    return { kind: 'still', src: 'sprites/atem/atem-cutin.png', alt: 'Atem summons Exodia', cutin: true };
  }
  if (state.phase === 'gameOver') {
    return state.dealerLP <= 0
      ? { kind: 'still', src: 'sprites/atem/atem-shock.png', alt: 'Atem defeated' }
      : { kind: 'still', src: 'sprites/atem/atem-cutin.png', alt: 'Atem triumphant', cutin: true };
  }
  if (state.phase === 'roundOver') {
    switch (state.outcome) {
      case 'playerWin':
      case 'dealerBust':
        return { kind: 'still', src: 'sprites/atem/atem-uneasy.png', alt: 'Atem rattled' };
      case 'dealerWin':
        return { kind: 'still', src: 'sprites/atem/atem-sly.png', alt: 'Atem smug' };
      case 'playerBust':
        return { kind: 'still', src: 'sprites/atem/atem-shout.png', alt: 'Atem triumphant' };
      case 'playerBlackjack':
        return { kind: 'still', src: 'sprites/atem/atem-shock.png', alt: 'Atem shocked' };
      default:
        // A push moves nobody — stay with the living portrait.
        return { kind: 'live' };
    }
  }
  return { kind: 'live' };
}

export function Dealer({ state }: Props) {
  const art = artFor(state);
  const frameRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const msgRef = useRef<HTMLSpanElement>(null);

  const auraActive = state.phase === 'dealerTurn' || state.phase === 'exodia';
  const stillSrc = art.kind === 'still' ? art.src : null;

  // Slow "breathing" on the monitor screen — keeps the frame itself alive.
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

  // Materialize whichever art just took the frame out of the shadows.
  useGSAP(
    () => {
      const el = frameRef.current?.querySelector('.dealer-art');
      if (!el) return;
      gsap.fromTo(
        el,
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
    { scope: frameRef, dependencies: [stillSrc, art.kind] }
  );

  // Quips whisper in character by character.
  useGSAP(
    () => {
      if (!msgRef.current) return;
      // Split words as well as chars — with chars alone the per-character
      // wrappers let a line break land inside a word ("th / ought").
      const split = new SplitText(msgRef.current, { type: 'words,chars' });
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
          {art.kind === 'live' ? (
            <div className="dealer-art" key="live">
              <AtemPortrait
                message={state.message}
                agitated={state.phase === 'dealerTurn'}
              />
            </div>
          ) : (
            <img
              key={art.src}
              className={`dealer-art dealer-sprite ${art.cutin ? 'cutin' : ''} ${
                state.phase === 'exodia' ? 'shake' : ''
              }`}
              src={art.src}
              alt={art.alt}
            />
          )}
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
