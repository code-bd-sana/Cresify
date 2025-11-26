"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const data = [
  { day: "Mon", sales: 8500 },
  { day: "Tue", sales: 6000 },
  { day: "Wed", sales: 7500 },
  { day: "Thu", sales: 9000 },
  { day: "Fri", sales: 6800 },
];

export default function DailySales() {
  return (
    <div className="bg-white rounded-[14px] p-6 border border-[#EEEAF5] shadow-[0_4px_22px_rgba(0,0,0,0.05)]">
      <h2 className="text-[18px] font-semibold text-[#1D1D1F] mb-4">
        Daily Sales
      </h2>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="sales" fill="#F39C4A" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
