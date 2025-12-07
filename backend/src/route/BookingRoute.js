import { Router } from "express";
import { changeStatus, saveBooking } from "../controller/BookingController.js";

const router = Router();
router.post('/', saveBooking);
router.put('/', changeStatus)
export default router;