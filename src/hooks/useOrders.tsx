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
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const rawData = await response.json();
    return rawData.data.result;
  } catch (err) {
    console.error("Error fetching sell orders:", err);
  }
};

export const getPendingOrders = async () => {
  try {
    const response = await fetch("http://localhost:8000/orders/pending");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching pending orders:", err);
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
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const rawData = await response.json();
    return rawData.data.result;
  } catch (err) {
    console.error("Error fetching user profile:", err);
  }
};

export const getOrderDetails = async (id: string) => {
  try {
    const response = await fetch(`http://localhost:8000/api/orders/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const rawData = await response.json();
    return rawData.data.result;
  } catch (err) {
    console.error("Error fetching order details:", err);
  }
};

export const getMyPayments = async () => {
  try {
    const response = await fetch("http://localhost:8000/payments");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching payment methods:", err);
  }
};
