import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const UserApi = createApi({
  reducerPath: "UserApi",
  baseQuery: fetchBaseQuery({ baseUrl: base_url }),
  tagTypes: ["User"], // <-- added tag type

  endpoints: (builder) => ({
    // Provider Availability
    getProviderAvailability: builder.query({
      query: (providerId) => `/provider-availability/${providerId}`,
    }),
    updateProviderAvailability: builder.mutation({
      query: ({ providerId, ...body }) => ({
        url: `/provider-availability/${providerId}`,
        method: "PUT",
        body,
      }),
    }),
    blockProviderDay: builder.mutation({
      query: ({ providerId, date }) => ({
        url: `/provider-availability/${providerId}/block-day`,
        method: "POST",
        body: { date },
      }),
    }),
    blockProviderSlot: builder.mutation({
      query: ({ providerId, date, time }) => ({
        url: `/provider-availability/${providerId}/block-slot`,
        method: "POST",
        body: { date, time },
      }),
    }),
    getProviderBookingsForDate: builder.query({
      query: ({ providerId, date }) =>
        `/provider-availability/${providerId}/bookings?date=${date}`,
    }),

    createUser: builder.mutation({
      query: (data) => ({
        url: "/user/register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"], // <-- auto refetch
    }),

    createServiceProvider: builder.mutation({
      query: (data) => ({
        url: "/user/register-provider",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"], // <-- auto refetch
    }),

    login: builder.mutation({
      query: (data) => ({
        url: "/user/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"], // <-- auto refetch
    }),

    myProfile: builder.query({
      query: (id) => `/user/myProfile/${id}`,
      providesTags: ["User"], // <-- provide tag
    }),

    getAllServiceProviders: builder.query({
      query: (page, limit, skip) =>
        `/user/all-providers?page=${page}&limit=${limit}&skip=${skip}`,
      providesTags: ["User"], // <-- provide tag
    }),

    getServiceProvider: builder.query({
      query: (id) => `/user/provider/${id}`,
      providesTags: ["User"], // <-- provide tag
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: `/user/updateProfile`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"], // <-- auto refetch after update
    }),

    changePassword: builder.mutation({
      query: (data) => ({
        url: `/user/changePassword`,
        method: "PUT",
        body: data,
      }),
    }),

    // Bookings: Today's and Upcoming
    getProviderTodaysBookings: builder.query({
      query: (providerId) => `/booking/today?providerId=${providerId}`,
      method: "GET",
    }),
    getProviderUpcomingBookings: builder.query({
      query: (providerId) => `/booking/upcoming?providerId=${providerId}`,
      method: "GET",
    }),

    // Booking stats for chart
    getProviderBookingStats: builder.query({
      query: ({ providerId, filter }) =>
        `/booking/stats?providerId=${providerId}&filter=${filter}`,
    }),
  }),
});

export const {
  useCreateUserMutation,
  useLoginMutation,
  useMyProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useCreateServiceProviderMutation,
  useGetAllServiceProvidersQuery,
  useGetServiceProviderQuery,
  useGetProviderAvailabilityQuery,
  useUpdateProviderAvailabilityMutation,
  useBlockProviderDayMutation,
  useBlockProviderSlotMutation,
  useGetProviderBookingsForDateQuery,
  useGetProviderTodaysBookingsQuery,
  useGetProviderUpcomingBookingsQuery,
  useGetProviderBookingStatsQuery,
} = UserApi;
