// OrdersHeader.tsx
import { FaDownload, FaMoneyBillWave, FaMoneyCheck } from "react-icons/fa";
import { FaSpinner } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";

interface OrdersHeaderProps {
  ordersCount: number;
  refetch: () => void;
  handlePayAllOrders: () => void;
  payAllLoading: boolean;
  isRefetching: boolean;
}

export function OrdersHeader({
  ordersCount,
  refetch,
  handlePayAllOrders,
  payAllLoading,
  isRefetching,
}: OrdersHeaderProps) {
  const { resolvedTheme } = useTheme();

  // Button style for blue buttons with light transparent blue bg on dark mode
  const buttonBase =
    "px-3 py-2 md:px-4 md:py-2 text-sm md:text-base rounded-md transition-all duration-300 shadow-md flex items-center gap-2 font-medium";
  const buttonBlue =
    resolvedTheme === "dark"
      ? "bg-blue-600/20 text-blue-200 border border-blue-500 hover:bg-blue-600/40 hover:text-blue-100 hover:border-blue-300 shadow-none"
      : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-300/50";

  return (
    <div className="flex justify-between items-start md:items-center mb-4 gap-4 md:gap-0">
      <div className="w-full flex justify-start gap-2 md:gap-4 items-center">
        <div
          className={`w-max first:text-sm py-1 rounded-lg transition-colors duration-200 ${
            resolvedTheme === "dark" ? "text-blue-400" : "text-blue-700"
          }`}
        >
          Total Orders: {ordersCount}
        </div>

        <button
          onClick={() => refetch()}
          className={`${buttonBase} ${buttonBlue}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 md:h-4 md:w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {isRefetching ? "Refetching..." : "Refetch"}
        </button>
      </div>
      <div className="w-full flex justify-end">
        <button
          onClick={handlePayAllOrders}
          className={`w-fit md:w-auto px-5 py-2 md:px-4 md:py-2 rounded-md transition-all duration-300 shadow-md flex items-center justify-center gap-2 font-medium ${
            resolvedTheme === "dark"
              ? "bg-blue-600/20 text-blue-200 border border-blue-500 hover:bg-blue-600/40 hover:text-blue-100 hover:border-blue-300 shadow-none"
              : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-300/50"
          } text-sm md:text-base`}
          disabled={payAllLoading}
        >
          {payAllLoading ? (
            <>
              <FaSpinner className="animate-spin -ml-1 mr-2 h-3 w-3 md:h-4 md:w-4 text-inherit" />
              Paying...
            </>
          ) : (
            <>
              <FaMoneyCheck className="w-3 h-3 md:w-4 md:h-4" />
              Pay All
            </>
          )}
        </button>
      </div>
    </div>
  );
}
