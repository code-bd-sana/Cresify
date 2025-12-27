import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ReviewAPi = createApi({
reducerPath:'ReviewApi',
baseQuery: fetchBaseQuery({baseUrl:base_url}),
tagTypes:['ReviewApi'],
endpoints:(builder)=>({
    saveReview: builder.mutation({
        query:(data)=>({
            url:`/review`,
            method:"POST",
            body:data
        })
    }),

    getProductReview:builder.query({
        query:(id)=>`/review/product/${id}`
    }),
    getServiceReview:builder.query({
        query:(id)=>`/review/service/${id}`
    }),

    getReviewBySellerId:builder.query({
        query:(id)=> `/review/seller/${id}`
    })
})

});

export const {useSaveReviewMutation, useGetProductReviewQuery, useGetReviewBySellerIdQuery, useGetServiceReviewQuery} = ReviewAPi;



