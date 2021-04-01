"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authorization_1 = require("../middlewares/authorization");
const authentication_1 = require("../middlewares/authentication");
const review_controller_1 = require("../controllers/review.controller");
const review_validator_1 = require("../validators/review.validator");
exports.ReviewRoutes = express_1.default.Router();
exports.ReviewRoutes.put("/update/:reviewId", review_validator_1.ReviewValidator.updateReview, authentication_1.Authentication, authorization_1.Authorization.isAdmin, review_controller_1.ReviewController.updateReview);
exports.ReviewRoutes.delete("/:reviewId", review_validator_1.ReviewValidator.deleteReview, authentication_1.Authentication, authorization_1.Authorization.isAdmin, review_controller_1.ReviewController.deleteReview);
exports.ReviewRoutes.post("/:restaurantId", review_validator_1.ReviewValidator.newUserReview, authentication_1.Authentication, authorization_1.Authorization.isCustomer, review_controller_1.ReviewController.newUserReview);
exports.ReviewRoutes.get("/getPendingActions", authentication_1.Authentication, authorization_1.Authorization.hasOwnerEntitlement, review_controller_1.ReviewController.getPendingActions);
exports.ReviewRoutes.put("/owner/:restaurantId", review_validator_1.ReviewValidator.ownerReply, authentication_1.Authentication, authorization_1.Authorization.isAuthorizedPerson, review_controller_1.ReviewController.ownerReply);
exports.ReviewRoutes.get("/:restaurantId", review_validator_1.ReviewValidator.getUserReviews, review_controller_1.ReviewController.getUserReviews);
