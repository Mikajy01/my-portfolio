import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ProjectCard } from "./ProjectCard";
import ProjectModal from "./ProjectModal";
import { Briefcase, Heart } from "lucide-react";
import { type Project } from "../data/projects";
import projectsFr from "../data/projects.fr.json";
import projectsEn from "../data/projects.en.json";
import { useLanguage } from "../../../shared/context/LanguageContext";

// Hook personnalisé pour précharger les images
const useImagePreloader = () => {
  const preloadedImages = useRef<Set<string>>(new Set());

  const preloadImage = useCallback((src: string) => {
    if (!preloadedImages.current.has(src)) {
      const img = new Image();
      img.src = src;
      preloadedImages.current.add(src);
    }
  }, []);

  const preloadProjectImages = useCallback(
    (project: Project) => {
      project.images.forEach((img) => preloadImage(img.url));
    },
    [preloadImage],
  );

  return { preloadProjectImages };
};

const INITIAL_PROJECTS_COUNT = 6;

const getProjectsByLanguage = (language: string): Project[] => {
  if (language.startsWith("fr")) {
    return projectsFr as Project[];
  }
  return projectsEn as Project[];
};

const Projects = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);

  // ── Un seul state pour le projet sélectionné ──────────────────────────────
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<
    "all" | "professional" | "personal"
  >("all");
  const [showAllProjects, setShowAllProjects] = useState(false);

  const { preloadProjectImages } = useImagePreloader();

  const isLowEndDevice = useMemo(() => {
    const deviceMemory = (navigator as any).deviceMemory;
    const isLowMemory = deviceMemory && deviceMemory < 4;
    return isLowMemory || /Android.*Chrome/.test(navigator.userAgent);
  }, []);

  const translatedProjects = useMemo(
    () => [...getProjectsByLanguage(language)].sort((a, b) => b.note - a.note),
    [language],
  );

  const filteredProjects = useMemo(
    () =>
      activeTab === "all"
        ? translatedProjects
        : translatedProjects.filter((p) => p.type === activeTab),
    [translatedProjects, activeTab],
  );

  const displayedProjects = useMemo(
    () =>
      showAllProjects
        ? filteredProjects
        : filteredProjects.slice(0, INITIAL_PROJECTS_COUNT),
    [filteredProjects, showAllProjects],
  );

  const hasMoreProjects = filteredProjects.length > INITIAL_PROJECTS_COUNT;
  const isShowingLess = hasMoreProjects && !showAllProjects;

  useEffect(() => {
    setShowAllProjects(false);
  }, [activeTab]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-slide-up");
            entry.target.classList.remove("opacity-0");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -50px 0px" },
    );

    const timer = setTimeout(() => {
      const elements =
        sectionRef.current?.querySelectorAll(".observe-animation");
      elements?.forEach((el) => observer.observe(el));
    }, 50);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [filteredProjects, displayedProjects]);

  const handleOpenModal = useCallback(
    (project: Project) => {
      setSelectedProject(project);
      setTimeout(() => preloadProjectImages(project), 100);
    },
    [preloadProjectImages],
  );

  const handleCloseModal = useCallback(() => {
    setSelectedProject(null);
  }, []);

  const professionalCount = translatedProjects.filter(
    (p) => p.type === "professional",
  ).length;
  const personalCount = translatedProjects.filter(
    (p) => p.type === "personal",
  ).length;

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="py-16 md:py-24 px-4 md:px-8 relative overflow-hidden"
    >
      {/* Effets de lumière */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent opacity-10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary opacity-10 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* En-tête */}
        <div className="observe-animation opacity-0 transition-all duration-700 mb-12 md:mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">{t("projects.title")}</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            {t("projects.subtitle")}
          </p>
          <div className="w-20 h-1 bg-gradient-primary mx-auto rounded-full mt-6" />
        </div>

        {/* Filtres */}
        <div className="observe-animation opacity-0 transition-all duration-700 mb-8">
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setActiveTab("all")}
              className={`group relative px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === "all"
                  ? "bg-gradient-primary text-white shadow-lg scale-105"
                  : "bg-surface text-text-secondary hover:text-primary border border-border hover:border-primary"
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
                {t("projects.viewAll")}
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${activeTab === "all" ? "bg-white/20" : "bg-primary-light/10 text-primary"}`}
                >
                  {translatedProjects.length}
                </span>
              </span>
              {activeTab === "all" && (
                <div className="absolute inset-0 bg-gradient-primary blur-xl opacity-50" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("professional")}
              className={`group relative px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === "professional"
                  ? "bg-gradient-primary text-white shadow-lg scale-105"
                  : "bg-surface text-text-secondary hover:text-primary border border-border hover:border-primary"
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                {t("projects.professional")}
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${activeTab === "professional" ? "bg-white/20" : "bg-primary-light/10 text-primary"}`}
                >
                  {professionalCount}
                </span>
              </span>
              {activeTab === "professional" && (
                <div className="absolute inset-0 bg-gradient-primary blur-xl opacity-50" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("personal")}
              className={`group relative px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === "personal"
                  ? "bg-gradient-primary text-white shadow-lg scale-105"
                  : "bg-surface text-text-secondary hover:text-primary border border-border hover:border-primary"
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Heart className="w-4 h-4" />
                {t("projects.personal")}
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${activeTab === "personal" ? "bg-white/20" : "bg-primary-light/10 text-primary"}`}
                >
                  {personalCount}
                </span>
              </span>
              {activeTab === "personal" && (
                <div className="absolute inset-0 bg-gradient-primary blur-xl opacity-50" />
              )}
            </button>
          </div>
        </div>

        {/* Grille de projets */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {displayedProjects.map((project, idx) => (
            <div
              key={`${project.id}-${activeTab}`}
              className="observe-animation opacity-0 transition-all duration-700"
              style={{ transitionDelay: `${(idx % 3) * 100}ms` }}
            >
              <ProjectCard
                {...project}
                onViewDetails={() => handleOpenModal(project)}
              />
            </div>
          ))}
        </div>

        {isShowingLess && (
          <div className="flex justify-center mt-8 observe-animation opacity-0 transition-all duration-700">
            <button
              type="button"
              onClick={() => setShowAllProjects(true)}
              className="px-6 py-3 rounded-xl font-medium transition-all duration-300 bg-gradient-primary text-white shadow-lg hover:opacity-90 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {t("projects.seeMore")} (
              {filteredProjects.length - INITIAL_PROJECTS_COUNT})
            </button>
          </div>
        )}

        {filteredProjects.length === 0 && (
          <div className="text-center py-12 observe-animation opacity-0 transition-all duration-700">
            <p className="text-text-secondary">
              Aucun projet dans cette catégorie pour le moment.
            </p>
          </div>
        )}
      </div>

      <ProjectModal
        isOpen={!!selectedProject}
        onClose={handleCloseModal}
        project={selectedProject}
        className={isLowEndDevice ? "max-w-sm" : ""}
        reducedMotion={isLowEndDevice}
      />
    </section>
  );
};

export default Projects;
