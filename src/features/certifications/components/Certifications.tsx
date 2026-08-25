import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Award, ExternalLink } from "lucide-react";
import { useLanguage } from "../../../shared/context/LanguageContext";
import type { Certification } from "../data/certifications";
import certificationsFr from "../data/certifications.fr.json";
import certificationsEn from "../data/certifications.en.json";

const getCertificationsByLanguage = (language: string): Certification[] => {
  if (language.startsWith("fr")) {
    return certificationsFr as Certification[];
  }
  return certificationsEn as Certification[];
};

const Certifications = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);

  const certifications = useMemo(
    () => getCertificationsByLanguage(language),
    [language]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-slide-up");
            entry.target.classList.remove("opacity-0");
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "-50px 0px -50px 0px",
      }
    );

    const elements = sectionRef.current?.querySelectorAll(".observe-animation");
    elements?.forEach((el) => observer.observe(el));

    return () => {
      elements?.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, []);

  return (
    <section
      id="certifications"
      ref={sectionRef}
      className="py-16 md:py-24 px-4 md:px-8 relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="observe-animation opacity-0 translate-y-8 transition-all duration-700 mb-12 md:mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">{t("certifications.title")}</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            {t("certifications.subtitle")}
          </p>
          <div className="w-20 h-1 bg-gradient-primary mx-auto rounded-full mt-6" />
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {certifications.map((cert, idx) => (
            <article
              key={cert.id}
              className="group relative overflow-hidden rounded-2xl card-elevated observe-animation opacity-0 translate-y-8 transition-all duration-700"
              style={{ transitionDelay: `${idx * 150}ms` }}
            >
              {/* Background image / gradient */}
              <div className="absolute inset-0">
                {cert.image ? (
                  <>
                    <img
                      src={cert.image}
                      alt={cert.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:-translate-y-2"
                    />
                    {/* Overlay de base — toujours présent */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent" />
                    {/* Overlay supplémentaire au hover pour assurer la lisibilité */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </>
                ) : (
                  <>
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 via-primary/5 to-transparent" />
                    {/* Overlay sombre au hover sur les cartes sans image */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                  </>
                )}
              </div>

              {/* Content */}
              <div className="relative z-10 p-6 md:p-8 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/40 flex items-center justify-center text-white">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    {/* Texte issuer : couleur adaptée selon présence d'image */}
                    <span
                      className={`text-sm font-medium transition-colors duration-300 ${
                        cert.image
                          ? "text-white/80"
                          : "text-text-secondary group-hover:text-white/80"
                      }`}
                    >
                      {cert.issuer}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/15 text-white/80 border border-white/30 self-start mt-1">
                      {cert.year}
                    </span>
                  </div>
                </div>

                {/* Titre : adapté selon présence d'image */}
                <h3
                  className={`text-xl md:text-2xl font-bold mb-2 transition-colors duration-300 ${
                    cert.image
                      ? "text-white"
                      : "text-text-primary group-hover:text-white"
                  }`}
                >
                  {cert.title}
                </h3>

                {/* Description — toujours blanc car l'overlay sombre est actif au hover */}
                <p
                  className="text-sm text-white/90 mb-4 flex-1
                    max-h-0 overflow-hidden opacity-0
                    group-hover:max-h-40 group-hover:opacity-100
                    transition-all duration-500 ease-in-out"
                  style={{ textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}
                >
                  {cert.description}
                </p>

                {cert.link && (
                  <div className="mt-2">
                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/40 text-sm text-white font-medium transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {t("certifications.viewCertificate", "View certificate")}
                    </a>
                  </div>
                )}
              </div>

              <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-primary/60 transition-colors duration-300" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;