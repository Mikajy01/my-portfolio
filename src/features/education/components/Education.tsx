import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { GraduationCap } from "lucide-react";
import {
  TimelineItem,
  type TimelineItemData,
} from "../../../shared/components/TimelineItem";
import { SectionHeader } from "../../../shared/components/SectionHeader";
import { useLanguage } from "../../../shared/context/LanguageContext";
import educationFr from "../data/education.fr.json";
import educationEn from "../data/education.en.json";

const getEducationByLanguage = (language: string): TimelineItemData[] => {
  if (language.startsWith("fr")) {
    return educationFr as TimelineItemData[];
  }
  return educationEn as TimelineItemData[];
};

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export const Education: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const educationData = useMemo(
    () => getEducationByLanguage(language),
    [language]
  );
  return (
    <section id="education" className="py-20 px-4 relative overflow-hidden">
      {/* Effet de lumière d'arrière-plan */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary opacity-10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary opacity-10 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* En-tête de section */}
        <SectionHeader icon={GraduationCap} title={t("education.title")} />

        {/* Timeline */}
        <div className="relative">
          {educationData.map((item, index) => (
            <TimelineItem key={item.id} item={item} isLeft={index % 2 === 0} />
          ))}
        </div>
      </div>
    </section>
  );
};
