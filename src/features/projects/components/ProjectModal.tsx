import { useState, useCallback, useEffect } from "react";
import FusionModal from "../../../shared/components/FusionModal";
import { Briefcase, Heart, ChevronRight } from "lucide-react";
import { type Project } from "../data/projects";

// Composant d'image optimisé avec lazy loading (utilisé dans le carrousel du modal)
const OptimizedImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
}> = ({ src, alt, className, onLoad }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoaded(true);
  }, []);

  return (
    <div className={`relative ${className}`}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-color-surface animate-pulse rounded-lg" />
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
};

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  className?: string;
  reducedMotion?: boolean;
}

const ProjectModal = ({
  isOpen,
  onClose,
  project,
  className,
  reducedMotion = false,
}: ProjectModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (project) {
      setCurrentImageIndex(0);
    }
  }, [project]);

  const nextImage = useCallback(() => {
    if (project) {
      setCurrentImageIndex((prev) =>
        prev === project.images.length - 1 ? 0 : prev + 1,
      );
    }
  }, [project]);

  const prevImage = useCallback(() => {
    if (project) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? project.images.length - 1 : prev - 1,
      );
    }
  }, [project]);

  return (
    <FusionModal
      isOpen={isOpen}
      onClose={onClose}
      className={className}
      reducedMotion={reducedMotion}
    >
      {project && (
        <div className="flex flex-col h-full rounded-2xl max-h-[80vh]">
          {/* En-tête fixe */}
          <div className="shrink-0 pb-4 border-b border-color-border">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-color-primary mb-2">
                  {project.title}
                </h2>
                <div className="flex items-center gap-2">
                  {project.type === "professional" ? (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text--primary text-xs font-medium border border-primary/20">
                      <Briefcase className="w-3 h-3" />
                      Professionnel
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium border border-accent/20">
                      <Heart className="w-3 h-3" />
                      Personnel
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contenu scrollable */}
          <div className="flex-1 min-h-0 overflow-y-auto scroll-thin space-y-6 py-4">
            <p className="text-color-text-primary leading-relaxed">
              {project.fullDescription || project.description}
            </p>

            {/* ─── Carrousel amélioré ─── */}
            <div className="relative group">
              <div className="relative aspect-video bg-color-surface rounded-xl overflow-hidden shadow-lg">
                <OptimizedImage
                  src={project.images[currentImageIndex].url}
                  alt={project.images[currentImageIndex].description}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />

                {/* Dégradé bas pour le compteur */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

                {project.images.length > 1 && (
                  <>
                    {/* Bouton Précédent */}
                    <button
                      onClick={prevImage}
                      aria-label="Image précédente"
                      className="
                          absolute left-3 top-1/2 -translate-y-1/2
                          w-9 h-9 rounded-full
                          bg-black/30 backdrop-blur-md border border-black/10
                          text-white drop-shadow-md
                          flex items-center justify-center
                          opacity-0 group-hover:opacity-100
                          translate-x-2 group-hover:translate-x-0
                          transition-all duration-200
                          hover:bg-black/50 hover:scale-110 active:scale-95
                          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60
                        "
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10 12L6 8L10 4"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    {/* Bouton Suivant */}
                    <button
                      onClick={nextImage}
                      aria-label="Image suivante"
                      className="
                          absolute right-3 top-1/2 -translate-y-1/2
                          w-9 h-9 rounded-full
                          bg-black/30 backdrop-blur-md border border-black/10
                          text-white drop-shadow-md
                          flex items-center justify-center
                          opacity-0 group-hover:opacity-100
                          translate-x-2 group-hover:translate-x-0
                          transition-all duration-200
                          hover:bg-black/50 hover:scale-110 active:scale-95
                          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60
                        "
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 4L10 8L6 12"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    {/* Compteur discret en bas à droite */}
                    <div className="absolute bottom-2.5 right-3 text-white/80 text-xs font-medium tabular-nums select-none">
                      {currentImageIndex + 1} / {project.images.length}
                    </div>
                  </>
                )}

                {/* Indicateurs de position (dots) */}
                {project.images.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                    {project.images.map((_: unknown, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        aria-label={`Aller à l'image ${idx + 1}`}
                        className={`
                      rounded-full transition-all duration-300
                      ${
                        idx === currentImageIndex
                          ? "w-5 h-1.5 bg-white"
                          : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
                      }
                    `}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Légende */}
              <p className="mt-2.5 text-sm text-color-text-secondary text-center italic">
                {project.images[currentImageIndex].description}
              </p>
            </div>

            {/* Tags */}
            <div>
              <h3 className="text-sm font-semibold text-color-text-primary mb-3 flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-color-primary" />
                Technologies utilisées
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.slice(0, 5).map((tag: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 text-xs font-medium rounded-full bg-color-primary-light/10 text-color-primary border border-color-primary/20 hover:bg-color-primary-light/20 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
                {project.tags.length > 5 && (
                  <span className="px-3 py-1.5 text-xs font-medium rounded-full bg-color-surface text-color-text-secondary border border-color-border">
                    +{project.tags.length - 5} more
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Pied de page fixe */}
          <div className="shrink-0 pt-4 border-t border-color-border">
            <div className="flex gap-4">
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 rounded-lg transition-colors bg-gradient-primary text-white text-center hover:opacity-90 font-medium"
                >
                  Voir le site
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 rounded-lg transition-colors bg-color-surface-elevated text-color-text-primary border border-color-primary text-center hover:bg-color-surface font-medium"
                >
                  Code source
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </FusionModal>
  );
};

export default ProjectModal;
