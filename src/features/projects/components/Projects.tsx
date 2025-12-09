import { useEffect, useRef, useState } from "react";
import { ProjectCard } from "./ProjectCard";
import FusionModal from "../../../shared/components/FusionModal";

// --- INTERFACES ---

interface ProjectImage {
  url: string;
  description: string;
}

export interface Project {
  title: string;
  category: "professional" | "personal"; // Nouveau champ
  description: string;
  tags: string[];
  image: string;
  images: ProjectImage[];
  link?: string;
  github?: string;
  fullDescription?: string;
}

interface Award {
  title: string;
  event: string;
  year: string;
  description: string;
  image: string; // Background image
  icon?: string; // Emoji ou icône
}

// --- DATA ---

const awards: Award[] = [
  {
    title: "1er Prix - Hackathon Innovation",
    event: "TechWeek Madagascar",
    year: "2023",
    description:
      "Développement d'une solution IA pour l'agriculture durable en 48h.",
    image:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80",
    icon: "🏆",
  },
  {
    title: "Meilleure UI/UX Design",
    event: "WebCup Regional",
    year: "2022",
    description:
      "Récompense pour l'expérience utilisateur la plus fluide et accessible.",
    image:
      "https://images.unsplash.com/photo-1561489413-985b06da5bee?w=800&q=80",
    icon: "🎨",
  },
];

const projects: Project[] = [
  {
    title: "E-Commerce Platform",
    category: "professional",
    description:
      "Plateforme e-commerce complète avec gestion de stock et paiement.",
    fullDescription: "Une plateforme e-commerce moderne...",
    tags: ["React", "NestJS", "PostgreSQL", "Stripe", "Redis", "Docker", "AWS"], // Beaucoup de tags pour tester le +5
    image:
      "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80",
    images: [
      {
        url: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80",
        description: "Accueil",
      },
    ],
    link: "#",
    github: "#",
  },
  {
    title: "Task Management App",
    category: "personal",
    description: "App collaborative avec notifications temps réel.",
    tags: ["Angular", "Express.js", "Socket.io"],
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
    images: [
      {
        url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
        description: "Kanban",
      },
    ],
    github: "#",
  },
  {
    title: "Analytics Dashboard",
    category: "professional",
    description: "Dashboard analytique avec visualisations interactives.",
    tags: ["React", "D3.js", "SQL Server"],
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    images: [
      {
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
        description: "Dashboard",
      },
    ],
    link: "#",
  },
  {
    title: "Social Media App",
    category: "personal",
    description: "Réseau social avec fil d'actualité et messagerie.",
    tags: ["React", "Firebase", "Tailwind"],
    image:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
    images: [
      {
        url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
        description: "Feed",
      },
    ],
    github: "#",
  },
  {
    title: "Booking System",
    category: "professional",
    description: "Système de réservation intelligent.",
    tags: ["Next.js", "Prisma", "PostgreSQL"],
    image:
      "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&q=80",
    images: [
      {
        url: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&q=80",
        description: "Calendrier",
      },
    ],
    link: "#",
  },
];

// --- COMPONENTS ---

const Projects = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [filter, setFilter] = useState<"all" | "professional" | "personal">(
    "all"
  );
  const [isAnimating, setIsAnimating] = useState(false);

  // Observer pour les animations au scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-slide-up");
            entry.target.classList.remove("opacity-0", "translate-y-8");
          }
        });
      },
      { threshold: 0.1, rootMargin: "-50px" }
    );

    const elements = sectionRef.current?.querySelectorAll(".observe-animation");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [filter]); // Re-run quand le filtre change

  // Gestion du changement de filtre avec petite animation
  const handleFilterChange = (newFilter: typeof filter) => {
    if (filter === newFilter) return;
    setIsAnimating(true);
    setTimeout(() => {
      setFilter(newFilter);
      setIsAnimating(false);
    }, 300);
  };

  const filteredProjects = projects.filter(
    (p) => filter === "all" || p.category === filter
  );

  // --- MODAL LOGIC ---
  const handleOpenModal = (project: Project) => {
    setSelectedProject(project);
    setCurrentImageIndex(0);
  };
  const handleCloseModal = () => setSelectedProject(null);
  const nextImage = () =>
    selectedProject &&
    setCurrentImageIndex((prev) =>
      prev === selectedProject.images.length - 1 ? 0 : prev + 1
    );
  const prevImage = () =>
    selectedProject &&
    setCurrentImageIndex((prev) =>
      prev === 0 ? selectedProject.images.length - 1 : prev - 1
    );

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="py-20 px-4 md:px-8 relative overflow-hidden bg-color-background"
    >
      {/* --- BACKGROUND AMBIANCE --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-color-primary opacity-[0.03] rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 -right-20 w-[500px] h-[500px] bg-color-secondary opacity-[0.03] rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* --- HEADER --- */}
        <div className="text-center mb-20 observe-animation opacity-0 translate-y-8 transition-all duration-700">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Mes{" "}
            <span className="text-gradient drop-shadow-sm">Réalisations</span>
          </h2>
          <p className="text-color-text-secondary max-w-2xl mx-auto text-lg">
            Un mélange de projets professionnels rigoureux et d'expérimentations
            personnelles créatives.
          </p>
          <div className="w-24 h-1.5 bg-gradient-primary mx-auto rounded-full mt-8 shadow-glow" />
        </div>

        {/* --- SECTION 1: AWARDS (NOUVEAU) --- */}
        <div className="mb-24">
          <div className="flex items-center gap-4 mb-8 observe-animation opacity-0 translate-y-8 transition-all duration-700">
            <h3 className="text-2xl font-bold text-color-text-primary">
              🏆 Récompenses & Hackathons
            </h3>
            <div className="h-px bg-color-border flex-1" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {awards.map((award, idx) => (
              <div
                key={idx}
                className="group relative h-48 md:h-64 rounded-2xl overflow-hidden card-elevated observe-animation opacity-0 translate-y-8 transition-all duration-700 hover:shadow-glow-lg"
                style={{ transitionDelay: `${idx * 150}ms` }}
              >
                {/* Background Image with Dark Overlay */}
                <div className="absolute inset-0">
                  <img
                    src={award.image}
                    alt={award.event}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-center items-start z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl animate-bounce-scale">
                      {award.icon}
                    </span>
                    <span className="px-3 py-1 bg-color-primary/20 backdrop-blur-md border border-color-primary/40 text-color-primary-light text-xs font-bold rounded-full">
                      {award.year}
                    </span>
                  </div>
                  <h4 className="text-2xl md:text-3xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    {award.title}
                  </h4>
                  <p className="text-gray-300 font-medium mb-2">
                    {award.event}
                  </p>
                  <p className="text-gray-400 text-sm max-w-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                    {award.description}
                  </p>
                </div>

                {/* Border Glow Effect */}
                <div className="absolute inset-0 border-2 border-white/10 rounded-2xl group-hover:border-color-primary/50 transition-colors duration-300" />
              </div>
            ))}
          </div>
        </div>

        {/* --- SECTION 2: PROJECTS CONTROLS --- */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 observe-animation opacity-0 transition-all duration-700">
          <h3 className="text-2xl font-bold text-color-text-primary self-start md:self-center">
            📂 Galerie de Projets
          </h3>

          {/* Custom Tabs */}
          <div className="bg-color-surface p-1.5 rounded-xl border border-color-border flex relative shadow-inner">
            {(["all", "professional", "personal"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => handleFilterChange(tab)}
                className={`
                   relative z-10 px-6 py-2 text-sm font-medium rounded-lg transition-all duration-300
                   ${
                     filter === tab
                       ? "text-white"
                       : "text-color-text-secondary hover:text-color-text-primary"
                   }
                 `}
              >
                {tab === "all"
                  ? "Tous"
                  : tab === "professional"
                  ? "Professionnel"
                  : "Personnel"}
                {filter === tab && (
                  <span className="absolute inset-0 bg-gradient-primary rounded-lg -z-10 shadow-md animate-bounce-scale" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* --- PROJECTS GRID --- */}
        <div
          className={`
            grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 
            transition-opacity duration-300 ease-in-out
            ${isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"}
          `}
        >
          {filteredProjects.map((project, idx) => (
            <div
              key={`${project.title}-${idx}`}
              className="observe-animation opacity-0 translate-y-8 transition-all duration-700"
              style={{ transitionDelay: `${(idx % 3) * 100}ms` }}
            >
              <ProjectCard
                {...project}
                index={idx}
                onViewDetails={() => handleOpenModal(project)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* --- MODAL (IDENTIQUE MAIS NETTOYÉ) --- */}
      <FusionModal isOpen={!!selectedProject} onClose={handleCloseModal}>
        {selectedProject && (
          <div className="flex flex-col h-full rounded-2xl max-h-[85vh] bg-color-surface-elevated">
            {/* Header Modal */}
            <div className="flex-shrink-0 p-6 border-b border-color-border/50 flex justify-between items-start">
              <div>
                <span
                  className={`inline-block px-3 py-1 mb-3 text-xs font-bold rounded-full border ${
                    selectedProject.category === "professional"
                      ? "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700"
                      : "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700"
                  }`}
                >
                  {selectedProject.category === "professional"
                    ? "PRO"
                    : "PERSO"}
                </span>
                <h2 className="text-3xl font-bold text-color-text-primary">
                  {selectedProject.title}
                </h2>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 min-h-0 overflow-y-auto scroll-thin p-6 space-y-8">
              {/* Carousel */}
              <div className="relative group rounded-xl overflow-hidden shadow-2xl border border-color-border/50">
                <div className="aspect-video bg-black/5">
                  <img
                    src={selectedProject.images[currentImageIndex].url}
                    alt={selectedProject.images[currentImageIndex].description}
                    className="w-full h-full object-contain md:object-cover"
                  />
                </div>

                {/* Navigation Overlay */}
                {selectedProject.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
                    >
                      ‹
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
                    >
                      ›
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {selectedProject.images.map((_, idx) => (
                        <div
                          key={idx}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            idx === currentImageIndex
                              ? "w-8 bg-white"
                              : "w-2 bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white text-center text-sm font-medium">
                  {selectedProject.images[currentImageIndex].description}
                </div>
              </div>

              <div className="prose dark:prose-invert max-w-none text-color-text-secondary leading-relaxed">
                {selectedProject.fullDescription || selectedProject.description}
              </div>

              {/* Tags Cloud */}
              <div>
                <h4 className="text-sm uppercase tracking-wider font-bold text-color-text-muted mb-3">
                  Technologies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 text-sm rounded-lg bg-color-surface border border-color-border text-color-text-primary hover:border-color-primary/50 transition-colors cursor-default"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="flex-shrink-0 p-6 border-t border-color-border/50 bg-color-surface/30 backdrop-blur-sm">
              <div className="flex gap-4">
                {selectedProject.link && (
                  <a
                    href={selectedProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-6 rounded-lg bg-gradient-primary text-white text-center font-bold hover:shadow-glow hover:-translate-y-0.5 transition-all"
                  >
                    Voir le site
                  </a>
                )}
                {selectedProject.github && (
                  <a
                    href={selectedProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-6 rounded-lg bg-color-surface border border-color-border text-color-text-primary text-center font-bold hover:bg-color-surface-elevated hover:border-color-primary transition-all"
                  >
                    Code Source
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </FusionModal>
    </section>
  );
};

export default Projects;
