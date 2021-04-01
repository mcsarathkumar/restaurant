import {RequestHandler, Response} from "express";
import {StatusCodes, ReasonPhrases} from "http-status-codes";
import {appConstants} from "../configs/constants";
import {SharedFunction} from "../configs/functions";
import {SqlConnection as mysqlQuery} from "../configs/mysqlConnection";
import moment from "moment";

export class ReviewController {
    /**
     * Create new review
     * @param {*} req - request
     * @param {*} res - response
     * @param {*} next - next call back
     */
    static newUserReview: RequestHandler = (req, res, next) => {
        if (SharedFunction.checkValidations(req, res)) {
            const restaurant_id = req.params.restaurantId;
            const user_rating = req.body.user_rating;
            const user_comments = req.body.user_comments;
            const currentDate = moment().format('YYYY-MM-DD');
            const query = "INSERT INTO restaurant_reviews(restaurant_id, user_rating, user_comments, commented_by, commented_on) VALUES (?,?,?,?,?)";
            // @ts-ignore
            const queryInput = [restaurant_id, user_rating, user_comments, req.userData.uid, currentDate];
            mysqlQuery(res, query, queryInput, (err: any, row: any) => {
                if (err) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                        message: "Failed to Save Comments",
                    });
                } else {
                    res.status(StatusCodes.CREATED).json({
                        message: "Thanks for your review !!",
                    });
                }
            });
        }
    };

    /**
     * Create new review
     * @param {*} req - request
     * @param {*} res - response
     * @param {*} next - next call back
     */
    static ownerReply: RequestHandler = (req, res, next) => {
        if (SharedFunction.checkValidations(req, res)) {
            const restaurant_id = req.params.restaurantId;
            const id = req.body.id;
            const owner_comments = req.body.owner_comments;
            const currentDate = moment().format('YYYY-MM-DD');
            const query = "UPDATE restaurant_reviews SET owner_comments=?,owner_commented_by=?,owner_commented_on=? WHERE id = ?";
            // @ts-ignore
            const queryInput = [owner_comments, req.userData.uid, currentDate, id];
            mysqlQuery(res, query, queryInput, (err: any, row: any) => {
                if (err) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                        message: "Failed to Save Comments",
                    });
                } else {
                    res.status(StatusCodes.OK).json({
                        message: "Comments updated !!",
                    });
                }
            });
        }
    };


    /**
     * Create new review
     * @param {*} req - request
     * @param {*} res - response
     * @param {*} next - next call back
     */
    static getUserReviews: RequestHandler = (req, res, next) => {
        if (SharedFunction.checkValidations(req, res)) {
            const restaurant_id = req.params.restaurantId;
            const query = "SELECT a.id, a.user_rating, concat(b.firstname, ' ', b.lastname) as user_name, a.user_comments, a.commented_on, a.owner_comments FROM restaurant_reviews as a INNER JOIN users as b on a.commented_by = b.id where a.restaurant_id = ? ORDER BY a.user_rating DESC, a.commented_on DESC";
            // @ts-ignore
            const queryInput = [restaurant_id];
            mysqlQuery(res, query, queryInput, (err: any, row: any) => {
                if (err) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                        message: "Failed to Save Comments",
                    });
                } else {
                    res.status(StatusCodes.OK).json({
                        message: 'Data fetched',
                        details: row
                    });
                }
            });
        }
    };


    static getPendingActions: RequestHandler = (req, res, next) => {
        if (SharedFunction.checkValidations(req, res)) {
            const restaurant_id = req.params.restaurantId;
            const query = "SELECT a.id, a.restaurant_id, b.name, a.user_rating, a.user_comments, a.commented_by, concat(u.firstname, ' ', u.lastname) as user_name, a.commented_on FROM restaurant_reviews as a LEFT JOIN restaurants as b ON a.restaurant_id = b.id LEFT JOIN users as u ON a.commented_by = u.id WHERE a.owner_comments is NULL and a.restaurant_id in (select c.id from restaurants as c where c.owner = ?) ORDER BY b.name ASC, a.commented_on ASC";
            // @ts-ignore
            const queryInput = [req.userData.uid];
            mysqlQuery(res, query, queryInput, (err: any, row: any) => {
                if (err) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                        message: "Failed to fetch action comments",
                    });
                } else {
                    const dataSet: { actionItems: { id: any; user_rating: any; user_comments: any; commented_by: any; commented_on: any; }[]; }[] = [];
                    let previousId = 0;
                    let currentIndex = -1;
                    if (row && row.length > 0) {
                        row.forEach((r: any) => {
                           if (previousId !== r.restaurant_id) {
                               const obj = {
                                   restaurantId: r.restaurant_id,
                                   restaurantName: r.name,
                                   actionItems: []
                               };
                               dataSet.push(obj);
                               previousId = r.restaurant_id;
                               currentIndex++;
                           }
                           const obj = {
                               id: r.id,
                               user_rating: r.user_rating,
                               user_comments: r.user_comments,
                               commented_by: r.user_name,
                               commented_on: r.commented_on
                           }
                           dataSet[currentIndex].actionItems.push(obj);
                        });
                    }
                    res.status(StatusCodes.OK).json({
                        message: 'Data fetched',
                        details: dataSet
                    });
                }
            });
        }
    };

    static deleteReview: RequestHandler = (req, res, next) => {
        if (SharedFunction.checkValidations(req, res)) {
            const review_id = req.params.reviewId;
            const query = "DELETE FROM restaurant_reviews WHERE id = ?";
            // @ts-ignore
            const queryInput = [review_id];
            mysqlQuery(res, query, queryInput, (err: any, row: any) => {
                if (err) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                        message: "Failed to delete review",
                    });
                } else {
                    res.status(StatusCodes.OK).json({
                        message: 'Review Deleted successfully',
                        details: row
                    });
                }
            });
        }
    };

    static updateReview: RequestHandler = (req, res, next) => {
        if (SharedFunction.checkValidations(req, res)) {
            const reviewId = req.params.reviewId;
            const user_rating = req.body.user_rating;
            const user_comments = req.body.user_comments;
            const owner_comments = req.body.owner_comments;
            const query = "UPDATE restaurant_reviews SET user_rating=?,user_comments=?,owner_comments=? WHERE id = ?";
            // @ts-ignore
            const queryInput = [user_rating, user_comments, owner_comments, reviewId];
            mysqlQuery(res, query, queryInput, (err: any, row: any) => {
                if (err) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                        message: "Failed to update Comments",
                    });
                } else {
                    res.status(StatusCodes.OK).json({
                        message: "Reviews and comments updated !!",
                    });
                }
            });
        }
    };

}
