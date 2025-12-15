import { Router } from "express";
import {
  addToWishList,
  checkWishList,
  getWishList,
  removeFromWishList,
} from "../../controller/customer/WIshListController.js";

const router = Router();

/**
 * Route to check if a product is already in the wishlist.
 * Method: GET
 * Endpoint: wishlist/check/:id/:userId
 */
router.get("/check/:id/:userId", checkWishList);

/**
 * Route to remove an item from the wishlist by its ID.
 * Method: DELETE
 * Endpoint: wishlist/remove/:id
*/
router.delete("/remove/:id", removeFromWishList);

/**
 * Route to get wishlist items for a user with infinite scroll.
 * Method: GET
 * Endpoint: wishlist/:userId?page=1&limit=10
*/
router.get("/:userId", getWishList);

/**
 * Route to add an item to the wishlist.
 * Method: POST
 * Endpoint: wishlist/add
 */
router.post("/add", addToWishList);

export default router;
