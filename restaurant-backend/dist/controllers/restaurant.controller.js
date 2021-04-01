"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantController = void 0;
const http_status_codes_1 = require("http-status-codes");
const constants_1 = require("../configs/constants");
const functions_1 = require("../configs/functions");
const fileOperations_1 = require("../middlewares/fileOperations");
const mysqlConnection_1 = require("../configs/mysqlConnection");
/**
 * Get restaurant by id
 * @param {*} req - request
 * @param {*} res - response
 * @param {*} next - next call back
 */
class RestaurantController {
    /**
     * Common function to delete file/object from s3 bucket
     * @param {*} key - Object key
     * @param {*} res - response
     * @param {*} message - message to be shown in response
     * @param {*} statusCode - http status code
     */
    static deleteFileFn(key, res, message, statusCode = http_status_codes_1.StatusCodes.OK) {
        fileOperations_1.FileOperations.deleteFile(key, (err, data) => {
            if (err) {
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: "Failed to delete file",
                });
            }
            else {
                res.status(statusCode).json({
                    message,
                });
            }
        });
    }
    /**
     * Send error message as response
     * @param {*} res - response
     * @param {*} message - error message
     */
    static sendErrorMessage(res, message) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            message,
        });
    }
}
exports.RestaurantController = RestaurantController;
RestaurantController.getRestaurant = (req, res, next) => {
    if (functions_1.SharedFunction.checkValidations(req, res)) {
        const restaurantId = req.params.restaurantId;
        const query = "SELECT a.id, a.name, a.address1, a.address2, a.pincode, a.phone, a.website, a.email, a.city, a.owner, a.thumbnail_image, a.banner_image, ROUND(AVG(b.user_rating),0) as user_rating FROM restaurants as a LEFT JOIN restaurant_reviews as b ON a.id = b.restaurant_id where a.id = ?";
        const queryInput = [restaurantId];
        mysqlConnection_1.SqlConnection(res, query, queryInput, (err, row) => {
            if (err) {
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: "Failed to get Restaurant",
                });
            }
            else {
                if (row && row.length > 0) {
                    row.map(r => {
                        if (r.thumbnail_image && r.thumbnail_image.length > 0) {
                            r.thumbnail_image = constants_1.appConstants.s3_URL + r.thumbnail_image;
                        }
                        else {
                            r.thumbnail_image = constants_1.appConstants.localAssets + 'restaurant-placeholder.png';
                        }
                        if (r.banner_image && r.banner_image.length > 0) {
                            r.banner_image = constants_1.appConstants.s3_URL + r.banner_image;
                        }
                        else {
                            r.banner_image = constants_1.appConstants.localAssets + 'banner-placeholder.jpg';
                        }
                        if (!r.user_rating) {
                            r.user_rating = 0;
                        }
                        return r;
                    });
                    res.status(http_status_codes_1.StatusCodes.OK).json({
                        message: "Restaurant fetched successfully",
                        details: row[0],
                    });
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                        message: "Restaurant not found",
                    });
                }
            }
        });
    }
};
RestaurantController.getRestaurantImages = (req, res, next) => {
    if (functions_1.SharedFunction.checkValidations(req, res)) {
        const restaurantId = req.params.restaurantId;
        const query = "SELECT id, image_name FROM restaurant_images WHERE restaurant_id = ?";
        const queryInput = [restaurantId];
        mysqlConnection_1.SqlConnection(res, query, queryInput, (err, row) => {
            if (err) {
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: "Failed to get Restaurant",
                });
            }
            else {
                if (row && row.length > 0) {
                    const query1 = "SELECT thumbnail_image, banner_image FROM restaurants WHERE id = ?";
                    mysqlConnection_1.SqlConnection(res, query1, queryInput, (err1, row1) => {
                        if (err) {
                            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                                message: "Failed to get Restaurant",
                            });
                        }
                        else {
                            if (Array.isArray(row) && row.length > 0) {
                                row = row.map(r => {
                                    r.imagePath = constants_1.appConstants.s3_URL + r.image_name;
                                    return r;
                                });
                                res.status(http_status_codes_1.StatusCodes.OK).json({
                                    message: "Restaurant fetched successfully",
                                    images: row,
                                    mainImage: row1[0]
                                });
                            }
                        }
                    });
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.OK).json({
                        message: "No Images found",
                        images: [],
                        mainImage: {}
                    });
                }
            }
        });
    }
};
/**
 * Get all restaurants
 * @param {*} req - request
 * @param {*} res - response
 * @param {*} next - next call back
 */
RestaurantController.getAllRestaurants = (req, res, next) => {
    if (functions_1.SharedFunction.checkValidations(req, res)) {
        const query = "SELECT a.id, a.name, a.address1, a.address2, a.city, a.pincode, a.phone, a.website, a.email, a.thumbnail_image, ROUND(AVG(b.user_rating), 0) as user_rating FROM restaurants as a LEFT JOIN restaurant_reviews as b on a.id = b.restaurant_id group by a.id order by user_rating desc, a.name asc";
        mysqlConnection_1.SqlConnection(res, query, [], (err, rows) => {
            if (err) {
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: "Failed to get Restaurants",
                });
            }
            else {
                if (rows && rows.length > 0) {
                    rows.map(r => {
                        if (r.thumbnail_image && r.thumbnail_image.length > 0) {
                            r.thumbnail_image = constants_1.appConstants.s3_URL + r.thumbnail_image;
                        }
                        else {
                            r.thumbnail_image = constants_1.appConstants.localAssets + 'restaurant-placeholder.png';
                        }
                        if (!r.user_rating) {
                            r.user_rating = 0;
                        }
                        return r;
                    });
                    res.status(http_status_codes_1.StatusCodes.OK).json({
                        message: "Restaurants fetched successfully",
                        details: rows
                    });
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                        message: "No Restaurant found",
                    });
                }
            }
        });
    }
};
/**
 * Get restaurants by filtered rating
 * @param {*} req - request
 * @param {*} res - response
 * @param {*} next - next call back
 */
RestaurantController.getRestaurantByRating = (req, res, next) => {
    if (functions_1.SharedFunction.checkValidations(req, res)) {
        const rating = req.params.rating;
        const query = "SELECT restaurant_id FROM restaurant_reviews WHERE ROUND(AVG(user_rating), 0) = ? GROUP BY restaurant_id ORDER BY AVG(user_rating) DESC";
        const queryInput = [rating];
        mysqlConnection_1.SqlConnection(res, query, queryInput, (err, row) => {
            if (err) {
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: "Failed to get Restaurant",
                });
            }
            else {
                if (row && row.length > 0) {
                    const query = "SELECT id, name, address1, address2, pincode, website, email, city FROM restaurants WHERE id IN(?)";
                    mysqlConnection_1.SqlConnection(res, query, row, (errRestaurant, rowRestaurant) => {
                        if (errRestaurant) {
                            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                                message: "Failed to get Restaurants",
                            });
                        }
                        else {
                            const rows = [];
                            row.forEach((r, idx) => {
                                rows.push(rowRestaurant[row[idx] - 1]);
                            });
                            res.status(http_status_codes_1.StatusCodes.OK).json({
                                message: "Restaurants fetched successfully",
                                details: rows,
                            });
                        }
                    });
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                        message: "No Restaurant found",
                    });
                }
            }
        });
    }
};
/**
 * Create new restaurant
 * @param {*} req - request
 * @param {*} res - response
 * @param {*} next - next call back
 */
RestaurantController.newRestaurant = (req, res, next) => {
    if (functions_1.SharedFunction.checkValidations(req, res)) {
        const name = req.body.name;
        const address1 = req.body.address1;
        const address2 = req.body.address2;
        const pincode = req.body.pincode;
        const phone = req.body.phone;
        const website = req.body.website;
        const email = req.body.email;
        const city = req.body.city;
        const query = "INSERT INTO restaurants(name, address1, address2, pincode, phone, website, email, city, owner) VALUES (?,?,?,?,?,?,?,?,?)";
        // @ts-ignore
        const queryInput = [name, address1, address2, pincode, phone, website, email, city, req.userData.uid];
        mysqlConnection_1.SqlConnection(res, query, queryInput, (err, row) => {
            if (err) {
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: "Failed to Save Restaurant",
                });
            }
            else {
                res.status(http_status_codes_1.StatusCodes.CREATED).json({
                    message: "Restaurant Created successfully",
                });
            }
        });
    }
};
RestaurantController.getOwnedRestaurants = (req, res, next) => {
    const query = "SELECT id, name FROM restaurants WHERE owner = ?";
    // @ts-ignore
    const queryInput = [req.userData.uid];
    mysqlConnection_1.SqlConnection(res, query, queryInput, (err, row) => {
        if (err) {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Failed to Save Restaurant",
            });
        }
        else {
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "Restaurant fetched successfully",
                details: row
            });
        }
    });
};
/**
 * update existing restaurant
 * @param {*} req - request
 * @param {*} res - response
 * @param {*} next - next call back
 */
RestaurantController.updateRestaurant = (req, res, next) => {
    if (functions_1.SharedFunction.checkValidations(req, res)) {
        const restaurantId = req.params.restaurantId;
        const name = req.body.name;
        const address1 = req.body.address1;
        const address2 = req.body.address2;
        const pincode = req.body.pincode;
        const website = req.body.website;
        const email = req.body.email;
        const city = req.body.city;
        const owner = req.body.owner;
        const query = "UPDATE restaurants SET name=?,address1=?,address2=?,pincode=?,website=?,email=?,city=?,owner=? WHERE id = ?";
        const queryInput = [name, address1, address2, pincode, website, email, city, owner, restaurantId];
        mysqlConnection_1.SqlConnection(res, query, queryInput, (err, row) => {
            if (err) {
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: "Failed to update Restaurant",
                });
            }
            else {
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    message: "Restaurant updated successfully",
                });
            }
        });
    }
};
/**
 * Delete Restaurant including reviews and images from cloud server
 * @param {*} req - request
 * @param {*} res - response
 * @param {*} next - next call back
 */
RestaurantController.deleteRestaurant = (req, res, next) => {
    if (functions_1.SharedFunction.checkValidations(req, res)) {
        const restaurantId = req.params.restaurantId;
        const query = "SELECT image_name FROM restaurant_images WHERE restaurant_id = ?";
        const queryInput = [restaurantId];
        mysqlConnection_1.SqlConnection(res, query, queryInput, (err, rows) => {
            if (err) {
                RestaurantController.sendErrorMessage(res, "Failed to perform Action");
            }
            else {
                const fileListRows = rows.map((row) => row.image_name);
                mysqlConnection_1.SqlConnection(res, "DELETE FROM restaurants WHERE id = ?", queryInput, (errRestaurant, rowRestaurant) => {
                    if (errRestaurant) {
                        RestaurantController.sendErrorMessage(res, "Failed to perform Action");
                    }
                    else {
                        if (fileListRows.length > 0) {
                            fileOperations_1.FileOperations.deleteMultipleFiles(fileListRows, (err, data) => {
                                if (err) {
                                    console.log(err);
                                    RestaurantController.sendErrorMessage(res, "Failed to perform Action");
                                }
                                else {
                                    res.status(http_status_codes_1.StatusCodes.OK).json({
                                        message: "Restaurant deleted Successfully",
                                    });
                                }
                            });
                        }
                        else {
                            res.status(http_status_codes_1.StatusCodes.OK).json({
                                message: "Restaurant deleted Successfully",
                            });
                        }
                    }
                });
            }
        });
    }
};
/**
 * Upload restaurant image
 * @param {*} req - request
 * @param {*} res - response
 * @param {*} next - next call back
 */
RestaurantController.uploadImage = (req, res, next) => {
    if (functions_1.SharedFunction.checkValidations(req, res)) {
        const restaurantId = req.params.restaurantId;
        fileOperations_1.FileOperations.uploadFile(req, res, (err) => {
            // Check if file has is present in request
            if (err) {
                if (err.code == "LIMIT_FILE_SIZE") {
                    res.status(http_status_codes_1.StatusCodes.REQUEST_TOO_LONG).json({
                        message: "File Size too long",
                    });
                }
                else if (err.code == "INVALID_FILE_TYPE") {
                    res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                        message: "Invalid file type",
                    });
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        message: http_status_codes_1.ReasonPhrases.INTERNAL_SERVER_ERROR
                    });
                }
            }
            else {
                if (req.files && req.files.length > 0) {
                    if (req.file) {
                        const query = "INSERT INTO restaurant_images(image_name, restaurant_id) VALUES (?,?)";
                        const queryInput = [req.file, restaurantId];
                        // @ts-ignore
                        mysqlConnection_1.SqlConnection(res, query, queryInput, (err1, row) => {
                            if (err1) {
                                // @ts-ignore
                                RestaurantController.deleteFileFn(req.file, res, "Failed to Save File", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
                            }
                            else {
                                res.status(http_status_codes_1.StatusCodes.CREATED).json({
                                    message: "File Saved successfully !",
                                });
                            }
                        });
                    }
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                        message: "Invalid Form fields",
                    });
                }
            }
        });
    }
};
/**
 * Delete rastaurant image
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
RestaurantController.deleteImage = (req, res, next) => {
    if (functions_1.SharedFunction.checkValidations(req, res)) {
        const imageId = req.params.imageId;
        const query = "SELECT image_name FROM restaurant_images WHERE id= ?";
        mysqlConnection_1.SqlConnection(res, query, [imageId], (err, rows) => {
            if (err) {
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: "Failed to Delete",
                });
            }
            else {
                if (rows && rows.length > 0) {
                    const query1 = "DELETE FROM restaurant_images WHERE id= ?";
                    mysqlConnection_1.SqlConnection(res, query1, [imageId], (err, row) => {
                        if (err) {
                            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                                message: "Failed to Delete",
                            });
                        }
                        else {
                            if (row.affectedRows > 0) {
                                RestaurantController.deleteFileFn(rows[0].image_name, res, "File Deleted Successfully");
                            }
                        }
                    });
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                        message: "File not found",
                    });
                }
            }
        });
    }
};
RestaurantController.updateImage = (req, res, next) => {
    if (functions_1.SharedFunction.checkValidations(req, res)) {
        const imageId = req.params.imageId;
        const imageType = req.params.type + '_image';
        const restaurantId = req.params.restaurantId;
        if (parseInt(imageId, 10) === 0) {
            const query = `UPDATE restaurants SET ${imageType}=NULL WHERE id = ?`;
            mysqlConnection_1.SqlConnection(res, query, [restaurantId], (err, rows) => {
                if (err) {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        message: http_status_codes_1.ReasonPhrases.INTERNAL_SERVER_ERROR,
                    });
                }
                else {
                    if (rows.affectedRows > 0) {
                        res.status(http_status_codes_1.StatusCodes.OK).json({
                            message: 'Image updated successfully'
                        });
                    }
                }
            });
        }
        else {
            const query = 'SELECT image_name FROM restaurant_images WHERE id = ?';
            const queryInput = [imageId];
            mysqlConnection_1.SqlConnection(res, query, queryInput, (err, rows) => {
                if (err) {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        message: http_status_codes_1.ReasonPhrases.INTERNAL_SERVER_ERROR,
                    });
                }
                else {
                    if (rows && rows.length === 1) {
                        const query1 = `UPDATE restaurants SET ${imageType}=? WHERE id = ?`;
                        const queryInput1 = [rows[0].image_name, restaurantId];
                        mysqlConnection_1.SqlConnection(res, query1, queryInput1, (err, rows) => {
                            if (err) {
                                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                                    message: http_status_codes_1.ReasonPhrases.INTERNAL_SERVER_ERROR,
                                });
                            }
                            else {
                                if (rows.affectedRows > 0) {
                                    res.status(http_status_codes_1.StatusCodes.OK).json({
                                        message: 'Image updated successfully'
                                    });
                                }
                            }
                        });
                    }
                }
            });
        }
    }
};
