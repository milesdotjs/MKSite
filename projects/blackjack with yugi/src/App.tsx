/**
 * Shell and router.
 *
 * Two games now live behind one door, so App stops being the blackjack game
 * and becomes the thing that chooses between them. Routing is on the hash
 * rather than a router library: this is a static bundle that gets dropped into
 * a subfolder of a plain site, so anything relying on server rewrites would
 * break the moment it was deployed. The hash also makes a chosen opponent and
 * difficulty survive a refresh, which matters on a phone home screen.
 */
import { useCallback, useEffect, useState } from 'react';
import { AmbientLayer } from './components/AmbientLayer';
import { BlackjackGame } from './blackjack/BlackjackGame';
import { ChessGame } from './chess/ChessGame';
import { OpponentSelect, TierSelect } from './chess/components/OpponentSelect';
import { GameSelect, type GameId } from './shell/GameSelect';
import { CHARACTERS, characterById, tierIndex } from './chess/characters';
import { sound } from './anim/sound';
import './styles/index.css';
import './styles/chess.css';

type Route =
  | { screen: 'select' }
  | { screen: 'blackjack' }
  | { screen: 'chess-roster' }
  | { screen: 'chess-tiers'; characterId: string }
  | { screen: 'chess'; characterId: string; tier: number };

const knownCharacter = (id: string) => CHARACTERS.some((c) => c.id === id);

function parseHash(): Route {
  const raw = window.location.hash.replace(/^#\/?/, '');
  if (raw === 'blackjack') return { screen: 'blackjack' };
  if (raw === 'chess') return { screen: 'chess-roster' };

  const withTier = /^chess\/([\w-]+)\/(\d+)$/.exec(raw);
  if (withTier && knownCharacter(withTier[1])) {
    const character = characterById(withTier[1]);
    return {
      screen: 'chess',
      characterId: withTier[1],
      tier: tierIndex(character, Number(withTier[2])),
    };
  }

  const justCharacter = /^chess\/([\w-]+)$/.exec(raw);
  if (justCharacter && knownCharacter(justCharacter[1])) {
    return { screen: 'chess-tiers', characterId: justCharacter[1] };
  }

  return { screen: 'select' };
}

function hashFor(route: Route): string {
  switch (route.screen) {
    case 'blackjack':
      return '#/blackjack';
    case 'chess-roster':
      return '#/chess';
    case 'chess-tiers':
      return `#/chess/${route.characterId}`;
    case 'chess':
      return `#/chess/${route.characterId}/${route.tier}`;
    default:
      return '#/';
  }
}

export default function App() {
  const [route, setRoute] = useState<Route>(() => parseHash());
  // Bumped to force a fresh ChessGame (and a fresh engine) for a rematch,
  // which is cheaper and less jarring than reloading the page.
  const [rematch, setRematch] = useState(0);

  // Keep the back button working: the hash is the source of truth, and every
  // navigation goes through it rather than setting state directly.
  useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const go = useCallback((next: Route) => {
    window.location.hash = hashFor(next);
  }, []);

  const pickGame = useCallback(
    (game: GameId) => {
      // First real gesture of the session — the browser will only let us build
      // the audio graph inside a user event.
      sound.unlock();
      go(game === 'blackjack' ? { screen: 'blackjack' } : { screen: 'chess-roster' });
    },
    [go]
  );

  return (
    <>
      <AmbientLayer />
      {route.screen === 'select' && <GameSelect onPick={pickGame} />}

      {route.screen === 'blackjack' && (
        <BlackjackGame onExit={() => go({ screen: 'select' })} />
      )}

      {route.screen === 'chess-roster' && (
        <OpponentSelect
          onPick={(characterId) => go({ screen: 'chess-tiers', characterId })}
          onBack={() => go({ screen: 'select' })}
        />
      )}

      {route.screen === 'chess-tiers' && (
        <TierSelect
          character={characterById(route.characterId)}
          onStart={(tier) => go({ screen: 'chess', characterId: route.characterId, tier })}
          onBack={() => go({ screen: 'chess-roster' })}
        />
      )}

      {route.screen === 'chess' && (
        <ChessGame
          key={`${route.characterId}-${route.tier}-${rematch}`}
          characterId={route.characterId}
          tier={route.tier}
          onExit={() => go({ screen: 'chess-tiers', characterId: route.characterId })}
          onRematch={() => setRematch((n) => n + 1)}
        />
      )}
    </>
  );
}
