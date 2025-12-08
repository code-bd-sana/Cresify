import { Router } from "express"
import { changePassword, loginUser, myProfile, saveUser, updateProfile } from "../controller/userController.js";
import { changeAvailability } from "../controller/ProviderController.js";

const router = Router();


router.post('/register', saveUser);
router.post('/login', loginUser);
router.put('/changePassword', changePassword);
router.put('/updateProfile', updateProfile);
router.put('/changeAvailability', changeAvailability);
router.get('/myProfile/:id',  myProfile )
export default router;
