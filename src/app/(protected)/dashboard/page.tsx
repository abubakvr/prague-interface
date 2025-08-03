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
        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 border-blue-600"></div>
        <p className="text-blue-800 font-medium">Loading dashboard data...</p>
      </div>
    );
  }

  if (adminDetailError || adminBalanceError || orderStatsError) {
    return (
      <div className="w-full flex flex-col h-screen items-center text-center gap-4 justify-center p-4">
        <HiExclamationCircle className="text-red-600 text-4xl sm:text-5xl" />
        <p className="text-red-600 text-sm sm:text-base">
          Error loading dashboard:{" "}
          {adminDetailError?.message || orderStatsError}
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
              Bybit Balance
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
            P2P Balance
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg border border-blue-200">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-blue-800">
              Bank Balance
            </h2>
            <div className="p-2 sm:p-3 bg-blue-200 rounded-full">
              <HiCurrencyDollar className="text-blue-700 text-lg sm:text-xl" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-blue-900">
            {new Intl.NumberFormat("en-NG", {
              style: "currency",
              currency: "NGN",
              minimumFractionDigits: 0, // Adjust if kobo is needed
              maximumFractionDigits: 2,
            }).format(Number(adminBankBalance || 0) / 100)}
          </p>
          <p className="text-blue-700 mt-2 text-xs sm:text-sm">
            Kuda Bank Balance
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-100 p-4 sm:p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg border border-purple-200 sm:col-span-2 lg:col-span-1">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-purple-800">
              Wallet Balance
            </h2>
            <div className="p-2 sm:p-3 bg-purple-200 rounded-full">
              <HiCheckCircle className="text-purple-700 text-lg sm:text-xl" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-purple-900">
            {new Intl.NumberFormat("en-NG", {
              style: "currency",
              currency: "NGN",
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            }).format(Number(walletInfo?.walletBalance || 0))}
          </p>
          <p className="text-purple-700 mt-2 text-xs sm:text-sm">
            Wallet Balance
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
            <div className="flex items-center">
              <p className="font-medium text-gray-600 w-20 sm:w-24">Acc N0:</p>
              <div className="flex items-center overflow-hidden">
                <p className="text-gray-800 truncate">
                  {adminAccountNumber || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <p className="font-medium text-gray-600 w-20 sm:w-24">
                Acc Name:
              </p>
              <div className="flex items-center overflow-hidden">
                <p className="text-gray-800 truncate">
                  {adminAccountName || "N/A"}
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
              Wallet Information
            </h2>
          </div>
          <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
            <div className="flex items-center">
              <p className="font-medium text-gray-600 w-20 sm:w-24">
                Acc. Name:
              </p>
              <p className="text-gray-800">
                {walletInfo?.accountName || "N/A"}
              </p>
            </div>
            <div className="flex items-center">
              <p className="font-medium text-gray-600 w-20 sm:w-24">
                Acc. Number:
              </p>
              <div className="flex items-center">
                <p className="text-gray-800">
                  {walletInfo?.accountNumber || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <p className="font-medium text-gray-600 w-20 sm:w-24">
                Bank Name:
              </p>
              <p className="text-gray-800">{walletInfo?.bankName || "N/A"}</p>
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

        {/* New Order Statistics Card */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-orange-500 sm:col-span-3">
          <div className="flex items-center mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-orange-100 rounded-full mr-2 sm:mr-3">
              <HiShoppingCart className="text-orange-600 text-lg sm:text-xl" />
            </div>
            <h2 className="text-lg sm:text-xl font-medium text-gray-800">
              Order Statistics
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {/* Today's Statistics */}
            <div className="space-y-3">
              <div className="bg-orange-50 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-700 text-sm">
                    Today's Orders
                  </p>
                  <HiTrendingUp className="text-orange-600 text-sm" />
                </div>
                <p className="text-xl font-bold text-orange-700">
                  {userDailyStats?.totalOrders || 0}
                </p>
                <p className="text-xs text-orange-600 mt-1">Orders</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-700 text-sm">
                    Today's Volume
                  </p>
                  <HiCurrencyDollar className="text-orange-600 text-sm" />
                </div>
                <p className="text-xl font-bold text-orange-700">
                  ₦{userDailyStats?.totalVolume?.toLocaleString() || 0}
                </p>
                <p className="text-xs text-orange-600 mt-1">Volume</p>
              </div>
            </div>

            {/* 30-Day Statistics */}
            <div className="space-y-3">
              <div className="bg-orange-50 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-700 text-sm">
                    30-Day Orders
                  </p>
                  <HiTrendingUp className="text-orange-600 text-sm" />
                </div>
                <p className="text-xl font-bold text-orange-700">
                  {user30DayStats?.totalOrders || 0}
                </p>
                <p className="text-xs text-orange-600 mt-1">Orders</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-700 text-sm">
                    30-Day Volume
                  </p>
                  <HiCurrencyDollar className="text-orange-600 text-sm" />
                </div>
                <p className="text-xl font-bold text-orange-700">
                  ₦{user30DayStats?.totalVolume?.toLocaleString() || 0}
                </p>
                <p className="text-xs text-orange-600 mt-1">Volume</p>
              </div>
            </div>

            {/* All-Time Statistics */}
            <div className="space-y-3">
              <div className="bg-orange-50 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-700 text-sm">
                    Total Orders
                  </p>
                  <HiTrendingUp className="text-orange-600 text-sm" />
                </div>
                <p className="text-xl font-bold text-orange-700">
                  {userTotalStats?.totalOrders || 0}
                </p>
                <p className="text-xs text-orange-600 mt-1">All Time</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-700 text-sm">
                    Total Volume
                  </p>
                  <HiCurrencyDollar className="text-orange-600 text-sm" />
                </div>
                <p className="text-xl font-bold text-orange-700">
                  ₦{userTotalStats?.totalVolume?.toLocaleString() || 0}
                </p>
                <p className="text-xs text-orange-600 mt-1">All Time</p>
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
                      "en-US",
                      {
                        style: "currency",
                        currency: "USD",
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
