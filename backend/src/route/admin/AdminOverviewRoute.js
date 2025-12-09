import { Router } from "express";

/**
 * Controller imports
 */
import { adminOverview } from "../../controller/admin/AdminOverviewController.js";

const router = Router();

/**
 * @route   GET /admin/overview
 * @desc    Admin overview
 * @access  Admin
 * @controller adminOverview
 */
router.get("/", adminOverview);

export default router;
