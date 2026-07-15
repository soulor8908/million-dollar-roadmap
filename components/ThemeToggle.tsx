"use client";
import { useState, useEffect } from "react";
import { getStoredTheme, setTheme, applyTheme, watchSystemTheme, type Theme } from "@/lib/theme";

export function ThemeToggle() {
  const [theme, setThemeState] = useState<Theme>("system");

  useEffect(() => {
    setThemeState(getStoredTheme());
    applyTheme(getStoredTheme());
    const unwatch = watchSystemTheme(() => {
      if (getStoredTheme() === "system") applyTheme("system");
    });
    return unwatch;
  }, []);

  function cycle() {
    const next: Theme = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
    setTheme(next);
    setThemeState(next);
  }

  const icon = theme === "light" ? "☀️" : theme === "dark" ? "🌙" : "🖥️";
  const label = theme === "light" ? "浅色" : theme === "dark" ? "深色" : "跟随系统";

  return (
    <button
      onClick={cycle}
      className="text-sm px-2 py-1 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-1"
      title={`当前：${label}（点击切换）`}
    >
      <span>{icon}</span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
