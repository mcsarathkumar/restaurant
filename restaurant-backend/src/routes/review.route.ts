import express from "express";
import {Authorization} from "../middlewares/authorization";
import {Authentication} from "../middlewares/authentication";
import {ReviewController} from "../controllers/review.controller";
import {ReviewValidator} from "../validators/review.validator";

export const ReviewRoutes = express.Router();

ReviewRoutes.put("/update/:reviewId", ReviewValidator.updateReview, Authentication, Authorization.isAdmin, ReviewController.updateReview);

ReviewRoutes.delete("/:reviewId", ReviewValidator.deleteReview, Authentication, Authorization.isAdmin, ReviewController.deleteReview);

ReviewRoutes.post("/:restaurantId", ReviewValidator.newUserReview, Authentication, Authorization.isCustomer, ReviewController.newUserReview);

ReviewRoutes.get("/getPendingActions", Authentication, Authorization.hasOwnerEntitlement, ReviewController.getPendingActions);

ReviewRoutes.put("/owner/:restaurantId", ReviewValidator.ownerReply, Authentication, Authorization.isAuthorizedPerson, ReviewController.ownerReply);

ReviewRoutes.get("/:restaurantId", ReviewValidator.getUserReviews, ReviewController.getUserReviews);

