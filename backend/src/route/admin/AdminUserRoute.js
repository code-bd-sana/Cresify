import { Router } from "express";

/**
 * Controller imports
 */
import {
  adminOverview,
  changeUserStatus,
  getAllUsers,
  searchUsers,
} from "../../controller/admin/AdminUserController.js";

const router = Router();

/**
 * @route   GET /admin/users/overview
 * @desc    Admin user management overview
 * @access  Admin
 * @controller adminOverview
 */
router.get("/overview", adminOverview);

/**
 * @route   GET /admin/users
 * @desc    Get all users
 * @access  Admin
 * @controller getAllUsers
 */
router.get("/all", getAllUsers);

/**
 * @route   GET /admin/users/search
 * @desc    Search users by email or name
 * @query   email, name
 * @access  Admin
 * @controller searchUsers
 */
router.get("/search", searchUsers);

/**
 * @route   PUT /admin/users/status/:id
 * @desc    Change user status (active, pending, suspend)
 * @params  id
 * @access  Admin
 * @controller changeUserStatus
 */
router.put("/status/:id", changeUserStatus);

export default router;
