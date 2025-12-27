import { Router } from "express";
import {
  createConnectLink,
  unlinkAccount,
  updateStripeAccount,
} from "../../controller/seller/StripeConnectController.js";

const router = Router();

router.post("/connect", createConnectLink);
router.post("/unlink", unlinkAccount);
router.post("/update", updateStripeAccount);

export default router;
