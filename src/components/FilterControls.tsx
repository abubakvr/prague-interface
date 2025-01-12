"use client";

interface FilterControlsProps {
  currentStatus: number;
  currentSide: number;
}

export function FilterControls({
  currentStatus,
  currentSide,
}: FilterControlsProps) {
  return (
    <div className="mb-6 flex gap-4">
      <select
        className="border rounded px-3 py-2"
        defaultValue={currentStatus}
        onChange={(e) => {
          const url = new URL(window.location.href);
          url.searchParams.set("status", e.target.value);
          window.location.href = url.toString();
        }}
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
        className="border rounded px-3 py-2"
        defaultValue={currentSide}
        onChange={(e) => {
          const url = new URL(window.location.href);
          url.searchParams.set("side", e.target.value);
          window.location.href = url.toString();
        }}
      >
        <option value="0">Buy</option>
        <option value="1">Sell</option>
      </select>
    </div>
  );
}
