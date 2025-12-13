import { Router } from "express";
import { requestRefund } from "../../controller/customer/RefundController.js";
const router = Router();

/**
 * Customer refund routes
 */
router.post("/request", requestRefund);

export default router;
