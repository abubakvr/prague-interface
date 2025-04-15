// ... existing code ...

import { BASE_URL } from "@/lib/constants";
import { OrderSide } from "@/types/order";
import { useQuery } from "@tanstack/react-query";

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

// New function to fetch multiple pages and apply filters
export const fetchFilteredListedAds = async ({
  tokenId = "USDT",
  currencyId = "NGN",
  side = OrderSide.SELL,
  minAmount = 0,
  minSuccessRate = 0,
  pagesToFetch = 5,
  authTag = "",
}: {
  tokenId?: string;
  currencyId?: string;
  side?: OrderSide;
  minAmount?: number;
  minSuccessRate?: number;
  pagesToFetch?: number;
  authTag?: string;
}) => {
  const allAds: any[] = [];

  // Fetch multiple pages
  for (let page = 0; page < pagesToFetch; page++) {
    try {
      const result = await fetchListedAds({
        page,
        size: 30, // Maximum page size
        tokenId,
        currencyId,
        side,
      });

      if (result.items?.length) {
        allAds.push(...result.items);
      } else {
        break; // No more items to fetch
      }
    } catch (error) {
      console.error("Error fetching ads page", page, error);
      break;
    }
  }

  // Apply filtering
  const filteredAds = allAds.filter((ad) => {
    // Filter by minimum amount
    if (minAmount > 0) {
      const adMinAmount = parseFloat(ad.minAmount);
      const adMaxAmount = parseFloat(ad.maxAmount);
      if (adMinAmount > minAmount || minAmount > adMaxAmount) return false;
    }

    // Filter by success rate
    if (minSuccessRate > 0) {
      // Use recentExecuteRate as the success rate
      const successRate = ad.recentExecuteRate || 0;
      if (successRate < minSuccessRate) return false;
    }

    // Filter by auth tag if specified
    if (authTag && authTag !== "") {
      // Check if the ad has auth tags and if the specified tag is included
      if (!ad.authTag || !Array.isArray(ad.authTag)) return false;

      // Check if the required auth tag is present in the ad's auth tags
      if (!ad.authTag.includes(authTag)) return false;
    }

    return true;
  });

  // Filter by payment method to ensure bank transfer is included
  const paymentMethodFilteredAds = filteredAds.filter((ad) => {
    // Check if the ad has payment methods and if bank transfer is included
    return (
      ad.payments &&
      ad.payments.some((method: any) => method.toLowerCase().includes("14"))
    );
  });

  // Sort by price based on order side
  const sortedAds = paymentMethodFilteredAds.sort((a, b) => {
    if (side === OrderSide.SELL) {
      // For SELL orders, sort from lowest to highest price
      return parseFloat(a.price) - parseFloat(b.price);
    } else {
      // For BUY orders, sort from highest to lowest price
      return parseFloat(b.price) - parseFloat(a.price);
    }
  });

  console.log("filteredAds", sortedAds);

  return {
    data: {
      count: sortedAds.length,
      items: sortedAds,
    },
    isLoading: false,
    isError: false,
  };
};

// New hook for filtered ads
export const useFilteredListedAds = ({
  pagesToFetch = 5,
  size = 30,
  tokenId = "USDT",
  currencyId = "NGN",
  side = OrderSide.SELL,
  minAmount = 0,
  minSuccessRate = 0,
  authTag = "",
}: {
  pagesToFetch?: number;
  size?: number;
  tokenId?: string;
  currencyId?: string;
  side?: number;
  minAmount?: number;
  minSuccessRate?: number;
  authTag: string;
}) => {
  const query = useQuery({
    queryKey: [
      "filteredListedAds",
      pagesToFetch,
      size,
      tokenId,
      currencyId,
      side,
      minAmount,
      minSuccessRate,
      authTag,
    ],
    queryFn: () =>
      fetchFilteredListedAds({
        pagesToFetch,
        tokenId,
        currencyId,
        side,
        minAmount,
        minSuccessRate,
        authTag,
      }),
    retry: false,
  });

  return { ...query };
};

// Helper constants for filtering
export const MIN_AMOUNT_OPTIONS = [
  0, 5000, 10000, 20000, 50000, 100000, 200000, 500000, 1000000,
];
export const SUCCESS_RATE_OPTIONS = [
  0, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100,
];
// ... existing code ...
