import { Router } from "express";
import blog from "./BlogRoute.js";
import booking from "./BookingRoute.js";
import product from "./ProductRoute.js";
import user from "./UserRoute.js";
import adminUserRoute from "./admin/AdminUserRoute.js";
import order from "./orderRoute.js";
import review from "./reviewRoute.js";
const router = Router();

router.use("/user", user);
router.use("/product", product);
router.use("/review", review);
router.use("/booking", booking);
router.use("/order", order);
router.use("/blog", blog);
router.use("/admin/users", adminUserRoute);

export default router;
  