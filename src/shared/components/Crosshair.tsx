import { useEffect, useRef } from "react";

// Curseur en croix façon CAO/plan technique, avec lecture de coordonnées —
// visible uniquement au pointeur fin (souris), désactivé en reduced-motion.
export const Crosshair: React.FC = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const vRef = useRef<HTMLDivElement>(null);
  const hRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const v = vRef.current;
    const h = hRef.current;
    const label = labelRef.current;
    if (!wrap || !v || !h || !label) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (reduced || !fine) {
      wrap.style.display = "none";
      return;
    }

    let tx = 0, ty = 0, x = 0, y = 0, shown = false;
    let tick: number | null = null;

    const loop = () => {
      tick = null;
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      v.style.transform = `translateX(${x.toFixed(1)}px)`;
      h.style.transform = `translateY(${y.toFixed(1)}px)`;
      label.style.transform = `translate(${(x + 10).toFixed(1)}px, ${(y + 8).toFixed(1)}px)`;
      label.textContent = `${String(Math.round(tx)).padStart(4, "0")} / ${String(Math.round(ty)).padStart(4, "0")}`;
      if (Math.abs(tx - x) > 0.4 || Math.abs(ty - y) > 0.4) tick = requestAnimationFrame(loop);
    };

    const move = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!shown) {
        shown = true;
        wrap.style.opacity = "1";
        x = tx;
        y = ty;
      }
      if (!tick) tick = requestAnimationFrame(loop);
    };
    const onLeave = () => { shown = false; wrap.style.opacity = "0"; };

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", onLeave);
      if (tick) cancelAnimationFrame(tick);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 60, opacity: 0, transition: "opacity .3s ease" }}
    >
      <div
        ref={vRef}
        style={{ position: "absolute", top: 0, bottom: 0, width: 1, background: "color-mix(in srgb, var(--color-primary) 22%, transparent)" }}
      />
      <div
        ref={hRef}
        style={{ position: "absolute", left: 0, right: 0, height: 1, background: "color-mix(in srgb, var(--color-primary) 22%, transparent)" }}
      />
      <div
        ref={labelRef}
        style={{
          position: "absolute",
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: ".1em",
          color: "color-mix(in srgb, var(--color-primary) 70%, transparent)",
          padding: "4px 6px",
        }}
      />
    </div>
  );
};

export default Crosshair;
