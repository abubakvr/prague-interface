"use client";

import { useState } from "react";
import { useOrders } from "@/hooks/useOrders";
import { OrderTable } from "@/components/OrderTable";
import { FilterControls } from "@/components/FilterControls";
import { Pagination } from "@/components/Pagination";

export default function Page() {
  // Set state with default values
  const [currentPage, setCurrentPage] = useState(1);
  const [currentStatus, setCurrentStatus] = useState(50);
  const [currentSide, setCurrentSide] = useState(0);
  const { data: response, isLoading } = useOrders({
    page: currentPage,
    size: 30,
    side: currentSide,
    status: currentStatus,
  });

  const pageSize = 30;
  const totalPages = response ? Math.ceil(response.count / pageSize) : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-gray-500">
          Total Orders: {response?.count || 0}
        </div>
      </div>

      <FilterControls
        currentStatus={currentStatus}
        currentSide={currentSide}
        setCurrentStatus={setCurrentStatus}
        setCurrentSide={setCurrentSide}
        setCurrentPage={setCurrentPage}
      />

      {isLoading ? (
        <div className="w-full flex flex-col gap-y-5 h-screen items-center text-center mt-16">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          <p className="text-blue-700 font-medium">
            Fetching orders. Please wait
          </p>
        </div>
      ) : response?.items ? (
        <OrderTable orders={response.items} />
      ) : (
        <p className="">No order match the filter</p>
      )}

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        currentSide={currentSide}
        currentStatus={currentStatus}
        setCurrentPage={setCurrentPage}
        setCurrentStatus={setCurrentStatus}
        setCurrentSide={setCurrentSide}
      />
    </div>
  );
}
