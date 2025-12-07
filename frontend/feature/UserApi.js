
import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const UserApi = createApi({
    reducerPath:"UserApi",
    baseQuery:fetchBaseQuery({baseUrl:base_url}),

    endpoints:(builder)=>({
        createUser:builder.mutation({
            query:(data)=>({
                url:'/user/register',
                method:"POST",
                body:data
            })
        }),
        login:builder.mutation({
            query:(data)=>({
                url:'/user/login',
                method:"POST",
                body:data
            })
        })
    })
});

export const {useCreateUserMutation, useLoginMutation} = UserApi