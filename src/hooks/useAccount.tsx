import { UserProfile } from "@/types/user";
import { useEffect, useState } from "react";

export const useAdminDetails = () => {
  const [data, setData] = useState<UserProfile | undefined>(undefined);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/api/account`);
      if (response.ok) {
        const rawData = await response.json();
        setData(rawData.data.result);
      } else {
        setError(new Error(`HTTP error! status: ${response.status}`));
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred")
      );
      console.error("Error fetching user profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { loading, data, error, fetchData };
};

export const useAdminBalance = () => {
  const [data, setData] = useState<any | undefined>(undefined);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/getbalance`);
      if (response.ok) {
        const data = await response.json();
        setData(data.result.balance[0]);
      } else {
        setError(new Error(`HTTP error! status: ${response.status}`));
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred")
      );
      console.error("Error fetching user profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { loading, data, error, fetchData };
};

export const useAdminPayment = () => {
  const [data, setData] = useState<unknown | undefined>(undefined);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/getbalance`);
      if (response.ok) {
        const rawData = await response.json();
        setData(rawData.data.result);
      } else {
        setError(new Error(`HTTP error! status: ${response.status}`));
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred")
      );
      console.error("Error fetching user profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { loading, data, error };
};
