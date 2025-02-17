import appAssert from "../../common/API/AppAssert";
import { passwordHasher } from "../../common/utils/bcryptjs";
import { Now } from "../../common/utils/customTime";
import {
  accessTokenSignOptions,
  generateToken,
  refreshTokenSignOptions,
  verifyToken,
} from "../../common/utils/jwtHelper";
import { BAD_REQUEST, UNAUTHORIZED } from "../../constants/http";
import prisma from "../../database/dbConnect";

import { sendWelcomeEmail } from "../../mail/mailer";

type CreateUserData = {
  email: string;
  password: string;
  username: string;
};

export const createUserService = async (data: CreateUserData) => {
  const userExists = await prisma.user.findFirst({
    where: { email: data.email },
  })

  appAssert(!userExists, BAD_REQUEST, "user already exists");

  const hashedPassword = await passwordHasher(data.password)

  const user = await prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      password: hashedPassword,
    }
  })

  // generate welcome email
  sendWelcomeEmail(data.username, data.email);

  const {password, ...rest} = user

  return {
    user:rest
  };
};

// type LoginUserData = {
//   userAgent?: string;
//   email: string;
//   password: string;
// };

// export const loginUserService = async (data: LoginUserData) => {
//   const user = await User.findOne({ email: data.email });

//   //validation
//   appAssert(user, BAD_REQUEST, "invalid login user details");

//   //password check
//   const isMatch = await user.comparePassword(data.password);

//   appAssert(isMatch, BAD_REQUEST, "invalid login user or password details");

//   //create session
//   const session = await Session.create({
//     userId: user._id,
//     userAgent: data.userAgent,
//   });

//   //generate tokens

//   const refreshToken = generateToken(
//     {
//       userId: user._id,
//       sessionId: session._id,
//     },
//     refreshTokenSignOptions
//   );

//   const accessToken = generateToken(
//     {
//       userId: user._id,
//       sessionId: session._id,
//     },
//     accessTokenSignOptions
//   );

//   session.refreshToken = refreshToken;
//   await session.save({ validateBeforeSave: false });

//   return {
//     user: user.publicUser(),
//     accessToken,
//     refreshToken,
//     session,
//   };
// };

// export const refreshTokenService = async (refreshToken: string) => {
//   const userId = verifyToken({
//     token: refreshToken,
//     options: refreshTokenSignOptions,
//   });

//   appAssert(userId.userId, UNAUTHORIZED, "invalid  refresh token");

//   const session = await Session.findOne({
//     _id: userId.sessionId,
//     refreshToken: refreshToken,
//     expiresAt: {
//       $gte: Now(),
//     },
//   });

//   appAssert(
//     session && session.refreshToken === refreshToken,
//     UNAUTHORIZED,
//     "session not found  in the database or refresh token is invalid"
//   );

//   const accessToken = generateToken(
//     {
//       userId: session.userId,
//       sessionId: session._id,
//     },
//     accessTokenSignOptions
//   );

//   return {
//     accessToken,
//     session,
//   };
// };
