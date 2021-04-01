import jwt from "jsonwebtoken";
import crypto from "crypto";
import {StatusCodes, ReasonPhrases} from "http-status-codes";
import {SharedFunction} from "../configs/functions";
import {SqlConnection as mysqlQuery} from "../configs/mysqlConnection";
import {appConstants} from "../configs/constants";
import {RequestHandler} from "express";
import {TokenInterface} from "../middlewares/authentication";

export class UserController {

    /**
     * User login
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    static userLogin: RequestHandler = (req, res, next) => {
        
        if (!SharedFunction.checkValidations(req, res)) {
            
        } 
            const email = req.body.email;
            const password = req.body.password;
            const hashedPassword = crypto
                .createHash(process.env.APP_HASH_ALGO as string)
                .update(password + process.env.APP_PASSWORD_SALT)
                .digest("hex");
            const query = "SELECT * FROM users WHERE email = ? AND password = ? AND is_deleted = 0";
            mysqlQuery(res, query, [email, hashedPassword], (err: any, rows: any) => {
                if (rows && rows.length == 1) {
                    const jwtTokenOptions: TokenInterface = {
                        exp: Math.floor(Date.now() / 1000) + 60 * 60,
                        uid: rows[0].id,
                        entitlement: rows[0].usertype,
                    };
                    res.status(StatusCodes.OK).json({
                        token: jwt.sign(jwtTokenOptions, process.env.APP_JWT_KEY as string),
                    });
                } else {
                    res.status(StatusCodes.UNAUTHORIZED).json({
                        message: "Invalid Credentials",
                    });
                }
            });
    };

    static userLogout: RequestHandler = (req, res, next) => {
        // @ts-ignore
        const token = req.headers.authorization.split(" ")[1];
        appConstants.invalidToken.push(token);
        res.status(StatusCodes.OK).json({
            message: "Logout Successful"
        });
    };

    /**
     * User Sign up
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    static userSignup: RequestHandler = (req, res, next) => {
        if (SharedFunction.checkValidations(req, res)) {
            const email = req.body.email;
            const password = req.body.password;
            const firstname = req.body.firstname;
            const lastname = req.body.lastname;
            const phone = req.body.phone;
            const usertype = req.body.usertype;
            const hashedPassword = crypto
                .createHash(process.env.APP_HASH_ALGO as string)
                .update(password + process.env.APP_PASSWORD_SALT)
                .digest("hex");
            const query = "SELECT * FROM users WHERE email = ?";
            const queryValues = [email];
            mysqlQuery(res, query, queryValues, (err: any, rows: string | any[]) => {
                if (rows && rows.length == 0) {
                    const insertQuery =
                        "INSERT INTO users(email, password, firstname, lastname, phone, usertype) VALUES (?, ?, ?, ?, ?, ?)";
                    const queryValues = [email, hashedPassword, firstname, lastname, phone, usertype];
                    mysqlQuery(res, insertQuery, queryValues, (err: any, response: { [x: string]: number; }) => {
                        if (response.affectedRows > 0) {
                            const jwtTokenOptions: TokenInterface = {
                                exp: Math.floor(Date.now() / 1000) + 60 * 60,
                                uid: response.insertId,
                                entitlement: usertype,
                            };
                            res.status(StatusCodes.OK).json({
                                token: jwt.sign(jwtTokenOptions, process.env.APP_JWT_KEY as string),
                            });
                        } else {
                            res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
                                message: "Failed to save",
                            });
                        }
                    });
                } else {
                    res.status(StatusCodes.BAD_REQUEST).json({
                        message: "User already exists",
                    });
                }
            });
        }
    };

    /**
     * Prevalidate user email during sign up
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    static userPreValidateEmail: RequestHandler = (req, res, next) => {
        if (SharedFunction.checkValidations(req, res)) {
            const email = req.params.email;
            const query = "SELECT * FROM users WHERE email = ?";
            const queryValues = [email];
            mysqlQuery(res, query, queryValues, (err: any, rows: string | any[]) => {
                if (rows && rows.length == 0) {
                    res.status(StatusCodes.OK).json({
                        message: "Email can be registered",
                    });
                } else {
                    res.status(StatusCodes.CONFLICT).json({
                        message: "Email already exists",
                    });
                }
            });
        }
    };

    static userPreValidateEmailEdit: RequestHandler = (req, res, next) => {
        if (SharedFunction.checkValidations(req, res)) {
            const email = req.params.email;
            const userId = req.params.userId;
            const query = "SELECT * FROM users WHERE email = ? AND id != ?";
            const queryValues = [email, userId];
            mysqlQuery(res, query, queryValues, (err: any, rows: string | any[]) => {
                if (rows && rows.length == 0) {
                    res.status(StatusCodes.OK).json({
                        message: "Email can be registered",
                    });
                } else {
                    res.status(StatusCodes.CONFLICT).json({
                        message: "Email already exists",
                    });
                }
            });
        }
    };

    /**
     * Updte existing user
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    static updateUser: RequestHandler = (req, res, next) => {
        if (SharedFunction.checkValidations(req, res)) {
            const userId = req.params.userId;
            const email = req.body.email;
            const password = req.body.password;
            const firstname = req.body.firstname;
            const lastname = req.body.lastname;
            const usertype = req.body.usertype;
            const phone = req.body.phone;
            const querySelect = "SELECT COUNT(id) as count FROM restaurants WHERE owner = ?";
            const queryInputSelect = [userId];
            mysqlQuery(res, querySelect, queryInputSelect, (err: any, rows: any) => {
                if (err) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                        message: ReasonPhrases.INTERNAL_SERVER_ERROR,
                    });
                } else {
                    if (rows) {
                        if (rows[0].count > 0) {
                            res.status(StatusCodes.OK).json({
                                message: "User owns restaurant, Change its ownership and try again",
                            });
                        } else {
                            let hashedPasswordStr = '';
                            let hashedPassword = null;
                            if (password) {
                                hashedPassword = crypto
                                    .createHash(process.env.APP_HASH_ALGO as string)
                                    .update(password + process.env.APP_PASSWORD_SALT)
                                    .digest("hex");
                                hashedPasswordStr = ',password=?'
                            }

                            const query = `UPDATE users SET email=?,firstname=?,lastname=?,phone=?,usertype=?${hashedPasswordStr} WHERE id = ?`;
                            const queryInput = [email, firstname, lastname, phone, usertype];
                            if (hashedPassword) {
                                queryInput.push(hashedPassword);
                            }
                            queryInput.push(userId);
                            mysqlQuery(res, query, queryInput, (err: any, rows: any) => {
                                if (err) {
                                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                                        message: "Failed to update User details",
                                    });
                                } else {
                                    res.status(StatusCodes.OK).json({
                                        message: "User details updated successfully",
                                    });
                                }
                            });
                        }
                    } else {
                        res.status(StatusCodes.OK).json({
                            message: "Failed to fetch details for verification",
                        });
                    }
                }
            });
        }
    };

    static deleteUser: RequestHandler = (req, res, next) => {
        if (SharedFunction.checkValidations(req, res)) {
            const userId = req.params.userId;
            const query = "UPDATE users SET is_deleted = 1 WHERE id = ? AND (SELECT COUNT(id) FROM restaurants WHERE owner = ?) = 0";
            const queryInput = [userId, userId];
            mysqlQuery(res, query, queryInput, (err: any, rows: any) => {
                if (err) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                        message: "Failed to delete User",
                    });
                } else {
                    if (rows.affectedRows > 0) {
                        res.status(StatusCodes.OK).json({
                            message: "User deleted successfully",
                        });
                    } else {
                        res.status(StatusCodes.OK).json({
                            message: "User owns restaurant, Change its ownership and try again",
                        });
                    }
                }
            });
        }
    };

    static getUsers: RequestHandler = (req, res, next) => {
        const query = "SELECT id, concat(firstname, ' ', lastname) as name, usertype FROM users WHERE id != ? AND is_deleted = 0 ORDER BY name ASC";
        // @ts-ignore
        const queryInput = [req.userData.uid];
        mysqlQuery(res, query, queryInput, (err: any, rows: any) => {
            if (err) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: "Failed to fetch users",
                });
            } else {
                res.status(StatusCodes.OK).json({
                    message: "Users fetched Successfully",
                    details: rows
                });
            }
        });
    };

    static getDetailedUser: RequestHandler = (req, res, next) => {
        if (SharedFunction.checkValidations(req, res)) {
            const userId = req.params.userId;
            const query = "SELECT email, firstname, lastname, phone, usertype FROM users WHERE id = ?";
            // @ts-ignore
            const queryInput = [userId];
            mysqlQuery(res, query, queryInput, (err: any, rows: any) => {
                if (err) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                        message: "Failed to fetch user details",
                    });
                } else {
                    res.status(StatusCodes.OK).json({
                        message: "Users fetched Successfully",
                        details: rows
                    });
                }
            });
        }
    };
}
