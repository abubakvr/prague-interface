"use client";
import { useAdminBalance, useAdminDetails } from "@/hooks/useAccount";
import {
  HiUser,
  HiCreditCard,
  HiChartBar,
  HiCurrencyDollar,
  HiShieldCheck,
  HiCheckCircle,
  HiClock,
  HiMail,
  HiRefresh,
  HiExclamationCircle,
} from "react-icons/hi";

export default function Home() {
  const {
    data: adminDetails,
    isLoading: adminDetailLoading,
    error: adminDetailError,
    refetch: fetchAdminDetails,
  } = useAdminDetails();
  const {
    data: adminBalance,
    isLoading: adminBalanceLoading,
    error: adminBalanceError,
    refetch: fetchAdminBalance,
  } = useAdminBalance();

  const refetchPageData = () => {
    fetchAdminBalance();
    fetchAdminDetails();
  };

  if (adminDetailLoading || adminBalanceLoading) {
    return (
      <div className="w-full flex flex-col gap-y-5 h-screen items-center text-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 border-blue-600"></div>
        <p className="text-blue-800 font-medium">Loading dashboard data...</p>
      </div>
    );
  }

  if (adminDetailError || adminBalanceError) {
    return (
      <div className="w-full flex flex-col h-screen items-center text-center gap-4 justify-center p-4">
        <HiExclamationCircle className="text-red-600 text-4xl sm:text-5xl" />
        <p className="text-red-600 text-sm sm:text-base">
          Error loading dashboard: {adminDetailError?.message}
        </p>
        <button
          onClick={refetchPageData}
          className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300 shadow-lg flex items-center gap-2"
        >
          <HiRefresh className="text-lg sm:text-xl" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-xl p-4 sm:p-6 shadow-lg text-white">
        <h1 className="text-xl sm:text-2xl font-bold mb-2">
          Welcome back, {adminDetails?.nickName || "Trader"}!
        </h1>
        <p className="opacity-90 text-sm sm:text-base">
          Your trading dashboard is ready with the latest updates.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-100 p-4 sm:p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg border border-emerald-200">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-emerald-800">
              Balance
            </h2>
            <div className="p-2 sm:p-3 bg-emerald-200 rounded-full">
              <HiCurrencyDollar className="text-emerald-700 text-lg sm:text-xl" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-emerald-900">
            {adminBalance?.walletBalance || "0.00"}{" "}
            <span className="text-emerald-700 text-xl sm:text-2xl">
              {adminBalance?.coin}
            </span>
          </p>
          <p className="text-emerald-700 mt-2 text-xs sm:text-sm">
            Available for trading
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg border border-blue-200">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-blue-800">
              Orders
            </h2>
            <div className="p-2 sm:p-3 bg-blue-200 rounded-full">
              <HiChartBar className="text-blue-700 text-lg sm:text-xl" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-blue-900">
            {adminDetails?.totalFinishCount || "0"}
          </p>
          <p className="text-blue-700 mt-2 text-xs sm:text-sm">
            Total completed orders
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-100 p-4 sm:p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg border border-purple-200 sm:col-span-2 lg:col-span-1">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-purple-800">
              Completion Rate
            </h2>
            <div className="p-2 sm:p-3 bg-purple-200 rounded-full">
              <HiCheckCircle className="text-purple-700 text-lg sm:text-xl" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-purple-900">
            {adminDetails?.recentRate || "0"}%
          </p>
          <p className="text-purple-700 mt-2 text-xs sm:text-sm">
            Recent success rate
          </p>
        </div>
      </div>

      {/* Detailed Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-blue-500">
          <div className="flex items-center mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-blue-100 rounded-full mr-2 sm:mr-3">
              <HiUser className="text-blue-600 text-lg sm:text-xl" />
            </div>
            <h2 className="text-lg sm:text-xl font-medium text-gray-800">
              Admin Info
            </h2>
          </div>
          <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
            <div className="flex items-center">
              <p className="font-medium text-gray-600 w-20 sm:w-24">Name:</p>
              <p className="text-gray-800">{adminDetails?.nickName || "N/A"}</p>
            </div>
            <div className="flex items-center">
              <p className="font-medium text-gray-600 w-20 sm:w-24">ID:</p>
              <p className="text-gray-800 break-all">
                {adminDetails?.userId || "N/A"}
              </p>
            </div>
            <div className="flex items-center">
              <p className="font-medium text-gray-600 w-20 sm:w-24">Email:</p>
              <div className="flex items-center overflow-hidden">
                <HiMail className="text-gray-500 mr-1 flex-shrink-0" />
                <p className="text-gray-800 truncate">
                  {adminDetails?.email || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-green-500">
          <div className="flex items-center mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-green-100 rounded-full mr-2 sm:mr-3">
              <HiShieldCheck className="text-green-600 text-lg sm:text-xl" />
            </div>
            <h2 className="text-lg sm:text-xl font-medium text-gray-800">
              Account Status
            </h2>
          </div>
          <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
            <div className="flex items-center">
              <p className="font-medium text-gray-600 w-20 sm:w-24">Status:</p>
              <span
                className={`px-2 py-0.5 rounded-full text-xs sm:text-sm ${
                  adminDetails?.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {adminDetails?.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="flex items-center">
              <p className="font-medium text-gray-600 w-20 sm:w-24">
                Account Age:
              </p>
              <div className="flex items-center">
                <HiClock className="text-gray-500 mr-1" />
                <p className="text-gray-800">
                  {adminDetails?.accountCreateDays || "N/A"} days
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <p className="font-medium text-gray-600 w-20 sm:w-24">Blocked:</p>
              <p className="text-gray-800">{adminDetails?.blocked || "N/A"}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-purple-500">
          <div className="flex items-center mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-purple-100 rounded-full mr-2 sm:mr-3">
              <HiChartBar className="text-purple-600 text-lg sm:text-xl" />
            </div>
            <h2 className="text-lg sm:text-xl font-medium text-gray-800">
              Trade Summary
            </h2>
          </div>
          <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
            <div className="flex items-center">
              <p className="font-medium text-gray-600 w-28 sm:w-32">
                Total Orders:
              </p>
              <p className="text-gray-800 font-semibold">
                {adminDetails?.totalFinishCount || "N/A"}
              </p>
            </div>
            <div className="flex items-center">
              <p className="font-medium text-gray-600 w-28 sm:w-32">
                30-day Orders:
              </p>
              <p className="text-gray-800 font-semibold">
                {adminDetails?.recentFinishCount || "N/A"}
              </p>
            </div>
            <div className="flex flex-wrap items-center">
              <p className="font-medium text-gray-600 w-28 sm:w-32 mb-1 sm:mb-0">
                Completion Rate:
              </p>
              <div className="flex items-center w-full sm:w-auto">
                <div className="w-full max-w-[120px] sm:max-w-[150px] bg-gray-200 rounded-full h-2 sm:h-2.5">
                  <div
                    className="bg-purple-600 h-2 sm:h-2.5 rounded-full"
                    style={{ width: `${adminDetails?.recentRate || 0}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-purple-700 font-medium text-xs sm:text-sm">
                  {adminDetails?.recentRate || "N/A"}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-amber-500 sm:col-span-2">
          <div className="flex items-center mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-amber-100 rounded-full mr-2 sm:mr-3">
              <HiCreditCard className="text-amber-600 text-lg sm:text-xl" />
            </div>
            <h2 className="text-lg sm:text-xl font-medium text-gray-800">
              Financial Summary
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-amber-50 p-3 sm:p-4 rounded-lg">
              <p className="font-medium text-gray-600 mb-1 text-sm">
                Recent Trade Amount:
              </p>
              <p className="text-xl sm:text-2xl font-bold text-amber-700 break-words">
                {adminDetails?.recentTradeAmount
                  ? parseFloat(adminDetails.recentTradeAmount).toLocaleString(
                      "en-NG",
                      {
                        style: "currency",
                        currency: "NGN",
                      }
                    )
                  : "N/A"}
              </p>
            </div>
            <div className="bg-amber-50 p-3 sm:p-4 rounded-lg">
              <p className="font-medium text-gray-600 mb-1 text-sm">
                Total Trade Amount:
              </p>
              <p className="text-xl sm:text-2xl font-bold text-amber-700 break-words">
                {adminDetails?.totalTradeAmount
                  ? parseFloat(adminDetails.totalTradeAmount).toLocaleString(
                      "en-US",
                      {
                        style: "currency",
                        currency: "USD",
                      }
                    )
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h2 className="text-xl font-medium">Current Balance</h2>
            <div className="p-3 bg-white bg-opacity-20 rounded-full">
              <HiCurrencyDollar className="text-white text-xl" />
            </div>
          </div>
          <p className="text-4xl font-bold">
            {adminBalance?.walletBalance || "0.00"} {adminBalance?.coin}
          </p>
          <div className="mt-4 pt-4 border-t border-white border-opacity-20">
            <p className="text-sm opacity-80">
              Available for trading and withdrawals
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
