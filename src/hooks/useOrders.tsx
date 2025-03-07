import { BASE_URL } from "@/lib/constants";
import { fetchData } from "@/lib/helpers";

export const getOrders = async ({
  page,
  size,
  status,
  side,
}: {
  page: number;
  size: number;
  status?: number;
  side?: number;
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
      console.log(data);
      console.log("token", token);
      return data.result;
    }
  } catch (err) {
    console.error("Error fetching sell orders:", err);
    throw err; // Re-throw the error to be handled by react-query
  }
};

export const getPendingOrders = async () => {
  try {
    return fetchData(`${BASE_URL}/api/p2p/orders/pending`);
  } catch (err) {
    console.error("Error fetching pending orders:", err);
    throw err; // Re-throw the error
  }
};

export const getUserProfile = async (
  order_id: string,
  original_uid: string
) => {
  try {
    return fetchData(
      `${BASE_URL}/api/p2p/orders/${order_id}/stats?original_uid=${original_uid}`
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
