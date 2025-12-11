import { Router } from "express";
import {
  changeStatus,
  getTodaysBookings,
  getUpcomingBookings,
  saveBooking,
} from "../controller/BookingController.js";

const router = Router();
router.post("/", saveBooking);
router.put("/", changeStatus);
router.get("/today", getTodaysBookings);
router.get("/upcoming", getUpcomingBookings);
export default router;
