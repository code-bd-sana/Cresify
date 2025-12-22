import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const RefundApi = createApi({
    reducerPath:"RefundApi",
    baseQuery: fetchBaseQuery({baseUrl:base_url}),
    tagTypes:['RefundApi'],
    endpoints:(builder)=>({
        createRefund:builder.mutation({
            query:(data)=>({
                url:'/customer/refund/request',
                method:'POST',
                body:data
            })
        }),
        myRefundRequest:builder.query({
            query:(id)=>`/customer/refund?userId=${id}`
        })
    })

});

export const {useCreateRefundMutation, useMyRefundRequestQuery} = RefundApi;