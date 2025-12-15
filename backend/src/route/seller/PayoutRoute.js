import { Router } from "express";
import {
  getWallet,
  listPayouts,
  processPayout,
  requestPayout,
} from "../../controller/seller/PayoutController.js";
const router = Router();

router.get("/wallet/:sellerId", getWallet);
router.post("/request", requestPayout);
router.get("/list", listPayouts);
router.get("/list/:sellerId", listPayouts);
router.post("/process/:payoutId", processPayout);

export default router;
