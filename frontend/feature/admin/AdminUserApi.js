import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/**
 * Admin User Management API
 * Handles admin operations such as overview, listing, searching,
 * and status updates for users.
 */
export const AdminUserApi = createApi({
  reducerPath: "AdminUserApi",
  baseQuery: fetchBaseQuery({ baseUrl: base_url }),
  tagTypes: ["AdminUsers"],

  endpoints: (builder) => ({
    /**
     * Admin Overview
     * Returns statistics: total users, total sellers, total buyers,
     * total service providers.
     */
    getAdminOverview: builder.query({
      query: () => "/admin/users/overview",
      providesTags: ["AdminUsers"],
    }),

    /**
     * Get All Users
     * Fetches a complete list of users for admin dashboards.
     * @query search - Search by email or name (optional)
     * @query skip - Number of records to skip for pagination (default: 0)
     * @query limit - Number of records to return (default: 10)
     */
    getAllUsers: builder.query({
      query: ({ search, skip, limit }) =>
        `/admin/users?skip=${skip}&limit=${limit}&search=${encodeURIComponent(
          search ?? ""
        )}`,
      providesTags: ["AdminUsers"],
    }),

    /**
     * Change User Status
     * Admin can update user status:
     * active | pending | suspend
     *
     * @param {Object} data
     * @param {string} data.userId
     * @param {string: "active" | "pending" | "suspend"} data.status
     */
    changeUserStatus: builder.mutation({
      query: (data) => ({
        url: `/admin/users/status/${data.userId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["AdminUsers"],
    }),
  }),
});

export const {
  useGetAdminOverviewQuery,
  useGetAllUsersQuery,
  useChangeUserStatusMutation,
} = AdminUserApi;
