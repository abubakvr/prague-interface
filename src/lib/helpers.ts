import { OrderStatus } from "./constants";

export const getStatusText = (status: OrderStatus): string => {
  return OrderStatus[status].replace(/_/g, " ");
};
