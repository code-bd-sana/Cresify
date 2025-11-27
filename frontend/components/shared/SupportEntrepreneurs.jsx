
export default function SupportEntrepreneurs() {
  return (
    <section
      className="
        w-full py-20 
        bg-[linear-gradient(90deg,#8736C5_0%,#F88D25_100%)]
        flex flex-col items-center text-center px-6
      "
    >
      {/* Heading */}
      <h2 className="text-white text-[28px] md:text-[32px] font-semibold mb-3 leading-tight">
        Support local entrepreneurs. Every purchase makes a difference.
      </h2>

      {/* Subtext */}
      <p className="text-white text-opacity-90 text-[15px] md:text-[16px] max-w-[650px] leading-relaxed mb-8">
        Join thousands of shoppers who, are transforming lives through their 
        purchasing decisions.
      </p>

      {/* Button */}
      <button
        className="
          bg-white text-[#7A3AED] font-medium text-[14px]
          px-8 py-[12px] rounded-[10px]
          shadow-[0_4px_14px_rgba(0,0,0,0.15)]
          hover:opacity-90 transition
        "
      >
        Start Shopping Now
      </button>
    </section>
  );
}
