//@ts-nocheck
import express from 'express';
import { getUserOrders, placeOrder,getRestaurantOrders,updateOrderStatus } from '../controllers/orderControllers.js';
import { protectRoutesMiddleware } from '../middlewares/protectRoutes.js';
const router = express.Router();
router.post('/restaurant/order', placeOrder);
router.get('/orders', getUserOrders);
router.get('/admin/restaurants/:id/orders',protectRoutesMiddleware, getRestaurantOrders);
router.patch('/admin/orders/:id/status',protectRoutesMiddleware, updateOrderStatus);
export default router;