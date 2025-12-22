import { Router } from "express";
import { getSellerOrders, orderStatusUpdate, paymentHistory } from "../../controller/seller/orderController.js";

const router = Router();

/**
 * Route to get seller orders.
 * Method: GET
 * Endpoint: seller/order
 */
router.get("/", getSellerOrders);
router.put('/', orderStatusUpdate);
router.get('/paymentHistory/:id', paymentHistory)

export default router;
