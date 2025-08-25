"use client";
import {
  useAdminAccountName,
  useAdminAccountNumber,
  useAdminBalance,
  useAdminBankBalance,
  useAdminDetails,
  useWalletInfo,
} from "@/hooks/useAccount";
import { useOrderStats } from "@/hooks/useOrderStats";
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
  HiShoppingCart,
  HiTrendingUp,
} from "react-icons/hi";
import { useTheme } from "@/context/ThemeContext";

export default function Home() {
  const { resolvedTheme } = useTheme();
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

  const {
    data: adminAccountNumber,
    isLoading: adminAccountNumberLoading,
    refetch: fetchAccountNumber,
  } = useAdminAccountNumber();

  const {
    data: adminAccountName,
    isLoading: adminAccountNameLoading,
    refetch: fetchAccountName,
  } = useAdminAccountName();

  const {
    data: adminBankBalance,
    isLoading: adminBankBalanceLoading,
    refetch: fetchAdminBankBalance,
  } = useAdminBankBalance();

  const {
    data: walletInfo,
    isLoading: walletInfoLoading,
    refetch: fetchWalletInfo,
  } = useWalletInfo();

  const {
    userDailyStats,
    userTotalStats,
    user30DayStats,
    isLoading: orderStatsLoading,
    error: orderStatsError,
    refetch: fetchOrderStats,
  } = useOrderStats();

  const refetchPageData = () => {
    fetchAdminBalance();
    fetchAdminDetails();
    fetchAccountNumber();
    fetchAdminBankBalance();
    fetchAccountName();
    fetchWalletInfo();
    fetchOrderStats();
  };

  if (
    adminDetailLoading ||
    adminBalanceLoading ||
    adminAccountNumberLoading ||
    adminBankBalanceLoading ||
    adminAccountNameLoading ||
    walletInfoLoading ||
    orderStatsLoading
  ) {
    return (
      <div className="w-full flex flex-col gap-y-5 h-screen items-center text-center  mt-16 p-4">
        <div
          className={`animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 transition-colors duration-200 ${
            resolvedTheme === "dark" ? "border-blue-400" : "border-blue-600"
          }`}
        ></div>
        <p
          className={`font-medium transition-colors duration-200 ${
            resolvedTheme === "dark" ? "text-blue-400" : "text-blue-800"
          }`}
        >
          Loading dashboard data...
        </p>
      </div>
    );
  }

  if (adminDetailError || adminBalanceError || orderStatsError) {
    return (
      <div className="w-full flex flex-col h-screen items-center text-center gap-4 justify-center p-4">
        <HiExclamationCircle
          className={`text-4xl sm:text-5xl transition-colors duration-200 ${
            resolvedTheme === "dark" ? "text-red-400" : "text-red-600"
          }`}
        />
        <p
          className={`text-sm sm:text-base transition-colors duration-200 ${
            resolvedTheme === "dark" ? "text-red-400" : "text-red-600"
          }`}
        >
          Error loading dashboard:{" "}
          {adminDetailError?.message || orderStatsError}
        </p>
        <button
          onClick={refetchPageData}
          className={`px-3 py-2 sm:px-4 sm:py-2 rounded-md transition-all duration-300 shadow-lg flex items-center gap-2 ${
            resolvedTheme === "dark"
              ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          <HiRefresh className="text-lg sm:text-xl" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Banner */}
      <div
        className={`rounded-xl p-4 sm:p-6 shadow-lg text-white ${
          resolvedTheme === "dark"
            ? "bg-gradient-to-r from-blue-900/50 via-indigo-900/40 to-purple-900/30 text-slate-100"
            : "bg-gradient-to-r from-blue-700 to-indigo-800"
        }`}
      >
        <h1 className="text-xl sm:text-2xl font-bold mb-2">
          Welcome back, {adminDetails?.nickName || "Trader"}!
        </h1>
        <p className="opacity-90 text-sm sm:text-base">
          Your trading dashboard is ready with the latest updates.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div
          className={`p-4 sm:p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg border ${
            resolvedTheme === "dark"
              ? "bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border-emerald-700/50"
              : "bg-gradient-to-br from-emerald-50 to-teal-100 border-emerald-200"
          }`}
        >
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h2
              className={`text-lg sm:text-xl font-semibold transition-colors duration-200 ${
                resolvedTheme === "dark"
                  ? "text-emerald-300"
                  : "text-emerald-800"
              }`}
            >
              Bybit Balance
            </h2>
            <div
              className={`p-2 sm:p-3 rounded-full transition-colors duration-200 ${
                resolvedTheme === "dark"
                  ? "bg-emerald-700/50"
                  : "bg-emerald-200"
              }`}
            >
              <HiCurrencyDollar
                className={`text-lg sm:text-xl transition-colors duration-200 ${
                  resolvedTheme === "dark"
                    ? "text-emerald-300"
                    : "text-emerald-700"
                }`}
              />
            </div>
          </div>
          <p
            className={`text-2xl sm:text-3xl font-bold transition-colors duration-200 ${
              resolvedTheme === "dark" ? "text-emerald-200" : "text-emerald-900"
            }`}
          >
            {adminBalance?.walletBalance || "0.00"}{" "}
            <span
              className={`text-xl sm:text-2xl transition-colors duration-200 ${
                resolvedTheme === "dark"
                  ? "text-emerald-300"
                  : "text-emerald-700"
              }`}
            >
              {adminBalance?.coin}
            </span>
          </p>
          <p
            className={`mt-2 text-xs sm:text-sm transition-colors duration-200 ${
              resolvedTheme === "dark" ? "text-emerald-300" : "text-emerald-700"
            }`}
          >
            P2P Balance
          </p>
        </div>

        <div
          className={`p-4 sm:p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg border ${
            resolvedTheme === "dark"
              ? "bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border-blue-700/50"
              : "bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200"
          }`}
        >
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h2
              className={`text-lg sm:text-xl font-semibold transition-colors duration-200 ${
                resolvedTheme === "dark" ? "text-blue-300" : "text-blue-800"
              }`}
            >
              Bank Balance
            </h2>
            <div
              className={`p-2 sm:p-3 rounded-full transition-colors duration-200 ${
                resolvedTheme === "dark" ? "bg-blue-700/50" : "bg-blue-200"
              }`}
            >
              <HiCurrencyDollar
                className={`text-lg sm:text-xl transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-blue-300" : "text-blue-700"
                }`}
              />
            </div>
          </div>
          <p
            className={`text-2xl sm:text-3xl font-bold transition-colors duration-200 ${
              resolvedTheme === "dark" ? "text-blue-200" : "text-blue-900"
            }`}
          >
            {new Intl.NumberFormat("en-NG", {
              style: "currency",
              currency: "NGN",
              minimumFractionDigits: 0, // Adjust if kobo is needed
              maximumFractionDigits: 2,
            }).format(Number(adminBankBalance || 0) / 100)}
          </p>
          <p
            className={`mt-2 text-xs sm:text-sm transition-colors duration-200 ${
              resolvedTheme === "dark" ? "text-blue-300" : "text-blue-700"
            }`}
          >
            Kuda Bank Balance
          </p>
        </div>

        <div
          className={`p-4 sm:p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg border sm:col-span-2 lg:col-span-1 ${
            resolvedTheme === "dark"
              ? "bg-gradient-to-br from-purple-900/20 to-violet-900/20 border-purple-700/50"
              : "bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200"
          }`}
        >
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h2
              className={`text-lg sm:text-xl font-semibold transition-colors duration-200 ${
                resolvedTheme === "dark" ? "text-purple-300" : "text-purple-800"
              }`}
            >
              Wallet Balance
            </h2>
            <div
              className={`p-2 sm:p-3 rounded-full transition-colors duration-200 ${
                resolvedTheme === "dark" ? "bg-purple-700/50" : "bg-purple-200"
              }`}
            >
              <HiCheckCircle
                className={`text-lg sm:text-xl transition-colors duration-200 ${
                  resolvedTheme === "dark"
                    ? "text-purple-300"
                    : "text-purple-700"
                }`}
              />
            </div>
          </div>
          <p
            className={`text-2xl sm:text-3xl font-bold transition-colors duration-200 ${
              resolvedTheme === "dark" ? "text-purple-200" : "text-purple-900"
            }`}
          >
            {new Intl.NumberFormat("en-NG", {
              style: "currency",
              currency: "NGN",
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            }).format(Number(walletInfo?.walletBalance || 0))}
          </p>
          <p
            className={`mt-2 text-xs sm:text-sm transition-colors duration-200 ${
              resolvedTheme === "dark" ? "text-purple-300" : "text-purple-700"
            }`}
          >
            Wallet Balance
          </p>
        </div>
      </div>

      {/* Detailed Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div
          className={`p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-blue-500 ${
            resolvedTheme === "dark" ? "bg-slate-800" : "bg-white"
          }`}
        >
          <div className="flex items-center mb-3 sm:mb-4">
            <div
              className={`p-2 sm:p-3 rounded-full mr-2 sm:mr-3 transition-colors duration-200 ${
                resolvedTheme === "dark" ? "bg-blue-900/50" : "bg-blue-100"
              }`}
            >
              <HiUser
                className={`text-lg sm:text-xl transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-blue-300" : "text-blue-600"
                }`}
              />
            </div>
            <h2
              className={`text-lg sm:text-xl font-medium transition-colors duration-200 ${
                resolvedTheme === "dark" ? "text-slate-100" : "text-gray-800"
              }`}
            >
              Admin Info
            </h2>
          </div>
          <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
            <div className="flex items-center">
              <p
                className={`font-medium w-20 sm:w-24 transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-slate-400" : "text-gray-600"
                }`}
              >
                Name:
              </p>
              <p
                className={`transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-slate-200" : "text-gray-800"
                }`}
              >
                {adminDetails?.nickName || "N/A"}
              </p>
            </div>
            <div className="flex items-center">
              <p
                className={`font-medium w-20 sm:w-24 transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-slate-400" : "text-gray-600"
                }`}
              >
                ID:
              </p>
              <p
                className={`break-all transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-slate-200" : "text-gray-800"
                }`}
              >
                {adminDetails?.userId || "N/A"}
              </p>
            </div>
            <div className="flex items-center">
              <p
                className={`font-medium w-20 sm:w-24 transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-slate-400" : "text-gray-600"
                }`}
              >
                Email:
              </p>
              <div className="flex items-center overflow-hidden">
                <HiMail
                  className={`mr-1 flex-shrink-0 transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "text-slate-500"
                      : "text-gray-500"
                  }`}
                />
                <p
                  className={`truncate transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "text-slate-200"
                      : "text-gray-800"
                  }`}
                >
                  {adminDetails?.email || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <p
                className={`font-medium w-20 sm:w-24 transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-slate-400" : "text-gray-600"
                }`}
              >
                Acc N0:
              </p>
              <div className="flex items-center overflow-hidden">
                <p
                  className={`truncate transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "text-slate-200"
                      : "text-gray-800"
                  }`}
                >
                  {adminAccountNumber || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <p
                className={`font-medium w-20 sm:w-24 transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-slate-400" : "text-gray-600"
                }`}
              >
                Acc Name:
              </p>
              <div className="flex items-center overflow-hidden">
                <p
                  className={`truncate transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "text-slate-200"
                      : "text-gray-800"
                  }`}
                >
                  {adminAccountName || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-green-500 ${
            resolvedTheme === "dark" ? "bg-slate-800" : "bg-white"
          }`}
        >
          <div className="flex items-center mb-3 sm:mb-4">
            <div
              className={`p-2 sm:p-3 rounded-full mr-2 sm:mr-3 transition-colors duration-200 ${
                resolvedTheme === "dark" ? "bg-green-900/50" : "bg-green-100"
              }`}
            >
              <HiShieldCheck
                className={`text-lg sm:text-xl transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-green-300" : "text-green-600"
                }`}
              />
            </div>
            <h2
              className={`text-lg sm:text-xl font-medium transition-colors duration-200 ${
                resolvedTheme === "dark" ? "text-slate-100" : "text-gray-800"
              }`}
            >
              Wallet Information
            </h2>
          </div>
          <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
            <div className="flex items-center">
              <p
                className={`font-medium w-20 sm:w-24 transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-slate-400" : "text-gray-600"
                }`}
              >
                Acc. Name:
              </p>
              <p
                className={`transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-slate-200" : "text-gray-800"
                }`}
              >
                {walletInfo?.accountName || "N/A"}
              </p>
            </div>
            <div className="flex items-center">
              <p
                className={`font-medium w-20 sm:w-24 transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-slate-400" : "text-gray-600"
                }`}
              >
                Acc. Number:
              </p>
              <div className="flex items-center">
                <p
                  className={`transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "text-slate-200"
                      : "text-gray-800"
                  }`}
                >
                  {walletInfo?.accountNumber || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <p
                className={`font-medium w-20 sm:w-24 transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-slate-400" : "text-gray-600"
                }`}
              >
                Bank Name:
              </p>
              <p
                className={`transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-slate-200" : "text-gray-800"
                }`}
              >
                {walletInfo?.bankName || "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-purple-500 ${
            resolvedTheme === "dark" ? "bg-slate-800" : "bg-white"
          }`}
        >
          <div className="flex items-center mb-3 sm:mb-4">
            <div
              className={`p-2 sm:p-3 rounded-full mr-2 sm:mr-3 transition-colors duration-200 ${
                resolvedTheme === "dark" ? "bg-purple-900/50" : "bg-purple-100"
              }`}
            >
              <HiChartBar
                className={`text-lg sm:text-xl transition-colors duration-200 ${
                  resolvedTheme === "dark"
                    ? "text-purple-300"
                    : "text-purple-600"
                }`}
              />
            </div>
            <h2
              className={`text-lg sm:text-xl font-medium transition-colors duration-200 ${
                resolvedTheme === "dark" ? "text-slate-100" : "text-gray-800"
              }`}
            >
              Trade Summary
            </h2>
          </div>
          <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
            <div className="flex items-center">
              <p
                className={`font-medium w-28 sm:w-32 transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-slate-400" : "text-gray-600"
                }`}
              >
                Total Orders:
              </p>
              <p
                className={`font-semibold transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-slate-200" : "text-gray-800"
                }`}
              >
                {adminDetails?.totalFinishCount || "N/A"}
              </p>
            </div>
            <div className="flex items-center">
              <p
                className={`font-medium w-28 sm:w-32 transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-slate-400" : "text-gray-600"
                }`}
              >
                30-day Orders:
              </p>
              <p
                className={`font-semibold transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-slate-200" : "text-gray-800"
                }`}
              >
                {adminDetails?.recentFinishCount || "N/A"}
              </p>
            </div>
            <div className="flex flex-wrap items-center">
              <p
                className={`font-medium w-28 sm:w-32 mb-1 sm:mb-0 transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-slate-400" : "text-gray-600"
                }`}
              >
                Completion Rate:
              </p>
              <div className="flex items-center w-full sm:w-auto">
                <div
                  className={`w-full max-w-[120px] sm:max-w-[150px] rounded-full h-2 sm:h-2.5 transition-colors duration-200 ${
                    resolvedTheme === "dark" ? "bg-slate-600" : "bg-gray-200"
                  }`}
                >
                  <div
                    className="bg-purple-600 h-2 sm:h-2.5 rounded-full"
                    style={{ width: `${adminDetails?.recentRate || 0}%` }}
                  ></div>
                </div>
                <span
                  className={`ml-2 font-medium text-xs sm:text-sm transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "text-purple-300"
                      : "text-purple-700"
                  }`}
                >
                  {adminDetails?.recentRate || "N/A"}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* New Order Statistics Card */}
        <div
          className={`p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-orange-500 sm:col-span-3 ${
            resolvedTheme === "dark" ? "bg-slate-800" : "bg-white"
          }`}
        >
          <div className="flex items-center mb-3 sm:mb-4">
            <div
              className={`p-2 sm:p-3 rounded-full mr-2 sm:mr-3 transition-colors duration-200 ${
                resolvedTheme === "dark" ? "bg-orange-900/50" : "bg-orange-100"
              }`}
            >
              <HiShoppingCart
                className={`text-lg sm:text-xl transition-colors duration-200 ${
                  resolvedTheme === "dark"
                    ? "text-orange-300"
                    : "text-orange-600"
                }`}
              />
            </div>
            <h2
              className={`text-lg sm:text-xl font-medium transition-colors duration-200 ${
                resolvedTheme === "dark" ? "text-slate-100" : "text-gray-800"
              }`}
            >
              API Order Statistics
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {/* Today's Statistics */}
            <div className="space-y-3">
              <div
                className={`p-3 rounded-lg transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "bg-orange-900/20" : "bg-orange-50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p
                    className={`font-medium text-sm transition-colors duration-200 ${
                      resolvedTheme === "dark"
                        ? "text-slate-300"
                        : "text-gray-700"
                    }`}
                  >
                    Today's Orders
                  </p>
                  <HiTrendingUp
                    className={`text-sm transition-colors duration-200 ${
                      resolvedTheme === "dark"
                        ? "text-orange-400"
                        : "text-orange-600"
                    }`}
                  />
                </div>
                <p
                  className={`text-xl font-bold transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "text-orange-300"
                      : "text-orange-700"
                  }`}
                >
                  {userDailyStats?.totalOrders || 0}
                </p>
                <p
                  className={`text-xs mt-1 transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "text-orange-400"
                      : "text-orange-600"
                  }`}
                >
                  Orders
                </p>
              </div>
              <div
                className={`p-3 rounded-lg transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "bg-orange-900/20" : "bg-orange-50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p
                    className={`font-medium text-sm transition-colors duration-200 ${
                      resolvedTheme === "dark"
                        ? "text-slate-300"
                        : "text-gray-700"
                    }`}
                  >
                    Today's Volume
                  </p>
                  <HiCurrencyDollar
                    className={`text-sm transition-colors duration-200 ${
                      resolvedTheme === "dark"
                        ? "text-orange-400"
                        : "text-orange-600"
                    }`}
                  />
                </div>
                <p
                  className={`text-xl font-bold transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "text-orange-300"
                      : "text-orange-700"
                  }`}
                >
                  ₦
                  {userDailyStats?.totalVolume
                    ? (userDailyStats.totalVolume / 100).toLocaleString()
                    : 0}
                </p>
                <p
                  className={`text-xs mt-1 transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "text-orange-400"
                      : "text-orange-600"
                  }`}
                >
                  Volume
                </p>
              </div>
            </div>

            {/* 30-Day Statistics */}
            <div className="space-y-3">
              <div
                className={`p-3 rounded-lg transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "bg-orange-900/20" : "bg-orange-50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p
                    className={`font-medium text-sm transition-colors duration-200 ${
                      resolvedTheme === "dark"
                        ? "text-slate-300"
                        : "text-gray-700"
                    }`}
                  >
                    30-Day Orders
                  </p>
                  <HiTrendingUp
                    className={`text-sm transition-colors duration-200 ${
                      resolvedTheme === "dark"
                        ? "text-orange-400"
                        : "text-orange-600"
                    }`}
                  />
                </div>
                <p
                  className={`text-xl font-bold transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "text-orange-300"
                      : "text-orange-700"
                  }`}
                >
                  {user30DayStats?.totalOrders || 0}
                </p>
                <p
                  className={`text-xs mt-1 transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "text-orange-400"
                      : "text-orange-600"
                  }`}
                >
                  Orders
                </p>
              </div>
              <div
                className={`p-3 rounded-lg transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "bg-orange-900/20" : "bg-orange-50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p
                    className={`font-medium text-sm transition-colors duration-200 ${
                      resolvedTheme === "dark"
                        ? "text-slate-300"
                        : "text-gray-700"
                    }`}
                  >
                    30-Day Volume
                  </p>
                  <HiCurrencyDollar
                    className={`text-sm transition-colors duration-200 ${
                      resolvedTheme === "dark"
                        ? "text-orange-400"
                        : "text-orange-600"
                    }`}
                  />
                </div>
                <p
                  className={`text-xl font-bold transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "text-orange-300"
                      : "text-orange-700"
                  }`}
                >
                  ₦
                  {user30DayStats?.totalVolume
                    ? (user30DayStats.totalVolume / 100).toLocaleString()
                    : 0}
                </p>
                <p
                  className={`text-xs mt-1 transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "text-orange-400"
                      : "text-orange-600"
                  }`}
                >
                  Volume
                </p>
              </div>
            </div>

            {/* Total Statistics */}
            <div className="space-y-3">
              <div
                className={`p-3 rounded-lg transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "bg-orange-900/20" : "bg-orange-50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p
                    className={`font-medium text-sm transition-colors duration-200 ${
                      resolvedTheme === "dark"
                        ? "text-slate-300"
                        : "text-gray-700"
                    }`}
                  >
                    Total Orders
                  </p>
                  <HiShoppingCart
                    className={`text-sm transition-colors duration-200 ${
                      resolvedTheme === "dark"
                        ? "text-orange-400"
                        : "text-orange-600"
                    }`}
                  />
                </div>
                <p
                  className={`text-xl font-bold transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "text-orange-300"
                      : "text-orange-700"
                  }`}
                >
                  {userTotalStats?.totalOrders || 0}
                </p>
                <p
                  className={`text-xs mt-1 transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "text-orange-400"
                      : "text-orange-600"
                  }`}
                >
                  Orders
                </p>
              </div>
              <div
                className={`p-3 rounded-lg transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "bg-orange-900/20" : "bg-orange-50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p
                    className={`font-medium text-sm transition-colors duration-200 ${
                      resolvedTheme === "dark"
                        ? "text-slate-300"
                        : "text-gray-700"
                    }`}
                  >
                    Total Volume
                  </p>
                  <HiCurrencyDollar
                    className={`text-sm transition-colors duration-200 ${
                      resolvedTheme === "dark"
                        ? "text-orange-400"
                        : "text-orange-600"
                    }`}
                  />
                </div>
                <p
                  className={`text-xl font-bold transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "text-orange-300"
                      : "text-orange-700"
                  }`}
                >
                  ₦
                  {userTotalStats?.totalVolume
                    ? (userTotalStats.totalVolume / 100).toLocaleString()
                    : 0}
                </p>
                <p
                  className={`text-xs mt-1 transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "text-orange-400"
                      : "text-orange-600"
                  }`}
                >
                  Volume
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-amber-500 sm:col-span-2 ${
            resolvedTheme === "dark" ? "bg-slate-800" : "bg-white"
          }`}
        >
          <div className="flex items-center mb-3 sm:mb-4">
            <div
              className={`p-2 sm:p-3 rounded-full mr-2 sm:mr-3 transition-colors duration-200 ${
                resolvedTheme === "dark" ? "bg-amber-900/50" : "bg-amber-100"
              }`}
            >
              <HiCreditCard
                className={`text-lg sm:text-xl transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-amber-300" : "text-amber-600"
                }`}
              />
            </div>
            <h2
              className={`text-lg sm:text-xl font-medium transition-colors duration-200 ${
                resolvedTheme === "dark" ? "text-slate-100" : "text-gray-800"
              }`}
            >
              Financial Summary
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div
              className={`p-3 sm:p-4 rounded-lg transition-colors duration-200 ${
                resolvedTheme === "dark" ? "bg-amber-900/20" : "bg-amber-50"
              }`}
            >
              <p
                className={`font-medium mb-1 text-sm transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-amber-300" : "text-gray-600"
                }`}
              >
                Recent Trade Amount:
              </p>
              <p
                className={`text-xl sm:text-2xl font-bold break-words transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-amber-200" : "text-amber-700"
                }`}
              >
                {adminDetails?.recentTradeAmount
                  ? parseFloat(adminDetails.recentTradeAmount).toLocaleString(
                      "en-US",
                      {
                        style: "currency",
                        currency: "USD",
                      }
                    )
                  : "N/A"}
              </p>
            </div>
            <div
              className={`p-3 sm:p-4 rounded-lg transition-colors duration-200 ${
                resolvedTheme === "dark" ? "bg-amber-900/20" : "bg-amber-50"
              }`}
            >
              <p
                className={`font-medium mb-1 text-sm transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-amber-300" : "text-gray-600"
                }`}
              >
                Total Trade Amount:
              </p>
              <p
                className={`text-xl sm:text-2xl font-bold break-words transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-amber-200" : "text-amber-700"
                }`}
              >
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
            <h2 className="text-xl font-medium">Wallet Balance</h2>
            <div className="p-3 bg-white bg-opacity-20 rounded-full">
              <HiCurrencyDollar className="text-white text-xl" />
            </div>
          </div>
          <p className="text-4xl font-bold">
            {new Intl.NumberFormat("en-NG", {
              style: "currency",
              currency: "NGN",
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            }).format(Number(walletInfo?.walletBalance || 0))}
          </p>
          <div className="mt-4 pt-4 border-t border-white border-opacity-20">
            <p className="text-sm opacity-80">Available for trading</p>
          </div>
        </div>
      </div>
    </div>
  );
}
