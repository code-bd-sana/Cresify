import { Router } from "express";
import {
  changeStatus,
  getBookingStats,
  getTodaysBookings,
  getUpcomingBookings,
  saveBooking,
} from "../controller/BookingController.js";

const router = Router();

/**
 * @route POST /booking
 * @desc Save a new booking
 */
router.post("/", saveBooking);

/**
 * @route PUT /booking
 * @desc Change the status of a booking
 */
router.put("/", changeStatus);

/**
 * @route GET /booking/today
 * @desc Get today's bookings for a provider
 */
router.get("/today", getTodaysBookings);

/**
 * @route GET /booking/upcoming
 * @desc Get upcoming bookings for a provider
 */
router.get("/upcoming", getUpcomingBookings);

/**
 * @route GET /booking/stats
 * @desc Get booking stats for chart (cancelled/completed counts)
 */
router.get("/stats", getBookingStats);
export default router;
