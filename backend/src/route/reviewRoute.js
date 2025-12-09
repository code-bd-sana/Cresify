import { Router } from "express";
import { deleteReview, postReview, saveReview } from "../controller/ReviewController.js";

const router = Router();
router.post('/', saveReview);
router.delete('/delete/:id', deleteReview);
router.put('/', postReview)




export default router;