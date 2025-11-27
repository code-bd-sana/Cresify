"use client";

export default function OurStory() {
  return (
    <section className="w-full bg-[#F7F7FA] py-20 px-6">
      <div className="max-w-[1300px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* IMAGE */}
        <div className="w-full">
          <img
            src="/about/about.jpg" 
            alt="Our Story"
            className="w-full h-[380px] object-cover rounded-[20px]"
          />
        </div>

        {/* TEXT BLOCK */}
        <div className="max-w-[540px]">

          {/* Title */}
          <h2 className="text-[32px] font-bold text-[#1B1B1B] mb-4">
            Our Story
          </h2>

          {/* Paragraph 1 */}
          <p className="text-[15px] font-medium text-[#4A4A4A] leading-[22px] mb-4">
            CRESIFY was born from a simple observation:
            <span className="text-[#A46CFF] hover:underline cursor-pointer">
              finding quality local services and products shouldn’t be complicated.
            </span>
            In 2020, our founders recognized the gap between talented local businesses
            and customers who needed them.
          </p>

          {/* Paragraph 2 */}
          <p className="text-[15px] text-[#4A4A4A] leading-[22px] mb-4">
            What started as a small platform in Buenos Aires has grown into
            <span className="text-[#A46CFF] hover:underline cursor-pointer">
              Latin America’s most trusted marketplace,
            </span>
            connecting millions of customers with thousands of verified sellers and
            service providers across the region.
          </p>

          {/* Paragraph 3 */}
          <p className="text-[15px] text-[#4A4A4A] leading-[22px]">
            Today, we’re proud to support
            <span className="text-[#A46CFF] hover:underline cursor-pointer">
              over 10,000 local businesses
            </span>
            and serve more than
            <span className="text-[#A46CFF] hover:underline cursor-pointer">
              500,000 satisfied customers,
            </span>
            helping communities thrive through commerce and connection.
          </p>

        </div>
      </div>
    </section>
  );
}
