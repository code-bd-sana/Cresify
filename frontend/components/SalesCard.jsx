// import React from "react";

// const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN"];
// const values = [2500, 5000, 7500, 5500, 9000, 9500];

// export default function SalesChart() {
//   const max = 10000;

//   const points = values
//     .map((v, idx) => {
//       const x = (idx / (values.length - 1)) * 100;
//       const y = 100 - (v / max) * 80; // keep some padding
//       return `${x},${y}`;
//     })
//     .join(" ");

//   return (
//     <div className="mt-3">
//       <div className="relative w-full h-52 md:h-60">
//         <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-[#F7F4FF] to-white border border-[#F0EEF7]" />

//         {/* Grid */}
//         <div className="absolute inset-3 flex flex-col justify-between">
//           {Array.from({ length: 5 }).map((_, i) => (
//             <div
//               key={i}
//               className="border-t border-dashed border-[#E3E0F2]"
//             />
//           ))}
//         </div>

//         {/* Chart */}
//         <svg
//           viewBox="0 0 100 100"
//           className="absolute inset-3 w-[calc(100%-24px)] h-[calc(100%-32px)]"
//           preserveAspectRatio="none"
//         >
//           {/* Line */}
//           <polyline
//             fill="none"
//             stroke="#A855F7"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             points={points}
//           />
//           {/* Dots */}
//           {values.map((v, idx) => {
//             const x = (idx / (values.length - 1)) * 100;
//             const y = 100 - (v / max) * 80;
//             return (
//               <g key={idx}>
//                 <circle cx={x} cy={y} r="2.6" fill="#FB923C" />
//                 <circle
//                   cx={x}
//                   cy={y}
//                   r="4.1"
//                   fill="none"
//                   stroke="#FED7AA"
//                   strokeWidth="1"
//                 />
//               </g>
//             );
//           })}
//         </svg>

//         {/* X axis labels */}
//         <div className="absolute bottom-2 left-3 right-3 flex justify-between text-[11px] text-[#A1A1C1]">
//           {months.map((m) => (
//             <span key={m}>{m}</span>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Dot,
} from "recharts";

// const data = [
//   { month: "JAN", value: 2500 },
//   { month: "FEB", value: 5000 },
//   { month: "MAR", value: 6800 },
//   { month: "APR", value: 4800 },
//   { month: "MAY", value: 8200 },
//   { month: "JUN", value: 9000 },
// ];

export default function SalesAnalyticsChart({data}) {
  return (
    <div className="bg-white rounded-xl p-6 w-full">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Sales Analytics
      </h2>

      <div className="w-full h-[300px] md:h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            
            {/* Grid */}
            <CartesianGrid stroke="#E5E7EB" strokeDasharray="4 4" />

            {/* X Axis */}
            <XAxis
              dataKey="month"
              tick={{ fill: "#6B7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            {/* Y Axis */}
            <YAxis
              tick={{ fill: "#6B7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            {/* Tooltip */}
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />

            {/* Line */}
            <Line
              type="monotone"
              dataKey="value"
              stroke="#A855F7"
              strokeWidth={5}
              dot={{
                r: 6,
                stroke: "#A855F7",
                strokeWidth: 2,
                fill: "#FBBF24",
              }}
              activeDot={{
                r: 7,
                stroke: "#A855F7",
                strokeWidth: 2,
                fill: "#FBBF24",
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

