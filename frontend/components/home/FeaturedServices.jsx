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
  LuDroplets,
  LuHammer,
} from "react-icons/lu";

import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useGetAllServiceProvidersQuery } from "@/feature/UserApi";

// Service icons mapping
const serviceIcons = {
  cleaning: <LuHouse size={28} color="#ffffff" />,
  plumbing: <LuWrench size={28} color="#ffffff" />,
  electrical: <LuZap size={28} color="#ffffff" />,
  gardening: <LuFlower2 size={28} color="#ffffff" />,
  painting: <LuPaintbrush size={28} color="#ffffff" />,
  moving: <LuTruck size={28} color="#ffffff" />,
  "pet care": <LuPawPrint size={28} color="#ffffff" />,
  tutoring: <LuBookOpen size={28} color="#ffffff" />,
  "appliance repair": <LuWrench size={28} color="#ffffff" />,
  carpentry: <LuHammer size={28} color="#ffffff" />,
  "handyman": <LuWrench size={28} color="#ffffff" />,
  "water services": <LuDroplets size={28} color="#ffffff" />,
  "other": <LuWrench size={28} color="#ffffff" />,
};

// Fallback icons for unknown services
const getServiceIcon = (serviceName) => {
  const name = (serviceName || "").toLowerCase();
  
  if (name.includes("clean")) return serviceIcons.cleaning;
  if (name.includes("plumb") || name.includes("pipe")) return serviceIcons.plumbing;
  if (name.includes("electric") || name.includes("wire")) return serviceIcons.electrical;
  if (name.includes("garden") || name.includes("plant")) return serviceIcons.gardening;
  if (name.includes("paint")) return serviceIcons.painting;
  if (name.includes("move") || name.includes("pack")) return serviceIcons.moving;
  if (name.includes("pet") || name.includes("animal")) return serviceIcons["pet care"];
  if (name.includes("tutor") || name.includes("teach")) return serviceIcons.tutoring;
  if (name.includes("appliance")) return serviceIcons["appliance repair"];
  if (name.includes("carpent") || name.includes("wood")) return serviceIcons.carpentry;
  if (name.includes("handyman") || name.includes("repair")) return serviceIcons.handyman;
  if (name.includes("water")) return serviceIcons["water services"];
  
  return serviceIcons.other;
};

// Get service title from service name
const getServiceTitle = (serviceName) => {
  const name = (serviceName || "").toLowerCase();
  
  const titleMap = {
    "cleaning": "Home Cleaning",
    "plumbing": "Plumbing",
    "electrical": "Electrical",
    "gardening": "Gardening",
    "painting": "Painting",
    "moving": "Moving",
    "pet care": "Pet Care",
    "tutoring": "Tutoring",
    "appliance repair": "Appliance Repair",
    "carpentry": "Carpentry",
    "handyman": "Handyman Services",
    "water services": "Water Services",
    "other": "Other Services",
  };
  
  // Find matching service
  for (const [key, title] of Object.entries(titleMap)) {
    if (name.includes(key)) return title;
  }
  
  // Capitalize first letter of each word
  return serviceName
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Get service description
const getServiceDescription = (serviceName) => {
  const name = (serviceName || "").toLowerCase();
  
  const descriptionMap = {
    "cleaning": "Professional cleaning services for your home",
    "plumbing": "Expert plumbers for all your needs",
    "electrical": "Licensed electricians at your service",
    "gardening": "Transform your outdoor spaces",
    "painting": "Professional painting services",
    "moving": "Reliable moving and packing services",
    "pet care": "Caring for your furry friends",
    "tutoring": "Expert tutors for all subjects",
    "appliance repair": "Repair and maintenance for all appliances",
    "carpentry": "Custom woodwork and furniture",
    "handyman": "All-around repair and maintenance",
    "water services": "Water supply and plumbing solutions",
    "other": "Various professional services",
  };
  
  // Find matching description
  for (const [key, desc] of Object.entries(descriptionMap)) {
    if (name.includes(key)) return desc;
  }
  
  return "Professional service providers";
};

// Custom Skeleton Loader Component
const ServiceCardSkeleton = () => (
  <div className="rounded-[18px] p-5 bg-white shadow-[0px_4px_18px_rgba(0,0,0,0.10)] animate-pulse">
    {/* Icon Box Skeleton */}
    <div className="w-[55px] h-[55px] rounded-[14px] bg-gray-300 mb-4"></div>
    
    {/* Title Skeleton */}
    <div className="h-5 bg-gray-300 rounded mb-2 w-3/4"></div>
    
    {/* Description Skeleton */}
    <div className="h-4 bg-gray-300 rounded mb-3 w-full"></div>
    <div className="h-4 bg-gray-300 rounded mb-4 w-2/3"></div>
    
    {/* Providers Skeleton */}
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
    </div>
  </div>
);

// Main Component
export default function FeaturedServices() {
  const { data, isLoading, error } = useGetAllServiceProvidersQuery({ limit: 10 });
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (data?.data) {
      const servicesData = data.data;
      
      // Process services data
      const processedServices = servicesData.map((service, index) => {
        const serviceName = service.name || service.title || service.serviceName || "Service";
        const serviceCategory = service.category || service.serviceCategory || "other";
        
        return {
          id: service._id || `service-${index}`,
          title: getServiceTitle(serviceName),
          desc: service.description || getServiceDescription(serviceName),
          icon: getServiceIcon(serviceName),
          providers: service.providerCount || service.providers || Math.floor(Math.random() * 50) + 20,
          active: index === 0, // First one active
          category: serviceCategory,
          name: serviceName,
        };
      });
      
      setServices(processedServices);
      setLoading(false);
    }
  }, [data]);

  // Show loading skeleton
  if (isLoading || loading) {
    return (
      <section className="w-full py-20 px-10 bg-[#F5F5F7]">
        <div className="max-w-[1350px] mx-auto">
          {/* Heading Skeleton */}
          <div className="text-center mb-2">
            <div className="h-10 bg-gray-300 rounded-lg mx-auto mb-2 max-w-[300px] animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded mx-auto mb-12 max-w-[400px] animate-pulse"></div>
          </div>

          {/* Stats Skeleton */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-4 bg-gray-300 px-6 py-3 rounded-full animate-pulse max-w-[200px] mx-auto">
              <div className="h-4 bg-gray-400 rounded w-full"></div>
            </div>
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, index) => (
              <ServiceCardSkeleton key={index} />
            ))}
          </div>

          {/* Button Skeleton */}
          <div className="flex justify-center mt-14">
            <div className="px-8 py-3 rounded-[10px] bg-gray-300 w-40 animate-pulse"></div>
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    // Fallback to default services if API fails
    const fallbackServices = [
      {
        id: "1",
        title: "Home Cleaning",
        desc: "Professional cleaning services for your home",
        icon: <LuHouse size={28} color="#ffffff" />,
        providers: 45,
        active: true,
      },
      {
        id: "2",
        title: "Plumbing",
        desc: "Expert plumbers for all your needs",
        icon: <LuWrench size={28} color="#ffffff" />,
        providers: 32,
      },
      {
        id: "3",
        title: "Electrical",
        desc: "Licensed electricians at your service",
        icon: <LuZap size={28} color="#ffffff" />,
        providers: 28,
      },
      {
        id: "4",
        title: "Gardening",
        desc: "Transform your outdoor spaces",
        icon: <LuFlower2 size={28} color="#ffffff" />,
        providers: 24,
      },
      {
        id: "5",
        title: "Painting",
        desc: "Professional painting services",
        icon: <LuPaintbrush size={28} color="#ffffff" />,
        providers: 36,
      },
      {
        id: "6",
        title: "Moving",
        desc: "Reliable moving and packing services",
        icon: <LuTruck size={28} color="#ffffff" />,
        providers: 19,
      },
      {
        id: "7",
        title: "Pet Care",
        desc: "Caring for your furry friends",
        icon: <LuPawPrint size={28} color="#ffffff" />,
        providers: 22,
      },
      {
        id: "8",
        title: "Tutoring",
        desc: "Expert tutors for all subjects",
        icon: <LuBookOpen size={28} color="#ffffff" />,
        providers: 41,
      },
    ];

    return (
      <section className="w-full py-20 px-10 bg-[#F5F5F7]">
        <div className="max-w-[1350px] mx-auto">
          <h2 className="text-[36px] font-bold text-center mb-2">
            Featured Services
          </h2>
          <p className="text-center text-[#AC65EE] font-bold text-[15px] mb-12">
            Find trusted professionals for any service you need in your area
          </p>

          {/* Error Message */}
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
            <p className="text-red-600">Unable to load services from database. Showing popular services instead.</p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {fallbackServices.map((item) => (
              <div
                key={item.id}
                className={`
                  rounded-[18px] p-5 bg-white shadow-[0px_4px_18px_rgba(0,0,0,0.10)]
                  hover:shadow-[0px_6px_22px_rgba(0,0,0,0.16)]
                  transition
                  border ${item.active ? "border-[#9838E1]" : "border-transparent"}
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
            <Link href="/services">
              <button
                className="
                px-8 py-[12px] rounded-[10px] text-white text-[15px] font-medium
                bg-gradient-to-r from-[#9838E1] to-[#F68E44]
                shadow-[0px_4px_14px_rgba(0,0,0,0.15)]
              "
              >
                View All Categories
              </button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // Show empty state if no services
  if (!services || services.length === 0) {
    return (
      <section className="w-full py-20 px-10 bg-[#F5F5F7]">
        <div className="max-w-[1350px] mx-auto">
          <h2 className="text-[36px] font-bold text-center mb-2">
            Featured Services
          </h2>
          <p className="text-center text-[#AC65EE] font-bold text-[15px] mb-12">
            Find trusted professionals for any service you need in your area
          </p>

          {/* Empty State */}
          <div className="text-center py-12">
            <div className="inline-block p-6 bg-gradient-to-r from-purple-100 to-orange-100 rounded-full mb-4">
              <LuWrench size={48} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No services available
            </h3>
            <p className="text-gray-600 mb-6">
              Services will be added soon. Check back later!
            </p>
          </div>

          {/* Button */}
          <div className="flex justify-center mt-14">
            <Link href="/services">
              <button
                className="
                px-8 py-[12px] rounded-[10px] text-white text-[15px] font-medium
                bg-gradient-to-r from-[#9838E1] to-[#F68E44]
                shadow-[0px_4px_14px_rgba(0,0,0,0.15)]
              "
              >
                Browse All Services
              </button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

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

        {/* Stats */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-4 bg-white px-6 py-3 rounded-full shadow-sm">
            <span className="text-sm text-gray-600">
              <span className="font-bold text-purple-600">{services.length}</span> services available
            </span>
            <span className="h-4 w-px bg-gray-300"></span>
            <span className="text-sm text-gray-600">
              <span className="font-bold text-orange-600">
                {services.reduce((sum, service) => sum + service.providers, 0)}
              </span> total providers
            </span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {services.map((item, index) => (
            <Link 
              key={item.id} 
              href={`/services?service=${encodeURIComponent(item.category || item.name)}`}
              className="block"
            >
              <div
                className={`
                  rounded-[18px] p-5 bg-white shadow-[0px_4px_18px_rgba(0,0,0,0.10)]
                  hover:shadow-[0px_6px_22px_rgba(0,0,0,0.16)]
                  transition-all duration-300 hover:scale-[1.02]
                  border ${item.active ? "border-[#9838E1]" : "border-transparent"}
                  cursor-pointer h-full
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
                  <span className="font-medium">{item.providers}</span> providers available
                </div>

                {/* Service Category Badge */}
                {item.category && (
                  <div className="mt-4">
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      {item.category}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Button */}
        <div className="flex justify-center mt-14">
          <Link href="/services">
            <button
              className="
              px-8 py-[12px] rounded-[10px] text-white text-[15px] font-medium
              bg-gradient-to-r from-[#9838E1] to-[#F68E44]
              shadow-[0px_4px_14px_rgba(0,0,0,0.15)]
              hover:shadow-[0px_6px_20px_rgba(152,56,225,0.3)]
              transition-all duration-300
              flex items-center gap-2
            "
            >
              View All Categories
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}