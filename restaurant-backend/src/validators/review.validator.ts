import {param, body} from "express-validator";

export const ReviewValidator = {
    newUserReview: [
        param('restaurantId').isInt().toInt(),
        body('user_rating').isInt({min: 1, max: 5}).toInt(),
        body('user_comments').isString()
    ],
    getUserReviews: [param('restaurantId').isInt().toInt()],
    ownerReply: [
        param('restaurantId').isInt().toInt(),
        body('id').isInt().toInt(),
        body('owner_comments').isString()
    ],
    deleteReview: [param('reviewId').isInt().toInt()],
    updateReview: [
        param('reviewId').isInt().toInt(),
        body('user_rating').isInt({min: 1, max: 5}).toInt(),
        body('user_comments').isString(),
        body('owner_comments').isString()
    ],
};
