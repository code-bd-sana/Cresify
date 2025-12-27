import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/**
 * Admin Blog/Article Management API
 * Handles admin operations on blogs/articles: create, read, update, delete
 */
export const AdminBlogApi = createApi({
  reducerPath: "AdminBlogApi",
  baseQuery: fetchBaseQuery({ baseUrl: base_url }),
  tagTypes: ["AdminBlogs"],

  endpoints: (builder) => ({
    /**
     * Get all blogs/articles with pagination
     * Supports "Load More" functionality with infinite scroll
     * @param {Number} page - Page number (default: 1)
     * @param {Number} limit - Blogs per page (default: 9)
     * @returns Paginated blogs with metadata (total, hasMore, etc.)
     */
    getBlogs: builder.query({
      query: ({ page = 1, limit = 9 } = {}) => ({
        url: "/admin/blog",
        method: "GET",
        params: { page, limit },
      }),
      // Normalize cache key to ignore page parameter for merging
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      // Merge new pages with existing data
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 1) {
          // Reset for first page
          return newItems;
        }
        // Append new blogs to existing ones
        return {
          ...newItems,
          data: [...(currentCache.data || []), ...newItems.data],
        };
      },
      // Force refetch when page changes
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page;
      },
      providesTags: ["AdminBlogs"],
    }),

    /**
     * Create a new blog/article
     * @param {Object} data - Blog data (title, category, description, img)
     */
    createBlog: builder.mutation({
      query: (data) => ({
        url: "/admin/blog/save",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AdminBlogs"],
    }),

    /**
     * Update an existing blog/article
     * @param {Object} data - Updated blog data (id, title, category, description, img)
     */
    editBlog: builder.mutation({
      query: (data) => ({
        url: "/admin/blog/edit",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["AdminBlogs"],
    }),

    /**
     * Delete a blog/article by ID
     * @param {String} id - Blog ID to delete
     */
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/admin/blog/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdminBlogs"],
    }),
    singleBlog: builder.query({
      query:(id)=> `/admin/blog/${id}`
    })
  }),
});

export const {
  useGetBlogsQuery,
  useCreateBlogMutation,
  useEditBlogMutation,
  useDeleteBlogMutation,
  useSingleBlogQuery
} = AdminBlogApi;
