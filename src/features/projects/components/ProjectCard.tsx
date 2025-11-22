import { useState } from 'react';

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  image: string;
  link?: string;
  github?: string;
  onViewDetails?: () => void;
}

export const ProjectCard = ({ 
  title, 
  description, 
  tags, 
  image, 
  link, 
  github,
  onViewDetails 
}: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div 
      className="glass-effect rounded-2xl overflow-hidden group hover:glow-effect transition-all duration-300 h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image du projet */}
      <div className="relative h-48 md:h-56 overflow-hidden bg-surface-elevated">
        <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
        
        {!imageError ? (
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            🖼️
          </div>
        )}
        
        {/* Overlay avec liens */}
        <div className={`absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center gap-4 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          {link && (
            <a 
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-12 h-12 rounded-full bg-primary flex items-center justify-center hover:scale-110 transition-transform"
              title="Voir le site"
            >
              <span className="text-xl">🔗</span>
            </a>
          )}
          {github && (
            <a 
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center hover:scale-110 transition-transform"
              title="Code source"
            >
              <span className="text-xl">💻</span>
            </a>
          )}
          {onViewDetails && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails();
              }}
              className="w-12 h-12 rounded-full bg-accent flex items-center justify-center hover:scale-110 transition-transform"
              title="Voir les détails"
            >
              <span className="text-xl">👁️</span>
            </button>
          )}
        </div>
      </div>

      {/* Contenu */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold mb-2 text-gradient-accent group-hover:scale-105 transition-transform inline-block">
          {title}
        </h3>
        <p className="text-text-secondary mb-4 leading-relaxed flex-1">
          {description}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, idx) => (
            <span 
              key={idx}
              className="px-3 py-1 text-xs font-medium rounded-full bg-surface-elevated text-primary border border-primary border-opacity-30"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Bouton "Voir détails" */}
        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="w-full py-2 rounded-lg bg-gradient-primary text-white font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Voir les détails
          </button>
        )}
      </div>
    </div>
  );
};