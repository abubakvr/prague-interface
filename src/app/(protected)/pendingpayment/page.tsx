"use client";

import { useState, useEffect } from "react";
import { getOrders } from "@/hooks/useOrders";
import { OrderTable } from "@/components/OrderTable";
import { OrderListResponse, OrderSide, OrderStatus } from "@/types/order";

export default function Page() {
  const [currentPage, setCurrentPage] = useState(1);
  const currentStatus = OrderStatus.WAITING_FOR_BUY_PAY;
  const currentSide = OrderSide.BUY;
  const pageSize = 30;

  const [response, setResponse] = useState<OrderListResponse | null>(null);
  const [loading, setLoading] = useState(true);

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
  }, [currentPage, currentSide, currentStatus, pageSize]);

  if (loading || !response) {
    return (
      <div className="w-full flex flex-col gap-y-5 h-screen items-center text-center mt-16">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        <p className="text-blue-700 font-medium">
          Fetching orders. Please wait
        </p>
      </div>
    );
  }

  const totalPages = Math.ceil(response.count / pageSize);

  const handlePageChange = (pageNum: number) => {
    setCurrentPage(pageNum);
  };

  return (
    <div className="">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-gray-500">
          Total Orders: {response.count}
        </div>
      </div>

      <OrderTable orders={response.items} />

      <div className="mt-6 flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => handlePageChange(pageNum)}
            className={`px-3 py-1 border rounded ${
              pageNum === currentPage
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {pageNum}
          </button>
        ))}
      </div>
    </div>
  );
}
