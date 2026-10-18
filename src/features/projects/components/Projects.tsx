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
  "signetis": { categoryFr: "API bancaire", categoryEn: "Banking API", year: "2025" },
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

type Variant = "hero" | "grid" | "list";
type AssignedProject = { project: Project; variant: Variant; index: number };

// "hero" une seule fois (le tout premier, donc le mieux noté dans l'onglet
// courant) — pas à chaque lot de 4, sinon la mise en avant perd son sens.
// Le reste alterne 2 cartes grille / 1 rangée liste, pour un vrai contraste
// visuel plutôt que le même habillage juste redisposé.
function assignVariants(projects: Project[]): AssignedProject[] {
  return projects.map((project, i) => {
    if (i === 0) return { project, variant: "hero" as Variant, index: i };
    const variant: Variant = (i - 1) % 3 === 2 ? "list" : "grid";
    return { project, variant, index: i };
  });
}

type RowBlock =
  | { kind: "solo"; item: AssignedProject }
  | { kind: "pair"; items: [AssignedProject, AssignedProject] }
  | { kind: "list"; items: AssignedProject[] };

// Regroupe les items assignés en blocs de rendu : les "grid" consécutifs vont
// par paires (grille 2 colonnes), les "list" consécutifs forment un seul bloc
// de rangées empilées (séparateurs seulement, pas de gap de carte entre eux),
// "hero" reste toujours seul sur sa ligne.
function groupIntoBlocks(assigned: AssignedProject[]): RowBlock[] {
  const out: RowBlock[] = [];
  let i = 0;
  while (i < assigned.length) {
    const cur = assigned[i];
    if (cur.variant === "list") {
      const items = [cur];
      i += 1;
      while (assigned[i]?.variant === "list") {
        items.push(assigned[i]);
        i += 1;
      }
      out.push({ kind: "list", items });
    } else if (cur.variant === "grid" && assigned[i + 1]?.variant === "grid") {
      out.push({ kind: "pair", items: [cur, assigned[i + 1]] });
      i += 2;
    } else {
      out.push({ kind: "solo", item: cur });
      i += 1;
    }
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

  const blocks = useMemo(() => groupIntoBlocks(assignVariants(displayedProjects)), [displayedProjects]);

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
        {blocks.map((block, bi) => {
          const renderCard = ({ project, variant, index }: AssignedProject) => {
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
                index={index}
                onViewDetails={() => handleOpenModal(project)}
              />
            );
          };

          if (block.kind === "pair") {
            return (
              <div key={bi} className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                {block.items.map(renderCard)}
              </div>
            );
          }

          if (block.kind === "list") {
            return (
              <div key={bi} className="flex flex-col border-t" style={{ borderColor: "var(--color-border)" }}>
                {block.items.map(renderCard)}
              </div>
            );
          }

          return <div key={bi}>{renderCard(block.item)}</div>;
        })}
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
