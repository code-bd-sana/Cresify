import { Router } from "express";
import { deleteProduct, editProduct, saveProduct } from "../controller/ProductController.js";

const router = Router();
router.post('/save', saveProduct);
router.delete('/delete/:id', deleteProduct);
router.put('/edit/:id', editProduct)


export default router;