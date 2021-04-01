"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewValidator = void 0;
const express_validator_1 = require("express-validator");
exports.ReviewValidator = {
    newUserReview: [
        express_validator_1.param('restaurantId').isInt().toInt(),
        express_validator_1.body('user_rating').isInt({ min: 1, max: 5 }).toInt(),
        express_validator_1.body('user_comments').isString()
    ],
    getUserReviews: [express_validator_1.param('restaurantId').isInt().toInt()],
    ownerReply: [
        express_validator_1.param('restaurantId').isInt().toInt(),
        express_validator_1.body('id').isInt().toInt(),
        express_validator_1.body('owner_comments').isString()
    ],
    deleteReview: [express_validator_1.param('reviewId').isInt().toInt()],
    updateReview: [
        express_validator_1.param('reviewId').isInt().toInt(),
        express_validator_1.body('user_rating').isInt({ min: 1, max: 5 }).toInt(),
        express_validator_1.body('user_comments').isString(),
        express_validator_1.body('owner_comments').isString()
    ],
};
