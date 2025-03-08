"use client";

import { useState, useEffect } from "react";
import { getOrders } from "@/hooks/useOrders";
import { OrderTable } from "@/components/OrderTable";
import { OrderListResponse } from "@/types/order";
import { FilterControls } from "@/components/FilterControls";
import { Pagination } from "@/components/Pagination";

export default function Page() {
  // Set state with default values
  const [currentPage, setCurrentPage] = useState(1);
  const [currentStatus, setCurrentStatus] = useState(50);
  const [currentSide, setCurrentSide] = useState(0);
  const [response, setResponse] = useState<OrderListResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const pageSize = 30;
  const totalPages = response ? Math.ceil(response.count / pageSize) : 0;

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      try {
        const data = await getOrders({
          page: currentPage,
          size: pageSize,
          side: currentSide,
          status: currentStatus,
        });
        setResponse(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [currentPage, currentStatus, currentSide]);

  if (loading && !response) {
    return <div>Loading...</div>;
  }

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

      {response?.items?.length ? (
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
