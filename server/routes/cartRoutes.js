//@ts-nocheck
import express from 'express';
import { getCart,updateCart,updateCartItem,deleteCartItem, getCartCount } from '../controllers/cartControllers.js';
const router  = express.Router();
router.get('/cart',getCart);
router.patch('/restaurant/cart/item',updateCart);
router.patch('/cart/item',updateCartItem);
router.delete('/cart/item',deleteCartItem);
export default router;