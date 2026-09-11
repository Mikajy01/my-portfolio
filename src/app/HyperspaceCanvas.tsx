import { useEffect, useRef } from "react";
import { MAX_DEPTH, genericSpeed, getDestinationGeometry } from "./hyperspaceGeometry";

interface Star {
  x: number;
  y: number;
  z: number;
  bright: boolean;
}

const STAR_COUNT = 420;

// Couleurs figées (pas de var(--color-*)) : cet effet doit toujours se lire
// comme "l'espace", même si le site est en thème clair.
const COLOR_BG = "#172431";
const COLOR_STAR = (a: number) => `rgba(148, 188, 227, ${a})`;
const COLOR_STAR_BRIGHT = (a: number) => `rgba(255, 255, 255, ${a})`;

function spawnStar(): Star {
  const angle = Math.random() * Math.PI * 2;
  const radius = Math.sqrt(Math.random());
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
    z: MAX_DEPTH * (0.35 + Math.random() * 0.65),
    bright: Math.random() < 0.16,
  };
}

interface HyperspaceCanvasProps {
  /** Horodatage (performance.now()) du clic sur "Entrer", ou null tant que ça n'a pas eu lieu. */
  jumpStart: number | null;
  className?: string;
}

// Simulation d'étoiles en perspective réelle (projection x/z, y/z) plutôt que
// des traits plats tournés au hasard, plus une étoile de destination dédiée
// (le portfolio) qui reste quasiment centrée — donc ne "strie" jamais comme
// les autres, elle grossit simplement à mesure qu'on s'en approche. Sa
// géométrie vient de hyperspaceGeometry.ts, partagée avec App.tsx qui s'en
// sert pour révéler le vrai site à travers le même point.
export const HyperspaceCanvas: React.FC<HyperspaceCanvasProps> = ({ jumpStart, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const jumpStartRef = useRef<number | null>(jumpStart);

  useEffect(() => {
    jumpStartRef.current = jumpStart;
  }, [jumpStart]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let w = 0, h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const stars: Star[] = Array.from({ length: STAR_COUNT }, spawnStar);
    let raf = 0;
    const t0 = performance.now();

    const draw = () => {
      ctx.fillStyle = COLOR_BG;
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const focal = Math.min(w, h) * 0.55;

      const elapsed = jumpStartRef.current !== null ? performance.now() - jumpStartRef.current : null;
      const speed = genericSpeed(elapsed);

      for (const star of stars) {
        const prevZ = star.z;
        star.z -= speed;

        if (star.z <= 0.05) {
          const fresh = spawnStar();
          star.x = fresh.x;
          star.y = fresh.y;
          star.z = MAX_DEPTH;
          star.bright = fresh.bright;
          continue;
        }

        const sx = cx + (star.x / star.z) * focal;
        const sy = cy + (star.y / star.z) * focal;
        const psx = cx + (star.x / prevZ) * focal;
        const psy = cy + (star.y / prevZ) * focal;

        if (sx < -80 || sx > w + 80 || sy < -80 || sy > h + 80) continue;

        const proximity = 1 - star.z / MAX_DEPTH;
        const alpha = 0.25 + proximity * 0.75;
        const width = 0.6 + proximity * (star.bright ? 3.2 : 1.8);

        ctx.strokeStyle = star.bright ? COLOR_STAR_BRIGHT(alpha) : COLOR_STAR(alpha);
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(psx, psy);
        ctx.lineTo(sx, sy);
        ctx.stroke();
      }

      // L'étoile de destination — quasi centrée, elle ne strie pas : elle
      // grossit simplement à mesure qu'on s'en approche. Rayon volontairement
      // plafonné (contrairement au hublot de App.tsx, qui lui grandit jusqu'à
      // couvrir tout l'écran) : ça doit rester une étoile brillante, pas un
      // disque plein.
      const { dx, dy, proximity: destProximity } = getDestinationGeometry(elapsed, w, h);
      const twinkle = 1 + Math.sin((performance.now() - t0) * 0.004) * 0.08;
      const radius = (2.2 + destProximity * destProximity * 160) * twinkle;

      const grad = ctx.createRadialGradient(dx, dy, 0, dx, dy, Math.max(radius, 0.1));
      grad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
      grad.addColorStop(0.35, `rgba(235, 244, 255, ${0.7 - destProximity * 0.1})`);
      grad.addColorStop(1, "rgba(148, 188, 227, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(dx, dy, Math.max(radius, 0.1), 0, Math.PI * 2);
      ctx.fill();

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
};

export default HyperspaceCanvas;
