"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { BASE_URL } from "@/lib/constants";

interface PaidOrder {
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
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

// Component that uses useSearchParams
function PaidOrdersContent() {
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
  const limit = parseInt(searchParams.get("limit") || "10");

  useEffect(() => {
    const fetchPaidOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        const response = await fetch(
          `${BASE_URL}/api/payment/all-paid-orders?page=${page}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Check if response is OK before parsing JSON
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Server responded with ${response.status}: ${errorText}`
          );
        }

        // Try to parse the JSON safely
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

    fetchPaidOrders();
  }, [page, limit]);

  const handlePageChange = (newPage: number) => {
    router.push(`/paid-orders?page=${newPage}&limit=${limit}`);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP p");
    } catch (error) {
      return "Invalid date";
    }
  };

  const formatCurrency = (amount: string | number) => {
    // Convert string to number if needed and convert from kobo to naira
    const numericAmount =
      typeof amount === "string" ? parseFloat(amount) : amount;
    const amountInNaira = numericAmount / 100; // Convert kobo to naira

    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amountInNaira);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="h-8 w-8 animate-spin text-primary">Loading...</div>
        <span className="ml-2">Loading paid orders...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-700 mb-4">{error}</p>
        <button
          onClick={() => router.refresh()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold">Paid Orders</h2>
        </div>
        <div className="p-6">
          {paidOrders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No paid orders found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">User</th>
                      <th className="text-left p-3">Amount</th>
                      <th className="text-left p-3">Seller</th>
                      <th className="text-left p-3">Status</th>
                      <th className="text-left p-3">Payment Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paidOrders.map((order) => (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div>{order.user_name}</div>
                        </td>
                        <td className="p-3">{formatCurrency(order.amount)}</td>
                        <td className="p-3">{order.seller_name}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              order.status === true ||
                              order.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {order.status === true ? "completed" : order.status}
                          </span>
                        </td>
                        <td className="p-3">
                          {formatDate(order.payment_time)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex justify-center">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      handlePageChange(Math.max(1, pagination.currentPage - 1))
                    }
                    className={`px-3 py-1 rounded border ${
                      pagination.currentPage <= 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer hover:bg-gray-100"
                    }`}
                  >
                    Previous
                  </button>

                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1
                  )
                    .filter(
                      (pageNum) =>
                        pageNum === 1 ||
                        pageNum === pagination.totalPages ||
                        Math.abs(pageNum - pagination.currentPage) <= 1
                    )
                    .map((pageNum, index, array) => {
                      // Add ellipsis
                      if (index > 0 && pageNum - array[index - 1] > 1) {
                        return (
                          <span
                            key={`ellipsis-${pageNum}`}
                            className="px-3 py-1"
                          >
                            ...
                          </span>
                        );
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-1 rounded ${
                            pagination.currentPage === pageNum
                              ? "bg-blue-600 text-white"
                              : "border hover:bg-gray-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                  <button
                    onClick={() =>
                      handlePageChange(
                        Math.min(
                          pagination.totalPages,
                          pagination.currentPage + 1
                        )
                      )
                    }
                    className={`px-3 py-1 rounded border ${
                      pagination.currentPage >= pagination.totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer hover:bg-gray-100"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>

              <div className="text-sm text-gray-500 mt-4 text-center">
                Showing{" "}
                {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} to{" "}
                {Math.min(
                  pagination.currentPage * pagination.itemsPerPage,
                  pagination.totalItems
                )}{" "}
                of {pagination.totalItems} paid orders
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Loading fallback for Suspense
function PaidOrdersLoading() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="h-8 w-8 animate-spin text-primary">Loading...</div>
      <span className="ml-2">Loading page data...</span>
    </div>
  );
}

// Main component with Suspense boundary
export default function PaidOrdersPage() {
  return (
    <Suspense fallback={<PaidOrdersLoading />}>
      <PaidOrdersContent />
    </Suspense>
  );
}
