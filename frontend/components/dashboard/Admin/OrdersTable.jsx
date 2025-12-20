"use client";

import RecentOrders from "@/components/RecentOrders";

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
   <div>

    <RecentOrders/>
   </div>
  );
}
