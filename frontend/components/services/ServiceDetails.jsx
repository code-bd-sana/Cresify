"use client";

import { useGetProviderDatesQuery, useGetProviderTimeslotsQuery } from "@/feature/provider/ProviderApi";
import { useGetServiceProviderQuery } from "@/feature/UserApi";
import { 
  MapPin, 
  MessageSquare, 
  Star, 
  Clock, 
  Globe, 
  Building, 
  Users, 
  Calendar, 
  CheckCircle,
  Briefcase,
  Award,
  Phone,
  Mail,
  Globe as Earth,
  Shield,
  Map,
  Target
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

 function ServiceDetailsPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const {
    data: response,
    isLoading,
    error,
  } = useGetServiceProviderQuery(id, {
    skip: !id,
  });

  // Fetch provider dates and timeslots
  const { data: datesData } = useGetProviderDatesQuery(id, { skip: !id });
  const { data: timeslotsData } = useGetProviderTimeslotsQuery(
    datesData?.data?.[0]?._id || "",
    { skip: !datesData?.data?.[0]?._id }
  );

  const provider = response?.data;
  const dates = datesData?.data || [];
  const timeslots = timeslotsData?.data || [];

  // Calculate rating (placeholder - in real app, fetch from reviews)
  const averageRating = 4.5;
  const reviewCount = 0;

  // Get working days display
  const getWorkingDaysDisplay = () => {
    if (!provider?.workingDays || provider.workingDays.length === 0) {
      return "Not specified";
    }
    return provider.workingDays.join(", ");
  };

  // Get experience display
  const getExperienceDisplay = () => {
    if (!provider?.yearsOfExperience) return "Not specified";
    return provider.yearsOfExperience;
  };

  // Get service radius display
  const getServiceRadiusDisplay = () => {
    if (!provider?.serviceRedius) return "Not specified";
    return `${provider.serviceRedius} km`;
  };

  // Get location display
  const getLocationDisplay = () => {
    const parts = [];
    if (provider?.city) parts.push(provider.city);
    if (provider?.region && provider.region !== provider.city) parts.push(provider.region);
    if (provider?.country) parts.push(provider.country);
    
    return parts.length > 0 ? parts.join(", ") : 
           provider?.serviceArea || provider?.address || "Location not specified";
  };

  if (isLoading) {
    return (
      <section className='w-full bg-[#F7F7FA] py-14 px-6 min-h-screen'>
        <div className='max-w-[1300px] mx-auto'>
          <div className='animate-pulse'>
            <div className='h-6 bg-gray-300 rounded mb-6 w-48'></div>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
              <div className='h-[335px] bg-gray-300 rounded-[14px]'></div>
              <div className='space-y-4'>
                <div className='h-6 bg-gray-300 rounded w-3/4'></div>
                <div className='h-4 bg-gray-300 rounded w-1/2'></div>
                <div className='h-4 bg-gray-300 rounded w-2/3'></div>
                <div className='h-5 bg-gray-300 rounded w-1/4'></div>
                <div className='h-20 bg-gray-300 rounded'></div>
                <div className='flex gap-4'>
                  <div className='h-12 bg-gray-300 rounded w-48'></div>
                  <div className='h-12 bg-gray-300 rounded w-12'></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !response || !provider) {
    return (
      <section className='w-full bg-[#F7F7FA] py-14 px-6 min-h-screen'>
        <div className='max-w-[1300px] mx-auto text-center py-20'>
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className='text-2xl font-semibold text-gray-800 mb-2'>
            Service Provider Not Found
          </h2>
          <p className='text-gray-600 mb-6'>
            The service provider you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/">
            <button className="px-6 py-3 bg-gradient-to-r from-[#9838E1] to-[#F68E44] text-white rounded-lg hover:opacity-90">
              Back to Home
            </button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className='w-full bg-[#F7F7FA] py-14 px-6 min-h-screen'>
      <div className='max-w-[1300px] mx-auto'>
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex text-sm text-gray-600">
            <Link href="/" className="hover:text-purple-600">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/service-providers" className="hover:text-purple-600">Service Providers</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{provider.name || provider.shopName}</span>
          </nav>
        </div>

        {/* Main Content */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
          {/* LEFT COLUMN - Images and Basic Info */}
          <div>
            {/* Main Image */}
            <div className='w-full h-[335px] rounded-[14px] overflow-hidden bg-gradient-to-br from-purple-50 to-orange-50 shadow-lg'>
              {provider.image || provider.businessLogo ? (
                <img
                  src={provider.image || provider.businessLogo}
                  alt={provider.name || provider.shopName}
                  className='h-full w-full object-cover'
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🔧</div>
                    <p className="text-gray-600 font-medium">{provider.name || provider.shopName}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Service Images Grid (if available) */}
            {provider.servicesImage && provider.servicesImage.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Service Gallery</h3>
                <div className="grid grid-cols-4 gap-3">
                  {provider.servicesImage.slice(0, 4).map((img, index) => (
                    <div
                      key={index}
                      className="h-20 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                    >
                      <img
                        src={img}
                        alt={`Service ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                  {provider.servicesImage.length > 4 && (
                    <div className="h-20 rounded-lg bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-600 font-medium">
                        +{provider.servicesImage.length - 4}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Provider Stats */}
            {/* <div className="mt-8 bg-white rounded-xl p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Provider Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Working Days</p>
                    <p className="font-medium">{getWorkingDaysDisplay()}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Working Hours</p>
                    <p className="font-medium">
                      {provider.workingHours?.start || "09:00"} - {provider.workingHours?.end || "18:00"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Map className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Service Radius</p>
                    <p className="font-medium">{getServiceRadiusDisplay()}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Experience</p>
                    <p className="font-medium">{getExperienceDisplay()}</p>
                  </div>
                </div>
              </div>
            </div> */}
          </div>

          {/* RIGHT COLUMN - Details */}
          <div className='pt-2'>
            {/* Provider Name and Badge */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className='text-2xl font-bold text-gray-900'>
                  {provider.name || provider.shopName}
                </h1>
                {provider.shopName && provider.shopName !== provider.name && (
                  <p className="text-lg text-gray-600 mt-1">{provider.shopName}</p>
                )}
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                provider.status === "active" 
                  ? "bg-green-100 text-green-800" 
                  : provider.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}>
                {provider.status?.charAt(0).toUpperCase() + provider.status?.slice(1) || "Active"}
              </span>
            </div>

            {/* Service Information */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  {provider.serviceName || provider.category || "Service Provider"}
                </div>
                <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {provider.serviceCategory || "Professional Service"}
                </div>
              </div>
              
              {/* Rating and Reviews */}
              <div className='flex items-center gap-2 mt-3'>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < Math.floor(averageRating) ? 'text-[#F78D25] fill-[#F78D25]' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <p className='text-sm text-gray-700 ml-1'>
                  <span className="font-semibold">{averageRating}</span> 
                  <span className="text-gray-500"> ({reviewCount} reviews)</span>
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" /> Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{provider.phoneNumber || "Not provided"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{provider.email || "Not provided"}</span>
                </div>
              </div>
            </div>

            {/* Location Details */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Location
              </h3>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  <p className="text-gray-800 font-medium">{getLocationDisplay()}</p>
                </div>
                
                {/* Detailed Location Info */}
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {provider.city && (
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">City</p>
                        <p className="text-sm font-medium">{provider.city}</p>
                      </div>
                    </div>
                  )}
                  
                  {provider.region && provider.region !== provider.city && (
                    <div className="flex items-center gap-2">
                      <Map className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Region</p>
                        <p className="text-sm font-medium">{provider.region}</p>
                      </div>
                    </div>
                  )}
                  
                  {provider.country && (
                    <div className="flex items-center gap-2">
                      <Earth className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Country</p>
                        <p className="text-sm font-medium">{provider.country}</p>
                      </div>
                    </div>
                  )}
                  
                  {provider.serviceArea && (
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Service Area</p>
                        <p className="text-sm font-medium">{provider.serviceArea}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {provider.address && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Full Address</p>
                    <p className="text-sm text-gray-700">{provider.address}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Service Description */}
            <div className='mb-8'>
              <h3 className='text-lg font-semibold text-gray-800 mb-3'>Service Description</h3>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className='text-gray-700 leading-relaxed'>
                  {provider.serviceDescription || 
                   provider.shopDescription || 
                   provider.category ? 
                   `Professional ${provider.category || "service"} provider offering quality services.` : 
                   "Professional service provider with expertise in various domains."}
                </p>
                
                {/* Service Features */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {provider.serviceRedius && provider.serviceRedius > 0 && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Service radius: {provider.serviceRedius}km</span>
                    </div>
                  )}
                  
                  {provider.slotDuration && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">Slot: {provider.slotDuration} min</span>
                    </div>
                  )}
                  
                  {provider.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-purple-500" />
                      <a href={provider.website} target="_blank" rel="noopener noreferrer" 
                         className="text-sm text-blue-600 hover:underline">
                        Website
                      </a>
                    </div>
                  )}
                  
                  {provider.nationalId && (
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-orange-500" />
                      <span className="text-sm">Verified ID</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="mb-8">
              <div className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-orange-50 rounded-xl p-5">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Hourly Rate</p>
                  <p className='text-3xl font-bold text-gray-900'>
                    ${provider.hourlyRate || 0}<span className="text-lg text-gray-600">/hour</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Transparent pricing • No hidden fees
                  </p>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Available Now
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex flex-col sm:flex-row items-center gap-4'>
              {/* BOOK NOW BUTTON */}
              <Link href={`/book-now?id=${provider._id}`} className="flex-1 w-full">
                <button className='
                  w-full h-[52px] rounded-[12px]
                  bg-gradient-to-r from-[#9838E1] to-[#F68E44]
                  flex items-center justify-center gap-3
                  text-white text-[16px] font-semibold
                  shadow-[0_4px_14px_rgba(0,0,0,0.15)]
                  hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)]
                  transition-all duration-300
                '>
                  <Calendar className="w-5 h-5" />
                  Book 
                </button>
              </Link>

              {/* MESSAGE BUTTON */}
              <button className='
                w-[52px] h-[52px] rounded-[12px]
                flex items-center justify-center
                bg-white border-2 border-gray-300
                hover:border-[#9838E1] hover:bg-purple-50
                transition-all duration-300
                shadow-sm
              '>
                <MessageSquare size={20} className='text-gray-600 hover:text-[#9838E1]' />
              </button>
              
              {/* CALL BUTTON */}
              {provider.phoneNumber && (
                <a 
                  href={`tel:${provider.phoneNumber}`}
                  className='
                    w-[52px] h-[52px] rounded-[12px]
                    flex items-center justify-center
                    bg-white border-2 border-gray-300
                    hover:border-green-500 hover:bg-green-50
                    transition-all duration-300
                    shadow-sm
                  '
                >
                  <Phone size={20} className='text-gray-600 hover:text-green-600' />
                </a>
              )}
            </div>

            {/* Additional Info */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                Registered on {new Date(provider.createdAt).toLocaleDateString()} • 
                Last updated {new Date(provider.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Availability Section */}
        {/* <div className="mt-12 bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Availability</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Working Schedule</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Days:</span>
                  <span className="font-medium">{getWorkingDaysDisplay()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Hours:</span>
                  <span className="font-medium">
                    {provider.workingHours?.start || "09:00"} - {provider.workingHours?.end || "18:00"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Time Slot:</span>
                  <span className="font-medium">{provider.slotDuration || 30} minutes</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Service Details</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Experience:</span>
                  <span className="font-medium">{getExperienceDisplay()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Service Radius:</span>
                  <span className="font-medium">{getServiceRadiusDisplay()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{provider.serviceCategory || provider.category || "General"}</span>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
}

import React from 'react';

const ServiceDetails = () => {
  return (
    <div>
      <Suspense fallback={<>Loading...</>}>

        <ServiceDetailsPage/>
      </Suspense>
    </div>
  );
};

export default ServiceDetails;