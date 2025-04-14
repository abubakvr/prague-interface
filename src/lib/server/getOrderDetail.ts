import { OrderDetails } from "@/types/order";
import { BASE_URL } from "@/lib/constants";

export const getOrderDetails = async (
  id: string,
  token: string
): Promise<OrderDetails> => {
  try {
    const response = await fetch(`${BASE_URL}/api/p2p/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch order");
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(`❌ Error fetching order ${id}:`, err);
    throw err;
  }
};
