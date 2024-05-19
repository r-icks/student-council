import { UnauthenticatedError } from "../Errors/index.js";

const clubAuth = async (req, res, next) => {
  if (req.user.userRole !== "club") {
    throw new UnauthenticatedError("Authentication Invalid");
  }
  next();
};

export default clubAuth;
