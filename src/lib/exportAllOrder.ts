// const exportOrders = () => {
//   console.log("Exportable Orders:", exportableOrders);
//   // Convert the exportableOrders array to a CSV string
//   const csvString = convertArrayToCSV(exportableOrders);

//   // Create a download link
//   const blob = new Blob([csvString], { type: "text/csv" });
//   const url = URL.createObjectURL(blob);
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = "orders.csv";
//   document.body.appendChild(a);
//   a.click();
//   document.body.removeChild(a);
//   URL.revokeObjectURL(url);
// };

// const convertArrayToCSV = (array: any[]) => {
//   const header = Object.keys(array[0]).join(",");
//   const rows = array.map((item) =>
//     Object.values(item)
//       .map((value) => String(value).replace(/,/g, ""))
//       .join(",")
//   );
//   return `${header}\n${rows.join("\n")}`;
// };
