import { useEffect, useRef } from "react";
import {
  Shield,
  Zap,
  GitBranch,
  Puzzle,
  Rocket,
  Sparkles,
  Target,
  Globe,
  Lock,
} from "lucide-react";
import HandDrawnUnderline from "../../../shared/components/HandDrawnUnderline";
import { TechIcons } from "../../../shared/icons/TechIcons";


interface Technology {
  name: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color?: string;
}

interface Concept {
  name: string;
  Icon: React.ComponentType<{ className?: string }>;
}

interface Highlight {
  title: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
}

const technologies: Technology[] = [
  { name: "NestJS", Icon: TechIcons.NestJS, color: "#E0234E" },
  { name: "Node.js", Icon: TechIcons.NodeJS, color: "#339933" },
  { name: "Express", Icon: TechIcons.Express },
  { name: "Python", Icon: TechIcons.Python, color: "#3776AB" },
  { name: "Java", Icon: TechIcons.Java, color: "#007396" },
  { name: "React", Icon: TechIcons.React, color: "#61DAFB" },
  { name: "Flutter", Icon: TechIcons.Flutter, color: "#61DAFB" },
  { name: "PostgreSQL", Icon: TechIcons.PostgreSQL, color: "#4169E1" },
  { name: "MySQL", Icon: TechIcons.MySQL, color: "#4479A1" },
  { name: "Git", Icon: TechIcons.Git},
  { name: "Socket.io", Icon: TechIcons.SocketIO},
  { name: "Docker", Icon: TechIcons.Docker, color: "#2496ED" },
  { name: "Kubernetes", Icon: TechIcons.Kubernetes, color: "#326CE5" },
];

const concepts: Concept[] = [
  { name: "Architecture SOLID", Icon: GitBranch },
  { name: "JWT / Auth / Sécurité", Icon: Shield },
  { name: "Systèmes temps réel", Icon: Zap },
  { name: "Optimisation algo", Icon: Target },
  { name: "Concurrence / Sync", Icon: Lock },
  { name: "Résolution de problèmes", Icon: Puzzle },
];

const highlights: Highlight[] = [
  {
    title: "Rapidité d'exécution",
    description: "Développement agile avec livraison rapide",
    Icon: Rocket,
  },
  {
    title: "Code propre",
    description: "Architecture maintenable et scalable",
    Icon: Sparkles,
  },
  {
    title: "Problèmes complexes",
    description: "Solutions innovantes aux défis techniques",
    Icon: Target,
  },
];

const Skills = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-slide-up");
            entry.target.classList.remove("opacity-0");

            // Animer les éléments avec délai progressif
            const items = entry.target.querySelectorAll(
              ".tech-item, .concept-item"
            );
            items.forEach((item, idx) => {
              setTimeout(() => {
                item.classList.add("animate-bounce-scale");
                item.classList.remove("opacity-0");
              }, idx * 50);
            });
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "-50px 0px -50px 0px",
      }
    );

    const elements = sectionRef.current?.querySelectorAll(".observe-animation");
    elements?.forEach((el) => observer.observe(el));

    return () => {
      elements?.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="py-16 md:py-24 px-4 md:px-8 relative overflow-hidden bg-background"
    >
      {/* Effet de grille animée */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at center, var(--color-primary) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="observe-animation opacity-0 transition-all duration-700 mb-16 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="text-gradient">Tech Stack</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Technologies, concepts et approches que je{" "}
            <HandDrawnUnderline color="var(--color-primary)" delay={300}>
              maîtrise
            </HandDrawnUnderline>{" "}
            pour créer des solutions robustes
          </p>
          <div className="w-24 h-1 bg-gradient-primary mx-auto rounded-full mt-6" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Langages & Technologies */}
          <div className="observe-animation opacity-0 transition-all duration-700 lg:col-span-2">
            <div className="glass-effect p-8 rounded-2xl h-full border border-border hover:glow-effect transition-all duration-500 group">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold">
                  <span className="text-gradient">Langages & Technologies</span>
                </h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {technologies.map((tech, idx) => (
                  <div
                    key={idx}
                    className="tech-item opacity-0 glass-effect px-4 py-3 rounded-xl border border-border-light hover:border-primary transition-all duration-300 hover:scale-105 hover:shadow-lg group/item"
                  >
                    <div className="flex items-center gap-2">
                      <tech.Icon
                        className="w-5 h-5 group-hover/item:scale-125 transition-transform duration-300"
                        style={{ color: tech.color }}
                        // L'utilisation de 'fill="currentColor"' dans les SVG permet à ce style de colorer l'icône
                      />
                      <span className="text-sm font-medium text-text-primary">
                        {tech.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Concepts / Soft Skills */}
          <div className="observe-animation opacity-0 transition-all duration-700 delay-200">
            <div className="glass-effect p-8 rounded-2xl h-full border border-border hover:glow-effect transition-all duration-500 group">
              <div className="flex items-center gap-3 mb-8">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--color-secondary), var(--color-accent))",
                  }}
                >
                  <TechIcons.Kubernetes className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold">
                  <span className="text-gradient-accent">Concepts</span>
                </h3>
              </div>
              <div className="space-y-3">
                {concepts.map((concept, idx) => (
                  <div
                    key={idx}
                    className="concept-item opacity-0 glass-effect px-4 py-3 rounded-xl border border-border-light hover:border-secondary transition-all duration-300 hover:scale-105 hover:shadow-lg group/item"
                  >
                    <div className="flex items-center gap-3">
                      <concept.Icon className="w-5 h-5 text-secondary group-hover/item:scale-125 transition-transform duration-300" />
                      <span className="text-sm font-medium text-text-primary">
                        {concept.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Highlights personnels */}
        <div className="observe-animation opacity-0 transition-all duration-700 delay-400">
          <div className="glass-effect p-8 rounded-2xl border border-border">
            <div className="flex items-center gap-3 mb-8 justify-center">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-accent), var(--color-primary))",
                }}
              >
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gradient">
                Points Forts
              </h3>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {highlights.map((highlight, idx) => (
                <div
                  key={idx}
                  className="relative group"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="glass-effect p-6 rounded-xl border border-border-light hover:border-accent transition-all duration-500 hover:scale-105 hover:shadow-xl h-full">
                    <div className="mb-4 inline-flex p-3 rounded-lg bg-gradient-primary group-hover:scale-110 transition-transform duration-300">
                      <highlight.Icon className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-xl font-bold mb-2 text-text-primary">
                      {highlight.title}
                    </h4>
                    <p className="text-text-secondary text-sm">
                      {highlight.description}
                    </p>
                  </div>
                  {/* Effet de brillance au survol */}
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(circle at center, var(--color-glow), transparent 70%)",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
