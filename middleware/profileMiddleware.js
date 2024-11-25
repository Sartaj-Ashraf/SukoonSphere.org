import { UnauthenticatedError } from "../errors/customErors.js";
import { attachCookiesToResponse, verifyJWT } from "../utils/tokenUtils.js";
import RefreshToken from "../models/token/token.js";
import { StatusCodes } from "http-status-codes";
export const profileMiddleware = async (req, res, next) => {
  const { accessToken, refreshToken } = req.signedCookies;
  try {
    if (accessToken) {
      const payload = verifyJWT(accessToken);
      req.user = payload.user;
      req.user.userId = payload.user._id;
      return next();
    }
    const payload = verifyJWT(refreshToken);
    const existingToken = await RefreshToken.findOne({
      user: payload.user._id,
      refreshToken: payload.refreshToken,
    });
    if (!existingToken || !existingToken?.isValid) {
      req.user = null;
      return next();
    }
    attachCookiesToResponse({
      res,
      user: payload.user,
      refreshToken: existingToken.refreshToken,
    });
    req.user = payload.user;
    req.user.userId = payload.user._id;
    return next()
  } catch {
    res.status(StatusCodes.OK).json(null)
  }
};
