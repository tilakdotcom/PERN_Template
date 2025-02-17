import appAssert from "../../common/API/AppAssert";
import { passwordCompare, passwordHasher } from "../../common/utils/bcryptjs";
import { Now, thirtyDaysFromNow } from "../../common/utils/customTime";
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

type LoginUserData = {
  userAgent?: string;
  email: string;
  password: string;
};

export const loginUserService = async (data: LoginUserData) => {
  const user = await prisma.user.findFirst({
    where: { email: data.email },
  });

  //validation
  appAssert(user, BAD_REQUEST, "invalid login user details");

  //password check
  const isMatch = await passwordCompare(data.password, user.password)
  appAssert(isMatch, BAD_REQUEST, "invalid login user or password details");

  //create session
  const session = await prisma.session.create({
   data: {
     userId: user.id,
     userAgent: data.userAgent,
     expiresAt: thirtyDaysFromNow(),
   },
  });

  //generate tokens

  const refreshToken = generateToken(
    {
      userId: user.id,
      sessionId: session.id,
    },
    refreshTokenSignOptions
  );

  const accessToken = generateToken(
    {
      userId: user.id,
      sessionId: session.id,
    },
    accessTokenSignOptions
  );
  const updateSession = await prisma.session.update({
    where: { id: session.id },
    data: { refreshToken },
  })

  const {password, ...rest} = user

  return {
    user: rest,
    accessToken,
    refreshToken,
    updateSession,
  };
};

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
