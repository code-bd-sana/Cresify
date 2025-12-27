import { Router } from "express";
import { listProviderRefunds } from "../../controller/provider/RefundController.js";

const router = Router();

/**
 * Provider refund routes
 * - List refunds assigned to a provider
 */
router.get("/", listProviderRefunds);

export default router;
