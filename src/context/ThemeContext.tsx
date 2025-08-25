"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
  forceRefresh: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_KEY = "theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
  const [isInitialized, setIsInitialized] = useState(false);

  // Function to apply theme to document
  const applyTheme = useCallback((currentTheme: Theme) => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;
    const body = document.body;

    // Remove existing dark class first
    root.classList.remove("dark");

    if (currentTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      setResolvedTheme(systemTheme);
      if (systemTheme === "dark") {
        root.classList.add("dark");
      }
      // Set data attribute on body for debugging
      body.setAttribute("data-theme", systemTheme);
    } else {
      setResolvedTheme(currentTheme);
      if (currentTheme === "dark") {
        root.classList.add("dark");
      }
      // Set data attribute on body for debugging
      body.setAttribute("data-theme", currentTheme);
    }

    // Debug logging
    console.log("Theme applied:", {
      theme: currentTheme,
      resolvedTheme:
        currentTheme === "system"
          ? window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
          : currentTheme,
      hasDarkClass: root.classList.contains("dark"),
      bodyBackground: getComputedStyle(document.body).backgroundColor,
      bodyDataTheme: body.getAttribute("data-theme"),
    });
  }, []);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem(THEME_KEY) as Theme;
      console.log("Initializing theme from localStorage:", storedTheme);

      if (storedTheme && ["light", "dark", "system"].includes(storedTheme)) {
        setThemeState(storedTheme);
        console.log("Setting theme state to:", storedTheme);
      } else {
        console.log("No stored theme found, using system");
        setThemeState("system");
      }
      setIsInitialized(true);
    }
  }, []);

  // Apply theme to document whenever theme changes
  useEffect(() => {
    if (isInitialized) {
      console.log("Theme changed, applying:", theme);
      applyTheme(theme);
    }
  }, [theme, applyTheme, isInitialized]);

  // Force apply theme on mount to ensure it's properly set
  useEffect(() => {
    if (typeof window !== "undefined" && isInitialized) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        console.log("Force applying theme on mount:", theme);
        applyTheme(theme);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isInitialized, theme, applyTheme]); // Include theme and applyTheme in dependencies

  // Listen for window focus to restore theme (useful for auth state changes)
  useEffect(() => {
    if (typeof window === "undefined" || !isInitialized) return;

    const handleFocus = () => {
      console.log("Window focused, checking theme state");
      const currentStoredTheme = localStorage.getItem(THEME_KEY) as Theme;
      if (currentStoredTheme && currentStoredTheme !== theme) {
        console.log(
          "Theme mismatch detected, restoring from localStorage:",
          currentStoredTheme
        );
        setThemeState(currentStoredTheme);
      } else {
        console.log("Theme state consistent, applying current theme:", theme);
        applyTheme(theme);
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [isInitialized, theme, applyTheme]);

  // Periodic theme state check to ensure consistency
  useEffect(() => {
    if (typeof window === "undefined" || !isInitialized) return;

    const interval = setInterval(() => {
      const root = document.documentElement;
      const body = document.body;
      const hasDarkClass = root.classList.contains("dark");
      const bodyTheme = body.getAttribute("data-theme");
      const currentStoredTheme = localStorage.getItem(THEME_KEY) as Theme;

      // Check if there's a mismatch between DOM state and theme state
      if (currentStoredTheme === "dark" && !hasDarkClass) {
        console.log(
          "Theme state mismatch detected: should be dark but DOM doesn't have dark class"
        );
        applyTheme(currentStoredTheme);
      } else if (currentStoredTheme === "light" && hasDarkClass) {
        console.log(
          "Theme state mismatch detected: should be light but DOM has dark class"
        );
        applyTheme(currentStoredTheme);
      } else if (currentStoredTheme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light";
        if (
          (systemTheme === "dark" && !hasDarkClass) ||
          (systemTheme === "light" && hasDarkClass)
        ) {
          console.log("System theme mismatch detected, reapplying");
          applyTheme(currentStoredTheme);
        }
      }
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, [isInitialized, theme, applyTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === "system") {
        console.log("System theme changed:", e.matches ? "dark" : "light");
        setResolvedTheme(e.matches ? "dark" : "light");
        const root = document.documentElement;
        root.classList.toggle("dark", e.matches);

        // Update body data attribute
        const body = document.body;
        body.setAttribute("data-theme", e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  // Force refresh theme - useful for authentication state changes
  const forceRefresh = useCallback(() => {
    console.log(
      "Force refreshing theme:",
      theme,
      "isInitialized:",
      isInitialized
    );
    if (isInitialized) {
      applyTheme(theme);
    } else {
      console.log("Theme not initialized yet, scheduling refresh");
      setTimeout(() => {
        if (isInitialized) {
          console.log("Executing delayed theme refresh:", theme);
          applyTheme(theme);
        }
      }, 200);
    }
  }, [theme, applyTheme, isInitialized]);

  const setTheme = useCallback((newTheme: Theme) => {
    console.log("Setting theme to:", newTheme);
    setThemeState(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
  }, []);

  const value = {
    theme,
    setTheme,
    resolvedTheme,
    forceRefresh,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
