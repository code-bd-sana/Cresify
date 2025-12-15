import { configureStore } from "@reduxjs/toolkit";

import { ProductApi } from "@/feature/ProductApi";
import { UserApi } from "@/feature/UserApi";
import { AdminBlogApi } from "@/feature/admin/AdminBlogApi";
import { AdminDashboardApi } from "@/feature/admin/AdminOverviewApi";
import { AdminProductApi } from "@/feature/admin/AdminProductApi";
import { AdminUserApi } from "@/feature/admin/AdminUserApi";
import { CartApi } from "@/feature/customer/CartApi";
import { WishlistApi } from "@/feature/customer/WishlistApi";

export const store = configureStore({
  reducer: {
    // RTK Query APIs
    [UserApi.reducerPath]: UserApi.reducer,
    [CartApi.reducerPath]: CartApi.reducer,
    [ProductApi.reducerPath]: ProductApi.reducer,
    [WishlistApi.reducerPath]: WishlistApi.reducer,
    [AdminDashboardApi.reducerPath]: AdminDashboardApi.reducer,
    [AdminBlogApi.reducerPath]: AdminBlogApi.reducer,
    [AdminUserApi.reducerPath]: AdminUserApi.reducer,
    [AdminProductApi.reducerPath]: AdminProductApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      UserApi.middleware,
      ProductApi.middleware,
      CartApi.middleware,
      WishlistApi.middleware,
      AdminDashboardApi.middleware,
      AdminBlogApi.middleware,
      AdminUserApi.middleware,
      AdminProductApi.middleware,
    ]),
});
