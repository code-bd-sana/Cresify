import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const CartApi = createApi({
    reducerPath:"CartApi",
    baseQuery: fetchBaseQuery({baseUrl:base_url}),
    tagTypes:['Cart'],

    endpoints:(builder) => ({
        addToCart: builder.mutation({
            query:(data)=>({
                url:'/cart/add',
                method:"POST",
                body:data

            }),
            invalidatesTags:["Cart"]
        }),

        deleteCart: builder.mutation({
            query:(id) => ({
                url:`/cart/delete/${id}`,
                method:"DELETE",
                


            }),
            invalidatesTags:['Cart']
        }),

        removeCart: builder.mutation({
            query:(id)=> ({
                url:`/increase/${id}`,
                method:"PUT",


            }),
            invalidatesTags:["Cart"]
        }),

        decreaseCart: builder.mutation({
            query:(id)=>({
                url:`/cart/decrease/${id}`,
                method:"PUT"

            })
        }),

        myCart: builder.mutation({
            query:(id)=>({
                url:`/myCart/${id}`,
                method:"PUT"

            })
        })




    })

});



export const {useAddToCartMutation, useDeleteCartMutation, useRemoveCartMutation, useDecreaseCartMutation, useMyCartMutation}  = CartApi;