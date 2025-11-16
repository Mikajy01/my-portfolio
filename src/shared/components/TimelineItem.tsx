import React, { useEffect, useRef } from 'react';
import { Calendar, MapPin, Award } from 'lucide-react';

// ============================================
// TYPES
// ============================================

export interface TimelineItemData {
  id: string;
  title: string;
  organization: string;
  location: string;
  period: string;
  description: string;
  highlights?: string[];
  skills?: string[];
}

interface TimelineItemProps {
  item: TimelineItemData;
  isLeft: boolean;
}

// ============================================
// COMPOSANT TIMELINE ITEM AVEC REVEAL ON SCROLL
// ============================================

export const TimelineItem: React.FC<TimelineItemProps> = ({ item, isLeft }) => {
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-slide-up');
            entry.target.classList.remove('opacity-0');
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '-50px 0px -50px 0px'
      }
    );

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => {
      if (itemRef.current) {
        observer.unobserve(itemRef.current);
      }
      observer.disconnect();
    };
  }, []);

  return (
    <div 
      ref={itemRef}
      className={`opacity-0 transition-all duration-700 flex gap-8 mb-12 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
    >
      {/* Espace vide pour l'alternance */}
      <div className="hidden md:block md:w-1/2" />
      
      {/* Ligne et point de la timeline */}
      <div className="relative flex flex-col items-center">
        <div className="w-4 h-4 rounded-full bg-primary border-4 border-surface-elevated z-10 shadow-lg" />
        <div className="w-0.5 h-full bg-border absolute top-4" />
      </div>
      
      {/* Contenu de la carte */}
      <div className="w-full md:w-1/2 group">
        <div className="card-elevated rounded-2xl p-6 hover:border-primary transition-all duration-300">
          {/* En-tête */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">
              {item.title}
            </h3>
            <div className="text-primary font-semibold mb-2">
              {item.organization}
            </div>
            
            {/* Métadonnées */}
            <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{item.period}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{item.location}</span>
              </div>
            </div>
          </div>
          
          {/* Description */}
          <p className="text-text-secondary mb-4 leading-relaxed">
            {item.description}
          </p>
          
          {/* Points clés */}
          {item.highlights && item.highlights.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-text-primary">
                <Award className="w-4 h-4 text-primary" />
                <span>Points clés</span>
              </div>
              <ul className="space-y-1 text-sm text-text-secondary">
                {item.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Compétences */}
          {item.skills && item.skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {item.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-xs font-medium rounded-lg bg-surface text-primary border border-border hover:bg-primary hover:text-white transition-colors duration-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};