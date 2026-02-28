import {
  useState,
  useEffect,
  useRef,
  type FormEvent,
  type ChangeEvent,
} from "react";
import { useTranslation } from "react-i18next";
import emailjs from "@emailjs/browser";
import { Button } from "../../../shared/components/Button";
import { Github, Loader2, Mail, MapPin } from "lucide-react";

const EMAILJS_SERVICE_ID  = "service_fkx8a9u";
const EMAILJS_TEMPLATE_ID = "template_4gpy85q";
const EMAILJS_PUBLIC_KEY  = "ZAqbmky86xYHx5T5d"; 

const Contact = () => {
  const { t } = useTranslation();
  const formRef = useRef<HTMLFormElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

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
        threshold: 0.3,
        rootMargin: "-50px 0px -50px 0px",
      }
    );

    const elements = sectionRef.current?.querySelectorAll(".observe-animation");
    elements?.forEach((el) => observer.observe(el));

    return () => {
      elements?.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        EMAILJS_PUBLIC_KEY
      );
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

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-16 md:py-24 px-4 md:px-8 relative overflow-hidden bg-surface"
    >
      {/* Effets de lumière */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary opacity-10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary opacity-10 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="observe-animation opacity-0 transition-all duration-700 mb-12 md:mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">{t("contact.title")}</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            {t("contact.subtitle")}
          </p>
          <div className="w-20 h-1 bg-gradient-primary mx-auto rounded-full mt-6" />
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Informations de contact */}
          <div className="observe-animation opacity-0 transition-all duration-700 delay-200 space-y-6">
            <div className="glass-effect p-6 md:p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-6 text-gradient-accent">
                {t("contact.stayInTouch")}
              </h3>
              <p className="text-text-secondary mb-8 leading-relaxed">
                {t("contact.description")}
              </p>

              <div className="space-y-4">
                <a
                  href="mailto:sellyrafaj@gmail.com"
                  className="flex items-center gap-4 p-4 rounded-xl bg-surface-elevated hover:bg-surface hover:glow-effect transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-text-muted text-sm">{t("contact.info.email")}</div>
                    <div className="text-text-primary font-medium">sellyrafaj@gmail.com</div>
                  </div>
                </a>

                <a
                  href="https://github.com/Mikajy01/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-surface-elevated hover:bg-surface hover:glow-effect transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Github className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-text-muted text-sm">GitHub</div>
                    <div className="text-text-primary font-medium">@Mikajy01</div>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-elevated">
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-text-muted text-sm">{t("contact.info.location")}</div>
                    <div className="text-text-primary font-medium">Fianarantsoa, Madagascar</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire de contact */}
          <div className="observe-animation opacity-0 transition-all duration-700 delay-400">
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="glass-effect p-6 md:p-8 rounded-2xl space-y-6"
            >
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-2">
                  {t("contact.form.name")}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-surface-elevated border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 text-text-primary transition-all"
                  placeholder={t("contact.form.name")}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
                  {t("contact.form.email")}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-surface-elevated border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 text-text-primary transition-all"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-text-secondary mb-2">
                  {t("contact.form.message")}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-surface-elevated border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 text-text-primary transition-all resize-none"
                  placeholder={t("contact.form.message")}
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t("contact.form.sending")}
                  </span>
                ) : (
                  t("contact.form.submit")
                )}
              </Button>

              {submitStatus === "success" && (
                <div className="p-4 rounded-xl bg-primary/10 border border-primary text-text-primary text-center animate-slide-up">
                  ✓ {t("contact.form.success")}
                </div>
              )}

              {submitStatus === "error" && (
                <div className="p-4 rounded-xl bg-secondary/10 border border-secondary text-secondary text-center animate-slide-up">
                  ✗ {t("contact.form.error")}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;