import { useQuery } from "@tanstack/react-query";
import { OrderDetails, OrderStatus } from "@/types/order";
import { fetchData } from "@/lib/customFetch";
import { fetchData as fetchData2 } from "@/lib/helpers";

const getOrderDetails = async (id: string): Promise<OrderDetails> => {
  try {
    const data = await fetchData(`/api/p2p/orders/${id}`);
    if (!data) throw new Error("No data returned from API");
    return data.result;
  } catch (err: any) {
    console.error("Error fetching order details:", err);
    throw err;
  }
};

// Helper function to chunk an array into smaller arrays
const chunkArray = <T = any,>(array: T[], chunkSize: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
};

export const useGetOrders = ({
  page,
  size,
  status = OrderStatus.WAITING_FOR_BUY_PAY,
  side = 0,
}: {
  page: number;
  size: number;
  status?: OrderStatus;
  side?: number;
}) => {
  const query = useQuery({
    queryKey: ["orders", page, size, status, side],
    queryFn: async () => {
      try {
        const data = await fetchData("/api/p2p/orders", {
          method: "POST",
          data: {
            page,
            size,
            status,
            side,
          },
        });

        if (!data?.result?.items || !Array.isArray(data.result.items)) {
          console.warn("API returned unexpected data structure");
          return [];
        }

        const dataArray = data.result.items;
        const orderIds = dataArray.map((item: any) => item.id).filter(Boolean);

        if (orderIds.length === 0) {
          return [];
        }

        // Fetch order details in optimized batches
        const orderDetails = await getBulkOrderDetailsBatched(orderIds);
        console.log("orderDetails", orderDetails);

        return orderDetails;
      } catch (error: any) {
        console.error("Error in useGetOrders:", error);
        throw error;
      }
    },
    refetchInterval: 30000, // Refetch every 0.5 minutes (30000 milliseconds)
    refetchIntervalInBackground: true,
  });

  return query;
};

// New function to fetch order details in batches
export const getBulkOrderDetailsBatched = async (
  orderIds: string[],
  batchSize = 5 // Adjust this based on server capabilities
): Promise<OrderDetails[]> => {
  try {
    // Split the order IDs into smaller chunks
    const batches = chunkArray(orderIds, batchSize);
    let allOrderDetails: OrderDetails[] = [];

    // Process each batch of order IDs
    for (const batch of batches) {
      // Process this batch concurrently
      const batchPromises = batch.map(async (id) => {
        try {
          const details = await getOrderDetails(id);
          return {
            ...details,
            paymentTermList: Array.isArray(details.paymentTermList)
              ? details.paymentTermList
              : [],
          };
        } catch (error: any) {
          console.error(`Failed to fetch order details for ID ${id}:`, error);
          return null;
        }
      });

      // Wait for the current batch to complete
      const batchResults = await Promise.all(batchPromises);
      const validResults = batchResults.filter(
        (result): result is OrderDetails =>
          result !== null && result !== undefined
      );

      // Add the results to our collection
      allOrderDetails = [...allOrderDetails, ...validResults];

      // Add a small delay between batches to avoid overwhelming the server
      if (batches.length > 1) {
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    }

    return allOrderDetails;
  } catch (err: any) {
    console.error("Error fetching bulk order details in batches:", err);
    return [];
  }
};
