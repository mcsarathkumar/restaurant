import mysql from "mysql";
import {Response} from "express";
import {SharedFunction} from "./functions";
import {ReasonPhrases, StatusCodes} from "http-status-codes";

export const SqlConnection = (res: Response, sql: string, values: string[] | null, next: any) => {
    // It means that the values hasnt been passed
    // @ts-ignore
    if (arguments.length === 2) {
        next = values;
        values = null;
    }
    let isConnectionEstablished = true;
    try {
        const connection = mysql.createConnection({
            host: SharedFunction.isDevMode() ? process.env.APP_MYSQL_HOST : process.env.APP_PROD_MYSQL_HOST,
            user: SharedFunction.isDevMode() ? process.env.APP_MYSQL_USERNAME : process.env.APP_PROD_MYSQL_USERNAME,
            password: SharedFunction.isDevMode() ? process.env.APP_MYSQL_PASSWORD : process.env.APP_PROD_MYSQL_PASSWORD,
            database: SharedFunction.isDevMode() ? process.env.APP_MYSQL_DATABASE : process.env.APP_PROD_MYSQL_DATABASE,
        });
        connection.connect(function (err) {
            if (err) {
                isConnectionEstablished = false;
                console.log(err.code);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: ReasonPhrases.INTERNAL_SERVER_ERROR
                });
            }
        });
        connection.query(sql, values, function (err) {
            connection.end(); // close the connection
            if (isConnectionEstablished) {
                if (err) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                        message: ReasonPhrases.INTERNAL_SERVER_ERROR
                    });
                }
                // @ts-ignore
                next.apply(this, arguments);
            }
        });
    } catch (error) {
        console.log(error);
    }
}
