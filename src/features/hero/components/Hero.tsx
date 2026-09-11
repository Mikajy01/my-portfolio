import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { SiReact, SiTypescript, SiNodedotjs, SiNestjs, SiPostgresql } from "react-icons/si";
import Corner from "../../../shared/components/Corner";
import ParticleCanvas from "../../../shared/components/ParticleCanvas";
import { useMagnetic } from "../../../shared/hooks/useMagnetic";
import { useSharedAudio } from "../../../shared/context/AudioContext";

// Icônes de stack en orbite discrète autour du portrait — 5 max, en
// monochrome (couleur du thème, pas les couleurs de marque) pour rester dans
// la palette "blueprint" plutôt que de faire un feu d'artifice de logos.
const ORBIT_ICONS = [
  { Icon: SiReact, angle: 0 },
  { Icon: SiTypescript, angle: 72 },
  { Icon: SiNodedotjs, angle: 144 },
  { Icon: SiNestjs, angle: 216 },
  { Icon: SiPostgresql, angle: 288 },
];
const ORBIT_RADIUS = 155;

const useClock = () => {
  const [elapsed, setElapsed] = useState("00:00:00");
  useEffect(() => {
    const t0 = Date.now();
    const tick = () => {
      const s = Math.floor((Date.now() - t0) / 1000);
      const p = (n: number) => String(n).padStart(2, "0");
      setElapsed(`${p(Math.floor(s / 3600))}:${p(Math.floor(s / 60) % 60)}:${p(s % 60)}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return elapsed;
};

const COMMAND_1 = "whoami";
const COMMAND_2 = "currently";

// Le terminal doit toujours se lire comme un écran de console sombre, même
// en thème clair — sinon le fond translucide (pensé pour le thème sombre)
// devient un gris délavé à faible contraste sur le fond clair. Palette
// forcée localement, comme le loader force la sienne.
const TERMINAL_THEME = {
  "--color-text-primary": "#f5f5f8",
  "--color-text-secondary": "color-mix(in srgb, #f5f5f8 65%, transparent)",
  "--color-text-muted": "color-mix(in srgb, #f5f5f8 45%, transparent)",
  "--color-primary": "#94bce3",
  "--color-border": "color-mix(in srgb, #f5f5f8 13%, transparent)",
} as React.CSSProperties;

// Tape les deux COMMANDES du terminal (pas les réponses, qui s'affichent
// d'un coup juste après, comme un vrai shell) avec le bruit de frappe en
// fond. Se déclenche automatiquement une fois le terminal visible à l'écran
// — le son est déjà déverrouillé à ce stade par le clic "Entrer" du loader,
// donc plus besoin d'un bouton manuel de secours ici.
const useTerminalTyping = (containerRef: React.RefObject<HTMLElement | null>, isPageLoaded: boolean) => {
  const [typedCmd1, setTypedCmd1] = useState("");
  const [typedCmd2, setTypedCmd2] = useState("");
  const [showOutput1, setShowOutput1] = useState(false);
  const [showOutput2, setShowOutput2] = useState(false);
  const audioRef = useSharedAudio();
  const cancelledRef = useRef(false);
  const runningRef = useRef(false);

  const typeLine = useCallback(
    (text: string, setter: (v: string) => void) =>
      new Promise<void>((resolve) => {
        let i = 0;
        const tick = () => {
          if (cancelledRef.current) return resolve();
          i += 1;
          setter(text.slice(0, i));
          if (i < text.length) setTimeout(tick, 55 + Math.random() * 55);
          else resolve();
        };
        tick();
      }),
    []
  );

  const runSequence = useCallback(async () => {
    if (runningRef.current) return;
    runningRef.current = true;
    cancelledRef.current = false;
    setTypedCmd1("");
    setTypedCmd2("");
    setShowOutput1(false);
    setShowOutput2(false);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTypedCmd1(COMMAND_1);
      setTypedCmd2(COMMAND_2);
      setShowOutput1(true);
      setShowOutput2(true);
      runningRef.current = false;
      return;
    }

    const audio = audioRef.current;
    const finish = () => { runningRef.current = false; };

    audio?.play().catch(() => {});
    await typeLine(COMMAND_1, setTypedCmd1);
    if (cancelledRef.current) return finish();
    audio?.pause();

    await new Promise((r) => setTimeout(r, 800));
    if (cancelledRef.current) return finish();
    setShowOutput1(true);

    await new Promise((r) => setTimeout(r, 550));
    if (cancelledRef.current) return finish();

    audio?.play().catch(() => {});
    await typeLine(COMMAND_2, setTypedCmd2);
    if (cancelledRef.current) return finish();
    audio?.pause();

    await new Promise((r) => setTimeout(r, 800));
    if (cancelledRef.current) return finish();
    setShowOutput2(true);
    finish();
  }, [typeLine, audioRef]);

  useEffect(() => {
    // Le hero est monté (mais masqué) pendant l'écran de chargement — un
    // IntersectionObserver ne tient pas compte de l'opacité/occlusion, donc
    // sans cette garde la frappe et le son démarraient avant même que le
    // loader ait disparu.
    if (!isPageLoaded) return;
    const el = containerRef.current;
    if (!el) return;

    let started = false;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            started = true;
            runSequence();
          }
        });
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [containerRef, isPageLoaded, runSequence]);

  useEffect(() => {
    const audioEl = audioRef.current;
    return () => {
      cancelledRef.current = true;
      audioEl?.pause();
    };
  }, [audioRef]);

  return { typedCmd1, typedCmd2, showOutput1, showOutput2 };
};

interface HeroProps {
  isPageLoaded: boolean;
}

export const Hero: React.FC<HeroProps> = ({ isPageLoaded }) => {
  const { t } = useTranslation();
  const clock = useClock();
  const exploreRef = useMagnetic<HTMLAnchorElement>();
  const talkRef = useMagnetic<HTMLAnchorElement>();
  const terminalRef = useRef<HTMLDivElement>(null);
  const { typedCmd1, typedCmd2, showOutput1, showOutput2 } = useTerminalTyping(
    terminalRef,
    isPageLoaded
  );

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative z-1 min-h-screen flex flex-col justify-center max-w-[1320px] mx-auto pt-[100px] pb-10 px-4 sm:px-6 lg:px-10"
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <ParticleCanvas density={34} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] gap-14 lg:items-center items-end">
        <div>
          <div className="flex items-center gap-3.5 mb-8">
            <span className="w-11 h-px bg-primary" />
            <span className="font-mono text-[11px] tracking-[.18em] uppercase text-primary">
              {t("hero.eyebrowGreeting")}
            </span>
            <span className="font-mono text-[11px] tracking-[.18em] uppercase text-text-muted hidden sm:inline">
              — {t("hero.eyebrowRole")}
            </span>
          </div>

          <h1 className="font-heading font-semibold leading-[0.95] tracking-[-0.03em] max-w-[15ch] text-[clamp(2.6rem,8.6vw,7rem)] text-balance">
            <span className="block text-text-primary">{t("hero.headline1")}</span>
            <span className="block text-text-muted">{t("hero.headline2")}</span>
            <span className="block text-text-primary">
              {t("hero.headline3")} <em className="not-italic text-primary">{t("hero.headline3Accent")}</em>
            </span>
          </h1>

          <div className="mt-8">
            <p className="max-w-[46ch] text-base leading-relaxed text-text-secondary mb-8">
              {t("hero.bio")}
            </p>
            <div className="flex flex-wrap gap-3.5">
              <a
                ref={exploreRef}
                href="#work"
                onClick={(e) => { e.preventDefault(); scrollToSection("work"); }}
                className="blueprint relative inline-flex items-center gap-2 font-heading font-semibold text-[13px] tracking-widest uppercase px-6 py-3.5"
                style={{ background: "var(--color-primary)", color: "var(--color-background)", borderColor: "var(--color-primary)" }}
              >
                <Corner />
                {t("hero.ctaExplore")}
              </a>
              <a
                ref={talkRef}
                href="#contact"
                onClick={(e) => { e.preventDefault(); scrollToSection("contact"); }}
                className="inline-flex items-center gap-2 font-heading font-semibold text-[13px] tracking-widest uppercase px-6 py-3.5 border border-border text-text-primary hover:border-primary transition-colors"
              >
                {t("hero.ctaTalk")}
              </a>
            </div>
          </div>
        </div>

        {/* Colonne droite : portrait (desktop uniquement) directement
            au-dessus du terminal, le duo restant ancré en bas — comme le
            terminal seul l'était déjà — plutôt que étiré sur toute la
            hauteur de la ligne, ce qui l'isolait tout en haut. */}
        <div className="flex flex-col items-end">
          <div className="hidden lg:block blueprint relative w-[250px] shrink-0 self-center mb-6">
            <Corner />
            <div className="relative">
              <img
                src="/images/profile_picture_2.png"
                alt="Mikajisoa Selly-Rafaj"
                className="w-full h-auto"
                style={{
                  WebkitMaskImage: "linear-gradient(to bottom, #000 82%, transparent 100%)",
                  maskImage: "linear-gradient(to bottom, #000 82%, transparent 100%)",
                }}
              />
              <div className="hero-orbit absolute inset-0 pointer-events-none">
                {ORBIT_ICONS.map(({ Icon, angle }) => (
                  <div
                    key={angle}
                    className="absolute top-1/2 left-1/2"
                    style={{ transform: `rotate(${angle}deg) translateX(${ORBIT_RADIUS}px)` }}
                  >
                    <div style={{ transform: "translate(-50%, -50%)" }}>
                      <div
                        className="hero-orbit-counter w-8 h-8 rounded-full border flex items-center justify-center"
                        style={{ borderColor: "var(--color-border)", background: "var(--color-background)" }}
                      >
                        <Icon size={15} style={{ color: "var(--color-text-muted)" }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Ligne de mesure façon plan technique : adoucit la coupe nette
                du détourage plutôt que de la laisser s'arrêter net. */}
            <svg aria-hidden="true" viewBox="0 0 250 26" className="block w-full h-[26px] -mt-3">
              <line x1="0" y1="1" x2="0" y2="9" stroke="var(--color-border)" strokeWidth="1" />
              <line x1="250" y1="1" x2="250" y2="9" stroke="var(--color-border)" strokeWidth="1" />
              <line x1="0" y1="5" x2="250" y2="5" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="3 4" />
              <circle cx="0" cy="5" r="3" fill="var(--color-primary)" className="hero-scan-dot" />
            </svg>
          </div>

          <div
            className="blueprint relative w-full px-5 py-4.5 font-mono text-[11.5px] leading-loose tracking-[.04em]"
            style={{ ...TERMINAL_THEME, background: "color-mix(in srgb, #0b1420 90%, transparent)" }}
          >
            <Corner />
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b text-text-muted" style={{ borderColor: "var(--color-border)" }}>
              <span>~/mikajisoa — session</span>
              <span>{clock}</span>
            </div>
            <div ref={terminalRef} className="text-text-secondary">
              <span className="text-primary">›</span> {typedCmd1}
              {!showOutput1 && (
                <span className="inline-block w-[7px] h-3.5 bg-primary ml-1.5 align-middle" style={{ animation: "caretBlink 1.1s step-end infinite" }} />
              )}
            </div>
            {showOutput1 && <div className="text-text-primary">{t("hero.terminalWhoami")}</div>}

            {showOutput1 && (
              <div className="text-text-secondary mt-2.5">
                <span className="text-primary">›</span> {typedCmd2}
                {!showOutput2 && (
                  <span className="inline-block w-[7px] h-3.5 bg-primary ml-1.5 align-middle" style={{ animation: "caretBlink 1.1s step-end infinite" }} />
                )}
              </div>
            )}
            {showOutput2 && (
              <div className="text-text-primary">
                {t("hero.terminalCurrently")}
                <span className="inline-block w-[7px] h-3.5 bg-primary ml-1.5 align-middle" style={{ animation: "caretBlink 1.1s step-end infinite" }} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-3 mt-16 font-mono text-[10px] tracking-[.2em] uppercase text-text-muted">
        <span>{t("hero.scroll")}</span>
        <span className="w-[90px] h-px" style={{ background: "linear-gradient(90deg, var(--color-text-muted), transparent)" }} />
      </div>
    </section>
  );
};
