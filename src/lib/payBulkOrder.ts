async function callPayOrdersRoute(token: string) {
  const baseUrl = "http://localhost:3000"; // Use your base URL or default to localhost
  const apiUrl = `${baseUrl}/api/pay-orders`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      console.error("Error calling pay-orders route:", response);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data; // Or do something else with the response data
  } catch (error) {
    console.error("Error calling pay-orders route:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}
