// LoadingState.jsx
import { useTheme } from "@/context/ThemeContext";

export function LoadingState() {
  const { resolvedTheme } = useTheme();

  return (
    <div className="w-full flex flex-col gap-y-5 h-screen items-center text-center mt-16">
      <div
        className={`animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 transition-colors duration-200 ${
          resolvedTheme === "dark" ? "border-blue-400" : "border-blue-600"
        }`}
      ></div>
      <p
        className={`font-medium transition-colors duration-200 ${
          resolvedTheme === "dark" ? "text-blue-300" : "text-blue-700"
        }`}
      >
        Fetching orders. Please wait
      </p>
    </div>
  );
}

// ErrorState.jsx
import { toast } from "react-hot-toast";

interface ErrorStateProps {
  error: Error;
  refetch: () => void;
}

export function ErrorState({ error, refetch }: ErrorStateProps) {
  const { resolvedTheme } = useTheme();
  toast.error(`Error fetching orders: ${error.message}`);

  return (
    <div className="w-full flex flex-col h-screen items-center text-center gap-4 justify-center">
      <p
        className={`font-medium transition-colors duration-200 ${
          resolvedTheme === "dark" ? "text-red-400" : "text-red-600"
        }`}
      >
        Error fetching orders: {error.message}
      </p>
      <button
        onClick={() => refetch()}
        className={`px-4 py-2 text-white rounded-md shadow-lg transition-all duration-300 ${
          resolvedTheme === "dark"
            ? "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-300/20"
            : "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-300/50"
        }`}
      >
        Retry
      </button>
    </div>
  );
}

// EmptyState.jsx
export function EmptyState() {
  const { resolvedTheme } = useTheme();

  return (
    <div
      className={`backdrop-blur-sm p-8 rounded-xl shadow-md border text-center transition-colors duration-200 ${
        resolvedTheme === "dark"
          ? "bg-slate-800/80 border-slate-600"
          : "bg-white/80 border-blue-200"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-16 w-16 mx-auto mb-4 transition-colors duration-200 ${
          resolvedTheme === "dark" ? "text-blue-300" : "text-blue-400"
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <p
        className={`font-medium text-lg transition-colors duration-200 ${
          resolvedTheme === "dark" ? "text-slate-200" : "text-blue-800"
        }`}
      >
        No orders to pay
      </p>
    </div>
  );
}

// Modal.jsx
interface ModalProps {
  message: string;
  type: "success" | "error" | "info" | "";
  onClose: () => void;
}

export function Modal({ message, type, onClose }: ModalProps) {
  const { resolvedTheme } = useTheme();

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm ${
        type === "success"
          ? "text-green-500"
          : type === "error"
          ? "text-red-500"
          : "text-blue-500"
      }`}
    >
      <div
        className={`p-6 rounded-lg shadow-lg border transition-colors duration-200 ${
          resolvedTheme === "dark"
            ? "bg-slate-800 border-slate-600"
            : "bg-white border-blue-200"
        }`}
      >
        <p
          className={`transition-colors duration-200 ${
            resolvedTheme === "dark" ? "text-slate-200" : "text-gray-800"
          }`}
        >
          {message}
        </p>
        <button
          onClick={onClose}
          className={`mt-4 px-4 py-2 text-white rounded-md shadow-md transition-all duration-300 ${
            resolvedTheme === "dark"
              ? "bg-blue-500 hover:bg-blue-600 hover:shadow-blue-300/20"
              : "bg-blue-500 hover:bg-blue-700 hover:shadow-blue-300/50"
          }`}
        >
          OK
        </button>
      </div>
    </div>
  );
}
