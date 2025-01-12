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
    const response = await fetch(`http://localhost:8000/api/balance`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const rawData = await response.json();
    return rawData.data.result;
  } catch (err) {
    console.error("Error fetching user profile:", err);
  }
};
