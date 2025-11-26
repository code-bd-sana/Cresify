import React from "react";

const orders = [
  {
    id: "#ORD-2501",
    customer: "Wade Warren",
    product: "Wireless Headphones",
    amount: "$1,250.00",
    status: "Delivered",
    date: "2025-05-01",
  },
  {
    id: "#ORD-2502",
    customer: "Esther Howard",
    product: "Smart Watch Pro",
    amount: "$850.00",
    status: "Processing",
    date: "2025-05-01",
  },
  {
    id: "#ORD-2503",
    customer: "Leslie Alexander",
    product: "Laptop Stand",
    amount: "$5,250.00",
    status: "Canceled",
    date: "2025-05-01",
  },
  {
    id: "#ORD-2504",
    customer: "Jacob Jones",
    product: "USB-C Hub",
    amount: "$250.00",
    status: "Delivered",
    date: "2025-05-01",
  },
  {
    id: "#ORD-2505",
    customer: "Jacob Jones",
    product: "Webcam HD",
    amount: "$750.00",
    status: "Pending",
    date: "2025-05-01",
  },
  {
    id: "#ORD-2506",
    customer: "Jacob Jones",
    product: "Toy",
    amount: "$870.00",
    status: "Processing",
    date: "2025-05-01",
  },
];

const badgeStyles = {
  Delivered: "bg-[#E8FFF3] text-[#16A34A]",
  Processing: "bg-[#FEF3C7] text-[#D97706]",
  Pending: "bg-[#E0ECFF] text-[#2563EB]",
  Canceled: "bg-[#FEE2E2] text-[#DC2626]",
};

export default function RecentOrders() {
  return (
    <div className="mt-3 overflow-x-auto rounded-xl">
      <table className="min-w-full text-left text-[12px] md:text-[13px]">
        <thead>
          <tr className="text-[#9838E1] bg-[#F8F4FD] border-b  border-[#F0EEF7] text-xs uppercase tracking-[0.12em]">
            <th className="py-6 pr-4 font-medium pl-2">Order ID</th>
            <th className="py-6 pr-4 font-medium pl-2">Customer</th>
            <th className="py-6 pr-4 font-medium pl-2">Product</th>
            <th className="py-6 pr-4 font-medium pl-2">Amount</th>
            <th className="py-6 pr-4 font-medium pl-2">Status</th>
            <th className="py-6 pr-4 font-medium pl-2">Date</th>
          </tr>
        </thead>
        <tbody className="text-[#4B4B63]">
          {orders.map((o, idx) => (
            <tr
              key={o.id}
              className={`border-b border-[#F5F4FB] ${
                idx % 2 === 1 ? "" : "bg-white"
              }`}
            >
              <td className="pl-2 py-6 pr-4 font-medium">
                {o.id}
              </td>
              <td className="pl-2 py-6 pr-4">{o.customer}</td>
              <td className="pl-2 py-6 pr-4">{o.product}</td>
              <td className="pl-2 py-6 pr-4">{o.amount}</td>
              <td className="pl-2 py-6 pr-4">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                    badgeStyles[o.status]
                  }`}
                >
                  {o.status}
                </span>
              </td>
              <td className="py-3 pr-4 text-[#8C8CA1]">{o.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
