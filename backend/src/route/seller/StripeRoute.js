import { Router } from "express";
import { createConnectLink, unlinkAccount } from "../../controller/seller/StripeConnectController.js";

const router = Router();

router.post("/connect", createConnectLink);
router.post("/unlink", unlinkAccount);

export default router;
