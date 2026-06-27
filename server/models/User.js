//@ts-nocheck
import mongoose, { mongo, SchemaType } from 'mongoose';
import bcrypt from 'bcryptjs';
import { addressSchema } from './Address.js';
const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
        trim: true,
        set: v => v.charAt(0).toUpperCase() + v.slice(1)
    },
    lastname: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
        trim: true,
        set: v => v.charAt(0).toUpperCase() + v.slice(1)
    },
    email: {
        type: String,
        required: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true,
        match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/
    },
    addresses: [addressSchema]
});

userSchema.pre('save', async function () {
    try {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
    } catch (error) {
        throw error;
    }
});
userSchema.statics.userExists = async function (enteredEmail, enteredPassword) {
    const user = await this.findOne({ email: enteredEmail });
    if (user) {
        const passwordsMatch = await bcrypt.compare(enteredPassword, user.password);
        if (passwordsMatch)
            return user.toObject();
        else
            throw new Error('Password is incorrect.');
    }
    else
        throw new Error('User does not exist.');
};
const User = mongoose.model('User', userSchema);
export default User;