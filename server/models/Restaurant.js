//@ts-nocheck
import mongoose from "mongoose";
import { addressSchema } from './Address.js'
const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 2,
        maxlength: 50,
        required: true,
        trim: true,
        set: v => v.charAt(0).toUpperCase() + v.slice(1)
    },
    cuisine: {
        type: String,
        enum: ['Burgers', 'Sushi', 'Italian', 'Mexican', 'Chicken', 'Healthy', 'Asian', 'Pizza', 'Lebanese', 'Dessert']
    },
    description: {
        type: String
    },
    rating: {
        type: Number,
    },
    prepTime: {
        type: String // eg: 20-25 min
    },
    deliveryFees: {
        type: Number // 2.0 and the like
    },
    addresses: {
        type: [addressSchema],
        validate: v => v.length > 0
    },
    image: String
});

restaurantSchema.pre('save', function () {
    if (this.image) {
        if (!this.image.startsWith('/'))
            this.image = '/' + this.image;
    }
    else {
        this.image = '/app-data/default.jpg';
    }
});

restaurantSchema.statics.getAllRestaurants = function () {
    const restaurants = this.find();
    return restaurants;
}

restaurantSchema.statics.findByCategory = function (cat) {
    const restaurants = this.find({ cuisine: cat });
    return restaurants;
}
restaurantSchema.statics.filterBySearchKey = function (restaurants, searchKey) {
    const matchingRestaurants = restaurants.filter(restaurant => restaurant.name.toLowerCase().includes(searchKey.toLowerCase()));
    return matchingRestaurants;
}
const Restaurant = mongoose.model('Restaurant', restaurantSchema);
export default Restaurant;