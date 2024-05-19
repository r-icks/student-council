import User from "../models/User.js";
import Club from "../models/Club.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../Errors/index.js";

const getAllAccountsHelper = async () => {
  const users = await User.find({ role: { $ne: "admin" } }).select(
    "name email role"
  );
  const clubs = await Club.find().select("name email").lean();
  const clubAccounts = clubs.map((club) => ({
    ...club,
    role: "club",
  }));
  return [...users, ...clubAccounts];
};

export const getAllAccounts = async (req, res) => {
  const allAccounts = await getAllAccountsHelper();
  res.status(StatusCodes.OK).json({ allAccounts });
};

export const addAccount = async (req, res) => {
  const { role, name, email } = req.body;
  if (!role || !name || !email) {
    throw new BadRequestError("Please provide all values!");
  }
  if (role === "club") {
    const { facultyAdvisorEmail } = req.body;
    if (!facultyAdvisorEmail) {
      throw new BadRequestError("Please provide faculty advisor email");
    }
    const userExists2 = await User.findOne({ email });
    if (userExists2) throw new BadRequestError("Email already in use");
    const userExists = await User.findOne({ faemail: facultyAdvisorEmail });
    if (!userExists) {
      throw new BadRequestError("Add faculty advisor account first");
    }
    const clubExists = await Club.findOne({ email });
    if (clubExists) {
      throw new BadRequestError("Email already in use");
    }
    const newClub = await Club.create({
      name,
      email,
      faemail: facultyAdvisorEmail,
    });
    const allAccounts = await getAllAccountsHelper();
    res
      .status(StatusCodes.CREATED)
      .json({ msg: "Account added successfully", allAccounts });
  } else {
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new BadRequestError("Email already in use");
    }
    const newUser = await User.create({ role, name, email });
    const allAccounts = await getAllAccountsHelper();
    res
      .status(StatusCodes.CREATED)
      .json({ msg: "Account added successfully", allAccounts });
  }
};

export const editAccount = async (req, res) => {
  const { name, email, accountId } = req.body;
  if (!name || !email) {
    throw new BadRequestError("Please provide name and email!");
  }
  if (!accountId) {
    throw new BadRequestError("Account ID is required");
  }
  const updatedUser = await User.findByIdAndUpdate(
    accountId,
    { name, email },
    { new: true }
  );
  if (!updatedUser) {
    throw new NotFoundError("User not found");
  }
  const allAccounts = await getAllAccountsHelper();
  res
    .status(StatusCodes.OK)
    .json({ msg: "Account updated successfully", allAccounts });
};

export const deleteAccount = async (req, res) => {
  const { accountId } = req.body;
  if (!accountId) {
    throw new BadRequestError("Account ID is required");
  }
  const deletedUser = await User.findByIdAndDelete(accountId);
  if (!deletedUser) {
    const deletedClub = await Club.findByIdAndDelete(accountId);
    if (!deletedClub) {
      throw new NotFoundError("User not found");
    }
  }
  const allAccounts = await getAllAccountsHelper();
  res
    .status(StatusCodes.OK)
    .json({ msg: "Account deleted successfully", allAccounts });
};
