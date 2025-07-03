import { OrderStatus } from "@/types/order";
import { OrderSide } from "@/types/order";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/lib/customFetch";

export const useGetSellOrders = () => {
  const page = 1;
  const size = 30;
  const status = OrderStatus.WAITING_FOR_SELLER_RELEASE;
  const side = OrderSide.SELL;
  const query = useQuery({
    queryKey: ["releaseOrders"],
    queryFn: async () => {
      const response = await fetchData<{ data: { result: any } }>(
        "/api/p2p/orders",
        {
          method: "POST",
          data: {
            page,
            size,
            status,
            side,
          },
        }
      );
      return response.data.result.items;
    },
  });

  return {
    ...query,
  };
};

export const releaseDigitalAsset = async (order_id: string) => {
  try {
    return await fetchData("/api/p2p/orders/release", {
      method: "POST",
      data: {
        orderId: order_id,
      },
    });
  } catch (err: any) {
    console.error("Error fetching order details:", err.message);
    throw err.message;
  }
};
