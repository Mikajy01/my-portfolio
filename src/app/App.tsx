import { useEffect } from "react";
import About from "../features/about";
import Skills from "../features/skills";
import Projects from "../features/projects";
import Contact from "../features/contact";
import { Header } from "../shared/components/Header";
import { Hero } from "../features/hero";
import { Footer } from "../shared/components/Footer";
import { Education } from "../features/education";
import { Experience } from "../features/experience";

function App() {
  useEffect(() => {
    // Animation d'apparition au chargement
    document.body.style.opacity = "0";
    setTimeout(() => {
      document.body.style.transition = "opacity 0.6s ease";
      document.body.style.opacity = "1";
    }, 100);
  }, []);

  return (
    <div className="relative min-h-screen bg-background">
      {/* Effet de grille futuriste en arrière-plan */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(var(--color-primary) 1px, transparent 1px),
                           linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
            opacity: 0.1,
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

      <main className="relative z-10 overflow-x-hidden">
        <Hero />
        <About />
        <Skills />
        <Education /> {/* ✨ AJOUTER */}
        <Experience />
        <Projects />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}

export default App;
