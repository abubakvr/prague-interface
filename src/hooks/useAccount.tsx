import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/lib/customFetch";
import { useRouter } from "next/navigation";

export const useAdminDetails = () => {
  const router = useRouter();
  const query = useQuery({
    queryKey: ["adminDetails"],
    queryFn: async () => {
      try {
        const response = await fetchData<{ data: { result: any } }>(
          `/api/p2p/account`
        );
        return response.data.result;
      } catch (error: any) {
        if (error?.status === 403) {
          router.push("/login");
        }
        throw error;
      }
    },
  });

  return { ...query, fetchData: query.refetch };
};

const fetchAdminBalance = async () => {
  const response = await fetchData<{ data: { balance: Array<any> } }>(
    "/api/p2p/balance"
  );
  return response.data.balance[0];
};

const fetchAdminBankBalance = async () => {
  return fetchData<{
    data: { availableBalance: number };
  }>("/api/payment/bank-balance").then(
    (response) => response.data.availableBalance
  );
};

export const fetchWalletInfo = async () => {
  try {
    return await fetchData<{
      data: {
        walletBalance: number;
        accountName: string;
        accountNumber: string;
        bankName: string;
      };
    }>("/api/wallet/wallet-info").then((response) => response.data);
  } catch (error: any) {
    console.error("Error fetching wallet info:", error.message);
    throw error;
  }
};

export async function fetchAdminAccountNumber(): Promise<string | null> {
  try {
    const response = await fetchData<{ data: { accountNumber: string } }>(
      "/api/keys/bank_account"
    );
    return response.data.accountNumber;
  } catch (error: any) {
    console.error("Error fetching bank account number:", error.message);
    return null;
  }
}

export async function fetchAdminAccountName(): Promise<string | null> {
  try {
    const response = await fetchData<{ data: { name: string } }>(
      "/api/auth/get-username"
    );
    return response.data.name;
  } catch (error: any) {
    console.error("Error fetching account name:", error.message);
    return null;
  }
}

export const useAdminBalance = () => {
  const query = useQuery({
    queryKey: ["adminBalance"],
    queryFn: fetchAdminBalance,
    refetchInterval: 20000,
  });

  return { ...query };
};

export const useAdminAccountNumber = () => {
  const query = useQuery({
    queryKey: ["accountNumber"],
    queryFn: fetchAdminAccountNumber,
  });

  return { ...query };
};

export const useAdminBankBalance = () => {
  const query = useQuery({
    queryKey: ["bankbalance"],
    queryFn: fetchAdminBankBalance,
    refetchInterval: 20000,
  });

  return { ...query };
};

export const useAdminAccountName = () => {
  const query = useQuery({
    queryKey: ["accountName"],
    queryFn: fetchAdminAccountName,
  });

  return { ...query };
};

export const useWalletInfo = () => {
  const query = useQuery({
    queryKey: ["walletInfo"],
    queryFn: fetchWalletInfo,
  });

  return { ...query };
};
