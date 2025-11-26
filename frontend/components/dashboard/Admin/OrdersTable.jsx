"use client";

const orders = [
  {
    id: "#ORD-2501",
    buyer: "Wade Warren",
    seller: "Leslie Alexander",
    product: "Wireless Headphones",
    amount: "$120.30",
    status: "Delivered",
    date: "2025-05-01",
  },
  {
    id: "#ORD-2502",
    buyer: "Esther Howard",
    seller: "Jacob Jones",
    product: "Smart Watch Pro",
    amount: "$85.00",
    status: "Processing",
    date: "2025-05-01",
  },
  {
    id: "#ORD-2503",
    buyer: "Leslie Alexander",
    seller: "Jacob Jones",
    product: "Laptop Stand",
    amount: "$62.00",
    status: "Cancelled",
    date: "2025-05-01",
  },
  {
    id: "#ORD-2504",
    buyer: "Jacob Jones",
    seller: "Wade Warren",
    product: "USB-C Hub",
    amount: "$26.00",
    status: "Delivered",
    date: "2025-05-01",
  },
  {
    id: "#ORD-2505",
    buyer: "Jacob Jones",
    seller: "Jacob Jones",
    product: "Webcam HD",
    amount: "$59.00",
    status: "Pending",
    date: "2025-05-01",
  },
  {
    id: "#ORD-2506",
    buyer: "Jacob Jones",
    seller: "Esther Howard",
    product: "Toy",
    amount: "$29.10",
    status: "Processing",
    date: "2025-05-01",
  },
];

const statusColors = {
  Delivered: "bg-[#E6F8EF] text-[#3BAE66]",
  Processing: "bg-[#FFF5E5] text-[#F59E0B]",
  Pending: "bg-[#F3E8FF] text-[#8B5CF6]",
  Cancelled: "bg-[#FEE2E2] text-[#DC2626]",
};

export default function OrdersTable() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#F0ECFF] p-4 md:p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-semibold text-gray-900">
          Recent Orders
        </h3>
        <button className="text-xs border rounded-lg px-3 py-1 text-gray-600 bg-gray-50">
          View All Orders
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="text-[12px] text-[#A3A3B5] border-b bg-[#F9F6FF]">
              <th className="py-3 px-3">ORDER ID</th>
              <th className="py-3 px-3">Buyer</th>
              <th className="py-3 px-3">Seller</th>
              <th className="py-3 px-3">PRODUCT</th>
              <th className="py-3 px-3">AMOUNT</th>
              <th className="py-3 px-3">STATUS</th>
              <th className="py-3 px-3">DATE</th>
              <th className="py-3 px-3 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((row, idx) => (
              <tr
                key={row.id}
                className={`text-[13px] ${
                  idx !== orders.length - 1 ? "border-b" : ""
                }`}
              >
                <td className="py-3 px-3 text-[#9C6BFF] font-medium">
                  {row.id}
                </td>
                <td className="py-3 px-3 text-gray-700">{row.buyer}</td>
                <td className="py-3 px-3 text-gray-700">{row.seller}</td>
                <td className="py-3 px-3 text-gray-700">{row.product}</td>
                <td className="py-3 px-3 text-gray-700">{row.amount}</td>
                <td className="py-3 px-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      statusColors[row.status]
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="py-3 px-3 text-gray-700">{row.date}</td>
                <td className="py-3 px-3 text-right">
                  <button className="text-xs border rounded-lg px-3 py-1 text-[#9C6BFF] border-[#E2D4FF] bg-[#F9F6FF]">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
