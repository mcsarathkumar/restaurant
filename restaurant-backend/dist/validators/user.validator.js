"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidator = void 0;
const express_validator_1 = require("express-validator");
const constants_1 = require("../configs/constants");
exports.UserValidator = {
    userLogin: [
        express_validator_1.body("email").isEmail().normalizeEmail(),
        express_validator_1.body("password").isLength({ min: 4 }).trim(),
    ],
    userSignup: [
        express_validator_1.body("email").isEmail().normalizeEmail(),
        express_validator_1.body("password").isLength({ min: 4 }).trim(),
        express_validator_1.body("firstname").isString().trim(),
        express_validator_1.body("lastname").isString().trim(),
        express_validator_1.body("usertype").isString().trim(),
        express_validator_1.body("phone").isLength({ min: 10, max: 10 }).toInt(),
        express_validator_1.body("usertype").isIn([constants_1.appConstants.userRole.OWNER, constants_1.appConstants.userRole.CUSTOMER, constants_1.appConstants.userRole.ADMIN])
    ],
    userEmail: [
        express_validator_1.param("email").isEmail().normalizeEmail()
    ],
    userEmailEdit: [
        express_validator_1.param("email").isEmail().normalizeEmail(),
        express_validator_1.param("userId").isInt().toInt()
    ],
    updateUser: [
        express_validator_1.param("userId").isInt().toInt(),
        express_validator_1.body("email").isEmail().normalizeEmail(),
        express_validator_1.body("password").optional().isString().trim(),
        express_validator_1.body("firstname").isString().trim(),
        express_validator_1.body("lastname").isString().trim(),
        express_validator_1.body("usertype").isString().trim(),
        express_validator_1.body("phone").isLength({ min: 10, max: 10 }).toInt(),
        express_validator_1.body("usertype").isIn([constants_1.appConstants.userRole.OWNER, constants_1.appConstants.userRole.CUSTOMER, constants_1.appConstants.userRole.ADMIN])
    ],
    deleteUser: [
        express_validator_1.param("userId").isInt().toInt()
    ],
    setUserPermission: [
        express_validator_1.param("userId").isInt().toInt(),
        express_validator_1.param("usertype").isIn([constants_1.appConstants.userRole.OWNER, constants_1.appConstants.userRole.CUSTOMER, constants_1.appConstants.userRole.ADMIN])
    ],
    getDetailedUser: [
        express_validator_1.param("userId").isInt().toInt()
    ]
};
