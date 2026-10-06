/**
 * One side's clock. Presentational: the game loop owns the time and ticks it.
 * Under ten seconds the tenths show, the way every chess site does it.
 */
type Props = {
  ms: number;
  active: boolean;
  label: string;
};

export function formatClock(ms: number): string {
  const clamped = Math.max(0, ms);
  const totalSeconds = Math.floor(clamped / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  if (clamped < 10_000) {
    const tenths = Math.floor((clamped % 1000) / 100);
    return `${s}.${tenths}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function Clock({ ms, active, label }: Props) {
  const low = ms < 30_000;
  const critical = ms < 10_000;
  return (
    <div
      className={['clock', active ? 'is-active' : '', low ? 'is-low' : '', critical ? 'is-critical' : '']
        .filter(Boolean)
        .join(' ')}
      aria-live={critical && active ? 'polite' : 'off'}
    >
      <span className="clock-label">{label}</span>
      <span className="clock-time">{formatClock(ms)}</span>
    </div>
  );
}
