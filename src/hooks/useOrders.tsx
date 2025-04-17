import { BASE_URL } from "@/lib/constants";
import { fetchData } from "@/lib/helpers";
import {
  transformOrderToPaymentData,
  transformSingleOrderToPaymentData,
} from "@/lib/transformOrderToPaymentsData";
import { validatePaymentData } from "@/lib/validatePaymentInfo";
import { OrderDetails, OrderSide, OrderStatus } from "@/types/order";
import { IPaymentData } from "@/types/payment";
import { useQuery } from "@tanstack/react-query";

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
    if (response.ok) {
      const data = await response.json();
      return data.result;
    }
  } catch (err) {
    console.error("Error fetching sell orders:", err);
    throw err; // Re-throw the error to be handled by react-query
  }
};

export const getPendingOrders = async () => {
  try {
    return await fetchData(`${BASE_URL}/api/p2p/orders/pending`);
  } catch (err) {
    console.error("Error fetching pending orders:", err);
    throw err; // Re-throw the error
  }
};

export const getUserProfile = async (orderId: string, originalUid: string) => {
  try {
    return fetchData(
      `${BASE_URL}/api/p2p/orders/stats/${originalUid}/${orderId}`
    );
  } catch (err) {
    console.error("Error fetching user profile:", err);
    throw err; // Re-throw the error
  }
};

export const getOrderDetails = async (id: string) => {
  try {
    return fetchData(`${BASE_URL}/api/p2p/orders/${id}`);
  } catch (err) {
    console.error("Error fetching order details:", err);
    throw err; // Re-throw the error
  }
};

export const markPaidOrder = async (
  orderId: string,
  paymentType: string,
  paymentId: string
) => {
  try {
    const token = localStorage.getItem("accessToken");
    return await fetch(`${BASE_URL}/api/p2p/orders/pay`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId,
        paymentType,
        paymentId,
      }),
    });
  } catch (err) {
    console.error("Error fetching order details:", err);
    throw err;
  }
};

export const payAllOrders = async (orders: OrderDetails[]): Promise<any> => {
  try {
    const token = localStorage.getItem("accessToken");
    const transformedOrders = transformOrderToPaymentData(orders);
    const paymentDataArray = transformedOrders
      .map((order) => (order ? validatePaymentData(order) : null))
      .filter((result) => result && result.success)
      .map((result) => result?.data);

    return await fetch(`${BASE_URL}/api/payment/make-bulk-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ paymentDataArray }),
    });
  } catch (error: any) {
    console.error("Payment API error:", error);
  }
};

export const paySingleOrder = async (order: OrderDetails): Promise<any> => {
  try {
    const token = localStorage.getItem("accessToken");
    const transformedOrder = transformSingleOrderToPaymentData(
      order
    ) as IPaymentData;

    const validatedPaymentData = validatePaymentData(transformedOrder);

    if (validatedPaymentData.success !== true) {
      console.error("Payment API error:", validatedPaymentData.error);
      throw new Error("Payment API error:");
    }

    return await fetch(`${BASE_URL}/api/payment/make-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ paymentData: validatedPaymentData.data }),
    });
  } catch (error: any) {
    console.error("Payment API error:", error);
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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"; // Use your base URL or default to localhost
  const apiUrl = `${baseUrl}/api/pay-orders`;
  const token = localStorage.getItem("accessToken");
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      console.error("Error calling pay-orders route:", response);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data; // Or do something else with the response data
  } catch (error) {
    console.error("Error calling pay-orders route:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}
