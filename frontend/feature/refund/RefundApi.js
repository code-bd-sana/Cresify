import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";

export const RefundApi = createApi({
    reducerPath:"RefundApi",
    baseQuery: fetchBaseQuery({baseUrl:base_url}),
    tagTypes:['RefundApi'],
    endpoints:(builder)
})