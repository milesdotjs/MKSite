/**
 * The board.
 *
 * Interaction is tap-to-select then tap-to-destination, with dragging layered
 * on top for pointers that have it. Tap-first is the primary path rather than
 * a mobile fallback: this ships as an installed PWA, and a drag implementation
 * that owns the interaction would make the phone build the awkward one.
 *
 * Pieces are positioned absolutely by rank/file percentage rather than living
 * inside their square's DOM node, so a move is a transform on a stable element
 * and GSAP can glide it. Re-parenting between squares would make every move a
 * teleport.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Color, PieceSymbol, Square } from 'chess.js';
import { gsap } from '../../anim/gsapSetup';
import { ChessPiece, pieceLabel } from './Pieces';

export type BoardPiece = {
  /** Stable across moves so the same DOM node animates from square to square. */
  id: string;
  square: Square;
  type: PieceSymbol;
  color: Color;
};

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;

type Props = {
  pieces: BoardPiece[];
  /** Which colour sits at the bottom. */
  orientation: Color;
  /** Squares the selected piece may move to. */
  targets: Square[];
  selected: Square | null;
  lastMove: { from: Square; to: Square } | null;
  /** Square of the king in check, for the danger pulse. */
  checkSquare: Square | null;
  /** Only pieces of this colour can be picked up and dragged. */
  movableColor: Color;
  interactive: boolean;
  onSelect: (square: Square | null) => void;
  onMove: (from: Square, to: Square) => void;
};

function fileIndex(sq: Square): number {
  return FILES.indexOf(sq[0] as (typeof FILES)[number]);
}
function rankIndex(sq: Square): number {
  return Number(sq[1]) - 1;
}

/** Percentage offsets of a square's top-left corner, honouring orientation. */
function squarePos(sq: Square, orientation: Color): { left: number; top: number } {
  const f = fileIndex(sq);
  const r = rankIndex(sq);
  const col = orientation === 'w' ? f : 7 - f;
  const row = orientation === 'w' ? 7 - r : r;
  return { left: col * 12.5, top: row * 12.5 };
}

function squareAt(col: number, row: number, orientation: Color): Square {
  const f = orientation === 'w' ? col : 7 - col;
  const r = orientation === 'w' ? 7 - row : row;
  return `${FILES[f]}${r + 1}` as Square;
}

export function ChessBoard({
  pieces,
  orientation,
  targets,
  selected,
  lastMove,
  checkSquare,
  movableColor,
  interactive,
  onSelect,
  onMove,
}: Props) {
  const boardRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<{ id: string; x: number; y: number } | null>(null);
  const dragRef = useRef<{
    id: string;
    from: Square;
    startX: number;
    startY: number;
    moved: boolean;
    draggable: boolean;
  } | null>(null);

  const squares: Square[] = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) squares.push(squareAt(col, row, orientation));
  }

  const squareFromEvent = useCallback(
    (clientX: number, clientY: number): Square | null => {
      const el = boardRef.current;
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const col = Math.floor(((clientX - r.left) / r.width) * 8);
      const row = Math.floor(((clientY - r.top) / r.height) * 8);
      if (col < 0 || col > 7 || row < 0 || row > 7) return null;
      return squareAt(col, row, orientation);
    },
    [orientation]
  );

  /**
   * A tap on a square — from the square itself or from whatever piece is
   * sitting on top of it. Both routes have to land here: pieces are painted
   * above the squares, so on a real board the thing a player taps is almost
   * always a piece, not the square underneath it.
   */
  const tapSquare = useCallback(
    (sq: Square) => {
      if (!interactive) return;
      if (selected && targets.includes(sq)) onMove(selected, sq);
      else onSelect(sq === selected ? null : sq);
    },
    [interactive, onMove, onSelect, selected, targets]
  );

  // Drag is tracked on window so a piece released outside the board still
  // resolves instead of sticking to the cursor.
  useEffect(() => {
    if (!drag) return;

    const onMoveEvent = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d) return;
      const dx = e.clientX - d.startX;
      const dy = e.clientY - d.startY;
      if (!d.moved && Math.hypot(dx, dy) > 4) d.moved = true;
      if (d.draggable) setDrag({ id: d.id, x: dx, y: dy });
    };

    const onUp = (e: PointerEvent) => {
      const d = dragRef.current;
      dragRef.current = null;
      setDrag(null);
      if (!d) return;
      // A press that never travelled is a tap on the square beneath the piece.
      // So is any press on a piece that was never liftable — dragging an
      // opponent's knight across the board should still just select or capture.
      if (!d.moved || !d.draggable) {
        tapSquare(d.from);
        return;
      }
      const to = squareFromEvent(e.clientX, e.clientY);
      if (to && to !== d.from) onMove(d.from, to);
      else onSelect(null);
    };

    window.addEventListener('pointermove', onMoveEvent);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMoveEvent);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [drag, onMove, onSelect, squareFromEvent, tapSquare]);

  const handlePieceDown = (e: React.PointerEvent, piece: BoardPiece) => {
    if (!interactive) return;
    // Every piece is tracked, including the opponent's: a tap has to resolve
    // whether it lands on your own piece (select) or on theirs (capture).
    // Only your own pieces actually lift and follow the pointer, though —
    // dragging an enemy piece around would promise a move that cannot happen.
    dragRef.current = {
      id: piece.id,
      from: piece.square,
      startX: e.clientX,
      startY: e.clientY,
      moved: false,
      draggable: piece.color === movableColor,
    };
    setDrag({ id: piece.id, x: 0, y: 0 });
  };

  return (
    <div className="chess-board-wrap">
      <div className="chess-board" ref={boardRef}>
        {squares.map((sq) => {
          const dark = (fileIndex(sq) + rankIndex(sq)) % 2 === 0;
          const isTarget = targets.includes(sq);
          const occupied = pieces.some((p) => p.square === sq);
          return (
            <button
              key={sq}
              type="button"
              className={[
                'chess-square',
                dark ? 'dark' : 'light',
                selected === sq ? 'selected' : '',
                lastMove && (lastMove.from === sq || lastMove.to === sq) ? 'last-move' : '',
                checkSquare === sq ? 'in-check' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              style={squarePosStyle(sq, orientation)}
              onClick={() => tapSquare(sq)}
              tabIndex={interactive ? 0 : -1}
              aria-label={sq}
            >
              {isTarget && <span className={occupied ? 'target-capture' : 'target-dot'} />}
            </button>
          );
        })}

        {pieces.map((p) => {
          const pos = squarePos(p.square, orientation);
          const dragging = drag?.id === p.id;
          return (
            <div
              key={p.id}
              className={`chess-piece-slot ${dragging ? 'dragging' : ''}`}
              data-piece-id={p.id}
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
                transform: dragging ? `translate(${drag.x}px, ${drag.y}px)` : undefined,
              }}
              onPointerDown={(e) => handlePieceDown(e, p)}
              role="img"
              aria-label={`${pieceLabel(p.type, p.color)} on ${p.square}`}
            >
              <ChessPiece piece={p.type} color={p.color} />
            </div>
          );
        })}
      </div>

      <div className="chess-coords chess-coords-files" aria-hidden>
        {(orientation === 'w' ? FILES : [...FILES].reverse()).map((f) => (
          <span key={f}>{f}</span>
        ))}
      </div>
      <div className="chess-coords chess-coords-ranks" aria-hidden>
        {(orientation === 'w' ? [8, 7, 6, 5, 4, 3, 2, 1] : [1, 2, 3, 4, 5, 6, 7, 8]).map((r) => (
          <span key={r}>{r}</span>
        ))}
      </div>
    </div>
  );
}

function squarePosStyle(sq: Square, orientation: Color): React.CSSProperties {
  const { left, top } = squarePos(sq, orientation);
  return { left: `${left}%`, top: `${top}%` };
}

/**
 * Burn a captured piece out of existence, with a shockwave on its square.
 *
 * The piece is *cloned* first and the clone is what animates. React owns the
 * real element and will drop it from the list on the very next render, which
 * would cut any animation off mid-flight — so the departing piece has to be
 * handed over to a copy that nothing else is managing. Without this a capture
 * is just a piece silently blinking out, which is the one moment in a chess
 * game that deserves weight.
 */
export function burnCapturedPiece(pieceId: string): void {
  const el = document.querySelector<HTMLElement>(`[data-piece-id="${pieceId}"]`);
  const host = el?.parentElement;
  if (!el || !host) return;

  const ghost = el.cloneNode(true) as HTMLElement;
  // Strip every trace of piece-hood. The clone is pure decoration, so it must
  // not keep the class, the id hook, or the a11y role — otherwise it counts as
  // a real piece to anything querying the board and gets announced to screen
  // readers as a piece that is no longer there.
  ghost.className = 'piece-ghost';
  ghost.removeAttribute('data-piece-id');
  ghost.removeAttribute('role');
  ghost.removeAttribute('aria-label');
  ghost.setAttribute('aria-hidden', 'true');
  host.appendChild(ghost);

  gsap.to(ghost, {
    scale: 1.45,
    opacity: 0,
    filter: 'brightness(2.8) blur(5px)',
    duration: 0.42,
    ease: 'power2.out',
    onComplete: () => ghost.remove(),
  });

  const ring = document.createElement('div');
  ring.className = 'capture-ring';
  ring.style.left = el.style.left;
  ring.style.top = el.style.top;
  host.appendChild(ring);

  gsap.fromTo(
    ring,
    { scale: 0.35, opacity: 0.9 },
    {
      scale: 2.1,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out',
      onComplete: () => ring.remove(),
    }
  );
}
