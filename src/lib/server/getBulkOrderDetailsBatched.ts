import { getOrderDetails } from "./getOrderDetail";
import { OrderDetails } from "@/types/order";

// Helper to split array into chunks
const chunkArray = <T>(arr: T[], size: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

export const getBulkOrderDetailsBatched = async (
  orderIds: string[],
  token: string,
  batchSize = 5
): Promise<OrderDetails[]> => {
  const batches = chunkArray(orderIds, batchSize);
  let allOrderDetails: OrderDetails[] = [];

  for (const batch of batches) {
    const results = await Promise.all(
      batch.map(async (id) => {
        try {
          const details = await getOrderDetails(id, token);
          return {
            ...details,
            paymentTermList: Array.isArray(details.paymentTermList)
              ? details.paymentTermList
              : [],
          };
        } catch (err) {
          console.warn(`Failed to fetch order detail for ID ${id}:`, err);
          return null;
        }
      })
    );

    // Filter out any nulls (failed requests)
    allOrderDetails.push(...(results.filter(Boolean) as OrderDetails[]));

    // Optional: prevent rate limiting
    if (batches.length > 1) {
      await new Promise((res) => setTimeout(res, 50));
    }
  }

  return allOrderDetails;
};
