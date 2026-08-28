import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import Corner from "./Corner";

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme as "light" | "dark");
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else {
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

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="blueprint w-8 h-8 grid place-items-center border border-border text-text-secondary hover:text-primary hover:border-primary transition-colors"
    >
      <Corner />
      {theme === "dark" ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
    </button>
  );
};

export default ThemeSwitcher;
