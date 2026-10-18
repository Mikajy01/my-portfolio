import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import * as Tooltip from "@radix-ui/react-tooltip";
import Modal from "../../../shared/components/Modal";
import { Briefcase, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { type Project } from "../data/projects";

const DESCRIPTION_TRUNCATE_LENGTH = 260;
const CAPTION_TRUNCATE_LENGTH = 90;

// Coupe au dernier espace avant la limite pour ne pas trancher un mot en deux.
function truncateAtWord(text: string, limit: number) {
  const slice = text.slice(0, limit);
  const lastSpace = slice.lastIndexOf(" ");
  return `${(lastSpace > limit * 0.6 ? slice.slice(0, lastSpace) : slice).trimEnd()}…`;
}

// Démonté/remonté via `key` à chaque changement de projet (ou d'image, pour
// la légende) : son état `expanded` n'a donc pas besoin d'être réinitialisé
// manuellement.
const TruncatedText: React.FC<{ text: string; limit: number; className: string; toggleClassName: string }> = ({
  text,
  limit,
  className,
  toggleClassName,
}) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > limit;
  const shown = expanded || !isLong ? text : truncateAtWord(text, limit);

  return (
    <p className={className}>
      {shown}
      {isLong && (
        <button type="button" onClick={() => setExpanded((v) => !v)} className={toggleClassName}>
          {expanded ? t("projects.seeLess") : t("projects.seeMore")}
        </button>
      )}
    </p>
  );
};

const OptimizedImage: React.FC<{ src: string; alt: string; className?: string }> = ({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <div className={`relative ${className}`}>
      {!isLoaded && <div className="absolute inset-0 bg-surface animate-pulse" />}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsLoaded(true)}
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
}

const ProjectModal = ({ isOpen, onClose, project }: ProjectModalProps) => {
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

  const visibleTags = project?.tags.slice(0, 6) ?? [];
  const hiddenTags = project?.tags.slice(6) ?? [];

  return (
    <Tooltip.Provider delayDuration={200}>
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl">
        {project && (
          <div className="flex flex-col h-full max-h-[80vh]">
            <div className="shrink-0 pb-4 border-b" style={{ borderColor: "var(--color-border)" }}>
              <div className="flex items-center gap-2.5 mb-3 font-mono text-[10px] tracking-[.16em] uppercase text-text-muted">
                <span className="inline-flex items-center gap-1.5 border px-2.5 py-1 text-primary" style={{ borderColor: "var(--color-primary)" }}>
                  {project.type === "professional" ? <Briefcase className="w-3 h-3" /> : <Heart className="w-3 h-3" />}
                  {project.type === "professional" ? t("projects.professional") : t("projects.personal")}
                </span>
              </div>
              <h2 className="font-heading font-semibold text-[1.9rem] leading-tight text-text-primary">
                {project.title}
              </h2>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto scroll-thin space-y-6 py-5">
              <TruncatedText
                key={project.id}
                text={project.fullDescription || project.description}
                limit={DESCRIPTION_TRUNCATE_LENGTH}
                className="text-text-secondary leading-relaxed"
                toggleClassName="ml-1.5 font-mono text-[11px] tracking-wide text-primary hover:underline"
              />

              {project.images.length > 0 && (
                <div className="relative group">
                  <div className="blueprint overflow-hidden aspect-video bg-surface" ref={emblaRef} style={{ borderColor: "var(--color-border)" }}>
                    <div className="flex h-full">
                      {project.images.map((img, idx) => (
                        <div key={idx} className="flex-[0_0_100%] min-w-0 relative h-full">
                          <div className="duotone w-full h-full">
                            <OptimizedImage src={img.url} alt={img.description} className="w-full h-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {project.images.length > 1 && (
                    <>
                      <button
                        onClick={scrollPrev}
                        aria-label="Previous image"
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <button
                        onClick={scrollNext}
                        aria-label="Next image"
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <div className="absolute top-3 right-3 px-2 py-0.5 bg-black/50 text-white/90 font-mono text-[10px] tabular-nums">
                        {currentIndex + 1} / {project.images.length}
                      </div>
                    </>
                  )}

                  {project.images.length > 1 && (
                    <div className="flex items-center justify-center gap-1.5 mt-3">
                      {project.images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => emblaApi?.scrollTo(idx)}
                          aria-label={`Go to image ${idx + 1}`}
                          className="h-1.5 transition-all"
                          style={{
                            width: idx === currentIndex ? 20 : 6,
                            background: idx === currentIndex ? "var(--color-primary)" : "var(--color-border)",
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {project.images[currentIndex] && (
                    <TruncatedText
                      key={`${project.id}-${currentIndex}`}
                      text={project.images[currentIndex].description}
                      limit={CAPTION_TRUNCATE_LENGTH}
                      className="mt-2 text-sm text-text-secondary text-center italic"
                      toggleClassName="ml-1.5 not-italic font-mono text-[11px] tracking-wide text-primary hover:underline"
                    />
                  )}
                </div>
              )}

              <div>
                <h3 className="font-mono text-[10px] tracking-[.16em] uppercase text-text-muted mb-3">
                  Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {visibleTags.map((tag) => (
                    <span key={tag} className="font-mono text-[10.5px] tracking-[.06em] border px-2.5 py-1 text-text-secondary" style={{ borderColor: "var(--color-border)" }}>
                      {tag}
                    </span>
                  ))}
                  {hiddenTags.length > 0 && (
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <span className="font-mono text-[10.5px] tracking-[.06em] border px-2.5 py-1 text-text-muted cursor-default select-none" style={{ borderColor: "var(--color-border)" }}>
                          +{hiddenTags.length} {t("projects.more")}
                        </span>
                      </Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content
                          side="top"
                          align="start"
                          sideOffset={6}
                          className="z-9999 px-3 py-2"
                          style={{ backgroundColor: "var(--color-surface-elevated)", border: "1px solid var(--color-border)" }}
                        >
                          <div className="flex flex-wrap gap-1.5 max-w-xs">
                            {hiddenTags.map((tag) => (
                              <span key={tag} className="font-mono text-[10px] border px-2 py-0.5 text-text-secondary" style={{ borderColor: "var(--color-border)" }}>
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

            <div className="shrink-0 pt-4 border-t flex gap-3" style={{ borderColor: "var(--color-border)" }}>
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 text-center font-mono text-[11px] tracking-[.12em] uppercase transition-opacity hover:opacity-85"
                  style={{ background: "var(--color-primary)", color: "var(--color-background)" }}
                >
                  {t("projects.liveDemo")}
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 text-center font-mono text-[11px] tracking-[.12em] uppercase border border-border text-text-primary hover:border-primary transition-colors"
                >
                  {t("projects.viewCode")}
                </a>
              )}
            </div>
          </div>
        )}
      </Modal>
    </Tooltip.Provider>
  );
};

export default ProjectModal;
