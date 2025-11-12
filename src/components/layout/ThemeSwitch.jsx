import { useState, useEffect } from "react";

export default function ThemeSwitch() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "system");

  // Wendet das gewählte Theme auf das <html>-Element an
  const applyTheme = (selectedTheme) => {
    if (selectedTheme === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
    } else {
      document.documentElement.setAttribute("data-theme", selectedTheme);
    }
  };

  // Reagiert, wenn der Nutzer das System-Theme ändert
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (localStorage.getItem("theme") === "system") {
        applyTheme("system");
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Wendet Theme bei Start & Änderungen an
  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-700 font-medium">Theme</span>
      <select
        className="select select-bordered select-sm w-28 bg-white/60 text-sm"
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
    </div>
  );
}
