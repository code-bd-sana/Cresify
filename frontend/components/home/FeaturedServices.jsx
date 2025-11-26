"use client";

import {
  LuHouse,
  LuZap,
  LuPaintbrush,
  LuTruck,
  LuPawPrint,
  LuBookOpen,
  LuFlower2,
  LuWrench,
} from "react-icons/lu";



import { FaUserCircle } from "react-icons/fa";

export default function FeaturedServices() {
 const services = [
  {
    title: "Home Cleaning",
    desc: "Professional cleaning services for your home",
    icon: <LuHouse size={28} color="#ffffff" />,
    providers: 45,
    active: true,
  },
  {
    title: "Plumbing",
    desc: "Expert plumbers for all your needs",
    icon: <LuWrench size={28} color="#ffffff" />,
    providers: 45,
  },
  {
    title: "Electrical",
    desc: "Licensed electricians at your service",
    icon: <LuZap size={28} color="#ffffff" />,
    providers: 45,
  },
  {
    title: "Gardening",
    desc: "Transform your outdoor spaces",
    icon: <LuFlower2 size={28} color="#ffffff" />,
    providers: 45,
  },
  {
    title: "Painting",
    desc: "Professional painting services",
    icon: <LuPaintbrush size={28} color="#ffffff" />,
    providers: 45,
  },
  {
    title: "Moving",
    desc: "Reliable moving and packing services",
    icon: <LuTruck size={28} color="#ffffff" />,
    providers: 45,
  },
  {
    title: "Pet Care",
    desc: "Caring for your furry friends",
    icon: <LuPawPrint size={28} color="#ffffff" />,
    providers: 45,
  },
  {
    title: "Tutoring",
    desc: "Expert tutors for all subjects",
    icon: <LuBookOpen size={28} color="#ffffff" />,
    providers: 45,
  },
];


  return (
    <section className="w-full py-20 px-10 bg-[#F5F5F7]">
      <div className="max-w-[1350px] mx-auto">
        {/* Heading */}
        <h2 className="text-[36px] font-bold text-center mb-2">
          Featured Services
        </h2>

        {/* Subheading */}
        <p className="text-center text-[#AC65EE] font-bold text-[15px] mb-12">
          Find trusted professionals for any service you need in your area
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {services.map((item, index) => (
            <div
              key={index}
              className={`
                rounded-[18px] p-5 bg-white shadow-[0px_4px_18px_rgba(0,0,0,0.10)]
                hover:shadow-[0px_6px_22px_rgba(0,0,0,0.16)]
                transition
                border ${
                  item.active ? "border-[#9838E1]" : "border-transparent"
                }
              `}
            >
              {/* Icon Box */}
              <div
                className="w-[55px] h-[55px] rounded-[14px] 
                bg-gradient-to-r from-[#9838E1] to-[#F68E44]
                flex items-center justify-center mb-4"
              >
                {item.icon}
              </div>

              {/* Title */}
              <h3 className="text-[16px] font-bold mb-1">{item.title}</h3>

              {/* Description */}
              <p className="text-[14px] text-[#9838E1] leading-[22px] mb-4">
                {item.desc}
              </p>

              {/* Providers */}
              <div className="flex items-center gap-2 text-[13px] text-[#6D6D6D]">
                <FaUserCircle className="text-[16px]" />
                {item.providers} providers
              </div>
            </div>
          ))}
        </div>

        {/* Button */}
        <div className="flex justify-center mt-14">
          <button
            className="
            px-8 py-[12px] rounded-[10px] text-white text-[15px] font-medium
            bg-gradient-to-r from-[#9838E1] to-[#F68E44]
            shadow-[0px_4px_14px_rgba(0,0,0,0.15)]
          "
          >
            View All Categories
          </button>
        </div>
      </div>
    </section>
  );
}
