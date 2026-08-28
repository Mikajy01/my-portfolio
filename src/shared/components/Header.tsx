import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import { useScrollspy } from "../utils/useScrollspy";
import Corner from "./Corner";
import ThemeSwitcher from "./ThemeSwitcher";
import LanguageSwitcher from "./LanguageSwitcher";

type NavItemFlat = { type: "flat"; id: string; label: string };
type NavItemGroup = { type: "group"; label: string; children: { id: string; label: string }[] };
type NavItem = NavItemFlat | NavItemGroup;

const NAV_LINK_STYLE = (isActive: boolean): React.CSSProperties => ({
  color: isActive ? "var(--color-text-primary)" : "var(--color-text-muted)",
});

// Menu déroulant desktop pour le groupe "Journey" (Expérience / Formation).
const JourneyDropdown: React.FC<{
  label: string;
  children: { id: string; label: string }[];
  activeSection: string | null;
  scrollToSection: (id: string) => void;
}> = ({ label, children, activeSection, scrollToSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isActive = children.some((c) => c.id === activeSection);

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
        onClick={() => setIsOpen((o) => !o)}
        className="flex items-center gap-1.5 font-mono text-[11px] tracking-[.14em] uppercase transition-colors"
        style={NAV_LINK_STYLE(isActive)}
        onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-primary)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = NAV_LINK_STYLE(isActive).color as string; }}
      >
        {label}
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div
          className="blueprint absolute top-full left-1/2 -translate-x-1/2 mt-3 w-44 border z-50"
          style={{ background: "var(--color-background)", borderColor: "var(--color-border)" }}
        >
          <Corner />
          <div className="p-1">
            {children.map((child) => {
              const childActive = activeSection === child.id;
              return (
                <a
                  key={child.id}
                  href={`#${child.id}`}
                  onClick={(e) => { e.preventDefault(); scrollToSection(child.id); setIsOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2 font-mono text-[11px] tracking-widest uppercase transition-colors"
                  style={{ color: childActive ? "var(--color-primary)" : "var(--color-text-secondary)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-primary)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = childActive ? "var(--color-primary)" : "var(--color-text-secondary)"; }}
                >
                  <span
                    className="w-1.5 h-1.5 shrink-0"
                    style={{ background: childActive ? "var(--color-primary)" : "transparent", border: childActive ? "none" : "1px solid var(--color-border)" }}
                  />
                  {child.label}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export const Header: React.FC = () => {
  const { t } = useTranslation();

  const navItems: NavItem[] = [
    { type: "flat", id: "hero", label: t("nav.home") },
    { type: "flat", id: "about", label: t("nav.about") },
    { type: "flat", id: "work", label: t("nav.work") },
    {
      type: "group",
      label: t("nav.journey"),
      children: [
        { id: "experience", label: t("experience.title") },
        { id: "education", label: t("education.title") },
      ],
    },
    { type: "flat", id: "contact", label: t("nav.contact") },
  ];

  const navIds = navItems.flatMap((item) => (item.type === "flat" ? [item.id] : item.children.map((c) => c.id)));
  const activeSection = useScrollspy(navIds, 140);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY, behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 border-b transition-[background,backdrop-filter,border-color] duration-300"
        style={{
          background: isScrolled ? "color-mix(in srgb, var(--color-background) 82%, transparent)" : "transparent",
          backdropFilter: isScrolled ? "blur(14px) saturate(140%)" : "none",
          borderColor: isScrolled ? "var(--color-border)" : "transparent",
        }}
      >
        <div
          className="container mx-auto px-4 sm:px-6 lg:px-10 flex items-center gap-8 transition-[height] duration-300"
          style={{ height: isScrolled ? 62 : 76 }}
        >
          <a
            href="#hero"
            onClick={(e) => { e.preventDefault(); scrollToSection("hero"); }}
            className="flex items-center gap-3 text-text-primary"
          >
            <span
              className="blueprint w-8 h-8 grid place-items-center font-heading font-semibold text-sm border"
              style={{ borderColor: "var(--color-border)" }}
            >
              <Corner />
              MSR
            </span>
            <span className="font-mono text-[11px] tracking-[.16em] uppercase text-text-muted hidden xs:inline">
              m.selly-rafaj
            </span>
          </a>

          <nav className="ml-auto hidden md:flex items-center gap-7">
            {navItems.map((item) => {
              if (item.type === "flat") {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => { e.preventDefault(); scrollToSection(item.id); }}
                    className="font-mono text-[11px] tracking-[.14em] uppercase transition-colors"
                    style={NAV_LINK_STYLE(isActive)}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-primary)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = NAV_LINK_STYLE(isActive).color as string; }}
                  >
                    {item.label}
                  </a>
                );
              }
              return (
                <JourneyDropdown
                  key={item.label}
                  label={item.label}
                  children={item.children}
                  activeSection={activeSection}
                  scrollToSection={scrollToSection}
                />
              );
            })}
            <span className="hidden lg:flex items-center gap-2 pl-5 border-l" style={{ borderColor: "var(--color-border)" }}>
              <span className="w-1.5 h-1.5 bg-primary" style={{ animation: "pulseDot 2.4s ease-in-out infinite" }} />
              <span className="font-mono text-[10px] tracking-[.14em] uppercase text-text-muted">
                {t("nav.openToWork")}
              </span>
            </span>
          </nav>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden ml-auto p-1.5 text-text-primary"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <div className="hidden md:flex items-center gap-2 pl-2">
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute top-20 right-4 left-4 blueprint border p-4" style={{ background: "var(--color-background)", borderColor: "var(--color-border)" }}>
            <Corner />
            <ul className="flex flex-col gap-1">
              {navItems.map((item) => {
                if (item.type === "flat") {
                  const isActive = activeSection === item.id;
                  return (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        onClick={(e) => { e.preventDefault(); scrollToSection(item.id); }}
                        className="block px-3 py-2.5 font-mono text-xs tracking-[.14em] uppercase"
                        style={{ color: isActive ? "var(--color-primary)" : "var(--color-text-secondary)" }}
                      >
                        {item.label}
                      </a>
                    </li>
                  );
                }
                return (
                  <React.Fragment key={item.label}>
                    <li className="px-3 pt-2 pb-0.5">
                      <span className="font-mono text-[10px] tracking-[.16em] uppercase text-text-muted">
                        {item.label}
                      </span>
                    </li>
                    {item.children.map((child) => {
                      const childActive = activeSection === child.id;
                      return (
                        <li key={child.id}>
                          <a
                            href={`#${child.id}`}
                            onClick={(e) => { e.preventDefault(); scrollToSection(child.id); }}
                            className="block pl-6 pr-3 py-2.5 font-mono text-xs tracking-[.14em] uppercase"
                            style={{ color: childActive ? "var(--color-primary)" : "var(--color-text-secondary)" }}
                          >
                            {child.label}
                          </a>
                        </li>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </ul>
            <div className="flex items-center gap-3 pt-3 mt-2 border-t" style={{ borderColor: "var(--color-border)" }}>
              <ThemeSwitcher />
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
