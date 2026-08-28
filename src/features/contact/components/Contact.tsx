import { useState, useRef, type FormEvent, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import emailjs from "@emailjs/browser";
import { Loader2 } from "lucide-react";
import Corner from "../../../shared/components/Corner";
import { useMagnetic } from "../../../shared/hooks/useMagnetic";

const EMAILJS_SERVICE_ID = "service_fkx8a9u";
const EMAILJS_TEMPLATE_ID = "template_4gpy85q";
const EMAILJS_PUBLIC_KEY = "ZAqbmky86xYHx5T5d";

const ArrowIcon = () => (
  <svg width="26" height="12" viewBox="0 0 22 10" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path d="M0 5h20M16 1l4 4-4 4" />
  </svg>
);

const Contact = () => {
  const { t } = useTranslation();
  const formRef = useRef<HTMLFormElement>(null);
  const emailRef = useMagnetic<HTMLAnchorElement>();

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formRef.current, EMAILJS_PUBLIC_KEY);
      setSubmitStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("EmailJS error:", err);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus("idle"), 4000);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const socialLinks = [
    { label: t("contact.linkGithub"), value: "@Mikajy01", href: "https://github.com/Mikajy01/" },
    { label: t("contact.linkLinkedin"), value: "/in/mikajisoa", href: "https://www.linkedin.com/in/mikajisoa-selly-rafaj-ratsimbazafy-7b9365321/" },
    { label: t("contact.linkWhatsapp"), value: "+261 38 830 7423", href: "https://wa.me/261388307423" },
    { label: t("contact.linkResume"), value: "PDF ↗", href: "/cv.pdf" },
  ];

  return (
    <section id="contact" className="relative z-1 border-t" style={{ borderColor: "var(--color-border)" }}>
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-10 py-24 sm:py-32 pb-16">
        <div data-reveal className="flex items-baseline gap-5 mb-14">
          <span className="font-mono text-[11px] tracking-[.18em] text-primary">{t("contact.eyebrow")}</span>
          <span className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
        </div>

        <h2
          data-reveal
          className="font-heading font-semibold leading-[.92] tracking-[-.03em] max-w-[16ch] m-0 mb-12"
          style={{ fontSize: "clamp(2.4rem,8vw,7.2rem)" }}
        >
          {t("contact.headline")} <em className="not-italic text-primary">{t("contact.headlineAccent")}</em>
        </h2>

        <div data-reveal className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] gap-14">
          <div>
            <p className="text-base leading-relaxed text-text-secondary max-w-[46ch] mb-8">
              {t("contact.description")}
            </p>

            <a
              ref={emailRef}
              href="mailto:sellyrafaj@gmail.com"
              className="inline-flex items-center gap-4 font-heading font-semibold text-[clamp(1.6rem,3.4vw,2.6rem)] tracking-[-.02em] border-b border-border pb-2.5 mb-10 hover:text-primary hover:border-primary transition-colors"
            >
              sellyrafaj@gmail.com
              <ArrowIcon />
            </a>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-5 max-w-xl">
              <div>
                <label htmlFor="name" className="block font-mono text-[10px] tracking-[.14em] uppercase text-text-muted mb-2">
                  {t("contact.form.name")}
                </label>
                <input
                  type="text" id="name" name="name" value={formData.name} onChange={handleChange} required
                  className="w-full px-3 py-2.5 border border-border bg-surface font-mono text-sm text-text-primary focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label htmlFor="email" className="block font-mono text-[10px] tracking-[.14em] uppercase text-text-muted mb-2">
                  {t("contact.form.email")}
                </label>
                <input
                  type="email" id="email" name="email" value={formData.email} onChange={handleChange} required
                  className="w-full px-3 py-2.5 border border-border bg-surface font-mono text-sm text-text-primary focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label htmlFor="message" className="block font-mono text-[10px] tracking-[.14em] uppercase text-text-muted mb-2">
                  {t("contact.form.message")}
                </label>
                <textarea
                  id="message" name="message" value={formData.message} onChange={handleChange} required rows={4}
                  className="w-full px-3 py-2.5 border border-border bg-surface font-mono text-sm text-text-primary focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="blueprint relative inline-flex items-center gap-2 font-heading font-semibold text-[13px] tracking-widest uppercase px-6 py-3.5 disabled:opacity-50"
                style={{ background: "var(--color-primary)", color: "var(--color-background)" }}
              >
                <Corner />
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t("contact.form.sending")}
                  </span>
                ) : (
                  t("contact.form.submit")
                )}
              </button>

              {submitStatus === "success" && (
                <p className="font-mono text-xs text-primary">✓ {t("contact.form.success")}</p>
              )}
              {submitStatus === "error" && (
                <p className="font-mono text-xs text-secondary">✗ {t("contact.form.error")}</p>
              )}
            </form>
          </div>

          <div className="flex flex-col border-t" style={{ borderColor: "var(--color-border)" }}>
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="flex items-center justify-between py-4.5 px-1 border-b font-mono text-[11.5px] tracking-[.14em] uppercase text-text-primary hover:text-primary hover:pl-3.5 transition-all"
                style={{ borderColor: "var(--color-border)" }}
              >
                <span>{link.label}</span>
                <span className="text-text-muted">{link.value}</span>
              </a>
            ))}
            <div className="pt-6 font-mono text-[10px] tracking-[.14em] uppercase text-text-muted">
              Fianarantsoa, Madagascar · 21.45°S 47.09°E
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
