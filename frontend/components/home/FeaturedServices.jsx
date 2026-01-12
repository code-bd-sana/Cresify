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
  LuMapPin,
  LuStar,
} from "react-icons/lu";

import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useGetAllServiceProvidersQuery } from "@/feature/UserApi";
import { useTranslation } from "react-i18next";
import { AiFillStar } from "react-icons/ai";

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

// Custom Skeleton Loader Component
const ServiceCardSkeleton = () => (
  <div className="bg-white rounded-[20px] p-[14px] animate-pulse">
    <div className="w-full h-[210px] bg-gray-300 rounded-[16px] mb-4"></div>
    <div className="h-4 bg-gray-300 rounded mb-2"></div>
    <div className="h-3 bg-gray-300 rounded mb-3"></div>
    <div className="h-3 bg-gray-300 rounded mb-4"></div>
    <div className="h-4 bg-gray-300 rounded mb-5"></div>
    <div className="h-10 bg-gray-300 rounded-[12px]"></div>
  </div>
);

// Main Component
export default function FeaturedServices() {
  const { data, isLoading, error } = useGetAllServiceProvidersQuery({ limit: 10 });
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const {t} = useTranslation('service');

  // Process data when fetched
  useEffect(() => {
    if (data?.data) {
      const providers = data.data.providers || data.data;
      
      // Take only first 10 providers
      const limitedProviders = providers.slice(0, 10);
      
      // Process providers data
      const processedServices = limitedProviders.map((provider) => {
        const serviceName = provider.serviceName || provider.name || "Service";
        const serviceCategory = provider.serviceCategory || provider.category || "other";
        
        return {
          id: provider._id || provider.id,
          name: provider.name || "Unnamed Provider",
          serviceName: serviceName,
          title: serviceName,
          desc: provider.serviceDescription || "Professional service provider",
          icon: getServiceIcon(serviceName),
          category: serviceCategory,
          rating: 4.5, // Default rating
          reviews: 0,
          location: provider.city || provider.region || provider.country || "Location not specified",
          hourlyRate: provider.hourlyRate || 50,
          yearsOfExperience: provider.yearsOfExperience || "Not specified",
          image: provider.servicesImage?.[0] || "/blog/blog1.jpg",
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
    return (
      <section className="w-full py-20 px-10 bg-[#F5F5F7]">
        <div className="max-w-[1350px] mx-auto">
          <h2 className="text-[36px] font-bold text-center mb-2">
            {t('featured_services')}
          </h2>
          <p className="text-center text-[#AC65EE] font-bold text-[15px] mb-12">
            {t('services_subtitle')}
          </p>

          {/* Error Message */}
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
            <p className="text-red-600">Unable to load services from database.</p>
          </div>

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

  // Show empty state if no services
  if (!services || services.length === 0) {
    return (
      <section className="w-full py-20 px-10 bg-[#F5F5F7]">
        <div className="max-w-[1350px] mx-auto">
          <h2 className="text-[36px] font-bold text-center mb-2">
            {t('featured_services')}
          </h2>
          <p className="text-center text-[#AC65EE] font-bold text-[15px] mb-12">
            {t('services_subtitle')}
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
          {t('featured_services')}
        </h2>

        {/* Subheading */}
        <p className="text-center text-[#AC65EE] font-bold text-[15px] mb-12">
          {t('services_subtitle')}
        </p>

        {/* Stats */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-4 bg-white px-6 py-3 rounded-full shadow-sm">
            <span className="text-sm text-gray-600">
              <span className="font-bold text-purple-600">{services.length}</span> featured services
            </span>
            <span className="h-4 w-px bg-gray-300"></span>
            <span className="text-sm text-gray-600">
              <span className="font-bold text-orange-600">
                {services.filter(s => s.yearsOfExperience !== "Not specified").length}
              </span> experienced providers
            </span>
          </div>
        </div>

        {/* Grid - 4 columns for larger screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {services.map((service) => (
            <Link 
              key={service.id} 
              href={`/service-details?id=${service.id}`}
              className="block"
            >
              <div
                className="
                  bg-white rounded-[20px] overflow-hidden p-3.5 
                  hover:shadow-lg transition-shadow duration-300 
                  h-full flex flex-col border border-transparent
                  hover:border-purple-100
                "
              >
                {/* Image */}
                <div className="relative w-full h-[180px] mb-4 flex-shrink-0 rounded-[16px] overflow-hidden">
                  <img
                    src={service.image}
                    className="w-full h-full object-cover"
                    alt={service.title}
                    onError={(e) => {
                      e.target.src = "/blog/blog1.jpg";
                    }}
                  />
                  
                  {/* Service Category Badge */}
                  <span className="absolute top-3 right-3 px-3 py-[3px] bg-[#A46CFF] text-white text-[12px] rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.20)]">
                    {service.category}
                  </span>
                  
                  {/* Experience Badge */}
                  {service.yearsOfExperience !== "Not specified" && (
                    <span className="absolute top-3 left-3 px-3 py-[3px] bg-green-500 text-white text-[12px] rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.20)]">
                      {service.yearsOfExperience} exp
                    </span>
                  )}
                </div>

                {/* Icon and Title */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-[45px] h-[45px] rounded-[12px] 
                    bg-gradient-to-r from-[#9838E1] to-[#F68E44]
                    flex items-center justify-center flex-shrink-0"
                  >
                    {service.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[16px] font-semibold text-[#1A1A1A] mb-0.5">
                      {service.name}
                    </h3>
                    <h4 className="text-[14px] font-medium text-purple-600">
                      {service.title}
                    </h4>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[13px] text-gray-600 mb-3 line-clamp-2 flex-grow">
                  {service.desc}
                </p>

                {/* Location */}
                <div className="flex items-center gap-2 text-[13px] text-[#6A6A6A] mb-3">
                  <LuMapPin className="text-[14px] flex-shrink-0" />
                  <span className="line-clamp-1">{service.location}</span>
                </div>

                {/* Rating */}
                <div className="flex items-center text-[14px] text-[#6A6A6A] mb-4">
                  {[...Array(5)].map((_, i) => (
                    <AiFillStar
                      key={i}
                      className={`text-[15px] ${
                        i < Math.floor(service.rating) 
                          ? "text-[#FFA534]" 
                          : "text-[#E0E0E0]"
                      }`}
                    />
                  ))}
                  <span className="ml-1">{service.rating} ({service.reviews} reviews)</span>
                </div>

                {/* Price and Button */}
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-[12px] text-[#6B6B6B]">
                        Starting at
                      </p>
                      <p className="text-[20px] font-semibold text-[#F78D25]">
                        ${service.hourlyRate}/hour
                      </p>
                    </div>
                  </div>

                  {/* Button */}
                  <button className="w-full py-3 text-[15px] font-medium text-white rounded-xl bg-gradient-to-r from-[#9838E1] to-[#F68E44] shadow-[0_4px_14px_rgba(0,0,0,0.15)] hover:opacity-90 transition-opacity">
                    View Details
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Button */}
        <div className="flex justify-center mt-14">
          <Link href="/services">
            <button
              className="
                px-8 py-[12px] cursor-pointer rounded-[10px] text-white text-[15px] font-medium
                bg-gradient-to-r from-[#9838E1] to-[#F68E44]
                shadow-[0px_4px_14px_rgba(0,0,0,0.15)]
                hover:from-[#8a2dc8] hover:to-[#e57f3a] transition-all
                hover:shadow-[0px_6px_20px_rgba(152,56,225,0.3)] flex items-center gap-2
              "
            >
              {t('view_all_services')}
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