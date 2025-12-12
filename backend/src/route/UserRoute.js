import { Router } from "express";
import { changeAvailability } from "../controller/ProviderController.js";
import {
  changePassword,
  getServiceProviders,
  getSingleProvider,
  loginUser,
  myProfile,
  registerProvider,
  saveUser,
  updateProfile,
} from "../controller/userController.js";

const router = Router();

// router.post('/register', saveUser);
router.post("/register", saveUser);
router.post("/register-provider", registerProvider);
router.post("/login", loginUser);
router.put("/changePassword", changePassword);
router.put("/updateProfile", updateProfile);
router.put("/changeAvailability", changeAvailability);
router.get("/all-providers", getServiceProviders);
router.get("/provider/:id", getSingleProvider);
router.get("/myProfile/:id", myProfile);
export default router;
