import { useState, useMemo, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ProjectCard } from "./ProjectCard";
import ProjectModal from "./ProjectModal";
import { type Project } from "../data/projects";
import projectsFr from "../data/projects.fr.json";
import projectsEn from "../data/projects.en.json";
import { useLanguage } from "../../../shared/context/LanguageContext";

const PROJECT_META: Record<string, { categoryFr: string; categoryEn: string; year: string }> = {
  "educore": { categoryFr: "ERP académique", categoryEn: "Academic ERP", year: "2025" },
  "espm": { categoryFr: "Site institutionnel", categoryEn: "Institutional site", year: "2025" },
  "hotel-management-system": { categoryFr: "Plateforme SaaS", categoryEn: "SaaS platform", year: "2024" },
  "innovt-learning-hub": { categoryFr: "Plateforme web", categoryEn: "Web platform", year: "2024" },
  "portfolio": { categoryFr: "Site personnel", categoryEn: "Personal site", year: "2026" },
  "school-management-system": { categoryFr: "Logiciel de gestion", categoryEn: "Business software", year: "2023" },
  "faritany-game": { categoryFr: "Jeu temps réel", categoryEn: "Realtime game", year: "2024" },
  "rock-paper-scissors-online": { categoryFr: "Jeu temps réel", categoryEn: "Realtime game", year: "2023" },
  "barbleu": { categoryFr: "Logiciel de gestion", categoryEn: "Business software", year: "2023" },
  "java-reservation-optimizer": { categoryFr: "Logiciel desktop", categoryEn: "Desktop software", year: "2023" },
};

const useImagePreloader = () => {
  const preloadedImages = useRef<Set<string>>(new Set());
  const preloadProjectImages = useCallback((project: Project) => {
    project.images.forEach((img) => {
      if (!preloadedImages.current.has(img.url)) {
        const image = new Image();
        image.src = img.url;
        preloadedImages.current.add(img.url);
      }
    });
  }, []);
  return { preloadProjectImages };
};

const INITIAL_PROJECTS_COUNT = 8;

const getProjectsByLanguage = (language: string): Project[] =>
  (language.startsWith("fr") ? projectsFr : projectsEn) as Project[];

type Variant = "featured" | "compact" | "wide";

// Groupe les projets par lots de 4 : 1 mis en avant, 2 côte à côte, 1 en large.
function assignVariants(projects: Project[]): { project: Project; variant: Variant }[] {
  const out: { project: Project; variant: Variant }[] = [];
  for (let i = 0; i < projects.length; i++) {
    const pos = i % 4;
    const variant: Variant = pos === 0 ? "featured" : pos === 3 ? "wide" : "compact";
    out.push({ project: projects[i], variant });
  }
  return out;
}

const Projects = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "professional" | "personal">("all");
  const [showAllProjects, setShowAllProjects] = useState(false);

  const { preloadProjectImages } = useImagePreloader();

  const translatedProjects = useMemo(
    () => [...getProjectsByLanguage(language)].sort((a, b) => b.note - a.note),
    [language]
  );

  const filteredProjects = useMemo(
    () => (activeTab === "all" ? translatedProjects : translatedProjects.filter((p) => p.type === activeTab)),
    [translatedProjects, activeTab]
  );

  const displayedProjects = useMemo(
    () => (showAllProjects ? filteredProjects : filteredProjects.slice(0, INITIAL_PROJECTS_COUNT)),
    [filteredProjects, showAllProjects]
  );

  const hasMoreProjects = filteredProjects.length > INITIAL_PROJECTS_COUNT;
  const isShowingLess = hasMoreProjects && !showAllProjects;

  const handleOpenModal = useCallback(
    (project: Project) => {
      setSelectedProject(project);
      setTimeout(() => preloadProjectImages(project), 100);
    },
    [preloadProjectImages]
  );

  const handleCloseModal = useCallback(() => setSelectedProject(null), []);

  const filters: { key: "all" | "professional" | "personal"; label: string }[] = [
    { key: "all", label: t("projects.viewAll") },
    { key: "professional", label: t("projects.professional") },
    { key: "personal", label: t("projects.personal") },
  ];

  const rows = useMemo(() => {
    const assigned = assignVariants(displayedProjects);
    const out: { project: Project; variant: Variant }[][] = [];
    let i = 0;
    while (i < assigned.length) {
      if (assigned[i].variant === "compact" && assigned[i + 1]?.variant === "compact") {
        out.push([assigned[i], assigned[i + 1]]);
        i += 2;
      } else {
        out.push([assigned[i]]);
        i += 1;
      }
    }
    return out;
  }, [displayedProjects]);

  return (
    <section id="work" className="relative z-1 max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-10 py-16 lg:py-28">
      <div data-reveal className="flex items-baseline gap-5 mb-14">
        <span className="font-mono text-[11px] tracking-[.18em] text-primary">{t("work.eyebrow")}</span>
        <span className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
        <span className="font-mono text-[11px] tracking-[.14em] text-text-muted hidden sm:inline">
          {filteredProjects.length} {t("work.caseStudies")}
        </span>
      </div>

      <div data-reveal className="flex flex-wrap gap-2.5 mb-10">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => { setActiveTab(f.key); setShowAllProjects(false); }}
            className="font-mono text-[11px] tracking-[.12em] uppercase px-4 py-2 border transition-colors"
            style={{
              borderColor: activeTab === f.key ? "var(--color-primary)" : "var(--color-border)",
              color: activeTab === f.key ? "var(--color-primary)" : "var(--color-text-secondary)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--color-primary)";
              e.currentTarget.style.color = "var(--color-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = activeTab === f.key ? "var(--color-primary)" : "var(--color-border)";
              e.currentTarget.style.color = activeTab === f.key ? "var(--color-primary)" : "var(--color-text-secondary)";
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-7">
        {rows.map((row, i) => (
          <div key={i} className={row.length === 2 ? "grid grid-cols-1 sm:grid-cols-2 gap-7" : ""}>
            {row.map(({ project, variant }) => {
              const meta = PROJECT_META[project.id];
              const category = meta ? (language.startsWith("fr") ? meta.categoryFr : meta.categoryEn) : project.type;
              return (
                <ProjectCard
                  key={project.id}
                  title={project.title}
                  description={project.description}
                  tags={project.tags}
                  image={project.image}
                  type={project.type}
                  category={category}
                  year={meta?.year ?? ""}
                  variant={variant}
                  onViewDetails={() => handleOpenModal(project)}
                />
              );
            })}
          </div>
        ))}
      </div>

      {isShowingLess && (
        <div className="flex justify-center mt-10">
          <button
            type="button"
            onClick={() => setShowAllProjects(true)}
            className="font-mono text-[11px] tracking-[.14em] uppercase px-6 py-3 border border-border text-text-primary hover:border-primary transition-colors"
          >
            {t("projects.seeMore")} ({filteredProjects.length - INITIAL_PROJECTS_COUNT})
          </button>
        </div>
      )}

      {filteredProjects.length === 0 && (
        <p className="text-center py-12 text-text-secondary">—</p>
      )}

      <ProjectModal isOpen={!!selectedProject} onClose={handleCloseModal} project={selectedProject} />
    </section>
  );
};

export default Projects;
