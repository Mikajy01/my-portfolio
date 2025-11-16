import { useEffect, useRef } from 'react';

interface Skill {
  name: string;
  icon: string;
  category: 'frontend' | 'backend' | 'database';
  level: number;
}

const skills: Skill[] = [
  { name: 'Angular', icon: '🅰️', category: 'frontend', level: 90 },
  { name: 'React.js', icon: '⚛️', category: 'frontend', level: 95 },
  { name: 'NestJS', icon: '🦅', category: 'backend', level: 88 },
  { name: 'Express.js', icon: '🚂', category: 'backend', level: 92 },
  { name: 'MySQL', icon: '🐬', category: 'database', level: 85 },
  { name: 'PostgreSQL', icon: '🐘', category: 'database', level: 87 },
  { name: 'SQL Server', icon: '💾', category: 'database', level: 82 },
];

const Skills = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-slide-up');
            entry.target.classList.remove('opacity-0');
            
            // Animer les barres de progression
            const bars = entry.target.querySelectorAll('.skill-bar-fill');
            bars.forEach((bar) => {
              const level = bar.getAttribute('data-level');
              if (level) {
                (bar as HTMLElement).style.width = level + '%';
              }
            });
          } else {
            // Optionnel: réinitialiser quand l'élément quitte la vue
            // entry.target.classList.remove('animate-slide-up');
            // entry.target.classList.add('opacity-0');
            // const bars = entry.target.querySelectorAll('.skill-bar-fill');
            // bars.forEach((bar) => {
            //   (bar as HTMLElement).style.width = '0%';
            // });
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

  const categories = {
    frontend: skills.filter(s => s.category === 'frontend'),
    backend: skills.filter(s => s.category === 'backend'),
    database: skills.filter(s => s.category === 'database'),
  };

  return (
    <section 
      id="skills" 
      ref={sectionRef}
      className="py-16 md:py-24 px-4 md:px-8 relative overflow-hidden bg-surface"
    >
      {/* Effet de grille animée */}
      <div className="absolute inset-0 opacity-7">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at center, var(--color-primary) 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
        }} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="observe-animation opacity-0 transition-all duration-700 mb-12 md:mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Compétences</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Technologies et frameworks que je maîtrise pour créer des solutions complètes
          </p>
          <div className="w-20 h-1 bg-gradient-primary mx-auto rounded-full mt-6" />
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {/* Frontend */}
          <div className="observe-animation opacity-0 transition-all duration-700">
            <div className="glass-effect p-6 md:p-8 rounded-2xl h-full border-l-4 border-primary hover:glow-effect transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center text-2xl">
                  🎨
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-primary">Frontend</h3>
              </div>
              <div className="space-y-4">
                {categories.frontend.map((skill, idx) => (
                  <div key={idx} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="flex items-center gap-2 text-text-primary font-medium">
                        <span className="text-xl">{skill.icon}</span>
                        {skill.name}
                      </span>
                      <span className="text-primary font-bold">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-surface-elevated rounded-full overflow-hidden">
                      <div 
                        className="skill-bar-fill h-full bg-gradient-primary rounded-full transition-all duration-1000 ease-out"
                        data-level={skill.level}
                        style={{ width: '0%' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Backend */}
          <div className="observe-animation opacity-0 transition-all duration-700 delay-200">
            <div className="glass-effect p-6 md:p-8 rounded-2xl h-full border-l-4 border-secondary hover:glow-effect transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center text-2xl">
                  ⚙️
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-secondary">Backend</h3>
              </div>
              <div className="space-y-4">
                {categories.backend.map((skill, idx) => (
                  <div key={idx} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="flex items-center gap-2 text-text-primary font-medium">
                        <span className="text-xl">{skill.icon}</span>
                        {skill.name}
                      </span>
                      <span className="text-secondary font-bold">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-surface-elevated rounded-full overflow-hidden">
                      <div 
                        className="skill-bar-fill h-full rounded-full transition-all duration-1000 ease-out"
                        data-level={skill.level}
                        style={{ 
                          width: '0%',
                          background: 'linear-gradient(135deg, var(--color-secondary), var(--color-accent))'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Database */}
          <div className="observe-animation opacity-0 transition-all duration-700 delay-400">
            <div className="glass-effect p-6 md:p-8 rounded-2xl h-full border-l-4 border-accent hover:glow-effect transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center text-2xl">
                  💾
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-accent">Database</h3>
              </div>
              <div className="space-y-4">
                {categories.database.map((skill, idx) => (
                  <div key={idx} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="flex items-center gap-2 text-text-primary font-medium">
                        <span className="text-xl">{skill.icon}</span>
                        {skill.name}
                      </span>
                      <span className="text-accent font-bold">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-surface-elevated rounded-full overflow-hidden">
                      <div 
                        className="skill-bar-fill h-full rounded-full transition-all duration-1000 ease-out"
                        data-level={skill.level}
                        style={{ 
                          width: '0%',
                          background: 'linear-gradient(135deg, var(--color-accent), var(--color-primary))'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;