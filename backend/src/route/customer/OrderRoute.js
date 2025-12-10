import { Router } from "express";
import { placeOrder } from "../../controller/customer/OrderController.js";
const router = Router();

/**
 * Route to place an order.
 * Method: POST
 * Endpoint: customer/order/place
 */
router.post("/place", placeOrder);

export default router;
