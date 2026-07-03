import MongoStore from 'connect-mongo';
export const getSessionOptions = () => {
    return {
         secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            store: MongoStore.create({ mongoUrl: process.env.MONGO_STORE_URL})
    }
}