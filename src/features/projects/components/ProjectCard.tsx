import { useRef } from "react";
import { Briefcase, Heart } from "lucide-react";
import Corner from "../../../shared/components/Corner";

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  image: string;
  type: "professional" | "personal";
  category: string;
  year: string;
  variant: "hero" | "grid" | "list";
  /** Numéro de rang affiché par le variant "list" (ex: "03"). */
  index?: number;
  onViewDetails: () => void;
}

const ArrowIcon = ({ color = "currentColor" }: { color?: string }) => (
  <svg width="22" height="10" viewBox="0 0 22 10" fill="none" stroke={color} strokeWidth={1.5}>
    <path d="M0 5h20M16 1l4 4-4 4" />
  </svg>
);

const useCardParallax = () => {
  const layerRef = useRef<HTMLDivElement>(null);
  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const layer = layerRef.current;
    if (!layer) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    layer.style.transform = `translate(${(px * -18).toFixed(1)}px, ${(py * -14).toFixed(1)}px) scale(1.05)`;
  };
  const onMouseLeave = () => {
    if (layerRef.current) layerRef.current.style.transform = "translate(0,0) scale(1)";
  };
  return { layerRef, onMouseMove, onMouseLeave };
};

const Visual: React.FC<{ image: string; title: string; className?: string }> = ({ image, title, className }) => {
  const { layerRef, onMouseMove, onMouseLeave } = useCardParallax();
  return (
    <div className={`relative overflow-hidden ${className ?? ""}`} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      <div ref={layerRef} className="absolute -inset-[18px] transition-transform duration-500" style={{ transitionTimingFunction: "cubic-bezier(.2,.7,.2,1)" }}>
        <div className="duotone absolute inset-0">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
};

const Meta: React.FC<{ category: string; year: string; type: "professional" | "personal" }> = ({ category, year, type }) => (
  <div className="flex items-center gap-3.5 mb-4 font-mono text-[10px] tracking-[.16em] uppercase text-text-muted">
    <span className="inline-flex items-center gap-1.5 border px-2.5 py-1 text-primary" style={{ borderColor: "var(--color-primary)" }}>
      {type === "professional" ? <Briefcase className="w-3 h-3" /> : <Heart className="w-3 h-3" />}
    </span>
    <span>{category} · {year}</span>
  </div>
);

const Tags: React.FC<{ tags: string[] }> = ({ tags }) => (
  <div className="flex flex-wrap gap-2">
    {tags.slice(0, 4).map((tag) => (
      <span key={tag} className="font-mono text-[10px] tracking-widest border px-2.5 py-1 text-text-secondary" style={{ borderColor: "var(--color-border)" }}>
        {tag}
      </span>
    ))}
  </div>
);

export const ProjectCard: React.FC<ProjectCardProps> = ({
  title, description, tags, image, type, category, year, variant, index, onViewDetails,
}) => {
  // Rangée indexée, sans image ni cadre "blueprint" — un objet volontairement
  // différent des cartes (pas juste les mêmes blocs redisposés), pour les
  // projets secondaires de la liste.
  if (variant === "list") {
    return (
      <button
        onClick={onViewDetails}
        data-reveal
        className="group relative flex items-center gap-4 sm:gap-7 w-full py-5 sm:py-6 border-b text-left transition-colors hover:border-primary"
        style={{ borderColor: "var(--color-border)" }}
      >
        <span className="shrink-0 font-mono text-[11px] text-text-muted tabular-nums">
          {String((index ?? 0) + 1).padStart(2, "0")}
        </span>
        <span className="shrink-0 text-primary">
          {type === "professional" ? <Briefcase className="w-3.5 h-3.5" /> : <Heart className="w-3.5 h-3.5" />}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-3 flex-wrap">
            <h3 className="font-heading font-semibold text-[1.3rem] sm:text-[1.5rem] leading-none tracking-[-.02em] truncate">
              {title}
            </h3>
            <span className="font-mono text-[10px] tracking-[.14em] uppercase text-text-muted hidden sm:inline shrink-0">
              {category} · {year}
            </span>
          </div>
          <p className="mt-1.5 text-sm text-text-secondary truncate">{description}</p>
        </div>
        <div className="hidden lg:flex shrink-0 max-w-[200px] flex-wrap justify-end gap-2">
          <Tags tags={tags.slice(0, 2)} />
        </div>
        <ArrowIcon color="var(--color-primary)" />
      </button>
    );
  }

  if (variant === "hero") {
    return (
      <button
        onClick={onViewDetails}
        data-reveal
        className="blueprint group relative grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] lg:items-start gap-0 text-left w-full border border-border hover:border-primary transition-colors"
      >
        <Corner />
        {/* lg:items-start (au lieu du stretch par défaut d'une grid row) :
            la colonne texte garde sa hauteur naturelle au lieu d'être étirée
            à la hauteur de l'image, ce qui créait un grand vide entre la
            description et les tags pour les descriptions courtes. */}
        <div className="p-8 sm:p-11 sm:pb-10 flex flex-col">
          <Meta category={category} year={year} type={type} />
          <h3 className="font-heading font-semibold leading-[.96] tracking-[-.025em] text-[clamp(1.9rem,4.4vw,3.6rem)] mb-4">
            {title}
          </h3>
          <p className="text-[15.5px] leading-relaxed text-text-secondary max-w-[42ch] mb-6">{description}</p>
          <div className="mb-6"><Tags tags={tags} /></div>
          <div className="flex items-center gap-2.5 font-mono text-[11px] tracking-[.16em] uppercase text-primary">
            <span>Details</span>
            <ArrowIcon />
          </div>
        </div>
        <Visual image={image} title={title} className="border-t lg:border-t-0 lg:border-l min-h-[280px] lg:min-h-[440px] lg:self-stretch" />
      </button>
    );
  }

  return (
    <button
      onClick={onViewDetails}
      data-reveal
      className="blueprint group relative flex flex-col text-left w-full h-full border border-border hover:border-primary transition-colors"
    >
      <Corner />
      <Visual image={image} title={title} className="h-[220px] border-b" />
      <div className="p-7 flex flex-col flex-1">
        <Meta category={category} year={year} type={type} />
        <h3 className="font-heading font-semibold text-[1.9rem] leading-none tracking-[-.02em] mb-3">{title}</h3>
        <p className="text-sm leading-relaxed text-text-secondary mb-5 flex-1">{description}</p>
        <div className="flex items-center justify-between gap-4">
          <Tags tags={tags} />
          <ArrowIcon color="var(--color-primary)" />
        </div>
      </div>
    </button>
  );
};

export default ProjectCard;
