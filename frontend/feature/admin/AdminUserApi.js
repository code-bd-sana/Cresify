import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const AdminUserApi = createApi({
  reducerPath: "AdminUserApi",
  baseQuery: fetchBaseQuery({ baseUrl: base_url }),
  tagTypes: ["AdminUsers"],

  endpoints: (builder) => ({
    getAdminOverview: builder.query({
      query: () => "/admin/overview",
      providesTags: ["AdminUsers"],
    }),

    /**
     * Get All Users
     * Fetches a complete list of users for admin dashboards.
     * @query search - Search by email or name (optional)
     * @query skip - Number of records to skip for pagination (default: 0)
     * @query limit - Number of records to return (default: 10)
     * @query role - Filter users by role (optional)
     */
    getAllUsers: builder.query({
      query: ({ search, skip, limit, role }) =>
        `/admin/users?skip=${skip}&limit=${limit}&search=${encodeURIComponent(
          search ?? ""
        )}&role=${role ?? ""}`,
      providesTags: ["AdminUsers"],
    }),

    /**
     * Change User Status
     * Updates the status of a user (active, pending, suspend).
     * @param {Object} data - Data containing user ID and new status
     */
    changeUserStatus: builder.mutation({
      query: (data) => ({
        url: `/admin/users/status/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["AdminUsers"],
    }),

    /**
     * Get User By ID
     * Fetches detailed information of a specific user by their ID.
     * @param {string} id - The ID of the user to retrieve
     */
    getUserById: builder.query({
      query: (id) => `/admin/users/${id}`,
      providesTags: ["AdminUsers"],
    }),
  }),
});

export const {
  useGetAdminOverviewQuery,
  useGetAllUsersQuery,
  useChangeUserStatusMutation,
  useGetUserByIdQuery,
} = AdminUserApi;
