import {Request, Response} from "express";
import {validationResult} from "express-validator";
import {StatusCodes, ReasonPhrases} from "http-status-codes";

export class SharedFunction {

    static isDevMode(): boolean {
        return !(process.env.APP_IN_PRODUCTION === "true");
    }

    static throwInternalServerError(res: Response): void {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR,
        });
    }

    static checkValidations(req: Request, res: Response): boolean {
        const errors = validationResult(req);
        let returnVal = true;
        if (!errors.isEmpty()) {
            returnVal = false;
            const response = {
                message: "Invalid field values"
            }
            if (SharedFunction.isDevMode()) {
                // @ts-ignore
                response.errors = errors.array()
            }
            res.status(StatusCodes.BAD_REQUEST).json(response);
        }
        return returnVal;
    }
}
