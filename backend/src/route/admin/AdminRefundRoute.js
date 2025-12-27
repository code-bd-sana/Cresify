import { Router } from "express";
import {
  getRefund,
  listProviderRefunds,
  listSellerRefunds,
  reviewRefund,
} from "../../controller/admin/AdminRefundController.js";
const router = Router();

router.get("/", listSellerRefunds);
router.get("/provider", listProviderRefunds);
router.get("/:id", getRefund);
router.post("/review", reviewRefund);

export default router;
