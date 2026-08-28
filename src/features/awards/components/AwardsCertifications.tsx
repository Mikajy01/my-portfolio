import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ExternalLink } from "lucide-react";
import Corner from "../../../shared/components/Corner";
import { useLanguage } from "../../../shared/context/LanguageContext";
import awardsFr from "../data/awards.fr.json";
import awardsEn from "../data/awards.en.json";
import certificationsFr from "../../certifications/data/certifications.fr.json";
import certificationsEn from "../../certifications/data/certifications.en.json";

interface AwardItem {
  id: string;
  title: string;
  event: string;
  year: string;
  description: string;
  image: string;
}

interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  year: string;
  description: string;
  image?: string;
  link?: string;
}

export const AwardsCertifications = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const awards = useMemo<AwardItem[]>(
    () => (language.startsWith("fr") ? awardsFr : awardsEn) as AwardItem[],
    [language]
  );
  const certifications = useMemo<CertificationItem[]>(
    () => (language.startsWith("fr") ? certificationsFr : certificationsEn) as CertificationItem[],
    [language]
  );

  return (
    <section id="awards-certifications" className="relative z-1 max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-10 py-20 lg:py-28">
      <div data-reveal className="flex items-baseline gap-5 mb-14">
        <span className="font-mono text-[11px] tracking-[.18em] text-primary">{t("awardsCertifications.eyebrow")}</span>
        <span className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
      </div>

      <div className="flex items-baseline gap-3.5 mb-6">
        <span className="font-mono text-[10px] tracking-[.16em] uppercase text-text-muted">01</span>
        <span className="font-heading font-semibold text-2xl">{t("awardsCertifications.awardsLabel")}</span>
      </div>
      <div data-reveal className="grid sm:grid-cols-2 gap-5 mb-16">
        {awards.map((award) => (
          <div key={award.id} className="blueprint relative overflow-hidden border" style={{ borderColor: "var(--color-border)" }}>
            <Corner />
            <div className="relative min-h-[200px]">
              <img src={award.image} alt={award.event} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, color-mix(in srgb, #000 92%, transparent), color-mix(in srgb, #000 55%, transparent) 60%, transparent)" }} />
              <div className="relative z-1 p-6 flex flex-col justify-center min-h-[200px]">
                <span className="font-mono text-[10px] tracking-[.14em] text-primary mb-2">{award.year}</span>
                <h4 className="font-heading font-semibold text-xl sm:text-2xl text-white leading-tight mb-1.5">{award.title}</h4>
                <p className="font-mono text-[11px] tracking-[.06em] text-white/70 mb-2">{award.event}</p>
                <p className="text-[13px] text-white/85 max-w-md leading-relaxed">{award.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-baseline gap-3.5 mb-6">
        <span className="font-mono text-[10px] tracking-[.16em] uppercase text-text-muted">02</span>
        <span className="font-heading font-semibold text-2xl">{t("awardsCertifications.certificationsLabel")}</span>
      </div>
      <div data-reveal className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {certifications.map((cert) => (
          <div key={cert.id} className="blueprint relative flex flex-col p-6 border" style={{ borderColor: "var(--color-border)" }}>
            <Corner />
            <span className="font-mono text-[10px] tracking-[.14em] text-primary mb-3">{cert.issuer} · {cert.year}</span>
            <h4 className="font-heading font-semibold text-lg leading-tight mb-2">{cert.title}</h4>
            <p className="text-[13px] leading-relaxed text-text-secondary mb-4 flex-1">{cert.description}</p>
            {cert.link && (
              <a
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[.14em] uppercase text-primary"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                {t("certifications.viewCertificate")}
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default AwardsCertifications;
