// Canvas particle system for Senbonzakura's petals. Plain 2D canvas, no
// filters, so it stays cheap on phones. Modes:
//   drift    - a few petals crossing the stage (ambient, scales with pressure)
//   storm    - the Bankai: thousands sweeping in from both sides
//   converge - the last beat: everything rushes the camera

export type PetalMode = "drift" | "storm" | "converge" | "wind";

interface Petal {
  x: number; y: number; vx: number; vy: number;
  r: number; vr: number; s: number; hue: number; life: number; z: number;
}

export class PetalStorm {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private petals: Petal[] = [];
  private raf = 0;
  private last = 0;
  private w = 0;
  private h = 0;
  private dpr = 1;
  mode: PetalMode = "drift";
  target = 0; // desired petal count
  wind = 1;
  shake = 0;
  private density = 1; // fewer petals on small screens
  private ro: ResizeObserver | null = null;

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
    const rect = this.canvas.getBoundingClientRect();
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    this.w = Math.max(1, rect.width);
    this.h = Math.max(1, rect.height);
    this.canvas.width = Math.round(this.w * this.dpr);
    this.canvas.height = Math.round(this.h * this.dpr);
    this.density = Math.min(1, Math.max(0.3, (this.w * this.h) / (1024 * 768)));
  }

  start() {
    if (this.raf) return;
    this.last = performance.now();
    const loop = (t: number) => {
      const dt = Math.min(0.05, (t - this.last) / 1000);
      this.last = t;
      this.step(dt);
      this.draw();
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.ro?.disconnect();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  clear() {
    this.petals = [];
  }

  private spawn(): Petal {
    const side = Math.random() < 0.5 ? -1 : 1;
    const base = 0.5 + Math.random() * 0.8;
    if (this.mode === "wind") {
      // dust streaks blowing right-to-left, the direction his cape flies
      const z = Math.random();
      return {
        x: this.w + 20 + Math.random() * this.w * 0.3,
        y: Math.random() * this.h,
        vx: -(260 + z * 520), vy: (Math.random() - 0.5) * 30,
        r: 0, vr: 0, s: 0.5 + z, hue: 38 + Math.random() * 10, life: 1, z,
      };
    }
    if (this.mode === "drift") {
      return {
        x: -20 - Math.random() * this.w * 0.2,
        y: Math.random() * this.h,
        vx: 40 + Math.random() * 60, vy: 10 + Math.random() * 25,
        r: Math.random() * Math.PI * 2, vr: (Math.random() - 0.5) * 3,
        s: base * 0.8, hue: 320 + Math.random() * 25, life: 1, z: Math.random(),
      };
    }
    // storm & converge: enter from both edges, fast
    const speed = 400 + Math.random() * 700;
    return {
      x: side < 0 ? -30 : this.w + 30,
      y: Math.random() * this.h * 1.2 - this.h * 0.1,
      vx: -side * speed, vy: (Math.random() - 0.5) * 240,
      r: Math.random() * Math.PI * 2, vr: (Math.random() - 0.5) * 14,
      s: base, hue: 318 + Math.random() * 30, life: 1, z: Math.random(),
    };
  }

  private step(dt: number) {
    const want = Math.round(this.target * this.density);
    if (this.petals.length < want) {
      const n = Math.min(want - this.petals.length, this.mode === "drift" ? 2 : this.mode === "wind" ? 3 : 60);
      for (let i = 0; i < n; i++) this.petals.push(this.spawn());
    }
    const cx = this.w / 2;
    const cy = this.h / 2;
    for (let i = this.petals.length - 1; i >= 0; i--) {
      const p = this.petals[i];
      if (this.mode === "converge") {
        const dx = cx - p.x, dy = cy - p.y;
        const d = Math.hypot(dx, dy) + 1;
        p.vx += (dx / d) * 2600 * dt;
        p.vy += (dy / d) * 2600 * dt;
        p.s += dt * 1.8;
      } else if (this.mode === "storm") {
        p.vy += Math.sin(p.x * 0.01 + p.r) * 120 * dt;
      } else if (this.mode === "wind") {
        p.vy += Math.sin(p.x * 0.02) * 40 * dt;
      } else {
        p.vy += Math.sin(p.r * 2) * 12 * dt;
        p.vx += Math.cos(p.r) * 6 * dt;
      }
      p.x += p.vx * this.wind * dt;
      p.y += p.vy * dt;
      p.r += p.vr * dt;
      const out = p.x < -80 || p.x > this.w + 80 || p.y < -80 || p.y > this.h + 80;
      if (out || (this.mode === "converge" && Math.hypot(cx - p.x, cy - p.y) < 8)) {
        if (this.petals.length > want) this.petals.splice(i, 1);
        else this.petals[i] = this.spawn();
      }
    }
    if (this.petals.length > want + 40) this.petals.length = want;
  }

  private draw() {
    const c = this.ctx;
    c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    c.clearRect(0, 0, this.w, this.h);
    const sx = this.shake ? (Math.random() - 0.5) * this.shake : 0;
    const sy = this.shake ? (Math.random() - 0.5) * this.shake : 0;
    if (this.mode === "wind") {
      c.lineCap = "round";
      for (const p of this.petals) {
        const len = 14 + p.z * 46;
        c.strokeStyle = `hsl(${p.hue} 80% ${78 + p.z * 15}% / ${0.18 + p.z * 0.35})`;
        c.lineWidth = 1 + p.z * 1.5;
        c.beginPath();
        c.moveTo(p.x + sx, p.y + sy);
        c.lineTo(p.x + sx + len, p.y + sy + (p.vy / 60));
        c.stroke();
      }
      return;
    }
    for (const p of this.petals) {
      const size = (5 + p.z * 7) * p.s;
      c.save();
      c.translate(p.x + sx, p.y + sy);
      c.rotate(p.r);
      c.fillStyle = `hsl(${p.hue} 95% ${72 + p.z * 18}%)`;
      c.globalAlpha = 0.75 + p.z * 0.25;
      // a lopsided petal: two quadratic curves
      c.beginPath();
      c.moveTo(0, -size);
      c.quadraticCurveTo(size * 0.9, -size * 0.2, 0, size);
      c.quadraticCurveTo(-size * 0.7, size * 0.1, 0, -size);
      c.fill();
      c.restore();
    }
    c.globalAlpha = 1;
  }
}
