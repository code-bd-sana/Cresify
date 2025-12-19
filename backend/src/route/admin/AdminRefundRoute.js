import { Router } from "express";
import {
  getRefund,
  listRefunds,
  reviewRefund,
} from "../../controller/admin/AdminRefundController.js";
const router = Router();

router.get("/", listRefunds);
router.get("/:id", getRefund);
router.post("/review", reviewRefund);

export default router;
