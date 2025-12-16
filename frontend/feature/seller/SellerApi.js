import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const SellerApi = createApi({
  reducerPath: "SellerApi",
  baseQuery: fetchBaseQuery({ baseUrl: base_url }),
  tagTypes: ["SellerOrders"],

  endpoints: (builder) => ({
    // GET seller orders with query parameters
    getSellerOrders: builder.query({
      query: (params) => {
        // Build query string from params
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
        query:(data)=>({
            url:`/seller/order`,
            method:"PUT",
            body:data
        })
    })

    // Or if you want a mutation (for actions that modify data):
    // updateOrderStatus: builder.mutation({
    //   query: (data) => ({
    //     url: `/seller/order/status`,
    //     method: "PUT",
    //     body: data,
    //   }),
    //   invalidatesTags: ["SellerOrders"],
    // }),
  }),
});

export const {
  useGetSellerOrdersQuery,
  useUpdateOrderStatusMutation
  // useUpdateOrderStatusMutation,
} = SellerApi;