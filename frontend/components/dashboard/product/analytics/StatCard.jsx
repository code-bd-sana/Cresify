import React from "react";

export default function StatCard({ icon, value, label, percent, color }) {
  return (
    <div className="bg-white rounded-[14px] border border-[#EEEAF5] shadow-[0_4px_22px_rgba(0,0,0,0.05)] p-5 flex items-center gap-4">
      <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${color}`}>
        {icon}
      </div>
      <div>
        <h2 className="text-[22px] font-semibold text-[#1D1D1F]">{value}</h2>
        <p className="text-sm text-[#8A72BE] flex items-center gap-1">
          {label}
        </p>

        {percent && (
          <span className="text-[12px] text-green-500 font-medium">
            +{percent}%
          </span>
        )}
      </div>
    </div>
  );
}
