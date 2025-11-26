"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function RevenueTrend() {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue",
        data: [3200, 4100, 3800, 5000, 4600, 5800],
        borderColor: "#9838E1",
        backgroundColor: "#F78D25",
        pointRadius: 4,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1D1D1F",
        titleColor: "#FFF",
        bodyColor: "#FFF",
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#8A72BE",
          font: { size: 11 },
        },
      },
      y: {
        grid: { color: "#EFEAF8" },
        ticks: {
          color: "#8A72BE",
          font: { size: 11 },
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-[14px] border border-[#EEEAF5] shadow-sm p-5">
      <h2 className="text-lg font-semibold text-[#1D1D1F] mb-3">
        Revenue Trend
      </h2>

      <div className="h-[260px]">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
