//@ts-nocheck
import Restaurant from '../models/Restaurant.js';
import MenuItem from '../models/MenuItem.js';
import { Types } from 'mongoose';

export const getWelcomePage = async (req, res) => {
    const searchTerm = (req.query.searchTerm || '').toLowerCase();
    const cuisine = (req.query.cuisine || '').toLowerCase();
    const page = parseInt(req.query.page) || 1;

    const limit = 12;
    const skip = (page - 1) * limit;

    let filter = {};

    if (searchTerm) {
        filter.name = { $regex: searchTerm, $options: "i" };
    }

    if (cuisine && cuisine !== "all") {
        filter.cuisine = cuisine;
    }

    const restaurants = await Restaurant.find(filter)
        .skip(skip)
        .limit(limit);

    res.json({ restaurants });
};

export const addRestaurants = async (req, res) => {
    const restaurant = new Restaurant();
    restaurant.set(req.body);
    console.log(req.body.cuisine);
    const { street, city, phone } = req.body;
    restaurant.addresses[0] = { street, city, phone };
    req.file ? restaurant.image = req.file.path : null;
    await restaurant.save();
    res.json({ msg: 'success!' });

}

export const getRestaurantMenu = async (req, res, next) => {
    try {
        const restaurantId = req.params.id;
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) return next(new Error('This restaurant does not exist'));

        const groupedMenuItems = await MenuItem.groupItems(restaurantId);
        res.json({ restaurant, groupedMenuItems });
    } catch (error) {
        next(error);
    }
}


export const deleteRestaurant = async (req, res) => {
    const restaurantId = req.params.id;
    const result = await Restaurant.deleteOne({ _id: restaurantId });
    if (!result.deletedCount === 1) {
        return res.status(404).json({ msg: 'Restaurant not found' });
    }
    res.json({ msg: 'success!' });
}

export const getAddRestaurants = (req, res) => {
    res.render('AddRestaurant');
}

export const getManageRestaurant = async (req, res) => {
    const restaurantId = req.params.id;
    const restaurant = await Restaurant.findById(restaurantId);
    const cuisines = await Restaurant.schema.path('cuisine').enumValues;
    res.json({ restaurant: restaurant, cuisines: cuisines });
}

export const editRestaurant = async (req, res) => {
    console.log(req.body);
    const restaurantId = req.params.id;
    const restaurant = await Restaurant.findById(restaurantId);
    if (restaurant) {
        restaurant.name = req.body.name;
        restaurant.cuisine = req.body.cuisine;
        restaurant.rating = req.body.rating;
        restaurant.description = req.body.description;
        restaurant.prepTime = req.body.prepTime;
        restaurant.deliveryFees = req.body.deliveryFees;
        restaurant.addresses[0].street = req.body.street;
        restaurant.addresses[0].city = req.body.city;
        restaurant.addresses[0].phone = req.body.phone;
        if (req.file)
            restaurant.image = req.file.path;
        try {
            await restaurant.save();
            res.status(200).json({ msg: 'sucess' });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: 'failure' });
        }

    }
    else
        res.status(404).json({ msg: 'restaurant could not be found' });
}