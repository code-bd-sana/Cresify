import { Router } from "express";
import { requestProviderRefund } from "../../controller/provider/CreateRefundController.js";
import { listProviderRefunds } from "../../controller/provider/RefundController.js";

const router = Router();

/**
 * Provider refund routes
 * - List refunds assigned to a provider
 * - Submit provider refund request
 */
router.get("/", listProviderRefunds);
router.post("/request", requestProviderRefund);

export default router;
