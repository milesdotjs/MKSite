/* ============================================================
   7-3 — sound

   Two pulse channels and a noise channel, which is roughly what
   the hardware had. Everything is synthesised; there are no audio
   files to ship. Nothing starts until the first user gesture.
   ============================================================ */

export class Sound {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.enabled = true;
    this.musicOn = true;
    this._musicTimer = null;
    this._noiseBuf = null;
  }

  /** Must be called from a user gesture. */
  resume() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.18;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
  }

  get ready() {
    return !!this.ctx && this.enabled;
  }

  /** A single square-wave blip. */
  blip(freq, dur = 0.07, { type = 'square', vol = 1, slide = 0, delay = 0 } = {}) {
    if (!this.ready) return;
    const t = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(20, freq + slide), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.5 * vol, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g).connect(this.master);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  /** White-noise burst — hits, static, the printer. */
  noise(dur = 0.08, { vol = 1, hp = 400, delay = 0 } = {}) {
    if (!this.ready) return;
    if (!this._noiseBuf) {
      const n = this.ctx.sampleRate * 0.5;
      const buf = this.ctx.createBuffer(1, n, this.ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
      this._noiseBuf = buf;
    }
    const t = this.ctx.currentTime + delay;
    const src = this.ctx.createBufferSource();
    src.buffer = this._noiseBuf;
    const f = this.ctx.createBiquadFilter();
    f.type = 'highpass';
    f.frequency.value = hp;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.4 * vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f).connect(g).connect(this.master);
    src.start(t);
    src.stop(t + dur + 0.02);
  }

  /* ---------- named cues ---------- */

  cursor() {
    this.blip(880, 0.04, { vol: 0.5 });
  }

  confirm() {
    this.blip(660, 0.05);
    this.blip(990, 0.07, { delay: 0.05 });
  }

  cancel() {
    this.blip(420, 0.06, { slide: -180 });
  }

  hit() {
    this.noise(0.09, { hp: 900 });
    this.blip(180, 0.06, { slide: -90, vol: 0.7 });
  }

  crit() {
    this.noise(0.14, { hp: 1400, vol: 1.2 });
    this.blip(320, 0.12, { slide: -220 });
  }

  hurt() {
    this.blip(240, 0.12, { slide: -140, type: 'sawtooth', vol: 0.8 });
  }

  coin() {
    this.blip(1046, 0.05);
    this.blip(1568, 0.11, { delay: 0.05 });
  }

  levelUp() {
    [523, 659, 784, 1046].forEach((f, i) => this.blip(f, 0.13, { delay: i * 0.09 }));
  }

  encounter() {
    [440, 0, 440, 0, 587, 0, 740].forEach((f, i) => f && this.blip(f, 0.08, { delay: i * 0.055 }));
  }

  step() {
    this.noise(0.02, { hp: 2200, vol: 0.25 });
  }

  /* ---------- music ----------
     A short looping bass + arpeggio figure. Deliberately plain:
     it should read as hold music, because it is. */

  startMusic(mood = 'day') {
    if (!this.ready || !this.musicOn || this._musicTimer) return;
    const MOODS = {
      day: { root: 220, seq: [0, 4, 7, 11, 7, 4], step: 0.19, type: 'square' },
      overtime: { root: 196, seq: [0, 3, 7, 10, 7, 3], step: 0.15, type: 'square' },
      night: { root: 165, seq: [0, 5, 7, 12, 7, 5], step: 0.24, type: 'triangle' },
      battle: { root: 262, seq: [0, 7, 12, 7, 3, 7], step: 0.12, type: 'square' },
    };
    const m = MOODS[mood] || MOODS.day;
    this._mood = mood;
    let i = 0;
    const tick = () => {
      if (!this.musicOn || !this.ready) return;
      const semi = m.seq[i % m.seq.length];
      const f = m.root * Math.pow(2, semi / 12);
      this.blip(f, m.step * 0.8, { vol: 0.28, type: m.type });
      if (i % 4 === 0) this.blip(m.root / 2, m.step * 1.6, { vol: 0.34, type: 'triangle' });
      i++;
    };
    tick();
    this._musicTimer = setInterval(tick, m.step * 1000);
  }

  stopMusic() {
    if (this._musicTimer) clearInterval(this._musicTimer);
    this._musicTimer = null;
  }

  setMood(mood) {
    if (this._mood === mood) return;
    this.stopMusic();
    this.startMusic(mood);
  }

  toggleMusic() {
    this.musicOn = !this.musicOn;
    if (!this.musicOn) this.stopMusic();
    else this.startMusic(this._mood || 'day');
    return this.musicOn;
  }
}

export const sfx = new Sound();
