import { Router } from "express";
import booking from "./BookingRoute.js";
import product from "./ProductRoute.js";
import providerAvailability from "./ProviderAvailabilityRoute.js";
import user from "./UserRoute.js";
import adminBlogRoute from "./admin/AdminBlogRoute.js";
import adminOverviewRoute from "./admin/AdminOverviewRoute.js";
import adminProductRoute from "./admin/AdminProductRoute.js";
import adminUserRoute from "./admin/AdminUserRoute.js";
import cart from "./customer/CartRoute.js";
import customerOrderRoute from "./customer/OrderRoute.js";
import wishList from "./customer/WishListRoute.js";
import order from "./orderRoute.js";
import review from "./reviewRoute.js";
import sellerOrderRoute from "./seller/OrderRoute.js";
const router = Router();

router.use("/user", user);
router.use("/product", product);
router.use("/review", review);
router.use("/booking", booking);
router.use("/order", order);
router.use("/cart", cart);
router.use("/wishlist", wishList);

router.use("/provider-availability", providerAvailability);

router.use("/admin/users", adminUserRoute);
router.use("/admin/overview", adminOverviewRoute);
router.use("/admin/products", adminProductRoute);
router.use("/admin/blog", adminBlogRoute);

router.use("/customer/order", customerOrderRoute);
router.use("/seller/order", sellerOrderRoute);

export default router;
