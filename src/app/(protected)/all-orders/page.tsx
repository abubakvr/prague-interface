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
  const limit = parseInt(searchParams.get("limit") || "50");

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
      <div className="flex justify-center items-center min-h-screen p-4">
        <svg
          className="animate-spin h-8 w-8 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span className="ml-2 text-blue-600">Loading paid orders...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-xl md:text-2xl font-bold text-red-600 mb-4">
          Error
        </h2>
        <p className="text-gray-700 mb-4 text-center">{error}</p>
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
    <div className="container mx-auto py-4 md:py-8 px-2 md:px-4">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-lg overflow-hidden border border-blue-100">
        <div className="p-4 md:p-6 border-b border-blue-100 bg-white bg-opacity-70">
          <h2 className="text-xl md:text-2xl font-bold text-blue-900">
            Paid Orders
          </h2>
        </div>
        <div className="p-2 md:p-6">
          {paidOrders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No paid orders found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <div className="min-w-full inline-block align-middle">
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-blue-100">
                      <thead>
                        <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                          <th className="text-left p-2 md:p-4 font-semibold text-xs md:text-sm">
                            User
                          </th>
                          <th className="text-left p-2 md:p-4 font-semibold text-xs md:text-sm">
                            Amount
                          </th>
                          <th className="text-left p-2 md:p-4 font-semibold text-xs md:text-sm">
                            Seller
                          </th>
                          <th className="text-left p-2 md:p-4 font-semibold text-xs md:text-sm">
                            Status
                          </th>
                          <th className="text-left p-2 md:p-4 font-semibold text-xs md:text-sm">
                            Payment Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white bg-opacity-80">
                        {paidOrders.map((order) => (
                          <tr
                            key={order.id}
                            className="border-b border-blue-50 hover:bg-blue-50 transition-colors duration-150"
                          >
                            <td className="p-2 md:p-4">
                              <div className="text-blue-900 text-xs md:text-sm truncate max-w-[120px] md:max-w-none">
                                {order.user_name}
                              </div>
                            </td>
                            <td className="p-2 md:p-4 text-blue-900 text-xs md:text-sm">
                              {formatCurrency(order.amount)}
                            </td>
                            <td className="p-2 md:p-4 text-blue-900 text-xs md:text-sm truncate max-w-[120px] md:max-w-none">
                              {order.seller_name}
                            </td>
                            <td className="p-2 md:p-4">
                              <span
                                className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium ${
                                  order.status === true ||
                                  order.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {order.status === true
                                  ? "completed"
                                  : order.status}
                              </span>
                            </td>
                            <td className="p-2 md:p-4 text-blue-900 text-xs md:text-sm">
                              {formatDate(order.payment_time)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="mt-4 md:mt-6 flex justify-center">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={() =>
                      handlePageChange(Math.max(1, pagination.currentPage - 1))
                    }
                    className={`px-3 md:px-4 py-1 md:py-2 rounded-md text-sm ${
                      pagination.currentPage <= 1
                        ? "bg-blue-100 text-blue-400 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
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
                      if (index > 0 && pageNum - array[index - 1] > 1) {
                        return (
                          <span
                            key={`ellipsis-${pageNum}`}
                            className="px-2 md:px-3 py-1 md:py-2 text-blue-600"
                          >
                            ...
                          </span>
                        );
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 md:px-4 py-1 md:py-2 rounded-md text-sm ${
                            pagination.currentPage === pageNum
                              ? "bg-blue-600 text-white"
                              : "bg-blue-100 text-blue-600 hover:bg-blue-200"
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
                    className={`px-3 md:px-4 py-1 md:py-2 rounded-md text-sm ${
                      pagination.currentPage >= pagination.totalPages
                        ? "bg-blue-100 text-blue-400 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>

              <div className="text-xs md:text-sm text-blue-600 mt-4 text-center px-2">
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
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="h-8 w-8 animate-spin text-blue-600">Loading...</div>
      <span className="ml-2 text-blue-600 text-sm md:text-base">
        Loading page data...
      </span>
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
