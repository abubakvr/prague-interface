"use client";
import { useAdminBalance, useAdminDetails } from "@/hooks/useAccount";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export const TopBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: adminDetails } = useAdminDetails();
  const { data: adminBalance } = useAdminBalance();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
      // Call the logout API route
      await fetch("/api/logout");

      // Clear localStorage if you're also using that
      localStorage.removeItem("accessToken");

      // Redirect to login page
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="fixed top-0 right-0 left-64 bg-white border-b border-blue-100 p-4 z-10 shadow-sm">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-blue-900">
            {pathname === "/"
              ? "Dashboard"
              : pathname.split("/")[1].charAt(0).toUpperCase() +
                pathname.split("/")[1].slice(1)}
          </h1>
        </div>
        <div className="flex items-center space-x-6">
          <div className="text-blue-800">
            Balance:{" "}
            <span className="font-semibold text-blue-900">
              {adminBalance?.walletBalance || "0.00"} {adminBalance?.coin}
            </span>
          </div>
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
