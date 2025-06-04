import { OrderSide } from "@/types/order";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/lib/customFetch";

export const fetchPersonalAds = async () => {
  try {
    const data = await fetchData("/api/p2p/ads/my");
    return data.result;
  } catch (err) {
    console.error("Error fetching personal ads:", err);
    throw err;
  }
};

export const usePersonalAds = () => {
  const query = useQuery({
    queryKey: ["personalads"],
    queryFn: fetchPersonalAds,
  });

  return { ...query };
};

export const fetchListedAds = async ({
  page = 0,
  size = 1,
  tokenId = "USDT",
  currencyId = "NGN",
  side = OrderSide.SELL,
}: {
  page: number;
  size: number;
  tokenId: string;
  currencyId: string;
  side: number;
}) => {
  try {
    const data = await fetchData("/api/p2p/ads/listings", {
      method: "POST",
      data: {
        page: String(page),
        size: String(size),
        currencyId,
        tokenId,
        side: String(side),
      },
    });
    return data.result;
  } catch (err) {
    console.error("Error fetching listed ads:", err);
    throw err;
  }
};

export const useListedAds = ({
  page = 0,
  size = 1,
  tokenId = "USDT",
  currencyId = "NGN",
  side = OrderSide.SELL,
}: {
  page?: number;
  size?: number;
  tokenId?: string;
  currencyId?: string;
  side?: number;
  status?: number;
}) => {
  const query = useQuery({
    queryKey: ["listedAds", page, size, tokenId, currencyId, side],
    queryFn: () => fetchListedAds({ page, size, side, tokenId, currencyId }),
    // Add this to prevent React Query from retrying on error
    retry: false,
  });

  return { ...query };
};
