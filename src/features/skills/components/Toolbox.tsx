import { useTranslation } from "react-i18next";

type TechnologyCategory = "frontend" | "backend" | "database" | "mobile" | "tools" | "languages";

interface Technology {
  name: string;
  color: string;
  category: TechnologyCategory;
}

const technologies: Technology[] = [
  { name: "React", color: "#61DAFB", category: "frontend" },
  { name: "Angular", color: "#DD0031", category: "frontend" },
  { name: "HTML5", color: "#E34F26", category: "frontend" },
  { name: "CSS3", color: "#1572B6", category: "frontend" },
  { name: "Sass", color: "#CC6699", category: "frontend" },
  { name: "Tailwind", color: "#38BDF8", category: "frontend" },
  { name: "NestJS", color: "#E0234E", category: "backend" },
  { name: "Node.js", color: "#339933", category: "backend" },
  { name: "Express", color: "currentColor", category: "backend" },
  { name: "Socket.io", color: "currentColor", category: "backend" },
  { name: "PostgreSQL", color: "#4169E1", category: "database" },
  { name: "MySQL", color: "#4479A1", category: "database" },
  { name: "Prisma", color: "currentColor", category: "database" },
  { name: "MongoDB", color: "#47A248", category: "database" },
  { name: "Flutter", color: "#02569B", category: "mobile" },
  { name: "Git", color: "#F05032", category: "tools" },
  { name: "Docker", color: "#2496ED", category: "tools" },
  { name: "Kubernetes", color: "#326CE5", category: "tools" },
  { name: "TypeScript", color: "#3178C6", category: "languages" },
  { name: "Python", color: "#3776AB", category: "languages" },
  { name: "Java", color: "#007396", category: "languages" },
];

const categories: TechnologyCategory[] = ["frontend", "backend", "database", "mobile", "tools", "languages"];

export const Toolbox = () => {
  const { t } = useTranslation();

  return (
    <section id="toolbox" className="relative z-1 max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-10 py-16 lg:py-24">
      <div data-reveal className="flex items-baseline gap-5 mb-14">
        <span className="font-mono text-[11px] tracking-[.18em] text-primary">{t("toolbox.eyebrow")}</span>
        <span className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
        <span className="font-mono text-[11px] tracking-[.14em] text-text-muted hidden sm:inline">
          {t("toolbox.label")}
        </span>
      </div>

      <div className="border-t" style={{ borderColor: "var(--color-border)" }}>
        {categories.map((category, idx) => {
          const items = technologies.filter((tech) => tech.category === category);
          if (items.length === 0) return null;
          return (
            <div
              key={category}
              data-reveal
              className="grid grid-cols-1 sm:grid-cols-[240px_minmax(0,1fr)] gap-4 sm:gap-10 py-6 border-b items-center transition-colors"
              style={{ borderColor: "var(--color-border)" }}
            >
              <div className="flex items-baseline gap-3.5">
                <span className="font-mono text-[10px] tracking-[.16em] text-primary">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="font-heading font-semibold text-[26px] tracking-[-.01em]">
                  {t(`skills.categories.${category}`)}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {items.map((tech) => (
                  <span
                    key={tech.name}
                    className="font-mono text-[11px] tracking-[.06em] px-3.5 py-1.5 border transition-all duration-200 hover:-translate-y-0.5"
                    style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = tech.color === "currentColor" ? "var(--color-primary)" : tech.color;
                      e.currentTarget.style.color = tech.color === "currentColor" ? "var(--color-primary)" : tech.color;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--color-border)";
                      e.currentTarget.style.color = "var(--color-text-secondary)";
                    }}
                  >
                    {tech.name}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Toolbox;
