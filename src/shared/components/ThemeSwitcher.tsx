import { useEffect, useState } from "react";

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
            ? "linear-gradient(135deg, #1a0800 0%, #2e0e00 100%)"   // Noir brique — palette dark bg
            : "linear-gradient(135deg, #fde8d8 0%, #f8c4a0 100%)",  // Sable orangé — palette light bg
        }}
        aria-label="Toggle theme"
      >
        {/* Glow de fond */}
        <div
          className="absolute inset-0 rounded-full opacity-60 blur-sm transition-all duration-300"
          style={{
            background: isDark
              ? "linear-gradient(135deg, #a83b00 0%, #d94f00 100%)"  // Brique → rouge-orange
              : "linear-gradient(135deg, #f09000 0%, #d94f00 100%)", // Ambre → rouge
          }}
        />
  
        {/* Bouton curseur */}
        <div
          className={`absolute top-0.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full shadow-lg transition-all duration-500 ease-out flex items-center justify-center ${
            isDark ? "translate-x-6 sm:translate-x-7 md:translate-x-9" : "translate-x-0.5 sm:translate-x-1"
          }`}
          style={{
            background: isDark ? "#fff5ec" : "#ffffff",
            boxShadow: isDark
              ? "0 0 14px rgba(217, 79, 0, 0.7), 0 4px 8px rgba(0,0,0,0.4)"   // Glow rouge-orange
              : "0 0 14px rgba(240, 144, 0, 0.5), 0 4px 8px rgba(0,0,0,0.15)", // Glow ambre
          }}
        >
          <div className={`transition-all duration-500 ${isDark ? "rotate-0" : "rotate-0"}`}>
            {isDark ? (
              // 🌑 Lune — couleur brique/orange pour rester dans la palette
              <svg width="10" height="10" className="sm:w-3 sm:h-3 md:w-3.5 md:h-3.5" viewBox="0 0 24 24" fill="none">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#d94f00" />
              </svg>
            ) : (
              // ☀️ Soleil — ambre chaud
              <svg width="10" height="10" className="sm:w-3 sm:h-3 md:w-3.5 md:h-3.5" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="4" fill="#f09000" />
                <path
                  d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41"
                  stroke="#f09000"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </div>
        </div>
  
        {/* Étincelles/braises en mode sombre (remplacent les étoiles bleues) */}
        <div className={`absolute inset-0 transition-opacity duration-500 ${isDark ? "opacity-100" : "opacity-0"}`}>
          <div
            className="absolute top-1 left-1.5 w-0.5 h-0.5 sm:top-1.5 sm:left-2 sm:w-1 sm:h-1 rounded-full animate-pulse"
            style={{ background: "#f09000" }}
          />
          <div
            className="absolute top-2.5 left-2.5 w-0.5 h-0.5 sm:top-4 sm:left-4 rounded-full animate-pulse"
            style={{ background: "#f06830", animationDelay: "150ms" }}
          />
          <div
            className="absolute top-1.5 left-4 w-0.5 h-0.5 sm:top-2.5 sm:left-6 rounded-full animate-pulse"
            style={{ background: "#d94f00", animationDelay: "300ms" }}
          />
        </div>
      </button>
    );
  };

export default ThemeSwitcher;