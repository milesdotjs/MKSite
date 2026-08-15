import type { GameState } from '../game/types';

type Props = {
  state: GameState;
  onHit: () => void;
  onStand: () => void;
  onDouble: () => void;
  onNewRound: () => void;
  onNewGame: () => void;
};

export function Controls({ state, onHit, onStand, onDouble, onNewRound, onNewGame }: Props) {
  const playerActive = state.phase === 'playerTurn';
  const canDouble = playerActive && state.playerHand.length === 2 && !state.doubled;
  const roundEnded = state.phase === 'roundOver';
  const gameEnded = state.phase === 'gameOver';
  const idle = state.phase === 'idle';

  return (
    <div className="controls">
      {idle && (
        <button className="btn btn-primary" onClick={onNewGame}>
          Begin the Shadow Game
        </button>
      )}
      {playerActive && (
        <>
          <button className="btn btn-primary" onClick={onHit} title="Hit (H)">
            Hit
          </button>
          <button className="btn btn-secondary" onClick={onStand} title="Stand (S)">
            Stand
          </button>
          {canDouble && (
            <button className="btn btn-blood" onClick={onDouble} title="Double Down (D)">
              Double
            </button>
          )}
        </>
      )}
      {roundEnded && (
        <button className="btn btn-primary" onClick={onNewRound} title="Next Hand (Space)">
          Next Hand
        </button>
      )}
      {gameEnded && (
        <button className="btn btn-primary" onClick={onNewGame} title="Duel Again (Space)">
          Duel Again
        </button>
      )}
    </div>
  );
}
