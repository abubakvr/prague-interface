import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BASE_URL } from "@/lib/constants";

export interface PaidOrder {
  id: number;
  order_id: string;
  user_id: string;
  amount: string | number;
  seller_name: string;
  status: boolean | string;
  payment_time: string;
  updated_at: string;
  user_email: string;
  user_name: string;
  transaction_reference: string;
  beneficiary_bank: string;
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export function usePaidOrders() {
  const [paidOrders, setPaidOrders] = useState<PaidOrder[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "25");

  const fetchPaidOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${BASE_URL}/api/payment/paid-orders?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 403) {
          router.push("/login");
        }
        const errorText = await response.text();
        throw new Error(
          `An error occurred while fetching paid orders ${response.status}: ${errorText}`
        );
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("JSON parsing error:", parseError);
        throw new Error(
          "Failed to parse server response as JSON. The server might have returned HTML instead of JSON."
        );
      }

      if (data.success) {
        setPaidOrders(data.data);
        setPagination(data.pagination);
      } else {
        setError(data.message || "Failed to fetch paid orders");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching paid orders");
      console.error("Error fetching paid orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    router.push(`/status?page=${newPage}&limit=${limit}`);
  };

  useEffect(() => {
    fetchPaidOrders();
  }, [page, limit]);

  return {
    paidOrders,
    pagination,
    loading,
    error,
    handlePageChange,
    fetchPaidOrders,
  };
}
