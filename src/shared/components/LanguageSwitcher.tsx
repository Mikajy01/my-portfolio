import { Globe } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Corner from "./Corner";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const languages = [
    { code: "en", label: "EN" },
    { code: "fr", label: "FR" },
  ];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="blueprint w-8 h-8 grid place-items-center border border-border text-text-secondary hover:text-primary hover:border-primary transition-colors"
        aria-label="Change language"
      >
        <Corner />
        <Globe className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <div
          className="blueprint absolute right-0 mt-2 w-28 border z-50"
          style={{ background: "var(--color-background)", borderColor: "var(--color-border)" }}
        >
          <Corner />
          <div className="p-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { i18n.changeLanguage(lang.code); setIsOpen(false); }}
                className="w-full text-left px-3 py-2 font-mono text-xs tracking-widest transition-colors"
                style={{
                  color: i18n.language.startsWith(lang.code) ? "var(--color-primary)" : "var(--color-text-secondary)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-primary)"; }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = i18n.language.startsWith(lang.code) ? "var(--color-primary)" : "var(--color-text-secondary)";
                }}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
