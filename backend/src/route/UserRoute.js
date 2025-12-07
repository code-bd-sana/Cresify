import { Router } from "express"
import { changePassword, loginUser, saveUser, updateProfile } from "../controller/userController.js";
import { changeAvailability } from "../controller/ProviderController.js";

const router = Router();


router.post('/register', saveUser);
router.post('/login', loginUser);
router.put('/changePassword', changePassword);
router.put('/updateProfile/:id', updateProfile);
router.put('/changeAvailability', changeAvailability)
export default router;
