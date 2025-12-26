import { Router } from "express";
import {
  allBookings,
  completeService,
  getBookingStats,
  getTodaysBookings,
  getUpcomingBookings,
  providerBooking,
  saveBooking,
  updateBookingStatus,
  userBooking,
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
router.put("/", updateBookingStatus);

/**
 * @route POST /booking/complete/:bookingId
 * @desc Complete a service and release provider payout
 */
router.post("/complete/:bookingId", completeService);

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



/** * @route GET /booking/userBookings
 * @desc Get bookings for a user
 */
router.get('/userBookings/:userId', userBooking)

/** * @route GET /booking/providerBookings
 * @desc Get bookings for a provider
 */

router.get('/providerBookings/:id', providerBooking)

router.get('/adminBookings', allBookings)

export default router;
