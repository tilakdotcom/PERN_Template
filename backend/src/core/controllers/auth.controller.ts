import {
  createUserSchema,
  loginUserSchema,
} from "../../common/schema/auth.schema";
import { clearAuthCookie, setAuthCookies } from "../../common/utils/cookie";
import { BAD_REQUEST, CREATED, OK } from "../../constants/httpCode";
import prisma from "../../database/dbConnect";
import appAssert from "../../middlewares/appAssert.middleware";
import asyncHandler from "../../middlewares/asyncHandler.middleware";
import { validateFileImage } from "../../middlewares/file.middleware";
import {
  loginUserService,
  registerUserService,
} from "../services/auth.service";

export const registerUser = asyncHandler(async (req, res) => {
  const body = createUserSchema.parse(req.body);
  const { path } = validateFileImage(req.file as Express.Multer.File);
  const { user } = await registerUserService({
    email: body.email,
    password: body.password,
    avatar: path,
  });
  res.status(CREATED).json({
    message: "User registered successfully",
    success: true,
    data: user,
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const body = loginUserSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  const { accessToken, refreshToken, user } = await loginUserService(body);

  return setAuthCookies({ res, accessToken, refreshToken }).status(OK).json({
    message: "User logged in successfully",
    success: true,
    data: user,
  });
});

//logout
export const logoutUser = asyncHandler(async (req, res) => {
  const sessionId = req.sessionId;

  const session = await prisma.session.delete({
    where: { id: sessionId },
  });

  appAssert(session, BAD_REQUEST, "session not found  in the database");

  return clearAuthCookie(res).status(OK).json({
    success: true,
    message: "Logged out successfully",
  });
});
