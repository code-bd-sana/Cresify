import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const OrderApi = createApi({
  reducerPath: "OrderApi",
  baseQuery: fetchBaseQuery({ baseUrl: base_url }),
  tagTypes: ["AdminUsers"],

  endpoints: (builder) => ({

    createOrder: builder.mutation({
        query:(data)=>({

            url:`/customer/order/place`,
            method:"POST",
            body:data

        }),
        invalidatesTags:['Order']
    }),

    myOrder: builder.query({
      query:(id)=> `/customer/order/myOrder/${id}`,
      providesTags:['Order']
    }),
    
    
  


  
 

    
  
  }),
});



export const {useCreateOrderMutation, useMyOrderQuery} = OrderApi