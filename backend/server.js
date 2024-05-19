import express from "express";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();

import "express-async-errors";

import connectDB from "./db/connect.js";

import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";

//router
import authRouter from "./Routes/authRoutes.js";
import adminRouter from "./Routes/adminRotues.js";
import clubRouter from "./Routes/clubRoutes.js";
import publicRouter from "./Routes/publicRoute.js";

//middleware
import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import User from "./models/User.js";

import morgan from "morgan";
import auth from "./middleware/auth.js";
import adminAuth from "./middleware/admin-auth.js";
import clubAuth from "./middleware/club-auth.js";

const app = express();
app.use(express.json());

if (process.env.NODE_ENV !== "PRODUCTION") {
  app.use(morgan("dev"));
}

const PORT = process.env.PORT;
const DEPLOYMENT = process.env.DEPLOYMENT;

const productionWhitelist = [];

const localWhitelist = [
  "http://127.0.0.1:8080",
  "http://127.0.0.1:3000",
  "http://localhost:8080",
  "http://localhost:3000",
];

const corsOptions = {
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "X-Access-Token",
    "Authorization",
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Credentials",
    "Access-Control-Allow-Headers",
    "x-csrf-token",
  ],
  origin: DEPLOYMENT === "LOCAL" ? localWhitelist : productionWhitelist,
  credentials: true,
  methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
};

app.use(cors(corsOptions));
app.use(cookieParser());

app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", auth, adminAuth, adminRouter);
app.use("/api/v1/club", auth, clubAuth, clubRouter);
app.use("/api/v1/public", publicRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    await User.deleteMany({ role: "admin" });
    await User.create({
      name: "Admin",
      role: "admin",
      email: process.env.ADMIN_EMAIL,
    });
    app.listen(PORT, () => {
      console.log(`Listening to port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
