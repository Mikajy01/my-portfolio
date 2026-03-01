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
import { useState, useCallback, useMemo } from "react";
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

  @keyframes bug-float {
    0%   { transform: translateY(0px)   rotate(0deg)   scale(1); }
    20%  { transform: translateY(-18px) rotate(-8deg)  scale(1.05); }
    40%  { transform: translateY(-30px) rotate(5deg)   scale(0.95); }
    60%  { transform: translateY(-18px) rotate(-3deg)  scale(1.08); }
    80%  { transform: translateY(-8px)  rotate(6deg)   scale(0.97); }
    100% { transform: translateY(0px)   rotate(0deg)   scale(1); }
  }

  @keyframes bug-glitch {
    0%,  90%, 100% { opacity: 1; filter: none; text-shadow: none; }
    91% {
      opacity: 0.6;
      filter: blur(1px);
      text-shadow: 2px 0 #ff0040, -2px 0 #00ffff;
    }
    93% {
      opacity: 1;
      filter: none;
      text-shadow: -3px 0 #ff0040, 3px 0 #00ffff;
    }
    95% {
      opacity: 0.7;
      filter: blur(0.5px);
      text-shadow: 1px 0 #ff0040;
    }
    97% {
      opacity: 1;
      text-shadow: none;
    }
  }

  .bug-char {
    position: absolute;
    font-family: 'Courier New', monospace;
    font-weight: bold;
    pointer-events: none;
    user-select: none;
    animation:
      bug-float var(--float-duration) ease-in-out infinite,
      bug-glitch var(--glitch-duration) ease-in-out infinite;
    animation-delay: var(--delay), var(--glitch-delay);
    color: var(--color-primary);
    will-change: transform, opacity;
  }
`;

// Pool de caractères "buggy" : code, symboles, erreurs...
const BUG_CHARS = [
  "⚠️", "//", "??", "{}",
  "null", "NaN", "404", "500", "ERR", "0x",
  "sudo", "git", "npm", "bug", "fix",
  "#!", "&&", "||", "=>", "...",
  "try", "catch", "void", "true", "false",
  "0b", "0xFF", "~", "^", "%",
  "</>", "<!>", ":::", "***", "___",
];

interface BugParticle {
  id: number;
  char: string;
  left: string;
  top: string;
  fontSize: string;
  opacity: number;
  floatDuration: string;
  glitchDuration: string;
  delay: string;
  glitchDelay: string;
}

function useBugParticles(count = 55): BugParticle[] {
  return useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      char: BUG_CHARS[Math.floor(Math.random() * BUG_CHARS.length)],
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      fontSize: `${Math.random() * 10 + 9}px`,
      opacity: Math.random() * 0.25 + 0.07,
      floatDuration: `${Math.random() * 8 + 6}s`,
      glitchDuration: `${Math.random() * 4 + 3}s`,
      delay: `${Math.random() * 8}s`,
      glitchDelay: `${Math.random() * 6}s`,
    }));
  }, []);
}

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const handleLoaderComplete = useCallback(() => setIsLoaded(true), []);
  const bugParticles = useBugParticles(80);

  return (
    <LanguageProvider>
      <style>{revealStyles}</style>

      {!isLoaded && <AppLoader onComplete={handleLoaderComplete} />}
      <Header />

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

        {/* Bug characters flottants */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {bugParticles.map((p) => (
            <span
              key={p.id}
              className="bug-char"
              style={{
                left: p.left,
                top: p.top,
                fontSize: p.fontSize,
                opacity: p.opacity,
                "--float-duration": p.floatDuration,
                "--glitch-duration": p.glitchDuration,
                "--delay": p.delay,
                "--glitch-delay": p.glitchDelay,
              } as React.CSSProperties}
            >
              {p.char}
            </span>
          ))}
        </div>

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