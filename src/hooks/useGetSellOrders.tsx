import { BASE_URL } from "@/lib/constants";
import { OrderStatus } from "@/types/order";
import { OrderSide } from "@/types/order";
import { useQuery } from "@tanstack/react-query";

export const useGetSellOrders = () => {
  const page = 1;
  const size = 30;
  const status = OrderStatus.WAITING_FOR_SELLER_RELEASE;
  const side = OrderSide.SELL;
  const query = useQuery({
    queryKey: ["releaseOrders"],
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
      return data.result.items;
    },
  });

  return {
    ...query,
  };
};

export const releaseDigitalAsset = async (order_id: string) => {
  try {
    const token = localStorage.getItem("accessToken");
    return await fetch(`${BASE_URL}/api/p2p/orders/release`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId: order_id,
      }),
    });
  } catch (err) {
    console.error("Error fetching order details:", err);
    throw err;
  }
};
