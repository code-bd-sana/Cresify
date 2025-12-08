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
    useChangePasswordMutation
} = UserApi;
