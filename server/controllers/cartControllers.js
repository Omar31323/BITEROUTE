//@ts-nocheck
import Restaurant from "../models/Restaurant.js";

export const updateCart = (req, res) => {

    const { menuItemId, name, price,image, restaurantId, change } = req.body;

    if (!req.session.cart) {
        req.session.cart = [];
    }
     req.session.restaurantId = req.session.restaurantId || restaurantId;

    if (req.session.restaurantId !== restaurantId) {
        return res.status(400).json({ msg: 'Cannot add item from a different restaurant' });
    }

    let item = req.session.cart.find(item => item.menuItemId === menuItemId);

    if (!item) {
        item = { menuItemId, name, price,image, quantity: 0 };
        req.session.cart.push(item);
    }

    if (change === 'add') {
        item.quantity += 1;
    } else if (item.quantity > 0) {
        item.quantity -= 1;
    }

    if (item.quantity <= 0) {
        req.session.cart = req.session.cart.filter(item => item.menuItemId !== menuItemId);
    }

    const totalQuantity = req.session.cart.reduce(
        (sum, item) => sum + item.quantity, 0);

    req.session.save((err) => {
        if (err) {
            return res.status(500).send("Error saving session");
        }
    });
    res.json({
        menuItemQuantity: item?.quantity || 0,
        totalQuantity
    });

}



export const updateCartItem = async (req, res) => {
    try {
        console.log('reached backend');
        const { itemId, change } = req.body;
        let cart = req.session.cart || [];

        let item = cart.find(item => item.menuItemId == itemId);

        if (!item) return res.status(500).json({ msg: 'item not found' });

        if (change === 'add') item.quantity += 1;
        else if (item.quantity > 1) item.quantity -= 1;

        if (item.quantity <= 0) {
            cart = cart.filter(i => i.menuItemId !== itemId);
            req.session.cart = cart;
        }

        item.extendedPrice = item.quantity * item.price;

        const totalPrice = cart.reduce((sum, i) => sum + i.quantity * i.price, 0);
        req.session.save((err) => {
            if (err) {
                return res.status(500).send("Error saving session");
            }
        });
        const totalQuantity = cart.reduce(
            (sum, item) => sum + item.quantity, 0);

        res.json({
            quantity: item.quantity,
            extendedPrice: item.extendedPrice,
            totalPrice,
            totalQuantity
        });
    } catch (error) {
        console.log(error);
    }

}

export const deleteCartItem = async (req, res) => {
    try {
        const { itemId } = req.body;

        let cart = req.session.cart || [];

        cart = cart.filter(item => item.menuItemId !== itemId);
        req.session.cart = cart;

        const totalPrice = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
        req.session.save((err) => {
            if (err) {
                // Handle save error
                return res.status(500).send("Error saving session");
            }
        });
        const totalQuantity = cart.reduce(
            (sum, item) => sum + item.quantity, 0);
            if(!cart.length) req.session.restaurantId = '';
        res.json({ totalPrice, totalQuantity });
    } catch (error) {
        console.log(error);
    }
}

export const getCart = async (req, res) => {
    let cart = req.session.cart || [];
    const restaurantId = req.session.restaurantId;
    if (!restaurantId) {
        return res.json({ cart: [], totalPrice: 0, restaurant: null });
    }
    const restaurant = await Restaurant.findById(restaurantId);
    cart = cart.map((item) => {
        item.extendedPrice = item.quantity * item.price;
        return item;
    });
    const totalPrice = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
    req.session.save((err) => {
        if (err) {
            // Handle save error
            return res.status(500).json({ msg: "Error saving session" });
        }
    });
    res.json({ cart, totalPrice, restaurant });

};

export const getCartCount = async (req, res) => {
    const cart = req.session.cart || [];
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    res.json(cartCount);
}