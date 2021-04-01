"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const http_status_codes_1 = require("http-status-codes");
const functions_1 = require("../configs/functions");
const mysqlConnection_1 = require("../configs/mysqlConnection");
const constants_1 = require("../configs/constants");
class UserController {
}
exports.UserController = UserController;
/**
 * User login
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
UserController.userLogin = (req, res, next) => {
    if (functions_1.SharedFunction.checkValidations(req, res)) {
        const email = req.body.email;
        const password = req.body.password;
        const hashedPassword = crypto_1.default
            .createHash(process.env.APP_HASH_ALGO)
            .update(password + process.env.APP_PASSWORD_SALT)
            .digest("hex");
        const query = "SELECT * FROM users WHERE email = ? AND password = ? AND is_deleted = 0";
        mysqlConnection_1.SqlConnection(res, query, [email, hashedPassword], (err, rows) => {
            if (rows && rows.length == 1) {
                const jwtTokenOptions = {
                    exp: Math.floor(Date.now() / 1000) + 60 * 60,
                    uid: rows[0].id,
                    entitlement: rows[0].usertype,
                };
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    token: jsonwebtoken_1.default.sign(jwtTokenOptions, process.env.APP_JWT_KEY),
                });
            }
            else {
                res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                    message: "Invalid Credentials",
                });
            }
        });
    }
};
UserController.userLogout = (req, res, next) => {
    // @ts-ignore
    const token = req.headers.authorization.split(" ")[1];
    constants_1.appConstants.invalidToken.push(token);
    res.status(http_status_codes_1.StatusCodes.OK).json({
        message: "Logout Successful"
    });
};
/**
 * User Sign up
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
UserController.userSignup = (req, res, next) => {
    if (functions_1.SharedFunction.checkValidations(req, res)) {
        const email = req.body.email;
        const password = req.body.password;
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const phone = req.body.phone;
        const usertype = req.body.usertype;
        const hashedPassword = crypto_1.default
            .createHash(process.env.APP_HASH_ALGO)
            .update(password + process.env.APP_PASSWORD_SALT)
            .digest("hex");
        const query = "SELECT * FROM users WHERE email = ?";
        const queryValues = [email];
        mysqlConnection_1.SqlConnection(res, query, queryValues, (err, rows) => {
            if (rows && rows.length == 0) {
                const insertQuery = "INSERT INTO users(email, password, firstname, lastname, phone, usertype) VALUES (?, ?, ?, ?, ?, ?)";
                const queryValues = [email, hashedPassword, firstname, lastname, phone, usertype];
                mysqlConnection_1.SqlConnection(res, insertQuery, queryValues, (err, response) => {
                    if (response.affectedRows > 0) {
                        const jwtTokenOptions = {
                            exp: Math.floor(Date.now() / 1000) + 60 * 60,
                            uid: response.insertId,
                            entitlement: usertype,
                        };
                        res.status(http_status_codes_1.StatusCodes.OK).json({
                            token: jsonwebtoken_1.default.sign(jwtTokenOptions, process.env.APP_JWT_KEY),
                        });
                    }
                    else {
                        res.status(http_status_codes_1.StatusCodes.SERVICE_UNAVAILABLE).json({
                            message: "Failed to save",
                        });
                    }
                });
            }
            else {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
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
UserController.userPreValidateEmail = (req, res, next) => {
    if (functions_1.SharedFunction.checkValidations(req, res)) {
        const email = req.params.email;
        const query = "SELECT * FROM users WHERE email = ?";
        const queryValues = [email];
        mysqlConnection_1.SqlConnection(res, query, queryValues, (err, rows) => {
            if (rows && rows.length == 0) {
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    message: "Email can be registered",
                });
            }
            else {
                res.status(http_status_codes_1.StatusCodes.CONFLICT).json({
                    message: "Email already exists",
                });
            }
        });
    }
};
UserController.userPreValidateEmailEdit = (req, res, next) => {
    if (functions_1.SharedFunction.checkValidations(req, res)) {
        const email = req.params.email;
        const userId = req.params.userId;
        const query = "SELECT * FROM users WHERE email = ? AND id != ?";
        const queryValues = [email, userId];
        mysqlConnection_1.SqlConnection(res, query, queryValues, (err, rows) => {
            if (rows && rows.length == 0) {
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    message: "Email can be registered",
                });
            }
            else {
                res.status(http_status_codes_1.StatusCodes.CONFLICT).json({
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
UserController.updateUser = (req, res, next) => {
    if (functions_1.SharedFunction.checkValidations(req, res)) {
        const userId = req.params.userId;
        const email = req.body.email;
        const password = req.body.password;
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const usertype = req.body.usertype;
        const phone = req.body.phone;
        const querySelect = "SELECT COUNT(id) as count FROM restaurants WHERE owner = ?";
        const queryInputSelect = [userId];
        mysqlConnection_1.SqlConnection(res, querySelect, queryInputSelect, (err, rows) => {
            if (err) {
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: http_status_codes_1.ReasonPhrases.INTERNAL_SERVER_ERROR,
                });
            }
            else {
                if (rows) {
                    if (rows[0].count > 0) {
                        res.status(http_status_codes_1.StatusCodes.OK).json({
                            message: "User owns restaurant, Change its ownership and try again",
                        });
                    }
                    else {
                        let hashedPasswordStr = '';
                        let hashedPassword = null;
                        if (password) {
                            hashedPassword = crypto_1.default
                                .createHash(process.env.APP_HASH_ALGO)
                                .update(password + process.env.APP_PASSWORD_SALT)
                                .digest("hex");
                            hashedPasswordStr = ',password=?';
                        }
                        const query = `UPDATE users SET email=?,firstname=?,lastname=?,phone=?,usertype=?${hashedPasswordStr} WHERE id = ?`;
                        const queryInput = [email, firstname, lastname, phone, usertype];
                        if (hashedPassword) {
                            queryInput.push(hashedPassword);
                        }
                        queryInput.push(userId);
                        mysqlConnection_1.SqlConnection(res, query, queryInput, (err, rows) => {
                            if (err) {
                                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                                    message: "Failed to update User details",
                                });
                            }
                            else {
                                res.status(http_status_codes_1.StatusCodes.OK).json({
                                    message: "User details updated successfully",
                                });
                            }
                        });
                    }
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.OK).json({
                        message: "Failed to fetch details for verification",
                    });
                }
            }
        });
    }
};
UserController.deleteUser = (req, res, next) => {
    if (functions_1.SharedFunction.checkValidations(req, res)) {
        const userId = req.params.userId;
        const query = "UPDATE users SET is_deleted = 1 WHERE id = ? AND (SELECT COUNT(id) FROM restaurants WHERE owner = ?) = 0";
        const queryInput = [userId, userId];
        mysqlConnection_1.SqlConnection(res, query, queryInput, (err, rows) => {
            if (err) {
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: "Failed to delete User",
                });
            }
            else {
                if (rows.affectedRows > 0) {
                    res.status(http_status_codes_1.StatusCodes.OK).json({
                        message: "User deleted successfully",
                    });
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.OK).json({
                        message: "User owns restaurant, Change its ownership and try again",
                    });
                }
            }
        });
    }
};
UserController.getUsers = (req, res, next) => {
    const query = "SELECT id, concat(firstname, ' ', lastname) as name, usertype FROM users WHERE id != ? AND is_deleted = 0 ORDER BY name ASC";
    // @ts-ignore
    const queryInput = [req.userData.uid];
    mysqlConnection_1.SqlConnection(res, query, queryInput, (err, rows) => {
        if (err) {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Failed to fetch users",
            });
        }
        else {
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "Users fetched Successfully",
                details: rows
            });
        }
    });
};
UserController.getDetailedUser = (req, res, next) => {
    if (functions_1.SharedFunction.checkValidations(req, res)) {
        const userId = req.params.userId;
        const query = "SELECT email, firstname, lastname, phone, usertype FROM users WHERE id = ?";
        // @ts-ignore
        const queryInput = [userId];
        mysqlConnection_1.SqlConnection(res, query, queryInput, (err, rows) => {
            if (err) {
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: "Failed to fetch user details",
                });
            }
            else {
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    message: "Users fetched Successfully",
                    details: rows
                });
            }
        });
    }
};
