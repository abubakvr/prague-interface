import { useRouter } from "next/navigation";

interface ErrorStateProps {
  error: string;
}

export function ErrorState({ error }: ErrorStateProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-xl md:text-2xl font-bold text-red-600 mb-4">Error</h2>
      <p className="text-gray-700 mb-4 text-center">{error}</p>
      <button
        onClick={() => router.refresh()}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Try Again
      </button>
    </div>
  );
}
