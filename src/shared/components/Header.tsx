import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useScrollspy } from "../utils/useScrollspy";
import { Globe, ChevronDown } from "lucide-react";

// ─── Language Switcher ────────────────────────────────────────────────────────
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

// ─── Theme Switcher ───────────────────────────────────────────────────────────
const ThemeSwitcher = () => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme as "light" | "dark");
      document.documentElement.classList.add(savedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className="relative cursor-pointer w-12 h-6 sm:w-14 sm:h-7 md:w-16 md:h-8 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
      style={{
        background: isDark
          ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
          : "linear-gradient(135deg, #00f0ff 0%, #bf00ff 100%)",
      }}
      aria-label="Toggle theme"
    >
      <div
        className="absolute inset-0 rounded-full opacity-50 blur-sm transition-opacity duration-300"
        style={{
          background: isDark
            ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
            : "linear-gradient(135deg, #00f0ff 0%, #bf00ff 100%)",
        }}
      />
      <div
        className={`absolute top-0.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full shadow-lg transition-all duration-500 ease-out flex items-center justify-center ${
          isDark ? "translate-x-6 sm:translate-x-7 md:translate-x-9" : "translate-x-0.5 sm:translate-x-1"
        }`}
        style={{
          background: "white",
          boxShadow: isDark
            ? "0 0 20px rgba(191,0,255,0.5), 0 4px 8px rgba(0,0,0,0.3)"
            : "0 0 20px rgba(0,240,255,0.5), 0 4px 8px rgba(0,0,0,0.2)",
        }}
      >
        <div className={`transition-all duration-500 ${isDark ? "rotate-0" : "rotate-180"}`}>
          {isDark ? (
            <svg width="10" height="10" className="sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 text-indigo-600" viewBox="0 0 24 24" fill="none">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor" />
            </svg>
          ) : (
            <svg width="10" height="10" className="sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 text-yellow-500" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="4" fill="currentColor" />
              <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </div>
      </div>
      <div className={`absolute inset-0 transition-opacity duration-500 ${isDark ? "opacity-100" : "opacity-0"}`}>
        <div className="absolute top-1 left-1 w-0.5 h-0.5 sm:top-2 sm:left-2 sm:w-1 sm:h-1 bg-white rounded-full animate-pulse" />
        <div className="absolute top-2 left-2 w-0.5 h-0.5 sm:top-4 sm:left-4 bg-white rounded-full animate-pulse delay-100" />
        <div className="absolute top-1.5 left-3 w-0.5 h-0.5 sm:top-3 sm:left-6 bg-white rounded-full animate-pulse delay-200" />
      </div>
    </button>
  );
};

// ─── Water Bubble Indicator ───────────────────────────────────────────────────
const WaterBubbleIndicator: React.FC<{
  targetRect: DOMRect | null;
  containerRect: DOMRect | null;
  isVisible: boolean;
}> = ({ targetRect, containerRect, isVisible }) => {
  const [bubbleStyle, setBubbleStyle] = useState({ left: 0, width: 0, top: 0, height: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const animFrameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const DURATION = 480;

  const easeSlime = (t: number) => {
    const c4 = (2 * Math.PI) / 3.2;
    if (t === 0) return 0;
    if (t === 1) return 1;
    return Math.pow(2, -9 * t) * Math.sin((t * 10 - 0.5) * c4) + 1;
  };

  useEffect(() => {
    if (!targetRect || !containerRect || !isVisible) return;
    const next = {
      left: targetRect.left - containerRect.left,
      width: targetRect.width,
      top: targetRect.top - containerRect.top,
      height: targetRect.height,
    };
    if (bubbleStyle.width === 0) { setBubbleStyle(next); return; }
    const from = { ...bubbleStyle };
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    startTimeRef.current = 0;
    setIsAnimating(true);
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const t = Math.min(elapsed / DURATION, 1);
      const eased = easeSlime(t);
      setBubbleStyle({
        left: from.left + (next.left - from.left) * eased,
        width: from.width + (next.width - from.width) * eased,
        top: from.top + (next.top - from.top) * eased,
        height: from.height + (next.height - from.height) * eased,
      });
      if (t < 1) { animFrameRef.current = requestAnimationFrame(animate); }
      else { setBubbleStyle(next); setIsAnimating(false); }
    };
    animFrameRef.current = requestAnimationFrame(animate);
    return () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetRect, containerRect, isVisible]);

  if (!isVisible || bubbleStyle.width === 0) return null;
  const scaleX = isAnimating ? 1.08 : 1;
  const scaleY = isAnimating ? 0.85 : 1;

  return (
    <div
      style={{
        position: "absolute",
        left: bubbleStyle.left,
        top: bubbleStyle.top,
        width: bubbleStyle.width,
        height: bubbleStyle.height,
        pointerEvents: "none",
        zIndex: 10,
        transform: `scale(${scaleX}, ${scaleY})`,
        transformOrigin: "center center",
        background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.0) 100%)",
        boxShadow: `
          inset 2px 3px 6px rgba(255,255,255,0.6),
          inset -3px -4px 8px rgba(0,0,0,0.15),
          inset 0 0 10px rgba(0,150,255,0.1),
          0 6px 15px rgba(0,0,0,0.1)
        `,
        border: "1px solid rgba(255,255,255,0.3)",
        animation: "waterWobble 4s ease-in-out infinite",
      }}
    >
      <div style={{ position:"absolute", top:"12%", left:"15%", width:"30%", height:"20%", background:"radial-gradient(ellipse at center, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 70%)", borderRadius:"50%", transform:"rotate(-15deg)" }} />
      <div style={{ position:"absolute", bottom:"15%", right:"15%", width:"20%", height:"15%", background:"radial-gradient(ellipse at center, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)", borderRadius:"50%", transform:"rotate(-15deg)" }} />
      <style>{`@keyframes waterWobble { 0%,100%{border-radius:40px 50px 40px 50px} 33%{border-radius:50px 40px 50px 40px} 66%{border-radius:45px 45px 45px 45px} }`}</style>
    </div>
  );
};

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