import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useScrollspy } from "../utils/useScrollspy";
import { ChevronDown } from "lucide-react";
import ThemeSwitcher from "./ThemeSwitcher";
import LanguageSwitcher from "./LanguageSwitcher";
import WaterBubbleIndicator from "./WatterBubleIndicator";

// ─── Nav Items Config ─────────────────────────────────────────────────────────
// "flat" items appear directly in the nav bar.
// "group" items collapse into a single dropdown button.
type NavItemFlat = { type: "flat"; id: string; label: string };
type NavItemGroup = { type: "group"; label: string; children: { id: string; label: string }[] };
type NavItem = NavItemFlat | NavItemGroup;

const getNavItems = (t: (k: string) => string): NavItem[] => [
  { type: "flat",  id: "hero",    label: t("nav.home") },
  { type: "flat",  id: "skills",  label: t("nav.skills") },
  { type: "flat",  id: "projects", label: t("nav.projects") },
  {
    type: "group",
    label: t("nav.journey"),   // e.g. "Parcours" / "Journey"
    children: [
      { id: "awards",         label: t("nav.awards") },
      { id: "certifications", label: t("nav.certifications") },
      { id: "experience",     label: t("nav.experience") },
      { id: "education",      label: t("nav.education") },
    ],
  },
  { type: "flat",  id: "contact", label: t("nav.contact") },
];




// ─── Journey Dropdown ─────────────────────────────────────────────────────────
const JourneyDropdown: React.FC<{
  label: string;
  children: { id: string; label: string }[];
  activeSection: string | null;
  scrollToSection: (id: string) => void;
  liRef: (el: HTMLLIElement | null) => void;
  isActive: boolean;
}> = ({ label, children, activeSection, scrollToSection, liRef, isActive }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Auto-open when an inner section becomes active
  useEffect(() => {
    if (isActive) setIsOpen(false); // don't force-open; bubble is enough feedback
  }, [isActive]);

  return (
    <li
      ref={(el) => { (ref as React.MutableRefObject<HTMLLIElement | null>).current = el; liRef(el); }}
      style={{ position: "relative" }}
    >
      <button
        onClick={() => setIsOpen((o) => !o)}
        className={`flex items-center gap-1 px-3 lg:px-4 py-2 rounded-lg transition-all duration-300 text-sm lg:text-base ${
          isActive
            ? "text-primary font-semibold"
            : "text-text-secondary hover:text-primary hover:bg-surface"
        }`}
        style={{ background: "transparent", zIndex: 11, position: "relative" }}
      >
        {label}
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 glass-overlay rounded-xl shadow-xl z-50 overflow-hidden">
          {/* subtle top accent line */}
          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />
          <div className="p-2 space-y-0.5">
            {children.map((child) => (
              <a
                key={child.id}
                href={`#${child.id}`}
                onClick={(e) => { e.preventDefault(); scrollToSection(child.id); setIsOpen(false); }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                  activeSection === child.id
                    ? "text-primary bg-surface font-semibold"
                    : "text-text-secondary hover:text-primary hover:bg-surface"
                }`}
              >
                {/* tiny active dot */}
                <span
                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-300 ${
                    activeSection === child.id ? "bg-primary scale-125" : "bg-transparent"
                  }`}
                />
                {child.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </li>
  );
};

// ─── Header ───────────────────────────────────────────────────────────────────
export const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navItems = getNavItems(t);

  // Collect ALL section ids (flat + inside groups) for the scrollspy
  const allIds = navItems.flatMap((item) =>
    item.type === "flat" ? [item.id] : item.children.map((c) => c.id)
  );
  const activeSection = useScrollspy(allIds);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const [bubbleTarget, setBubbleTarget] = useState<DOMRect | null>(null);
  const [containerRect, setContainerRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Resolve which <li> the bubble should target:
  // - for flat items: their own li
  // - for group items: the group's li when any child is active
  const bubbleTargetId = React.useMemo(() => {
    if (!activeSection) return null;
    for (const item of navItems) {
      if (item.type === "flat" && item.id === activeSection) return item.id;
      if (item.type === "group" && item.children.some((c) => c.id === activeSection)) {
        // Use a synthetic key for the group li
        return `group:${item.label}`;
      }
    }
    return null;
  }, [activeSection, navItems]);

  useEffect(() => {
    if (!bubbleTargetId || !navRef.current) return;
    // Wait one rAF so the DOM has repainted with the new language labels
    // before measuring — fixes bubble width mismatch on language switch.
    const raf = requestAnimationFrame(() => {
      if (!navRef.current) return;
      const itemEl = itemRefs.current[bubbleTargetId];
      if (!itemEl) return;
      setContainerRect(navRef.current.getBoundingClientRect());
      setBubbleTarget(itemEl.getBoundingClientRect());
    });
    return () => cancelAnimationFrame(raf);
  }, [bubbleTargetId, i18n.language]); // re-measure whenever language changes

  useEffect(() => {
    const handleResize = () => {
      if (!bubbleTargetId || !navRef.current) return;
      const itemEl = itemRefs.current[bubbleTargetId];
      if (!itemEl) return;
      setContainerRect(navRef.current.getBoundingClientRect());
      setBubbleTarget(itemEl.getBoundingClientRect());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [bubbleTargetId]);

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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "glass-effect shadow-lg py-2 sm:py-3" : "bg-transparent py-3 sm:py-4 md:py-5"
        }`}
      >
        <nav className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a
              href="#hero"
              onClick={(e) => { e.preventDefault(); scrollToSection("hero"); }}
              className="text-lg xs:text-xl sm:text-2xl font-bold text-gradient hover:scale-105 transition-transform"
            >
              MR. BUG
            </a>

            {/* Desktop Navigation */}
            <ul ref={navRef} className="hidden md:flex items-center gap-1 lg:gap-2 relative">
              <WaterBubbleIndicator
                targetRect={bubbleTarget}
                containerRect={containerRect}
                isVisible={!!bubbleTargetId}
              />

              {navItems.map((item) => {
                if (item.type === "flat") {
                  return (
                    <li
                      key={item.id}
                      ref={(el) => { itemRefs.current[item.id] = el; }}
                      style={{ position: "relative" }}
                    >
                      <a
                        href={`#${item.id}`}
                        onClick={(e) => { e.preventDefault(); scrollToSection(item.id); }}
                        className={`px-3 lg:px-4 py-2 rounded-lg transition-all duration-300 text-sm lg:text-base block ${
                          activeSection === item.id
                            ? "text-primary font-semibold"
                            : "text-text-secondary hover:text-primary hover:bg-surface"
                        }`}
                        style={{ background: "transparent" }}
                      >
                        {item.label}
                      </a>
                    </li>
                  );
                }

                // Group item
                const groupKey = `group:${item.label}`;
                const isGroupActive = item.children.some((c) => c.id === activeSection);
                return (
                  <JourneyDropdown
                    key={groupKey}
                    label={item.label}
                    children={item.children}
                    activeSection={activeSection}
                    scrollToSection={scrollToSection}
                    isActive={isGroupActive}
                    liRef={(el) => { itemRefs.current[groupKey] = el; }}
                  />
                );
              })}
            </ul>

            {/* Right side */}
            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeSwitcher />
              <LanguageSwitcher />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-1.5 xs:p-2 text-text-primary hover:text-primary transition-colors"
                aria-label="Toggle menu"
              >
                <svg className="w-5 h-5 xs:w-6 xs:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute top-16 xs:top-20 right-3 xs:right-4 left-3 xs:left-4 glass-effect rounded-xl xs:rounded-2xl p-4 xs:p-6 shadow-xl">
            <ul className="flex flex-col gap-2 xs:gap-3">
              {navItems.map((item) => {
                if (item.type === "flat") {
                  return (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        onClick={(e) => { e.preventDefault(); scrollToSection(item.id); }}
                        className={`block px-3 xs:px-4 py-2 xs:py-3 rounded-lg transition-all duration-300 text-sm xs:text-base ${
                          activeSection === item.id
                            ? "text-primary bg-surface font-semibold"
                            : "text-text-secondary hover:text-primary hover:bg-surface"
                        }`}
                      >
                        {item.label}
                      </a>
                    </li>
                  );
                }
                // Group: render as flat list with subtle indent in mobile
                return (
                  <React.Fragment key={`group:${item.label}`}>
                    <li className="px-3 xs:px-4 pt-1 pb-0.5">
                      <span className="text-xs font-semibold uppercase tracking-widest text-text-secondary/50">
                        {item.label}
                      </span>
                    </li>
                    {item.children.map((child) => (
                      <li key={child.id}>
                        <a
                          href={`#${child.id}`}
                          onClick={(e) => { e.preventDefault(); scrollToSection(child.id); }}
                          className={`block pl-6 xs:pl-8 pr-3 xs:pr-4 py-2 xs:py-2.5 rounded-lg transition-all duration-300 text-sm xs:text-base ${
                            activeSection === child.id
                              ? "text-primary bg-surface font-semibold"
                              : "text-text-secondary hover:text-primary hover:bg-surface"
                          }`}
                        >
                          {child.label}
                        </a>
                      </li>
                    ))}
                  </React.Fragment>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};