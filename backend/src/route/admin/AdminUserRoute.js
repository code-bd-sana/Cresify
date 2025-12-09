import { Router } from "express";

/**
 * Controller imports
 */
import {
  adminOverview,
  changeUserStatus,
  getAllUsers,
} from "../../controller/admin/AdminUserController.js";

const router = Router();

/**
 * @route   GET /admin/users
 * @desc    Get all users
 * @query search - Search by email or name (optional)
 * @query skip - Number of records to skip for pagination (default: 0)
 * @query limit - Number of records to return (default: 10)
 * @query role - Filter users by role (optional)
 * @access  Admin
 * @controller getAllUsers
 */
router.get("/", getAllUsers);

/**
 * @route   GET /admin/users/overview
 * @desc    Admin user management overview
 * @access  Admin
 * @controller adminOverview
 */
router.get("/overview", adminOverview);

/**
 * @route   PUT /admin/users/status
 * @desc    Change user status (active, pending, suspend)
 * @params  id
 * @access  Admin
 * @controller changeUserStatus
 */
router.put("/status", changeUserStatus);

export default router;
