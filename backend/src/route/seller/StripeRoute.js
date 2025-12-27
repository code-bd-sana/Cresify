import { Router } from "express";
import {
  createConnectLink,
  unlinkAccount,
  updateStripeAccount,
} from "../../controller/seller/StripeConnectController.js";

import {
  refreshStripeAccount,
  setStripeFlags,
} from "../../controller/seller/StripeConnectController.js";

const router = Router();

router.post("/connect", createConnectLink);
router.post("/unlink", unlinkAccount);
router.post("/update", updateStripeAccount);
router.post("/refresh", refreshStripeAccount);
router.post("/set-flags", setStripeFlags);

export default router;
