import {param, body} from "express-validator";

export const RestaurantValidator = {
    newRestaurant: [
        body("name").isLength({min: 3}).trim(),
        body("address1").isString().trim(),
        body("address2").isString().trim(),
        body("pincode").isInt().toInt(),
        body("website").isString(),
        body("phone").isInt().toInt(),
        body("email").isEmail().normalizeEmail(),
        body("city").isString().isIn(['Chennai', 'Mumbai', 'Bangalore', 'Hyderabad'])
    ],
    updateRestaurant: [
        param("restaurantId").isInt().toInt(),
        body("name").isLength({min: 3}).trim(),
        body("address1").isString().trim(),
        body("address2").isString().trim(),
        body("pincode").isInt().toInt(),
        body("website").isString(),
        body("phone").isInt().toInt(),
        body("email").isEmail().normalizeEmail(),
        body("owner").isInt().toInt(),
        body("city").isString().isIn(['Chennai', 'Mumbai', 'Bangalore', 'Hyderabad'])
    ],
    getRestaurant: [param("restaurantId").isInt().toInt()],
    getRestaurantImages: [param("restaurantId").isInt().toInt()],
    getRestaurantByRating: [param("rating").isInt().toInt()],
    deleteRestaurant: [param("restaurantId").isInt().toInt()],
    uploadImage: [param("restaurantId").isInt().toInt()],
    deleteImage: [param("imageId").isInt().toInt()],
    updateImage: [
        param("imageId").isInt().toInt(),
        param("restaurantId").isInt().toInt(),
        param("type").isString().isIn(['banner', 'thumbnail'])
    ],

};
