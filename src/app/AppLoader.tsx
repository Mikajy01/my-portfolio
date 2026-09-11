import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import Corner from "../shared/components/Corner";
import { useSharedAudio } from "../shared/context/AudioContext";
import { HyperspaceCanvas } from "./HyperspaceCanvas";
import { JUMP_DURATION_MS } from "./hyperspaceGeometry";

const LOAD_DURATION = 650;

type Phase = "loading" | "ready" | "jumping";

// Le loader force sa propre palette sombre (recopiée de :root.dark) plutôt
// que de suivre le thème clair/sombre du site : ce moment doit toujours se
// lire comme "l'espace", même pour un visiteur en thème clair.
const SPACE_THEME = {
  "--color-background": "color-mix(in srgb, #1d2d3d 80%, #000)",
  "--color-text-primary": "#f5f5f8",
  "--color-text-muted": "color-mix(in srgb, #f5f5f8 45%, transparent)",
  "--color-primary": "#94bce3",
  "--color-border": "color-mix(in srgb, #f5f5f8 13%, transparent)",
} as React.CSSProperties;

interface AppLoaderProps {
  onComplete: () => void;
  /** Prévient App.tsx de l'instant exact du clic — sert à révéler le vrai
   * site à travers le même point que l'étoile de destination du canvas. */
  onJumpStart: (timestamp: number) => void;
}

export const AppLoader = ({ onComplete, onJumpStart }: AppLoaderProps) => {
  const { t } = useTranslation();
  const audioRef = useSharedAudio();
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<Phase>("loading");
  const [isVisible, setIsVisible] = useState(true);
  const [jumpStart, setJumpStart] = useState<number | null>(null);
  const reducedMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  useEffect(() => {
    const start = Date.now();
    let raf: number;

    const tick = () => {
      const p = Math.min((Date.now() - start) / LOAD_DURATION, 1);
      setProgress(Math.floor(p * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setPhase("ready");
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleEnter = () => {
    if (phase !== "ready") return;

    // Déverrouille l'élément audio partagé avec ce vrai geste utilisateur —
    // le terminal du Hero pourra ensuite y rejouer du son sans blocage
    // navigateur, même une fois l'animation de saut terminée.
    const audio = audioRef.current;
    audio?.play().then(() => audio.pause()).catch(() => {});

    if (reducedMotion) {
      setIsVisible(false);
      onComplete();
      return;
    }

    const start = performance.now();
    setJumpStart(start);
    onJumpStart(start);
    setPhase("jumping");
    setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, JUMP_DURATION_MS);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed inset-0 z-9999 overflow-hidden bg-background"
          style={SPACE_THEME}
        >
          {!reducedMotion && (
            <HyperspaceCanvas jumpStart={jumpStart} className="absolute inset-0 w-full h-full" />
          )}

          <motion.div
            animate={{ opacity: phase === "jumping" ? 0 : 1, scale: phase === "jumping" ? 0.85 : 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative z-1 h-full flex flex-col items-center justify-center gap-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="blueprint relative w-14 h-14 grid place-items-center border border-border font-heading font-semibold text-lg text-primary"
              style={{ background: "color-mix(in srgb, #000 25%, transparent)" }}
            >
              <Corner />
              MSR
            </motion.div>

            <div className="w-40 sm:w-48 h-px overflow-hidden" style={{ background: "var(--color-border)" }}>
              <div
                className="h-full"
                style={{ width: `${progress}%`, background: "var(--color-primary)", transition: "width 0.1s linear" }}
              />
            </div>

            <AnimatePresence>
              {phase === "ready" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="flex flex-col items-center gap-4"
                >
                  <span className="font-mono text-[10px] tracking-[.16em] uppercase text-text-muted">
                    {t("loader.status")}
                  </span>
                  <button
                    type="button"
                    onClick={handleEnter}
                    className="blueprint relative inline-flex items-center gap-2 font-heading font-semibold text-[13px] tracking-widest uppercase px-8 py-3.5"
                    style={{ background: "var(--color-primary)", color: "var(--color-background)", borderColor: "var(--color-primary)" }}
                  >
                    <Corner />
                    {t("loader.enter")}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AppLoader;
