import { OrderStatus } from "@/lib/constants";
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
      console.log(rawData);
      return rawData.data.result.items;
    },
  });

  return {
    ...query,
  };
};

export const releaseDigitalAsset = async (order_id: string) => {
  try {
    return await fetch(`http://localhost:8000/api/orders/release`, {
      method: "POST",
      headers: {
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
