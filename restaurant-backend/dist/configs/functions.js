"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedFunction = void 0;
const express_validator_1 = require("express-validator");
const http_status_codes_1 = require("http-status-codes");
class SharedFunction {
    static isDevMode() {
        return !(process.env.APP_IN_PRODUCTION === "true");
    }
    static throwInternalServerError(res) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: http_status_codes_1.ReasonPhrases.INTERNAL_SERVER_ERROR,
        });
    }
    static checkValidations(req, res) {
        const errors = express_validator_1.validationResult(req);
        let returnVal = true;
        if (!errors.isEmpty()) {
            returnVal = false;
            const response = {
                message: "Invalid field values"
            };
            if (SharedFunction.isDevMode()) {
                // @ts-ignore
                response.errors = errors.array();
            }
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
        }
        return returnVal;
    }
}
exports.SharedFunction = SharedFunction;
