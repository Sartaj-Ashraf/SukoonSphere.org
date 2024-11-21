import jwt from "jsonwebtoken";

export const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
};

export const verifyJWT = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded;
};

export const attachCookiesToResponse = ({ res, user, refreshToken }) => {
  const _accessToken = createJWT({ payload: { user } });
  const _refreshToken = createJWT({ payload: { user, refreshToken } });
  res.cookie("accessToken", _accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV == "production",
    signed: true,
    maxAge: 1000 * 60 * 15,
  });
  res.cookie("refreshToken", _refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV == "production",
    signed: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  });
};
