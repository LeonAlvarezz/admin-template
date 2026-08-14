import { useEffect, useState } from "react";

type THEME = "dark" | "light" | "system";

const getSafeTheme = (value: string | null): THEME => {
  return value === "dark" || value === "light" ? value : "system";
};

export const useTheme = () => {
  const [theme, setTheme] = useState<THEME>(() =>
    getSafeTheme(localStorage.getItem("theme")),
  );

  useEffect(() => {
    localStorage.setItem("theme", theme);

    const root = document.documentElement;
    const isDark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    root.classList.toggle("dark", isDark);
  }, [theme]);

  return { theme, setTheme };
};
