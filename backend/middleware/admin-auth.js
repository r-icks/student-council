import { UnauthenticatedError } from "../Errors/index.js";

const adminAuth = async (req, res, next) => {
  if (req.user.userRole !== "admin") {
    throw new UnauthenticatedError("Authentication Invalid");
  }
  next();
};

export default adminAuth;
