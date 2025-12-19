import { Router } from "express";
import { MyOrder, placeOrder } from "../../controller/customer/OrderController.js";
const router = Router();

/**
 * Route to place an order.
 * Method: POST
 * Endpoint: customer/order/place
 */
router.post("/place", placeOrder);
router.get('/myOrder/:id', MyOrder)

export default router;
