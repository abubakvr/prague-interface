import { useCallback } from "react";
import { format } from "date-fns";

export function useFormatters() {
  const formatCurrency = useCallback((amount: string | number) => {
    // Convert string to number if needed and convert from kobo to naira
    const numericAmount =
      typeof amount === "string" ? parseFloat(amount) : amount;
    const amountInNaira = numericAmount / 100; // Convert kobo to naira

    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amountInNaira);
  }, []);

  const formatDate = useCallback((dateString: string) => {
    try {
      return format(new Date(dateString), "PPP p");
    } catch (error) {
      return "Invalid date";
    }
  }, []);

  return {
    formatCurrency,
    formatDate,
  };
}
