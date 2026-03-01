import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ProfileImage } from "./ProfileImage";
import { Button } from "../../../shared/components/Button";

export const Hero: React.FC = () => {
  const { t } = useTranslation();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [_isAnimating, _setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<HTMLSpanElement[]>([]);

  const titles = t("hero.titles", { returnObjects: true }) as string[];

  useEffect(() => {
    startRainEffect();
  }, [currentWordIndex]);

  const startRainEffect = () => {
    if (!containerRef.current) return;

    _setIsAnimating(true);
    const container = containerRef.current;
    const currentWord = titles[currentWordIndex];

    // Réinitialiser le conteneur et le tableau de références
    container.innerHTML = "";
    lettersRef.current = [];

    // Créer les spans pour chaque lettre
    Array.from(currentWord).forEach((char) => {
      const span = document.createElement("span");
      span.textContent = char === " " ? "\u00A0" : char;
      span.style.opacity = "0";
      span.style.display = "inline-block";
      span.style.position = "relative";
      container.appendChild(span);
      lettersRef.current.push(span);
    });

    // Attendre que le DOM soit mis à jour avant de calculer les positions
    setTimeout(() => {
      const containerRect = container.getBoundingClientRect();
      const centerX = containerRect.left + containerRect.width / 2;

      lettersRef.current.forEach((span) => {
        const spanRect = span.getBoundingClientRect();
        const x = spanRect.left;
        const randomX =
          centerX - x + (centerX < x ? -1 : 1) * Math.random() * 32.5;

        setTimeout(() => {
          span.setAttribute(
            "style",
            `
            --x: ${randomX}px;
            --xo: ${centerX - x}px;
            --rot: rotate(${centerX < x ? "-" : ""}${Math.random() * 300}deg);
            animation: letterDrop 2s linear forwards;
            opacity: 1;
            display: inline-block;
            position: relative;
          `
          );
          span.classList.add("drop");
        }, Math.random() * 1000);
      });

      // Après l'animation de chute, aspirer les lettres
      setTimeout(() => {
        suckLettersToLeft();
      }, 5000); // Temps d'affichage avant l'aspiration
    }, 100);
  };

  const suckLettersToLeft = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Créer la lumière aspiratrice
    const light = document.createElement("div");
    light.className = "suction-light";
    container.appendChild(light);

    // Animer chaque lettre vers la gauche
    lettersRef.current.forEach((span, index) => {
      setTimeout(() => {
        span.style.animation = "suckToLeft 1.2s ease-in forwards";
        span.classList.add("sucked");
      }, index * 50); // Délai progressif pour un effet de vague
    });

    // Passer au mot suivant après toutes les aspirations
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      _setIsAnimating(false);
      setCurrentWordIndex((prev) => (prev + 1) % titles.length);
    }, 1500);
  };

  const downloadCV = () => {
    const link = document.createElement("a");
    link.href = "/cv.pdf";
    link.download = "Mikajisoa-Selly-Rafaj-CV.pdf";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const scrollToProjects = () => {
    const element = document.getElementById("projects");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 px-4 sm:px-6 lg:px-8"
    >
      {/* Styles inline pour l'animation */}
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

        @keyframes suckToLeft {
          0% {
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 1;
            filter: brightness(1);
          }
          30% {
            transform: translate(-100px, 0) scale(0.9) rotate(-15deg);
            opacity: 0.9;
            filter: brightness(1.5);
          }
          60% {
            transform: translate(-300px, 0) scale(0.6) rotate(-45deg);
            opacity: 0.6;
            filter: brightness(2);
          }
          100% {
            transform: translate(-800px, 0) scale(0.1) rotate(-90deg);
            opacity: 0;
            filter: brightness(3);
          }
        }

        @keyframes suctionLightPulse {
          0%, 100% {
            opacity: 0.3;
            transform: translateX(0) scale(1);
          }
          50% {
            opacity: 0.6;
            transform: translateX(-20px) scale(1.2);
          }
        }

        .letter-container {
          position: relative;
          min-height: 3rem;
          display: inline-block;
        }

        .letter-container span:not(.suction-light) {
          opacity: 0;
          font-size: 1.5em;
          transition: transform 0.5s ease-out, opacity 0.3s ease-out;
          text-shadow: 1px 0 var(--color-primary);
          color: var(--color-primary);
          pointer-events: none;
          display: inline-block;
          position: relative;
        }

        .letter-container span.drop {
          opacity: 1;
        }

        .letter-container span.sucked {
          text-shadow: 0 0 10px var(--color-primary), 
                       0 0 20px var(--color-primary),
                       0 0 30px var(--color-primary);
        }

        .suction-light {
          position: absolute;
          left: -100px;
          top: 50%;
          transform: translateY(-50%);
          width: 150px;
          height: 150px;
          background: radial-gradient(
            circle,
            rgba(var(--color-primary-rgb, 99, 102, 241), 0.6) 0%,
            rgba(var(--color-primary-rgb, 99, 102, 241), 0.3) 30%,
            transparent 70%
          );
          border-radius: 50%;
          pointer-events: none;
          animation: suctionLightPulse 1.5s ease-in-out infinite;
          filter: blur(20px);
          z-index: 100;
        }

        .suction-light::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 100%;
          width: 400px;
          height: 80px;
          transform: translateY(-50%);
          background: linear-gradient(
            to right,
            rgba(var(--color-primary-rgb, 99, 102, 241), 0.4),
            rgba(var(--color-primary-rgb, 99, 102, 241), 0.2) 50%,
            transparent
          );
          filter: blur(15px);
          animation: suctionBeam 1.5s ease-in-out infinite;
        }

        @keyframes suctionBeam {
          0%, 100% {
            opacity: 0.5;
            width: 400px;
          }
          50% {
            opacity: 0.8;
            width: 450px;
          }
        }

        /* Assurer que le conteneur a une taille minimale même quand vide */
        .title-container {
          min-width: 300px;
          min-height: 60px;
          display: flex;
        }

        /* Variables CSS pour la couleur primaire (à adapter selon votre thème) */
        :root {
          --color-primary-rgb: 99, 102, 241;
        }
      `}</style>

      {/* Fond animé */}
      {/* <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-primary rounded-full mix-blend-multiply blur-3xl opacity-10 animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-secondary rounded-full mix-blend-multiply blur-3xl opacity-10 animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div> */}

      <div className="container mx-auto py-3">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Contenu texte */}
          <div className="text-center lg:text-left space-y-6 order-2 lg:order-1">
            <div className="space-y-2">
              <p className="text-text-secondary text-sm sm:text-base font-medium tracking-wide uppercase">
                {t("hero.welcome")}
              </p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="block text-text-primary">{t("hero.IAm")}</span>
                <span className="block text-gradient mt-2">
                  Mikajisoa Selly-Rafaj
                </span>
              </h1>
            </div>

            {/* Titre animé avec effet de pluie et aspiration */}
            <div className="h-12 sm:h-16 flex items-center justify-center lg:justify-start relative title-container">
              <div
                ref={containerRef}
                className="letter-container flex justify-center lg:justify-start items-center"
              />
            </div>

            <p className="text-text-secondary text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {t("hero.heroDescription")}
            </p>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Button
                variant="primary"
                size="lg"
                onClick={downloadCV}
                icon={
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                }
              >
                {t("hero.cta.downloadCV")}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={scrollToProjects}
                icon={
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                }
              >
                {t("hero.cta.seeProject")}

              </Button>
            </div>

            {/* Stats rapides */}
            <div className="grid grid-cols-3 gap-4 pt-8 max-w-md mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-bold text-gradient">
                  3+
                </div>
                <div className="text-xs sm:text-sm text-text-secondary mt-1">
                  {t("hero.stats.yearsExperience")}
                </div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-bold text-gradient">
                  10+
                </div>
                <div className="text-xs sm:text-sm text-text-secondary mt-1">
                  {t("hero.stats.projectsCompleted")}
                </div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-bold text-gradient">
                  10+
                </div>
                <div className="text-xs sm:text-sm text-text-secondary mt-1">
                  {t("hero.stats.satisfiedClients")}
                </div>
              </div>
            </div>
          </div>

          {/* Image de profil */}
          <div className="order-1 lg:order-2">
            <ProfileImage />
          </div>
        </div>
      </div>

      {/* Indicateur de scroll */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
        <svg
          className="w-6 h-6 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
};