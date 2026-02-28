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
import { LanguageProvider } from "../shared/context/LanguageContext";
import { useState } from "react";
import { AppLoader } from "./AppLoader";

const revealStyles = `
  @keyframes app-reveal {
    0% {
      opacity: 0;
      transform: scale(0.88) rotate(-2deg);
      filter: brightness(1.6) blur(6px);
    }
    40% {
      opacity: 1;
      filter: brightness(1.1) blur(0px);
    }
    70% {
      transform: scale(1.015) rotate(0.4deg);
    }
    100% {
      opacity: 1;
      transform: scale(1) rotate(0deg);
      filter: brightness(1) blur(0px);
    }
  }

  .app-reveal {
    animation: app-reveal 0.75s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    transform-origin: center center;
  }

  .app-hidden {
    opacity: 0;
    pointer-events: none;
  }
`;

function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <LanguageProvider>
      <style>{revealStyles}</style>

      {!isLoaded && <AppLoader onComplete={() => setIsLoaded(true)} />}

      <div className={`relative min-h-screen bg-background ${isLoaded ? "app-reveal" : "app-hidden"}`}>
        {/* Grid background */}
        <div className="fixed inset-0 pointer-events-none opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(var(--color-primary) 1px, transparent 1px),
                linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)
              `,
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
                animation: `float ${Math.random() * 10 + 5}s ease-in-out infinite`,
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
          <Awards />
          <Certifications />
          <Experience />
          <Education />
          <Contact />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}

export default App;