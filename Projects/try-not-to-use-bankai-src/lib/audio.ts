// WebAudio synth. No audio files: every sound is an oscillator or a noise
// buffer, same approach as the blackjack game. Everything is scheduled on the
// context clock so cutscene sounds line up with their GSAP timelines.

type Wave = OscillatorType;

class Synth {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private rumbleGain: GainNode | null = null;
  private rumbleNodes: AudioNode[] = [];
  private noiseBuf: AudioBuffer | null = null;
  muted = false;

  unlock() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 0.6;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
  }

  setMuted(m: boolean) {
    this.muted = m;
    if (this.master && this.ctx) {
      this.master.gain.cancelScheduledValues(this.ctx.currentTime);
      this.master.gain.setTargetAtTime(m ? 0 : 0.6, this.ctx.currentTime, 0.02);
    }
  }

  get now() {
    return this.ctx?.currentTime ?? 0;
  }

  private tone(freq: number, dur: number, type: Wave = "square", gain = 0.08, at = 0, slideTo?: number, attack = 0.005) {
    if (!this.ctx || !this.master) return;
    const t0 = this.ctx.currentTime + at;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(this.master);
    o.start(t0);
    o.stop(t0 + dur + 0.05);
  }

  private noise(dur: number, gain = 0.1, at = 0, filter: { type: BiquadFilterType; from: number; to?: number; q?: number } = { type: "lowpass", from: 800 }) {
    if (!this.ctx || !this.master) return;
    if (!this.noiseBuf) {
      const len = this.ctx.sampleRate * 2;
      this.noiseBuf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const d = this.noiseBuf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    }
    const t0 = this.ctx.currentTime + at;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuf;
    src.loop = true;
    const f = this.ctx.createBiquadFilter();
    f.type = filter.type;
    f.Q.value = filter.q ?? 0.8;
    f.frequency.setValueAtTime(filter.from, t0);
    if (filter.to) f.frequency.exponentialRampToValueAtTime(filter.to, t0 + dur);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(f).connect(g).connect(this.master);
    src.start(t0);
    src.stop(t0 + dur + 0.05);
  }

  // --- UI ---
  blip() { this.tone(1046, 0.03, "square", 0.025); }
  tick() { this.tone(1500, 0.02, "triangle", 0.05); this.tone(500, 0.03, "square", 0.02); }
  hover() { this.tone(660, 0.03, "square", 0.02); }
  select() { this.tone(660, 0.05, "square", 0.05, 0, 990); }
  coin() { this.tone(1046, 0.08, "square", 0.08); this.tone(1568, 0.25, "square", 0.08, 0.08); }

  correct() {
    this.tone(784, 0.1, "square", 0.06);
    this.tone(1175, 0.18, "square", 0.06, 0.09);
    this.tone(1568, 0.25, "triangle", 0.05, 0.18);
  }

  wrong() {
    this.tone(110, 0.35, "sawtooth", 0.09, 0, 70);
    this.noise(0.25, 0.08, 0, { type: "lowpass", from: 500 });
  }

  // First mistake: buzz, a low boom, and a steel ring as the sword comes up.
  strike() {
    this.wrong();
    this.tone(55, 0.9, "sine", 0.2, 0.05, 30);
    this.tone(2400, 0.6, "sine", 0.05, 0.35, 2200);
    this.tone(3600, 0.4, "sine", 0.03, 0.37);
  }

  // Continuous rumble whose level follows spiritual pressure (0..1).
  setRumble(level: number) {
    if (!this.ctx || !this.master) return;
    if (!this.rumbleGain) {
      if (!this.noiseBuf) this.noise(0.01, 0.0001); // builds the buffer
      const g = this.ctx.createGain();
      g.gain.value = 0;
      const src = this.ctx.createBufferSource();
      src.buffer = this.noiseBuf;
      src.loop = true;
      const f = this.ctx.createBiquadFilter();
      f.type = "lowpass";
      f.frequency.value = 90;
      const o = this.ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = 38;
      const og = this.ctx.createGain();
      og.gain.value = 0.5;
      src.connect(f).connect(g);
      o.connect(og).connect(g);
      g.connect(this.master);
      src.start();
      o.start();
      this.rumbleGain = g;
      this.rumbleNodes = [src, o];
    }
    const target = Math.max(0, Math.min(1, level)) * 0.35;
    this.rumbleGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.4);
  }

  // Bankai cutscene, ~8 s. Offsets match BankaiCutscene's timeline.
  bankai() {
    const T = 0;
    // cut-in slam
    this.noise(0.35, 0.18, T + 0.05, { type: "highpass", from: 1200, to: 200 });
    this.tone(40, 1.2, "sine", 0.35, T + 0.4, 25);
    this.noise(0.5, 0.25, T + 0.4, { type: "lowpass", from: 300 });
    // sword sinks into the ground
    this.tone(320, 0.7, "sine", 0.12, T + 2.2, 50);
    this.noise(0.6, 0.06, T + 2.3, { type: "bandpass", from: 400, to: 120 });
    // reiatsu swell + blades rising
    this.tone(55, 3.2, "sawtooth", 0.06, T + 2.8, 82);
    this.tone(82.5, 3.0, "sawtooth", 0.05, T + 3.0, 110);
    this.noise(1.8, 0.12, T + 3.1, { type: "bandpass", from: 600, to: 4200, q: 2 });
    this.noise(1.8, 0.10, T + 3.5, { type: "bandpass", from: 500, to: 3800, q: 2 });
    // shatter + petal shimmer
    this.noise(0.4, 0.28, T + 4.7, { type: "highpass", from: 2500, to: 600 });
    for (let i = 0; i < 40; i++) {
      const at = T + 4.8 + Math.random() * 2.2;
      this.tone(2000 + Math.random() * 3500, 0.12, "sine", 0.02, at, 1500 + Math.random() * 2000);
    }
    this.noise(2.6, 0.08, T + 4.9, { type: "highpass", from: 3000, to: 8000 });
    // final wash
    this.tone(48, 1.6, "sine", 0.32, T + 7.0, 30);
    this.noise(1.3, 0.3, T + 7.0, { type: "lowpass", from: 2500, to: 100 });
  }

  // Almighty Push, ~8 s. Offsets match AlmightyPushCutscene's timeline.
  almightyPush() {
    this.noise(0.35, 0.18, 0.05, { type: "highpass", from: 1200, to: 200 });
    this.tone(40, 1.2, "sine", 0.35, 0.4, 25);
    this.noise(0.5, 0.25, 0.4, { type: "lowpass", from: 300 });
    // first push: a thud and a short gust
    this.tone(70, 0.5, "sine", 0.3, 1.65, 28);
    this.noise(0.45, 0.22, 1.65, { type: "lowpass", from: 900, to: 150 });
    // rising pressure as he lifts off
    this.noise(1.3, 0.12, 2.4, { type: "bandpass", from: 180, to: 1400, q: 1.5 });
    this.tone(45, 1.6, "sine", 0.18, 2.4, 60);
    // the big one
    this.tone(34, 2.8, "sine", 0.42, 3.2, 26);
    this.noise(2.2, 0.36, 3.2, { type: "lowpass", from: 1600, to: 90 });
    this.noise(0.8, 0.2, 3.2, { type: "bandpass", from: 3200, to: 300, q: 1.2 });
    this.tone(38, 3.5, "sawtooth", 0.05, 3.6, 30);
    for (let i = 0; i < 30; i++) {
      const at = 3.7 + Math.random() * 3.0;
      this.noise(0.06 + Math.random() * 0.08, 0.06, at, { type: "bandpass", from: 500 + Math.random() * 2500, q: 3 });
    }
    // wash out
    this.tone(30, 1.8, "sine", 0.35, 7.0, 20);
    this.noise(1.4, 0.32, 7.0, { type: "lowpass", from: 3000, to: 120 });
  }

  // Special Beam Cannon, ~8 s. Offsets match SpecialBeamCutscene's timeline.
  specialBeam() {
    this.noise(0.35, 0.18, 0.05, { type: "highpass", from: 1200, to: 200 });
    this.tone(40, 1.2, "sine", 0.35, 0.4, 25);
    this.noise(0.5, 0.25, 0.4, { type: "lowpass", from: 300 });
    // charging whine, two detuned sweeps
    this.tone(160, 2.9, "sine", 0.06, 1.8, 1500, 0.4);
    this.tone(163, 2.9, "triangle", 0.04, 1.85, 1520, 0.4);
    this.tone(48, 3.0, "sine", 0.14, 1.8, 70);
    for (let i = 0; i < 36; i++) {
      const at = 1.9 + Math.random() * 2.6;
      this.tone(2500 + Math.random() * 4000, 0.05, "sine", 0.02, at, 800);
    }
    // fire
    this.noise(0.35, 0.34, 4.6, { type: "highpass", from: 2500, to: 400 });
    this.tone(95, 1.8, "sawtooth", 0.11, 4.6, 62);
    this.tone(52, 2.2, "sine", 0.3, 4.6, 40);
    this.tone(2400, 1.6, "sine", 0.035, 4.65, 1700);
    this.noise(1.9, 0.14, 4.7, { type: "bandpass", from: 900, to: 1400, q: 2 });
    // the screen cracks
    for (let i = 0; i < 8; i++) this.noise(0.03, 0.12, 5.0 + i * 0.07, { type: "highpass", from: 3000 });
    // white out
    this.noise(1.3, 0.32, 6.5, { type: "lowpass", from: 400, to: 5000 });
    this.tone(36, 1.6, "sine", 0.32, 6.6, 24);
  }

  teleport() {
    [1500, 2000, 2600].forEach((f, i) => this.tone(f, 0.08, "sine", 0.05, i * 0.05));
    this.noise(0.25, 0.06, 0, { type: "highpass", from: 4000 });
  }
  rasengan() {
    this.tone(300, 0.55, "sine", 0.08, 0, 900);
    this.noise(0.55, 0.12, 0, { type: "bandpass", from: 600, to: 2200, q: 2 });
  }

  // Win cutscene: slash, hit, and a chirpy 8-bit fanfare.
  slash() {
    this.noise(0.25, 0.22, 0, { type: "highpass", from: 3000, to: 500 });
    this.tone(1800, 0.15, "sine", 0.05, 0.02, 400);
  }
  hit() {
    this.tone(120, 0.25, "square", 0.12, 0, 40);
    this.noise(0.2, 0.2, 0, { type: "lowpass", from: 900 });
  }
  fanfare() {
    const notes = [523, 659, 784, 1046, 784, 1046, 1318];
    notes.forEach((n, i) => this.tone(n, 0.16, "square", 0.07, i * 0.11));
    this.tone(1046, 0.9, "square", 0.06, 0.8);
    this.tone(1318, 0.9, "square", 0.05, 0.8);
    this.tone(1568, 0.9, "triangle", 0.05, 0.8);
  }
  gameOver() {
    [392, 349, 311, 261].forEach((n, i) => this.tone(n, 0.28, "square", 0.06, i * 0.26));
    this.tone(130, 1.2, "triangle", 0.06, 1.0, 65);
  }
}

export const audio = new Synth();
