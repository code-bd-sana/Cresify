"use client";

export default function SupportLocal() {
  return (
    <section
      className="w-full py-20 flex items-center justify-center text-center
      bg-[linear-gradient(90deg,#8736C5_0%,#F88D25_100%)]"
    >
      <div className="max-w-[900px] mx-auto px-6">

        {/* Heading */}
        <h2 className="text-white text-[28px] md:text-[32px] font-semibold mb-4 leading-tight">
          Support local entrepreneurs. Every purchase makes a difference.
        </h2>

        {/* Subtext */}
        <p className="text-white/80 text-[15px] md:text-[16px] mb-8">
          Join thousands of shoppers who, are transforming lives through their
          purchasing decisions.
        </p>

        {/* Button */}
        <button
          className="bg-white text-[#8736C5] font-medium text-[14px]
          px-6 py-2 rounded-[8px] shadow-[0_3px_10px_rgba(0,0,0,0.12)]
          hover:opacity-90 transition"
        >
          Start Shopping Now
        </button>

      </div>
    </section>
  );
}
