import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import * as Tooltip from "@radix-ui/react-tooltip";
import FusionModal from "../../../shared/components/FusionModal";
import { Briefcase, Heart, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { type Project } from "../data/projects";

// ─── Image optimisée ──────────────────────────────────────────────────────────
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

// ─── Modal ────────────────────────────────────────────────────────────────────
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
  const { t } = useTranslation();

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setCurrentIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  useEffect(() => {
    if (emblaApi) emblaApi.scrollTo(0);
    setCurrentIndex(0);
  }, [project, emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const visibleTags = project?.tags.slice(0, 5) ?? [];
  const hiddenTags  = project?.tags.slice(5)  ?? [];

  return (
    <Tooltip.Provider delayDuration={200}>
      <FusionModal
        isOpen={isOpen}
        onClose={onClose}
        className={className}
        reducedMotion={reducedMotion}
      >
        {project && (
          <div className="flex flex-col h-full rounded-2xl max-h-[80vh]">

            {/* ── En-tête fixe ── */}
            <div className="shrink-0 pb-4 border-b border-color-border">
              <h2 className="text-3xl font-bold text-color-primary mb-2">
                {project.title}
              </h2>
              <div className="flex items-center gap-2">
                {project.type === "professional" ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-color-primary/10 text-color-primary text-xs font-medium border border-color-primary/20">
                    <Briefcase className="w-3 h-3" />
                    Professionnel
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-color-accent/10 text-color-accent text-xs font-medium border border-color-accent/20">
                    <Heart className="w-3 h-3" />
                    Personnel
                  </div>
                )}
              </div>
            </div>

            {/* ── Contenu scrollable ── */}
            <div className="flex-1 min-h-0 overflow-y-auto scroll-thin space-y-6 py-4">
              <p className="text-color-text-primary leading-relaxed">
                {project.fullDescription || project.description}
              </p>

              {/* ── Carrousel Embla ── */}
              {project.images.length > 0 && (
                <div className="relative group">
                  <div
                    className="overflow-hidden rounded-xl shadow-lg aspect-video bg-color-surface"
                    ref={emblaRef}
                  >
                    <div className="flex h-full">
                      {project.images.map((img, idx) => (
                        <div key={idx} className="flex-[0_0_100%] min-w-0 relative h-full">
                          <OptimizedImage
                            src={img.url}
                            alt={img.description}
                            className="w-full h-full"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {project.images.length > 1 && (
                    <>
                      {/* Bouton Précédent */}
                      <button
                        onClick={scrollPrev}
                        aria-label="Image précédente"
                        className="
                          absolute left-3 top-1/2 -translate-y-1/2
                          w-9 h-9 rounded-full
                          bg-black/30 backdrop-blur-md border border-black/10
                          text-white drop-shadow-md
                          flex items-center justify-center
                          opacity-0 group-hover:opacity-100
                          -translate-x-1 group-hover:translate-x-0
                          transition-all duration-200
                          hover:bg-black/50 hover:scale-110 active:scale-95
                          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60
                        "
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>

                      {/* Bouton Suivant */}
                      <button
                        onClick={scrollNext}
                        aria-label="Image suivante"
                        className="
                          absolute right-3 top-1/2 -translate-y-1/2
                          w-9 h-9 rounded-full
                          bg-black/30 backdrop-blur-md border border-black/10
                          text-white drop-shadow-md
                          flex items-center justify-center
                          opacity-0 group-hover:opacity-100
                          translate-x-1 group-hover:translate-x-0
                          transition-all duration-200
                          hover:bg-black/50 hover:scale-110 active:scale-95
                          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60
                        "
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>

                      {/* Compteur — en haut à droite, loin des dots */}
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm text-white/90 text-xs font-medium tabular-nums select-none">
                        {currentIndex + 1} / {project.images.length}
                      </div>


                    </>
                  )}

                  {/* Dots — entre l'image et la légende, hors du carrousel */}
                  {project.images.length > 1 && (
                    <div className="flex items-center justify-center gap-1.5 mt-3">
                      {project.images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => emblaApi?.scrollTo(idx)}
                          aria-label={`Aller à l'image ${idx + 1}`}
                          className={`rounded-full transition-all duration-300 ${
                            idx === currentIndex
                              ? "w-5 h-1.5 bg-color-primary"
                              : "w-1.5 h-1.5 bg-color-border hover:bg-color-primary/50"
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Légende */}
                  <p className="mt-2 text-sm text-color-text-secondary text-center italic">
                    {project.images[currentIndex]?.description}
                  </p>
                </div>
              )}

              {/* ── Tags ── */}
              <div>
                <h3 className="text-sm font-semibold text-color-text-primary mb-3 flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-color-primary" />
                  Technologies utilisées
                </h3>
                <div className="flex flex-wrap gap-2">
                  {visibleTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 text-xs font-medium rounded-full bg-color-primary-light/10 text-color-primary border border-color-primary/20 hover:bg-color-primary-light/20 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}

                  {hiddenTags.length > 0 && (
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <span className="px-3 py-1.5 text-xs font-medium rounded-full bg-color-surface text-color-text-secondary border border-color-border cursor-default select-none hover:border-color-primary/40 transition-colors">
                          +{hiddenTags.length} {t("projects.more")}
                        </span>
                      </Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content
                          side="top"
                          align="start"
                          sideOffset={6}
                          className="z-[9999] px-3 py-2 rounded-lg animate-in fade-in-0 zoom-in-95"
                          style={{
                            backgroundColor: "var(--color-surface-elevated)",
                            border: "1px solid var(--color-border)",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
                          }}
                        >
                          <div className="flex flex-wrap gap-1.5 max-w-xs">
                            {hiddenTags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-color-primary-light/10 text-color-primary border border-color-primary/20"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <Tooltip.Arrow style={{ fill: "var(--color-surface-elevated)" }} />
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>
                  )}
                </div>
              </div>
            </div>

            {/* ── Pied de page fixe ── */}
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
    </Tooltip.Provider>
  );
};

export default ProjectModal;