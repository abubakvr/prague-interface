import { useQuery } from "@tanstack/react-query";

export const fetchPersonalAds = async () => {
  const response = await fetch(`http://localhost:8000/api/ads/my`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const rawData = await response.json();
  console.log(rawData);
  return rawData.data.result;
};

export const usePersonalAds = () => {
  const query = useQuery({
    queryKey: ["personalads"],
    queryFn: fetchPersonalAds,
  });

  return { ...query };
};
