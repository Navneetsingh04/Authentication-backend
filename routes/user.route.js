import express from "express";
import {
  forgotPassword,
  getuser,
  login,
  logout,
  register,
  resetPassword,
  verifyOtp,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/register", register);
router.post("/otp-verification", verifyOtp);
router.post("/login", login);
router.post("/logout", isAuthenticated, logout);
router.get("/me", isAuthenticated, getuser);
router.post("/password/reset", forgotPassword);
router.put("/password/reset/:token", resetPassword);

export default router;
