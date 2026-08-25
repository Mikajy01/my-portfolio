import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Trophy, Medal, Award, Star } from "lucide-react";
import { useLanguage } from "../../../shared/context/LanguageContext";
import awardsFr from "../data/awards.fr.json";
import awardsEn from "../data/awards.en.json";

interface AwardItem {
  id: string;
  title: string;
  event: string;
  year: string;
  description: string;
  image: string;
  icon?: string;
}

const getAwardsByLanguage = (language: string): AwardItem[] => {
  if (language.startsWith("fr")) {
    return awardsFr as AwardItem[];
  }
  return awardsEn as AwardItem[];
};

const Awards = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);

  const awards = useMemo(() => getAwardsByLanguage(language), [language]);

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
      },
    );

    const elements = sectionRef.current?.querySelectorAll(".observe-animation");
    elements?.forEach((el) => observer.observe(el));

    return () => {
      elements?.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, []);

  const getIcon = (iconType: string) => {
    const iconProps = { className: "w-6 h-6" };
    switch (iconType) {
      case "trophy":
        return <Trophy {...iconProps} />;
      case "medal":
        return <Medal {...iconProps} />;
      case "award":
        return <Award {...iconProps} />;
      case "star":
        return <Star {...iconProps} />;
      default:
        return <Trophy {...iconProps} />;
    }
  };

  return (
    <section
      id="awards"
      ref={sectionRef}
      className="py-16 md:py-24 px-4 md:px-8 relative overflow-hidden"
    >
      <div className="mb-24">
        <div className="flex items-center gap-4 mb-8 observe-animation opacity-0 translate-y-8 transition-all duration-700">
          <h3 className="text-2xl font-bold text-text-primary">
            🏆 {t("awards.title")}
          </h3>
          <div className="h-px bg-border flex-1" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {awards.map((award, idx) => (
            <div
              key={award.id}
              className="group relative min-h-48 md:min-h-64 rounded-2xl overflow-hidden card-elevated observe-animation opacity-0 translate-y-8 transition-all duration-700 hover:shadow-glow-lg"
              style={{ transitionDelay: `${idx * 150}ms` }}
            >
              {/* Background Image — couvre toujours toute la card grâce à absolute inset-0 */}
              <div className="absolute inset-0">
                <img
                  src={award.image}
                  alt={award.event}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:-translate-y-4"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/95 md:from-black/90 via-black/60 to-transparent" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Content — relative pour participer au flux et pousser la hauteur de la card */}
              <div className="relative z-10 p-6 md:p-8 flex flex-col justify-center items-start min-h-48 md:min-h-64">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-white">
                    {getIcon(award.icon ?? "")}
                  </span>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/40 text-white text-xs font-bold rounded-full">
                    {award.year}
                  </span>
                </div>

                <h4 className="text-xl md:text-3xl font-bold text-transparent mb-2 bg-clip-text bg-gradient-to-r from-white to-gray-400 leading-tight">
                  {award.title}
                </h4>

                <p className="text-gray-300 font-medium mb-2 text-sm md:text-base">
                  {award.event}
                </p>

                <p
                  className="text-white/90 text-sm max-w-md
                    opacity-100 md:opacity-0 md:group-hover:opacity-100
                    translate-y-0 md:translate-y-2 md:group-hover:translate-y-0
                    transition-all duration-300"
                  style={{ textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}
                >
                  {award.description}
                </p>
              </div>

              {/* Border Glow Effect */}
              <div className="absolute inset-0 border-2 border-white/10 rounded-2xl group-hover:border-primary/50 transition-colors duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Awards;
