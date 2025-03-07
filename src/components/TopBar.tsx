"use client";
import { useAdminBalance, useAdminDetails } from "@/hooks/useAccount";
import { usePathname } from "next/navigation";

export const TopBar = () => {
  const pathname = usePathname();
  const { data: adminDetails } = useAdminDetails();
  const { data: adminBalance } = useAdminBalance();
  return (
    <header className="fixed top-0 right-0 left-64 bg-white border-b border-gray-200 p-4 z-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">
            {pathname === "/"
              ? "Dashboard"
              : pathname.split("/")[1].charAt(0).toUpperCase() +
                pathname.split("/")[1].slice(1)}
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <div>
            Balance:{" "}
            <span className="font-semibold">
              {adminBalance?.walletBalance || "0.00"} {adminBalance?.coin}
            </span>
          </div>
          <div className="flex items-center font-semibold">
            <span className="text-lg text-gray-700 mr-2">
              {adminDetails?.nickName || "User"}
            </span>
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-sm">
                {adminDetails?.nickName?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
