import { Router } from "express";
import {
  getRefund,
  listMyRefunds,
  requestRefund,
} from "../../controller/customer/RefundController.js";

const router = Router();

/**
 * Customer refund routes
 */
router.post("/request", requestRefund);
// list refunds for current customer
router.get("/", listMyRefunds);
// get single refund detail
router.get("/:id", getRefund);

export default router;
