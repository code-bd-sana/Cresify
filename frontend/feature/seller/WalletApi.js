import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const WalletApi = createApi({
  reducerPath: "WalletApi",
  baseQuery: fetchBaseQuery({ baseUrl: base_url }),
  tagTypes: ["Wallet"],
  endpoints: (builder) => ({
    getWallet: builder.query({
      // expects sellerId
      query: (sellerId) => `/seller/wallet/wallet/${sellerId}`,
      providesTags: ["Wallet"],
    }),
    requestPayout: builder.mutation({
      query: (body) => ({
        url: `/seller/wallet/request`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Wallet"],
    }),
    connectStripe: builder.mutation({
      query: (body) => ({
        url: `/seller/stripe/connect`,
        method: "POST",
        body,
      }),
    }),
    unlinkStripe: builder.mutation({
      query: (body) => ({
        url: `/seller/stripe/unlink`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Wallet"],
    }),
    updateStripeAccount: builder.mutation({
      query: (body) => ({
        url: `/seller/stripe/update`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Wallet"],
    }),
    refreshStripeAccount: builder.mutation({
      query: (body) => ({
        url: `/seller/stripe/refresh`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Wallet"],
    }),
    setStripeFlags: builder.mutation({
      query: (body) => ({
        url: `/seller/stripe/set-flags`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Wallet"],
    }),
  }),
});

export const {
  useGetWalletQuery,
  useRequestPayoutMutation,
  useConnectStripeMutation,
  useUnlinkStripeMutation,
  useUpdateStripeAccountMutation,
  useRefreshStripeAccountMutation,
  useSetStripeFlagsMutation,
} = WalletApi;
