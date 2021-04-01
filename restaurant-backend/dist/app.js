"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: __dirname + '/.env' });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const crypto_1 = __importDefault(require("crypto"));
const user_route_1 = require("./routes/user.route");
const functions_1 = require("./configs/functions");
const restaurant_route_1 = require("./routes/restaurant.route");
const review_route_1 = require("./routes/review.route");
exports.app = express_1.default();
if (!functions_1.SharedFunction.isDevMode()) {
    // @ts-ignore
    process.env.APP_JWT_KEY = crypto_1.default.createHash(process.env.APP_HASH_ALGO).update(Date.now() + process.env.APP_PASSWORD_SALT).digest("hex");
}
exports.app.use(cors_1.default());
exports.app.use(body_parser_1.default.json());
exports.app.use(body_parser_1.default.urlencoded({ extended: false }));
exports.app.use("/", express_1.default.static(path_1.default.join(__dirname, "frontend")));
// app.use("/api/posts", postsRoutes);
exports.app.use("/api", user_route_1.UserRoutes);
exports.app.use("/api/restaurant", restaurant_route_1.RestaurantRoutes);
exports.app.use("/api/review", review_route_1.ReviewRoutes);
exports.app.use((req, res, next) => {
    res.sendFile(path_1.default.join(__dirname, "frontend", "index.html"));
});
