"use client";

interface FilterControlsProps {
  currentStatus: number;
  currentSide: number;
  setCurrentStatus: (status: number) => void;
  setCurrentSide: (side: number) => void;
  setCurrentPage: (page: number) => void;
}

export function FilterControls({
  currentStatus,
  currentSide,
  setCurrentStatus,
  setCurrentSide,
  setCurrentPage,
}: FilterControlsProps) {
  const handleStatusChange = (value: string) => {
    setCurrentStatus(Number(value));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleSideChange = (value: string) => {
    setCurrentSide(Number(value));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  return (
    <div className="mb-6 flex gap-4">
      <select
        className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2.5 text-blue-800 font-medium shadow-sm hover:border-blue-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
        value={currentStatus}
        onChange={(e) => handleStatusChange(e.target.value)}
      >
        <option value="5">Waiting for Chain</option>
        <option value="10">Waiting for Payment</option>
        <option value="20">Waiting for Seller Release</option>
        <option value="30">Appealing</option>
        <option value="40">Cancelled</option>
        <option value="50">Completed</option>
        <option value="60">Paying</option>
        <option value="70">Payment Failed</option>
        <option value="80">Exception Cancelled</option>
        <option value="90">Waiting for Token Selection</option>
        <option value="100">Objecting</option>
        <option value="110">Waiting for Objection</option>
      </select>

      <select
        className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2.5 text-blue-800 font-medium shadow-sm hover:border-blue-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
        value={currentSide}
        onChange={(e) => handleSideChange(e.target.value)}
      >
        <option value="0">Buy</option>
        <option value="1">Sell</option>
      </select>
    </div>
  );
}
