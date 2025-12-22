import { Router } from "express";
import { MyOrder, orderOverview, placeOrder } from "../../controller/customer/OrderController.js";
const router = Router();

/**
 * Route to place an order.
 * Method: POST
 * Endpoint: customer/order/place
 */
router.post("/place", placeOrder);
router.get('/myOrder/:id', MyOrder);
router.get('/orderOverview/:id', orderOverview)

export default router;
