import { BASE_URL } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";

export const fetchPersonalAds = async () => {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(`${BASE_URL}/api/p2p/ads/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data.result;
};

export const usePersonalAds = () => {
  const query = useQuery({
    queryKey: ["personalads"],
    queryFn: fetchPersonalAds,
  });

  return { ...query };
};
