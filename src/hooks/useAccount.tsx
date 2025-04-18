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

export async function fetchAdminAccountNumber(): Promise<string | null> {
  const token = localStorage.getItem("accessToken");
  const url = `${BASE_URL}/api/keys/bank_account`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // It's good practice to include this
      },
    });

    if (response.ok) {
      // Status code is 2xx
      const data = await response.json();
      // Check if the expected property exists in the response
      if (data && typeof data.accountNumber === "string") {
        return data.accountNumber;
      } else {
        console.error(
          "API returned success status, but accountNumber is missing or not a string:",
          data
        );
        return null; // Or throw an error indicating unexpected response format
      }
    } else if (response.status === 404) {
      console.warn("Bank account not found (404).");
      return null; // Return null to indicate not found
    } else {
      // Handle other error statuses (e.g., 500 Internal Server Error)
      const errorBody = await response.text(); // Get error details if available
      console.error(
        `Failed to fetch bank account. Status: ${response.status} ${response.statusText}. Body: ${errorBody}`
      );
      throw new Error(`API request failed with status ${response.status}`);
    }
  } catch (error) {
    console.error("Network or other error fetching bank account:", error);
    // Re-throw the error or return null depending on how you want to handle network issues
    throw error; // Or return null;
  }
}

export const useAdminAccountNumber = () => {
  const query = useQuery({
    queryKey: ["accountNumber"],
    queryFn: fetchAdminAccountNumber,
  });

  return { ...query };
};
