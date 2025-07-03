"use client";
import { transformOrderToPaymentData } from "@/lib/transformOrderToPaymentsData";
import { validatePaymentData } from "@/lib/validatePaymentInfo";
import { OrderDetails } from "@/types/order";
import { fetchData } from "@/lib/customFetch";
import { useState } from "react";

interface UsePayOrdersResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  payAllOrders: (paymentDataArray: OrderDetails[]) => Promise<void>;
}

interface PaymentResponse {
  success: boolean;
  message: string;
  data?:
    | {
        transferCount?: number;
      }
    | string;
}

export function usePayOrders<T = PaymentResponse>(): UsePayOrdersResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const payAllOrders = async (orders: OrderDetails[]) => {
    setLoading(true);
    setError(null);

    try {
      const transformedOrders = transformOrderToPaymentData(orders, "", "");
      const paymentDataArray = transformedOrders
        .map((order) => (order ? validatePaymentData(order) : null))
        .filter((result) => result && result.success)
        .map((result) => result?.data);

      const response = await fetchData<{ data: any }>(
        "/api/payment/make-bulk-payment",
        {
          method: "POST",
          data: { paymentDataArray },
        }
      );

      setData(response.data);
    } catch (error: any) {
      console.error("Payment API error:", error.message);
      throw error.message;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, payAllOrders };
}
