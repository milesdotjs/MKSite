// Canvas effects for the Mustang and Pikachu finishers. Same shape as fx.ts:
// plain 2D canvas, DPR-aware, no filters.

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

// ------------------------------------------------------------ Flame Alchemy
interface Tongue { x: number; y: number; vy: number; life: number; max: number; w: number; sway: number; hue: number }
interface Ember { x: number; y: number; vx: number; vy: number; life: number; size: number }

export class FlameFx extends CanvasFx {
  /** 0..1: how much of the screen is burning */
  intensity = 0;
  /** fraction of the height the sea of fire reaches */
  sea = 0;
  /** where the first burst starts, fractions of the canvas */
  origin = { x: 0.5, y: 0.6 };
  private tongues: Tongue[] = [];
  private embers: Ember[] = [];
  private t = 0;
  private bursts: { x: number; y: number; r: number; a: number }[] = [];

  burst(strength = 1) {
    this.bursts.push({ x: this.origin.x * this.w, y: this.origin.y * this.h, r: 10, a: 1 * strength });
    for (let i = 0; i < 40 * strength; i++) {
      const ang = Math.random() * Math.PI * 2, sp = 200 + Math.random() * 500;
      this.embers.push({ x: this.origin.x * this.w, y: this.origin.y * this.h, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 150, life: 1, size: 2 + Math.random() * 3 });
    }
  }
  protected step(dt: number) {
    this.t += dt;
    const want = Math.round(this.intensity * 140);
    while (this.tongues.length < want) {
      const max = 0.6 + Math.random() * 0.9;
      this.tongues.push({ x: Math.random() * this.w, y: this.h + 10, vy: -(120 + Math.random() * 260), life: max, max, w: 10 + Math.random() * 30, sway: Math.random() * 6, hue: 20 + Math.random() * 30 });
    }
    for (const f of this.tongues) {
      f.y += f.vy * dt * (0.6 + this.intensity);
      f.life -= dt;
      if (f.life <= 0 || f.y < -80) {
        f.x = Math.random() * this.w; f.y = this.h + 10; f.life = f.max;
      }
    }
    if (this.tongues.length > want) this.tongues.length = want;
    for (const e of this.embers) {
      e.vy -= 80 * dt; e.x += e.vx * dt; e.y += e.vy * dt; e.life -= dt * 0.9;
    }
    this.embers = this.embers.filter((e) => e.life > 0);
    if (this.intensity > 0.3 && Math.random() < this.intensity) {
      this.embers.push({ x: Math.random() * this.w, y: this.h, vx: (Math.random() - 0.5) * 60, vy: -(150 + Math.random() * 250), life: 1, size: 1.5 + Math.random() * 2.5 });
    }
    for (const b of this.bursts) { b.r += 900 * dt; b.a -= dt * 2.2; }
    this.bursts = this.bursts.filter((b) => b.a > 0);
  }
  protected draw(c: CanvasRenderingContext2D) {
    // sea of fire along the bottom
    if (this.sea > 0) {
      const top = this.h * (1 - this.sea);
      const g = c.createLinearGradient(0, top, 0, this.h);
      g.addColorStop(0, "rgba(255, 120, 20, 0)");
      g.addColorStop(0.5, "rgba(255, 140, 30, 0.75)");
      g.addColorStop(1, "rgba(255, 240, 180, 0.95)");
      c.fillStyle = g;
      c.fillRect(0, top, this.w, this.h - top);
    }
    for (const f of this.tongues) {
      const p = f.life / f.max;
      const h = (60 + f.w * 3) * (0.4 + p);
      const x = f.x + Math.sin(this.t * 6 + f.sway) * 10;
      const w = f.w * (0.5 + p * 0.6);
      c.globalAlpha = Math.min(1, p * 1.4) * (0.5 + this.intensity * 0.5);
      c.fillStyle = `hsl(${f.hue} 100% ${45 + p * 25}%)`;
      c.beginPath();
      c.moveTo(x - w / 2, f.y);
      c.quadraticCurveTo(x - w * 0.6, f.y - h * 0.5, x, f.y - h);
      c.quadraticCurveTo(x + w * 0.6, f.y - h * 0.5, x + w / 2, f.y);
      c.fill();
      c.fillStyle = `hsl(${f.hue + 25} 100% ${70 + p * 20}%)`;
      c.beginPath();
      c.moveTo(x - w / 4, f.y);
      c.quadraticCurveTo(x - w * 0.3, f.y - h * 0.3, x, f.y - h * 0.6);
      c.quadraticCurveTo(x + w * 0.3, f.y - h * 0.3, x + w / 4, f.y);
      c.fill();
    }
    c.globalAlpha = 1;
    for (const e of this.embers) {
      c.fillStyle = `rgba(255, ${180 + Math.round(60 * e.life)}, 80, ${Math.min(1, e.life)})`;
      c.fillRect(e.x, e.y, e.size, e.size);
    }
    for (const b of this.bursts) {
      c.strokeStyle = `rgba(255, 220, 120, ${Math.max(0, b.a)})`;
      c.lineWidth = 14 * b.a + 2;
      c.beginPath(); c.arc(b.x, b.y, b.r, 0, Math.PI * 2); c.stroke();
    }
  }
}

// ------------------------------------------------------------ Thunderbolt
interface Bolt { pts: { x: number; y: number }[]; life: number; width: number; branches: { x: number; y: number }[][] }
interface Spark { x: number; y: number; vx: number; vy: number; life: number }

export class BoltFx extends CanvasFx {
  /** cheeks, fractions of the canvas; sparks jump out of them while charge > 0 */
  cheeks: { x: number; y: number }[] = [];
  charge = 0;
  /** sky tint 0..1 */
  tint = 0;
  private bolts: Bolt[] = [];
  private sparks: Spark[] = [];
  private t = 0;

  private jag(x1: number, y1: number, x2: number, y2: number, spread: number) {
    const pts = [{ x: x1, y: y1 }];
    const n = 10 + Math.floor(Math.random() * 8);
    for (let i = 1; i < n; i++) {
      const t = i / n;
      pts.push({ x: x1 + (x2 - x1) * t + (Math.random() - 0.5) * spread, y: y1 + (y2 - y1) * t + (Math.random() - 0.5) * spread * 0.4 });
    }
    pts.push({ x: x2, y: y2 });
    return pts;
  }
  /** a bolt from the top of the screen down to (tx, ty) in fractions */
  strike(tx: number, ty: number, width = 6, hold = 1) {
    const x2 = tx * this.w, y2 = ty * this.h;
    const x1 = x2 + (Math.random() - 0.5) * this.w * 0.6;
    const pts = this.jag(x1, -20, x2, y2, this.w * 0.12);
    const branches: { x: number; y: number }[][] = [];
    for (let i = 0; i < 4; i++) {
      const p = pts[2 + Math.floor(Math.random() * (pts.length - 4))];
      branches.push(this.jag(p.x, p.y, p.x + (Math.random() - 0.5) * this.w * 0.5, p.y + Math.random() * this.h * 0.35, this.w * 0.06));
    }
    this.bolts.push({ pts, life: hold, width, branches });
  }
  /** a bolt across the whole screen, for the big finish */
  storm(n: number) {
    for (let i = 0; i < n; i++) this.strike(Math.random(), 0.7 + Math.random() * 0.4, 3 + Math.random() * 5);
  }
  protected step(dt: number) {
    this.t += dt;
    for (const b of this.bolts) b.life -= dt * 4;
    this.bolts = this.bolts.filter((b) => b.life > 0);
    if (this.charge > 0) {
      for (const ch of this.cheeks) {
        if (Math.random() < this.charge * 0.9) {
          const ang = Math.random() * Math.PI * 2, sp = 60 + Math.random() * 160 * this.charge;
          this.sparks.push({ x: ch.x * this.w, y: ch.y * this.h, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, life: 0.25 + Math.random() * 0.3 });
        }
      }
    }
    for (const s of this.sparks) { s.x += s.vx * dt; s.y += s.vy * dt; s.life -= dt; }
    this.sparks = this.sparks.filter((s) => s.life > 0);
  }
  protected draw(c: CanvasRenderingContext2D) {
    if (this.tint > 0) {
      c.fillStyle = `rgba(255, 235, 90, ${this.tint * 0.35})`;
      c.fillRect(-20, -20, this.w + 40, this.h + 40);
    }
    c.lineCap = "round"; c.lineJoin = "round";
    for (const s of this.sparks) {
      c.strokeStyle = `rgba(255, 250, 160, ${Math.min(1, s.life * 3)})`;
      c.lineWidth = 2;
      c.beginPath(); c.moveTo(s.x, s.y); c.lineTo(s.x - s.vx * 0.03, s.y - s.vy * 0.03); c.stroke();
    }
    for (const b of this.bolts) {
      const a = Math.max(0, b.life);
      const paths = [b.pts, ...b.branches];
      for (const [i, pts] of paths.entries()) {
        const wmul = i === 0 ? 1 : 0.45;
        for (const [col, w] of [[`rgba(255, 230, 80, ${a * 0.35})`, b.width * 4 * wmul], [`rgba(255, 245, 160, ${a * 0.8})`, b.width * 1.6 * wmul], [`rgba(255, 255, 255, ${a})`, b.width * 0.6 * wmul]] as [string, number][]) {
          c.strokeStyle = col; c.lineWidth = w;
          c.beginPath();
          pts.forEach((p, k) => (k === 0 ? c.moveTo(p.x, p.y) : c.lineTo(p.x, p.y)));
          c.stroke();
        }
      }
    }
  }
}
