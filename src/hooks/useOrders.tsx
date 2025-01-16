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
    if (response.ok) {
      const rawData = await response.json();
      return rawData.data.result;
    }
  } catch (err) {
    console.error("Error fetching sell orders:", err);
    throw err; // Re-throw the error to be handled by react-query
  }
};

export const getPendingOrders = async () => {
  try {
    const response = await fetch("http://localhost:8000/orders/pending");
    if (response.ok) {
      const data = await response.json();
      return data;
    }
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
    const response = await fetch(
      `http://localhost:8000/api/orders/${order_id}/stats?original_uid=${original_uid}`
    );
    if (response.ok) {
      const rawData = await response.json();
      return rawData.data.result;
    }
  } catch (err) {
    console.error("Error fetching user profile:", err);
    throw err; // Re-throw the error
  }
};

export const getOrderDetails = async (id: string) => {
  try {
    const response = await fetch(`http://localhost:8000/api/orders/${id}`);
    if (response.ok) {
      const rawData = await response.json();
      return rawData.data.result;
    }
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
    return await fetch(`http://localhost:8000/api/orders/pay`, {
      method: "POST",
      headers: {
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
