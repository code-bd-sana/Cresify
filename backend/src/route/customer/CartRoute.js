import { Router } from "express";
import { addToCart, decreaseCount, increaseCount, myCart, removeCart } from "../../controller/customer/CartController.js";

const router = Router();
router.post('/add', addToCart);
router.delete("/delete/:id", removeCart);
router.put("/increase/:id", increaseCount);
router.put("/decrease/:id", decreaseCount);
router.get('/myCart/:id', myCart);



export default router;