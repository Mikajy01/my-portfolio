import React from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useScrollspy } from "../utils/useScrollspy";

interface RailSection {
  id: string;
  label: string;
}

interface ScrollProgressRailProps {
  sections: RailSection[];
}

// Rail vertical fixe : un point lumineux qui voyage le long de la page au fil
// du scroll, avec un repère par section. Visible en desktop uniquement.
export const ScrollProgressRail: React.FC<ScrollProgressRailProps> = ({ sections }) => {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.3,
  });
  const dotTop = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  const activeSection = useScrollspy(sections.map((s) => s.id));

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: "smooth" });
    }
  };

  return (
    <div
      className="hidden lg:block fixed right-8 top-1/2 -translate-y-1/2 z-40"
      style={{ height: "min(58vh, 460px)" }}
    >
      {/* Piste : largeur fixe, toujours alignée sur le même axe vertical */}
      <div className="relative h-full w-2">
        {/* Ligne de fond */}
        <div className="absolute top-0 bottom-0 right-0 w-px bg-border" />

        {/* Point voyageur : suit le scroll global de la page */}
        <motion.div
          className="absolute right-0 w-2 h-2 rounded-full bg-primary translate-x-1/2 -translate-y-1/2"
          style={{ top: dotTop, boxShadow: "0 0 10px var(--color-glow)" }}
        />

        {/* Repères de sections */}
        <ul className="relative flex flex-col justify-between h-full">
          {sections.map((section) => {
            const isActive = activeSection === section.id;
            return (
              <li key={section.id} className="relative group">
                <button
                  onClick={() => scrollToSection(section.id)}
                  aria-label={section.label}
                  className="relative flex items-center justify-end"
                >
                  {/* Étiquette : positionnée en absolu à gauche du point,
                      ne perturbe jamais l'alignement de la piste */}
                  <span
                    className={`absolute right-full mr-3 whitespace-nowrap text-xs font-medium tracking-wide transition-all duration-300 ${
                      isActive
                        ? "opacity-100 translate-x-0 text-text-primary"
                        : "opacity-0 translate-x-2 pointer-events-none text-text-secondary group-hover:opacity-100 group-hover:translate-x-0"
                    }`}
                  >
                    {section.label}
                  </span>
                  <span
                    className={`block rounded-full transition-all duration-300 ${
                      isActive ? "w-2 h-2 bg-primary" : "w-1.5 h-1.5 bg-border-light group-hover:bg-primary/60"
                    }`}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default ScrollProgressRail;
