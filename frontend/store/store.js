import { BlogApi } from "@/feature/BlogApi";
import { ProductApi } from "@/feature/ProductApi";
import { UserApi } from "@/feature/UserApi";
import { AdminDashboardApi } from "@/feature/admin/AdminOverviewApi";
import { AdminProductApi } from "@/feature/admin/AdminProductApi";
import { AdminUserApi } from "@/feature/admin/AdminUserApi";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    [UserApi.reducerPath]: UserApi.reducer,
    [ProductApi.reducerPath]: ProductApi.reducer,
    [BlogApi.reducerPath]: BlogApi.reducer,
    [AdminUserApi.reducerPath]: AdminUserApi.reducer,
    [AdminProductApi.reducerPath]: AdminProductApi.reducer,
    [AdminDashboardApi.reducerPath]: AdminDashboardApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      UserApi.middleware,
      ProductApi.middleware,
      BlogApi.middleware,
      AdminUserApi.middleware,
      AdminProductApi.middleware,
      AdminDashboardApi.middleware,
    ]),
});
