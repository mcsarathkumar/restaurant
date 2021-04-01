import express from "express";
import {UserController} from "../controllers/user.controller";
import {Authorization} from "../middlewares/authorization";
import {Authentication} from "../middlewares/authentication";
import {UserValidator} from "../validators/user.validator";

export const UserRoutes = express.Router();

UserRoutes.post("/signup", UserValidator.userSignup, UserController.userSignup);

UserRoutes.post("/login", UserValidator.userLogin, UserController.userLogin);

UserRoutes.get(
    "/preValidateEmail/:email",
    UserValidator.userEmail,
    UserController.userPreValidateEmail
);

UserRoutes.get(
    "/preValidateEmailEdit/:userId/:email",
    UserValidator.userEmailEdit,
    Authentication,
    Authorization.isAdmin,
    UserController.userPreValidateEmailEdit
);


UserRoutes.get("/logout", Authentication, UserController.userLogout);

UserRoutes.put("/user/:userId", Authentication, UserValidator.updateUser, Authorization.isAdmin, UserController.updateUser);

UserRoutes.delete("/user/:userId", Authentication, UserValidator.deleteUser, Authorization.isAdmin, UserController.deleteUser);

UserRoutes.get("/user/getUsers", Authentication, Authorization.isAdmin, UserController.getUsers);

UserRoutes.get("/user/getDetailedUser/:userId", Authentication, UserValidator.getDetailedUser, Authorization.isAdmin, UserController.getDetailedUser);


