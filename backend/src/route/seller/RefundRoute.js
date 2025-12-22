import { Router } from "express";
import {
  getSellerRefund,
  listSellerRefunds,
  respondToRefund,
} from "../../controller/seller/RefundController.js";

const router = Router();

/**
 * Seller refund routes
 * - List refunds assigned to the seller
 * - Get refund detail
 * - Respond to a refund (upload proof / accept / dispute)
 */
router.get("/", listSellerRefunds);
router.get("/:refundId/:sellerId", getSellerRefund);
router.post("/:id/respond", respondToRefund);

export default router;
