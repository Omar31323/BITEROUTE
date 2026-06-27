//@ts-nocheck
import Order from '../models/Order.js';

export const placeOrder = async (req, res) => {
    try {
        const restaurantId = req.session.restaurantId;
        const cart = req.session.cart;

        if (!cart || cart.length === 0)
            return res.status(400).json({ msg: 'Cart is empty' });

        const items = cart.map(item => ({
            menuItemId: item.menuItemId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
        }));

        const order = new Order({
            user: req.session.user.id,
            restaurant: restaurantId,
            items,
            totalPrice: cart.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0),
            notes: req.body.orderNotes,
        });

        await order.save();
        // clear cart after order
        req.session.cart = [];
        req.session.restaurantId = null;

        res.status(200).json({ success: true, message: 'Order placed successfully' });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            statusCode: 500,
            emoji: '🔥',
            title: 'Something went wrong',
            message: 'We could not place your order. Please try again.'
        });
    }
};

export const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.session.user.id })
            .populate('restaurant', 'name prepTime deliveryFees')
            .sort({ createdAt: -1 })
            .lean();
        res.json({ orders: orders });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            statusCode: 500,
            emoji: '🔥',
            title: 'Something went wrong',
            message: 'Could not load your orders.'
        });
    }
}
export const getRestaurantOrders = async (req, res) => {

    try {
        const orders = await Order.find({ restaurant: req.params.id })
            .populate('user', 'firstname lastname email')
            .populate('restaurant', 'name')
            .sort({ createdAt: -1 });

        res.json({ orders });

    } catch (error) {
        console.log(error);
        res.status(500).json({msg:error.message});
    }
};

export const updateOrderStatus = async (req, res) => {
    console.log('reached');
    console.log(req.body.status);
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        if (!order) return res.status(404).json({msg:'order was not found!'});
        res.json({msg:'success'});

    } catch (error) {
        console.log(error);
        res.status(500).json({msg:error.message});
    }
};