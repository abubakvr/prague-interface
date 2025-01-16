import { fetchData } from "@/lib/helpers";
import { useQuery } from "@tanstack/react-query";

export const useAdminDetails = () => {
  const query = useQuery({
    queryKey: ["adminDetails"],
    queryFn: () => fetchData("http://localhost:8000/api/account"),
  });

  return { ...query, fetchData: query.refetch };
};

const fetchAdminBalance = async () => {
  const response = await fetch(`http://localhost:3000/api/getbalance`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data.result.balance[0];
};

export const useAdminBalance = () => {
  const query = useQuery({
    queryKey: ["adminBalance"],
    queryFn: fetchAdminBalance,
  });

  return { ...query };
};

const fetchAdminPayment = async () => {
  const response = await fetch(`http://localhost:3000/api/getbalance`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const rawData = await response.json();
  return rawData.data.result;
};

export const useAdminPayment = () => {
  const query = useQuery({
    queryKey: ["adminPayment"],
    queryFn: fetchAdminPayment,
  });

  return { ...query };
};
