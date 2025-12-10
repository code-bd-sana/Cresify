import { Router } from "express";
import adminBlogRoute from "./admin/AdminBlogRoute.js";
import booking from "./BookingRoute.js";
import product from "./ProductRoute.js";
import user from "./UserRoute.js";
import adminUserRoute from "./admin/AdminUserRoute.js";
import adminOverviewRoute from "./admin/AdminOverviewRoute.js";
import adminProductRoute from "./admin/AdminProductRoute.js";
import order from "./orderRoute.js";
import review from "./reviewRoute.js";
import   cart from './customer/CartRoute.js'
import blog from './admin/AdminBlogRoute.js'

const router = Router();

router.use("/user", user);
router.use("/product", product);
router.use("/review", review);
router.use("/booking", booking);
router.use("/order", order);
router.use("/admin/blog", adminBlogRoute);
router.use("/blog", blog);
router.use("/cart", cart)

router.use("/admin/users", adminUserRoute);
router.use("/admin/overview", adminOverviewRoute);
router.use("/admin/products", adminProductRoute);

export default router;
  