import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const UserApi = createApi({
    reducerPath: "UserApi",
    baseQuery: fetchBaseQuery({ baseUrl: base_url }),
    tagTypes: ["User"],   // <-- added tag type

    endpoints: (builder) => ({

        createUser: builder.mutation({
            query: (data) => ({
                url: "/user/register",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["User"],   // <-- auto refetch
        }),

        createServiceProvider: builder.mutation({
            query: (data) => ({
                url: "/user/register-provider",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["User"],   // <-- auto refetch
        }),

        login: builder.mutation({
            query: (data) => ({
                url: "/user/login",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["User"],   // <-- auto refetch
        }),

        myProfile: builder.query({
            query: (id) => `/user/myProfile/${id}`,
            providesTags: ["User"],      // <-- provide tag
        }),

        getAllServiceProviders: builder.query({
            query: (page, limit, skip) => `/user/all-providers?page=${page}&limit=${limit}&skip=${skip}`,
            providesTags: ["User"],      // <-- provide tag
        }),

        getServiceProvider: builder.query({
            query: (id) => `/user/provider/${id}`,
            providesTags: ["User"],      // <-- provide tag
        }),

        updateProfile: builder.mutation({
            query: (data) => ({
                url: `/user/updateProfile`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["User"],   // <-- auto refetch after update
        }),
        changePassword: builder.mutation({
            query:(data)=>({
                url:`/user/changePassword`,
                method:"PUT",
                body:data
                 
            })
        })
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
} = UserApi;
