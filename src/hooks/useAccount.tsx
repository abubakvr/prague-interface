import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/lib/customFetch";
import { useRouter } from "next/navigation";

export const useAdminDetails = () => {
  const router = useRouter();
  const query = useQuery({
    queryKey: ["adminDetails"],
    queryFn: async () => {
      try {
        const data = await fetchData(`/api/p2p/account`);
        return data.result;
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
  return fetchData<{ result: { balance: Array<any> } }>(
    "/api/p2p/balance"
  ).then((data) => data.result.balance[0]);
};

const fetchAdminBankBalance = async () => {
  return fetchData<{ data: { availableBalance: number } }>(
    "/api/payment/bank-balance"
  ).then((data) => data.data.availableBalance);
};

const fetchWalletInfo = async () => {
  return fetchData<{
    walletBalance: number;
    accountName: string;
    accountNumber: string;
    bankName: string;
  }>("/api/wallet/wallet-info").then((data) => data);
};

export async function fetchAdminAccountNumber(): Promise<string | null> {
  try {
    const data = await fetchData<{ accountNumber: string }>(
      "/api/keys/bank_account"
    );
    return data.accountNumber;
  } catch (error) {
    console.error("Error fetching bank account number:", error);
    return null;
  }
}

export async function fetchAdminAccountName(): Promise<string | null> {
  try {
    const data = await fetchData<{ name: string }>("/api/auth/get-username");
    return data.name;
  } catch (error) {
    console.error("Error fetching account name:", error);
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
