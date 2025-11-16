import { useEffect, useRef } from 'react';
import { ProjectCard } from './ProjectCard';

interface Project {
  title: string;
  description: string;
  tags: string[];
  image: string;
  link?: string;
  github?: string;
}

const projects: Project[] = [
  {
    title: 'E-Commerce Platform',
    description: 'Plateforme e-commerce complète avec gestion de stock, paiement en ligne et tableau de bord administrateur.',
    tags: ['React', 'NestJS', 'PostgreSQL', 'Stripe'],
    image: '🛒',
    link: '#',
    github: '#'
  },
  {
    title: 'Task Management App',
    description: 'Application de gestion de tâches collaborative avec système de notifications en temps réel.',
    tags: ['Angular', 'Express.js', 'MySQL', 'Socket.io'],
    image: '📋',
    link: '#',
    github: '#'
  },
  {
    title: 'Analytics Dashboard',
    description: 'Tableau de bord analytique avec visualisations interactives et exports personnalisables.',
    tags: ['React', 'NestJS', 'SQL Server', 'Chart.js'],
    image: '📊',
    link: '#',
    github: '#'
  },
  {
    title: 'Social Media App',
    description: 'Réseau social avec fil d\'actualité, messagerie instantanée et partage de médias.',
    tags: ['React', 'Express.js', 'PostgreSQL', 'Redis'],
    image: '💬',
    link: '#',
    github: '#'
  },
  {
    title: 'Booking System',
    description: 'Système de réservation en ligne avec calendrier dynamique et gestion des disponibilités.',
    tags: ['Angular', 'NestJS', 'MySQL', 'Stripe'],
    image: '📅',
    link: '#',
    github: '#'
  },
  {
    title: 'Portfolio CMS',
    description: 'CMS personnalisé pour la création et gestion de portfolios créatifs avec éditeur visuel.',
    tags: ['React', 'Express.js', 'PostgreSQL', 'AWS'],
    image: '🎨',
    link: '#',
    github: '#'
  }
];

const Projects = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-slide-up');
            entry.target.classList.remove('opacity-0');
          } else {
            // Optionnel: réinitialiser quand l'élément quitte la vue
            // entry.target.classList.remove('animate-slide-up');
            // entry.target.classList.add('opacity-0');
          }
        });
      },
      { 
        threshold: 0.3,
        rootMargin: '-50px 0px -50px 0px' // Déclenche un peu avant d'entrer dans la vue
      }
    );

    const elements = sectionRef.current?.querySelectorAll('.observe-animation');
    elements?.forEach((el) => observer.observe(el));

    return () => {
      elements?.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, []);

  return (
    <section 
      id="projects" 
      ref={sectionRef}
      className="py-16 md:py-24 px-4 md:px-8 relative overflow-hidden"
    >
      {/* Effet de lumière */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent opacity-10 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="observe-animation opacity-0 transition-all duration-700 mb-12 md:mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Projets</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Une sélection de mes réalisations les plus significatives
          </p>
          <div className="w-20 h-1 bg-gradient-primary mx-auto rounded-full mt-6" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projects.map((project, idx) => (
            <div 
              key={idx}
              className={`observe-animation opacity-0 transition-all duration-700 delay-${idx * 100}`}
            >
              <ProjectCard {...project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;