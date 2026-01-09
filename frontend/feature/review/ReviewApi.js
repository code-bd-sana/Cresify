import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ReviewAPi = createApi({
  reducerPath: 'ReviewApi',
  baseQuery: fetchBaseQuery({ baseUrl: base_url }),
  tagTypes: ['ReviewApi'],
  endpoints: (builder) => ({
    
    saveReview: builder.mutation({
      query: (data) => ({
        url: `/review`,
        method: "POST",
        body: data
      }),
      invalidatesTags: ['ReviewApi']
    }),

    getProductReview: builder.query({
      query: (id) => `/review/product/${id}`,
      providesTags: ['ReviewApi']
    }),

    getServiceReview: builder.query({
      query: (id) => `/review/service/${id}`,
      providesTags: ['ReviewApi']
    }),

    getReviewBySellerId: builder.query({
      query: (id) => `/review/seller/${id}`,
      providesTags: ['ReviewApi']
    }),

    updateReview: builder.mutation({
      query: (data) => ({
        url: '/review/update',
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['ReviewApi']
    })

  })
});

export const {
  useSaveReviewMutation,
  useGetProductReviewQuery,
  useGetReviewBySellerIdQuery,
  useGetServiceReviewQuery,
  useUpdateReviewMutation
} = ReviewAPi;
