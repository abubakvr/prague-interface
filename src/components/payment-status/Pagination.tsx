import { PaginationData } from "@/hooks/usePaidOrders";
import { useTheme } from "@/context/ThemeContext";

interface PaginationProps {
  pagination: PaginationData;
  onPageChange: (page: number) => void;
}

export function Pagination({ pagination, onPageChange }: PaginationProps) {
  const { resolvedTheme } = useTheme();

  return (
    <div className="mt-6 flex justify-center">
      <div className="flex flex-wrap items-center justify-center gap-1 md:gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, pagination.currentPage - 1))}
          className={`px-3 md:px-4 py-1 md:py-2 rounded-md text-sm transition-colors duration-200 ${
            pagination.currentPage <= 1
              ? resolvedTheme === "dark"
                ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                : "bg-blue-100 text-blue-500 cursor-not-allowed"
              : resolvedTheme === "dark"
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          Previous
        </button>

        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
          .filter(
            (pageNum) =>
              pageNum === 1 ||
              pageNum === pagination.totalPages ||
              Math.abs(pageNum - pagination.currentPage) <= 1
          )
          .map((pageNum, index, array) => {
            if (index > 0 && pageNum - array[index - 1] > 1) {
              return (
                <span
                  key={`ellipsis-${pageNum}`}
                  className={`px-2 md:px-3 py-1 md:py-2 transition-colors duration-200 ${
                    resolvedTheme === "dark" ? "text-blue-400" : "text-blue-600"
                  }`}
                >
                  ...
                </span>
              );
            }

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`px-3 md:px-4 py-1 md:py-2 rounded-md text-sm transition-colors duration-200 ${
                  pagination.currentPage === pageNum
                    ? resolvedTheme === "dark"
                      ? "bg-blue-600 text-white"
                      : "bg-blue-600 text-white"
                    : resolvedTheme === "dark"
                    ? "bg-slate-700 text-blue-300 hover:bg-slate-600"
                    : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

        <button
          onClick={() =>
            onPageChange(
              Math.min(pagination.totalPages, pagination.currentPage + 1)
            )
          }
          className={`px-3 md:px-4 py-1 md:py-2 rounded-md text-sm transition-colors duration-200 ${
            pagination.currentPage >= pagination.totalPages
              ? resolvedTheme === "dark"
                ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                : "bg-blue-100 text-blue-500 cursor-not-allowed"
              : resolvedTheme === "dark"
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
