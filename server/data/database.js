import mongoose from 'mongoose';
export const connectToDB = async () => {
    await mongoose.connect('mongodb://localhost/biterouteDB');
}
