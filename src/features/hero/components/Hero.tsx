import React, { useEffect, useState, useRef } from 'react';
import { ProfileImage } from './ProfileImage';
import { Button } from '../../../shared/components/Button';

export const Hero: React.FC = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const titles = ['Développeur Full Stack', 'Expert React & Angular', 'Architecte Backend'];

  useEffect(() => {
    startRainEffect();
  }, [currentWordIndex]);

  const startRainEffect = () => {
    if (!containerRef.current) return;
    
    setIsAnimating(true);
    const container = containerRef.current;
    const currentWord = titles[currentWordIndex];
    
    // Réinitialiser le conteneur
    container.innerHTML = '';
    

    // Créer les spans pour chaque lettre
    Array.from(currentWord).forEach((char, index) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.opacity = '0';
      container.appendChild(span);
    });

    setTimeout(() => {
      const spans = container.querySelectorAll('span');
      const containerRect = container.getBoundingClientRect();
      const centerX = containerRect.left + containerRect.width / 2;

      spans.forEach((span, index) => {
        const spanRect = span.getBoundingClientRect();
        const x = spanRect.left;
        const randomX = (centerX - x) + ((centerX < x ? -1 : 1) * Math.random() * 32.5);
        
        setTimeout(() => {
          span.setAttribute('style', `
            --x: ${randomX}px;
            --xo: ${centerX - x}px;
            --rot: rotate(${centerX < x ? '-' : ''}${Math.random() * 300}deg);
            animation: letterDrop 2s linear forwards;
            opacity: 1;
          `);
          span.classList.add('drop');
        }, Math.random() * 1000);
      });

      // Après l'animation de chute, préparer le prochain mot
      setTimeout(() => {
        // Effacer les lettres
        spans.forEach((span, index) => {
          setTimeout(() => {
            span.style.opacity = '0';
          }, index * 60);
        });

        // Passer au mot suivant
        setTimeout(() => {
          setIsAnimating(false);
          setCurrentWordIndex((prev) => (prev + 1) % titles.length);
        }, 0);
      }, 4000);
    }, 0);
  };

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToProjects = () => {
    const element = document.getElementById('projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 px-4 sm:px-6 lg:px-8">
      {/* Styles inline pour l'animation - conservés car spécifiques à l'animation dynamique */}
      <style>{`
        @keyframes letterDrop {
          0% {
            transform: translate(var(--xo), -350px) scaleY(0) rotate(0deg);
          }
          20% {
            transform: translate(var(--xo), -220px) scaleY(0.5) rotate(0deg);
          }
          80% {
            transform: translate(var(--x), 0) scaleY(1) var(--rot);
          }
          100% {
            transform: translate(0, 0) scaleY(1) rotate(0deg);
          }
        }

        .letter-container span {
          opacity: 0;
          font-size: 1.5em;
          transition: transform 0.5s ease-out, opacity 0.5s;
          text-shadow: 1px 0 var(--color-primary);
          color: var(--color-primary);
          pointer-events: none;
          display: inline-block;
        }

        .letter-container span.drop {
          opacity: 1;
        }

        .rain-tube {
          width: 2rem;
          height: 2.4em;
          left: calc(50% - 1rem);
          background-color: var(--color-primary);
          position: absolute;
          top: -3em;
          transition: all 1s ease;
          z-index: 10;
        }

        .rain-tube::before {
          content: '';
          position: absolute;
          width: 4rem;
          height: 2rem;
          top: calc(3em - 1.2em - 0.4em);
          left: 50%;
          transform: translateX(-50%);
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0, 240, 255, 0.6) 0%, rgba(0, 240, 255, 0) 70%);
          opacity: 0;
          transition: opacity 0.5s ease;
          pointer-events: none;
          z-index: 1;
        }

        .rain-tube.active::before {
          opacity: 1;
        }

        .rain-tube::after {
          content: '';
          width: 3rem;
          height: 1.2em;
          background-color: var(--color-surface);
          position: absolute;
          top: calc(3em - 1.2em);
          left: 50%;
          transform: translateX(-50%);
          border-radius: 4px;
        }

        .rain-tube.active {
          top: 0;
        }
      `}</style>

      {/* Fond animé - refactorisé avec Tailwind */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-primary rounded-full mix-blend-multiply blur-3xl opacity-10 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-secondary rounded-full mix-blend-multiply blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Contenu texte - refactorisé avec Tailwind */}
          <div className="text-center lg:text-left space-y-6 order-2 lg:order-1">
            <div className="space-y-2">
              <p className="text-text-secondary text-sm sm:text-base font-medium tracking-wide uppercase">
                Bienvenue sur mon portfolio
              </p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="block text-text-primary">Je suis</span>
                <span className="block text-gradient mt-2">
                  Mikajisoa Selly-Rafaj
                </span>
              </h1>
            </div>

            {/* Titre animé avec effet de pluie */}
            <div className="h-12 sm:h-16 flex items-center justify-center lg:justify-start relative">
              <div 
                ref={containerRef}
                className="letter-container flex justify-center lg:justify-start items-center min-h-[3rem]"
              />
            </div>

            <p className="text-text-secondary text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Passionné par le développement d'applications web modernes et performantes. 
              Je transforme vos idées en solutions digitales innovantes avec Angular, React, 
              NestJS et bien plus encore.
            </p>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Button
                variant="primary"
                size="lg"
                onClick={scrollToContact}
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
              >
                Me contacter
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={scrollToProjects}
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                }
              >
                Voir mes projets
              </Button>
            </div>

            {/* Stats rapides - refactorisé avec Tailwind */}
            <div className="grid grid-cols-3 gap-4 pt-8 max-w-md mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-bold text-gradient">5+</div>
                <div className="text-xs sm:text-sm text-text-secondary mt-1">Années d'expérience</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-bold text-gradient">50+</div>
                <div className="text-xs sm:text-sm text-text-secondary mt-1">Projets réalisés</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-bold text-gradient">30+</div>
                <div className="text-xs sm:text-sm text-text-secondary mt-1">Clients satisfaits</div>
              </div>
            </div>
          </div>

          {/* Image de profil */}
          <div className="order-1 lg:order-2">
            <ProfileImage />
          </div>
        </div>
      </div>

      {/* Indicateur de scroll - refactorisé avec Tailwind */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};