import { useState } from "react";
import { type Project } from "./Projects";

// On étend l'interface Project pour inclure les props spécifiques au composant
interface ProjectCardProps extends Project {
  onViewDetails: () => void;
  index: number;
}

export const ProjectCard = ({
  title,
  description,
  tags,
  image,
  category,
  onViewDetails,
}: ProjectCardProps) => {
  const [imageError, setImageError] = useState(false);

  // --- LOGIQUE DES TAGS ---
  // On n'affiche que les 3 premiers tags pour garder la carte propre
  const MAX_TAGS = 3;
  const displayedTags = tags.slice(0, MAX_TAGS);
  const remainingTags = tags.length - MAX_TAGS;

  // --- LOGIQUE DE STYLE SELON CATEGORIE ---
  const isPro = category === "professional";
  const badgeStyle = isPro
    ? "bg-blue-500/10 text-blue-600 border-blue-200 dark:text-blue-300 dark:border-blue-500/30"
    : "bg-purple-500/10 text-purple-600 border-purple-200 dark:text-purple-300 dark:border-purple-500/30";

  return (
    <div
      onClick={onViewDetails}
      className="
        group relative flex flex-col h-full rounded-2xl overflow-hidden cursor-pointer
        bg-color-surface border border-color-border/50
        hover:border-color-primary/50 hover:-translate-y-2 hover:shadow-glow-lg
        transition-all duration-500 ease-out
      "
    >
      {/* --- EFFET DE FOND (GLOW) --- */}
      <div className="absolute inset-0 bg-gradient-to-br from-color-primary/5 via-transparent to-color-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* --- IMAGE HEADER --- */}
      <div className="relative h-48 overflow-hidden">
        {/* Overlay sombre qui s'éclaircit au survol */}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10" />

        {/* Badge Catégorie */}
        <div className="absolute top-3 right-3 z-20">
          <span
            className={`
              px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full 
              backdrop-blur-md border shadow-sm ${badgeStyle}
            `}
          >
            {isPro ? "Pro" : "Perso"}
          </span>
        </div>

        {!imageError ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-color-surface-elevated text-4xl">
            🖼️
          </div>
        )}
      </div>

      {/* --- CONTENU --- */}
      <div className="relative z-10 p-6 flex flex-col flex-1 bg-color-surface/30 backdrop-blur-[2px]">
        {/* Titre avec effet de couleur au survol */}
        <h3 className="text-xl font-bold mb-2 text-color-text-primary group-hover:text-gradient transition-all duration-300">
          {title}
        </h3>

        {/* Description tronquée proprement */}
        <p className="text-color-text-secondary text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
          {description}
        </p>

        {/* Footer avec Tags */}
        <div className="mt-auto pt-4 border-t border-color-border/40 flex flex-wrap items-center gap-2">
          {displayedTags.map((tag, idx) => (
            <span
              key={idx}
              className="
                px-2.5 py-1 text-[10px] font-medium rounded-md 
                bg-color-background border border-color-border 
                text-color-text-muted group-hover:border-color-primary/30 transition-colors
              "
            >
              {tag}
            </span>
          ))}

          {/* Indicateur "+ X more" */}
          {remainingTags > 0 && (
            <span className="px-2 py-1 text-[10px] font-bold rounded-md bg-color-primary/10 text-color-primary border border-color-primary/20">
              +{remainingTags}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};