import { getOrders } from "@/hooks/useOrders";
import { OrderTable } from "@/components/OrderTable";
import { OrderListResponse } from "@/types/order";
import { FilterControls } from "@/components/FilterControls";

export default async function Page({
  searchParams,
}: {
  searchParams: { page?: string; status?: string; side?: string };
}) {
  // Await the entire searchParams object
  searchParams = await searchParams;
  // Convert searchParams to numbers with default values
  const currentPage = Number(await searchParams.page) || 1;
  const currentStatus = Number(await searchParams.status) || 50;
  const currentSide = Number(await searchParams.side) || 0;
  const pageSize = 30;

  const response: OrderListResponse = await getOrders({
    page: currentPage,
    size: pageSize,
    side: currentSide,
    status: currentStatus,
  });

  const totalPages = Math.ceil(response.count / pageSize);

  return (
    <div className="w-fit">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-gray-500">
          Total Orders: {response.count}
        </div>
      </div>

      <FilterControls currentStatus={currentStatus} currentSide={currentSide} />

      <OrderTable orders={response.items} />

      <div className="mt-6 flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <a
            key={pageNum}
            href={`?page=${pageNum}&status=${currentStatus}&side=${currentSide}`}
            className={`px-3 py-1 border rounded ${
              pageNum === currentPage
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {pageNum}
          </a>
        ))}
      </div>
    </div>
  );
}
