import { Router } from "express";
import { deleteBlog, editBlog, saveBlog } from "../controller/BlogController.js";

const router = Router();

router.post('/save', saveBlog);
router.delete('/delete/:id', deleteBlog);
router.put('/edit', editBlog)
export default router;