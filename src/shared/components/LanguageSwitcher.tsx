import { Globe } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
  
    const languages = [
      { code: "en", label: "English", flag: "🇬🇧" },
      { code: "fr", label: "Français", flag: "🇫🇷" },
    ];
  
    const currentLanguage = languages.find((lang) => lang.code === i18n.language);
  
    // Close on outside click
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
          className="relative cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 text-text-secondary hover:text-primary hover:bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Change language"
        >
          <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline text-sm">{currentLanguage?.flag}</span>
        </button>
  
        {isOpen && (
          <div className="absolute right-0 mt-2 w-40 glass-effect rounded-lg shadow-lg z-50">
            <div className="p-2 space-y-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => { i18n.changeLanguage(lang.code); setIsOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                    i18n.language === lang.code
                      ? "bg-primary text-white font-semibold"
                      : "text-text-secondary hover:bg-surface hover:text-primary"
                  }`}
                >
                  <span className="mr-2">{lang.flag}</span>
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