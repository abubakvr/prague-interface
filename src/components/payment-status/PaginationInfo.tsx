import { PaginationData } from "@/hooks/usePaidOrders";
import { useTheme } from "@/context/ThemeContext";

interface PaginationInfoProps {
  pagination: PaginationData;
}

export function PaginationInfo({ pagination }: PaginationInfoProps) {
  const { resolvedTheme } = useTheme();

  return (
    <div
      className={`text-xs md:text-sm mt-4 text-center px-2 transition-colors duration-200 ${
        resolvedTheme === "dark" ? "text-blue-400" : "text-blue-600"
      }`}
    >
      Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} to{" "}
      {Math.min(
        pagination.currentPage * pagination.itemsPerPage,
        pagination.totalItems
      )}{" "}
      of {pagination.totalItems} paid orders
    </div>
  );
}
