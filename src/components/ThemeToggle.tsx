"use client";

import { useTheme } from "@/context/ThemeContext";
import { HiSun, HiMoon, HiComputerDesktop } from "react-icons/hi2";
import { useState } from "react";

export const ThemeToggle = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { value: "light", label: "Light", icon: HiSun },
    { value: "dark", label: "Dark", icon: HiMoon },
    { value: "system", label: "System", icon: HiComputerDesktop },
  ] as const;

  const currentTheme = themes.find((t) => t.value === theme);
  const CurrentIcon = currentTheme?.icon || HiComputerDesktop;

  return (
    <div className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center space-x-2 p-3 rounded-lg hover:bg-sidebar-light-hover dark:hover:bg-sidebar-dark-hover transition-colors duration-200"
        title={`Current theme: ${currentTheme?.label}`}
      >
        <CurrentIcon className="h-5 w-5 text-blue-600 dark:text-sidebar-dark-textSecondary" />
        <span className="text-sm font-medium text-blue-600 md:text-sidebar-light-textSecondary dark:text-sidebar-dark-textSecondary">
          {currentTheme?.label}
        </span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 md:bottom-full md:left-0 mb-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 z-20">
            {themes.map((themeOption) => {
              const Icon = themeOption.icon;
              const isActive = theme === themeOption.value;

              return (
                <button
                  key={themeOption.value}
                  onClick={() => {
                    setTheme(themeOption.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-200 ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{themeOption.label}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
