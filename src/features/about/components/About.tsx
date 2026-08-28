import { useTranslation } from "react-i18next";

interface Trait {
  title: string;
  description: string;
}

export const About = () => {
  const { t } = useTranslation();
  const traits = t("about.traits", { returnObjects: true }) as Trait[];

  return (
    <section id="about" className="relative z-1 max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-10 py-24 lg:py-32">
      <div data-reveal className="flex items-baseline gap-5 mb-14">
        <span className="font-mono text-[11px] tracking-[.18em] text-primary">{t("about.eyebrow")}</span>
        <span className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
        <span className="font-mono text-[11px] tracking-[.14em] text-text-muted hidden sm:inline">
          {t("about.tagLabel")}
        </span>
      </div>

      <div data-reveal className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-16">
        <h2 className="font-heading font-semibold leading-[1.04] tracking-[-.02em] text-[clamp(2rem,3.6vw,3.25rem)] max-w-[18ch] m-0">
          {t("about.headline")} <em className="not-italic text-primary">{t("about.headlineAccent")}</em>
        </h2>
        <div className="space-y-4">
          <p className="text-base leading-[1.75] text-text-secondary m-0">{t("about.bio1")}</p>
          <p className="text-base leading-[1.75] text-text-secondary m-0">{t("about.bio2")}</p>
        </div>
      </div>

      <div
        data-reveal
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px border"
        style={{ background: "var(--color-border)", borderColor: "var(--color-border)" }}
      >
        {traits.map((trait, idx) => (
          <div
            key={trait.title}
            className="px-6 py-8 transition-colors"
            style={{ background: "var(--color-background)" }}
          >
            <div className="font-mono text-[10px] tracking-[.18em] text-primary mb-10">
              {String(idx + 1).padStart(2, "0")}
            </div>
            <div className="font-heading font-semibold text-[28px] tracking-[-.01em] mb-2.5">{trait.title}</div>
            <p className="text-[13.5px] leading-relaxed text-text-secondary m-0">{trait.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default About;
