import React from "react";

export default function StatCard({
  icon: Icon,
  amount,
  label,
  change,
  badgeBg = "bg-green-100",
  badgeText = "text-green-600",
}) {
  return (
    <div className="bg-white w-full rounded-xl border border-[#F0EEF7] px-6 py-5 shadow-[0_4px_15px_rgba(0,0,0,0.04)] flex flex-col gap-4">

      {/* TOP ROW */}
      <div className="flex items-start justify-between w-full">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-[#F3E8FF] flex items-center justify-center">
          <Icon className="text-[#8B5CF6] text-2xl" />
        </div>

        {/* Badge */}
        <span
          className={`${badgeBg} ${badgeText} text-[11px] font-medium px-3 py-1 rounded-full`}
        >
          {change}
        </span>
      </div>

      {/* AMOUNT + LABEL */}
      <div>
        <p className="text-[#F78D25] font-semibold text-3xl leading-none">
          {amount}
        </p>
        <p className="mt-1 text-[14px] text-gray-700 font-medium">
          {label}
        </p>
      </div>
    </div>
  );
}
