import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const PlaceOrderApi = createApi({
  reducerPath: "OrderApi",
  baseQuery: fetchBaseQuery({ baseUrl: base_url }),
  tagTypes: ["PlaceOrder"],

  endpoints: (builder) => ({
    // Place Order
    placeOrder: builder.mutation({
      query: (data) => ({
        url: "/customer/order/place",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["PlaceOrder", "Cart"],
    }),
  }),
});

export const { usePlaceOrderMutation } = PlaceOrderApi;