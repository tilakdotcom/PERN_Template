import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";
import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} from "../../constants/getEnv";
import ApiError from "../api/apiError";
import { INTERNAL_SERVER_ERROR } from "../../constants/httpCode";

type AccessTokenParams = {
  userId: string;
  sessionId?: string;
};

type RefreshTokenParams = {
  userId: string;
  sessionId?: string;
};

const defaultOptions: SignOptions = {
  audience: "user",
};

type SignOtionsWithSecretKey = SignOptions & {
  secret: string;
};

// access token secret
export const accessTokenSecret: SignOtionsWithSecretKey = {
  secret: ACCESS_TOKEN_SECRET,
  expiresIn: "50m",
  ...defaultOptions,
};
// refresh token secret
export const refreshTokenSecret: SignOtionsWithSecretKey = {
  secret: REFRESH_TOKEN_SECRET,
  expiresIn: "7d",
  ...defaultOptions,
};

export const signToken = (
  payload: AccessTokenParams | RefreshTokenParams,
  options: SignOtionsWithSecretKey
) => {
  const { secret, ...restOpts } = options;
  return jwt.sign(payload, secret, restOpts);
};

type verifyOptionsWithSecret = VerifyOptions & {
  secret: string;
};

type verifyTokenParams = {
  token: string;
  options?: verifyOptionsWithSecret;
};

export const verifyToken = ({
  token,
  options = accessTokenSecret,
}: verifyTokenParams) => {
  const { secret, ...verifyOpts } = options || {};

  try {
    const decoded = jwt.verify(token, secret, {
      ...verifyOpts,
      ...defaultOptions,
    });
    return decoded as AccessTokenParams | RefreshTokenParams;
  } catch (error: any) {
    console.log("error in verifyToken", error);
    throw new ApiError(INTERNAL_SERVER_ERROR, "Unable to verify token ");
  }
};
