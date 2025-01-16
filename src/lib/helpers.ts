import { OrderStatus } from "./constants";

export const getStatusText = (status: OrderStatus): string => {
  return OrderStatus[status].replace(/_/g, " ");
};

export const fetchData = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const rawData = await response.json();
  return rawData.data.result;
};
