import { useCallback, useEffect, useRef, useState } from 'react';
import { Controls } from '../components/Controls';
import { Dealer } from '../components/Dealer';
import { DeckPile } from '../components/DeckPile';
import { ExodiaOverlay } from '../components/ExodiaOverlay';
import { HandView } from '../components/HandView';
import { LifePoints } from '../components/LifePoints';
import { RoundBanner } from '../components/RoundBanner';
import { TitleSplash } from '../components/TitleSplash';
import { impact, lightning, registerFx, screenShake } from '../anim/fx';
import { sound } from '../anim/sound';
import {
  dealerHit,
  finishShuffle,
  initialState,
  newGame,
  nextRound,
  playerDouble,
  playerHit,
  playerStand,
  resolveRound,
} from '../game/engine';
import { dealerShouldHit } from '../game/dealer';
import type { GameState } from '../game/types';

/** Dev-only: jump straight to a hard-to-reach state via ?debug=... */
function debugInitialState(): GameState | null {
  if (!import.meta.env.DEV) return null;
  const mode = new URLSearchParams(window.location.search).get('debug');
  if (!mode) return null;
  const base = initialState();
  switch (mode) {
    case 'exodia':
      return { ...base, phase: 'exodia', playerLP: 0, outcome: 'exodia', message: 'EXODIA! OBLITERATE!' };
    case 'mindcrush':
      return { ...base, phase: 'gameOver', playerLP: 0, outcome: 'dealerWin', message: 'Mind Crush!' };
    case 'victory':
      return { ...base, phase: 'gameOver', dealerLP: 0, outcome: 'playerWin', message: 'Incredible... you have defeated me.' };
    default:
      return null;
  }
}

type Props = {
  onExit: () => void;
};

export function BlackjackGame({ onExit }: Props) {
  const [state, setState] = useState<GameState>(() => debugInitialState() ?? initialState());
  const [muted, setMuted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  const handleHit = useCallback(() => setState((s) => playerHit(s)), []);
  const handleStand = useCallback(() => setState((s) => playerStand(s)), []);
  const handleDouble = useCallback(() => setState((s) => playerDouble(s)), []);
  const handleNewRound = useCallback(() => setState((s) => nextRound(s)), []);
  const handleNewGame = useCallback(() => {
    sound.unlock();
    setState(() => newGame());
  }, []);
  const handleShuffleDone = useCallback(() => setState((s) => finishShuffle(s)), []);
  const handleExodiaDismiss = useCallback(() => setState(() => initialState()), []);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      sound.setMuted(!m);
      return !m;
    });
  }, []);

  // Register the shake target for full-screen damage rumbles.
  useEffect(() => {
    registerFx('shakeTarget', rootRef.current);
    return () => registerFx('shakeTarget', null);
  }, []);

  // Drive the dealer's automated turn (slower than the original — the
  // card-flight animations deserve room to breathe).
  useEffect(() => {
    if (state.phase !== 'dealerTurn') return;

    if (dealerShouldHit(state.dealerHand)) {
      const t = window.setTimeout(() => {
        setState((s) => (s.phase === 'dealerTurn' ? dealerHit(s) : s));
      }, 950);
      return () => window.clearTimeout(t);
    }

    const t = window.setTimeout(() => {
      setState((s) => (s.phase === 'dealerTurn' ? resolveRound(s) : s));
    }, 850);
    return () => window.clearTimeout(t);
  }, [state.phase, state.dealerHand]);

  // Global FX on damage: the blood bloom rises from the player's edge of the
  // table, the violet one falls from the Pharaoh's, so a glance at the screen
  // says who just got hit without reading the numbers.
  const prevLP = useRef({ player: state.playerLP, dealer: state.dealerLP });
  useEffect(() => {
    const prev = prevLP.current;
    if (state.playerLP < prev.player) {
      const heavy = prev.player - state.playerLP > 1000;
      impact('player', heavy ? 1.7 : 1.1);
      screenShake(heavy ? 1.6 : 1, -1);
    }
    if (state.dealerLP < prev.dealer) {
      impact('opponent', 1.1);
      screenShake(0.8, 1);
    }
    prevLP.current = { player: state.playerLP, dealer: state.dealerLP };
  }, [state.playerLP, state.dealerLP]);

  // Storm and fanfare when a hand resolves.
  useEffect(() => {
    if (state.phase !== 'roundOver' && state.phase !== 'gameOver') return;
    const won =
      state.outcome === 'playerWin' ||
      state.outcome === 'dealerBust' ||
      state.outcome === 'playerBlackjack';
    if (won) {
      sound.chime(0.25);
    } else if (state.outcome === 'dealerWin' || state.outcome === 'playerBust') {
      lightning();
      sound.thunder(0.12);
    }
    if (state.phase === 'gameOver') {
      lightning();
      if (state.dealerLP <= 0) sound.chime(0.5);
      else sound.thunder(0.4);
    }
  }, [state.phase, state.outcome, state.dealerLP]);

  // Keyboard shortcuts: H hit, S stand, D double, Space/Enter advance.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const s = stateRef.current;
      const k = e.key.toLowerCase();
      if (k === 'h' && s.phase === 'playerTurn') handleHit();
      else if (k === 's' && s.phase === 'playerTurn') handleStand();
      else if (k === 'd' && s.phase === 'playerTurn') handleDouble();
      else if (k === ' ' || k === 'enter') {
        if (s.phase === 'idle' || s.phase === 'gameOver') handleNewGame();
        else if (s.phase === 'roundOver') handleNewRound();
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleHit, handleStand, handleDouble, handleNewGame, handleNewRound]);

  // Hide dealer total during the player's turn (since the hole card is hidden).
  const hideDealerTotal = state.phase === 'playerTurn';
  const inRound = state.phase !== 'idle';

  return (
    <>
      <div className="app-root" ref={rootRef}>
        <div className="hud-top">
          <LifePoints label="ATEM" value={state.dealerLP} align="left" />
          <div className="hud-center">
            <button className="btn-ghost" onClick={onExit}>
              ← Leave
            </button>
            <div className="round-pill">Round {state.roundNumber || '—'}</div>
            <button
              className="mute-btn"
              onClick={toggleMute}
              title={muted ? 'Unmute' : 'Mute'}
              aria-label={muted ? 'Unmute sound' : 'Mute sound'}
            >
              {muted ? '♪̸' : '♪'}
            </button>
          </div>
          <LifePoints label="YOU" value={state.playerLP} align="right" />
        </div>

        <div className="duel-board">
          <div className="duel-side dealer-side">
            <Dealer state={state} />
            <HandView
              key={`d-${state.roundNumber}`}
              label="Atem's hand"
              hand={state.dealerHand}
              hideTotal={hideDealerTotal}
              dealOffset={0.16}
            />
          </div>

          <div className="duel-side player-side">
            {state.phase === 'idle' ? (
              <TitleSplash />
            ) : (
              <HandView
                key={`p-${state.roundNumber}`}
                label="Your hand"
                hand={state.playerHand}
              />
            )}
            <Controls
              state={state}
              onHit={handleHit}
              onStand={handleStand}
              onDouble={handleDouble}
              onNewRound={handleNewRound}
              onNewGame={handleNewGame}
            />
          </div>

          {inRound && (
            <DeckPile
              count={state.deck.length}
              shuffling={state.phase === 'shuffling'}
              onShuffleDone={handleShuffleDone}
            />
          )}
          <RoundBanner state={state} />
        </div>
      </div>

      <ExodiaOverlay active={state.phase === 'exodia'} onDismiss={handleExodiaDismiss} />
    </>
  );
}
