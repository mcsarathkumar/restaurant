import {StatusCodes, ReasonPhrases} from "http-status-codes";
import jwt from "jsonwebtoken";
import {appConstants} from "../configs/constants";
import {RequestHandler} from "express";

export interface TokenInterface {
    exp: string | number;
    uid: string | number;
    entitlement: string;
}

export const Authentication: RequestHandler = (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            if (appConstants.invalidToken.includes(token)) {
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: ReasonPhrases.UNAUTHORIZED,
                });
            } else {
                const decodedToken = jwt.verify(token, process.env.APP_JWT_KEY as string) as TokenInterface;
                // @ts-ignore
                req.userData = {
                    uid: decodedToken.uid,
                    entitlement: decodedToken.entitlement,
                };
                next();
            }
        } else {
            res.status(StatusCodes.UNAUTHORIZED).json({message: ReasonPhrases.UNAUTHORIZED});
        }
    } catch (error) {
        console.log(error.message);
        res.status(StatusCodes.UNAUTHORIZED).json({message: ReasonPhrases.UNAUTHORIZED});
    }
};
