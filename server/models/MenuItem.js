//@ts-nocheck
import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
        trim: true,
        set: v => v.charAt(0).toUpperCase() + v.slice(1)
    },
    price: {
        type: Number,
    },
    description: {
        type: String
    },
    category: {
        type: String,
        set: v => v.charAt(0).toUpperCase() + v.slice(1)
    },
    popular: {
        type: Boolean,
        default: false
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    image: {
        type: String
    }
});
menuItemSchema.pre('save', function () {
    if (this.image) {
        if (!this.image.startsWith('/'))
            this.image = '/' + this.image;
    }

    else {
        this.image = '/app-data/default.jpg';
    }

});

menuItemSchema.statics.filterByRestaurant = async function (restaurantId) {
    const filteredMenuItems = await this.find({
        restaurant: restaurantId
    });
    return filteredMenuItems;
}
menuItemSchema.statics.findCategories = function (menuItems) {
    const categoriesList = [];
    for (const menuItem of menuItems) {
        if (!categoriesList.includes(menuItem.category))
            categoriesList.push(menuItem.category);
    }
    return categoriesList;
}
menuItemSchema.statics.groupItems = async function (restaurantId) {
    const menuItems = await this.filterByRestaurant(restaurantId);
    const groupedItems = {};
    for (const menuItem of menuItems) {
        if (!groupedItems[menuItem.category]) {
            groupedItems[menuItem.category] = [];
        }
        groupedItems[menuItem.category].push(menuItem);
    }
    return groupedItems;
}
const MenuItem = mongoose.model('menuItem', menuItemSchema);
export default MenuItem;