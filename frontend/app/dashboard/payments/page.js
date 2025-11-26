"use client";
import { FiDollarSign } from "react-icons/fi";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { MdTrendingUp } from "react-icons/md";

export default function Payments() {
  const data = [
    { id: "TXN-2501", order: "#ORD-2501", amount: "$1,250.00", method: "$1,250.00", status: "Paid", date: "2025-05-01" },
    { id: "TXN-2502", order: "#ORD-2502", amount: "$850.00", method: "$850.00", status: "Paid", date: "2025-05-01" },
    { id: "TXN-2503", order: "#ORD-2503", amount: "$5,250.00", method: "$5,250.00", status: "Paid", date: "2025-05-01" },
    { id: "TXN-2504", order: "#ORD-2504", amount: "$250.00", method: "$250.00", status: "Paid", date: "2025-05-01" },
    { id: "TXN-2505", order: "#ORD-2505", amount: "$750.00", method: "$750.00", status: "Pending", date: "2025-05-01" },
    { id: "TXN-2506", order: "#ORD-2506", amount: "$870.00", method: "$870.00", status: "Paid", date: "2025-05-01" },
  ];

  return (
    <div className="w-full min-h-screen bg-[#F4F3F7] px-6 md:px-16 py-10">

      {/* HEADER */}
      <div>
        <h1 className="text-[28px] font-semibold text-[#1D1D1F]">Payments</h1>
        <p className="text-[#A78BFA] text-sm mt-1">Track your earning and transaction history</p>
      </div>

      {/* TOTAL EARNING CARD */}
      <div className="bg-white mt-8 w-full rounded-[14px] border border-[#EEEAF5] shadow-[0_4px_22px_rgba(0,0,0,0.06)] p-6 
        bg-gradient-to-r from-[#EDE4FF] via-[#F8F3FF] to-[#F2ECDD]">
        
        <p className="text-sm text-[#1D1D1F] font-medium">Total Earning</p>
        <h2 className="text-[32px] font-semibold text-[#F39C4A] mt-1">$12,458.90</h2>
        <p className="text-sm text-[#8A72BE] mt-1">
          Available Balance: <span className="text-[#8A72BE]">$8,234.50</span>
        </p>
      </div>

      {/* SMALL CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

        {/* This Month */}
        <div className="bg-white rounded-[14px] border border-[#EEEAF5] shadow-[0_4px_22px_rgba(0,0,0,0.06)] p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#F4EBFF] flex items-center justify-center">
            <FiDollarSign className="text-[#C39BFF] text-2xl" />
          </div>
          <div>
            <p className="text-sm text-[#1D1D1F] font-medium">This Month</p>
            <h3 className="text-[22px] font-semibold text-[#F39C4A]">$5,655.00</h3>
          </div>
        </div>

        {/* Last Month */}
        <div className="bg-white rounded-[14px] border border-[#EEEAF5] shadow-[0_4px_22px_rgba(0,0,0,0.06)] p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FFF3EB] flex items-center justify-center">
            <HiOutlineShoppingCart className="text-[#F3A96B] text-2xl" />
          </div>
          <div>
            <p className="text-sm text-[#1D1D1F] font-medium">Last Month</p>
            <h3 className="text-[22px] font-semibold text-[#F39C4A]">$4,655.00</h3>
          </div>
        </div>

        {/* Avg Monthly */}
        <div className="bg-white rounded-[14px] border border-[#EEEAF5] shadow-[0_4px_22px_rgba(0,0,0,0.06)] p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#EDF8FF] flex items-center justify-center">
            <MdTrendingUp className="text-[#4F9EFF] text-2xl" />
          </div>
          <div>
            <p className="text-sm text-[#1D1D1F] font-medium">Avg Monthly</p>
            <h3 className="text-[22px] font-semibold text-[#F39C4A]">$4,755.00</h3>
          </div>
        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[14px] border border-[#EEEAF5] shadow-[0_4px_22px_rgba(0,0,0,0.06)] p-6 mt-10 overflow-auto">

        {/* TABLE HEADER */}
        <table className="w-full">
          <thead>
            <tr className="text-left bg-[#F9F5FF] text-[#A78BFA] text-sm">
              <th className="py-3 px-4 font-medium">TRANSACTION ID</th>
              <th className="py-3 px-4 font-medium">ORDER ID</th>
              <th className="py-3 px-4 font-medium">AMOUNT</th>
              <th className="py-3 px-4 font-medium">METHOD</th>
              <th className="py-3 px-4 font-medium">STATUS</th>
              <th className="py-3 px-4 font-medium">DATE</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="border-b border-[#EDECF5]">
                <td className="py-4 px-4 text-[#1D1D1F]">{row.id}</td>
                <td className="py-4 px-4 text-[#1D1D1F]">{row.order}</td>

                <td className="py-4 px-4 text-[#F39C4A] font-semibold">{row.amount}</td>

                <td className="py-4 px-4 text-[#1D1D1F]">{row.method}</td>

                <td className="py-4 px-4">
                  {row.status === "Paid" ? (
                    <span className="text-xs px-3 py-1 bg-[#E2FFE9] text-[#38A169] rounded-full">
                      Paid
                    </span>
                  ) : (
                    <span className="text-xs px-3 py-1 bg-[#FFF1E2] text-[#F39C4A] rounded-full">
                      Pending
                    </span>
                  )}
                </td>

                <td className="py-4 px-4 text-[#1D1D1F]">{row.date}</td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
}
