//@ts-nocheck
import Restaurant from '../models/Restaurant.js';
import MenuItem from '../models/MenuItem.js';


export const addRestaurantMenuItems = async (req, res, next) => {
    console.log(req.body);
    console.log(req.files);
    const restaurantId = req.params.id;
    const restaurant = await Restaurant.exists({ _id: restaurantId });
    if (!restaurant)
        return next(new Error('this restaurant does not exist'));

    const itemIds = [].concat(req.body.itemIds);
    const items = itemIds.map(id => ({
        name: req.body[`name-${id}`],
        price: req.body[`price-${id}`],
        description: req.body[`description-${id}`],
        category: req.body[`category-${id}`],
        popular: req.body[`popular-${id}`] === 'on',
        image: '/' + req.files.find(f => f.fieldname === `image-${id}`)?.path.replace(/\\/g, '/'),
        restaurant: restaurantId,
    }));

    try {
        await MenuItem.insertMany(items);
    } catch (error) {
        console.log('error is :' + error.message);
        return res.status(500).json({});
    }
    res.json({ msg: 'success' });
}

export const editMenuItem = async (req, res) => {
    console.log('reached edit');
    const itemId = req.params.id;
    const item = await MenuItem.findById(itemId);
    const categories = await MenuItem.distinct('category', { restaurant: item.restaurant });
    if (!item) {
        return res.status(404).json({ msg: 'item was not found' });
    }
    item.name = req.body.name;
    item.price = req.body.price;
    item.category = req.body.category;
    item.description = req.body.description;
    item.popular = req.body.popular === 'on';
    if (req.file) item.image = req.file.path;
    try {
        await item.save();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'failure' });
    }

    res.json({ msg: 'success', item });

};

export const deleteMenuItem = async (req, res) => {
    const itemId = req.params.id;
    const result = await MenuItem.deleteOne({ _id: itemId });
    if (!result.deletedCount === 1) {
        return res.status(404).json({ msg: 'could not found item' });
    }
    res.json({ msg: 'success' });
}

export const getEditItems = async (req, res) => {
    const restaurantId = req.params.id;
    const menuItems = await MenuItem.filterByRestaurant(restaurantId);
    const categories = await MenuItem.findCategories(menuItems);
    res.json({ menuItems, categories });
}
export const getItemCategories = async (req, res) => {
    console.log('here');
    const restaurantId = req.params.id;
    console.log(restaurantId);
    const menuItems = await MenuItem.filterByRestaurant(restaurantId);
    const categories = await MenuItem.findCategories(menuItems);
    console.log(categories);
    res.json({ categories });
}

export const getAddItems = (req, res) => {
    res.render('AddItems');
}
