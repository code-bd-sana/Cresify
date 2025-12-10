import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const WishlistApi = createApi({
  reducerPath: "WishlistApi",
  baseQuery: fetchBaseQuery({ baseUrl: base_url }),
  tagTypes: ["Wishlist"],

  endpoints: (builder) => ({
    checkWishlist: builder.query({
      query: ({ id, userId }) => `/wishlist/check/${id}/${userId}`,
      providesTags: ["Wishlist"],
    }),

    addToWishList: builder.mutation({
      query: (data) => ({
        url: "/wishlist/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Wishlist"],
    }),

    removeFromWishList: builder.mutation({
      query: (id) => ({
        url: `/wishlist/remove/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),

    getWishList: builder.query({
      query: ({ userId, page = 1, limit = 10 }) =>
        `/wishlist/${userId}?page=${page}&limit=${limit}`,
      providesTags: ["Wishlist"],
    }),
  }),
});

// Export hooks
export const {
  useAddToWishListMutation,
  useRemoveFromWishListMutation,
  useGetWishListQuery,
  useCheckWishlistQuery,
} = WishlistApi;
