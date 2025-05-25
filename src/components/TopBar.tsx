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

export const TopBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: adminDetails } = useAdminDetails();
  const { data: adminBalance } = useAdminBalance();
  const { data: adminBankBalance } = useAdminBankBalance();
  const { data: pendingOrders } = useGetOrders({
    page: 1,
    size: 30,
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Navigation links for mobile menu
  const navigationLinks = [
    { href: "/dashboard", label: "Dashboard", routeKey: "/dashboard" },
    {
      href: "/paid-orders",
      label: "Paid Orders",
      routeKey: "/paid-orders",
    },
    { href: "/paying", label: "Pay Orders", routeKey: "/paying" },
    { href: "/selling", label: "Release Coins", routeKey: "/selling" },
    { href: "/ads", label: "My Ads", routeKey: "/ads" },
    { href: "/onlineads", label: "P2P Ads", routeKey: "/onlineads" },
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
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }

      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      // Call the logout API route with the full URL
      await fetch(`${window.location.origin}/api/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Clear localStorage if you're also using that
      localStorage.removeItem("accessToken");

      // Redirect to login page using router.replace instead of push
      // and use the relative path
      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Calculate page title separately for clarity
  const pageTitle =
    pathname === "/"
      ? "Dashboard"
      : pathname.split("/")[1].charAt(0).toUpperCase() +
        pathname.split("/")[1].slice(1);

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 bg-white border-b border-blue-100 p-4 z-10 shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center justify-between">
          {/* Mobile menu button */}
          <div className="flex items-center">
            <button
              className="lg:hidden mr-3 text-blue-900"
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
            <h1 className="text-md font-semibold text-blue-900">{pageTitle}</h1>
          </div>
        </div>

        {/* Desktop view stats */}
        <div className="hidden md:flex items-center space-x-3">
          <div className="text-blue-800">
            Pending Orders:{" "}
            <span className="font-semibold">
              {pendingOrders?.length ?? "..."}
            </span>
          </div>
          <div>|</div>
          <div className="text-blue-800">
            Bank Balance:{" "}
            <span className="font-semibold text-blue-900">
              {new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: "NGN",
                minimumFractionDigits: 0, // Adjust if kobo is needed
                maximumFractionDigits: 2,
              }).format(Number(adminBankBalance || 0) / 100)}
            </span>
          </div>
          <div>|</div>
          <div className="text-blue-800">
            {adminBalance?.coin} Balance:{" "}
            <span className="font-semibold text-blue-900">
              {adminBalance?.walletBalance || "0.00"}
            </span>
          </div>
          <div>|</div>
          <div
            className="flex items-center font-semibold relative"
            ref={dropdownRef}
          >
            <span className="text-lg text-blue-800 mr-2">
              {adminDetails?.nickName || "User"}
            </span>
            <div
              className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center cursor-pointer hover:bg-blue-200 transition-colors duration-200"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="text-sm text-blue-900">
                {adminDetails?.nickName?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-blue-100">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-blue-800 hover:bg-blue-50 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex md:hidden items-center space-x-1 text-sm">
          <div className="text-blue-800">
            <span className="font-semibold">
              {pendingOrders?.length ?? "0"}
            </span>
          </div>
          <div>|</div>
          <div className="text-blue-800">
            <span className="font-semibold text-blue-900">
              {new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: "NGN",
                minimumFractionDigits: 0, // Adjust if kobo is needed
                maximumFractionDigits: 2,
              }).format(Number(adminBankBalance || 0) / 100)}
            </span>
          </div>
          <div>|</div>
          <div className="text-blue-800">
            <span className="font-semibold text-blue-900">
              {adminBalance?.walletBalance || "0.00"}
            </span>
          </div>
        </div>

        {/* Mobile user icon */}
        <div className="md:hidden flex items-center" ref={dropdownRef}>
          <div
            className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center cursor-pointer hover:bg-blue-200 transition-colors duration-200"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span className="text-sm text-blue-900">
              {adminDetails?.nickName?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>

          {isDropdownOpen && (
            <div className="absolute right-4 top-14 w-48 bg-white rounded-md shadow-lg py-1 z-30 border border-blue-100">
              <div className="px-4 py-2 border-b border-gray-100">
                <span className="block text-sm font-medium text-blue-800">
                  {adminDetails?.nickName || "User"}
                </span>
              </div>
              <div className="px-4 py-2 text-xs text-blue-800">
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
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-blue-800 hover:bg-blue-50 transition-colors duration-200 border-t border-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden fixed top-16 left-0 w-64 h-screen bg-blue-900 p-4 text-white shadow-lg z-20"
        >
          <ul className="space-y-2 mt-4">
            {navigationLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block p-2 rounded transition-colors duration-200 hover:bg-blue-700 ${
                    pathname.startsWith(link.routeKey)
                      ? "bg-blue-800 border-l-4 border-blue-300"
                      : ""
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
  );
};
