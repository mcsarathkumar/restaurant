import express from "express"
import {RestaurantController} from "../controllers/restaurant.controller";
import {Authorization} from "../middlewares/authorization";
import {Authentication} from "../middlewares/authentication";
import {RestaurantValidator} from "../validators/restaurant.validator";

export const RestaurantRoutes = express.Router();

// Get all Restaurants
RestaurantRoutes.get("", RestaurantController.getAllRestaurants);

// Get Owned Restaurants
RestaurantRoutes.get("/getOwnedRestaurants",  Authentication, Authorization.hasOwnerEntitlement, RestaurantController.getOwnedRestaurants);

RestaurantRoutes.get("/images/:restaurantId", RestaurantValidator.getRestaurantImages, RestaurantController.getRestaurantImages);

// Get Restaurants by rating
RestaurantRoutes.get("rating/:rating", RestaurantValidator.getRestaurantByRating, RestaurantController.getRestaurantByRating);

// New Restaurant
RestaurantRoutes.post("", Authentication, RestaurantValidator.newRestaurant, Authorization.hasOwnerEntitlement, RestaurantController.newRestaurant);

// Get Restaurant
RestaurantRoutes.get("/:restaurantId", RestaurantValidator.getRestaurant, RestaurantController.getRestaurant);

// Update Restaurant
RestaurantRoutes.put("/:restaurantId", Authentication, RestaurantValidator.updateRestaurant, Authorization.isAdmin, RestaurantController.updateRestaurant);

// Delete Restaurant
RestaurantRoutes.delete("/:restaurantId", Authentication, RestaurantValidator.deleteRestaurant, Authorization.isAdmin, RestaurantController.deleteRestaurant);



// Upload Images
RestaurantRoutes.post(
    "/uploadImage/:restaurantId",
    RestaurantValidator.uploadImage,
    Authentication,
    Authorization.isAuthorizedPerson,
    RestaurantController.uploadImage
);

// Delete Images
RestaurantRoutes.delete(
    "/deleteImage/:restaurantId/:imageId",
    RestaurantValidator.deleteImage,
    Authentication,
    Authorization.isAuthorizedPerson,
    RestaurantController.deleteImage
);

RestaurantRoutes.get(
    "/updateImage/:restaurantId/:type/:imageId",
    RestaurantValidator.updateImage,
    Authentication,
    Authorization.isAuthorizedPerson,
    RestaurantController.updateImage
);
