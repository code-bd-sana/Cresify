import Blog from "../../models/BlogModel.js";
import {
  deleteImageFromImgBB,
  extractBase64FromDataURL,
  uploadImageToImgBB,
} from "../../utils/imageUpload.js";

/**
 * @function saveBlog
 * @description Creates a new blog/article in the database.
 *              Uploads image to ImgBB and stores the URL and delete hash.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @body {String} title - Blog title (required)
 * @body {String} category - Blog category (required)
 * @body {String} description - Blog content/description (required)
 * @body {String} img - Base64 encoded image or image URL (required)
 * @route POST /api/admin/blog/save
 * @access Admin
 */
export const saveBlog = async (req, res) => {
  try {
    const data = req.body;

    // Upload image to ImgBB if it's a base64 string
    let imageUrl = data.img;
    let imageDeleteHash = "";

    if (data.img && data.img.startsWith("data:")) {
      const base64Image = extractBase64FromDataURL(data.img);
      const uploadResult = await uploadImageToImgBB(base64Image);
      imageUrl = uploadResult.url;
      imageDeleteHash = uploadResult.deleteHash;
    }

    const newBlog = new Blog({
      title: data.title,
      category: data.category,
      description: data.description,
      img: imageUrl,
      imgDeleteHash: imageDeleteHash,
    });

    const saved = await newBlog.save();

    res.status(200).json({
      success: true,
      message: "Blog created successfully",
      data: saved,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create blog",
      error: error?.message,
    });
  }
};

/**
 * @function deleteBlog
 * @description Deletes a blog/article from the database by ID.
 *              Also deletes the associated image from ImgBB.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @params {String} id - Blog ID to delete
 * @route DELETE /api/admin/blog/delete/:id
 * @access Admin
 */
export const deleteBlog = async (req, res) => {
  try {
    const id = req.params.id;

    // Find blog to get image delete hash
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Delete image from ImgBB if delete hash exists
    if (blog.imgDeleteHash) {
      await deleteImageFromImgBB(blog.imgDeleteHash);
    }

    // Delete blog from database
    const deleted = await Blog.deleteOne({ _id: id });

    if (deleted.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
      data: deleted,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete blog",
      error: error?.message,
    });
  }
};

/**
 * @function editBlog
 * @description Updates an existing blog/article in the database.
 *              If image is updated, uploads new image to ImgBB and deletes old one.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @body {String} id - Blog ID to update (required)
 * @body {String} title - Updated blog title
 * @body {String} category - Updated blog category
 * @body {String} description - Updated blog content/description
 * @body {String} img - Updated blog image (base64 or URL)
 * @route PUT /api/admin/blog/edit
 * @access Admin
 */
export const editBlog = async (req, res) => {
  try {
    const data = req.body;
    const id = data.id;

    // Find existing blog to get old image delete hash
    const existingBlog = await Blog.findById(id);
    if (!existingBlog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    let imageUrl = data.img;
    let imageDeleteHash = existingBlog.imgDeleteHash;

    // Check if image is being updated (new base64 image)
    if (data.img && data.img.startsWith("data:")) {
      // Upload new image to ImgBB
      const base64Image = extractBase64FromDataURL(data.img);
      const uploadResult = await uploadImageToImgBB(base64Image);
      imageUrl = uploadResult.url;
      imageDeleteHash = uploadResult.deleteHash;

      // Delete old image from ImgBB (if exists)
      if (existingBlog.imgDeleteHash) {
        await deleteImageFromImgBB(existingBlog.imgDeleteHash);
      }
    }

    const updated = await Blog.updateOne(
      { _id: id },
      {
        $set: {
          img: imageUrl,
          imgDeleteHash: imageDeleteHash,
          title: data?.title,
          category: data?.category,
          description: data?.description,
        },
      }
    );

    if (updated.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update blog",
      error: error?.message,
    });
  }
};

/**
 * @function getBlog
 * @description Retrieves blogs/articles from the database with pagination support.
 *              Returns blogs sorted by creation date (newest first).
 *              Supports "Load More" functionality with page and limit parameters.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @query {Number} page - Page number (default: 1)
 * @query {Number} limit - Number of blogs per page (default: 9)
 * @route GET /api/admin/blog?page=1&limit=9
 * @access Admin
 *
 * @returns {Object} Response object containing:
 *   - success: Boolean indicating success/failure
 *   - message: Success/error message
 *   - data: Array of blog objects
 *   - pagination: {
 *       total: Total number of blogs
 *       page: Current page number
 *       limit: Blogs per page
 *       totalPages: Total number of pages
 *       hasMore: Boolean indicating if more blogs exist
 *     }
 */
export const getBlog = async (req, res) => {
  try {
    // Get pagination parameters from query string
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get total count of blogs
    const totalBlogs = await Blog.countDocuments();

    // Get paginated blogs
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Calculate total pages
    const totalPages = Math.ceil(totalBlogs / limit);

    // Check if there are more blogs to load
    const hasMore = page < totalPages;

    res.status(200).json({
      success: true,
      message: "Blogs retrieved successfully",
      data: blogs,
      pagination: {
        total: totalBlogs,
        page: page,
        limit: limit,
        totalPages: totalPages,
        hasMore: hasMore,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve blogs",
      error: error?.message,
    });
  }
};
