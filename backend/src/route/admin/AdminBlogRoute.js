import { Router } from "express";
import {
  deleteBlog,
  editBlog,
  getBlog,
  saveBlog,
} from "../../controller/admin/AdminBlogController.js";

/**
 * Admin Blog Routes
 * Base path: /api/admin/blog
 *
 * These routes handle blog/article management operations for administrators.
 * All routes should be protected with admin authentication middleware.
 */

const router = Router();

/**
 * @route   POST /api/admin/blog/save
 * @desc    Create a new blog/article
 * @access  Admin
 * @body    { title, category, description, img }
 */
router.post("/save", saveBlog);

/**
 * @route   GET /api/admin/blog
 * @desc    Get all blogs/articles
 * @access  Admin
 * @returns Array of all blogs sorted by creation date
 */
router.get("/", getBlog);

/**
 * @route   PUT /api/admin/blog/edit
 * @desc    Update an existing blog/article
 * @access  Admin
 * @body    { id, title, category, description, img }
 */
router.put("/edit", editBlog);

/**
 * @route   DELETE /api/admin/blog/delete/:id
 * @desc    Delete a blog/article by ID
 * @access  Admin
 * @params  id - Blog ID to delete
 */
router.delete("/delete/:id", deleteBlog);

export default router;
