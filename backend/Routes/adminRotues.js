import express from "express";
const router = express.Router();

import rateLimiter from "express-rate-limit";

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many requests from this IP, try again after 15 minutes",
});

import {
  addAccount,
  deleteAccount,
  editAccount,
  getAllAccounts,
} from "../controllers/adminController.js";

router.route("/addAccount").post(addAccount);
router.route("/getAccounts").get(getAllAccounts);
router.route("/editAccount").post(editAccount);
router.route("/deleteAccount").post(deleteAccount);

export default router;
