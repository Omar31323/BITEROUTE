//@ts-nocheck
import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    menuItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'menuItem',
        required: true
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    items: {
        type: [orderItemSchema],
        validate: v => v.length > 0
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['preparing', 'out_for_delivery', 'delivered', 'cancelled'],
        default: 'preparing'
    },
    notes: {
        type: String
    }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;