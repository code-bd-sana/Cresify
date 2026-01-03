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

export default function SalesAnalyticsChart({ data }) {
  const { t, i18n } = useTranslation();

  // Format chart data with translated months
  const formatChartData = () => {
    if (!data || !Array.isArray(data)) return [];

    return data.map((item) => ({
      ...item,
      month: t(`seller:salesAnalytics.months.${item.month}`, item.month),
    }));
  };

  const chartData = formatChartData();

  return (
    <div className='bg-white rounded-xl p-6 w-full'>
      <h2 className='text-xl font-semibold text-gray-800 mb-4'>
        {t("seller:salesAnalytics.title")}
      </h2>

      <div className='w-full h-[300px] md:h-[350px]'>
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            {/* Grid */}
            <CartesianGrid stroke='#E5E7EB' strokeDasharray='4 4' />

            {/* X Axis */}
            <XAxis
              dataKey='month'
              tick={{ fill: "#6B7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            {/* Y Axis */}
            <YAxis
              tick={{ fill: "#6B7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />

            {/* Custom Tooltip */}
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className='bg-white p-3 rounded-lg shadow-lg border border-gray-200'>
                      <p className='text-sm font-medium text-gray-900'>
                        {label}
                      </p>
                      <p className='text-sm text-purple-600 font-semibold'>
                        {t("seller:salesAnalytics.tooltip.sales")}: $
                        {payload[0].value.toLocaleString()}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Line */}
            <Line
              type='monotone'
              dataKey='value'
              stroke='#A855F7'
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
