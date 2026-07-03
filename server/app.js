//@ts-nocheck
import dotenv from 'dotenv';
dotenv.config();
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import session from 'express-session';
import { connectToDB } from './data/database.js';
import defaultRoutes from './routes/defaultRoutes.js';
import restaurantRoutes from './routes/restaurantRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { protectRoutesMiddleware } from './middlewares/protectRoutes.js';
import { attachLocals } from './middlewares/attachLocals.js';
import { enableCors } from './middlewares/enableCors.js';
import { globalError, notFoundError } from './middlewares/handleErrors.js';
import { getSessionOptions } from './utils/sessionOptions.js';
const app = express();

app.use(express.static('public'));
app.use('/app-data', express.static('app-data'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session(getSessionOptions()));
app.use(attachLocals);
app.use(enableCors());
app.use(defaultRoutes);
app.use(protectRoutesMiddleware, restaurantRoutes);
app.use(protectRoutesMiddleware, itemRoutes)
app.use(protectRoutesMiddleware, cartRoutes);
app.use(orderRoutes);
app.use(notFoundError);
app.use(globalError);
connectToDB().then(() => app.listen(process.env.PORT)).catch(error => console.error(error.message));

