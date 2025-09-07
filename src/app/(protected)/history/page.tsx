"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { useTransactionHistory } from "@/hooks/useTransactionHistory";
import { useTheme } from "@/context/ThemeContext";

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

function TransactionHistoryContent() {
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "25");

  const { data, isLoading, error, refetch } = useTransactionHistory({
    pageNumber: page.toString(),
    pageSize: limit.toString(),
  });

  const handlePageChange = (newPage: number) => {
    router.push(`/history?page=${newPage}&limit=${limit}`);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP p");
    } catch (error) {
      return "Invalid date";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount / 100);
  };

  const getTransactionTypeColor = (entryCode: string) => {
    console.log(entryCode);
    return entryCode.startsWith("D")
      ? resolvedTheme === "dark"
        ? "bg-red-900/50 text-red-300"
        : "bg-red-100 text-red-800"
      : resolvedTheme === "dark"
      ? "bg-green-900/50 text-green-300"
      : "bg-green-100 text-green-800";
  };

  const getTransactionTypeText = (entryCode: string) => {
    return entryCode.startsWith("D") ? "Debit" : "Credit";
  };

  if (isLoading) {
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
            resolvedTheme === "dark" ? "text-blue-400" : "text-blue-600"
          }`}
        >
          Loading transaction history...
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
          {error instanceof Error
            ? error.message
            : "Failed to load transaction history"}
        </p>
        <button
          onClick={() => refetch()}
          className={`px-4 py-2 rounded transition-colors duration-200 ${
            resolvedTheme === "dark"
              ? "bg-gradient-to-r from-slate-700 to-slate-700 text-slate-100"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
          }`}
        >
          Try Again
        </button>
      </div>
    );
  }

  const transactions = data?.data?.postingsHistory || [];
  const totalRecords = data?.data?.totalRecordInStore || 0;
  const totalPages = Math.ceil(totalRecords / limit);

  const pagination: PaginationData = {
    currentPage: page,
    totalPages,
    totalItems: totalRecords,
    itemsPerPage: limit,
  };

  return (
    <div className="container mx-auto md:py-4 md:px-4">
      <div className="space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div
            className={`rounded-lg shadow-md p-4 border transition-colors duration-200 ${
              resolvedTheme === "dark"
                ? "bg-slate-800 border-slate-600"
                : "bg-white border-gray-200"
            }`}
          >
            <h3
              className={`text-sm font-medium mb-1 transition-colors duration-200 ${
                resolvedTheme === "dark" ? "text-slate-400" : "text-gray-500"
              }`}
            >
              Total Transactions
            </h3>
            <p
              className={`text-2xl font-bold transition-colors duration-200 ${
                resolvedTheme === "dark" ? "text-slate-100" : "text-blue-900"
              }`}
            >
              {totalRecords.toLocaleString()}
            </p>
          </div>
          <div
            className={`rounded-lg shadow-md p-4 border transition-colors duration-200 ${
              resolvedTheme === "dark"
                ? "bg-slate-800 border-slate-600"
                : "bg-white border-gray-200"
            }`}
          >
            <h3
              className={`text-sm font-medium mb-1 transition-colors duration-200 ${
                resolvedTheme === "dark" ? "text-slate-400" : "text-gray-500"
              }`}
            >
              Total Credit
            </h3>
            <p
              className={`text-2xl font-bold transition-colors duration-200 ${
                resolvedTheme === "dark" ? "text-green-400" : "text-green-600"
              }`}
            >
              {formatCurrency((data?.data?.totalCredit || 0) * 100)}
            </p>
          </div>
          <div
            className={`rounded-lg shadow-md p-4 border transition-colors duration-200 ${
              resolvedTheme === "dark"
                ? "bg-slate-800 border-slate-600"
                : "bg-white border-gray-200"
            }`}
          >
            <h3
              className={`text-sm font-medium mb-1 transition-colors duration-200 ${
                resolvedTheme === "dark" ? "text-slate-400" : "text-gray-500"
              }`}
            >
              Total Debit
            </h3>
            <p
              className={`text-2xl font-bold transition-colors duration-200 ${
                resolvedTheme === "dark" ? "text-red-400" : "text-red-600"
              }`}
            >
              {formatCurrency((data?.data?.totalDebit || 0) * 100)}
            </p>
          </div>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <p
              className={`transition-colors duration-200 ${
                resolvedTheme === "dark" ? "text-slate-400" : "text-gray-500"
              }`}
            >
              No transactions found
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <div className="min-w-full inline-block align-middle">
                <div
                  className={`overflow-hidden shadow-lg rounded-lg transition-colors duration-200 ${
                    resolvedTheme === "dark" ? "bg-slate-800" : "bg-white"
                  }`}
                >
                  <table
                    className={`min-w-full divide-y transition-colors duration-200 ${
                      resolvedTheme === "dark"
                        ? "divide-slate-700"
                        : "divide-blue-100"
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
                        <th className="text-left p-4 font-semibold text-sm">
                          Type
                        </th>
                        <th className="text-left p-4 font-semibold text-sm">
                          Amount
                        </th>
                        <th className="text-left p-4 font-semibold text-sm">
                          Beneficiary
                        </th>
                        <th className="text-left p-4 font-semibold text-sm">
                          Reference
                        </th>
                        <th className="text-left p-4 font-semibold text-sm">
                          Date
                        </th>
                        <th className="text-left p-4 font-semibold text-sm">
                          Balance After
                        </th>
                      </tr>
                    </thead>
                    <tbody
                      className={`divide-y transition-colors duration-200 ${
                        resolvedTheme === "dark"
                          ? "bg-slate-800 divide-slate-700"
                          : "bg-slate-50 divide-blue-50"
                      }`}
                    >
                      {transactions.map((transaction) => (
                        <tr
                          key={
                            transaction.referenceNumber + transaction.entryCode
                          }
                          className={`transition-colors duration-150 ${
                            resolvedTheme === "dark"
                              ? "hover:bg-slate-700"
                              : "hover:bg-blue-50"
                          }`}
                        >
                          <td className="p-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getTransactionTypeColor(
                                transaction.entryCode
                              )}`}
                            >
                              {getTransactionTypeText(transaction.entryCode)}
                            </span>
                          </td>
                          <td
                            className={`p-4 text-sm font-semibold transition-colors duration-200 ${
                              resolvedTheme === "dark"
                                ? "text-slate-100"
                                : "text-blue-900"
                            }`}
                          >
                            {formatCurrency(transaction.amount)}
                          </td>
                          <td
                            className={`p-4 text-sm transition-colors duration-200 ${
                              resolvedTheme === "dark"
                                ? "text-slate-200"
                                : "text-blue-900"
                            }`}
                          >
                            <div
                              className="max-w-xs truncate"
                              title={transaction.beneficiaryName}
                            >
                              {transaction.beneficiaryName}
                            </div>
                          </td>
                          <td
                            className={`p-4 text-sm transition-colors duration-200 ${
                              resolvedTheme === "dark"
                                ? "text-slate-200"
                                : "text-blue-900"
                            }`}
                          >
                            <div
                              className="max-w-xs truncate"
                              title={transaction.referenceNumber}
                            >
                              {transaction.referenceNumber}
                            </div>
                          </td>
                          <td
                            className={`p-4 text-sm transition-colors duration-200 ${
                              resolvedTheme === "dark"
                                ? "text-slate-200"
                                : "text-blue-900"
                            }`}
                          >
                            {formatDate(transaction.realDate)}
                          </td>
                          <td
                            className={`p-4 text-sm transition-colors duration-200 ${
                              resolvedTheme === "dark"
                                ? "text-slate-200"
                                : "text-blue-900"
                            }`}
                          >
                            {formatCurrency(transaction.balanceAfter)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.referenceNumber + transaction.entryCode}
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
                          resolvedTheme === "dark"
                            ? "text-slate-100"
                            : "text-blue-900"
                        }`}
                      >
                        {formatCurrency(transaction.amount)}
                      </p>
                      <p
                        className={`text-sm mt-1 transition-colors duration-200 ${
                          resolvedTheme === "dark"
                            ? "text-slate-300"
                            : "text-gray-600"
                        }`}
                      >
                        {transaction.beneficiaryName}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${getTransactionTypeColor(
                        transaction.entryCode
                      )}`}
                    >
                      {getTransactionTypeText(transaction.entryCode)}
                    </span>
                  </div>
                  <div
                    className={`space-y-2 text-xs transition-colors duration-200 ${
                      resolvedTheme === "dark"
                        ? "text-slate-400"
                        : "text-gray-500"
                    }`}
                  >
                    <div>Ref: {transaction.referenceNumber}</div>
                    <div>{formatDate(transaction.realDate)}</div>
                    <div>
                      Balance: {formatCurrency(transaction.balanceAfter)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="flex space-x-1">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      page <= 1
                        ? resolvedTheme === "dark"
                          ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : resolvedTheme === "dark"
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    Previous
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                          pageNum === page
                            ? resolvedTheme === "dark"
                              ? "bg-blue-600 text-white"
                              : "bg-blue-600 text-white"
                            : resolvedTheme === "dark"
                            ? "text-slate-300 bg-slate-700 border border-slate-600 hover:bg-slate-600"
                            : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      page >= totalPages
                        ? resolvedTheme === "dark"
                          ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : resolvedTheme === "dark"
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            <div
              className={`text-xs md:text-sm mt-4 text-center px-2 transition-colors duration-200 ${
                resolvedTheme === "dark" ? "text-blue-400" : "text-blue-600"
              }`}
            >
              Showing{" "}
              {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} to{" "}
              {Math.min(
                pagination.currentPage * pagination.itemsPerPage,
                pagination.totalItems
              )}{" "}
              of {pagination.totalItems} transactions
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Loading fallback for Suspense
function TransactionHistoryLoading() {
  const { resolvedTheme } = useTheme();
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
          resolvedTheme === "dark" ? "text-blue-400" : "text-blue-600"
        } text-sm md:text-base`}
      >
        Loading transaction history...
      </span>
    </div>
  );
}

export default function TransactionHistoryPage() {
  return (
    <Suspense fallback={<TransactionHistoryLoading />}>
      <TransactionHistoryContent />
    </Suspense>
  );
}
