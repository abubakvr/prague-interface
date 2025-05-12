"use client";

import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { BASE_URL } from "@/lib/constants";
import { FaPlay, FaStop, FaSync, FaSpinner } from "react-icons/fa";

interface AgentStatus {
  isRunning: boolean;
  userId: string | null;
}

interface AgentEvent {
  type: string;
  timestamp: string;
  data: any;
}

export default function AgentPage() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [status, setStatus] = useState<AgentStatus>({
    isRunning: false,
    userId: null,
  });
  const [events, setEvents] = useState<AgentEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io(`${BASE_URL}`, {
      withCredentials: true,
      transports: ["websocket"],
    });
    setSocket(socketInstance);
    socketRef.current = socketInstance;

    // Set up event listeners
    socketInstance.on("connect", () => {
      console.log("Connected to agent socket server");
      // Re-identify the user on connect
      if (status.userId) {
        socketInstance.emit("user:identify", status.userId);
      }

      fetchAgentStatus();
    });

    socketInstance.on("connect_error", (err) => {
      console.error(
        "FRONTEND: Socket.IO Connection Error:",
        err.message,
        err.cause || err
      );
    });

    socketInstance.on("connect_timeout", (timeout) => {
      console.error("FRONTEND: Socket.IO Connection Timeout:", timeout);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("FRONTEND: Socket.IO Disconnected:", reason);
      if (reason === "io server disconnect") {
        // The server intentionally disconnected the socket
        socketInstance.connect(); // You might want to reconnect
      }
    });
    socketInstance.on("agent:status", (data: AgentStatus) => {
      setStatus(data);
    });

    // Listen for various agent events
    const eventTypes = [
      "agent:started",
      "agent:stopped",
      "agent:cycle:start",
      "agent:cycle:end",
      "agent:price:updated",
      "agent:orders:fetched",
      "agent:payment:processing",
      "agent:payment:completed",
      "agent:payment:skipped",
      "agent:waiting",
      "agent:error",
      "agent:stopping",
      "agent:restarting",
    ];

    eventTypes.forEach((eventType) => {
      socketInstance.on(eventType, (data: any) => {
        const newEvent: AgentEvent = {
          type: eventType,
          timestamp: new Date().toISOString(),
          data,
        };
        setEvents((prev) => [newEvent, ...prev].slice(0, 100)); // Keep last 100 events
      });
    });

    // Clean up on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const fetchAgentStatus = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/agent/status`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const data: AgentStatus = await response.json();
      if (response.ok) {
        setStatus(data);
      } else {
        console.error("Failed to fetch agent status:", data);
      }
    } catch (error) {
      console.error("Error fetching agent status:", error);
    }
  };

  const startAgent = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/agent/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to start agent");
      }

      console.log("Agent started:", result);
    } catch (error) {
      console.error("Error starting agent:", error);
      alert(
        `Failed to start agent: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const stopAgent = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/agent/stop`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to stop agent");
      }

      console.log("Agent stopped:", result);
    } catch (error) {
      console.error("Error stopping agent:", error);
      alert(
        `Failed to stop agent: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const restartAgent = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/agent/restart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to restart agent");
      }

      console.log("Agent restarted:", result);
    } catch (error) {
      console.error("Error restarting agent:", error);
      alert(
        `Failed to restart agent: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getEventColor = (eventType: string) => {
    if (eventType.includes("error")) return "text-red-600";
    if (eventType.includes("started")) return "text-green-600";
    if (eventType.includes("stopped") || eventType.includes("stopping"))
      return "text-orange-600";
    if (eventType.includes("payment")) return "text-blue-600";
    if (eventType.includes("price")) return "text-purple-600";
    return "text-gray-700";
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Agent Control Panel</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-4">
          <div className="flex gap-2 mt-4 md:mt-0">
            <button
              onClick={startAgent}
              disabled={isLoading || status.isRunning}
              className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                status.isRunning
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {isLoading ? <FaSpinner className="animate-spin" /> : <FaPlay />}
              Start
            </button>

            <button
              onClick={stopAgent}
              disabled={isLoading || !status.isRunning}
              className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                !status.isRunning
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            >
              {isLoading ? <FaSpinner className="animate-spin" /> : <FaStop />}
              Stop
            </button>

            <button
              onClick={restartAgent}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            >
              {isLoading ? <FaSpinner className="animate-spin" /> : <FaSync />}
              Restart
            </button>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-md bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">Agent Status</h3>
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                status.isRunning ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span>{status.isRunning ? "Running" : "Stopped"}</span>
            {status.userId && (
              <span className="text-gray-600 ml-2">User: {status.userId}</span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Event Log</h2>
        <div className="overflow-auto max-h-96 border border-gray-200 rounded-md">
          {events.length === 0 ? (
            <p className="p-4 text-gray-500">No events recorded yet.</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map((event, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getEventColor(
                        event.type
                      )}`}
                    >
                      {event.type.replace("agent:", "")}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {event.data ? event.data.message : "-"}
                      <br />
                      {/* {event.data && event.data.error ? event.data.error : ""} */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
