import { Router } from "express";
import { getSellerOrders } from "../../controller/seller/orderController.js";

const router = Router();

/**
 * Route to get seller orders.
 * Method: GET
 * Endpoint: seller/order
 */
router.get("/", getSellerOrders);

export default router;
