import { useEffect, useMemo, useRef } from "react";
import { Trans, useTranslation } from "react-i18next";
import {
  Shield,
  Zap,
  GitBranch,
  Puzzle,
  Rocket,
  Sparkles,
  Target,
  Lock,
} from "lucide-react";

// ─── react-icons ──────────────────────────────────────────────────────────────
import {
  SiNestjs,
  SiExpress,
  SiPostgresql,
  SiMysql,
  SiPrisma,
  SiSocketdotio,
  SiDocker,
  SiKubernetes,
  SiTailwindcss,
  SiSass,
  SiFlutter,
  SiAngular,
  SiTypescript,
  SiMongodb,
} from "react-icons/si";
import {
  FaReact,
  FaNodeJs,
  FaPython,
  FaJava,
  FaGitAlt,
  FaHtml5,
  FaCss3Alt,
} from "react-icons/fa";
// ─────────────────────────────────────────────────────────────────────────────

import { useLanguage } from "../../../shared/context/LanguageContext";
import skillsFr from "../data/skills.fr.json";
import skillsEn from "../data/skills.en.json";
import HandDrawnUnderline from "../../../shared/components/HandDrawnUnderline";

type TechnologyCategory =
  | "frontend"
  | "backend"
  | "database"
  | "mobile"
  | "tools"
  | "languages";

interface Technology {
  name: string;
  Icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color?: string;
  className?: string;
  category: TechnologyCategory;
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
  // Frontend
  { name: "React",       Icon: FaReact,       color: "#61DAFB", category: "frontend" },
  { name: "Angular",     Icon: SiAngular,     color: "#DD0031", category: "frontend" },
  { name: "HTML5",       Icon: FaHtml5,       color: "#E34F26", category: "frontend" },
  { name: "CSS3",        Icon: FaCss3Alt,     color: "#1572B6", category: "frontend" },
  { name: "Sass",        Icon: SiSass,        color: "#CC6699", category: "frontend" },
  { name: "Tailwind",    Icon: SiTailwindcss, color: "#38BDF8", category: "frontend" },
  // Backend
  { name: "NestJS",      Icon: SiNestjs,      color: "#E0234E", category: "backend" },
  { name: "Node.js",     Icon: FaNodeJs,      color: "#339933", category: "backend" },
  { name: "Express",     Icon: SiExpress,     color: "currentColor", category: "backend" },
  { name: "Socket.io",   Icon: SiSocketdotio, color: "currentColor", category: "backend" },
  // Database
  { name: "PostgreSQL",  Icon: SiPostgresql,  color: "#4169E1", category: "database" },
  { name: "MySQL",       Icon: SiMysql,       color: "#4479A1", category: "database" },
  { name: "Prisma",      Icon: SiPrisma,      color: "currentColor", category: "database" },
  { name: "MongoDB",     Icon: SiMongodb,     color: "#47A248", category: "database" },
  // Mobile
  { name: "Flutter",     Icon: SiFlutter,     color: "#02569B", category: "mobile" },
  // Tools & DevOps
  { name: "Git",         Icon: FaGitAlt,      color: "#F05032", category: "tools" },
  { name: "Docker",      Icon: SiDocker,      color: "#2496ED", category: "tools" },
  { name: "Kubernetes",  Icon: SiKubernetes,  color: "#326CE5", category: "tools" },
  // Languages
  { name: "TypeScript",  Icon: SiTypescript,  color: "#3178C6", category: "languages" },
  { name: "Python",      Icon: FaPython,      color: "#3776AB", category: "languages" },
  { name: "Java",        Icon: FaJava,        color: "#007396", category: "languages" },
];

const technologyCategories: TechnologyCategory[] = [
  "frontend",
  "backend",
  "database",
  "mobile",
  "tools",
  "languages",
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  gitBranch: GitBranch,
  shield:    Shield,
  zap:       Zap,
  target:    Target,
  lock:      Lock,
  puzzle:    Puzzle,
  rocket:    Rocket,
  sparkles:  Sparkles,
};

const getSkillsByLanguage = (
  language: string
): { concepts: Concept[]; highlights: Highlight[] } => {
  const raw = language.startsWith("fr") ? skillsFr : skillsEn;

  const concepts: Concept[] = raw.concepts.map((c: any) => ({
    name: c.name,
    Icon: iconMap[c.icon] ?? Target,
  }));

  const highlights: Highlight[] = raw.highlights.map((h: any) => ({
    title: h.title,
    description: h.description,
    Icon: iconMap[h.icon] ?? Target,
  }));

  return { concepts, highlights };
};

const Skills = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);

  const { concepts, highlights } = useMemo(
    () => getSkillsByLanguage(language),
    [language]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-slide-up");
            entry.target.classList.remove("opacity-0");

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
            <span className="text-gradient">{t("skills.title")}</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            <Trans
              i18nKey="skills.subtitleWithWordHighlighted"
              components={{
                underline: (
                  <HandDrawnUnderline>
                    <></>
                  </HandDrawnUnderline>
                ),
              }}
            />
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
                  <span className="text-gradient">{t("skills.subtitle")}</span>
                </h3>
              </div>
              <div className="space-y-6">
                {technologyCategories.map((category) => {
                  const items = technologies.filter(
                    (tech) => tech.category === category
                  );
                  if (items.length === 0) return null;

                  return (
                    <div key={category}>
                      <h4 className="text-sm font-semibold text-text-secondary mb-3 uppercase tracking-wide">
                        {t(`skills.categories.${category}`)}
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {items.map((tech, idx) => (
                          <div
                            key={`${category}-${idx}`}
                            className="tech-item opacity-0 glass-effect px-4 py-3 rounded-xl border border-border-light hover:border-primary transition-all duration-300 hover:scale-105 hover:shadow-lg group/item"
                          >
                            <div className="flex items-center gap-2">
                              <tech.Icon
                                className={`w-5 h-5 flex-shrink-0 group-hover/item:scale-125 transition-transform duration-300 ${tech.className ?? ""}`}
                                style={{ color: tech.color }}
                              />
                              <span className="text-sm font-medium text-text-primary">
                                {tech.name}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
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
                  <SiKubernetes className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold">
                  <span className="text-gradient-accent">
                    {t("skills.conceptsTitle")}
                  </span>
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
              <h3 className="text-2xl md:text-3xl font-bold text-gradient">
                {t("skills.highlightsTitle")}
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