import { Router } from "express";
import {
  getRefund,
  listSellerRefunds,
  reviewRefund,
} from "../../controller/admin/AdminRefundController.js";
const router = Router();

import { reviewServiceRefund } from "../../controller/admin/AdminRefundController.js";

router.get("/", listSellerRefunds);
router.get("/:id", getRefund);
router.post("/review", reviewRefund);
router.post("/service-review", reviewServiceRefund);

export default router;
