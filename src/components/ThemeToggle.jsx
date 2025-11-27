"use client";

import { useTheme } from "next-themes";
import { FiSun, FiMoon } from "react-icons/fi";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative flex items-center justify-center w-9 h-9 rounded-full border border-green-600 dark:border-emerald-400  hover:shadow-lg hover:shadow-emerald-200/40 dark:hover:shadow-emerald-900/50 bg-white dark:bg-[#0f1f17] "
    >
      {theme === "light" ? (
        <FiMoon className="text-2xl text-emerald-600 " />
      ) : (
        <FiSun className="text-xl text-amber-300  " />
      )}

      <span className="absolute inset-0 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 blur-sm -z-10 opacity-0 hover:opacity-100 " />
    </button>
  );
}
