export default function StatCard({ icon, value, label, percent, color }) {
  return (
    <div className="relative bg-white rounded-[14px] border border-[#EEEAF5] shadow-[0_4px_22px_rgba(0,0,0,0.05)] p-5">

      {/* Percent Badge - top right */}
      {percent && (
        <div className="absolute right-3 bg-[#E6FCEB] text-[#2ECC71] text-[11px] font-semibold px-2 py-1 rounded-lg">
          +{percent}%
        </div>
      )}

      {/* Icon Box */}
      <div className={`w-12 h-12 flex items-center justify-center rounded-2xl ${color}`}>
        {icon}
      </div>

      {/* Text Section */}
      <div className="mt-4">
        <h2 className="text-[22px] font-semibold text-[#F39C4A]">{value}</h2>
        <p className="text-sm text-[#8A72BE]">{label}</p>
      </div>
    </div>
  );
}
