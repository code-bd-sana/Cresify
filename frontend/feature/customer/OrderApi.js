import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const OrderApi = createApi({
  reducerPath: "OrderApi",
  baseQuery: fetchBaseQuery({ baseUrl: base_url }),

  // ✅ tagTypes add
  tagTypes: ["Order"],

  endpoints: (builder) => ({

    createOrder: builder.mutation({
      query: (data) => ({
        url: `/customer/order/place`,
        method: "POST",
        body: data,
      }),
      // ✅ invalidate Order
      invalidatesTags: ["Order"],
    }),

    myOrder: builder.query({
      query: (id) => `/customer/order/myOrder/${id}`,
      // ✅ provide Order
      providesTags: ["Order"],
    }),

    orderOverview: builder.query({
      query: (id) => `/customer/order/orderOverview/${id}`,
      // ✅ optional but recommended
      providesTags: ["Order"],
    }),


    orderStats: builder.query({
      query: (id) => `/seller/order/orderStats`,
      providesTags: ["Order"],
    }),

  }),
});

export const {
  useCreateOrderMutation,
  useMyOrderQuery,
  useOrderOverviewQuery,
  useOrderStatsQuery
} = OrderApi;
