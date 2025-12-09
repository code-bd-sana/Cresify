import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";

export const BlogApi = createApi({
  reducerPath: "BlogApi",
  baseQuery: fetchBaseQuery({ baseUrl: base_url }),
  tagTypes: ["Blog"], // Define tag types for cache invalidation
  endpoints: (builder) => ({
    // Create Blog
    createBlog: builder.mutation({
      query: (data) => ({
        url: "/blog/save",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Blog"],
    }),

    // Delete Blog
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/blog/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blog"],
    }),

    // Edit Blog
    editBlog: builder.mutation({
      query: (data) => ({
        url: `/blog/edit`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Blog"],
    }),

    getBlogs: builder.query({
      query: () => "/blog",
      providesTags: ["Blog"],
    }),
  }),
});

export const {
  useCreateBlogMutation,
  useDeleteBlogMutation,
  useEditBlogMutation,
  useGetBlogsQuery,
} = BlogApi;
