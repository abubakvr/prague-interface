import { OrderDetails, OrderStatus } from "@/types/order";
import { BASE_URL } from "@/lib/constants";
import { getBulkOrderDetailsBatched } from "./getBulkOrderDetailsBatched"; // move this too if needed

export const getOrdersServerSide = async ({
  token,
  page = 1,
  size = 30,
  status = OrderStatus.FINISH_ORDER,
  side = 0,
}: {
  token: string;
  page?: number;
  size?: number;
  status?: OrderStatus;
  side?: number;
}): Promise<any[]> => {
  try {
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
      throw new Error(`Failed to fetch orders: ${response.status}`);
    }

    const data = await response.json();
    const items = data?.result?.items;
    if (!Array.isArray(items)) {
      throw new Error("Unexpected data format from orders API");
    }

    const orderIds = items.map((item: any) => item.id).filter(Boolean);

    if (orderIds.length === 0) return [];

    const orderDetails = await getBulkOrderDetailsBatched(orderIds, token); // update to accept token
    console.log("orderDetails");
    return orderDetails;
  } catch (error) {
    console.error("🔥 Error in getOrdersServerSide:", error);
    return [];
  }
};
