"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HiCog } from "react-icons/hi";
import { SettingsModal } from "./SettingsModal";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "@/context/ThemeContext";

const navigationLinks = [
  { href: "/dashboard", label: "Dashboard", routeKey: "/dashboard" },
  { href: "/pay-orders", label: "Pay Orders", routeKey: "/pay-orders" },
  {
    href: "/payment-status",
    label: "Payment Status",
    routeKey: "/payment-status",
  },
  {
    href: "/transaction-history",
    label: "Transaction History",
    routeKey: "/transaction-history",
  },
  // { href: "/selling", label: "Release Coins", routeKey: "/selling" },
  // { href: "/ads", label: "My Ads", routeKey: "/ads" },
  // { href: "/onlineads", label: "P2P Ads", routeKey: "/onlineads" },
  // { href: "/agent", label: "Agent", routeKey: "/agent" },
];

export const SideBar = () => {
  const pathname = usePathname();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { resolvedTheme } = useTheme();

  const openSettings = () => {
    setIsSettingsOpen(true);
  };

  const closeSettings = () => {
    setIsSettingsOpen(false);
  };

  return (
    <>
      <nav
        className={`hidden lg:flex flex-col fixed top-0 left-0 h-screen w-64 p-4 text-white shadow-lg transition-colors duration-200 ${
          resolvedTheme === "dark"
            ? "bg-sidebar-dark-bg border-r border-sidebar-dark-border"
            : "bg-sidebar-light-bg border-r border-sidebar-light-border"
        }`}
      >
        <div className="flex items-center space-x-1 mt-3">
          <div className="w-8 h-8 relative">
            <Image
              src="/assets/logos/apex-logo.svg"
              alt="App Logo"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="text-xl font-bold text-sidebar-light-text dark:text-sidebar-dark-text">
            Boskify
          </h1>
        </div>

        <ul className="space-y-2 mt-8 flex-1">
          {navigationLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`block p-2 rounded transition-colors duration-200 ${
                  pathname.startsWith(link.routeKey)
                    ? resolvedTheme === "dark"
                      ? "bg-sidebar-dark-active border-l-4 border-sidebar-dark-border"
                      : "bg-sidebar-light-active border-l-4 border-sidebar-light-border"
                    : resolvedTheme === "dark"
                    ? "hover:bg-sidebar-dark-hover text-sidebar-dark-textSecondary hover:text-sidebar-dark-text"
                    : "hover:bg-sidebar-light-hover text-sidebar-light-textSecondary hover:text-sidebar-light-text"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Theme Toggle and Settings */}
        <div className="space-y-1 pt-3 border-t border-sidebar-light-border dark:border-sidebar-dark-border">
          {/* Theme Toggle */}
          <div className="flex justify-left w-full">
            <ThemeToggle />
          </div>

          {/* Settings Button */}
          <button
            onClick={openSettings}
            className={`w-full flex items-center space-x-3 p-3 rounded transition-colors duration-200 ${
              resolvedTheme === "dark"
                ? "hover:bg-sidebar-dark-hover text-sidebar-dark-textSecondary hover:text-sidebar-dark-text"
                : "hover:bg-sidebar-light-hover text-sidebar-light-textSecondary hover:text-sidebar-light-text"
            }`}
          >
            <HiCog className="h-5 w-5" />
            <span className="font-medium">Settings</span>
          </button>
        </div>
      </nav>

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={closeSettings} />
    </>
  );
};
