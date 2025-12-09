import { BlogApi } from "@/feature/BlogApi";
import { ProductApi } from "@/feature/ProductApi";
import { UserApi } from "@/feature/UserApi";
import { AdminUserApi } from "@/feature/admin/AdminUserApi";
import { CartApi } from "@/feature/customer/CartApi";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    [UserApi.reducerPath]: UserApi.reducer,
    [ProductApi.reducerPath]: ProductApi.reducer,
    [BlogApi.reducerPath]: BlogApi.reducer,
    [AdminUserApi.reducerPath]: AdminUserApi.reducer,
    [CartApi.reducerPath] : CartApi.reducer
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      UserApi.middleware,
      ProductApi.middleware,
      BlogApi.middleware,
      AdminUserApi.middleware,
      CartApi.middleware
    ]),
});
