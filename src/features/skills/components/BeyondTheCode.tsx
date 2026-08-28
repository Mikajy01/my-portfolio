import { useTranslation } from "react-i18next";
import { GitBranch, Shield, Zap, Target, Lock, Puzzle, type LucideIcon } from "lucide-react";
import { useLanguage } from "../../../shared/context/LanguageContext";
import skillsFr from "../data/skills.fr.json";
import skillsEn from "../data/skills.en.json";

interface Concept {
  name: string;
  icon: string;
  description: string;
}

const iconMap: Record<string, LucideIcon> = {
  gitBranch: GitBranch,
  shield: Shield,
  zap: Zap,
  target: Target,
  lock: Lock,
  puzzle: Puzzle,
};

export const BeyondTheCode = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const concepts = (language.startsWith("fr") ? skillsFr : skillsEn).concepts as Concept[];

  return (
    <section
      className="relative z-1 border-y"
      style={{ background: "color-mix(in srgb, var(--color-surface) 55%, transparent)", borderColor: "var(--color-border)" }}
    >
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-10 py-20 lg:py-28">
        <div data-reveal className="flex items-baseline gap-5 mb-14">
          <span className="font-mono text-[11px] tracking-[.18em] text-primary">{t("beyond.eyebrow")}</span>
          <span className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
        </div>
        <h2 data-reveal className="font-heading font-semibold leading-[1.02] tracking-[-.025em] max-w-[20ch] text-[clamp(1.7rem,4.2vw,3rem)] mb-14">
          {t("beyond.headline")}
        </h2>
        <div
          data-reveal
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px border"
          style={{ background: "var(--color-border)", borderColor: "var(--color-border)" }}
        >
          {concepts.map((concept) => {
            const Icon = iconMap[concept.icon] ?? Target;
            return (
              <div
                key={concept.name}
                className="px-7 py-8"
                style={{ background: "color-mix(in srgb, var(--color-surface) 55%, transparent)" }}
              >
                <Icon className="w-6 h-6 text-primary mb-6" strokeWidth={1.5} />
                <div className="font-heading font-semibold text-2xl mb-2">{concept.name}</div>
                <p className="text-[13.5px] leading-relaxed text-text-secondary m-0">{concept.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BeyondTheCode;
