import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ProviderApi = createApi({
  reducerPath: "ProviderApi",
  baseQuery: fetchBaseQuery({ baseUrl: base_url }),
  tagTypes: ["ProviderAvailability", "TimeSlots"],
  endpoints: (builder) => ({
    // ========== DATE MANAGEMENT ==========
    createDate: builder.mutation({
      query: (data) => ({
        url: `/provider-availability/createDate`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ProviderAvailability"],
    }),
    deleteDate: builder.mutation({
      query: (id) => ({
        url: `/provider-availability/deleteDate/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ProviderAvailability"],
    }),
    getProviderDates: builder.query({
      query: (providerId) => `/provider-availability/getProviderDates/${providerId}`,
      providesTags: ["ProviderAvailability"],
    }),

    // ========== TIME SLOT MANAGEMENT ==========
    createTimeSlot: builder.mutation({
      query: (data) => ({
        url: `/provider-availability/createTimeSlot`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["TimeSlots"],
    }),
    deleteTimeslot: builder.mutation({
      query: (id) => ({
        url: `/provider-availability/deleteTimeSlot/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TimeSlots"],
    }),
    getProviderTimeslots: builder.query({
      query: (dateId) => `/provider-availability/getProviderTimeSlots/${dateId}`,
      providesTags: ["TimeSlots"],
    }),
    bookService: builder.mutation({
      query: (data) => ({
        url: `/booking`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ProviderAvailability", "TimeSlots"],
    }),
    getUserBookings: builder.query({
      query: (id) => `/booking/userBookings/${id}`,
      providesTags: ["Bookings"],
    }),

    getProviderBookings: builder.query({
      query: (id) => `/booking/providerBookings/${id}`,
      providesTags: ["Bookings"],
    }),

    getAllBookings: builder.query({
      query: () => `/booking`,
      providesTags: ["Bookings"],
    }),
  }),
});

// ✅ Auto-generated hooks
export const {
  useCreateDateMutation,
  useDeleteDateMutation,
  useGetProviderDatesQuery,
  useCreateTimeSlotMutation,
  useDeleteTimeslotMutation,
  useGetProviderTimeslotsQuery,
  useBookServiceMutation,
  useGetAllBookingsQuery,
  useGetUserBookingsQuery,
  useGetProviderBookingsQuery,
} = ProviderApi;