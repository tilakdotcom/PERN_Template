import { OK, UNAUTHORIZED } from "../../constants/httpCode";
import appAssert from "../../middlewares/appAssert.middleware";
import asyncHandler from "../../middlewares/asyncHandler.middleware";

export const userAccessHandler = asyncHandler(async (req, res) => {
  const { userId } = req;
  appAssert(userId, UNAUTHORIZED, "User not authorized");
  return res.status(OK).json({
    message: "User authenticated successfully",
    success: true,
    _id: userId
  });
});
