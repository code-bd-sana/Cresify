import { Router } from "express";
import { getSellerOrders, orderStats, orderStatusUpdate, paymentHistory } from "../../controller/seller/orderController.js";

const router = Router();

/**
 * Route to get seller orders.
 * Method: GET
 * Endpoint: seller/order
 */
router.get("/", getSellerOrders);
router.put('/', orderStatusUpdate);
router.get('/paymentHistory/:id', paymentHistory);
router.get('/orderStats', orderStats);

export default router;
