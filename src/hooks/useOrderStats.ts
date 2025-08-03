import { useState, useEffect } from "react";
import { BASE_URL } from "@/lib/constants";

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

export function useOrderStats() {
  const [userDailyStats, setUserDailyStats] = useState<OrderStats | null>(null);
  const [userTotalStats, setUserTotalStats] = useState<OrderStats | null>(null);
  const [user30DayStats, setUser30DayStats] = useState<OrderStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserDailyStats = async (date?: string) => {
    try {
      const url = new URL(`${BASE_URL}/api/payment/user-daily-stats`);
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
      console.error("Error fetching user daily stats:", error);
      throw error;
    }
  };

  const fetchUserTotalStats = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/payment/user-total-stats`, {
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
      console.error("Error fetching user total stats:", error);
      throw error;
    }
  };

  const fetchUser30DayStats = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/payment/user-30day-stats`, {
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
      console.error("Error fetching user 30-day stats:", error);
      throw error;
    }
  };

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [daily, total, thirtyDay] = await Promise.all([
        fetchUserDailyStats(),
        fetchUserTotalStats(),
        fetchUser30DayStats(),
      ]);

      setUserDailyStats(daily);
      setUserTotalStats(total);
      setUser30DayStats(thirtyDay);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    userDailyStats,
    userTotalStats,
    user30DayStats,
    isLoading,
    error,
    refetch: fetchStats,
  };
}
