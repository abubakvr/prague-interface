import { OrderDetails } from "@/types/order";
import { getOrderDetails } from "./useOrders";

export const getOrders = async ({
  page,
  size,
  status = 50,
  side = 0,
}: {
  page: number;
  size: number;
  status?: number;
  side?: number;
}): Promise<OrderDetails[] | undefined> => {
  try {
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
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const rawData = await response.json();
    const dataArray = rawData.data.result.items;
    const getOrderId: string[] = dataArray.map((item: any) => item.id);
    const getBulkOrders = await getBulkOrderDetails(getOrderId);
    return getBulkOrders;
  } catch (err) {
    console.error("Error fetching buy orders:", err);
  }
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
