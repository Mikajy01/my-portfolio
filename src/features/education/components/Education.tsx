import React from 'react';
import { GraduationCap } from 'lucide-react';
import { TimelineItem, type TimelineItemData } from '../../../shared/components/TimelineItem';

// ============================================
// DONNÉES - PERSONNALISEZ AVEC VOS INFOS
// ============================================

const educationData: TimelineItemData[] = [
  {
    id: '1',
    title: 'Master en Informatique',
    organization: 'Université de...',
    location: 'Antananarivo, Madagascar',
    period: '2020 - 2022',
    description: 'Spécialisation en développement web et génie logiciel',
    highlights: [
      'Mention Très Bien',
      'Projet de fin d\'études sur...',
      'Stage de 6 mois chez...'
    ],
    skills: ['React', 'Node.js', 'Architecture logicielle']
  },
  {
    id: '2',
    title: 'Licence en Informatique',
    organization: 'Université de...',
    location: 'Antananarivo, Madagascar',
    period: '2017 - 2020',
    description: 'Formation générale en informatique et programmation',
    highlights: [
      'Major de promotion',
      'Participation à des hackathons'
    ],
    skills: ['Java', 'Python', 'Base de données']
  }
];

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export const Education: React.FC = () => {
  return (
    <section id="education" className="py-20 px-4 relative">
      {/* Effet de lumière d'arrière-plan */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary opacity-10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary opacity-10 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* En-tête de section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <GraduationCap className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
            Formation
          </h2>
          <div className="w-24 h-1 bg-gradient-primary rounded-full mx-auto" />
        </div>
        
        {/* Timeline */}
        <div className="relative">
          {educationData.map((item, index) => (
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