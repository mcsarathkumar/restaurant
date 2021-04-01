"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqlConnection = void 0;
const mysql_1 = __importDefault(require("mysql"));
const functions_1 = require("./functions");
const http_status_codes_1 = require("http-status-codes");
const SqlConnection = (res, sql, values, next) => {
    // It means that the values hasnt been passed
    // @ts-ignore
    if (arguments.length === 2) {
        next = values;
        values = null;
    }
    let isConnectionEstablished = true;
    try {
        const connection = mysql_1.default.createConnection({
            host: functions_1.SharedFunction.isDevMode() ? process.env.APP_MYSQL_HOST : process.env.APP_PROD_MYSQL_HOST,
            user: functions_1.SharedFunction.isDevMode() ? process.env.APP_MYSQL_USERNAME : process.env.APP_PROD_MYSQL_USERNAME,
            password: functions_1.SharedFunction.isDevMode() ? process.env.APP_MYSQL_PASSWORD : process.env.APP_PROD_MYSQL_PASSWORD,
            database: functions_1.SharedFunction.isDevMode() ? process.env.APP_MYSQL_DATABASE : process.env.APP_PROD_MYSQL_DATABASE,
        });
        connection.connect(function (err) {
            if (err) {
                isConnectionEstablished = false;
                console.log(err.code);
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: http_status_codes_1.ReasonPhrases.INTERNAL_SERVER_ERROR
                });
            }
        });
        connection.query(sql, values, function (err) {
            connection.end(); // close the connection
            if (isConnectionEstablished) {
                if (err) {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        message: http_status_codes_1.ReasonPhrases.INTERNAL_SERVER_ERROR
                    });
                }
                // @ts-ignore
                next.apply(this, arguments);
            }
        });
    }
    catch (error) {
        console.log(error);
    }
};
exports.SqlConnection = SqlConnection;
