"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HiCog } from "react-icons/hi";
import { SettingsModal } from "./SettingsModal";

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

  const openSettings = () => {
    setIsSettingsOpen(true);
  };

  const closeSettings = () => {
    setIsSettingsOpen(false);
  };

  return (
    <>
      <nav className="hidden lg:block fixed top-0 left-0 h-screen w-64 bg-blue-900 p-4 text-white shadow-lg flex-col">
        <div className="flex items-center space-x-1 mt-3">
          <div className="w-8 h-8 relative">
            <Image
              src="/assets/logos/apex-logo.svg"
              alt="App Logo"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="text-xl font-bold text-gray-00">Boskify</h1>
        </div>

        <ul className="space-y-2 mt-8 flex-1">
          {navigationLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`block p-2 rounded transition-colors duration-200 hover:bg-blue-700 ${
                  pathname.startsWith(link.routeKey)
                    ? "bg-blue-800 border-l-4 border-blue-300"
                    : ""
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Settings Button at Bottom */}
        <div className="mt-auto pt-4 border-t border-blue-700">
          <button
            onClick={openSettings}
            className="w-full flex items-center space-x-3 p-3 rounded transition-colors duration-200 hover:bg-blue-700 text-blue-100 hover:text-white"
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
