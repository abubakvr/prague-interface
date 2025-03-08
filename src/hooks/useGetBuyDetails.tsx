import { useQuery } from "@tanstack/react-query";
import { OrderDetails, OrderStatus } from "@/types/order";
import { getOrderDetails } from "./useOrders";
import { BASE_URL } from "@/lib/constants";

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
  const query = useQuery({
    queryKey: ["orders", page, size, status, side],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${BASE_URL}/api/p2p/orders`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page,
          size,
          status,
          side,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const dataArray = data.result.items;
      const orderIds: string[] = dataArray.map((item: any) => item.id);
      const orderDetails = await getBulkOrderDetails(orderIds);
      return orderDetails;
    },
  });

  return {
    ...query,
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
