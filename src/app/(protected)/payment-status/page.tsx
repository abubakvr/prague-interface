"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { BASE_URL } from "@/lib/constants";
import { HiX, HiCheckCircle, HiExclamationCircle } from "react-icons/hi";

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
  transaction_reference: string;
  beneficiary_bank: string;
}

interface TransactionStatusResponse {
  success: boolean;
  message: string;
  data?: {
    responseCode: string;
    sessionID: string;
    status: boolean;
    message: string;
    data: any;
  };
  error?: string;
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

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<PaidOrder | null>(null);
  const [transactionStatus, setTransactionStatus] =
    useState<TransactionStatusResponse | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "25");

  useEffect(() => {
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

        // Check if response is OK before parsing JSON
        if (!response.ok) {
          if (response.status === 403) {
            router.push("/login");
          }
          const errorText = await response.text();
          throw new Error(
            `An error occurred while fetching paid orders ${response.status}: ${errorText}`
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
          console.log("Fetched paid orders data:", data.data);
          console.log("Sample order structure:", data.data[0]);
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

  const checkTransactionStatus = async (order: PaidOrder) => {
    if (!order.transaction_reference) {
      alert("No transaction reference available for this order");
      return;
    }

    setSelectedTransaction(order);
    setIsModalOpen(true);
    setIsCheckingStatus(true);
    setTransactionStatus(null);

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${BASE_URL}/api/payment/transaction-status`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            isThirdPartyBankTransfer: false, // Assuming intra-bank for now
            transactionRequestReference: order.transaction_reference,
          }),
        }
      );

      const result: TransactionStatusResponse = await response.json();
      setTransactionStatus(result);
    } catch (err: any) {
      setTransactionStatus({
        success: false,
        message: "Failed to check transaction status",
        error: err.message || "Network error occurred",
      });
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
    setTransactionStatus(null);
    setIsCheckingStatus(false);
  };

  const handlePageChange = (newPage: number) => {
    router.push(`/payment-status?page=${newPage}&limit=${limit}`);
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
    <div className="container mx-auto md:py-4 md:px-4">
      <div className="space-y-4">
        {paidOrders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No paid orders found</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <div className="min-w-full inline-block align-middle">
                <div className="overflow-hidden shadow-lg rounded-lg">
                  <table className="min-w-full divide-y divide-blue-100">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                        <th className="text-left p-4 font-semibold text-sm">
                          Amount
                        </th>
                        <th className="text-left p-4 font-semibold text-sm">
                          Seller
                        </th>
                        <th className="text-left p-4 font-semibold text-sm">
                          Bank Name
                        </th>
                        <th className="text-left p-4 font-semibold text-sm">
                          Transaction Ref
                        </th>
                        <th className="text-left p-4 font-semibold text-sm">
                          Status
                        </th>
                        <th className="text-left p-4 font-semibold text-sm">
                          Payment Date
                        </th>
                        <th className="text-left p-4 font-semibold text-sm">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-slate-50 divide-y divide-blue-50">
                      {paidOrders.map((order, index) => {
                        console.log(`Rendering order ${index}:`, order);
                        return (
                          <tr
                            key={order.id}
                            className="hover:bg-blue-50 transition-colors duration-150"
                          >
                            <td className="p-4 text-blue-900 text-sm">
                              {formatCurrency(order.amount)}
                            </td>
                            <td className="p-4 text-blue-900 text-sm">
                              {order.seller_name}
                            </td>
                            <td className="p-4 text-blue-900 text-sm">
                              {order.beneficiary_bank || "N/A"}
                            </td>
                            <td className="p-4 text-blue-900 text-sm">
                              <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                {order.transaction_reference || "N/A"}
                              </span>
                            </td>
                            <td className="p-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  order.status === true ||
                                  order.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {order.status === true
                                  ? "Completed"
                                  : "Not Completed"}
                              </span>
                            </td>
                            <td className="p-4 text-blue-900 text-sm">
                              {formatDate(order.payment_time)}
                            </td>
                            <td className="p-4">
                              <button
                                className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors duration-200"
                                onClick={() => checkTransactionStatus(order)}
                              >
                                Check Status
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {paidOrders.map((order, index) => {
                console.log(`Rendering mobile order ${index}:`, order);
                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <p className="text-lg font-semibold text-blue-900">
                          {formatCurrency(order.amount)}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {order.seller_name}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                          order.status === true || order.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status === true ? "Completed" : "Not completed"}
                      </span>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Bank:</span>
                        <span className="text-sm text-gray-700 font-medium">
                          {order.beneficiary_bank || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          Transaction Ref:
                        </span>
                        <span className="text-xs text-gray-700 font-mono bg-gray-100 px-2 py-1 rounded">
                          {order.transaction_reference || "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        {formatDate(order.payment_time)}
                      </div>
                      <button
                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors duration-200"
                        onClick={() => checkTransactionStatus(order)}
                      >
                        Check Status
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex justify-center">
              <div className="flex flex-wrap items-center justify-center gap-1 md:gap-2">
                <button
                  onClick={() =>
                    handlePageChange(Math.max(1, pagination.currentPage - 1))
                  }
                  className={`px-3 md:px-4 py-1 md:py-2 rounded-md text-sm ${
                    pagination.currentPage <= 1
                      ? "bg-blue-100 text-blue-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  Previous
                </button>

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
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
                      ? "bg-blue-100 text-blue-500 cursor-not-allowed"
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

      {/* Transaction Status Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Transaction Status
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <HiX className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {selectedTransaction && (
                <div className="space-y-4">
                  {/* Transaction Details */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Transaction Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-medium">
                          {formatCurrency(selectedTransaction.amount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Seller:</span>
                        <span className="font-medium">
                          {selectedTransaction.seller_name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bank:</span>
                        <span className="font-medium">
                          {selectedTransaction.beneficiary_bank || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Reference:</span>
                        <span className="font-mono text-xs bg-gray-200 px-2 py-1 rounded">
                          {selectedTransaction.transaction_reference}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Loading State */}
                  {isCheckingStatus && (
                    <div className="flex items-center justify-center py-8">
                      <div className="flex flex-col items-center space-y-3">
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
                        <p className="text-gray-600">
                          Checking transaction status...
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Transaction Status Result */}
                  {!isCheckingStatus && transactionStatus && (
                    <div className="space-y-4">
                      <div
                        className={`p-4 rounded-lg ${
                          transactionStatus.success &&
                          transactionStatus.data?.status
                            ? "bg-green-50 border border-green-200"
                            : "bg-red-50 border border-red-200"
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          {transactionStatus.success &&
                          transactionStatus.data?.status ? (
                            <HiCheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <HiExclamationCircle className="h-5 w-5 text-red-600" />
                          )}
                          <h4 className="font-medium text-gray-900">
                            {transactionStatus.success
                              ? "Status Retrieved"
                              : "Error"}
                          </h4>
                        </div>

                        {transactionStatus.success && transactionStatus.data ? (
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Response Code:
                              </span>
                              <span className="font-mono bg-gray-200 px-2 py-1 rounded text-xs">
                                {transactionStatus.data.responseCode}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Session ID:</span>
                              <span className="font-mono bg-gray-200 px-2 py-1 rounded text-xs">
                                {transactionStatus.data.sessionID}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Status:</span>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  transactionStatus.data.status
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {transactionStatus.data.status
                                  ? "Successful"
                                  : "Failed"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Message:</span>
                              <span className="font-medium text-gray-900 max-w-xs text-right">
                                {transactionStatus.data.message}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-red-600 text-sm">
                            {transactionStatus.error ||
                              transactionStatus.message}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end p-6 border-t border-gray-200">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Loading fallback for Suspense
function PaidOrdersLoading() {
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
