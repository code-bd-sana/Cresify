import { Router } from "express";
import {
  blockProviderDay,
  blockProviderSlot,
  getProviderAvailability,
  getProviderBookingsForDate,
  updateProviderAvailability,
} from "../controller/ProviderAvailabilityController.js";

const router = Router();

router.get("/:providerId", getProviderAvailability);
router.put("/:providerId", updateProviderAvailability);
router.post("/:providerId/block-day", blockProviderDay);
router.post("/:providerId/block-slot", blockProviderSlot);
router.get("/:providerId/bookings", getProviderBookingsForDate);

export default router;
