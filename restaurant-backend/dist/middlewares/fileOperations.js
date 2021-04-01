"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileOperations = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const multer_1 = require("multer");
const multer_2 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const uuid_1 = __importDefault(require("uuid"));
const constants_1 = require("../configs/constants");
// export type ErrorCodeExtended = 'INVALID_FILE_TYPE'
//
// export class MulterErrorExtended extends MulterError {
//   code: ErrorCodeExtended | ErrorCode;
//   constructor(code: ErrorCode, field?: string) {
//     super(code, field);
//   }
// }
aws_sdk_1.default.config.update(constants_1.appConstants.awsConfig);
const s3 = new aws_sdk_1.default.S3();
class FileOperations {
}
exports.FileOperations = FileOperations;
FileOperations.uploadFile = multer_2.default({
    limits: {
        fileSize: 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
            // @ts-ignore
            cb(new multer_1.MulterError("INVALID_FILE_TYPE"), false);
        }
        else {
            cb(null, true);
        }
    },
    storage: multer_s3_1.default({
        acl: "public-read",
        s3,
        contentType(req, file, cb) {
            cb(null, file.mimetype);
        },
        bucket: process.env.AWS_S3_BUCKET,
        key(req, file, cb) {
            const uuidKey = uuid_1.default.v4();
            const fileExt = file.mimetype == "image/jpeg" ? ".jpg" : ".png";
            // @ts-ignore
            req.file = constants_1.appConstants.assetsImagesFolder + uuidKey + fileExt;
            cb(null, constants_1.appConstants.assetsImagesFolder + uuidKey + fileExt);
        },
    }),
}).array("restaurantImage");
FileOperations.deleteFile = (key, next) => {
    const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
    };
    s3.deleteObject(params, next);
};
FileOperations.deleteMultipleFiles = (keys, next) => {
    const keysObjArr = [];
    keys.forEach(key => {
        keysObjArr.push({ Key: key });
    });
    const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Delete: {
            Objects: keysObjArr,
            Quiet: false,
        },
    };
    s3.deleteObjects(params, next);
};
