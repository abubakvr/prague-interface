"use client";
import {
  useAdminBalance,
  useAdminBankBalance,
  useAdminDetails,
} from "@/hooks/useAccount";
import { useGetOrders } from "@/hooks/useGetBuyDetails";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

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
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <header className="fixed top-0 right-0 left-64 bg-white border-b border-blue-100 p-4 z-10 shadow-sm">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-blue-900">{pageTitle}</h1>
        </div>
        <div className="flex items-center space-x-3">
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
      </div>
    </header>
  );
};
