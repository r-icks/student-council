import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from "../Errors/index.js";
import attachCookie from "../utils/attachCookie.js";
import Club from "../models/Club.js";
import moment from "moment";
import { sendOtpEmail } from "../services/nodemailer.js";

// const register = async (req, res) => {
//   const { role, email, name } = req.body;
//   if (!name || !email || !password) {
//     throw new BadRequestError("Please provide all values!");
//   }
//   const userAlreadyExists = await User.findOne({ email });
//   if (userAlreadyExists) {
//     throw new BadRequestError("Email already in use");
//   }
//   const user = await User.create({ name, email, password });
//   user.password = undefined;
//   res.status(StatusCodes.OK).json({ user, location: user.location });
// };

export const sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new BadRequestError("Please provide an email!");
  }
  const userExists = await User.findOne({ email });
  if (!userExists) {
    const clubExists = await Club.findOne({ email });
    if (!clubExists) {
      throw new NotFoundError("No user found!");
    }
    const code = await clubExists.generateOTP();
    clubExists.otp = {
      code,
      genTime: moment().unix(),
    };
    await clubExists.save();
    await sendOtpEmail({
      name: clubExists.name,
      email: clubExists.email,
      otp: code,
    });
    res.status(StatusCodes.OK).json({
      msg: "OTP sent successfully, validity - 5 mins!",
      resendTime: clubExists.otp.genTime + process.env.OTP_RESEND,
    });
  } else {
    const code = await userExists.generateOTP();
    userExists.otp = {
      code,
      genTime: moment().unix(),
    };
    await userExists.save();
    await sendOtpEmail({
      name: userExists.name,
      email: userExists.email,
      otp: code,
    });
    res.status(StatusCodes.OK).json({
      msg: "OTP sent successfully, validity - 5 mins!",
      resendTime: userExists.otp.genTime + process.env.OTP_RESEND,
    });
  }
};

export const login = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    throw new BadRequestError("Please provide all valeus!");
  }
  const user = await User.findOne({ email }).select("+otp");
  if (!user) {
    const club = await Club.findOne({ email }).select("+otp");
    if (!club) {
      throw new UnauthenticatedError("Invalid Credentials");
    }
    await club.checkOTP(otp);
    const token = await club.createJWT();
    attachCookie({ token, res });
    res.status(StatusCodes.OK).json({
      msg: "Login Successfull! Redirecting...",
    });
  } else {
    await user.checkOTP(otp);
    const token = await user.createJWT();
    attachCookie({ token, res });
    res.status(StatusCodes.OK).json({
      msg: "Login Successfull! Redirecting...",
    });
  }
};

export const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};

export const getCurrentUser = async (req, res) => {
  const { userId, userRole } = req.user;
  if (userRole === "club") {
    const club = await Club.findOne({ _id: userId });
    res.status(StatusCodes.OK).json({ user: club });
    if (!club) {
      throw new UnauthenticatedError("Invalid token");
    }
  } else {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new UnauthenticatedError("Invalid token");
    }
    res.status(StatusCodes.OK).json({ user });
  }
};
