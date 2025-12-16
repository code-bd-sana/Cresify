import { Router } from "express";
import { getSellerOrders, orderStatusUpdate } from "../../controller/seller/orderController.js";

const router = Router();

/**
 * Route to get seller orders.
 * Method: GET
 * Endpoint: seller/order
 */
router.get("/", getSellerOrders);
router.put('/', orderStatusUpdate)

export default router;
