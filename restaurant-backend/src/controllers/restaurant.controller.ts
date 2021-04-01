import {RequestHandler, Response} from "express";
import {StatusCodes, ReasonPhrases} from "http-status-codes";
import {appConstants} from "../configs/constants";
import {SharedFunction} from "../configs/functions";
import {FileOperations} from "../middlewares/fileOperations";
import {SqlConnection as mysqlQuery} from "../configs/mysqlConnection";
import {body, param} from "express-validator";

/**
 * Get restaurant by id
 * @param {*} req - request
 * @param {*} res - response
 * @param {*} next - next call back
 */

export class RestaurantController {
    static getRestaurant: RequestHandler = (req, res, next) => {
        if (SharedFunction.checkValidations(req, res)) {
            const restaurantId = req.params.restaurantId;
            const query = "SELECT a.id, a.name, a.address1, a.address2, a.pincode, a.phone, a.website, a.email, a.city, a.owner, a.thumbnail_image, a.banner_image, ROUND(AVG(b.user_rating),0) as user_rating FROM restaurants as a LEFT JOIN restaurant_reviews as b ON a.id = b.restaurant_id where a.id = ?";
            const queryInput = [restaurantId];
            mysqlQuery(res, query, queryInput, (err: any, row: string | any[]) => {
                if (err) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                        message: "Failed to get Restaurant",
                    });
                } else {
                    if (row && row.length > 0) {
                        (row as any[]).map(r => {
                            if (r.thumbnail_image && r.thumbnail_image.length > 0) {
                                r.thumbnail_image = appConstants.s3_URL + r.thumbnail_image;
                            } else {
                                r.thumbnail_image = appConstants.localAssets + 'restaurant-placeholder.png';
                            }
                            if (r.banner_image && r.banner_image.length > 0) {
                                r.banner_image = appConstants.s3_URL + r.banner_image;
                            } else {
                                r.banner_image = appConstants.localAssets + 'banner-placeholder.jpg';
                            }
                            if (!r.user_rating) {
                                r.user_rating = 0;
                            }
                            return r;
                        });
                        res.status(StatusCodes.OK).json({
                            message: "Restaurant fetched successfully",
                            details: row[0],
                        });
                    } else {
                        res.status(StatusCodes.NOT_FOUND).json({
                            message: "Restaurant not found",
                        });
                    }
                }
            });
        }
    };

    static getRestaurantImages: RequestHandler = (req, res, next) => {
        if (SharedFunction.checkValidations(req, res)) {
            const restaurantId = req.params.restaurantId;
            const query = "SELECT id, image_name FROM restaurant_images WHERE restaurant_id = ?";
            const queryInput = [restaurantId];
            mysqlQuery(res, query, queryInput, (err: any, row: string | any[]) => {
                if (err) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                        message: "Failed to get Restaurant",
                    });
                } else {
                    if (row && row.length > 0) {
                        const query1 = "SELECT thumbnail_image, banner_image FROM restaurants WHERE id = ?";
                        mysqlQuery(res, query1, queryInput, (err1: any, row1: string | any[]) => {
                            if (err) {
                                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                                    message: "Failed to get Restaurant",
                                });
                            } else {
                                if (Array.isArray(row) && row.length > 0) {
                                    row = row.map(r => {
                                        r.imagePath = appConstants.s3_URL + r.image_name;
                                        return r;
                                    })
                                    res.status(StatusCodes.OK).json({
                                        message: "Restaurant fetched successfully",
                                        images: row,
                                        mainImage: row1[0]
                                    });
                                }
                            }
                        });
                    } else {
                        res.status(StatusCodes.OK).json({
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
    static getAllRestaurants: RequestHandler = (req, res, next) => {
        if (SharedFunction.checkValidations(req, res)) {
            const query = "SELECT a.id, a.name, a.address1, a.address2, a.city, a.pincode, a.phone, a.website, a.email, a.thumbnail_image, ROUND(AVG(b.user_rating), 0) as user_rating FROM restaurants as a LEFT JOIN restaurant_reviews as b on a.id = b.restaurant_id group by a.id order by user_rating desc, a.name asc";
            mysqlQuery(res, query, [], (err: any, rows: string | any[]) => {
                if (err) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                        message: "Failed to get Restaurants",
                    });
                } else {
                    if (rows && rows.length > 0) {
                        (rows as any[]).map(r => {
                            if (r.thumbnail_image && r.thumbnail_image.length > 0) {
                                r.thumbnail_image = appConstants.s3_URL + r.thumbnail_image;
                            } else {
                                r.thumbnail_image = appConstants.localAssets + 'restaurant-placeholder.png';
                            }
                            if (!r.user_rating) {
                                r.user_rating = 0;
                            }
                            return r;
                        });
                        res.status(StatusCodes.OK).json({
                            message: "Restaurants fetched successfully",
                            details: rows
                        });
                    } else {
                        res.status(StatusCodes.NOT_FOUND).json({
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
    static getRestaurantByRating: RequestHandler = (req, res, next) => {
        if (SharedFunction.checkValidations(req, res)) {
            const rating = req.params.rating;
            const query = "SELECT restaurant_id FROM restaurant_reviews WHERE ROUND(AVG(user_rating), 0) = ? GROUP BY restaurant_id ORDER BY AVG(user_rating) DESC";
            const queryInput = [rating];
            mysqlQuery(res, query, queryInput, (err: any, row: any[] | null) => {
                if (err) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                        message: "Failed to get Restaurant",
                    });
                } else {
                    if (row && row.length > 0) {
                        const query = "SELECT id, name, address1, address2, pincode, website, email, city FROM restaurants WHERE id IN(?)";
                        mysqlQuery(res, query, row, (errRestaurant: any, rowRestaurant: any[]) => {
                            if (errRestaurant) {
                                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                                    message: "Failed to get Restaurants",
                                });
                            } else {
                                const rows: any = [];
                                row.forEach((r, idx) => {
                                    rows.push(rowRestaurant[row[idx] - 1]);
                                });
                                res.status(StatusCodes.OK).json({
                                    message: "Restaurants fetched successfully",
                                    details: rows,
                                });
                            }
                        });
                    } else {
                        res.status(StatusCodes.NOT_FOUND).json({
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
    static newRestaurant: RequestHandler = (req, res, next) => {
        if (SharedFunction.checkValidations(req, res)) {
            const name = req.body.name;
            const address1 = req.body.address1;
            const address2 = req.body.address2;
            const pincode = req.body.pincode;
            const phone = req.body.phone;
            const website = req.body.website;
            const email = req.body.email;
            const city = req.body.city;
            const query =
                "INSERT INTO restaurants(name, address1, address2, pincode, phone, website, email, city, owner) VALUES (?,?,?,?,?,?,?,?,?)";
            // @ts-ignore
            const queryInput = [name, address1, address2, pincode, phone, website, email, city, req.userData.uid];
            mysqlQuery(res, query, queryInput, (err: any, row: any) => {
                if (err) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                        message: "Failed to Save Restaurant",
                    });
                } else {
                    res.status(StatusCodes.CREATED).json({
                        message: "Restaurant Created successfully",
                    });
                }
            });
        }
    };

    static getOwnedRestaurants: RequestHandler = (req, res, next) => {
        const query = "SELECT id, name FROM restaurants WHERE owner = ?";
        // @ts-ignore
        const queryInput = [req.userData.uid];
        mysqlQuery(res, query, queryInput, (err: any, row: any) => {
            if (err) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: "Failed to Save Restaurant",
                });
            } else {
                res.status(StatusCodes.OK).json({
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
    static updateRestaurant: RequestHandler = (req, res, next) => {
        if (SharedFunction.checkValidations(req, res)) {
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
            mysqlQuery(res, query, queryInput, (err: any, row: any) => {
                if (err) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                        message: "Failed to update Restaurant",
                    });
                } else {
                    res.status(StatusCodes.OK).json({
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
    static deleteRestaurant: RequestHandler = (req, res, next) => {
        if (SharedFunction.checkValidations(req, res)) {
            const restaurantId = req.params.restaurantId;
            const query = "SELECT image_name FROM restaurant_images WHERE restaurant_id = ?";
            const queryInput = [restaurantId];
            mysqlQuery(res, query, queryInput, (err: any, rows: any[]) => {
                if (err) {
                    RestaurantController.sendErrorMessage(res, "Failed to perform Action");
                } else {
                    const fileListRows = rows.map((row) => row.image_name);
                    mysqlQuery(res, "DELETE FROM restaurants WHERE id = ?", queryInput, (errRestaurant: any, rowRestaurant: any) => {
                        if (errRestaurant) {
                            RestaurantController.sendErrorMessage(res, "Failed to perform Action");
                        } else {
                            if (fileListRows.length > 0 ) {
                                FileOperations.deleteMultipleFiles(fileListRows, (err, data) => {
                                    if (err) {
                                        console.log(err);
                                        RestaurantController.sendErrorMessage(res, "Failed to perform Action");
                                    } else {
                                        res.status(StatusCodes.OK).json({
                                            message: "Restaurant deleted Successfully",
                                        });
                                    }
                                });
                            } else {
                                res.status(StatusCodes.OK).json({
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
    static uploadImage: RequestHandler = (req, res, next) => {
        if (SharedFunction.checkValidations(req, res)) {
            const restaurantId = req.params.restaurantId;
            FileOperations.uploadFile(req, res, (err: any) => {
                // Check if file has is present in request
                if (err) {
                    if (err.code == "LIMIT_FILE_SIZE") {
                        res.status(StatusCodes.REQUEST_TOO_LONG).json({
                            message: "File Size too long",
                        });
                    } else if (err.code == "INVALID_FILE_TYPE") {
                        res.status(StatusCodes.BAD_REQUEST).json({
                            message: "Invalid file type",
                        });
                    } else {
                        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                            message: ReasonPhrases.INTERNAL_SERVER_ERROR
                        })
                    }
                } else {
                    if (req.files && req.files.length > 0) {
                        if (req.file) {
                            const query = "INSERT INTO restaurant_images(image_name, restaurant_id) VALUES (?,?)"
                            const queryInput = [req.file, restaurantId];
                            // @ts-ignore
                            mysqlQuery(res, query, queryInput, (err1: any, row: any) => {
                                if (err1) {
                                    // @ts-ignore
                                    RestaurantController.deleteFileFn(req.file, res, "Failed to Save File", StatusCodes.INTERNAL_SERVER_ERROR);
                                } else {
                                    res.status(StatusCodes.CREATED).json({
                                        message: "File Saved successfully !",
                                    });
                                }
                            });
                        }
                    } else {
                        res.status(StatusCodes.BAD_REQUEST).json({
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
    static deleteImage: RequestHandler = (req, res, next) => {
        if (SharedFunction.checkValidations(req, res)) {
            const imageId = req.params.imageId;
            const query = "SELECT image_name FROM restaurant_images WHERE id= ?";
            mysqlQuery(res, query, [imageId], (err: any, rows: string | any[]) => {
                if (err) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                        message: "Failed to Delete",
                    });
                } else {
                    if (rows && rows.length > 0) {
                        const query1 = "DELETE FROM restaurant_images WHERE id= ?";
                        mysqlQuery(res, query1, [imageId], (err: any, row: any) => {
                            if (err) {
                                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                                    message: "Failed to Delete",
                                });
                            } else {
                                if (row.affectedRows > 0) {
                                    RestaurantController.deleteFileFn(rows[0].image_name, res, "File Deleted Successfully");
                                }
                            }
                        });
                    } else {
                        res.status(StatusCodes.BAD_REQUEST).json({
                            message: "File not found",
                        });
                    }
                }
            });
        }
    };

    /**
     * Common function to delete file/object from s3 bucket
     * @param {*} key - Object key
     * @param {*} res - response
     * @param {*} message - message to be shown in response
     * @param {*} statusCode - http status code
     */
    static deleteFileFn(key: string, res: Response, message: string, statusCode = StatusCodes.OK) {
        FileOperations.deleteFile(key, (err, data) => {
            if (err) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: "Failed to delete file",
                });
            } else {
                res.status(statusCode).json({
                    message,
                });
            }
        });
    }

    static updateImage: RequestHandler = (req, res, next) => {
        if (SharedFunction.checkValidations(req, res)) {
            const imageId = req.params.imageId;
            const imageType = req.params.type + '_image';
            const restaurantId = req.params.restaurantId;
            if (parseInt(imageId,10) === 0) {
                const query = `UPDATE restaurants SET ${imageType}=NULL WHERE id = ?`;
                mysqlQuery(res, query, [restaurantId], (err: any, rows: any) => {
                    if (err) {
                        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                            message: ReasonPhrases.INTERNAL_SERVER_ERROR,
                        });
                    } else {
                        if (rows.affectedRows > 0) {
                            res.status(StatusCodes.OK).json({
                                message: 'Image updated successfully'
                            });
                        }
                    }
                })
            }
             else {
                const query = 'SELECT image_name FROM restaurant_images WHERE id = ?';
                const queryInput = [imageId];
                mysqlQuery(res, query, queryInput, (err: any, rows: any) => {
                    if (err) {
                        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                            message: ReasonPhrases.INTERNAL_SERVER_ERROR,
                        });
                    } else {
                        if (rows && rows.length === 1) {
                            const query1 = `UPDATE restaurants SET ${imageType}=? WHERE id = ?`;
                            const queryInput1 = [rows[0].image_name, restaurantId];
                            mysqlQuery(res, query1, queryInput1, (err: any, rows: any) => {
                                if (err) {
                                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                                        message: ReasonPhrases.INTERNAL_SERVER_ERROR,
                                    });
                                } else {
                                    if (rows.affectedRows > 0) {
                                        res.status(StatusCodes.OK).json({
                                            message: 'Image updated successfully'
                                        });
                                    }
                                }
                            })
                        }
                    }
                });
            }
        }
    };

    /**
     * Send error message as response
     * @param {*} res - response
     * @param {*} message - error message
     */
    static sendErrorMessage(res: Response, message: string) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message,
        });
    }


}
