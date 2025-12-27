// SellerApi.js - FIXED VERSION
import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const SellerApi = createApi({
  reducerPath: "SellerApi",
  baseQuery: fetchBaseQuery({ baseUrl: base_url }),
  tagTypes: ["SellerOrders", "PaymentHistory"],

  endpoints: (builder) => ({
    getSellerOrders: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        
        if (params.sellerId) queryParams.append('sellerId', params.sellerId);
        if (params.search) queryParams.append('search', params.search);
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        
        return {
          url: `/seller/order?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["SellerOrders"],
    }),

    updateOrderStatus: builder.mutation({
      query: (data) => ({
        url: `/seller/order`,
        method: "PUT",
        body: data
      })
    }),
    paymentHistory: builder.query({
      query: (id) => `/seller/order/paymentHistory/${id}`
    }),

    // Method 2: With pagination (new)
    paymentHistoryPaginated: builder.query({
      query: (params) => {
        const { sellerId, page = 0, limit = 10, search = "" } = params || {};
        const queryParams = new URLSearchParams();
        
        if (sellerId) queryParams.append('sellerId', sellerId);
        if (page) queryParams.append('page', page);
        if (limit) queryParams.append('limit', limit);
        if (search) queryParams.append('search', search);
        
        return {
          url: `/seller/order/paymentHistory?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["PaymentHistory"],
    }),

    getOverview:builder.query({
      query:(id)=>`/seller/overview/${id}`
    }),
    getOverviewProvider:builder.query({
      query:(id)=>`/seller/overview/provider/${id}`
    })
  }),
});

export const {
  useGetSellerOrdersQuery,
  useUpdateOrderStatusMutation,
  usePaymentHistoryQuery,
  usePaymentHistoryPaginatedQuery,
  useGetOverviewQuery,
  useGetOverviewProviderQuery
} = SellerApi;