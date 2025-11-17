import React, { useState, useEffect } from "react";
import { useScrollspy } from "../utils/useScrollspy";

const navItems = [
  { id: "hero", label: "Accueil" },
  { id: "about", label: "À propos" },
  { id: "skills", label: "Compétences" },
  { id: "education", label: "Education" },
  { id: "experience", label: "Expérience" },
  { id: "projects", label: "Projets" },
  { id: "contact", label: "Contact" },
];

// Composant ThemeSwitcher moderne et animé
const ThemeSwitcher = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme as 'light' | 'dark');
      document.documentElement.classList.add(savedTheme);
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
        document.documentElement.classList.add('dark');
      } else {
        setTheme('light');
      }
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="relative w-12 h-6 sm:w-14 sm:h-7 md:w-16 md:h-8 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
          : 'linear-gradient(135deg, #00f0ff 0%, #bf00ff 100%)'
      }}
      aria-label="Toggle theme"
    >
      {/* Track glow effect */}
      <div
        className="absolute inset-0 rounded-full opacity-50 blur-sm transition-opacity duration-300"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
            : 'linear-gradient(135deg, #00f0ff 0%, #bf00ff 100%)'
        }}
      />
    
      {/* Sliding knob */}
      <div
        className={`absolute top-0.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full shadow-lg transition-all duration-500 ease-out flex items-center justify-center ${
          isDark ? 'translate-x-6 sm:translate-x-7 md:translate-x-9' : 'translate-x-0.5 sm:translate-x-1'
        }`}
        style={{
          background: 'white',
          boxShadow: isDark
            ? '0 0 20px rgba(191, 0, 255, 0.5), 0 4px 8px rgba(0, 0, 0, 0.3)'
            : '0 0 20px rgba(0, 240, 255, 0.5), 0 4px 8px rgba(0, 0, 0, 0.2)'
        }}
      >
        {/* Icon container with rotation animation */}
        <div className={`transition-all duration-500 ${isDark ? 'rotate-0' : 'rotate-180'}`}>
          {isDark ? (
            // Moon icon
            <svg
              width="10"
              height="10"
              className="sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 text-indigo-600"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                fill="currentColor"
                className="transition-all duration-300"
              />
            </svg>
          ) : (
            // Sun icon
            <svg
              width="10"
              height="10"
              className="sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 text-yellow-500"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle cx="12" cy="12" r="4" fill="currentColor" />
              <path
                d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>
      </div>
    
      {/* Stars decoration (visible in dark mode) */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${isDark ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute top-1 left-1 w-0.5 h-0.5 sm:top-2 sm:left-2 sm:w-1 sm:h-1 bg-white rounded-full animate-pulse" />
        <div className="absolute top-2 left-2 w-0.5 h-0.5 sm:top-4 sm:left-4 bg-white rounded-full animate-pulse delay-100" />
        <div className="absolute top-1.5 left-3 w-0.5 h-0.5 sm:top-3 sm:left-6 bg-white rounded-full animate-pulse delay-200" />
      </div>
    </button>
  );
};

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const activeSection = useScrollspy(navItems.map((item) => item.id));

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 0;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
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
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("hero");
              }}
              className="text-lg xs:text-xl sm:text-2xl font-bold text-gradient hover:scale-105 transition-transform"
            >
              MSR
            </a>

            {/* Desktop Navigation */}
            <ul className="hidden md:flex items-center gap-1 lg:gap-2">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(item.id);
                    }}
                    className={`px-3 lg:px-4 py-2 rounded-lg transition-all duration-300 text-sm lg:text-base ${
                      activeSection === item.id
                        ? "text-primary bg-surface font-semibold"
                        : "text-text-secondary hover:text-primary hover:bg-surface"
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Right side: Theme Switcher + Mobile Menu */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Theme Switcher - visible on all screens */}
              <ThemeSwitcher />
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-1.5 xs:p-2 text-text-primary hover:text-primary transition-colors"
                aria-label="Toggle menu"
              >
                <svg
                  className="w-5 h-5 xs:w-6 xs:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
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
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute top-16 xs:top-20 right-3 xs:right-4 left-3 xs:left-4 glass-effect rounded-xl xs:rounded-2xl p-4 xs:p-6 shadow-xl">
            <ul className="flex flex-col gap-2 xs:gap-3">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(item.id);
                    }}
                    className={`block px-3 xs:px-4 py-2 xs:py-3 rounded-lg transition-all duration-300 text-sm xs:text-base ${
                      activeSection === item.id
                        ? "text-primary bg-surface font-semibold"
                        : "text-text-secondary hover:text-primary hover:bg-surface"
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};