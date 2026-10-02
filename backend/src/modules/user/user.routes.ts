import { Router } from "express";
import * as userController from "./user.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validateBodyMiddleware } from "../../middlewares/validateBody.middleware.js";

const router = Router();

router.get("/", authMiddleware, userController.listUsers);

router.post(
    "/register",
    validateBodyMiddleware(["nombre", "email", "password"]),
    userController.register
);

router.post("/login", 
    validateBodyMiddleware(["email", "password"]),
    userController.login
);

export default router;