"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authentication = void 0;
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../configs/constants");
const Authentication = (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            if (constants_1.appConstants.invalidToken.includes(token)) {
                res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                    message: http_status_codes_1.ReasonPhrases.UNAUTHORIZED,
                });
            }
            else {
                const decodedToken = jsonwebtoken_1.default.verify(token, process.env.APP_JWT_KEY);
                // @ts-ignore
                req.userData = {
                    uid: decodedToken.uid,
                    entitlement: decodedToken.entitlement,
                };
                next();
            }
        }
        else {
            res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ message: http_status_codes_1.ReasonPhrases.UNAUTHORIZED });
        }
    }
    catch (error) {
        console.log(error.message);
        res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ message: http_status_codes_1.ReasonPhrases.UNAUTHORIZED });
    }
};
exports.Authentication = Authentication;
