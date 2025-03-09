import { BASE_URL } from "@/lib/constants";
import { OrderSide, OrderStatus } from "@/types/order";
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
  const token = localStorage.getItem("accessToken");
  const response = await fetch(`${BASE_URL}/api/p2p/ads/listings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      page: String(page),
      size: String(size),
      currencyId,
      tokenId,
      side: String(side),
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.result;
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
