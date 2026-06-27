//@ts-nocheck
import mongoose from "mongoose";
export const addressSchema = new mongoose.Schema({
    street: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        match: /^(\+961|0)?[0-9]{7,8}$/
    },
    label: {
        type: String,
        set: v => v.charAt(0).toUpperCase() + v.slice(1)
    }
});