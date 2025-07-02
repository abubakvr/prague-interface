import { markPaidOrder, payAllOrders, paySingleOrder } from "@/hooks/useOrders";
import { OrderDetails } from "@/types/order";
import { toast } from "react-hot-toast";

export const markOrderAsPaid = async (
  orderId: string,
  paymentType: string,
  paymentId: string,
  setMarkingPaidOrderId: (id: string | null) => void,
  refetch: () => void
) => {
  setMarkingPaidOrderId(orderId);
  try {
    const response = await markPaidOrder(orderId, paymentType, paymentId);
    if (response.data.ret_msg === "SUCCESS") {
      toast.success("Order marked as paid successfully!");
      refetch();
    } else {
      toast.error("An error occurred");
    }
  } catch (error: any) {
    console.error("Error marking order as paid:", error);
    toast.error(`Error marking order as paid: ${error.message}`);
  } finally {
    setMarkingPaidOrderId(null);
  }
};

export const handlePayAllOrders = async (
  exportableOrders: OrderDetails[],
  setPayAllLoading: (loading: boolean) => void,
  refetch: () => void
) => {
  setPayAllLoading(true);
  try {
    const response = await payAllOrders(exportableOrders);
    console.log(response);
    if (response.data.success === true) {
      const paidOrders = response.data.transferCount;
      const unpaidOrders = exportableOrders.length - paidOrders;
      toast.success(
        `${paidOrders} orders paid. ${
          unpaidOrders > 0 && `${unpaidOrders} orders not paid`
        }`
      );
      refetch();
    } else {
      toast.error(`Payment failed for all orders`);
      console.error(response.data.message);
    }
  } catch (error: any) {
    console.error("Error paying order:", error);
    toast.error(`Could not pay orders: ${error.message}`);
  } finally {
    setPayAllLoading(false);
  }
};

export const handlePaySingleOrder = async (
  order: OrderDetails,
  setPayingOrderId: (id: string | null) => void,
  refetch: () => void
) => {
  setPayingOrderId(order.id);
  try {
    const response = await paySingleOrder(order);
    console.log(response);
    if (response.data.success === true) {
      toast.success(`Paid ${order.paymentTermList[0].realName}`);
      refetch();
    } else {
      toast.error(
        `API Payment failed for ${order.paymentTermList[0].realName}: ${response.data.message}`
      );
      console.error(response.data.message);
    }
  } catch (error: any) {
    console.error("Error paying order:", error);
    toast.error(`Could not pay order: ${error.message}`);
  } finally {
    setPayingOrderId(null);
  }
};
