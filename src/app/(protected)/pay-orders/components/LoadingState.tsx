// LoadingState.jsx
export function LoadingState() {
  return (
    <div className="w-full flex flex-col gap-y-5 h-screen items-center text-center mt-16">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      <p className="text-blue-700 font-medium">Fetching orders. Please wait</p>
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
  toast.error(`Error fetching orders: ${error.message}`);

  return (
    <div className="w-full flex flex-col h-screen items-center text-center gap-4 justify-center">
      <p className="text-red-600 font-medium">
        Error fetching orders: {error.message}
      </p>
      <button
        onClick={() => refetch()}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-lg hover:shadow-blue-300/50 transition-all duration-300"
      >
        Retry
      </button>
    </div>
  );
}

// EmptyState.jsx
export function EmptyState() {
  return (
    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-md border border-blue-200 text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-16 w-16 mx-auto text-blue-400 mb-4"
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
      <p className="text-blue-800 font-medium text-lg">No orders to pay</p>
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
      <div className="bg-white p-6 rounded-lg shadow-lg border border-blue-200">
        <p>{message}</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-blue-300/50"
        >
          OK
        </button>
      </div>
    </div>
  );
}
