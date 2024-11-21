import { StatusCodes } from "http-status-codes";
import User from "../models/userModel.js";
import RefreshToken from "../models/token/token.js";
import {
  comparePassword,
  hashpasword,
  hashString,
} from "../utils/passwordUtils.js";
import { UnauthenticatedError } from "../errors/customErors.js";
import { createJWT, attachCookiesToResponse } from "../utils/tokenUtils.js";
import crypto from "crypto";
import sendVerificationEmail from "../utils/sendVerificationEmail.js";
import sendResetPasswordEmail from "../utils/sendResetPasswordEmail.js";

// register
export const register = async (req, res) => {
  const isFirst = (await User.countDocuments()) === 0;
  req.body.role = isFirst ? "admin" : "user";
  req.body.password = await hashpasword(req.body.password);
  req.body.verificationToken = crypto.randomBytes(20).toString("hex");

  const user = await User.create(req.body);
  const origin = "http://localhost:5173";
  await sendVerificationEmail({
    name: user.name,
    email: user.email,
    verificationToken: user.verificationToken,
    origin,
  });
  res.status(StatusCodes.CREATED).json({
    msg: "Success! please check your email to verify account",
  });
};

// verify-email
export const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("verification failed");
  }
  if (user.verificationToken !== verificationToken) {
    throw new UnauthenticatedError("verification failed");
  }
  user.isVerified = true;
  user.verified = Date.now();
  user.verificationToken = "";

  await user.save();
  res.status(StatusCodes.OK).json({ msg: "email verified" });
};

// login
export const login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const isValidUser =
    user && (await comparePassword(req.body.password, user.password));
  if (!isValidUser) throw new UnauthenticatedError("invalid Credentials");
  if (!user.isVerified)
    throw new UnauthenticatedError(
      "please verify your email, you have already recieved verification link, check your mail"
    );
  // from here
  // create refresh token
  let refreshToken = "";
  // check if refresh token already exists
  const existingToken = await RefreshToken.findOne({ user: user._id });
  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      throw new UnauthenticatedError("invalid credentials");
    }
    // if refresh token is valid
    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({
      res,
      user,
      refreshToken,
    });
    res.status(StatusCodes.OK).json({ msg: "user logged in", user });
    return;
  }
  // if refresh token does not exist
  refreshToken = crypto.randomBytes(50).toString("hex");
  const userAgent = req.headers["user-agent"];
  const ipAddress = req.ip;
  const userToken = { refreshToken, ipAddress, userAgent, user: user._id };
  await RefreshToken.create(userToken);
  attachCookiesToResponse({
    res,
    user,
    refreshToken,
  });
  res.status(StatusCodes.OK).json({ msg: "user logged in", user });
};

export const changePassword = async (req, res) => {
  const user = await User.findById(req.user.userId);

  if (!user) throw new BadRequestError("Password reset request failed.");

  const isValidUser =
    user && (await comparePassword(req.body.password, user.password));

  if (!isValidUser) throw new UnauthenticatedError("invalid Credentials");

  if (req.body.newPassword !== req.body.confirmNewPassword) {
    throw new BadRequestError("New passwords do not match.");
  }

  if (!user.isVerified)
    throw new UnauthenticatedError("please verify your email");

  const hashedPassword = await hashpasword(req.body.newPassword);
  user.password = hashedPassword;
  await user.save();

  res.status(StatusCodes.OK).json({ msg: "password changed sucessfully" });
};

// forget password
export const forgetPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (user) {
    const passwordToken = crypto.randomBytes(70).toString("hex");
    // send email
    const origin = "http://localhost:5173";
    await sendResetPasswordEmail({
      name: user.name,
      email: user.email,
      token: passwordToken,
      origin,
    });
    const tenMinutes = 1000 * 60 * 10;
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

    user.passwordToken = hashString(passwordToken);
    user.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await user.save();
  }

  res.status(StatusCodes.OK).json({
    msg: "Success! please check your email for reset password link",
  });
};
// resetpassword
export const resetPassword = async (req, res) => {
  const { token, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    const currentDate = new Date();
    if (
      user.passwordToken === hashString(token) &&
      user.passwordTokenExpirationDate > currentDate
    ) {
      const hashedPassword = await hashpasword(password);
      user.passwordToken = null;
      user.passwordTokenExpirationDate = null;
      user.password = hashedPassword;
      await user.save();
    }
  }
  res.status(StatusCodes.OK).json({ msg: "password changed sucessfully" });
};

// logout
export const logout = async (req, res) => {
  await RefreshToken.findOneAndDelete({ user: req.user.userId });

  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};
  