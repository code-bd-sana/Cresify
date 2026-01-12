import { Router } from "express";
import { deleteReview, getReviewByProducts, getReviewByProviderId, getReviewBySellerId, postReview, saveReview, updateReview } from "../controller/ReviewController.js";

const router = Router();
router.post('/', saveReview);
router.delete('/delete/:id', deleteReview);
router.put('/', postReview);
router.get('/product/:id', getReviewByProducts);
router.get('/seller/:id', getReviewBySellerId);
router.get('/service/:id', getReviewByProviderId);
router.put('/update/', updateReview)




export default router;