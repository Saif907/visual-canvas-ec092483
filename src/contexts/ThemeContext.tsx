import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type ThemeMode = "light" | "dark" | "system";

export interface ColorPreset {
  name: string;
  primary: string; // HSL values
  accent: string;
  preview: string; // hex for preview swatches
}

export const COLOR_PRESETS: ColorPreset[] = [
  { name: "Cyan", primary: "199 92% 69%", accent: "199 92% 48%", preview: "#68CDF9" },
  { name: "Blue", primary: "217 91% 60%", accent: "217 91% 50%", preview: "#4B83F0" },
  { name: "Purple", primary: "262 83% 58%", accent: "262 83% 48%", preview: "#7C3AED" },
  { name: "Rose", primary: "346 77% 50%", accent: "346 77% 40%", preview: "#E11D48" },
  { name: "Orange", primary: "25 95% 53%", accent: "25 95% 43%", preview: "#F97316" },
  { name: "Teal", primary: "168 76% 42%", accent: "168 76% 32%", preview: "#14B8A6" },
];

export const FONT_SIZES = [12, 14, 16, 18, 20];

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  preset: string;
  setPreset: (preset: string) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  resolvedMode: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getSystemTheme(): "light" | "dark" {
  if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: light)").matches) {
    return "light";
  }
  return "dark";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    return (localStorage.getItem("theme-mode") as ThemeMode) || "dark";
  });
  const [preset, setPreset] = useState(() => {
    return localStorage.getItem("theme-preset") || "Cyan";
  });
  const [fontSize, setFontSize] = useState(() => {
    return Number(localStorage.getItem("theme-font-size")) || 16;
  });

  const resolvedMode = mode === "system" ? getSystemTheme() : mode;

  // Apply mode class
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolvedMode);
    localStorage.setItem("theme-mode", mode);
  }, [mode, resolvedMode]);

  // Apply preset
  useEffect(() => {
    const p = COLOR_PRESETS.find((c) => c.name === preset) || COLOR_PRESETS[0];
    const root = document.documentElement;
    root.style.setProperty("--primary", p.primary);
    root.style.setProperty("--primary-foreground", resolvedMode === "dark" ? "213 22% 11%" : "0 0% 100%");
    root.style.setProperty("--accent", p.accent);
    root.style.setProperty("--ring", p.primary);
    root.style.setProperty("--sidebar-primary", p.primary);
    root.style.setProperty("--sidebar-primary-foreground", resolvedMode === "dark" ? "213 22% 11%" : "0 0% 100%");
    root.style.setProperty("--sidebar-accent", p.accent + " / 0.08");
    root.style.setProperty("--sidebar-accent-foreground", p.primary);
    root.style.setProperty("--sidebar-ring", p.primary);
    localStorage.setItem("theme-preset", preset);
  }, [preset, resolvedMode]);

  // Apply font size
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
    localStorage.setItem("theme-font-size", String(fontSize));
  }, [fontSize]);

  // Listen for system theme changes
  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: light)");
    const handler = () => {
      if (mode === "system") {
        const root = document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(getSystemTheme());
      }
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, setMode, preset, setPreset, fontSize, setFontSize, resolvedMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
