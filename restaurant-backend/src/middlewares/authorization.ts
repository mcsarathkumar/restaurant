import {StatusCodes, ReasonPhrases} from "http-status-codes";
import {appConstants} from "../configs/constants";
import {SqlConnection as mysqlQuery} from "../configs/mysqlConnection";
import {RequestHandler} from "express";

export class Authorization {

    static isAuthorizedPerson: RequestHandler = (req, res, next) => {
        const restaurantId = req.params.restaurantId;
        // @ts-ignore
        if (req.userData && req.userData.entitlement == appConstants.userRole.OWNER) {
            const query = "SELECT * FROM restaurants WHERE id = ? AND owner = ?";
            // @ts-ignore
            const queryInput = [restaurantId, req.userData.uid];
            mysqlQuery(res, query, queryInput, (err: any, rows: any) => {
                if (rows && rows.length == 1) {
                    next();
                } else {
                    res.status(StatusCodes.UNAUTHORIZED).json({
                        message: ReasonPhrases.UNAUTHORIZED
                    });
                }
            });
        } else {
            res.status(StatusCodes.UNAUTHORIZED).json({
                message: ReasonPhrases.UNAUTHORIZED,
            });
        }
    };

    static isAuthorizedPersonOrAdmin: RequestHandler = (req, res, next) => {
        const restaurantId = req.params.restaurantId;
        // @ts-ignore
        if (req.userData && req.userData.entitlement == appConstants.userRole.ADMIN) {
            next();
            // @ts-ignore
        } else if (req.userData && req.userData.entitlement == appConstants.userRole.OWNER) {
            const query = "SELECT * FROM restaurants WHERE id = ? AND owner = ?";
            // @ts-ignore
            const queryInput = [restaurantId, req.userData.uid];
            mysqlQuery(res, query, queryInput, (err: any, rows: { lenght: number; }) => {
                if (rows && rows.lenght == 1) {
                    next();
                } else {
                    res.status(StatusCodes.UNAUTHORIZED).json({
                        message: ReasonPhrases.UNAUTHORIZED,
                    });
                }
            });
        } else {
            res.status(StatusCodes.UNAUTHORIZED).json({
                message: ReasonPhrases.UNAUTHORIZED,
            });
        }
    };

    static isAdmin: RequestHandler = (req, res, next) => {
        // @ts-ignore
        if (req.userData.entitlement == appConstants.userRole.ADMIN) {
            next();
        } else {
            res.status(StatusCodes.UNAUTHORIZED).json({
                message: ReasonPhrases.UNAUTHORIZED,
            });
        }
    };

    static hasOwnerEntitlement: RequestHandler = (req, res, next) => {
        // @ts-ignore
        if (req.userData.entitlement == appConstants.userRole.OWNER) {
            next();
        } else {
            res.status(StatusCodes.UNAUTHORIZED).json({
                message: ReasonPhrases.UNAUTHORIZED,
            });
        }
    };

    static isCustomer: RequestHandler = (req, res, next) => {
        // @ts-ignore
        if (req.userData && req.userData.entitlement == appConstants.userRole.CUSTOMER) {
            next();
        } else {
            res.status(StatusCodes.UNAUTHORIZED).json({
                message: ReasonPhrases.UNAUTHORIZED,
            });
        }
    };
}
