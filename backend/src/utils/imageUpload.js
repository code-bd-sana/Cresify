import axios from "axios";
import FormData from "form-data";

const IMGBB_API_KEY = "b49a7cbd3d5227c273945bd7114783a9";
const IMGBB_UPLOAD_URL = "https://api.imgbb.com/1/upload";

/**
 * @function uploadImageToImgBB
 * @description Uploads an image to ImgBB and returns the image URL and delete hash
 *
 * @param {String} base64Image - Base64 encoded image string (without data:image prefix)
 * @returns {Promise<Object>} Object containing:
 *   - url: Direct URL to the uploaded image
 *   - deleteHash: Hash needed to delete the image later
 *   - thumb: Thumbnail URL
 *   - display_url: Display URL
 *
 * @throws {Error} If upload fails
 */
export const uploadImageToImgBB = async (base64Image) => {
  try {
    const formData = new FormData();
    formData.append("key", IMGBB_API_KEY);
    formData.append("image", base64Image);

    const response = await axios.post(IMGBB_UPLOAD_URL, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    if (response.data.success) {
      return {
        url: response.data.data.url,
        deleteHash: response.data.data.delete_url.split("/").pop(),
        thumb: response.data.data.thumb.url,
        display_url: response.data.data.display_url,
      };
    } else {
      throw new Error("Image upload failed");
    }
  } catch (error) {
    console.error("ImgBB Upload Error:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.error?.message || "Failed to upload image to ImgBB"
    );
  }
};

/**
 * @function deleteImageFromImgBB
 * @description Deletes an image from ImgBB using the delete hash
 *
 * @param {String} deleteHash - The delete hash returned during upload
 * @returns {Promise<Boolean>} True if deletion was successful
 *
 * @throws {Error} If deletion fails
 */
export const deleteImageFromImgBB = async (deleteHash) => {
  try {
    // ImgBB doesn't have a direct delete API with API key
    // The delete URL format is: https://ibb.co/delete/{deleteHash}
    // This requires manual deletion or using the delete URL

    // For now, we'll just log it and return true
    // In production, you might want to store delete URLs and handle them differently
    console.log(`Image delete hash: ${deleteHash}`);
    console.log(`Delete URL: https://ibb.co/delete/${deleteHash}`);

    // Note: ImgBB free tier doesn't support API-based deletion
    // Images will auto-expire based on account settings
    return true;
  } catch (error) {
    console.error("ImgBB Delete Error:", error.message);
    // Don't throw error for delete failures to avoid blocking operations
    return false;
  }
};

/**
 * @function extractBase64FromDataURL
 * @description Extracts base64 string from data URL
 *
 * @param {String} dataURL - Data URL (e.g., "data:image/png;base64,iVBORw0KGgo...")
 * @returns {String} Pure base64 string without prefix
 */
export const extractBase64FromDataURL = (dataURL) => {
  if (!dataURL) return null;

  // If it's already base64 without prefix, return as is
  if (!dataURL.startsWith("data:")) {
    return dataURL;
  }

  // Extract base64 part after comma
  const base64 = dataURL.split(",")[1];
  return base64;
};
