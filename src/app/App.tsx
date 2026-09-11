import { Toolbox, BeyondTheCode } from "../features/skills";
import Projects from "../features/projects";
import Contact from "../features/contact";
import { Header } from "../shared/components/Header";
import { Hero } from "../features/hero";
import { About } from "../features/about";
import { AwardsCertifications } from "../features/awards";
import { Experience } from "../features/experience";
import { Education } from "../features/education";
import { ObjectStudy } from "../features/object-study";
import { Footer } from "../shared/components/Footer";
import { Crosshair } from "../shared/components/Crosshair";
import StatsBand from "../shared/components/StatsBand";
import { LanguageProvider } from "../shared/context/LanguageContext";
import { AudioProvider } from "../shared/context/AudioContext";
import { useState, useCallback, useEffect, useRef } from "react";
import { AppLoader } from "./AppLoader";
import { getDestinationGeometry } from "./hyperspaceGeometry";

const AppContent = ({ isPageLoaded }: { isPageLoaded: boolean }) => (
  <div className="relative min-h-screen bg-background overflow-x-clip">
    {/* Grille de fond, façon plan technique */}
    <div aria-hidden className="fixed inset-0 pointer-events-none z-0 flex justify-center">
      <div className="w-full max-w-[1320px] px-4 sm:px-6 lg:px-10 grid grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border-l" style={{ borderColor: "color-mix(in srgb, var(--color-text-primary) 4%, transparent)" }} />
        ))}
      </div>
    </div>

    <Crosshair />
    <Header />

    <main className="relative">
      <Hero isPageLoaded={isPageLoaded} />
      <StatsBand />
      <About />
      <Projects />
      <Toolbox />
      <BeyondTheCode />
      <ObjectStudy />
      <Experience />
      <Education />
      <AwardsCertifications />
      <Contact />
    </main>
    <Footer />
  </div>
);

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [jumpStart, setJumpStart] = useState<number | null>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const isLoadedRef = useRef(isLoaded);

  const handleLoaderComplete = useCallback(() => setIsLoaded(true), []);
  const handleJumpStart = useCallback((t: number) => setJumpStart(t), []);

  useEffect(() => {
    isLoadedRef.current = isLoaded;
  }, [isLoaded]);

  // Cache le site derrière un cercle nul jusqu'au saut — mutation directe du
  // DOM (pas via le prop style React) pour ne jamais entrer en conflit avec
  // les mises à jour imperatives de la boucle ci-dessous.
  useEffect(() => {
    revealRef.current?.style.setProperty("clip-path", "circle(0px at 50% 50%)");
  }, []);

  // Révèle le vrai site à travers un hublot circulaire centré exactement sur
  // l'étoile de destination du canvas — même géométrie, même horodatage de
  // départ, donc les deux restent parfaitement synchronisés sans se parler
  // frame par frame.
  useEffect(() => {
    if (jumpStart === null) return;

    let raf = 0;
    const tick = () => {
      // Le chargement est terminé (le nettoyage ci-dessous a déjà retiré le
      // clip-path) : on arrête la boucle net, sinon elle le réappliquerait
      // dès la frame suivante et le site resterait rond pour toujours.
      if (isLoadedRef.current) return;

      const el = revealRef.current;
      if (el) {
        const elapsed = performance.now() - jumpStart;
        const w = window.innerWidth;
        const h = window.innerHeight;
        const { dx, dy, proximity } = getDestinationGeometry(elapsed, w, h);
        const maxRadius = Math.hypot(w, h) * 0.55;
        const radius = Math.max(proximity * proximity * maxRadius, 0.1);
        el.style.clipPath = `circle(${radius}px at ${dx}px ${dy}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [jumpStart]);

  // Une fois le chargement terminé (saut fini, ou reduced-motion — qui ne
  // passe jamais par jumpStart), on retire le clip : le site reste révélé
  // même après un redimensionnement.
  useEffect(() => {
    if (isLoaded) revealRef.current?.style.removeProperty("clip-path");
  }, [isLoaded]);

  return (
    <LanguageProvider>
      <AudioProvider>
        {!isLoaded && <AppLoader onComplete={handleLoaderComplete} onJumpStart={handleJumpStart} />}

        {/* z-index au-dessus du loader (z-9999) uniquement tant qu'il est
            monté : tant que le clip-path est actif, seul le cercle de ce div
            "perce" à travers le loader pour révéler le vrai site. Une fois
            isLoaded (le loader démonté), on repasse en z-index normal — sinon
            ce z-10000 permanent passerait devant les portails en z-9999
            ailleurs sur le site (ex. la modale des projets), qui vivent en
            dehors de cet arbre puisqu'ils sont montés directement sur
            document.body. */}
        <div ref={revealRef} className={`relative ${isLoaded ? "" : "z-10000"}`}>
          <AppContent isPageLoaded={isLoaded} />
        </div>
      </AudioProvider>
    </LanguageProvider>
  );
}

export default App;
