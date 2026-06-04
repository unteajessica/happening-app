import { Router } from "express";
import { login, register, verifyLogin, forgotPassword, resetPassword } from "../controllers/auth.controller";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/verify-login", verifyLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;