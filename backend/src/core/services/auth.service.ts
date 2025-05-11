import { passwordComparator, passwordHasher } from "../../common/utils/bcrypt";
import uploadFileToCloudinary from "../../common/utils/cloudinary";
import { thirtyDaysFromNow } from "../../common/utils/customTime";
import {
  accessTokenSecret,
  refreshTokenSecret,
  signToken,
} from "../../common/utils/jwtHelper";
import { BAD_REQUEST } from "../../constants/httpCode";
import prisma from "../../database/dbConnect";
import appAssert from "../../middlewares/appAssert.middleware";
import fs from "fs";

type registerUserServiceProps = {
  avatar: string;
  email: string;
  password: string;
};

export const registerUserService = async (data: registerUserServiceProps) => {
  //check if existing user
  const userExists = await prisma.user.findFirst({
    where: { email: data.email },
  });

  if (userExists) {
    fs.unlinkSync(data.avatar);
  }

  appAssert(!userExists, BAD_REQUEST, "user already exists ");

  const hashedPassword = await passwordHasher(data.password);

  const UploadedImage = await uploadFileToCloudinary(data.avatar);

  const user = await prisma.user.create({
    data: {
      avatar: UploadedImage.secure_url,
      email: data.email,
      password: hashedPassword,
    },
  });

  const { password, ...rest } = user;

  return {
    user: rest,
  };
};

type loginUserServiceProps = {
  email: string;
  password: string;
  userAgent?: string;
};
export const loginUserService = async (data: loginUserServiceProps) => {
  const userExists = await prisma.user.findFirst({
    where: { email: data.email },
  });
  appAssert(userExists, BAD_REQUEST, "invaid user does not exist");

  const isValid = await passwordComparator(data.password, userExists.password);

  appAssert(isValid, BAD_REQUEST, "invalid password or user");

  //create session
  const session = await prisma.session.create({
    data: {
      userId: userExists.id,
      userAgent: data.userAgent,
    },
  });

  const accessToken = signToken(
    {
      userId: userExists.id,
      sessionId: session.id,
    },
    accessTokenSecret
  );

  const refreshToken = signToken(
    {
      userId: userExists.id,
      sessionId: session.id,
    },
    refreshTokenSecret
  );

  const updateSession = await prisma.session.update({
    where: { id: session.id },
    data: {
      refreshToken,
      userAgent: data.userAgent,
      expiresAt: thirtyDaysFromNow(),
    },
  });

  const { password, ...rest } = userExists;
  return {
    accessToken,
    refreshToken,
    user: rest,
    session: updateSession,
  };
};
