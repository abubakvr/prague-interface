"use client";

import { useState, useEffect } from "react";
import { BASE_URL } from "@/lib/constants";
import { useTheme } from "@/context/ThemeContext";
import {
  HiChartBar,
  HiTrendingUp,
  HiCurrencyDollar,
  HiCalendar,
  HiRefresh,
  HiExclamationCircle,
  HiClock,
} from "react-icons/hi";

interface OrderStats {
  date?: string;
  period?: string;
  totalOrders: number;
  totalVolume: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: OrderStats;
}

export default function AdminOrderStatsPage() {
  const { resolvedTheme } = useTheme();
  const [dailyStats, setDailyStats] = useState<OrderStats | null>(null);
  const [totalStats, setTotalStats] = useState<OrderStats | null>(null);
  const [thirtyDayStats, setThirtyDayStats] = useState<OrderStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const fetchDailyStats = async (date?: string) => {
    try {
      const url = new URL(`${BASE_URL}/api/payment/daily-stats`);
      if (date) {
        url.searchParams.append("date", date);
      }

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error fetching daily stats:", error);
      throw error;
    }
  };

  const fetchTotalStats = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/payment/total-stats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error fetching total stats:", error);
      throw error;
    }
  };

  const fetch30DayStats = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/payment/30day-stats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error fetching 30-day stats:", error);
      throw error;
    }
  };

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [daily, total, thirtyDay] = await Promise.all([
        fetchDailyStats(selectedDate || undefined),
        fetchTotalStats(),
        fetch30DayStats(),
      ]);

      setDailyStats(daily);
      setTotalStats(total);
      setThirtyDayStats(thirtyDay);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [selectedDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleRefresh = () => {
    fetchStats();
  };

  if (isLoading) {
    return (
      <div className="w-full flex flex-col gap-y-5 h-screen items-center text-center mt-16 p-4">
        <div
          className={`animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 transition-colors duration-200 ${
            resolvedTheme === "dark" ? "border-blue-400" : "border-blue-600"
          }`}
        ></div>
        <p
          className={`font-medium transition-colors duration-200 ${
            resolvedTheme === "dark" ? "text-blue-300" : "text-blue-800"
          }`}
        >
          Loading order statistics...
        </p>
      </div>
    );
  }

  if (error) {
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
          Error loading statistics: {error}
        </p>
        <button
          onClick={handleRefresh}
          className={`px-3 py-2 sm:px-4 sm:py-2 rounded-md transition-all duration-300 shadow-lg flex items-center gap-2 ${
            resolvedTheme === "dark"
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          <HiRefresh className="text-lg sm:text-xl" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div
        className={`rounded-xl p-4 sm:p-6 shadow-lg text-white transition-colors duration-200 ${
          resolvedTheme === "dark"
            ? "bg-gradient-to-r from-slate-800 to-slate-700"
            : "bg-gradient-to-r from-blue-700 to-indigo-800"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold mb-2">
              Admin Order Statistics
            </h1>
            <p className="opacity-90 text-sm sm:text-base">
              View order statistics for all users across different time periods.
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className={`mt-4 sm:mt-0 px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
              resolvedTheme === "dark"
                ? "bg-slate-600 bg-opacity-20 hover:bg-opacity-30"
                : "bg-white bg-opacity-20 hover:bg-opacity-30"
            }`}
          >
            <HiRefresh className="text-lg" />
            Refresh
          </button>
        </div>
      </div>

      {/* Date Filter */}
      <div
        className={`p-4 sm:p-6 rounded-xl shadow-md transition-colors duration-200 ${
          resolvedTheme === "dark" ? "bg-slate-800" : "bg-white"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <HiCalendar
              className={`transition-colors duration-200 ${
                resolvedTheme === "dark" ? "text-slate-400" : "text-gray-600"
              }`}
            />
            <label
              htmlFor="date-filter"
              className={`font-medium transition-colors duration-200 ${
                resolvedTheme === "dark" ? "text-slate-300" : "text-gray-700"
              }`}
            >
              Select Date (for daily stats):
            </label>
          </div>
          <input
            type="date"
            id="date-filter"
            value={selectedDate}
            onChange={handleDateChange}
            className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-colors duration-200 ${
              resolvedTheme === "dark"
                ? "border-slate-600 bg-slate-700 text-slate-100 focus:ring-blue-400"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          <span
            className={`text-sm transition-colors duration-200 ${
              resolvedTheme === "dark" ? "text-slate-400" : "text-gray-500"
            }`}
          >
            Leave empty for today's stats
          </span>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Daily Statistics */}
        <div
          className={`p-4 sm:p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg border ${
            resolvedTheme === "dark"
              ? "bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-700/30"
              : "bg-gradient-to-br from-green-50 to-emerald-100 border-green-200"
          }`}
        >
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h2
              className={`text-lg sm:text-xl font-semibold transition-colors duration-200 ${
                resolvedTheme === "dark" ? "text-green-300" : "text-green-800"
              }`}
            >
              Daily Statistics
            </h2>
            <div
              className={`p-2 sm:p-3 rounded-full transition-colors duration-200 ${
                resolvedTheme === "dark" ? "bg-green-800/50" : "bg-green-200"
              }`}
            >
              <HiCalendar
                className={`text-lg sm:text-xl transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-green-400" : "text-green-700"
                }`}
              />
            </div>
          </div>
          <div className="space-y-3">
            <div
              className={`p-3 rounded-lg transition-colors duration-200 ${
                resolvedTheme === "dark"
                  ? "bg-slate-800/50"
                  : "bg-white bg-opacity-50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <p
                  className={`font-medium text-sm transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "text-green-300"
                      : "text-green-700"
                  }`}
                >
                  Orders
                </p>
                <HiTrendingUp
                  className={`text-sm transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "text-green-400"
                      : "text-green-600"
                  }`}
                />
              </div>
              <p
                className={`text-2xl sm:text-3xl font-bold transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-green-200" : "text-green-900"
                }`}
              >
                {dailyStats?.totalOrders || 0}
              </p>
              <p
                className={`mt-1 text-xs transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-green-400" : "text-green-700"
                }`}
              >
                {dailyStats?.date ? `Date: ${dailyStats.date}` : "Today"}
              </p>
            </div>
            <div
              className={`p-3 rounded-lg transition-colors duration-200 ${
                resolvedTheme === "dark"
                  ? "bg-slate-800/50"
                  : "bg-white bg-opacity-50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <p
                  className={`font-medium text-sm transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "text-green-300"
                      : "text-green-700"
                  }`}
                >
                  Volume
                </p>
                <HiCurrencyDollar
                  className={`text-sm transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "text-green-400"
                      : "text-green-600"
                  }`}
                />
              </div>
              <p
                className={`text-2xl sm:text-3xl font-bold transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-green-200" : "text-green-900"
                }`}
              >
                ₦
                {dailyStats?.totalVolume
                  ? (dailyStats.totalVolume / 100).toLocaleString()
                  : 0}
              </p>
              <p
                className={`mt-1 text-xs transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-green-400" : "text-green-700"
                }`}
              >
                Total Volume
              </p>
            </div>
          </div>
        </div>

        {/* 30-Day Statistics */}
        <div
          className={`p-4 sm:p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg border ${
            resolvedTheme === "dark"
              ? "bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border-blue-700/30"
              : "bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200"
          }`}
        >
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h2
              className={`text-lg sm:text-xl font-semibold transition-colors duration-200 ${
                resolvedTheme === "dark" ? "text-blue-300" : "text-blue-800"
              }`}
            >
              30-Day Statistics
            </h2>
            <div
              className={`p-2 sm:p-3 rounded-full transition-colors duration-200 ${
                resolvedTheme === "dark" ? "bg-blue-800/50" : "bg-blue-200"
              }`}
            >
              <HiClock
                className={`text-lg sm:text-xl transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-blue-400" : "text-blue-700"
                }`}
              />
            </div>
          </div>
          <div className="space-y-3">
            <div
              className={`p-3 rounded-lg transition-colors duration-200 ${
                resolvedTheme === "dark"
                  ? "bg-slate-800/50"
                  : "bg-white bg-opacity-50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <p
                  className={`font-medium text-sm transition-colors duration-200 ${
                    resolvedTheme === "dark" ? "text-blue-300" : "text-blue-700"
                  }`}
                >
                  Orders
                </p>
                <HiTrendingUp
                  className={`text-sm transition-colors duration-200 ${
                    resolvedTheme === "dark" ? "text-blue-400" : "text-blue-600"
                  }`}
                />
              </div>
              <p
                className={`text-2xl sm:text-3xl font-bold transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-blue-200" : "text-blue-900"
                }`}
              >
                {thirtyDayStats?.totalOrders || 0}
              </p>
              <p
                className={`mt-1 text-xs transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-blue-400" : "text-blue-700"
                }`}
              >
                {thirtyDayStats?.period || "Last 30 days"}
              </p>
            </div>
            <div
              className={`p-3 rounded-lg transition-colors duration-200 ${
                resolvedTheme === "dark"
                  ? "bg-slate-800/50"
                  : "bg-white bg-opacity-50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <p
                  className={`font-medium text-sm transition-colors duration-200 ${
                    resolvedTheme === "dark" ? "text-blue-300" : "text-blue-700"
                  }`}
                >
                  Volume
                </p>
                <HiCurrencyDollar
                  className={`text-sm transition-colors duration-200 ${
                    resolvedTheme === "dark" ? "text-blue-400" : "text-blue-600"
                  }`}
                />
              </div>
              <p
                className={`text-2xl sm:text-3xl font-bold transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-blue-200" : "text-blue-900"
                }`}
              >
                ₦
                {thirtyDayStats?.totalVolume
                  ? (thirtyDayStats.totalVolume / 100).toLocaleString()
                  : 0}
              </p>
              <p
                className={`mt-1 text-xs transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-blue-400" : "text-blue-700"
                }`}
              >
                Total Volume
              </p>
            </div>
          </div>
        </div>

        {/* All-Time Statistics */}
        <div
          className={`p-4 sm:p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg border ${
            resolvedTheme === "dark"
              ? "bg-gradient-to-br from-purple-900/20 to-violet-900/20 border-purple-700/30"
              : "bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200"
          }`}
        >
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h2
              className={`text-lg sm:text-xl font-semibold transition-colors duration-200 ${
                resolvedTheme === "dark" ? "text-purple-300" : "text-purple-800"
              }`}
            >
              All-Time Statistics
            </h2>
            <div
              className={`p-2 sm:p-3 rounded-full transition-colors duration-200 ${
                resolvedTheme === "dark" ? "bg-purple-800/50" : "bg-purple-200"
              }`}
            >
              <HiChartBar
                className={`text-lg sm:text-xl transition-colors duration-200 ${
                  resolvedTheme === "dark"
                    ? "text-purple-400"
                    : "text-purple-700"
                }`}
              />
            </div>
          </div>
          <div className="space-y-3">
            <div
              className={`p-3 rounded-lg transition-colors duration-200 ${
                resolvedTheme === "dark"
                  ? "bg-slate-800/50"
                  : "bg-white bg-opacity-50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <p
                  className={`font-medium text-sm transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "text-purple-300"
                      : "text-purple-700"
                  }`}
                >
                  Orders
                </p>
                <HiTrendingUp
                  className={`text-sm transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "text-purple-400"
                      : "text-purple-600"
                  }`}
                />
              </div>
              <p
                className={`text-2xl sm:text-3xl font-bold transition-colors duration-200 ${
                  resolvedTheme === "dark"
                    ? "text-purple-200"
                    : "text-purple-900"
                }`}
              >
                {totalStats?.totalOrders || 0}
              </p>
              <p
                className={`mt-1 text-xs transition-colors duration-200 ${
                  resolvedTheme === "dark"
                    ? "text-purple-400"
                    : "text-purple-700"
                }`}
              >
                All Time
              </p>
            </div>
            <div
              className={`p-3 rounded-lg transition-colors duration-200 ${
                resolvedTheme === "dark"
                  ? "bg-slate-800/50"
                  : "bg-white bg-opacity-50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <p
                  className={`font-medium text-sm transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "text-purple-300"
                      : "text-purple-700"
                  }`}
                >
                  Volume
                </p>
                <HiCurrencyDollar
                  className={`text-sm transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "text-purple-400"
                      : "text-purple-600"
                  }`}
                />
              </div>
              <p
                className={`text-2xl sm:text-3xl font-bold transition-colors duration-200 ${
                  resolvedTheme === "dark"
                    ? "text-purple-200"
                    : "text-purple-900"
                }`}
              >
                ₦
                {totalStats?.totalVolume
                  ? (totalStats.totalVolume / 100).toLocaleString()
                  : 0}
              </p>
              <p
                className={`mt-1 text-xs transition-colors duration-200 ${
                  resolvedTheme === "dark"
                    ? "text-purple-400"
                    : "text-purple-700"
                }`}
              >
                Total Volume
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <div
        className={`p-4 sm:p-6 rounded-xl shadow-md transition-colors duration-200 ${
          resolvedTheme === "dark" ? "bg-slate-800" : "bg-white"
        }`}
      >
        <h3
          className={`text-lg font-semibold mb-4 transition-colors duration-200 ${
            resolvedTheme === "dark" ? "text-slate-200" : "text-gray-800"
          }`}
        >
          Summary
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            className={`text-center p-4 rounded-lg transition-colors duration-200 ${
              resolvedTheme === "dark" ? "bg-slate-700/50" : "bg-gray-50"
            }`}
          >
            <p
              className={`text-sm transition-colors duration-200 ${
                resolvedTheme === "dark" ? "text-slate-400" : "text-gray-600"
              }`}
            >
              Daily Average Orders
            </p>
            <p
              className={`text-2xl font-bold transition-colors duration-200 ${
                resolvedTheme === "dark" ? "text-slate-200" : "text-gray-800"
              }`}
            >
              {dailyStats?.totalOrders || 0}
            </p>
          </div>
          <div
            className={`text-center p-4 rounded-lg transition-colors duration-200 ${
              resolvedTheme === "dark" ? "bg-slate-700/50" : "bg-gray-50"
            }`}
          >
            <p
              className={`text-sm transition-colors duration-200 ${
                resolvedTheme === "dark" ? "text-slate-400" : "text-gray-600"
              }`}
            >
              30-Day Average Orders
            </p>
            <p
              className={`text-2xl font-bold transition-colors duration-200 ${
                resolvedTheme === "dark" ? "text-slate-200" : "text-gray-800"
              }`}
            >
              {thirtyDayStats?.totalOrders
                ? Math.round(thirtyDayStats.totalOrders / 30)
                : 0}
            </p>
          </div>
          <div
            className={`text-center p-4 rounded-lg transition-colors duration-200 ${
              resolvedTheme === "dark" ? "bg-slate-700/50" : "bg-gray-50"
            }`}
          >
            <p
              className={`text-sm transition-colors duration-200 ${
                resolvedTheme === "dark" ? "text-slate-400" : "text-gray-600"
              }`}
            >
              Total Platform Orders
            </p>
            <p
              className={`text-2xl font-bold transition-colors duration-200 ${
                resolvedTheme === "dark" ? "text-slate-200" : "text-gray-800"
              }`}
            >
              {totalStats?.totalOrders || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
