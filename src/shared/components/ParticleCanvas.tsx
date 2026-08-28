import { useEffect, useRef } from "react";

interface ParticleCanvasProps {
  density?: number;
  className?: string;
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  mark: boolean;
  near: number;
}

// Réseau de points façon schéma technique, en fond du hero — dérive lentement,
// se relie par des lignes selon la proximité, réagit doucement au curseur.
export const ParticleCanvas: React.FC<ParticleCanvasProps> = ({ density = 34, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const accent = getComputedStyle(document.documentElement).getPropertyValue("--color-primary").trim() || "#94bce3";

    let w = 0, h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let nodes: Node[] = [];
    const mouse = { x: -9999, y: -9999 };

    const seed = () => {
      const n = Math.max(10, Math.round(density * Math.min(1.3, w / 1100)));
      nodes = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        r: Math.random() < 0.22 ? 2 : 1.2,
        mark: Math.random() < 0.16,
        near: 0,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };

    resize();
    window.addEventListener("resize", resize);
    parent.addEventListener("mousemove", onMove);
    parent.addEventListener("mouseleave", onLeave);

    const LINK = 168, PULL = 190;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of nodes) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        const dx = mouse.x - p.x, dy = mouse.y - p.y;
        const d = Math.hypot(dx, dy);
        p.near = d < PULL ? 1 - d / PULL : 0;
      }
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d > LINK) continue;
          const base = (1 - d / LINK) * 0.16;
          const boost = Math.max(a.near, b.near) * 0.45;
          ctx.strokeStyle = accent;
          ctx.globalAlpha = Math.min(0.7, base + boost * base * 6);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      for (const p of nodes) {
        const a = 0.22 + p.near * 0.7;
        ctx.globalAlpha = Math.min(0.95, a);
        ctx.fillStyle = accent;
        const s = p.r + p.near * 1.6;
        ctx.fillRect(p.x - s, p.y - s, s * 2, s * 2);
        if (p.mark) {
          ctx.strokeStyle = accent;
          ctx.globalAlpha = Math.min(0.6, 0.14 + p.near * 0.5);
          const m = 7 + p.near * 4;
          ctx.beginPath();
          ctx.moveTo(p.x - m, p.y);
          ctx.lineTo(p.x + m, p.y);
          ctx.moveTo(p.x, p.y - m);
          ctx.lineTo(p.x, p.y + m);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(draw);
    };

    if (!reduced) draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      parent.removeEventListener("mousemove", onMove);
      parent.removeEventListener("mouseleave", onLeave);
    };
  }, [density]);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
};

export default ParticleCanvas;
