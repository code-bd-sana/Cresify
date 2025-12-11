import { Router } from "express";
import {
  blockProviderDay,
  blockProviderSlot,
  getProviderAvailability,
  getProviderBookingsForDate,
  updateProviderAvailability,
} from "../controller/ProviderAvailabilityController.js";

const router = Router();

/**
 * @route GET /provider-availability/:providerId
 * @desc Get provider's availability settings
 */
router.get("/:providerId", getProviderAvailability);

/**
 * @route PUT /provider-availability/:providerId
 * @desc Update provider's availability settings
 */
router.put("/:providerId", updateProviderAvailability);

/**
 * @route POST /provider-availability/:providerId/block-day
 * @desc Block an entire day for a provider
 */
router.post("/:providerId/block-day", blockProviderDay);

/**
 * @route POST /provider-availability/:providerId/block-slot
 * @desc Block a specific time slot for a provider
 */
router.post("/:providerId/block-slot", blockProviderSlot);

/**
 * @route GET /provider-availability/:providerId/bookings
 * @desc Get all bookings for a provider on a specific date
 */
router.get("/:providerId/bookings", getProviderBookingsForDate);

export default router;
