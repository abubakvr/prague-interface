import { getOrders } from "@/hooks/useOrders";
import { OrderTable } from "@/components/OrderTable";
import { OrderListResponse } from "@/types/order";
import { FilterControls } from "@/components/FilterControls";
import { Pagination } from "@/components/Pagination";

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

  if (!response) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-gray-500">
          Total Orders: {response.count}
        </div>
      </div>

      <FilterControls currentStatus={currentStatus} currentSide={currentSide} />

      {response?.items?.length ? (
        <OrderTable orders={response.items} />
      ) : (
        <p className="">No order match the filter</p>
      )}

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        currentSide={currentPage}
        currentStatus={currentStatus}
      />
    </div>
  );
}
