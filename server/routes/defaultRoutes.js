//@ts-nocheck
import express from 'express';
import User from '../models/User.js';
import { getLoginPage, getSignupPage, LogIn, LogOut, persistUser, SignUp } from '../controllers/authControllers.js';
import { getWelcomePage } from '../controllers/restaurantControllers.js';
import { getCartCount } from '../controllers/cartControllers.js';
export const router = express.Router();
router.get('/restaurants', getWelcomePage);
router.get('/signup', getSignupPage);
router.post('/signup', SignUp);
router.get('/login', getLoginPage);
router.post('/login', LogIn);
router.get('/logout', LogOut);
router.get('/persistUser', persistUser);
router.get('/cart/count', getCartCount);
export default router;
