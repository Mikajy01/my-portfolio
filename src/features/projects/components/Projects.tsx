import { useEffect, useRef, useState } from "react";
import { ProjectCard } from "./ProjectCard";
import FusionModal from "../../../shared/components/FusionModal";

interface ProjectImage {
  url: string;
  description: string;
}

interface Project {
  title: string;
  description: string;
  tags: string[];
  image: string; // Image principale
  images: ProjectImage[]; // Toutes les images pour le carrousel
  link?: string;
  github?: string;
  fullDescription?: string;
}

const projects: Project[] = [
  {
    title: "E-Commerce Platform",
    description:
      "Plateforme e-commerce complète avec gestion de stock, paiement en ligne et tableau de bord administrateur.",
    fullDescription:
      "Une plateforme e-commerce moderne et complète permettant aux entreprises de gérer leur boutique en ligne. Inclut un système de gestion de stock en temps réel, intégration des paiements sécurisés via Stripe, et un tableau de bord administrateur complet pour le suivi des ventes et des commandes.Une plateforme e-commerce moderne et complète permettant aux entreprises de gérer leur boutique en ligne. Inclut un système de gestion de stock en temps réel, intégration des paiements sécurisés via Stripe, et un tableau de bord administrateur complet pour le suivi des ventes et des commandes.Une plateforme e-commerce moderne et complète permettant aux entreprises de gérer leur boutique en ligne. Inclut un système de gestion de stock en temps réel, intégration des paiements sécurisés via Stripe, et un tableau de bord administrateur complet pour le suivi des ventes et des commandes.Une plateforme e-commerce moderne et complète permettant aux entreprises de gérer leur boutique en ligne. Inclut un système de gestion de stock en temps réel, intégration des paiements sécurisés via Stripe, et un tableau de bord administrateur complet pour le suivi des ventes et des commandes.",
    tags: ["React", "NestJS", "PostgreSQL", "Stripe"],
    image:
      "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80",
    images: [
      {
        url: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80",
        description: "Page d'accueil avec catalogue de produits",
      },
      {
        url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
        description: "Tableau de bord administrateur avec statistiques",
      },
      {
        url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
        description: "Système de gestion de stock en temps réel",
      },
    ],
    link: "#",
    github: "#",
  },
  {
    title: "Task Management App",
    description:
      "Application de gestion de tâches collaborative avec système de notifications en temps réel.",
    fullDescription:
      "Application collaborative permettant aux équipes de gérer leurs tâches et projets efficacement. Fonctionnalités incluant la création de tâches, assignation, notifications push en temps réel via Socket.io, et tableaux Kanban personnalisables.",
    tags: ["Angular", "Express.js", "MySQL", "Socket.io"],
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
    images: [
      {
        url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
        description: "Vue tableau Kanban avec drag & drop",
      },
      {
        url: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80",
        description: "Interface de création et assignation de tâches",
      },
      {
        url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
        description: "Système de notifications en temps réel",
      },
    ],
    link: "#",
    github: "#",
  },
  {
    title: "Analytics Dashboard",
    description:
      "Tableau de bord analytique avec visualisations interactives et exports personnalisables.",
    fullDescription:
      "Dashboard analytique puissant offrant des visualisations de données interactives et personnalisables. Permet l'analyse de données complexes avec des graphiques dynamiques, filtres avancés, et exports en PDF/Excel.",
    tags: ["React", "NestJS", "SQL Server", "Chart.js"],
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    images: [
      {
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
        description: "Vue d'ensemble du tableau de bord avec KPIs",
      },
      {
        url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
        description: "Graphiques interactifs et visualisations de données",
      },
      {
        url: "https://images.unsplash.com/photo-1543286386-713bdd548da4?w=800&q=80",
        description: "Système d'export et de rapports personnalisables",
      },
    ],
    link: "#",
    github: "#",
  },
  {
    title: "Social Media App",
    description:
      "Réseau social avec fil d'actualité, messagerie instantanée et partage de médias.",
    fullDescription:
      "Plateforme de réseau social complète permettant aux utilisateurs de partager du contenu, interagir via des likes et commentaires, envoyer des messages instantanés, et créer des communautés. Optimisé avec Redis pour des performances maximales.",
    tags: ["React", "Express.js", "PostgreSQL", "Redis"],
    image:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
    images: [
      {
        url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
        description: "Fil d'actualité avec posts et interactions",
      },
      {
        url: "https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=800&q=80",
        description: "Interface de messagerie instantanée",
      },
      {
        url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80",
        description: "Profil utilisateur et gestion de médias",
      },
    ],
    link: "#",
    github: "#",
  },
  {
    title: "Booking System",
    description:
      "Système de réservation en ligne avec calendrier dynamique et gestion des disponibilités.",
    fullDescription:
      "Système de réservation intelligent pour services et événements. Calendrier interactif, gestion automatique des disponibilités, paiements en ligne sécurisés, et notifications automatiques par email.",
    tags: ["Angular", "NestJS", "MySQL", "Stripe"],
    image:
      "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&q=80",
    images: [
      {
        url: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&q=80",
        description: "Calendrier interactif de réservation",
      },
      {
        url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
        description: "Gestion des disponibilités et créneaux horaires",
      },
      {
        url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
        description: "Processus de paiement et confirmation",
      },
    ],
    link: "#",
    github: "#",
  },
  {
    title: "Portfolio CMS",
    description:
      "CMS personnalisé pour la création et gestion de portfolios créatifs avec éditeur visuel.",
    fullDescription:
      "Système de gestion de contenu spécialement conçu pour les créatifs. Éditeur visuel drag & drop, gestion de médias optimisée, templates personnalisables, et hébergement sur AWS pour des performances optimales.",
    tags: ["React", "Express.js", "PostgreSQL", "AWS"],
    image:
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80",
    images: [
      {
        url: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80",
        description: "Éditeur visuel avec interface drag & drop",
      },
      {
        url: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&q=80",
        description: "Galerie de templates et thèmes personnalisables",
      },
      {
        url: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&q=80",
        description: "Système de gestion de médias et assets",
      },
    ],
    link: "#",
    github: "#",
  },
];

const Projects = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-slide-up");
            entry.target.classList.remove("opacity-0");
          }
        });
      },
      {
        threshold: 0.3,
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

  const handleOpenModal = (project: Project) => {
    setSelectedProject(project);
    setCurrentImageIndex(0);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (selectedProject) {
      setCurrentImageIndex((prev) =>
        prev === selectedProject.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedProject) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedProject.images.length - 1 : prev - 1
      );
    }
  };

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="py-16 md:py-24 px-4 md:px-8 relative overflow-hidden"
    >
      {/* Effet de lumière */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent opacity-10 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="observe-animation opacity-0 transition-all duration-700 mb-12 md:mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Projets</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Une sélection de mes réalisations les plus significatives
          </p>
          <div className="w-20 h-1 bg-gradient-primary mx-auto rounded-full mt-6" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projects.map((project, idx) => (
            <div
              key={idx}
              className={`observe-animation opacity-0 transition-all duration-700`}
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <ProjectCard
                {...project}
                onViewDetails={() => handleOpenModal(project)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Modal avec carrousel */}
      <FusionModal isOpen={!!selectedProject} onClose={handleCloseModal}>
        {selectedProject && (
          <div className="flex flex-col h-full max-h-[80vh]">
            {" "}
            {/* Ajout de max-h pour contrôler la hauteur totale */}
            {/* En-tête fixe */}
            <div className="flex-shrink-0 pb-4 border-b border-color-border">
              <h2 className="text-3xl font-bold text-color-primary">
                {selectedProject.title}
              </h2>
            </div>
            {/* Contenu scrollable - DOIT avoir une hauteur définie */}
            <div className="flex-1 min-h-0 overflow-y-auto space-y-6 py-4">
              {" "}
              {/* Ajout de min-h-0 crucial */}
              <p className="text-color-text-primary leading-relaxed">
                {selectedProject.fullDescription || selectedProject.description}
              </p>
              {/* Carrousel d'images */}
              <div className="relative">
                <div className="relative aspect-video bg-color-surface rounded-lg overflow-hidden">
                  <img
                    src={selectedProject.images[currentImageIndex].url}
                    alt={selectedProject.images[currentImageIndex].description}
                    className="w-full h-full object-cover"
                  />

                  {/* Boutons de navigation */}
                  {selectedProject.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 text-white flex items-center justify-center transition-all"
                      >
                        ‹
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 text-white flex items-center justify-center transition-all"
                      >
                        ›
                      </button>
                    </>
                  )}

                  {/* Indicateurs */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {selectedProject.images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          idx === currentImageIndex
                            ? "bg-color-primary w-8"
                            : "bg-white bg-opacity-50"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Description de l'image actuelle */}
                <p className="mt-3 text-sm text-color-text-secondary text-center">
                  {selectedProject.images[currentImageIndex].description}
                </p>
              </div>
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {selectedProject.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-xs font-medium rounded-full bg-color-primary-light text-color-primary border border-color-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            {/* Pied de page fixe avec boutons d'action */}
            <div className="flex-shrink-0 pt-4 border-t border-color-border">
              <div className="flex gap-4">
                {selectedProject.link && (
                  <a
                    href={selectedProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 rounded transition-colors bg-color-primary text-white text-center hover:opacity-90"
                  >
                    Voir le site
                  </a>
                )}
                {selectedProject.github && (
                  <a
                    href={selectedProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 rounded transition-colors bg-color-surface-elevated text-color-text-primary border border-color-primary text-center hover:bg-color-surface"
                  >
                    Code source
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
