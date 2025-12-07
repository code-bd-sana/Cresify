import { Router } from "express"
import user from './UserRoute.js'
import product from "./ProductRoute.js";
import review from './reviewRoute.js';
import booking from './BookingRoute.js'
import order from './orderRoute.js'
const router = Router();

router.use('/user', user);
router.use('/product', product);
router.use('/review', review);
router.use("/booking", booking);
router.use('/order', order)









export default router;