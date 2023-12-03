import express from "express";
import registerController from "../controllers/auth/registerController.js";
import loginController from "../controllers/auth/loginController.js";
import refreshTokenController from "../controllers/auth/refreshTokenContrller.js";
import userController from "../controllers/auth/userController.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", registerController.register);
router.post("/login", loginController.login);
router.get("/me", auth, userController.me);
router.post("/refresh", refreshTokenController.refresh);
router.post("/logout", auth, loginController.logout);

export default router;
