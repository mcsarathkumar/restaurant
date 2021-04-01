import {body, header, query, param} from "express-validator";
import {appConstants} from "../configs/constants";

export const UserValidator = {
    userLogin: [
        body("email").isEmail().normalizeEmail(),
        body("password").isLength({min: 4}).trim(),
    ],
    userSignup: [
        body("email").isEmail().normalizeEmail(),
        body("password").isLength({min: 4}).trim(),
        body("firstname").isString().trim(),
        body("lastname").isString().trim(),
        body("usertype").isString().trim(),
        body("phone").isLength({min: 10, max: 10}).toInt(),
        body("usertype").isIn([appConstants.userRole.OWNER, appConstants.userRole.CUSTOMER, appConstants.userRole.ADMIN])
    ],
    userEmail: [
        param("email").isEmail().normalizeEmail()
    ],
    userEmailEdit: [
        param("email").isEmail().normalizeEmail(),
        param("userId").isInt().toInt()
    ],
    updateUser: [
        param("userId").isInt().toInt(),
        body("email").isEmail().normalizeEmail(),
        body("password").optional().isString().trim(),
        body("firstname").isString().trim(),
        body("lastname").isString().trim(),
        body("usertype").isString().trim(),
        body("phone").isLength({min: 10, max: 10}).toInt(),
        body("usertype").isIn([appConstants.userRole.OWNER, appConstants.userRole.CUSTOMER, appConstants.userRole.ADMIN])
    ],
    deleteUser: [
        param("userId").isInt().toInt()
    ],
    setUserPermission: [
        param("userId").isInt().toInt(),
        param("usertype").isIn([appConstants.userRole.OWNER, appConstants.userRole.CUSTOMER, appConstants.userRole.ADMIN])
    ],
    getDetailedUser: [
        param("userId").isInt().toInt()
    ]
};
