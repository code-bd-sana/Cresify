"use client";

import { useTranslation } from "react-i18next";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function SalesOverviewChart({ data }) {
  const { t } = useTranslation("admin");

  return (
    <div className='bg-white rounded-xl shadow-sm border border-[#EEEAF8] p-4'>
      {/* Header */}
      <div className='flex items-center justify-between mb-3'>
        <h2 className='text-[16px] font-semibold text-gray-900'>
          {t("dashboard.charts.salesOverview")}
        </h2>

        {/* Dropdown */}
        <div className='relative'>
          <select
            className='
              appearance-none border px-3 py-1.5 rounded-lg text-[13px]
              bg-white pr-8 text-gray-700 focus:outline-none
            '>
            <option>{t("dashboard.charts.filterAll")}</option>
          </select>

          <span className='absolute right-2 top-[9px] text-gray-600 text-xs'>
            ▼
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className='w-full h-64'>
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart data={data} margin={{ top: 10, left: 0, right: 10 }}>
            {/* Light dotted grid */}
            <CartesianGrid
              stroke='#EAE6F5'
              strokeDasharray='4 4'
              vertical={false}
            />

            {/* X Axis */}
            <XAxis
              dataKey='name'
              tick={{ fontSize: 12, fill: "#999" }}
              axisLine={false}
              tickLine={false}
            />

            {/* Y Axis */}
            <YAxis
              tick={{ fontSize: 11, fill: "#999" }}
              axisLine={false}
              tickLine={false}
            />

            {/* Tooltip */}
            <Tooltip
              formatter={(value) => [
                `$${value}`,
                t("dashboard.charts.revenue"),
              ]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #EEE",
                fontSize: "12px",
              }}
            />

            {/* Purple line */}
            <Line
              type='monotone'
              dataKey='value'
              stroke='#9C30FF'
              strokeWidth={4}
              dot={{
                r: 5,
                fill: "#FFA21A",
                stroke: "#FFA21A",
                strokeWidth: 2,
              }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
