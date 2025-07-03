import {
  transformOrderToPaymentData,
  transformSingleOrderToPaymentData,
} from "@/lib/transformOrderToPaymentsData";
import { validatePaymentData } from "@/lib/validatePaymentInfo";
import { OrderDetails, OrderSide, OrderStatus } from "@/types/order";
import { IPaymentData } from "@/types/payment";
import { useQuery } from "@tanstack/react-query";
import { fetchAdminAccountName, fetchAdminAccountNumber } from "./useAccount";
import { fetchData } from "@/lib/customFetch";

export const getOrders = async ({
  page,
  size,
  status,
  side,
}: {
  page: number;
  size: number;
  status: number;
  side: number;
}) => {
  try {
    const response = await fetchData("/api/p2p/orders", {
      method: "POST",
      data: {
        page,
        size,
        status,
        side,
      },
    });
    return response.data.result;
  } catch (err: any) {
    console.error("Error fetching sell orders:", err.message);
    throw err;
  }
};

export const getPendingOrders = async () => {
  try {
    return await fetchData("/api/p2p/orders/pending");
  } catch (err: any) {
    console.error("Error fetching pending orders:", err.message);
    throw err;
  }
};

export const getUserProfile = async (orderId: string, originalUid: string) => {
  try {
    const response = await fetchData(
      `/api/p2p/orders/stats/${originalUid}/${orderId}`
    );
    return response.data.result;
  } catch (err) {
    console.error("Error fetching user profile:", err);
    throw err;
  }
};

export const getOrderDetails = async (id: string) => {
  try {
    return await fetchData(`/api/p2p/orders/${id}`);
  } catch (err: any) {
    console.error("Error fetching order details:", err.message);
    throw err;
  }
};

export const markPaidOrder = async (
  orderId: string,
  paymentType: string,
  paymentId: string
) => {
  try {
    return await fetchData("/api/p2p/orders/pay", {
      method: "POST",
      data: {
        orderId,
        paymentType,
        paymentId,
      },
    });
  } catch (err: any) {
    console.error("Error marking order as paid:", err.message);
    throw err;
  }
};

export const payAllOrders = async (orders: OrderDetails[]): Promise<any> => {
  try {
    const accountNumber = (await fetchAdminAccountNumber()) ?? "";
    const accountName = (await fetchAdminAccountName()) ?? "";
    const transformedOrders = transformOrderToPaymentData(
      orders,
      accountName,
      accountNumber
    );
    const paymentDataArray = transformedOrders
      .map((order) => (order ? validatePaymentData(order) : null))
      .filter((result) => result && result.success)
      .map((result) => result?.data);

    return await fetchData<{ data: any }>("/api/payment/make-bulk-payment", {
      method: "POST",
      data: { paymentDataArray },
    });
  } catch (error: any) {
    console.error("Payment API error:", error.message);
    throw error;
  }
};

export const paySingleOrder = async (order: OrderDetails): Promise<any> => {
  try {
    const accountNumber = (await fetchAdminAccountNumber()) ?? "";
    const accountName = (await fetchAdminAccountName()) ?? "";
    const transformedOrder = transformSingleOrderToPaymentData(
      order,
      accountName,
      accountNumber
    ) as IPaymentData;

    const validatedPaymentData = validatePaymentData(transformedOrder);

    if (validatedPaymentData.success !== true) {
      console.error("Validation error:", validatedPaymentData.error);
      throw new Error(`Validation error: Could not validate user details`);
    }

    return await fetchData<{ data: any }>("/api/payment/make-payment", {
      method: "POST",
      data: { paymentData: validatedPaymentData.data },
    });
  } catch (error: any) {
    console.error("Payment API error:", error.message);
    throw error;
  }
};

export const useOrders = ({
  page = 0,
  size = 30,
  status = OrderStatus.FINISH_ORDER,
  side = OrderSide.SELL,
}: {
  page: number;
  size: number;
  side: number;
  status: number;
}) => {
  const query = useQuery({
    queryKey: ["listedAds", page, size, status, side],
    queryFn: () => getOrders({ page, size, side, status }),
  });

  return { ...query };
};

export async function payBulkOrders() {
  try {
    const response = await fetchData("/api/pay-orders", {
      method: "POST",
    });
    return response.data.result;
  } catch (error: any) {
    console.error("Error calling pay-orders route:", error.message);
    throw error;
  }
}
