import { Router } from "express";
import { sellerOverview } from "../controller/seller/SellerOverviewController.js";

const router = Router();
router.get('/:id', sellerOverview)
export default router;