"use client";

import { LuShieldCheck, LuMapPin, LuHeadphones } from "react-icons/lu";

export default function WhyChoose() {
  const items = [
    {
      title: "Trusted & Verified",
      desc: "All our sellers and service providers are thoroughly verified and rated by our community to ensure quality and reliability.",
      icon: <LuShieldCheck size={34} color="white" />,
    },
    {
      title: "Local & Convenient",
      desc: "Find products and services right in your neighborhood. Support local businesses while enjoying fast delivery and service.",
      icon: <LuMapPin size={34} color="white" />,
    },
    {
      title: "24/7 Support",
      desc: "Our dedicated customer support team is always ready to help you with any questions or concerns you may have.",
      icon: <LuHeadphones size={34} color="white" />,
    },
  ];

  return (
    <section className="w-full py-20 px-10">
      <div className="max-w-[1350px] mx-auto">

        {/* Heading */}
        <h2 className="text-[36px] font-bold text-center mb-2">
          Why Choose CRESIFY?
        </h2>

        {/* Subheading */}
        <p className="text-center text-[#AC65EE] font-bold text-[15px] leading-[22px] mb-16">
          We&apos;re committed to providing the best marketplace experience for<br />
          our users
        </p>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-[18px] shadow-[0px_4px_18px_rgba(0,0,0,0.12)] 
              p-10 flex flex-col items-center text-center"
            >
              {/* Icon */}
              <div className="w-[70px] h-[70px] rounded-full mb-5 
                bg-gradient-to-br from-[#9838E1] to-[#F68E44] 
                flex items-center justify-center">
                {item.icon}
              </div>

              {/* Title */}
              <h3 className="text-[17px] font-bold mb-2">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-[14px] text-[#9838E1] leading-[22px] max-w-[450px]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
