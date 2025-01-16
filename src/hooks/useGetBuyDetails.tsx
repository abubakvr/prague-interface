import { useEffect, useState } from "react";
import { OrderDetails, OrderStatus } from "@/types/order";
import { getOrderDetails } from "./useOrders";

export const useGetOrders = ({
  page,
  size,
  status = OrderStatus.WAITING_FOR_BUY_PAY,
  side = 0,
}: {
  page: number;
  size: number;
  status?: number;
  side?: number;
}) => {
  const [data, setData] = useState<OrderDetails[] | undefined>(undefined);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page,
          size,
          status,
          side,
        }),
      });
      if (response.ok) {
        const rawData = await response.json();
        const dataArray = rawData.data.result.items;
        const getOrderId: string[] = dataArray.map((item: any) => item.id);
        const getBulkOrders = await getBulkOrderDetails(getOrderId);
        setData(getBulkOrders);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred")
      );
      console.error("Error fetching buy orders:", err);
      throw new Error(`Error! ${err}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    data,
    error,
    loading,
    fetchOrders,
  };
};

export const getBulkOrderDetails = async (
  orderIds: string[]
): Promise<OrderDetails[]> => {
  try {
    const orderDetailsPromises = orderIds.map((id) => getOrderDetails(id));
    const orderDetails = await Promise.all(orderDetailsPromises);
    return orderDetails.filter((detail: any) => detail !== undefined); // Filter out any failed requests
  } catch (err) {
    console.error("Error fetching bulk order details:", err);
    return [];
  }
};
