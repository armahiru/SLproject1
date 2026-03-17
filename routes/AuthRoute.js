import express from "express";
import { register, login, forgotPassword, resetPassword, verifyEmail, resendVerification, changePassword } from "../controller/AuthController.js";
import authMiddleware from "../middleware/AuthStudent.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/verify-email", verifyEmail);
authRouter.post("/resend-verification", resendVerification);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/change-password", authMiddleware, changePassword);

export default authRouter;

