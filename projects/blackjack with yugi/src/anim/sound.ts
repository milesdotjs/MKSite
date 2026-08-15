/**
 * Tiny WebAudio synth — no audio assets required. Everything is generated:
 * card swishes are filtered noise, thunder is a decaying rumble, LP damage
 * is a pitch-dropping thud. The context unlocks on the first user gesture
 * (the "Begin Duel" click), which satisfies autoplay policies.
 */

let ctx: AudioContext | null = null;
let muted = false;

function ac(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function noiseBuffer(c: AudioContext, seconds: number): AudioBuffer {
  const buf = c.createBuffer(1, Math.ceil(c.sampleRate * seconds), c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

/** Filtered noise burst — the basis of swishes, riffles and rumbles. */
function noiseHit(opts: {
  duration: number;
  type: BiquadFilterType;
  freqFrom: number;
  freqTo?: number;
  gain?: number;
  delay?: number;
}) {
  if (muted) return;
  const c = ac();
  if (!c) return;
  const { duration, type, freqFrom, freqTo = freqFrom, gain = 0.25, delay = 0 } = opts;
  const t0 = c.currentTime + delay;

  const src = c.createBufferSource();
  src.buffer = noiseBuffer(c, duration);
  const filter = c.createBiquadFilter();
  filter.type = type;
  filter.frequency.setValueAtTime(freqFrom, t0);
  filter.frequency.exponentialRampToValueAtTime(Math.max(40, freqTo), t0 + duration);
  const g = c.createGain();
  g.gain.setValueAtTime(gain, t0);
  g.gain.exponentialRampToValueAtTime(0.001, t0 + duration);

  src.connect(filter).connect(g).connect(c.destination);
  src.start(t0);
  src.stop(t0 + duration);
}

function tone(opts: {
  freqFrom: number;
  freqTo?: number;
  duration: number;
  type?: OscillatorType;
  gain?: number;
  delay?: number;
}) {
  if (muted) return;
  const c = ac();
  if (!c) return;
  const { freqFrom, freqTo = freqFrom, duration, type = 'sine', gain = 0.2, delay = 0 } = opts;
  const t0 = c.currentTime + delay;

  const osc = c.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freqFrom, t0);
  osc.frequency.exponentialRampToValueAtTime(Math.max(20, freqTo), t0 + duration);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.015);
  g.gain.exponentialRampToValueAtTime(0.001, t0 + duration);

  osc.connect(g).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + duration);
}

export const sound = {
  isMuted: () => muted,
  setMuted(next: boolean) {
    muted = next;
  },
  /** Unlock the AudioContext from a user gesture. */
  unlock() {
    void ac();
  },

  /** Card leaving the deck. */
  swish(delay = 0) {
    noiseHit({ duration: 0.16, type: 'bandpass', freqFrom: 500, freqTo: 2200, gain: 0.16, delay });
  },
  /** Hole card / mid-flight flip. */
  flip(delay = 0) {
    noiseHit({ duration: 0.09, type: 'highpass', freqFrom: 1800, gain: 0.1, delay });
    tone({ freqFrom: 900, freqTo: 1400, duration: 0.07, type: 'triangle', gain: 0.05, delay });
  },
  /** Riffle shuffle — a fast run of ticks. */
  riffle(delay = 0) {
    for (let i = 0; i < 14; i++) {
      noiseHit({
        duration: 0.03,
        type: 'bandpass',
        freqFrom: 1500 + Math.random() * 1500,
        gain: 0.07,
        delay: delay + i * 0.028,
      });
    }
  },
  /** Life point damage — a heavy thud. */
  thud(delay = 0) {
    tone({ freqFrom: 110, freqTo: 38, duration: 0.28, type: 'sine', gain: 0.5, delay });
    noiseHit({ duration: 0.12, type: 'lowpass', freqFrom: 300, freqTo: 80, gain: 0.25, delay });
  },
  /** Distant storm for losses and dramatic reveals. */
  thunder(delay = 0) {
    noiseHit({ duration: 1.8, type: 'lowpass', freqFrom: 400, freqTo: 60, gain: 0.5, delay });
    tone({ freqFrom: 55, freqTo: 30, duration: 1.6, type: 'sine', gain: 0.3, delay: delay + 0.05 });
  },
  /** Small victory chime — minor-key so it stays gothic. */
  chime(delay = 0) {
    const notes = [523.25, 622.25, 783.99]; // C5, Eb5, G5
    notes.forEach((f, i) =>
      tone({ freqFrom: f, duration: 0.5, type: 'triangle', gain: 0.08, delay: delay + i * 0.09 })
    );
  },
  /** Dissonant dread drone for the Exodia summon. */
  sting(delay = 0) {
    tone({ freqFrom: 65, freqTo: 62, duration: 2.2, type: 'sawtooth', gain: 0.1, delay });
    tone({ freqFrom: 98, freqTo: 92, duration: 2.2, type: 'sawtooth', gain: 0.07, delay });
    tone({ freqFrom: 46, duration: 2.4, type: 'sine', gain: 0.16, delay });
  },
};
