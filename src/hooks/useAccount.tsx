export const getAdminDetail = async () => {
  try {
    const response = await fetch(`http://localhost:8000/api/account`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const rawData = await response.json();
    return rawData.data.result;
  } catch (err) {
    console.error("Error fetching user profile:", err);
  }
};

export const getAdminBalance = async () => {
  try {
    const response = await fetch(`http://localhost:3000/api/getbalance`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.result.balance[0];
  } catch (err) {
    console.error("Error fetching user profile:", err);
  }
};

export const getAdminPaymentMethod = async () => {
  try {
    const response = await fetch("http://localhost:8000/api/payments");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const rawData = await response.json();
    return rawData.data.result;
  } catch (err) {
    console.error("Error fetching payment methods:", err);
    throw err; // Re-throw the error
  }
};
