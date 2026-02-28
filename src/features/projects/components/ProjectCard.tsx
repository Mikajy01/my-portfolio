import { ExternalLink, Github, Briefcase, Heart, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  image: string;
  link?: string;
  github?: string;
  type: "professional" | "personal";
  onViewDetails: () => void;
}

// ─── Tooltip Portal ───────────────────────────────────────────────────────────
const TagsTooltip = ({
  tags,
  anchorRef,
}: {
  tags: string[];
  anchorRef: React.RefObject<HTMLElement>;
}) => {
  const [style, setStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (!anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    setStyle({
      position: "fixed",
      top: rect.bottom + 8,
      left: rect.left,
      zIndex: 9999,
    });
  }, [anchorRef]);

  return createPortal(
    <div
      className="px-3 py-2 rounded-lg shadow-xl border border-color-border"
      // Fond solide qui suit le thème (clair ou sombre)
      style={{
        ...style,
        backgroundColor: "var(--color-surface-elevated)",
        border: "1px solid var(--color-border)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
      }}
    >
      <div className="flex flex-wrap gap-1.5 max-w-xs">
        {tags.map((tag, idx) => (
          <span
            key={idx}
            className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-color-primary-light/10 text-color-primary border border-color-primary/20"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>,
    document.body
  );
};

// ─── Project Card ─────────────────────────────────────────────────────────────
export const ProjectCard = ({
  title,
  description,
  tags,
  image,
  link,
  github,
  type,
  onViewDetails,
}: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMoreHovered, setIsMoreHovered] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const hiddenTags = tags.slice(3);

  return (
    <div
      className="group relative h-full rounded-2xl overflow-hidden bg-color-surface border border-color-border transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] hover:border-color-primary/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image avec overlay gradient */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className={`w-full h-full object-cover transition-all duration-700 ${
            isHovered ? "scale-110 brightness-75" : "scale-100"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-color-surface via-color-surface/50 to-transparent" />

        {/* Badge type */}
        <div className="absolute top-4 right-4 z-10">
          {type === "professional" ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/90 backdrop-blur-sm text-white text-xs font-medium shadow-lg">
              <Briefcase className="w-3 h-3" />
              Pro
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-500/90 backdrop-blur-sm text-white text-xs font-medium shadow-lg">
              <Heart className="w-3 h-3" />
              Perso
            </div>
          )}
        </div>

        {/* Overlay boutons d'action rapide */}
        <div
          className={`absolute inset-0 flex items-center justify-center gap-3 transition-all duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-3 rounded-full bg-background/90 hover:bg-background text-color-primary transition-all hover:scale-110 shadow-lg"
              title="Voir le site"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          )}
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-3 rounded-full bg-background/90 hover:bg-background text-color-primary transition-all hover:scale-110 shadow-lg"
              title="Code source"
            >
              <Github className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>

      {/* Contenu */}
      <div className="p-6 space-y-4">
        <h3  className="text-xl font-bold text-color-text-primary group-hover:text-color-primary transition-colors line-clamp-1">
          {title}
        </h3>

        <p className="text-sm text-color-text-secondary leading-relaxed line-clamp-2">
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 text-xs font-medium rounded-full bg-color-primary-light/10 text-color-primary border border-color-primary/20"
            >
              {tag}
            </span>
          ))}

          {hiddenTags.length > 0 && (
            <div
              ref={anchorRef as React.RefObject<HTMLDivElement>}
              className="relative"
              onMouseEnter={() => setIsMoreHovered(true)}
              onMouseLeave={() => setIsMoreHovered(false)}
            >
              <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-color-surface-elevated text-color-text-secondary border border-color-border cursor-default select-none">
                +{hiddenTags.length} {t("projects.more")}
              </span>

              {/* Tooltip monté dans document.body — échappe à overflow:hidden */}
              {isMoreHovered && (
                <TagsTooltip
                  tags={hiddenTags}
                  anchorRef={anchorRef as React.RefObject<HTMLElement>}
                />
              )}
            </div>
          )}
        </div>

        {/* Bouton voir détails */}
        <button
          onClick={onViewDetails}
          className="w-full cursor-pointer mt-4 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-color-primary-light/10 hover:bg-color-primary text-color-primary hover:text-color border border-color-primary/20 hover:border-color-primary transition-all duration-300 font-medium text-sm group/btn"
        >
          <span>Voir les détails</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
        </button>
      </div>

      {/* Effet de brillance au survol */}
      <div
        className={`absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-1000 pointer-events-none ${
          isHovered ? "animate-shimmer" : ""
        }`}
        style={{ backgroundSize: "200% 100%" }}
      />
    </div>
  );
};