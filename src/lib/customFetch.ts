import { BASE_URL } from "./constants";
import Cookies from "js-cookie";
interface FetchOptions extends RequestInit {
  data?: any; // For POST/PUT request bodies
}

export const fetchData = async <T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> => {
  // Get token from cookies instead of localStorage
  const token = Cookies.get("accessToken");
  if (!token) {
    window.location.href = "/login";
    throw new Error("Session expired. Please login again.");
  }

  const isFormData = options.data instanceof FormData;

  // Construct the full URL
  const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;

  // Prepare headers
  const headers: HeadersInit = {
    ...(!isFormData && { "Content-Type": "application/json" }),
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  // Prepare the request configuration
  const config: RequestInit = {
    ...options,
    headers,
  };

  // Handle request body for POST/PUT methods
  if (options.data) {
    config.body = isFormData ? options.data : JSON.stringify(options.data);
  }

  try {
    const response = await fetch(url, config);

    // Handle non-OK responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: "An error occurred while processing your request",
      }));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    // Parse and return the response
    const data = await response.json();
    return data;
  } catch (error) {
    // Enhance error handling
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};
