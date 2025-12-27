import { Router } from "express";
import { providerOverview, sellerOverview } from "../controller/seller/SellerOverviewController.js";

const router = Router();
router.get('/:id', sellerOverview)
router.get('/provider/:id', providerOverview)

export default router;