import { ProductApi } from "@/feature/ProductApi";
import { UserApi } from "@/feature/UserApi";
import { AdminBlogApi } from "@/feature/admin/AdminBlogApi";
import { AdminDashboardApi } from "@/feature/admin/AdminOverviewApi";
import { AdminUserApi } from "@/feature/admin/AdminUserApi";
import { CartApi } from "@/feature/customer/CartApi";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    [UserApi.reducerPath]: UserApi.reducer,
    [ProductApi.reducerPath]: ProductApi.reducer,
    [AdminDashboardApi.reducerPath]: AdminDashboardApi.reducer,
    [AdminBlogApi.reducerPath]: AdminBlogApi.reducer,
    [AdminUserApi.reducerPath]: AdminUserApi.reducer,
    [CartApi.reducerPath]: CartApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      UserApi.middleware,
      ProductApi.middleware,
      AdminDashboardApi.middleware,
      AdminBlogApi.middleware,
      AdminUserApi.middleware,
      CartApi.middleware,
    ]),
});
