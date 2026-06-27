//@ts-nocheck
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { connectToDB } from './data/database.js';
import defaultRoutes from './routes/defaultRoutes.js';
import restaurantRoutes from './routes/restaurantRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { protectRoutesMiddleware } from './middlewares/protectRoutes.js';
import { attachLocals } from './middlewares/attachLocals.js';
import cors from 'cors';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/app-data', express.static('app-data'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
    secret: 'super-secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost/biterouteDB' })
}));
app.use(attachLocals);
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(defaultRoutes);
app.use(protectRoutesMiddleware, restaurantRoutes);
app.use(protectRoutesMiddleware, itemRoutes)
app.use(protectRoutesMiddleware, cartRoutes);
app.use(orderRoutes);
app.use((req, res) => {
    res.status(404).json( {
        statusCode: 404,
        emoji: '🔍',
        title: 'Page not found',
        message: "We couldn't find what you were looking for."
    });
});
app.use((error, req, res, next) => {
    console.log(error.message);
    res.status(500).json({
        statusCode: 500,
        emoji: '🔥',
        title: 'Something went wrong',
        message: 'An unexpected error occurred on our side. Try again in a moment.'
    });
});
connectToDB()
    .then(() => {
        app.listen(3000);
    }
    )
    .catch((error) => {
        console.error('Failed to connect to Database: ' + error.message);
    })
