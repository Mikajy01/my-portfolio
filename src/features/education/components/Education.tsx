import React from 'react';
import { GraduationCap } from 'lucide-react';
import { TimelineItem, type TimelineItemData } from '../../../shared/components/TimelineItem';
import { SectionHeader } from '../../../shared/components/SectionHeader';

// ============================================
// DONNÉES - PERSONNALISEZ AVEC VOS INFOS
// ============================================

const educationData: TimelineItemData[] = [
  {
    id: '1',
    title: 'Master en Informatique',
    organization: 'EMIT Fianarantsoa',
    location: 'Antananarivo, Madagascar',
    period: '2024 - 2025',
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
    organization: 'EMIT Fianarantsoa',
    location: 'Antananarivo, Madagascar',
    period: '2021 - 2024',
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
        <SectionHeader icon={GraduationCap} title="Formation" />
        
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