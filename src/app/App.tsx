import React, { useState, useEffect, useMemo } from "react";

// --- VRAIS IMPORTS (Décommente-les dans ton projet) ---
import Skills from "../features/skills";
import Projects from "../features/projects";
import Contact from "../features/contact";
import { Header } from "../shared/components/Header";
import { Hero } from "../features/hero";
import { Footer } from "../shared/components/Footer";
import { Education } from "../features/education";
import { Experience } from "../features/experience";
import { Settings } from "lucide-react";

// --- COMPOSANT LOADER : INCOMING DATA ---
const PixelGridLoader = ({ onComplete }: { onComplete: () => void }) => {
  const [isVisible, setIsVisible] = useState(true);

  // Configuration de la grille
  const cols = 20;
  const rows = 20;
  const totalSquares = cols * rows;

  // Génération des positions de départ aléatoires (mémoïsé pour ne pas changer à chaque render)
  const gridData = useMemo(() => {
    return Array.from({ length: totalSquares }).map((_, i) => {
      // 1. Délai aléatoire pour un effet "pluie" ou "rafale"
      const delay = Math.random() * 1.5;

      // 2. Choisir un côté de départ aléatoire (0: Top, 1: Right, 2: Bottom, 3: Left)
      const side = Math.floor(Math.random() * 4);
      let startX = "0vw";
      let startY = "0vh";

      // On propulse les carrés depuis loin hors de l'écran (150vw/vh pour être sûr)
      switch (side) {
        case 0:
          startX = `${(Math.random() - 0.5) * 50}vw`;
          startY = "-120vh";
          break; // Top
        case 1:
          startX = "120vw";
          startY = `${(Math.random() - 0.5) * 50}vh`;
          break; // Right
        case 2:
          startX = `${(Math.random() - 0.5) * 50}vw`;
          startY = "120vh";
          break; // Bottom
        case 3:
          startX = "-120vw";
          startY = `${(Math.random() - 0.5) * 50}vh`;
          break; // Left
      }

      return {
        id: i,
        delay,
        startX,
        startY,
        // Couleur aléatoire subtile pour les projectiles (Indigo, Violet ou Cyan)
        color:
          Math.random() > 0.6
            ? "#6366f1"
            : Math.random() > 0.5
            ? "#8b5cf6"
            : "#06b6d4",
      };
    });
  }, []);

  useEffect(() => {
    // Temps total = délai max (1.5s) + animation vol (0.8s) + petit buffer
    const totalDuration = 2600;

    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, totalDuration);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none flex flex-col">
      <div
        className="flex-1 grid w-full h-full"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
      >
        {gridData.map((item) => (
          <div key={item.id} className="relative w-full h-full overflow-hidden">
            {/* 1. COUCHE NOIRE (Masque le site) */}
            {/* Elle reste opaque jusqu'à ce que le projectile arrive, puis disparait */}
            <div
              className="absolute inset-0 bg-text-primary z-10"
              style={{
                animation: `revealSite 0.1s steps(1) forwards`,
                animationDelay: `${item.delay + 0.8}s`, // 0.8s est la durée du vol
              }}
            />

            {/* 2. LE PROJECTILE (Le carré qui vole) */}
            <div
              className="absolute inset-0 z-20 shadow-lg"
              style={{
                backgroundColor: item.color,
                opacity: 0.8,
                // On utilise des variables CSS pour passer les valeurs dynamiques aux keyframes
                // Note: on ne peut pas passer de variables directes dans keyframes en React inline style facilement sans définir le style globalement ou via CSS vars
                transform: `translate(${item.startX}, ${item.startY})`, // Position initiale
                animation: `flyIn 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards`,
                animationDelay: `${item.delay}s`,
              }}
            >
              {/* Petit effet de trainée/blur */}
              <div className="absolute inset-0 bg-white opacity-20 blur-sm"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Titre (Optionnel) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-99999 pointer-events-none gap-6">
        {/* Icône paramètre qui tourne */}
        <div
          className="opacity-0"
          style={{ animation: "fadeInSpin 3s ease-in-out forwards" }}
        >
          <Settings
            size={64}
            className="text-primary-dark mix-blend-overlay"
            style={{ animation: "spin 2s linear infinite" }}
          />
        </div>

        {/* Texte ASSEMBLING */}
        <h1
          className="text-primary-dark font-mono text-4xl font-bold tracking-widest mix-blend-overlay opacity-0"
          style={{ animation: "pulseText 3s ease-in-out forwards" }}
        >
          ASSEMBLING
        </h1>
      </div>

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes fadeInSpin {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes flyIn {
          to {
            transform: translate(0, 0);
            opacity: 0; /* Disparait juste à l'atterrissage pour laisser voir le site */
          }
        }
        @keyframes revealSite {
          to {
            opacity: 0; /* Le masque noir disparait instantanément */
          }
        }
        @keyframes pulseText {
            0% { opacity: 0; letter-spacing: 1em; }
            50% { opacity: 1; letter-spacing: 0.5em; }
            100% { opacity: 0; letter-spacing: 0.2em; }
        }
      `}</style>
    </div>
  );
};

// --- APP PRINCIPALE ---
function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative min-h-screen bg-background">
      {!isLoaded && <PixelGridLoader onComplete={() => setIsLoaded(true)} />}

      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(var(--color-primary) 1px, transparent 1px),
                           linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
            opacity: 0.2,
          }}
        />
      </div>
      {/* Particules lumineuses animées */}
      <div className="particles-container">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-primary"
            style={{
              width: Math.random() * 4 + 1 + "px",
              height: Math.random() * 4 + 1 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              animation: `float ${
                Math.random() * 10 + 5
              }s ease-in-out infinite`,
              animationDelay: Math.random() * 5 + "s",
              opacity: Math.random() * 0.5 + 0.3,
            }}
          />
        ))}
      </div>

      <Header />

      <main className="relative">
        <Hero />
        <Skills />
        <Projects />
        <Experience />
        <Education />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}

export default App;
