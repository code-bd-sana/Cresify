import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ProductApi = createApi({
  reducerPath: "ProductApi",
  baseQuery: fetchBaseQuery({ baseUrl: base_url }),
  tagTypes: ["Products"],

  endpoints: (builder) => ({
    // Create product
    createProduct: builder.mutation({
      query: (data) => ({
        url: "/product/save",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),

    // My products with pagination + search
    myProduct: builder.query({
      query: ({ id, skip, limit, search }) =>
        `/product/myProduct/${id}?limit=${limit}&skip=${skip}&search=${encodeURIComponent(
          search ?? ""
        )}`,
      providesTags: ["Products"],
    }),

    // Delete product
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/product/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),

    singleProduct: builder.query({
      query: (id) => `/product/singleProduct/${id}`,
      providesTags: ["Products"],
    }),

    editProduct: builder.mutation({
      query: (data) => ({
        url: `/product/edit/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),

// feature/ProductApi.js
// feature/ProductApi.js
// feature/ProductApi.js
// feature/ProductApi.js
allProduct: builder.query({
  query: (params = {}) => {
    const {
      skip = 0,
      limit = 9,
      search = "",
      category = "",
      location = "",
      country = "",
      region = "",
      city = "",
      minPrice = 0,
      maxPrice = 1000,
      sortBy = "createdAt",
      sortOrder = "desc"
    } = params;

    let queryString = `/product?skip=${skip}&limit=${limit}`;
    
    if (search) queryString += `&search=${encodeURIComponent(search)}`;
    if (category) queryString += `&category=${encodeURIComponent(category)}`;
    if (location) queryString += `&location=${encodeURIComponent(location)}`;
    if (country) queryString += `&country=${encodeURIComponent(country)}`;
    if (region) queryString += `&region=${encodeURIComponent(region)}`;
    if (city) queryString += `&city=${encodeURIComponent(city)}`;
    queryString += `&minPrice=${minPrice}`;
    queryString += `&maxPrice=${maxPrice}`;
    queryString += `&sortBy=${sortBy}`;
    queryString += `&sortOrder=${sortOrder}`;

    console.log("RTK Query URL:", queryString);
    return queryString;
  },
  providesTags: ["Products"],
}),

allLocation:builder.query({
  query:()=>'/product/location',

})
  }),
});

// Export hooks
export const {
  useCreateProductMutation,
  useMyProductQuery,
  useDeleteProductMutation,
  useSingleProductQuery,
  useEditProductMutation,
  useAllProductQuery,
  useAllLocationQuery
} = ProductApi;
