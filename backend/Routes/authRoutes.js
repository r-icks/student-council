import express from "express";
const router = express.Router();

import rateLimiter from "express-rate-limit";

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many requests from this IP, try again after 15 minutes",
});

import {
  getCurrentUser,
  login,
  logout,
  sendOtp,
} from "../controllers/authController.js";
import authenticateUser from "../middleware/auth.js";

router.route("/otp").post(sendOtp);
router.route("/login").post(login);
router.route("/getCurrentUser").get(authenticateUser, getCurrentUser);
router.route("/logout").get(logout);

// router.route("/register").post(apiLimiter, register);
// router.route("/updateUser").patch(authenticateUser, testUser, updateUser);

export default router;
