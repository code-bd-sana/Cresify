import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/**
 * Admin User Management API
 * Handles admin operations such as overview stats
 */
export const AdminDashboardApi = createApi({
  reducerPath: "AdminDashboardApi",
  baseQuery: fetchBaseQuery({ baseUrl: base_url }),
  tagTypes: ["AdminDashboard"],

  endpoints: (builder) => ({
    /**
     * Admin Overview
     * Returns statistics: Admin overview dashboard stats
     */
    getAdminOverview: builder.query({
      query: () => "/admin/overview",
      providesTags: ["AdminDashboard"],
    }),
  }),
})  

export const { useGetAdminOverviewQuery } = AdminDashboardApi;
