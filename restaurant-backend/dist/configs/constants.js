"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConstants = void 0;
exports.appConstants = {
    userRole: {
        ADMIN: "admin",
        OWNER: "owner",
        CUSTOMER: "customer",
    },
    assetsImagesFolder: "assets/images/",
    awsConfig: {
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        region: process.env.AWS_REGION,
    },
    invalidToken: []
};
exports.appConstants.s3_URL = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/`;
// appConstants.s3_URL = `/assets/`;
exports.appConstants.localAssets = `/assets/`;
