import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../shared/context/LanguageContext";
import { Timeline } from "../../../shared/components/Timeline";
import experienceFr from "../data/experience.fr.json";
import experienceEn from "../data/experience.en.json";

export const Experience = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const entries = useMemo(
    () => (language.startsWith("fr") ? experienceFr : experienceEn),
    [language]
  );

  return (
    <Timeline
      id="experience"
      eyebrow={t("experience.eyebrow")}
      rangeLabel={t("experience.rangeLabel")}
      entries={entries}
    />
  );
};

export default Experience;
