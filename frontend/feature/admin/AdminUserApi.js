import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const AdminUserApi = createApi({
  reducerPath: "AdminUserApi",
  baseQuery: fetchBaseQuery({ baseUrl: base_url }),
  tagTypes: ["AdminUsers"],

  endpoints: (builder) => ({
  
    getAdminOverview: builder.query({
      query: () => "/admin/users/overview",
      providesTags: ["AdminUsers"],
    }),

  
    getAllUsers: builder.query({
      query: ({ search, skip, limit }) =>
        `/admin/users?skip=${skip}&limit=${limit}&search=${encodeURIComponent(
          search ?? ""
        )}`,
      providesTags: ["AdminUsers"],
    }),

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
