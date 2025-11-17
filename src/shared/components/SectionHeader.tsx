import React, { useRef, useEffect, useState } from 'react';

interface SectionHeaderProps {
  title: string;
  icon: React.ElementType;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ icon: Icon, title }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Déclenche l'animation quand l'élément entre dans la vue
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      {
        threshold: 1, // Déclenche quand 30% de l'élément est visible
        rootMargin: '30px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [isVisible]);

  return (
    <div ref={sectionRef} className="text-center mb-16">
      {/* Icône avec animation de rebond */}
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
        <div className={isVisible ? 'animate-bounce-scale' : 'opacity-0'}>
          <Icon className="w-8 h-8 text-primary" />
        </div>
      </div>

      {/* Titre */}
      <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
        {title}
      </h2>

      {/* Ligne SVG animée */}
      <div className="w-48 h-6 mx-auto">
        <svg 
          viewBox="0 0 200 20" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <path
            d="M10 10 C50 5 150 15 190 10"
            stroke="url(#gradient)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            className={isVisible ? 'animate-draw' : ''}
            style={{ 
              strokeDasharray: 200,
              strokeDashoffset: isVisible ? 0 : 200
            }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};