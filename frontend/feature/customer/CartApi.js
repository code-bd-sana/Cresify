import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const CartApi = createApi({
  reducerPath: "CartApi",
  baseQuery: fetchBaseQuery({ baseUrl: base_url }),
  tagTypes: ["Cart"],

  endpoints: (builder) => ({

    // Add to Cart
    addToCart: builder.mutation({
      query: (data) => ({
        url: "/cart/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),

    // Delete Cart Item
    deleteCart: builder.mutation({
      query: (id) => ({
        url: `/cart/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    // Remove Cart (if needed)
    removeCart: builder.mutation({
      query: (id) => ({
        url: `/cart/remove/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Cart"],
    }),

    // Decrease Quantity
    decreaseCart: builder.mutation({
      query: (id) => ({
        url: `/cart/decrease/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Cart"],
    }),

    // Increase Quantity
    increaseCart: builder.mutation({
      query: (id) => ({
        url: `/cart/increase/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Cart"],
    }),

    // Get My Cart
    myCart: builder.query({
      query: (id) => `/cart/myCart/${id}`,
      providesTags: ["Cart"],
    }),

  }),

});

export const {
  useAddToCartMutation,
  useDeleteCartMutation,
  useRemoveCartMutation,
  useDecreaseCartMutation,
  useIncreaseCartMutation,
  useMyCartQuery,
} = CartApi;
