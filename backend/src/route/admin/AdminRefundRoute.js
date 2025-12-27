import { Router } from "express";
import {
  getRefund,
  listSellerRefunds,
  reviewRefund,
} from "../../controller/admin/AdminRefundController.js";
const router = Router();

router.get("/", listSellerRefunds);
router.get("/:id", getRefund);
router.post("/review", reviewRefund);

export default router;
