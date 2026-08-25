import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { ProfileImage } from "./ProfileImage";
import { Button } from "../../../shared/components/Button";

const TITLE_ROTATE_MS = 2600;

export const Hero: React.FC = () => {
  const { t } = useTranslation();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const titles = t("hero.titles", { returnObjects: true }) as string[];

  useEffect(() => {
    setCurrentWordIndex(0);
  }, [titles.length]);

  useEffect(() => {
    if (titles.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % titles.length);
    }, TITLE_ROTATE_MS);
    return () => clearInterval(interval);
  }, [titles.length]);

  const downloadCV = () => {
    const link = document.createElement("a");
    link.href = "/cv.pdf";
    link.download = "Mikajisoa-Selly-Rafaj-CV.pdf";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const scrollToProjects = () => {
    const element = document.getElementById("projects");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-24 pb-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Colonne texte */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left gap-8 order-2 lg:order-1">
          <div className="space-y-4">
            <p className="text-text-secondary text-sm sm:text-base font-medium tracking-wide uppercase">
              {t("hero.welcome")}
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
              <span className="block text-text-primary">{t("hero.IAm")}</span>
              <span className="block text-gradient mt-2">Mikajisoa Selly-Rafaj</span>
            </h1>

            <div className="h-9 sm:h-10 flex items-center justify-center lg:justify-start">
              <AnimatePresence mode="wait">
                <motion.span
                  key={titles[currentWordIndex]}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="text-xl sm:text-2xl font-semibold text-primary"
                >
                  {titles[currentWordIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          <p className="text-text-secondary text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl">
            {t("hero.heroDescription")}
          </p>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button
              variant="primary"
              size="lg"
              onClick={downloadCV}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              }
            >
              {t("hero.cta.downloadCV")}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={scrollToProjects}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              }
            >
              {t("hero.cta.seeProject")}
            </Button>
          </div>

          {/* Stats rapides */}
          <div className="grid grid-cols-3 gap-6 sm:gap-10 pt-4 max-w-md">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-gradient">3+</div>
              <div className="text-xs sm:text-sm text-text-secondary mt-1">
                {t("hero.stats.yearsExperience")}
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-gradient">10+</div>
              <div className="text-xs sm:text-sm text-text-secondary mt-1">
                {t("hero.stats.projectsCompleted")}
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-gradient">10+</div>
              <div className="text-xs sm:text-sm text-text-secondary mt-1">
                {t("hero.stats.satisfiedClients")}
              </div>
            </div>
          </div>
        </div>

        {/* Photo de profil : centrée sur mobile, à droite et plus grande sur desktop */}
        <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
          <div className="w-64 sm:w-80 md:w-96 lg:w-md xl:w-lg">
            <ProfileImage />
          </div>
        </div>
      </div>

      {/* Indicateur de scroll */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
};
