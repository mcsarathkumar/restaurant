import aws, {AWSError} from "aws-sdk";
import {MulterError, ErrorCode} from "multer";
import multer from "multer";
import multerS3 from "multer-s3";
import uuid from "uuid";
import {appConstants} from "../configs/constants";
import {
    DeleteObjectOutput,
    DeleteObjectRequest,
    DeleteObjectsOutput,
    DeleteObjectsRequest,
    ObjectIdentifierList
} from "aws-sdk/clients/s3";


// export type ErrorCodeExtended = 'INVALID_FILE_TYPE'
//
// export class MulterErrorExtended extends MulterError {
//   code: ErrorCodeExtended | ErrorCode;
//   constructor(code: ErrorCode, field?: string) {
//     super(code, field);
//   }
// }

aws.config.update(appConstants.awsConfig);
const s3 = new aws.S3();

export class FileOperations {
    static uploadFile = multer({
        limits: {
            fileSize: 1024 * 1024,
        },
        fileFilter: (req, file, cb) => {
            if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
                // @ts-ignore
                cb(new MulterError("INVALID_FILE_TYPE"), false);
            } else {
                cb(null, true);
            }
        },
        storage: multerS3({
            acl: "public-read",
            s3,
            contentType(req, file, cb) {
                cb(null, file.mimetype);
            },
            bucket: process.env.AWS_S3_BUCKET as string,
            key(req, file, cb) {
                const uuidKey = uuid.v4();
                const fileExt = file.mimetype == "image/jpeg" ? ".jpg" : ".png";
                // @ts-ignore
                req.file = appConstants.assetsImagesFolder + uuidKey + fileExt;
                cb(null, appConstants.assetsImagesFolder + uuidKey + fileExt);
            },
        }),
    }).array("restaurantImage");

    static deleteFile = (key: string, next: (err: AWSError, data: DeleteObjectOutput) => void) => {
        const params: DeleteObjectRequest = {
            Bucket: process.env.AWS_S3_BUCKET as string,
            Key: key,
        };
        s3.deleteObject(params, next);
    };

    static deleteMultipleFiles = (keys: string[], next: (err: AWSError, data: DeleteObjectsOutput) => void) => {
        const keysObjArr: ObjectIdentifierList = [];
        keys.forEach(key => {
            keysObjArr.push({Key: key});
        });
        const params: DeleteObjectsRequest = {
            Bucket: process.env.AWS_S3_BUCKET as string,
            Delete: {
                Objects: keysObjArr,
                Quiet: false,
            },
        };
        s3.deleteObjects(params, next);
    };
}

