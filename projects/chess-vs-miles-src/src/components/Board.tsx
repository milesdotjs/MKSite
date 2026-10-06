/**
 * The board. Tap-to-select then tap-to-move, with drag layered on top.
 *
 * Pieces are absolutely positioned by rank/file percentage on stable elements
 * keyed by a piece id, so a move is a CSS transition on the same node rather
 * than a re-parent (which would teleport). Pieces paint above squares, so a
 * tap almost always lands on a piece: piece pointer handlers route into the
 * same select/move path as square clicks, or tap-to-move is silently dead.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Color, PieceSymbol, Square } from 'chess.js';
import { ChessPiece, pieceLabel } from './Pieces';

export type BoardPiece = {
  id: string;
  square: Square;
  type: PieceSymbol;
  color: Color;
};

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;

type Props = {
  pieces: BoardPiece[];
  orientation: Color;
  targets: Square[];
  selected: Square | null;
  lastMove: { from: Square; to: Square } | null;
  checkSquare: Square | null;
  movableColor: Color;
  interactive: boolean;
  onSelect: (square: Square | null) => void;
  onMove: (from: Square, to: Square) => void;
};

const fileIndex = (sq: Square) => FILES.indexOf(sq[0] as (typeof FILES)[number]);
const rankIndex = (sq: Square) => Number(sq[1]) - 1;

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

export function Board({
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

  const tapSquare = useCallback(
    (sq: Square) => {
      if (!interactive) return;
      if (selected && targets.includes(sq)) onMove(selected, sq);
      else onSelect(sq === selected ? null : sq);
    },
    [interactive, onMove, onSelect, selected, targets]
  );

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
    if (e.button !== 0 && e.pointerType === 'mouse') return;
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
    <div className="board-wrap">
      <div className={`board ${interactive ? '' : 'is-locked'}`} ref={boardRef}>
        {squares.map((sq) => {
          const dark = (fileIndex(sq) + rankIndex(sq)) % 2 === 0;
          const isTarget = targets.includes(sq);
          const occupied = pieces.some((p) => p.square === sq);
          const pos = squarePos(sq, orientation);
          return (
            <button
              key={sq}
              type="button"
              className={[
                'sq',
                dark ? 'dark' : 'light',
                selected === sq ? 'selected' : '',
                lastMove && (lastMove.from === sq || lastMove.to === sq) ? 'last-move' : '',
                checkSquare === sq ? 'in-check' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              style={{ left: `${pos.left}%`, top: `${pos.top}%` }}
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
              className={`piece-slot ${dragging ? 'dragging' : ''} ${p.color === movableColor ? 'mine' : ''}`}
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

      <div className="coords coords-files" aria-hidden>
        {(orientation === 'w' ? FILES : [...FILES].reverse()).map((f) => (
          <span key={f}>{f}</span>
        ))}
      </div>
      <div className="coords coords-ranks" aria-hidden>
        {(orientation === 'w' ? [8, 7, 6, 5, 4, 3, 2, 1] : [1, 2, 3, 4, 5, 6, 7, 8]).map((r) => (
          <span key={r}>{r}</span>
        ))}
      </div>
    </div>
  );
}

/**
 * Fade a captured piece out. The real element is about to be dropped by
 * React, so a clone does the animating; it is stripped of everything that
 * would make it count as a piece to DOM queries or screen readers.
 */
export function fadeCapturedPiece(pieceId: string): void {
  const el = document.querySelector<HTMLElement>(`[data-piece-id="${pieceId}"]`);
  const host = el?.parentElement;
  if (!el || !host) return;
  const ghost = el.cloneNode(true) as HTMLElement;
  ghost.className = 'piece-ghost';
  ghost.removeAttribute('data-piece-id');
  ghost.removeAttribute('role');
  ghost.removeAttribute('aria-label');
  ghost.setAttribute('aria-hidden', 'true');
  ghost.style.transform = '';
  host.appendChild(ghost);
  window.setTimeout(() => ghost.remove(), 420);
}
