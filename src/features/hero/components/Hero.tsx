import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Corner from "../../../shared/components/Corner";
import ParticleCanvas from "../../../shared/components/ParticleCanvas";
import { useMagnetic } from "../../../shared/hooks/useMagnetic";

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

// Tape les deux COMMANDES du terminal (pas les réponses, qui s'affichent
// d'un coup juste après, comme un vrai shell) avec le bruit de frappe en
// fond. Ne démarre que lorsque le terminal entre réellement dans l'écran,
// avec un repli sur la première interaction si l'autoplay audio est bloqué.
const useTerminalTyping = (containerRef: React.RefObject<HTMLElement | null>, isPageLoaded: boolean) => {
  const [typedCmd1, setTypedCmd1] = useState("");
  const [typedCmd2, setTypedCmd2] = useState("");
  const [showOutput1, setShowOutput1] = useState(false);
  const [showOutput2, setShowOutput2] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Le hero est monté (mais masqué) pendant l'écran de chargement — un
    // IntersectionObserver ne tient pas compte de l'opacité/occlusion, donc
    // sans cette garde la frappe et le son démarraient avant même que le
    // loader ait disparu.
    if (!isPageLoaded) return;

    const el = containerRef.current;
    const audioEl = audioRef.current;
    if (!el) return;

    let cancelled = false;
    let started = false;

    const typeLine = (text: string, setter: (v: string) => void) =>
      new Promise<void>((resolve) => {
        let i = 0;
        const tick = () => {
          if (cancelled) return resolve();
          i += 1;
          setter(text.slice(0, i));
          if (i < text.length) setTimeout(tick, 55 + Math.random() * 55);
          else resolve();
        };
        tick();
      });

    const runSequence = async () => {
      const audio = audioRef.current;
      audio?.play().catch(() => {});
      await typeLine(COMMAND_1, setTypedCmd1);
      if (cancelled) return;
      audio?.pause();

      await new Promise((r) => setTimeout(r, 800));
      if (cancelled) return;
      setShowOutput1(true);

      await new Promise((r) => setTimeout(r, 550));
      if (cancelled) return;

      audio?.play().catch(() => {});
      await typeLine(COMMAND_2, setTypedCmd2);
      if (cancelled) return;
      audio?.pause();

      await new Promise((r) => setTimeout(r, 800));
      if (cancelled) return;
      setShowOutput2(true);
    };

    const begin = () => {
      if (started || cancelled) return;
      started = true;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setTypedCmd1(COMMAND_1);
        setTypedCmd2(COMMAND_2);
        setShowOutput1(true);
        setShowOutput2(true);
        return;
      }

      const removers: Array<() => void> = [];
      const probe = audioRef.current?.play();
      if (probe) {
        probe
          .then(() => {
            audioRef.current?.pause();
            runSequence();
          })
          .catch(() => {
            const resume = () => {
              runSequence();
              removers.forEach((off) => off());
            };
            (["pointerdown", "keydown", "touchstart"] as const).forEach((evt) => {
              window.addEventListener(evt, resume, { once: true, passive: true });
              removers.push(() => window.removeEventListener(evt, resume));
            });
          });
      } else {
        runSequence();
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) begin();
        });
      },
      { threshold: 0.4 }
    );
    observer.observe(el);

    return () => {
      cancelled = true;
      observer.disconnect();
      audioEl?.pause();
    };
  }, [containerRef, isPageLoaded]);

  return { typedCmd1, typedCmd2, showOutput1, showOutput2, audioRef };
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
  const { typedCmd1, typedCmd2, showOutput1, showOutput2, audioRef } = useTerminalTyping(terminalRef, isPageLoaded);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative z-1 min-h-screen flex flex-col justify-center max-w-[1320px] mx-auto pt-[140px] pb-10 px-4 sm:px-6 lg:px-10"
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <ParticleCanvas density={34} className="absolute inset-0 w-full h-full" />
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] gap-14 items-end mt-14">
        <div>
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

        <div
          className="blueprint relative px-5 py-4.5 font-mono text-[11.5px] leading-loose tracking-[.04em]"
          style={{ background: "color-mix(in srgb, #000 22%, transparent)" }}
        >
          <Corner />
          <div className="flex justify-between pb-2.5 mb-2.5 border-b text-text-muted" style={{ borderColor: "var(--color-border)" }}>
            <span>~/mikajisoa — session</span>
            <span>{clock}</span>
          </div>
          <div ref={terminalRef} className="text-text-secondary">
            <span className="text-primary">›</span> {typedCmd1}
            {!showOutput1 && (
              <span className="inline-block w-[7px] h-3.5 bg-primary ml-1.5 align-middle" style={{ animation: "caretBlink 1.1s step-end infinite" }} />
            )}
          </div>
          {showOutput1 && <div>{t("hero.terminalWhoami")}</div>}

          {showOutput1 && (
            <div className="text-text-secondary mt-2.5">
              <span className="text-primary">›</span> {typedCmd2}
              {!showOutput2 && (
                <span className="inline-block w-[7px] h-3.5 bg-primary ml-1.5 align-middle" style={{ animation: "caretBlink 1.1s step-end infinite" }} />
              )}
            </div>
          )}
          {showOutput2 && (
            <div>
              {t("hero.terminalCurrently")}
              <span className="inline-block w-[7px] h-3.5 bg-primary ml-1.5 align-middle" style={{ animation: "caretBlink 1.1s step-end infinite" }} />
            </div>
          )}
          <audio ref={audioRef} src="/sounds/keyboard-typing.mp3" preload="auto" />
        </div>
      </div>

      <div className="hidden md:flex items-center gap-3 mt-16 font-mono text-[10px] tracking-[.2em] uppercase text-text-muted">
        <span>{t("hero.scroll")}</span>
        <span className="w-[90px] h-px" style={{ background: "linear-gradient(90deg, var(--color-text-muted), transparent)" }} />
      </div>
    </section>
  );
};
