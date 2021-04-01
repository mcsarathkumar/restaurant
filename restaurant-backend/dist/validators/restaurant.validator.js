"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantValidator = void 0;
const express_validator_1 = require("express-validator");
exports.RestaurantValidator = {
    newRestaurant: [
        express_validator_1.body("name").isLength({ min: 3 }).trim(),
        express_validator_1.body("address1").isString().trim(),
        express_validator_1.body("address2").isString().trim(),
        express_validator_1.body("pincode").isInt().toInt(),
        express_validator_1.body("website").isString(),
        express_validator_1.body("phone").isInt().toInt(),
        express_validator_1.body("email").isEmail().normalizeEmail(),
        express_validator_1.body("city").isString().isIn(['Chennai', 'Mumbai', 'Bangalore', 'Hyderabad'])
    ],
    updateRestaurant: [
        express_validator_1.param("restaurantId").isInt().toInt(),
        express_validator_1.body("name").isLength({ min: 3 }).trim(),
        express_validator_1.body("address1").isString().trim(),
        express_validator_1.body("address2").isString().trim(),
        express_validator_1.body("pincode").isInt().toInt(),
        express_validator_1.body("website").isString(),
        express_validator_1.body("phone").isInt().toInt(),
        express_validator_1.body("email").isEmail().normalizeEmail(),
        express_validator_1.body("owner").isInt().toInt(),
        express_validator_1.body("city").isString().isIn(['Chennai', 'Mumbai', 'Bangalore', 'Hyderabad'])
    ],
    getRestaurant: [express_validator_1.param("restaurantId").isInt().toInt()],
    getRestaurantImages: [express_validator_1.param("restaurantId").isInt().toInt()],
    getRestaurantByRating: [express_validator_1.param("rating").isInt().toInt()],
    deleteRestaurant: [express_validator_1.param("restaurantId").isInt().toInt()],
    uploadImage: [express_validator_1.param("restaurantId").isInt().toInt()],
    deleteImage: [express_validator_1.param("imageId").isInt().toInt()],
    updateImage: [
        express_validator_1.param("imageId").isInt().toInt(),
        express_validator_1.param("restaurantId").isInt().toInt(),
        express_validator_1.param("type").isString().isIn(['banner', 'thumbnail'])
    ],
};
