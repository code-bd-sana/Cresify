import { Router } from "express";

/**
 * Controller imports
 */
import {
  adminProductOverview,
  changeProductStatus,
  getAllProducts,
  getProductById,
} from "../../controller/admin/AdminProductController.js";

const router = Router();

/**
 * @route   GET /admin/products
 * @desc    Get all products with pagination, search, and category filter
 * @access  Admin
 * @controller getAllProducts
 */
router.get("/", getAllProducts);


/**
 * @route   GET /admin/products/overview
 * @desc    Admin product management overview
 * @access  Admin
 * @controller adminProductOverview
 */
router.get("/overview", adminProductOverview);

/**
 * @route   PUT /admin/products/status/:id
 * @desc    Change product status (rejected or active)
 * @access  Admin
 * @controller changeProductStatus
 */
router.put("/status/:id", changeProductStatus);

/**
 * @route   GET /admin/users/:id
 * @desc    Get user by ID
 * @params  id
 * @access  Admin
 * @controller getProductById
 */
router.get("/:id", getProductById);

export default router;
