import { Router } from "express";
import { editStatus, saveOrder } from "../controller/OrderController.js";

const router = Router();
router.post('/', saveOrder);
router.put('/', editStatus)
export default router;