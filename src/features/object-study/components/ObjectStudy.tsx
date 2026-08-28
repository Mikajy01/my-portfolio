import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import Corner from "../../../shared/components/Corner";

interface Study {
  tag: string;
  title: string;
  description: string;
  meta: string;
}

// Monte la scène Three.js (chargée à la demande) : une croix de trois barres
// entrecroisées dont la rotation/le zoom suivent `progressRef`, plus une
// coquille et un anneau discrets. Retourne une fonction de nettoyage.
function setupScene(
  THREE: typeof import("three"),
  canvas: HTMLCanvasElement,
  progressRef: React.RefObject<number>,
  pointerRef: React.RefObject<{ x: number; y: number }>
) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Lu depuis le canvas (pas document.documentElement) pour hériter la
  // surcharge --color-primary forcée en sombre sur cette section.
  const accent = getComputedStyle(canvas).getPropertyValue("--color-primary").trim() || "#94bce3";

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  camera.position.set(0, 0, 11);

  const solid = new THREE.MeshBasicMaterial({ color: new THREE.Color("#0d151d") });
  const edge = new THREE.LineBasicMaterial({ color: new THREE.Color(accent), transparent: true, opacity: 0.92 });
  const faint = new THREE.LineBasicMaterial({ color: new THREE.Color(accent), transparent: true, opacity: 0.16 });

  const cross = new THREE.Group();
  ([[3.4, 1.15, 1.15], [1.15, 3.4, 1.15], [1.15, 1.15, 3.4]] as [number, number, number][]).forEach((d) => {
    const g = new THREE.BoxGeometry(...d);
    cross.add(new THREE.Mesh(g, solid));
    cross.add(new THREE.LineSegments(new THREE.EdgesGeometry(g), edge));
  });
  scene.add(cross);

  const shellGeo = new THREE.BoxGeometry(5.6, 5.6, 5.6);
  const shell = new THREE.LineSegments(new THREE.EdgesGeometry(shellGeo), faint);
  scene.add(shell);

  const ringGeo = new THREE.BufferGeometry();
  const pts: number[] = [];
  for (let i = 0; i <= 96; i++) {
    const a = (i / 96) * Math.PI * 2;
    pts.push(Math.cos(a) * 4.6, 0, Math.sin(a) * 4.6);
  }
  ringGeo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  const ring = new THREE.Line(ringGeo, faint);
  ring.rotation.x = 0.34;
  scene.add(ring);

  const resize = () => {
    const r = canvas.getBoundingClientRect();
    if (!r.width || !r.height) return;
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / r.height;
    camera.updateProjectionMatrix();
  };
  resize();
  window.addEventListener("resize", resize);

  let mx = 0, my = 0, raf = 0;
  const t0 = performance.now();
  const frame = () => {
    const t = (performance.now() - t0) / 1000;
    const p = progressRef.current;
    const px = pointerRef.current.x, py = pointerRef.current.y;
    mx += (px - mx) * 0.06;
    my += (py - my) * 0.06;
    const drift = reduced ? 0 : t * 0.09;
    cross.rotation.y = p * Math.PI * 1.7 + drift + mx * 0.7;
    cross.rotation.x = -0.32 + p * 0.75 + my * 0.45;
    cross.rotation.z = p * 0.22;
    shell.rotation.y = -p * Math.PI * 0.9 - drift * 0.4 + mx * 0.3;
    shell.rotation.x = my * 0.2;
    ring.rotation.y = p * Math.PI * 2.2 + drift * 0.6;
    camera.position.z = 11 - p * 5.4;
    camera.position.x = mx * 1.1;
    camera.position.y = -my * 0.8 - p * 0.4;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  };
  frame();

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
    renderer.dispose();
  };
}

// Section "étude d'objet" : un objet 3D (Three.js, chargé à la demande) dont
// la rotation et le zoom sont pilotés par le scroll sur 460vh, avec un rail
// de cartes horizontal synchronisé sur la même progression.
export const ObjectStudy: React.FC = () => {
  const { t } = useTranslation();
  const studies = t("objectStudy.studies", { returnObjects: true }) as Study[];

  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const sec = sectionRef.current;
    const track = trackRef.current;
    if (!sec || !track) return;

    const onScroll = () => {
      const total = Math.max(1, sec.offsetHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, -sec.getBoundingClientRect().top / total));
      progressRef.current = p;
      const max = Math.max(0, track.scrollWidth - window.innerWidth);
      track.style.transform = `translate3d(${(-p * max).toFixed(1)}px,0,0)`;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p.toFixed(4)})`;
      if (readoutRef.current) {
        readoutRef.current.textContent =
          `rot ${String(Math.round(p * 306)).padStart(3, "0")}° · dolly ${(11 - p * 5.4).toFixed(1)} · ${Math.round(p * 100)}%`;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let onMove: ((e: MouseEvent) => void) | undefined;
    if (fine && !reduced) {
      onMove = (e) => {
        pointerRef.current = { x: e.clientX / window.innerWidth - 0.5, y: e.clientY / window.innerHeight - 0.5 };
      };
      window.addEventListener("mousemove", onMove, { passive: true });
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (onMove) window.removeEventListener("mousemove", onMove);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    let cleanup = () => {};

    // Import différé : Three.js n'est utile qu'ici, autant ne pas alourdir
    // le bundle principal pour tout le monde dès le premier chargement.
    import("three").then((THREE) => {
      if (disposed || !canvasRef.current) return;
      cleanup = setupScene(THREE, canvasRef.current, progressRef, pointerRef);
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="object"
      className="relative z-1 border-t"
      style={
        {
          height: "460vh",
          borderColor: "var(--color-border)",
          background: "var(--color-background)",
          // Cette section reste volontairement sombre quel que soit le thème
          // du site : le rendu Three.js et les cartes en dessous supposent un
          // fond noir (accents clairs, cartes semi-transparentes noires), ce
          // qui devient illisible sur le thème clair sans cette isolation.
          "--color-background": "color-mix(in srgb, #1d2d3d 80%, #000)",
          "--color-surface": "color-mix(in srgb, #1d2d3d 92%, #000)",
          "--color-text-primary": "#f5f5f8",
          "--color-text-secondary": "color-mix(in srgb, #f5f5f8 65%, transparent)",
          "--color-text-muted": "color-mix(in srgb, #f5f5f8 45%, transparent)",
          "--color-primary": "#94bce3",
          "--color-border": "color-mix(in srgb, #f5f5f8 13%, transparent)",
        } as React.CSSProperties
      }
    >
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col">
        <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 w-full h-full z-0" />

        <div
          className="relative z-1 max-w-[1320px] w-full mx-auto px-4 sm:px-6 lg:px-10"
          style={{ paddingTop: "clamp(76px,10.5vh,108px)" }}
        >
          <div className="flex items-baseline gap-5 mb-8">
            <span className="font-mono text-[11px] tracking-[.18em] text-primary">{t("objectStudy.eyebrow")}</span>
            <span className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
            <span className="font-mono text-[11px] tracking-[.14em] text-text-muted hidden sm:inline">
              {t("objectStudy.scrollHint")}
            </span>
          </div>
          <h2
            className="font-heading font-semibold leading-[1.02] tracking-[-.025em] max-w-[17ch] m-0 text-text-primary"
            style={{ fontSize: "clamp(1.6rem,3.4vw,3.1rem)" }}
          >
            {t("objectStudy.headline")} <em className="not-italic text-primary">{t("objectStudy.headlineAccent")}</em>
          </h2>
        </div>

        <div className="relative z-1 mt-auto" style={{ paddingBottom: "clamp(16px,2.6vh,34px)" }}>
          <div
            ref={trackRef}
            className="flex gap-6 items-stretch will-change-transform"
            style={{ paddingLeft: "max(16px, calc((100% - 1320px) / 2 + 16px))", paddingRight: 16 }}
          >
            {studies.map((study) => (
              <div
                key={study.tag}
                className="blueprint relative flex-none w-[340px] sm:w-[380px] px-6 py-6 sm:px-7"
                style={{ background: "color-mix(in srgb, #000 42%, transparent)", backdropFilter: "blur(3px)", borderColor: "var(--color-border)" }}
              >
                <Corner />
                <div className="font-mono text-[10px] tracking-[.18em] text-primary mb-5">{study.tag}</div>
                <div className="font-heading font-semibold text-[26px] sm:text-[28px] tracking-[-.015em] mb-2.5 text-text-primary">{study.title}</div>
                <p className="text-[13.5px] leading-relaxed text-text-secondary mb-5">{study.description}</p>
                <div className="font-mono text-[10px] tracking-[.14em] uppercase text-text-muted">{study.meta}</div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="relative z-1 max-w-[1320px] w-full mx-auto px-4 sm:px-6 lg:px-10"
          style={{ paddingBottom: "clamp(16px,2.6vh,34px)" }}
        >
          <div className="h-px relative overflow-hidden" style={{ background: "var(--color-border)" }}>
            <div ref={barRef} className="absolute inset-0 origin-left" style={{ background: "var(--color-primary)", transform: "scaleX(0)" }} />
          </div>
          <div className="flex justify-between gap-5 mt-3 font-mono text-[10px] tracking-[.16em] uppercase text-text-muted">
            <span>{t("objectStudy.footerLabel")}</span>
            <span ref={readoutRef}>rot 000° · dolly 11.0 · 0%</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ObjectStudy;
