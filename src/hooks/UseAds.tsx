import { fetchData } from "@/lib/helpers";
import { useQuery } from "@tanstack/react-query";

export const usePersonalAds = () => {
  const query = useQuery({
    queryKey: ["adminDetails"],
    queryFn: () => fetchData("http://localhost:8000/api/ads/my"),
  });

  return { ...query };
};
