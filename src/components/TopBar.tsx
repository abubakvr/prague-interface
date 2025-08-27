"use client";

import {
  useAdminBalance,
  useAdminBankBalance,
  useAdminDetails,
} from "@/hooks/useAccount";
import { useGetOrders } from "@/hooks/useGetBuyDetails";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { HiCog, HiUser } from "react-icons/hi";
import { SettingsModal } from "./SettingsModal";
import { useTheme } from "@/context/ThemeContext";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/context/AuthContext";

export const TopBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const { logout } = useAuth();
  const { data: adminDetails } = useAdminDetails();
  const { data: adminBalance } = useAdminBalance();
  const { data: adminBankBalance } = useAdminBankBalance();
  const { data: pendingOrders } = useGetOrders({
    page: 1,
    size: 30,
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Navigation links for mobile menu
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
    { href: "/settings", label: "Settings", routeKey: "/settings" },
    // { href: "/selling", label: "Release Coins", routeKey: "/selling" },
    // { href: "/ads", label: "My Ads", routeKey: "/ads" },
    // { href: "/onlineads", label: "P2P Ads", routeKey: "/onlineads" },
  ];

  // Effect to update document title with pending order count
  useEffect(() => {
    const baseTitle =
      pathname === "/"
        ? "Dashboard"
        : pathname.split("/")[1].charAt(0).toUpperCase() +
          pathname.split("/")[1].slice(1);

    const orderCount = pendingOrders?.length;

    if (orderCount !== undefined) {
      document.title = `(${orderCount}) ${baseTitle}`;
    }

    // Optional: Cleanup function to reset title on unmount if desired
    // return () => { document.title = "Admin Panel"; };
  }, [pathname, pendingOrders]); // Dependencies: update when path or orders change

  useEffect(() => {
    // Use 'mousedown' for outside click, but ignore if event.target is inside a dropdown button
    const handleClickOutside = (event: MouseEvent) => {
      // If the dropdown is not open, do nothing
      if (!isDropdownOpen) return;

      // If the click is inside the dropdown, do nothing
      if (
        (dropdownRef.current &&
          dropdownRef.current.contains(event.target as Node)) ||
        (mobileDropdownRef.current &&
          mobileDropdownRef.current.contains(event.target as Node))
      ) {
        return;
      }

      // If the click is inside the mobile menu, do nothing
      if (
        mobileMenuRef.current &&
        mobileMenuRef.current.contains(event.target as Node)
      ) {
        return;
      }

      // Otherwise, close dropdowns/menus
      setIsDropdownOpen(false);
      setIsMobileMenuOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Updated handleLogout function to use AuthContext
  const handleLogout = async (e: React.MouseEvent) => {
    console.log("handleLogout");

    e.preventDefault();
    e.stopPropagation();

    // Close dropdown first
    setIsDropdownOpen(false);

    try {
      // Call the logout API route with the full URL
      await fetch(`${window.location.origin}/api/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Use AuthContext logout function which handles theme refresh
      logout();

      // Redirect to login page using router.replace instead of push
      // and use the relative path
      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Fixed openSettings function
  const openSettings = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSettingsOpen(true);
    setIsDropdownOpen(false); // Close dropdown when opening settings
  };

  const closeSettings = () => {
    setIsSettingsOpen(false);
  };

  // Calculate page title separately for clarity
  const pageTitle =
    pathname === "/"
      ? "Dashboard"
      : pathname.split("/")[1].charAt(0).toUpperCase() +
        pathname.split("/")[1].slice(1);

  return (
    <>
      <header
        className={`fixed top-0 right-0 left-0 lg:left-64 border-b p-4 z-10 shadow-sm transition-colors duration-200 ${
          resolvedTheme === "dark"
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-blue-100"
        }`}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center justify-between">
            {/* Mobile menu button */}
            <div className="flex items-center">
              <button
                className={`lg:hidden mr-3 transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-slate-100" : "text-blue-900"
                }`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <h1
                className={`text-md font-semibold transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-slate-100" : "text-blue-900"
                }`}
              >
                {pageTitle}
              </h1>
            </div>
          </div>

          {/* Desktop view stats */}
          <div className="hidden md:flex items-center space-x-3">
            <div
              className={`transition-colors duration-200 ${
                resolvedTheme === "dark" ? "text-slate-300" : "text-blue-800"
              }`}
            >
              Pending Orders:{" "}
              <span className="font-semibold">
                {pendingOrders?.length ?? "..."}
              </span>
            </div>
            <div
              className={
                resolvedTheme === "dark" ? "text-slate-500" : "text-blue-800"
              }
            >
              |
            </div>
            <div
              className={`transition-colors duration-200 ${
                resolvedTheme === "dark" ? "text-slate-300" : "text-blue-800"
              }`}
            >
              Bank Balance:{" "}
              <span
                className={`font-semibold transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-slate-100" : "text-blue-900"
                }`}
              >
                {new Intl.NumberFormat("en-NG", {
                  style: "currency",
                  currency: "NGN",
                  minimumFractionDigits: 0, // Adjust if kobo is needed
                  maximumFractionDigits: 2,
                }).format(Number(adminBankBalance || 0) / 100)}
              </span>
            </div>
            <div
              className={
                resolvedTheme === "dark" ? "text-slate-500" : "text-blue-800"
              }
            >
              |
            </div>
            <div
              className={`hidden md:block transition-colors duration-200 ${
                resolvedTheme === "dark" ? "text-slate-300" : "text-blue-800"
              }`}
            >
              {adminBalance?.coin} Balance:{" "}
              <span
                className={`font-semibold transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-slate-100" : "text-blue-900"
                }`}
              >
                {adminBalance?.walletBalance || "0.00"}
              </span>
            </div>
            <div
              className={
                resolvedTheme === "dark" ? "text-slate-500" : "text-blue-800"
              }
            >
              |
            </div>
            <div
              className="flex items-center font-semibold relative"
              ref={dropdownRef}
            >
              <span
                className={`text-lg mr-2 transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-slate-300" : "text-blue-800"
                }`}
              >
                {adminDetails?.nickName || "User"}
              </span>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200 ${
                  resolvedTheme === "dark"
                    ? "bg-slate-600 hover:bg-slate-500"
                    : "bg-blue-100 hover:bg-blue-200"
                }`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <HiUser
                  className={`h-4 w-4 transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "text-slate-100"
                      : "text-blue-900"
                  }`}
                />
              </div>

              {isDropdownOpen && (
                <div
                  className={`absolute right-0 top-full mt-2 w-48 rounded-md shadow-lg py-1 z-20 border transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "bg-slate-700 border-slate-600"
                      : "bg-white border-blue-100"
                  }`}
                >
                  <button
                    onClick={openSettings}
                    className={`flex items-center space-x-2 w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${
                      resolvedTheme === "dark"
                        ? "text-slate-300 hover:bg-slate-600"
                        : "text-blue-800 hover:bg-blue-50"
                    }`}
                  >
                    <HiCog className="h-4 w-4" />
                    <span>Settings</span>
                  </button>
                  <div
                    className={`border-t my-1 transition-colors duration-200 ${
                      resolvedTheme === "dark"
                        ? "border-slate-600"
                        : "border-gray-100"
                    }`}
                  ></div>
                  <button
                    onClick={handleLogout}
                    className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${
                      resolvedTheme === "dark"
                        ? "text-slate-300 hover:bg-slate-600"
                        : "text-blue-800 hover:bg-blue-50"
                    }`}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
          <div
            className={`flex md:hidden space-x-2 items-center text-sm transition-colors duration-200 ${
              resolvedTheme === "dark" ? "text-slate-300" : "text-blue-800"
            }`}
          >
            <div>
              <span className="font-semibold">
                {pendingOrders?.length ?? "..."}
              </span>
            </div>
            <div>|</div>
            <div>
              <span className="font-semibold">
                {new Intl.NumberFormat("en-NG", {
                  style: "currency",
                  currency: "NGN",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                }).format(Number(adminBankBalance || 0) / 100)}
              </span>
            </div>
          </div>

          {/* Mobile user icon */}
          <div className="md:hidden flex items-center space-x-2">
            <div className="md:hidden flex mt-1">
              <ThemeToggle />
            </div>
            <div
              className="md:hidden flex items-center"
              ref={mobileDropdownRef}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200 ${
                  resolvedTheme === "dark"
                    ? "bg-slate-600 hover:bg-slate-500"
                    : "bg-blue-100 hover:bg-blue-200"
                }`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <HiUser
                  className={`h-4 w-4 transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "text-slate-100"
                      : "text-blue-900"
                  }`}
                />
              </div>

              {isDropdownOpen && (
                <div
                  className={`absolute right-4 top-14 w-48 rounded-md shadow-lg py-1 z-30 border transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "bg-slate-700 border-slate-600"
                      : "bg-white border-blue-100"
                  }`}
                >
                  <div
                    className={`px-4 py-2 border-b transition-colors duration-200 ${
                      resolvedTheme === "dark"
                        ? "border-slate-600"
                        : "border-gray-100"
                    }`}
                  >
                    <span
                      className={`block text-sm font-medium transition-colors duration-200 ${
                        resolvedTheme === "dark"
                          ? "text-slate-300"
                          : "text-blue-800"
                      }`}
                    >
                      {adminDetails?.nickName || "User"}
                    </span>
                  </div>
                  <div
                    className={`px-4 py-2 text-xs transition-colors duration-200 ${
                      resolvedTheme === "dark"
                        ? "text-slate-300"
                        : "text-blue-800"
                    }`}
                  >
                    <div className="mb-1">
                      Pending Orders:{" "}
                      <span className="font-semibold">
                        {pendingOrders?.length ?? "..."}
                      </span>
                    </div>
                    <div className="mb-1">
                      Bank Balance:{" "}
                      <span className="font-semibold">
                        {new Intl.NumberFormat("en-NG", {
                          style: "currency",
                          currency: "NGN",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 2,
                        }).format(Number(adminBankBalance || 0) / 100)}
                      </span>
                    </div>
                    <div className="mb-1">
                      {adminBalance?.coin} Balance:{" "}
                      <span className="font-semibold">
                        {adminBalance?.walletBalance || "0.00"}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={openSettings}
                    className={`hidden md:flex items-center space-x-2 w-full text-left px-4 py-2 text-sm transition-colors duration-200 border-t ${
                      resolvedTheme === "dark"
                        ? "text-slate-300 hover:bg-slate-600 border-slate-600"
                        : "text-blue-800 hover:bg-blue-50 border-gray-100"
                    }`}
                  >
                    <HiCog className="h-4 w-4" />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      router.push("/settings");
                      setIsDropdownOpen(false);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex md:hidden items-center space-x-2 w-full text-left px-4 py-2 text-sm transition-colors duration-200 border-t ${
                      resolvedTheme === "dark"
                        ? "text-slate-300 hover:bg-slate-600 border-slate-600"
                        : "text-blue-800 hover:bg-blue-50 border-gray-100"
                    }`}
                  >
                    <HiCog className="h-4 w-4" />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200 border-t ${
                      resolvedTheme === "dark"
                        ? "text-slate-300 hover:bg-slate-600 border-slate-600"
                        : "text-blue-800 hover:bg-blue-50 border-gray-100"
                    }`}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className={`md:hidden fixed top-16 left-0 w-64 h-screen p-4 shadow-lg z-20 transition-colors duration-200 ${
              resolvedTheme === "dark"
                ? "bg-slate-900 text-slate-100"
                : "bg-blue-900 text-white"
            }`}
          >
            <ul className="space-y-2 mt-4">
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block p-2 rounded transition-colors duration-200 ${
                      pathname.startsWith(link.routeKey)
                        ? resolvedTheme === "dark"
                          ? "bg-slate-800 border-l-4 border-slate-500"
                          : "bg-blue-800 border-l-4 border-blue-300"
                        : resolvedTheme === "dark"
                        ? "hover:bg-slate-800"
                        : "hover:bg-blue-700"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={closeSettings} />
    </>
  );
};
