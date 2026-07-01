"use client";

import { useTheme } from "./ThemeProvider";

import IonIcon from "./IonIcon";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      <IonIcon name={isDark ? "sunny-outline" : "moon-outline"} />
    </button>
  );
}
