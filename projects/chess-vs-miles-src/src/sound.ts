/**
 * Tiny WebAudio clicks so moves have weight. No samples to load; everything
 * is synthesised on the spot. Muted state is remembered per browser.
 */
let ctx: AudioContext | null = null;
let muted = (() => {
  try {
    return localStorage.getItem('cvm-muted') === '1';
  } catch {
    return false;
  }
})();

function audio(): AudioContext | null {
  if (muted) return null;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function blip(freq: number, duration: number, gain: number, type: OscillatorType = 'triangle') {
  const ac = audio();
  if (!ac) return;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ac.currentTime);
  osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq * 0.6), ac.currentTime + duration);
  g.gain.setValueAtTime(gain, ac.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + duration);
  osc.connect(g).connect(ac.destination);
  osc.start();
  osc.stop(ac.currentTime + duration);
}

export const sound = {
  move: () => blip(520, 0.07, 0.12),
  capture: () => {
    blip(300, 0.1, 0.16, 'square');
    window.setTimeout(() => blip(180, 0.12, 0.1), 30);
  },
  check: () => {
    blip(880, 0.08, 0.1);
    window.setTimeout(() => blip(1100, 0.1, 0.08), 70);
  },
  lowTime: () => blip(1400, 0.05, 0.06, 'square'),
  end: () => {
    blip(440, 0.18, 0.12);
    window.setTimeout(() => blip(330, 0.3, 0.1), 140);
  },
  isMuted: () => muted,
  setMuted: (m: boolean) => {
    muted = m;
    try {
      localStorage.setItem('cvm-muted', m ? '1' : '0');
    } catch {
      /* private mode */
    }
  },
};
