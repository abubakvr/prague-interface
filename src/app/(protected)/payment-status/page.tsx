"use client";

import { Suspense } from "react";
import { usePaidOrders } from "@/hooks/usePaidOrders";
import { useTransactionStatus } from "@/hooks/useTransactionStatus";
import { DesktopTable } from "@/components/payment-status/DesktopTable";
import { MobileCards } from "@/components/payment-status/MobileCards";
import { Pagination } from "@/components/payment-status/Pagination";
import { PaginationInfo } from "@/components/payment-status/PaginationInfo";
import { TransactionStatusModal } from "@/components/payment-status/TransactionStatusModal";
import { LoadingState } from "@/components/payment-status/LoadingState";
import { ErrorState } from "@/components/payment-status/ErrorState";
import { EmptyState } from "@/components/payment-status/EmptyState";

// Main content component
function PaidOrdersContent() {
  const { paidOrders, pagination, loading, error, handlePageChange } =
    usePaidOrders();

  const {
    isModalOpen,
    selectedTransaction,
    transactionStatus,
    isCheckingStatus,
    checkTransactionStatus,
    closeModal,
  } = useTransactionStatus();

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <div className="container mx-auto md:py-4 md:px-4">
      <div className="space-y-4">
        {paidOrders.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Desktop Table View */}
            <DesktopTable
              paidOrders={paidOrders}
              onCheckStatus={checkTransactionStatus}
            />

            {/* Mobile Card View */}
            <MobileCards
              paidOrders={paidOrders}
              onCheckStatus={checkTransactionStatus}
            />

            {/* Pagination */}
            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
            />

            {/* Pagination Info */}
            <PaginationInfo pagination={pagination} />
          </>
        )}
      </div>

      {/* Transaction Status Modal */}
      <TransactionStatusModal
        isOpen={isModalOpen}
        selectedTransaction={selectedTransaction}
        transactionStatus={transactionStatus}
        isCheckingStatus={isCheckingStatus}
        onClose={closeModal}
      />
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
