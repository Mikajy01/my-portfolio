import React from 'react';
import { Briefcase } from 'lucide-react';
import { TimelineItem, type TimelineItemData } from '../../../shared/components/TimelineItem';

// ============================================
// DONNÉES - PERSONNALISEZ AVEC VOS INFOS
// ============================================

const experienceData: TimelineItemData[] = [
  {
    id: '1',
    title: 'Développeur Full Stack',
    organization: 'Entreprise XYZ',
    location: 'Antananarivo, Madagascar',
    period: '2022 - Présent',
    description: 'Développement d\'applications web et mobiles pour des clients internationaux',
    highlights: [
      'Développement de 5+ applications complètes',
      'Optimisation des performances (40% d\'amélioration)',
      'Mentorat de 3 développeurs juniors'
    ],
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL']
  },
  {
    id: '2',
    title: 'Développeur Frontend',
    organization: 'Startup ABC',
    location: 'Remote',
    period: '2021 - 2022',
    description: 'Création d\'interfaces utilisateur modernes et responsive',
    highlights: [
      'Refonte complète de l\'interface utilisateur',
      'Implémentation du design system',
      'Amélioration de l\'accessibilité (WCAG AA)'
    ],
    skills: ['React', 'Tailwind CSS', 'Figma']
  }
];

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export const Experience: React.FC = () => {
  return (
    <section id="experience" className="py-20 px-4 relative bg-surface/50">
        {/* Effet de grille animée */}
      <div className="absolute inset-0 opacity-7">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at center, var(--color-primary) 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
        }} />
      </div>
      {/* Effet de lumière d'arrière-plan */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent opacity-10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary opacity-10 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* En-tête de section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Briefcase className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
            Expérience Professionnelle
          </h2>
          <div className="w-24 h-1 bg-gradient-primary rounded-full mx-auto" />
        </div>
        
        {/* Timeline */}
        <div className="relative">
          {experienceData.map((item, index) => (
            <TimelineItem
              key={item.id}
              item={item}
              isLeft={index % 2 === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
};