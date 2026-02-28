import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Briefcase } from "lucide-react";
import {
  TimelineItem,
  type TimelineItemData,
} from "../../../shared/components/TimelineItem";
import { SectionHeader } from "../../../shared/components/SectionHeader";
import { useLanguage } from "../../../shared/context/LanguageContext";
import experienceFr from "../data/experience.fr.json";
import experienceEn from "../data/experience.en.json";

const getExperienceByLanguage = (language: string): TimelineItemData[] => {
  if (language.startsWith("fr")) {
    return experienceFr as TimelineItemData[];
  }
  return experienceEn as TimelineItemData[];
};

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export const Experience: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const experienceData = useMemo(
    () => getExperienceByLanguage(language),
    [language]
  );
  return (
    <section
      id="experience"
      className="py-20 px-4 relative bg-surface overflow-hidden"
    >
      {/* Effet de grille animée */}
      <div className="absolute inset-0 opacity-7">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at center, var(--color-primary) 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
          }}
        />
      </div>
      {/* Effet de lumière d'arrière-plan */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent opacity-10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary opacity-10 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* En-tête de section */}
        <SectionHeader icon={Briefcase} title={t("experience.title")} />

        {/* Timeline */}
        <div className="relative">
          {experienceData.map((item, index) => (
            <TimelineItem key={item.id} item={item} isLeft={index % 2 === 0} />
          ))}
        </div>
      </div>
    </section>
  );
};
