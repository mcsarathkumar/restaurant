"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authorization = void 0;
const http_status_codes_1 = require("http-status-codes");
const constants_1 = require("../configs/constants");
const mysqlConnection_1 = require("../configs/mysqlConnection");
class Authorization {
}
exports.Authorization = Authorization;
Authorization.isAuthorizedPerson = (req, res, next) => {
    const restaurantId = req.params.restaurantId;
    // @ts-ignore
    if (req.userData && req.userData.entitlement == constants_1.appConstants.userRole.OWNER) {
        const query = "SELECT * FROM restaurants WHERE id = ? AND owner = ?";
        // @ts-ignore
        const queryInput = [restaurantId, req.userData.uid];
        mysqlConnection_1.SqlConnection(res, query, queryInput, (err, rows) => {
            if (rows && rows.length == 1) {
                next();
            }
            else {
                res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                    message: http_status_codes_1.ReasonPhrases.UNAUTHORIZED
                });
            }
        });
    }
    else {
        res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
            message: http_status_codes_1.ReasonPhrases.UNAUTHORIZED,
        });
    }
};
Authorization.isAuthorizedPersonOrAdmin = (req, res, next) => {
    const restaurantId = req.params.restaurantId;
    // @ts-ignore
    if (req.userData && req.userData.entitlement == constants_1.appConstants.userRole.ADMIN) {
        next();
        // @ts-ignore
    }
    else if (req.userData && req.userData.entitlement == constants_1.appConstants.userRole.OWNER) {
        const query = "SELECT * FROM restaurants WHERE id = ? AND owner = ?";
        // @ts-ignore
        const queryInput = [restaurantId, req.userData.uid];
        mysqlConnection_1.SqlConnection(res, query, queryInput, (err, rows) => {
            if (rows && rows.lenght == 1) {
                next();
            }
            else {
                res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                    message: http_status_codes_1.ReasonPhrases.UNAUTHORIZED,
                });
            }
        });
    }
    else {
        res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
            message: http_status_codes_1.ReasonPhrases.UNAUTHORIZED,
        });
    }
};
Authorization.isAdmin = (req, res, next) => {
    // @ts-ignore
    if (req.userData.entitlement == constants_1.appConstants.userRole.ADMIN) {
        next();
    }
    else {
        res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
            message: http_status_codes_1.ReasonPhrases.UNAUTHORIZED,
        });
    }
};
Authorization.hasOwnerEntitlement = (req, res, next) => {
    // @ts-ignore
    if (req.userData.entitlement == constants_1.appConstants.userRole.OWNER) {
        next();
    }
    else {
        res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
            message: http_status_codes_1.ReasonPhrases.UNAUTHORIZED,
        });
    }
};
Authorization.isCustomer = (req, res, next) => {
    // @ts-ignore
    if (req.userData && req.userData.entitlement == constants_1.appConstants.userRole.CUSTOMER) {
        next();
    }
    else {
        res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
            message: http_status_codes_1.ReasonPhrases.UNAUTHORIZED,
        });
    }
};
