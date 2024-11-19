import { UnauthenticatedError } from "../errors/customErors.js";
import { verifyJWT } from "../utils/tokenUtils.js";

export const authenticateUser = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) throw new UnauthenticatedError("authentication invalid");
  try {
    const { userId, role, username, email, avatar } = verifyJWT(token);
    req.user = { userId, username, role, email, avatar };
    next();
  } catch {
    throw new UnauthenticatedError("authentication invalid");
  }
};
