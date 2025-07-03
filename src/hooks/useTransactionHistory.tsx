import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/lib/customFetch";
import {
  TransactionHistoryResponse,
  TransactionHistoryParams,
} from "@/types/transaction";

export const getTransactionHistory = async (
  params: TransactionHistoryParams = {}
) => {
  try {
    const { pageSize = "10", pageNumber = "1" } = params;
    const queryParams = new URLSearchParams({
      pageSize,
      pageNumber,
    });

    const response = await fetchData<TransactionHistoryResponse>(
      `/api/payment/bank-history?${queryParams}`
    );
    return response;
  } catch (err: any) {
    console.error("Error fetching transaction history:", err.message);
    throw err;
  }
};

export const useTransactionHistory = (
  params: TransactionHistoryParams = {}
) => {
  const { pageSize = "10", pageNumber = "1" } = params;

  return useQuery({
    queryKey: ["transactionHistory", pageSize, pageNumber],
    queryFn: () => getTransactionHistory(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
