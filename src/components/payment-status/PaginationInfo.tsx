import { PaginationData } from "@/hooks/usePaidOrders";

interface PaginationInfoProps {
  pagination: PaginationData;
}

export function PaginationInfo({ pagination }: PaginationInfoProps) {
  return (
    <div className="text-xs md:text-sm text-blue-600 mt-4 text-center px-2">
      Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} to{" "}
      {Math.min(
        pagination.currentPage * pagination.itemsPerPage,
        pagination.totalItems
      )}{" "}
      of {pagination.totalItems} paid orders
    </div>
  );
}
