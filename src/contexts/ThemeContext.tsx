"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = "light" | "dark" | "system";

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const initialState: ThemeProviderState = {
  theme: "light", // Default to light: the appearance before theme options were added
  setTheme: () => null,
};

const ThemeContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "light", // Default to light: the appearance before theme options were added
  storageKey = "vite-ui-theme", 
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedTheme = window.localStorage.getItem(storageKey) as Theme | null;
        if (storedTheme) {
          return storedTheme;
        }
      } catch (e) {
        // If localStorage is unavailable or reading fails, proceed to default
        console.error("Error reading theme from localStorage", e);
      }
    }
    return defaultTheme;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    let effectiveTheme = theme;
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      effectiveTheme = systemTheme;
    }

    root.classList.add(effectiveTheme);
    
    // Persist the user's explicit choice (light, dark, or system) to localStorage
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(storageKey, theme);
      }
    } catch (e) {
      console.error("Error saving theme to localStorage", e);
    }
  }, [theme, storageKey]); // Depend on theme and storageKey

  // This effect listens for changes in the system's preferred color scheme
  // and updates the UI ONLY IF the current theme is set to "system".
  useEffect(() => {
    if (theme !== "system" || typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      // This will trigger the main useEffect above because it changes the class on root
      // The main useEffect will then re-evaluate the effectiveTheme and apply it.
      // No need to call setTheme() here as it would override user's "system" preference.
      const systemTheme = mediaQuery.matches ? "dark" : "light";
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(systemTheme);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]); // Only re-subscribe if the theme preference changes to/from "system"

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      setTheme(newTheme);
    },
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
