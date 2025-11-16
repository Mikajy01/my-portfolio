import { useEffect, useRef } from 'react';

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Ajoute la classe quand visible, la retire quand invisible
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
      id="about" 
      ref={sectionRef}
      className="py-16 md:py-24 px-4 md:px-8 relative overflow-hidden"
    >
      {/* Effet de lumière d'arrière-plan */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary opacity-10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary opacity-10 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="observe-animation opacity-0 transition-all duration-700 mb-12 md:mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">À Propos</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-primary mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Colonne texte */}
          <div className="observe-animation opacity-0 transition-all duration-700 delay-200 space-y-6">
            <div className="glass-effect p-6 md:p-8 rounded-2xl border-gradient">
              <h3 className="text-xl md:text-2xl font-bold mb-4 text-gradient-accent">
                Développeur Full Stack Passionné
              </h3>
              <p className="text-text-secondary leading-relaxed mb-4">
                Je suis <span className="text-primary font-semibold">RATSIMBAZAFY Mikajisoa Selly-Rafaj</span>, 
                un développeur full stack passionné par la création d'applications web modernes et performantes.
              </p>
              <p className="text-text-secondary leading-relaxed mb-4">
                Avec une expertise solide en développement front-end et back-end, je transforme des idées 
                innovantes en solutions digitales élégantes et fonctionnelles.
              </p>
              <p className="text-text-secondary leading-relaxed">
                Mon approche combine créativité, rigueur technique et souci du détail pour livrer 
                des produits qui dépassent les attentes.
              </p>
            </div>
          </div>

          {/* Colonne statistiques/highlights */}
          <div className="observe-animation opacity-0 transition-all duration-700 delay-400 space-y-4">
            <div className="glass-effect p-6 rounded-2xl hover:glow-effect transition-all duration-300 cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center text-2xl font-bold group-hover:scale-110 transition-transform">
                  💻
                </div>
                <div>
                  <h4 className="text-lg font-bold text-primary">Code Propre</h4>
                  <p className="text-text-muted text-sm">Architecture scalable et maintenable</p>
                </div>
              </div>
            </div>

            <div className="glass-effect p-6 rounded-2xl hover:glow-effect transition-all duration-300 cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center text-2xl font-bold group-hover:scale-110 transition-transform">
                  🚀
                </div>
                <div>
                  <h4 className="text-lg font-bold text-primary">Performance</h4>
                  <p className="text-text-muted text-sm">Applications rapides et optimisées</p>
                </div>
              </div>
            </div>

            <div className="glass-effect p-6 rounded-2xl hover:glow-effect transition-all duration-300 cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center text-2xl font-bold group-hover:scale-110 transition-transform">
                  🎨
                </div>
                <div>
                  <h4 className="text-lg font-bold text-primary">Design Moderne</h4>
                  <p className="text-text-muted text-sm">Interfaces élégantes et intuitives</p>
                </div>
              </div>
            </div>

            <div className="glass-effect p-6 rounded-2xl hover:glow-effect transition-all duration-300 cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center text-2xl font-bold group-hover:scale-110 transition-transform">
                  ⚡
                </div>
                <div>
                  <h4 className="text-lg font-bold text-primary">Innovation</h4>
                  <p className="text-text-muted text-sm">Technologies de pointe</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;