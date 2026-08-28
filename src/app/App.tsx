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
import { useState, useCallback } from "react";
import { AppLoader } from "./AppLoader";
import { motion } from "framer-motion";

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
  const handleLoaderComplete = useCallback(() => setIsLoaded(true), []);

  return (
    <LanguageProvider>
      {!isLoaded && <AppLoader onComplete={handleLoaderComplete} />}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <AppContent isPageLoaded={isLoaded} />
      </motion.div>
    </LanguageProvider>
  );
}

export default App;
