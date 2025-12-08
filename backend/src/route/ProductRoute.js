import { Router } from "express";
import { deleteProduct, editProduct, getSingleProduct, myProduct, saveProduct } from "../controller/ProductController.js";

const router = Router();
router.post('/save', saveProduct);
router.delete('/delete/:id', deleteProduct);
router.put('/edit', editProduct);
router.get('/myProduct/:id', myProduct);
router.get('/singleProduct/:id', getSingleProduct)


export default router;