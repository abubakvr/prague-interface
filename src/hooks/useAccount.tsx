import { BASE_URL } from "@/lib/constants";
import { fetchData } from "@/lib/helpers";
import { useQuery } from "@tanstack/react-query";

export const useAdminDetails = () => {
  const query = useQuery({
    queryKey: ["adminDetails"],
    queryFn: () => fetchData(`${BASE_URL}/api/p2p/account`),
  });

  return { ...query, fetchData: query.refetch };
};

const fetchAdminBalance = async () => {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(`${BASE_URL}/api/p2p/balance`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
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
