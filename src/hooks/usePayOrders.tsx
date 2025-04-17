"use client";
import { BASE_URL } from "@/lib/constants";
import { transformOrderToPaymentData } from "@/lib/transformOrderToPaymentsData";
import { validatePaymentData } from "@/lib/validatePaymentInfo";
import { OrderDetails } from "@/types/order";
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
      const token = localStorage.getItem("accessToken");
      console.log("Orders Length", orders.length);
      const transformedOrders = transformOrderToPaymentData(orders);
      const paymentDataArray = transformedOrders
        .map((order) => (order ? validatePaymentData(order) : null))
        .filter((result) => result && result.success)
        .map((result) => result?.data);

      const response = await fetch(
        `${BASE_URL}/api/payment/make-bulk-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ paymentDataArray }),
        }
      );
      if (!response.ok) {
        console.error("Payment API error:", response);
        throw new Error(
          `Payment API failed with status: ${response.status} and message: ${response.statusText}`
        );
      }
      const responseData = (await response.json()) as T;
      setData(responseData);
    } catch (error: any) {
      console.error("Payment API error:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, payAllOrders };
}
