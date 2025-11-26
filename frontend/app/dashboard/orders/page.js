"use client";
import { FiSearch, FiChevronDown } from "react-icons/fi";

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F9] px-2 pt-6">
      {/* Page Header */}
      <h1 className="text-3xl font-semibold text-[#111827]">
        Order Management
      </h1>
      <p className="text-sm text-[#A78BFA] mt-1">
        Track and manage all your customer orders
      </p>

      {/* Search + Filter */}
      <div className="mt-8 bg-white p-4 rounded-xl border border-[#ECECEC] shadow-sm flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="Search by order ID or customer name..."
            className="w-full bg-[#FCFCFF] border border-[#E5E7EB] rounded-lg pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#A855F7]/40"
          />
        </div>

        {/* Filter dropdown */}
        <div className="relative w-full md:w-40">
          <select className="appearance-none w-full px-4 py-3 bg-[#FCFCFF] border border-[#E5E7EB] text-sm rounded-lg outline-none cursor-pointer">
            <option>All</option>
            <option>Delivered</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Canceled</option>
            <option>Shipping</option>
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg pointer-events-none" />
        </div>
      </div>

      {/* Orders Table */}
      {/* Orders Table */}
      <div className="mt-8 bg-white rounded-2xl border border-[#ECECEC] shadow-sm overflow-x-auto px-6 py-10">
        <table className="w-full text-left min-w-[900px] border border-gray-100">
          <thead>
            <tr className="bg-[#F9F7FF] text-[#A78BFA] text-xs uppercase">
              <th className="py-4 px-6 font-semibold">Order ID</th>
              <th className="py-4 px-6 font-semibold">Customer</th>
              <th className="py-4 px-6 font-semibold">Product</th>
              <th className="py-4 px-6 font-semibold">Items</th>
              <th className="py-4 px-6 font-semibold">Amount</th>
              <th className="py-4 px-6 font-semibold">Status</th>
              <th className="py-4 px-6 font-semibold">Date</th>
              <th className="py-4 px-6 font-semibold text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="text-sm text-[#111827]">
            {orders.map((row, i) => (
              <tr
                key={i}
                className="border-t border-[#F0F0F5] hover:bg-[#FAF9FF] transition"
              >
                <td className="py-4 px-6 font-medium">{row.id}</td>
                <td className="py-4 px-6">{row.customer}</td>
                <td className="py-4 px-6">{row.product}</td>
                <td className="py-4 px-6">{row.items}</td>

                {/* Amount */}
                <td className="py-4 px-6 font-medium text-[#FF8A34]">
                  {row.amount}
                </td>

                {/* Status Badge */}
                <td className="py-4 px-6">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium border ${statusBadge(
                      row.status
                    )}`}
                  >
                    {row.status}
                  </span>
                </td>

                <td className="py-4 px-6">{row.date}</td>

                {/* View Button */}
                <td className="py-4 px-6 text-center">
                  <button className="flex items-center gap-1 text-xs px-4 py-1 rounded-lg border border-[#D9C4FF] text-[#A855F7] hover:bg-[#F5EEFF] transition mx-auto">
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

/* ✓ Status Badge Colors */
function statusBadge(status) {
  switch (status) {
    case "Delivered":
      return "bg-[#E8FFE7] text-[#2E9B3D] border border-[#C4F5C0]";
    case "Processing":
      return "bg-[#FFF7DB] text-[#B88A00] border border-[#F6E3A1]";
    case "Canceled":
      return "bg-[#FFECEC] text-[#E03131] border border-[#FFC9C9]";
    case "Pending":
      return "bg-[#F3EDFF] text-[#A855F7] border border-[#E2D6FF]";
    case "Shipping":
      return "bg-[#E1F2FF] text-[#0076D6] border border-[#B5E2FF]";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

/* ✓ Static Data */
const orders = [
  {
    id: "#ORD-2501",
    customer: "Wade Warren",
    product: "Wireless Headphones",
    items: 1,
    amount: "$1,250.00",
    status: "Delivered",
    date: "2025-05-01",
  },
  {
    id: "#ORD-2502",
    customer: "Esther Howard",
    product: "Smart Watch Pro",
    items: 3,
    amount: "$850.00",
    status: "Processing",
    date: "2025-05-01",
  },
  {
    id: "#ORD-2503",
    customer: "Leslie Alexander",
    product: "Laptop Stand",
    items: 2,
    amount: "$5,250.00",
    status: "Canceled",
    date: "2025-06-01",
  },
  {
    id: "#ORD-2504",
    customer: "Jacob Jones",
    product: "USB-C Hub",
    items: 1,
    amount: "$250.00",
    status: "Delivered",
    date: "2025-06-01",
  },
  {
    id: "#ORD-2505",
    customer: "Jacob Jones",
    product: "Webcam HD",
    items: 2,
    amount: "$750.00",
    status: "Pending",
    date: "2025-06-01",
  },
  {
    id: "#ORD-2506",
    customer: "Jacob Jones",
    product: "Toy",
    items: 1,
    amount: "$870.00",
    status: "Shipping",
    date: "2025-06-01",
  },
];
