"use client";

import { useGetProviderDatesQuery, useGetProviderTimeslotsQuery } from "@/feature/provider/ProviderApi";
import { Calendar, FileText } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { useTranslation } from "react-i18next";

 function BookingStepsContentPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { t } = useTranslation('booking');
  
  const [date, setDate] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  // Log provider ID for debugging
  useEffect(() => {
    console.log('Provider ID from URL:', id);
    
    if (!id) {
      console.warn('No provider ID found in URL');
    }
  }, [id]);

  // Fetch available dates
  const { 
    data: availableDate, 
    isLoading: datesLoading, 
    isError: datesError,
    error: datesErrorData 
  } = useGetProviderDatesQuery(id, {
    skip: !id // Skip if no id
  });

  // Fetch time slots for selected date
  const { 
    data: timeSlot, 
    isLoading: slotsLoading,
    isError: slotsError,
    error: slotsErrorData
  } = useGetProviderTimeslotsQuery(date, {
    skip: !date // Skip if no date selected
  });

  // Log data for debugging
  useEffect(() => {
    if (availableDate) {
      console.log('Available dates:', availableDate);
    }
    
    if (datesError) {
      console.error('Error fetching dates:', datesErrorData);
    }
  }, [availableDate, datesError, datesErrorData]);

  useEffect(() => {
    if (timeSlot) {
      console.log('Time slots for date', date, ':', timeSlot);
    }
    
    if (slotsError) {
      console.error('Error fetching time slots:', slotsErrorData);
    }
  }, [timeSlot, slotsError, slotsErrorData, date]);

  // Handle date selection
  const handleDateSelect = (selectedDateId) => {
    console.log('Date selected:', selectedDateId);
    setDate(selectedDateId);
    setLoadingId(selectedDateId);
  };

  // Loading states
  const isLoading = datesLoading || slotsLoading;

  // Error states
  const hasError = datesError || slotsError;

  if (hasError) {
    return (
      <div className="w-full flex justify-center py-10">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md">
          <p className="text-red-700 text-center">
            {t('error_loading_data') || "Error loading booking data. Please try again."}
          </p>
          {datesErrorData && (
            <p className="text-red-600 text-sm mt-2 text-center">
              {datesErrorData.message || "Failed to fetch available dates"}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (!id) {
    return (
      <div className="w-full flex justify-center py-10">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md">
          <p className="text-yellow-700 text-center">
            {t('no_provider_id') || "No provider ID provided. Please select a service provider."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Booking Steps Progress */}
      <div className="flex justify-center py-10">
        <div className="flex items-center gap-8">
          {/* STEP 1 — SELECT DATE & TIME */}
          <div className="flex items-center gap-2">
            <div
              className={`
                w-[40px] h-[40px] rounded-full
                flex items-center justify-center
                shadow-[0_2px_8px_rgba(0,0,0,0.15)]
                transition-all duration-300
                ${date ? 'bg-gradient-to-r from-[#9838E1] to-[#F68E44]' : 'bg-gray-100'}
              `}
            >
              <Calendar 
                size={18} 
                className={date ? "text-white" : "text-gray-400"} 
              />
            </div>

            <div>
              <span className="text-[14px] font-medium text-[#1B1B1B]">
                {t('step1_title') || "Select Date & Time"}
              </span>
              {datesLoading && (
                <p className="text-xs text-gray-500 mt-1">Loading dates...</p>
              )}
              {availableDate?.data?.length > 0 && (
                <p className="text-xs text-green-600 mt-1">
                  {availableDate.data.length} {t('available_dates') || "dates available"}
                </p>
              )}
            </div>
          </div>

          {/* GRADIENT CONNECTOR */}
          <div className="w-[120px] h-[4px] rounded-full bg-gradient-to-r from-[#9838E1] to-[#F68E44]" />

          {/* STEP 2 — BOOKING DETAILS */}
          <div className="flex items-center gap-2">
            <div
              className={`
                w-[40px] h-[40px] rounded-full
                flex items-center justify-center
                transition-all duration-300
                ${timeSlot?.data?.length > 0 ? 'bg-gradient-to-r from-[#9838E1] to-[#F68E44]' : 'bg-gray-100 opacity-60'}
              `}
            >
              <FileText 
                size={18} 
                className={timeSlot?.data?.length > 0 ? "text-white" : "text-gray-400"} 
              />
            </div>

            <div>
              <span className={`text-[14px] font-medium ${timeSlot?.data?.length > 0 ? 'text-[#1B1B1B]' : 'text-[#7A7A7A]'}`}>
                {t('step2_title') || "Booking Details & Payment"}
              </span>
              {slotsLoading && loadingId === date && (
                <p className="text-xs text-gray-500 mt-1">Loading time slots...</p>
              )}
              {timeSlot?.data?.length > 0 && (
                <p className="text-xs text-green-600 mt-1">
                  {timeSlot.data.length} {t('available_slots') || "slots available"}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Debug Info (only in development) */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div className="max-w-md mx-auto mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-xs font-semibold text-gray-700 mb-2">Debug Info:</h4>
          <div className="space-y-1 text-xs text-gray-600">
            <p>Provider ID: <span className="font-mono">{id || 'Not found'}</span></p>
            <p>Selected Date ID: <span className="font-mono">{date || 'Not selected'}</span></p>
            <p>Available Dates: <span className="font-mono">{availableDate?.data?.length || 0}</span></p>
            <p>Time Slots: <span className="font-mono">{timeSlot?.data?.length || 0}</span></p>
          </div>
        </div>
      )} */}

      {/* Available Dates Selection (Optional - if you want to show dates) */}
      {/* {availableDate?.data?.length > 0 && (
        <div className="max-w-2xl mx-auto mt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">
            {t('select_date') || "Select a date to see available time slots"}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {availableDate.data.slice(0, 8).map((dateItem, index) => (
              <button
                key={dateItem._id}
                onClick={() => handleDateSelect(dateItem._id)}
                disabled={slotsLoading && loadingId === dateItem._id}
                className={`
                  p-3 rounded-lg border text-center transition-colors
                  ${date === dateItem._id 
                    ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-300 text-purple-700' 
                    : 'bg-white border-gray-200 hover:border-purple-200 hover:bg-purple-50'
                  }
                  ${(slotsLoading && loadingId === dateItem._id) ? 'opacity-50 cursor-wait' : ''}
                `}
              >
                <div className="text-sm font-medium">
                  {new Date(dateItem.workingDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
                {slotsLoading && loadingId === dateItem._id && (
                  <div className="mt-1">
                    <div className="inline-block animate-spin rounded-full h-3 w-3 border-b-2 border-purple-600"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )} */}
    </div>
  );
}

import React from 'react';

const BookingSteps = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <BookingStepsContentPage />
      </Suspense>
    </div>
  );
};

export default BookingSteps;