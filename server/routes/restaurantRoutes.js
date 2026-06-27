//@ts-nocheck
import express from 'express';
import { getWelcomePage, getRestaurantMenu, getAddRestaurants, addRestaurants,deleteRestaurant, getManageRestaurant, editRestaurant } from '../controllers/restaurantControllers.js';
import { addRestaurantMenuItems , deleteMenuItem , editMenuItem,getAddItems,getEditItems} from '../controllers/itemControllers.js';
import normalizePath from '../middlewares/normalizePath.js';
import upload from '../middlewares/uploadImage.js';
const router = express.Router();
router.get('/restaurant/:id/menu', getRestaurantMenu);
router.get('/admin/restaurants', getAddRestaurants);
router.post('/restaurants', upload('restaurantImage').single('image'), normalizePath, addRestaurants);
router.get('/admin/restaurant/:id/addItems', getAddItems);
router.get('/admin/restaurant/:id/editItems', getEditItems);
router.post('/admin/restaurant/:id/menu', upload('itemImage').any(), normalizePath,addRestaurantMenuItems);
router.delete('/admin/restaurant/:id/delete', deleteRestaurant);
router.get('/admin/restaurant/:id/manage', getManageRestaurant);
router.patch('/admin/restaurant/:id/edit', upload('restaurantImage').single('image'), normalizePath, editRestaurant);
export default router;
