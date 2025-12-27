import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const RefundApi = createApi({
  reducerPath: "RefundApi",
  baseQuery: fetchBaseQuery({ baseUrl: base_url }),
  tagTypes: ["RefundApi"],
  endpoints: (builder) => ({
    createRefund: builder.mutation({
      query: (data) => ({
        url: "/customer/refund/request",
        method: "POST",
        body: data,
      }),
    }),
    myRefundRequest: builder.query({
      query: (id) => `/customer/refund?userId=${id}`,
    }),

    sellerRefundRequest: builder.query({
      query: ({ sellerId, page = 1, limit = 10 }) =>
        `/seller/refund?sellerId=${sellerId}&page=${page}&limit=${limit}`,
    }),
    adminRefund: builder.query({
      query: ({ page = 1, limit = 10 }) =>
        `/admin/refund/?page=${page}&limit=${limit}`,
    }),

    processRefund: builder.mutation({
      query: (data) => ({
        url: "/",
        method: "POST",
        body: data,
      }),
    }),

    refundAction: builder.mutation({
      query: (data) => ({
        url: "/admin/refund/review",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useCreateRefundMutation,
  useMyRefundRequestQuery,
  useSellerRefundRequestQuery,
  useAdminRefundQuery,
  useProcessRefundMutation,
  useRefundActionMutation,
} = RefundApi;
