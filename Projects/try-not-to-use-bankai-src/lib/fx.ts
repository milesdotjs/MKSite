// Canvas effects for the Pain and Piccolo finishers. Plain 2D canvas, no
// filters, DPR-aware, same shape as PetalStorm.

abstract class CanvasFx {
  protected canvas: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;
  protected w = 0;
  protected h = 0;
  protected dpr = 1;
  private raf = 0;
  private last = 0;
  private ro: ResizeObserver | null = null;
  shake = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.resize();
    if (typeof ResizeObserver !== "undefined") {
      this.ro = new ResizeObserver(() => this.resize());
      this.ro.observe(canvas);
    }
  }
  private resize() {
    const r = this.canvas.getBoundingClientRect();
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    this.w = Math.max(1, r.width);
    this.h = Math.max(1, r.height);
    this.canvas.width = Math.round(this.w * this.dpr);
    this.canvas.height = Math.round(this.h * this.dpr);
  }
  start() {
    if (this.raf) return;
    this.last = performance.now();
    const loop = (t: number) => {
      const dt = Math.min(0.05, (t - this.last) / 1000);
      this.last = t;
      this.step(dt);
      const c = this.ctx;
      c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      c.clearRect(0, 0, this.w, this.h);
      if (this.shake) c.translate((Math.random() - 0.5) * this.shake, (Math.random() - 0.5) * this.shake);
      this.draw(c);
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }
  stop() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.ro?.disconnect();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  protected abstract step(dt: number): void;
  protected abstract draw(c: CanvasRenderingContext2D): void;
}

// ------------------------------------------------------------ Almighty Push
interface Ring { r: number; v: number; a: number; width: number }
interface Rock { x: number; y: number; vx: number; vy: number; s: number; rot: number; vr: number; tone: number }

export class Shockwave extends CanvasFx {
  private rings: Ring[] = [];
  private rocks: Rock[] = [];
  /** where the push originates, as fractions of the canvas */
  origin = { x: 0.5, y: 0.6 };
  /** rocks per second while > 0 */
  debrisRate = 0;
  private acc = 0;
  gravity = 0; // >0 pulls rocks up/out harder (the push)

  ring(strength = 1) {
    this.rings.push({ r: 4, v: 900 * strength, a: 0.9, width: 6 + 10 * strength });
  }
  burst(n: number) {
    for (let i = 0; i < n; i++) this.rocks.push(this.spawn(true));
  }
  private spawn(fromCentre: boolean): Rock {
    const ox = this.origin.x * this.w, oy = this.origin.y * this.h;
    const ang = fromCentre ? Math.random() * Math.PI * 2 : -Math.PI / 2 + (Math.random() - 0.5) * 1.2;
    const sp = 300 + Math.random() * 700;
    const x = fromCentre ? ox + (Math.random() - 0.5) * 40 : Math.random() * this.w;
    const y = fromCentre ? oy : this.h + 20;
    return { x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - (fromCentre ? 0 : 200), s: 4 + Math.random() * 14, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 12, tone: Math.random() };
  }
  protected step(dt: number) {
    for (const r of this.rings) { r.r += r.v * dt; r.a -= dt * 0.9; }
    this.rings = this.rings.filter((r) => r.a > 0);
    if (this.debrisRate > 0) {
      this.acc += this.debrisRate * dt;
      while (this.acc >= 1) { this.rocks.push(this.spawn(false)); this.acc -= 1; }
    }
    const ox = this.origin.x * this.w, oy = this.origin.y * this.h;
    for (const k of this.rocks) {
      if (this.gravity > 0) {
        const dx = k.x - ox, dy = k.y - oy, d = Math.hypot(dx, dy) + 1;
        k.vx += (dx / d) * this.gravity * dt;
        k.vy += (dy / d) * this.gravity * dt;
      } else {
        k.vy += 500 * dt;
      }
      k.x += k.vx * dt; k.y += k.vy * dt; k.rot += k.vr * dt;
    }
    this.rocks = this.rocks.filter((k) => k.x > -60 && k.x < this.w + 60 && k.y > -60 && k.y < this.h + 60);
  }
  protected draw(c: CanvasRenderingContext2D) {
    const ox = this.origin.x * this.w, oy = this.origin.y * this.h;
    for (const r of this.rings) {
      c.beginPath();
      c.ellipse(ox, oy, r.r, r.r * 0.45, 0, 0, Math.PI * 2);
      c.strokeStyle = `rgba(214, 190, 255, ${Math.max(0, r.a)})`;
      c.lineWidth = r.width;
      c.stroke();
      c.strokeStyle = `rgba(255, 255, 255, ${Math.max(0, r.a) * 0.6})`;
      c.lineWidth = Math.max(1, r.width * 0.3);
      c.stroke();
    }
    for (const k of this.rocks) {
      c.save();
      c.translate(k.x, k.y);
      c.rotate(k.rot);
      const g = Math.round(40 + k.tone * 50);
      c.fillStyle = `rgb(${g + 30}, ${g}, ${g - 10})`;
      c.fillRect(-k.s / 2, -k.s / 2, k.s, k.s * 0.8);
      c.fillStyle = `rgb(${g + 60}, ${g + 25}, ${g})`;
      c.fillRect(-k.s / 2, -k.s / 2, k.s * 0.5, k.s * 0.35);
      c.restore();
    }
  }
}

// ------------------------------------------------------------ Special Beam Cannon
interface Spark { x: number; y: number; vx: number; vy: number; life: number; size: number }

export class BeamFx extends CanvasFx {
  /** fingertip, as fractions of the canvas */
  tip = { x: 0.53, y: 0.55 };
  /** 0..1 while charging */
  charge = 0;
  /** true once fired */
  firing = false;
  beamWidth = 0;
  cracks = 0;
  private sparks: Spark[] = [];
  private t = 0;
  private crackLines: { x1: number; y1: number; x2: number; y2: number }[] = [];

  fire() {
    this.firing = true;
    this.beamWidth = 0;
  }
  crack(level: number) {
    this.cracks = level;
    if (!this.crackLines.length) {
      const cx = this.w * 0.98, cy = this.tip.y * this.h;
      for (let i = 0; i < 26; i++) {
        let x = cx, y = cy;
        const ang = Math.random() * Math.PI * 2;
        for (let s = 0; s < 4 + Math.random() * 5; s++) {
          const len = 30 + Math.random() * 90;
          const a2 = ang + (Math.random() - 0.5) * 1.2;
          const nx = x + Math.cos(a2) * len, ny = y + Math.sin(a2) * len;
          this.crackLines.push({ x1: x, y1: y, x2: nx, y2: ny });
          x = nx; y = ny;
        }
      }
    }
  }
  protected step(dt: number) {
    this.t += dt;
    const tx = this.tip.x * this.w, ty = this.tip.y * this.h;
    if (this.charge > 0 && !this.firing) {
      const n = Math.round(2 + this.charge * 10);
      for (let i = 0; i < n; i++) {
        const ang = Math.random() * Math.PI * 2, d = 120 + Math.random() * 260;
        this.sparks.push({ x: tx + Math.cos(ang) * d, y: ty + Math.sin(ang) * d, vx: 0, vy: 0, life: 1, size: 1 + Math.random() * 3 });
      }
    }
    for (const s of this.sparks) {
      const dx = tx - s.x, dy = ty - s.y, d = Math.hypot(dx, dy) + 1;
      s.vx += (dx / d) * 2400 * dt; s.vy += (dy / d) * 2400 * dt;
      s.x += s.vx * dt; s.y += s.vy * dt;
      s.life -= dt * (d < 12 ? 6 : 0.6);
    }
    this.sparks = this.sparks.filter((s) => s.life > 0);
    if (this.firing) this.beamWidth = Math.min(1, this.beamWidth + dt * 5);
  }
  protected draw(c: CanvasRenderingContext2D) {
    const tx = this.tip.x * this.w, ty = this.tip.y * this.h;
    // charge glow at the fingertips
    if (this.charge > 0 && !this.firing) {
      const r = 6 + this.charge * 34 + Math.sin(this.t * 30) * 3;
      const g = c.createRadialGradient(tx, ty, 0, tx, ty, r);
      g.addColorStop(0, "rgba(255,255,220,0.95)");
      g.addColorStop(0.4, `rgba(255,230,90,${0.6 * this.charge})`);
      g.addColorStop(1, "rgba(255,180,40,0)");
      c.fillStyle = g;
      c.beginPath(); c.arc(tx, ty, r, 0, Math.PI * 2); c.fill();
    }
    for (const s of this.sparks) {
      c.fillStyle = `rgba(255, 240, 150, ${Math.min(1, s.life)})`;
      c.fillRect(s.x - s.size / 2, s.y - s.size / 2, s.size, s.size);
    }
    if (this.firing) {
      const W = this.beamWidth;
      const len = this.w + 100;
      // outer glow, core, then two helices spiralling around it
      c.lineCap = "round";
      c.strokeStyle = `rgba(255, 170, 40, ${0.35 * W})`; c.lineWidth = 46 * W;
      c.beginPath(); c.moveTo(tx, ty); c.lineTo(tx + len, ty); c.stroke();
      c.strokeStyle = `rgba(255, 220, 90, ${0.8 * W})`; c.lineWidth = 18 * W;
      c.beginPath(); c.moveTo(tx, ty); c.lineTo(tx + len, ty); c.stroke();
      c.strokeStyle = `rgba(255, 255, 240, ${W})`; c.lineWidth = 7 * W;
      c.beginPath(); c.moveTo(tx, ty); c.lineTo(tx + len, ty); c.stroke();
      const phase = this.t * 40;
      for (const off of [0, Math.PI]) {
        c.beginPath();
        for (let x = 0; x <= len; x += 6) {
          const y = ty + Math.sin(x * 0.045 + phase + off) * 22 * W;
          if (x === 0) c.moveTo(tx + x, y); else c.lineTo(tx + x, y);
        }
        c.strokeStyle = off === 0 ? `rgba(255, 245, 160, ${0.95 * W})` : `rgba(255, 150, 60, ${0.9 * W})`;
        c.lineWidth = 5 * W;
        c.stroke();
      }
    }
    if (this.cracks > 0) {
      c.strokeStyle = `rgba(255,255,255,${Math.min(1, this.cracks)})`;
      c.lineWidth = 2;
      c.beginPath();
      for (const l of this.crackLines) { c.moveTo(l.x1, l.y1); c.lineTo(l.x2, l.y2); }
      c.stroke();
      c.strokeStyle = `rgba(0,0,0,${Math.min(1, this.cracks) * 0.8})`;
      c.lineWidth = 1;
      c.beginPath();
      for (const l of this.crackLines) { c.moveTo(l.x1 + 1, l.y1 + 1); c.lineTo(l.x2 + 1, l.y2 + 1); }
      c.stroke();
    }
  }
}
