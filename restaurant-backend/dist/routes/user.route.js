"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const authorization_1 = require("../middlewares/authorization");
const authentication_1 = require("../middlewares/authentication");
const user_validator_1 = require("../validators/user.validator");
exports.UserRoutes = express_1.default.Router();
exports.UserRoutes.post("/signup", user_validator_1.UserValidator.userSignup, user_controller_1.UserController.userSignup);
exports.UserRoutes.post("/login", user_validator_1.UserValidator.userLogin, user_controller_1.UserController.userLogin);
exports.UserRoutes.get("/preValidateEmail/:email", user_validator_1.UserValidator.userEmail, user_controller_1.UserController.userPreValidateEmail);
exports.UserRoutes.get("/preValidateEmailEdit/:userId/:email", user_validator_1.UserValidator.userEmailEdit, authentication_1.Authentication, authorization_1.Authorization.isAdmin, user_controller_1.UserController.userPreValidateEmailEdit);
exports.UserRoutes.get("/logout", authentication_1.Authentication, user_controller_1.UserController.userLogout);
exports.UserRoutes.put("/user/:userId", authentication_1.Authentication, user_validator_1.UserValidator.updateUser, authorization_1.Authorization.isAdmin, user_controller_1.UserController.updateUser);
exports.UserRoutes.delete("/user/:userId", authentication_1.Authentication, user_validator_1.UserValidator.deleteUser, authorization_1.Authorization.isAdmin, user_controller_1.UserController.deleteUser);
exports.UserRoutes.get("/user/getUsers", authentication_1.Authentication, authorization_1.Authorization.isAdmin, user_controller_1.UserController.getUsers);
exports.UserRoutes.get("/user/getDetailedUser/:userId", authentication_1.Authentication, user_validator_1.UserValidator.getDetailedUser, authorization_1.Authorization.isAdmin, user_controller_1.UserController.getDetailedUser);
