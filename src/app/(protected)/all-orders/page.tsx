"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { BASE_URL } from "@/lib/constants";
import { useTheme } from "@/context/ThemeContext";
import { useFormatters } from "@/hooks/useFormatters";
import { useBankMapping } from "@/hooks/useBankMapping";

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

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

function PaidOrdersContent() {
  const { resolvedTheme } = useTheme();
  const { formatCurrency, formatDate } = useFormatters();
  const { findBankNameByCode } = useBankMapping();
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
    router.push(`/all-orders?page=${newPage}&limit=${limit}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4">
        <svg
          className={`animate-spin h-8 w-8 transition-colors duration-200 ${
            resolvedTheme === "dark" ? "text-blue-400" : "text-blue-600"
          }`}
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
        <span
          className={`ml-2 transition-colors duration-200 ${
            resolvedTheme === "dark" ? "text-blue-300" : "text-blue-600"
          }`}
        >
          Loading paid orders...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2
          className={`text-xl md:text-2xl font-bold mb-4 transition-colors duration-200 ${
            resolvedTheme === "dark" ? "text-red-400" : "text-red-600"
          }`}
        >
          Error
        </h2>
        <p
          className={`mb-4 text-center transition-colors duration-200 ${
            resolvedTheme === "dark" ? "text-slate-300" : "text-gray-700"
          }`}
        >
          {error}
        </p>
        <button
          onClick={() => router.refresh()}
          className={`px-4 py-2 rounded transition-colors duration-200 ${
            resolvedTheme === "dark"
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 md:py-8 px-2 md:px-4">
      <div className="space-y-4">
        {paidOrders.length === 0 ? (
          <div className="text-center py-12">
            <div
              className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 transition-colors duration-200 ${
                resolvedTheme === "dark"
                  ? "bg-slate-700 text-slate-400"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p
              className={`text-lg font-medium transition-colors duration-200 ${
                resolvedTheme === "dark" ? "text-slate-300" : "text-gray-600"
              }`}
            >
              No paid orders found
            </p>
            <p
              className={`text-sm mt-1 transition-colors duration-200 ${
                resolvedTheme === "dark" ? "text-slate-400" : "text-gray-500"
              }`}
            >
              There are no paid orders to display at the moment.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <DesktopTable paidOrders={paidOrders} />

            {/* Mobile Card View */}
            <MobileCards paidOrders={paidOrders} />

            {/* Pagination */}
            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
              resolvedTheme={resolvedTheme}
            />

            {/* Pagination Info */}
            <PaginationInfo
              pagination={pagination}
              resolvedTheme={resolvedTheme}
            />
          </>
        )}
      </div>
    </div>
  );
}

// Loading fallback for Suspense
function PaidOrdersLoading() {
  const { resolvedTheme } = useTheme();
  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div
        className={`h-8 w-8 animate-spin transition-colors duration-200 ${
          resolvedTheme === "dark" ? "text-blue-400" : "text-blue-600"
        }`}
      >
        Loading...
      </div>
      <span
        className={`ml-2 text-sm md:text-base transition-colors duration-200 ${
          resolvedTheme === "dark" ? "text-blue-300" : "text-blue-600"
        }`}
      >
        Loading page data...
      </span>
    </div>
  );
}

// Desktop Table Component
function DesktopTable({ paidOrders }: { paidOrders: PaidOrder[] }) {
  const { resolvedTheme } = useTheme();
  const { formatCurrency, formatDate } = useFormatters();
  const { findBankNameByCode } = useBankMapping();

  return (
    <div className="hidden md:block overflow-x-auto">
      <div className="min-w-full inline-block align-middle">
        <div
          className={`overflow-hidden shadow-lg rounded-lg transition-colors duration-200 ${
            resolvedTheme === "dark" ? "bg-slate-800" : "bg-white"
          }`}
        >
          <table
            className={`min-w-full divide-y transition-colors duration-200 ${
              resolvedTheme === "dark" ? "divide-slate-700" : "divide-blue-100"
            }`}
          >
            <thead>
              <tr
                className={`${
                  resolvedTheme === "dark"
                    ? "bg-gradient-to-r from-blue-900/30 via-indigo-900/30 to-purple-900/20 text-slate-100"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                }`}
              >
                <th className="text-left p-4 font-semibold text-sm">User</th>
                <th className="text-left p-4 font-semibold text-sm">Amount</th>
                <th className="text-left p-4 font-semibold text-sm">Seller</th>
                <th className="text-left p-4 font-semibold text-sm">Bank</th>
                <th className="text-left p-4 font-semibold text-sm">Ref</th>
                <th className="text-left p-4 font-semibold text-sm">Status</th>
                <th className="text-left p-4 font-semibold text-sm">Date</th>
              </tr>
            </thead>
            <tbody
              className={`divide-y transition-colors duration-200 ${
                resolvedTheme === "dark"
                  ? "bg-slate-800 divide-slate-700"
                  : "bg-slate-50 divide-blue-50"
              }`}
            >
              {paidOrders.map((order) => (
                <tr
                  key={order.id}
                  className={`transition-colors duration-150 ${
                    resolvedTheme === "dark"
                      ? "hover:bg-slate-700"
                      : "hover:bg-blue-50"
                  }`}
                >
                  <td
                    className={`p-4 text-sm transition-colors duration-200 ${
                      resolvedTheme === "dark"
                        ? "text-slate-200"
                        : "text-blue-900"
                    }`}
                  >
                    <div>
                      <div className="font-medium">{order.user_name}</div>
                    </div>
                  </td>
                  <td
                    className={`p-4 text-sm transition-colors duration-200 ${
                      resolvedTheme === "dark"
                        ? "text-slate-200"
                        : "text-blue-900"
                    }`}
                  >
                    {formatCurrency(order.amount)}
                  </td>
                  <td
                    className={`p-4 text-sm transition-colors duration-200 ${
                      resolvedTheme === "dark"
                        ? "text-slate-200"
                        : "text-blue-900"
                    }`}
                  >
                    {order.seller_name}
                  </td>
                  <td
                    className={`p-4 text-sm transition-colors duration-200 ${
                      resolvedTheme === "dark"
                        ? "text-slate-200"
                        : "text-blue-900"
                    }`}
                  >
                    {findBankNameByCode(order.beneficiary_bank)}
                  </td>
                  <td
                    className={`p-4 text-sm transition-colors duration-200 ${
                      resolvedTheme === "dark"
                        ? "text-slate-200"
                        : "text-blue-900"
                    }`}
                  >
                    <span
                      className={`font-mono text-xs px-2 py-1 rounded transition-colors duration-200 ${
                        resolvedTheme === "dark"
                          ? "bg-slate-700 text-slate-200"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.transaction_reference || "N/A"}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                        order.status === true || order.status === "completed"
                          ? resolvedTheme === "dark"
                            ? "bg-green-900/50 text-green-300"
                            : "bg-green-100 text-green-800"
                          : resolvedTheme === "dark"
                          ? "bg-yellow-900/50 text-yellow-300"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.status === true ? "Completed" : "Not Completed"}
                    </span>
                  </td>
                  <td
                    className={`p-4 text-sm transition-colors duration-200 ${
                      resolvedTheme === "dark"
                        ? "text-slate-200"
                        : "text-blue-900"
                    }`}
                  >
                    {formatDate(order.payment_time)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Mobile Cards Component
function MobileCards({ paidOrders }: { paidOrders: PaidOrder[] }) {
  const { resolvedTheme } = useTheme();
  const { formatCurrency, formatDate } = useFormatters();
  const { findBankNameByCode } = useBankMapping();

  return (
    <div className="md:hidden space-y-3">
      {paidOrders.map((order) => (
        <div
          key={order.id}
          className={`rounded-lg shadow-md p-4 border transition-colors duration-200 ${
            resolvedTheme === "dark"
              ? "bg-slate-800 border-slate-600"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <p
                className={`text-lg font-semibold transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-blue-300" : "text-blue-900"
                }`}
              >
                {formatCurrency(order.amount)}
              </p>
              <p
                className={`text-sm mt-1 transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-slate-300" : "text-gray-600"
                }`}
              >
                {order.user_name}
              </p>
              <p
                className={`text-xs mt-1 transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-slate-400" : "text-gray-500"
                }`}
              >
                {order.user_email}
              </p>
            </div>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ml-2 transition-colors duration-200 ${
                order.status === true || order.status === "completed"
                  ? resolvedTheme === "dark"
                    ? "bg-green-900/50 text-green-300"
                    : "bg-green-100 text-green-800"
                  : resolvedTheme === "dark"
                  ? "bg-yellow-900/50 text-yellow-300"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {order.status === true ? "Completed" : "Not completed"}
            </span>
          </div>

          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between">
              <span
                className={`text-xs transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-slate-400" : "text-gray-500"
                }`}
              >
                Seller:
              </span>
              <span
                className={`text-sm font-medium transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-slate-200" : "text-gray-700"
                }`}
              >
                {order.seller_name}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span
                className={`text-xs transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-slate-400" : "text-gray-500"
                }`}
              >
                Bank:
              </span>
              <span
                className={`text-sm font-medium transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-slate-200" : "text-gray-700"
                }`}
              >
                {findBankNameByCode(order.beneficiary_bank)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span
                className={`text-xs transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-slate-400" : "text-gray-500"
                }`}
              >
                Transaction Ref:
              </span>
              <span
                className={`text-xs font-mono px-2 py-1 rounded transition-colors duration-200 ${
                  resolvedTheme === "dark"
                    ? "text-slate-200 bg-slate-700"
                    : "text-gray-700 bg-gray-100"
                }`}
              >
                {order.transaction_reference || "N/A"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div
              className={`text-xs transition-colors duration-200 ${
                resolvedTheme === "dark" ? "text-slate-400" : "text-gray-500"
              }`}
            >
              {formatDate(order.payment_time)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Pagination Component
function Pagination({
  pagination,
  onPageChange,
  resolvedTheme,
}: {
  pagination: PaginationData;
  onPageChange: (page: number) => void;
  resolvedTheme: string | undefined;
}) {
  return (
    <div className="flex justify-center">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, pagination.currentPage - 1))}
          className={`px-3 md:px-4 py-1 md:py-2 rounded-md text-sm transition-colors duration-200 ${
            pagination.currentPage <= 1
              ? resolvedTheme === "dark"
                ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                : "bg-blue-100 text-blue-400 cursor-not-allowed"
              : resolvedTheme === "dark"
              ? "bg-blue-600 text-white hover:bg-blue-700"
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
                  className={`px-2 md:px-3 py-1 md:py-2 transition-colors duration-200 ${
                    resolvedTheme === "dark" ? "text-blue-400" : "text-blue-600"
                  }`}
                >
                  ...
                </span>
              );
            }

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`px-3 md:px-4 py-1 md:py-2 rounded-md text-sm transition-colors duration-200 ${
                  pagination.currentPage === pageNum
                    ? resolvedTheme === "dark"
                      ? "bg-blue-600 text-white"
                      : "bg-blue-600 text-white"
                    : resolvedTheme === "dark"
                    ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

        <button
          onClick={() =>
            onPageChange(
              Math.min(pagination.totalPages, pagination.currentPage + 1)
            )
          }
          className={`px-3 md:px-4 py-1 md:py-2 rounded-md text-sm transition-colors duration-200 ${
            pagination.currentPage >= pagination.totalPages
              ? resolvedTheme === "dark"
                ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                : "bg-blue-100 text-blue-400 cursor-not-allowed"
              : resolvedTheme === "dark"
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

// Pagination Info Component
function PaginationInfo({
  pagination,
  resolvedTheme,
}: {
  pagination: PaginationData;
  resolvedTheme: string | undefined;
}) {
  return (
    <div
      className={`text-xs md:text-sm text-center px-2 transition-colors duration-200 ${
        resolvedTheme === "dark" ? "text-blue-400" : "text-blue-600"
      }`}
    >
      Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} to{" "}
      {Math.min(
        pagination.currentPage * pagination.itemsPerPage,
        pagination.totalItems
      )}{" "}
      of {pagination.totalItems} paid orders
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
