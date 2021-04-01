"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantRoutes = void 0;
const express_1 = __importDefault(require("express"));
const restaurant_controller_1 = require("../controllers/restaurant.controller");
const authorization_1 = require("../middlewares/authorization");
const authentication_1 = require("../middlewares/authentication");
const restaurant_validator_1 = require("../validators/restaurant.validator");
exports.RestaurantRoutes = express_1.default.Router();
// Get all Restaurants
exports.RestaurantRoutes.get("", restaurant_controller_1.RestaurantController.getAllRestaurants);
// Get Owned Restaurants
exports.RestaurantRoutes.get("/getOwnedRestaurants", authentication_1.Authentication, authorization_1.Authorization.hasOwnerEntitlement, restaurant_controller_1.RestaurantController.getOwnedRestaurants);
exports.RestaurantRoutes.get("/images/:restaurantId", restaurant_validator_1.RestaurantValidator.getRestaurantImages, restaurant_controller_1.RestaurantController.getRestaurantImages);
// Get Restaurants by rating
exports.RestaurantRoutes.get("rating/:rating", restaurant_validator_1.RestaurantValidator.getRestaurantByRating, restaurant_controller_1.RestaurantController.getRestaurantByRating);
// New Restaurant
exports.RestaurantRoutes.post("", authentication_1.Authentication, restaurant_validator_1.RestaurantValidator.newRestaurant, authorization_1.Authorization.hasOwnerEntitlement, restaurant_controller_1.RestaurantController.newRestaurant);
// Get Restaurant
exports.RestaurantRoutes.get("/:restaurantId", restaurant_validator_1.RestaurantValidator.getRestaurant, restaurant_controller_1.RestaurantController.getRestaurant);
// Update Restaurant
exports.RestaurantRoutes.put("/:restaurantId", authentication_1.Authentication, restaurant_validator_1.RestaurantValidator.updateRestaurant, authorization_1.Authorization.isAdmin, restaurant_controller_1.RestaurantController.updateRestaurant);
// Delete Restaurant
exports.RestaurantRoutes.delete("/:restaurantId", authentication_1.Authentication, restaurant_validator_1.RestaurantValidator.deleteRestaurant, authorization_1.Authorization.isAdmin, restaurant_controller_1.RestaurantController.deleteRestaurant);
// Upload Images
exports.RestaurantRoutes.post("/uploadImage/:restaurantId", restaurant_validator_1.RestaurantValidator.uploadImage, authentication_1.Authentication, authorization_1.Authorization.isAuthorizedPerson, restaurant_controller_1.RestaurantController.uploadImage);
// Delete Images
exports.RestaurantRoutes.delete("/deleteImage/:restaurantId/:imageId", restaurant_validator_1.RestaurantValidator.deleteImage, authentication_1.Authentication, authorization_1.Authorization.isAuthorizedPerson, restaurant_controller_1.RestaurantController.deleteImage);
exports.RestaurantRoutes.get("/updateImage/:restaurantId/:type/:imageId", restaurant_validator_1.RestaurantValidator.updateImage, authentication_1.Authentication, authorization_1.Authorization.isAuthorizedPerson, restaurant_controller_1.RestaurantController.updateImage);
