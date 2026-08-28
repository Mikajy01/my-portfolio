import { useTranslation } from "react-i18next";
import Counter from "./Counter";
import projectsEn from "../../features/projects/data/projects.en.json";
import awardsEn from "../../features/awards/data/awards.en.json";
import certificationsEn from "../../features/certifications/data/certifications.en.json";

const STATS = [
  { target: projectsEn.length, suffix: "", key: "projects" },
  { target: 3, suffix: "+", key: "experience" },
  { target: awardsEn.length, suffix: "", key: "awards" },
  { target: certificationsEn.length, suffix: "", key: "certifications" },
] as const;

export const StatsBand = () => {
  const { t } = useTranslation();

  return (
    <section className="relative z-1 max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-10 pb-16 lg:pb-24">
      <div
        data-reveal
        className="grid grid-cols-2 lg:grid-cols-4 gap-px border"
        style={{ background: "var(--color-border)", borderColor: "var(--color-border)" }}
      >
        {STATS.map((stat) => (
          <div key={stat.key} className="px-6 py-9" style={{ background: "var(--color-background)" }}>
            <div className="font-heading font-semibold leading-[.9] tracking-[-.035em] text-[clamp(2.6rem,5.6vw,4.6rem)]">
              <Counter target={stat.target} />
              {stat.suffix && <span className="text-primary">{stat.suffix}</span>}
            </div>
            <div className="font-mono text-[10px] tracking-[.16em] uppercase text-text-muted mt-3">
              {t(`statsBand.${stat.key}`)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsBand;
