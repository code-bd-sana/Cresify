import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/**
 * Admin Product Management API
 * Handles admin operations on products: list, change status
 */
export const AdminProductApi = createApi({
  reducerPath: "AdminProductApi",
  baseQuery: fetchBaseQuery({ baseUrl: base_url }),
  tagTypes: ["AdminProducts"],

  endpoints: (builder) => ({
    /**
     * Get admin product overview
     * Returns total number of products, active products, and rejected products
     */
    adminProductOverview: builder.query({
      query: () => ({
        url: "/admin/products/overview",
        method: "GET",
      }),
      providesTags: ["AdminProducts"],
    }),

    /**
     * Get all products
     * Supports pagination, search by product/seller, and category filter
     */
    allProducts: builder.query({
      query: ({ search = "", category = "", skip = 0, limit = 10 }) => ({
        url: "/admin/products",
        method: "GET",
        params: { search, category, skip, limit },
      }),
      providesTags: ["AdminProducts"],
    }),

    /**
     * Change product status
     * Accepts product id and status (active, rejected, unpublished)
     */
    changeProductStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/admin/products/status/${id}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["AdminProducts"],
    }),
  }),
});

export const {
  useAdminProductOverviewQuery,
  useAllProductsQuery,
  useChangeProductStatusMutation,
} = AdminProductApi;
