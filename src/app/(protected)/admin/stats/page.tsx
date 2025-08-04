"use client";

import { useState, useEffect } from "react";
import { BASE_URL } from "@/lib/constants";
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
        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 border-blue-600"></div>
        <p className="text-blue-800 font-medium">Loading order statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex flex-col h-screen items-center text-center gap-4 justify-center p-4">
        <HiExclamationCircle className="text-red-600 text-4xl sm:text-5xl" />
        <p className="text-red-600 text-sm sm:text-base">
          Error loading statistics: {error}
        </p>
        <button
          onClick={handleRefresh}
          className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300 shadow-lg flex items-center gap-2"
        >
          <HiRefresh className="text-lg sm:text-xl" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-xl p-4 sm:p-6 shadow-lg text-white">
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
            className="mt-4 sm:mt-0 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all duration-300 flex items-center gap-2"
          >
            <HiRefresh className="text-lg" />
            Refresh
          </button>
        </div>
      </div>

      {/* Date Filter */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <HiCalendar className="text-gray-600" />
            <label htmlFor="date-filter" className="font-medium text-gray-700">
              Select Date (for daily stats):
            </label>
          </div>
          <input
            type="date"
            id="date-filter"
            value={selectedDate}
            onChange={handleDateChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span className="text-sm text-gray-500">
            Leave empty for today's stats
          </span>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Daily Statistics */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-4 sm:p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg border border-green-200">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-green-800">
              Daily Statistics
            </h2>
            <div className="p-2 sm:p-3 bg-green-200 rounded-full">
              <HiCalendar className="text-green-700 text-lg sm:text-xl" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="bg-white bg-opacity-50 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-green-700 text-sm">Orders</p>
                <HiTrendingUp className="text-green-600 text-sm" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-green-900">
                {dailyStats?.totalOrders || 0}
              </p>
              <p className="text-green-700 mt-1 text-xs">
                {dailyStats?.date ? `Date: ${dailyStats.date}` : "Today"}
              </p>
            </div>
            <div className="bg-white bg-opacity-50 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-green-700 text-sm">Volume</p>
                <HiCurrencyDollar className="text-green-600 text-sm" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-green-900">
                ₦
                {dailyStats?.totalVolume
                  ? (dailyStats.totalVolume / 100).toLocaleString()
                  : 0}
              </p>
              <p className="text-green-700 mt-1 text-xs">Total Volume</p>
            </div>
          </div>
        </div>

        {/* 30-Day Statistics */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg border border-blue-200">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-blue-800">
              30-Day Statistics
            </h2>
            <div className="p-2 sm:p-3 bg-blue-200 rounded-full">
              <HiClock className="text-blue-700 text-lg sm:text-xl" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="bg-white bg-opacity-50 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-blue-700 text-sm">Orders</p>
                <HiTrendingUp className="text-blue-600 text-sm" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-blue-900">
                {thirtyDayStats?.totalOrders || 0}
              </p>
              <p className="text-blue-700 mt-1 text-xs">
                {thirtyDayStats?.period || "Last 30 days"}
              </p>
            </div>
            <div className="bg-white bg-opacity-50 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-blue-700 text-sm">Volume</p>
                <HiCurrencyDollar className="text-blue-600 text-sm" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-blue-900">
                ₦
                {thirtyDayStats?.totalVolume
                  ? (thirtyDayStats.totalVolume / 100).toLocaleString()
                  : 0}
              </p>
              <p className="text-blue-700 mt-1 text-xs">Total Volume</p>
            </div>
          </div>
        </div>

        {/* All-Time Statistics */}
        <div className="bg-gradient-to-br from-purple-50 to-violet-100 p-4 sm:p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg border border-purple-200">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-purple-800">
              All-Time Statistics
            </h2>
            <div className="p-2 sm:p-3 bg-purple-200 rounded-full">
              <HiChartBar className="text-purple-700 text-lg sm:text-xl" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="bg-white bg-opacity-50 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-purple-700 text-sm">Orders</p>
                <HiTrendingUp className="text-purple-600 text-sm" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-purple-900">
                {totalStats?.totalOrders || 0}
              </p>
              <p className="text-purple-700 mt-1 text-xs">All Time</p>
            </div>
            <div className="bg-white bg-opacity-50 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-purple-700 text-sm">Volume</p>
                <HiCurrencyDollar className="text-purple-600 text-sm" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-purple-900">
                ₦
                {totalStats?.totalVolume
                  ? (totalStats.totalVolume / 100).toLocaleString()
                  : 0}
              </p>
              <p className="text-purple-700 mt-1 text-xs">Total Volume</p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Daily Average Orders</p>
            <p className="text-2xl font-bold text-gray-800">
              {dailyStats?.totalOrders || 0}
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">30-Day Average Orders</p>
            <p className="text-2xl font-bold text-gray-800">
              {thirtyDayStats?.totalOrders
                ? Math.round(thirtyDayStats.totalOrders / 30)
                : 0}
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Platform Orders</p>
            <p className="text-2xl font-bold text-gray-800">
              {totalStats?.totalOrders || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
