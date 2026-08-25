import Skills from "../features/skills";
import Projects from "../features/projects";
import Contact from "../features/contact";
import { Header } from "../shared/components/Header";
import { Hero } from "../features/hero";
import { Footer } from "../shared/components/Footer";
import { Education } from "../features/education";
import { Experience } from "../features/experience";
import { Awards } from "../features/awards";
import { Certifications } from "../features/certifications";
import { GateReveal } from "../shared/components/GateReveal";
import { ScrollProgressRail } from "../shared/components/ScrollProgressRail";
import { LanguageProvider } from "../shared/context/LanguageContext";
import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { AppLoader } from "./AppLoader";
import { motion } from "framer-motion";

const AppContent = () => {
  const { t } = useTranslation();

  const railSections = [
    { id: "hero", label: t("nav.home") },
    { id: "skills", label: t("nav.skills") },
    { id: "projects", label: t("nav.projects") },
    { id: "awards", label: t("nav.awards") },
    { id: "certifications", label: t("nav.certifications") },
    { id: "experience", label: t("nav.experience") },
    { id: "education", label: t("nav.education") },
    { id: "contact", label: t("nav.contact") },
  ];

  return (
    <>
      <Header />
      <ScrollProgressRail sections={railSections} />

      <div className="relative min-h-screen bg-background">
        {/* Grille de fond, très subtile */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.04]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(var(--color-primary) 1px, transparent 1px),
                linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        <main className="relative">
          <Hero />
          <GateReveal>
            <Skills />
          </GateReveal>
          <GateReveal>
            <Projects />
          </GateReveal>
          <GateReveal>
            <Awards />
          </GateReveal>
          <GateReveal>
            <Certifications />
          </GateReveal>
          <GateReveal>
            <Experience />
          </GateReveal>
          <GateReveal>
            <Education />
          </GateReveal>
          <GateReveal>
            <Contact />
          </GateReveal>
        </main>
        <Footer />
      </div>
    </>
  );
};

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
        <AppContent />
      </motion.div>
    </LanguageProvider>
  );
}

export default App;
