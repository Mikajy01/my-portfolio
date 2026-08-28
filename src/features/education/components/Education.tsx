import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../shared/context/LanguageContext";
import { Timeline } from "../../../shared/components/Timeline";
import educationFr from "../data/education.fr.json";
import educationEn from "../data/education.en.json";

export const Education = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const entries = useMemo(
    () => (language.startsWith("fr") ? educationFr : educationEn),
    [language]
  );

  return (
    <Timeline
      id="education"
      eyebrow={t("education.eyebrow")}
      rangeLabel={t("education.rangeLabel")}
      entries={entries}
    />
  );
};

export default Education;
