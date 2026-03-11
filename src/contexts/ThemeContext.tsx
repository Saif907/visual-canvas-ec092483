import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type ThemeMode = "light" | "dark" | "system";
export type SkinId = "default" | "midnight-glass" | "carbon-terminal" | "soft-depth" | "obsidian-ember" | "void-flux";

export interface ColorPreset {
  name: string;
  primary: string;
  accent: string;
  preview: string;
}

export interface SkinInfo {
  id: SkinId;
  name: string;
  description: string;
  previewColors: [string, string, string]; // bg, card, accent
}

export const UI_SKINS: SkinInfo[] = [
  {
    id: "default",
    name: "Classic",
    description: "Clean modern design",
    previewColors: ["#161B22", "#1C2128", "#68CDF9"],
  },
  {
    id: "midnight-glass",
    name: "Midnight Glass",
    description: "Glassmorphism & neon glow",
    previewColors: ["#0A0A0F", "#14142266", "#A855F7"],
  },
  {
    id: "carbon-terminal",
    name: "Carbon Terminal",
    description: "Hacker minimal aesthetic",
    previewColors: ["#000000", "#0A0A0A", "#00FF88"],
  },
  {
    id: "soft-depth",
    name: "Soft Depth",
    description: "Premium layered warmth",
    previewColors: ["#141418", "#1E1E24", "#F5A623"],
  },
];

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
  skin: SkinId;
  setSkin: (skin: SkinId) => void;
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
  const [skin, setSkin] = useState<SkinId>(() => {
    return (localStorage.getItem("theme-skin") as SkinId) || "default";
  });

  const resolvedMode = mode === "system" ? getSystemTheme() : mode;

  // Apply mode class
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolvedMode);
    localStorage.setItem("theme-mode", mode);
  }, [mode, resolvedMode]);

  // Apply skin class
  useEffect(() => {
    const root = document.documentElement;
    // Remove all skin classes
    root.classList.remove("skin-midnight-glass", "skin-carbon-terminal", "skin-soft-depth");
    if (skin !== "default") {
      root.classList.add(`skin-${skin}`);
    }
    localStorage.setItem("theme-skin", skin);
  }, [skin]);

  // Apply preset (only for default skin)
  useEffect(() => {
    if (skin !== "default") return; // skins define their own colors
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
  }, [preset, resolvedMode, skin]);

  // Clear inline overrides when switching to a non-default skin
  useEffect(() => {
    if (skin === "default") return;
    const root = document.documentElement;
    const props = [
      "--primary", "--primary-foreground", "--accent", "--ring",
      "--sidebar-primary", "--sidebar-primary-foreground", "--sidebar-accent",
      "--sidebar-accent-foreground", "--sidebar-ring",
    ];
    props.forEach((p) => root.style.removeProperty(p));
  }, [skin]);

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
    <ThemeContext.Provider value={{ mode, setMode, preset, setPreset, fontSize, setFontSize, resolvedMode, skin, setSkin }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
