import { useEffect, useRef } from "react";

// Fait légèrement "suivre" le curseur à un élément (boutons, liens) —
// désactivé sur tactile et si l'utilisateur préfère moins d'animations.
export function useMagnetic<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (reduced || !fine) return;

    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${(dx * 0.16).toFixed(2)}px, ${(dy * 0.22).toFixed(2)}px)`;
    };
    const leave = () => { el.style.transform = "translate(0,0)"; };

    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, []);

  return ref;
}
