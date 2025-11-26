"use client";

export default function CTASection() {
  return (
    <section
      className="
        w-full py-20 
        bg-[linear-gradient(90deg,#8736C5,#F88D25)]
        text-center
      "
    >
      <div className="max-w-[1350px] mx-auto px-6">

        {/* Heading */}
        <h2 className="text-white text-[32px] font-semibold mb-3">
          Ready to Get Started?
        </h2>

        {/* Subheading */}
        <p className="text-[#E8E8E8CC] text-[15px] font-semibold leading-[22px] mb-10">
          Join thousands of satisfied customers and discover the best products and services in your area today.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

          {/* Contact Us Button */}
          <button
            className="
              bg-white text-[#7A4ACF]
              px-8 py-[12px]
              rounded-[10px] 
              text-[15px] font-bold
              shadow-[0px_4px_10px_rgba(0,0,0,0.20)]
              transition hover:opacity-90
            "
          >
            Contact Us Now
          </button>

          {/* Browse Marketplace Button */}
          <button
            className="
              bg-transparent text-white 
              border border-white
              px-8 py-[12px]
              rounded-[10px]
              text-[15px] font-bold
              backdrop-blur-[2px]
              transition hover:bg-white/10
            "
          >
            Browse Marketplace
          </button>

        </div>

      </div>
    </section>
  );
}
