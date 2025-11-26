"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Delivered", value: 400 },
  { name: "Processing", value: 300 },
  { name: "Shipping", value: 200 },
  { name: "Pending", value: 150 },
  { name: "Canceled", value: 100 },
];

const COLORS = ["#4CAF50", "#FFC107", "#2196F3", "#A155FB", "#F44336"];

export default function OrderStatusChart() {
  return (
    <div className="bg-white rounded-[14px] p-6 border border-[#EEEAF5] shadow-[0_4px_22px_rgba(0,0,0,0.05)]">
      <h2 className="text-lg font-semibold text-[#1D1D1F] mb-4">
        Order Status Distribution
      </h2>

      <div className="w-full h-[260px]">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* LEGEND */}
      <div className="flex flex-wrap gap-3 mt-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <span
              className="w-3 h-3 rounded-full"
              style={{ background: COLORS[index] }}
            ></span>
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}
