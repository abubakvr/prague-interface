import { PaginationData } from "@/hooks/usePaidOrders";

interface PaginationProps {
  pagination: PaginationData;
  onPageChange: (page: number) => void;
}

export function Pagination({ pagination, onPageChange }: PaginationProps) {
  return (
    <div className="mt-6 flex justify-center">
      <div className="flex flex-wrap items-center justify-center gap-1 md:gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, pagination.currentPage - 1))}
          className={`px-3 md:px-4 py-1 md:py-2 rounded-md text-sm ${
            pagination.currentPage <= 1
              ? "bg-blue-100 text-blue-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
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
                  className="px-2 md:px-3 py-1 md:py-2 text-blue-600"
                >
                  ...
                </span>
              );
            }

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`px-3 md:px-4 py-1 md:py-2 rounded-md text-sm ${
                  pagination.currentPage === pageNum
                    ? "bg-blue-600 text-white"
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
          className={`px-3 md:px-4 py-1 md:py-2 rounded-md text-sm ${
            pagination.currentPage >= pagination.totalPages
              ? "bg-blue-100 text-blue-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
