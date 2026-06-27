import express from 'express';
const router = express.Router();
import upload from '../middlewares/uploadImage.js';
import normalizePath from '../middlewares/normalizePath.js';
import { deleteMenuItem, editMenuItem, getItemCategories } from '../controllers/itemControllers.js';
router.patch('/admin/item/:id/edit', upload('itemImage').single('image'),normalizePath, editMenuItem);
router.delete('/admin/item/:id/delete', deleteMenuItem);
router.get('/admin/item/:id/categories', getItemCategories);
export default router;