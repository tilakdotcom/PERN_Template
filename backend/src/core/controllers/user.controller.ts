import appAssert from "../../common/API/AppAssert";
import { idSchema } from "../../common/schemas/user";
import { BAD_REQUEST, OK } from "../../constants/http";
import asyncHandler from "../../middlewares/asyncHandler.middleware";
import { validateFileImage } from "../../middlewares/file.middleware";
import { userAvatarService, userVerifyEmailRequestService, userVerifyEmailService } from "../services/user.service";


export const userAccessHandler = asyncHandler(async(req, res)=>{
  return res.status(OK).json({
    message: "User authenticated successfully",
    user: req.userId,
  })
})


export const userProfileImageHandler = asyncHandler(async (req, res) => {
  const userId = req.userId;
  appAssert(req.file, BAD_REQUEST, "avatar not found");
  const { path } = validateFileImage(req.file as Express.Multer.File);

  const { user } = await userAvatarService({
    avatar: path,
    userId: userId as string,
  });

  return res.status(OK).json({
    message: "Avatar successfully uploaded ",
    user,
  });
});

// export const userResetPasswordHandler = asyncHandler(async (req, res) => {
//   const email = emailSchema.parse(req.body.email);

//   await userPasswordResetRequestService({ email });

//   return res.status(OK).json({
//     message: "Password reset email sent successfully ",
//   });
// });

// export const userPasswordChangeHandler = asyncHandler(async (req, res) => {
//   const body = passwordChangeSchema.parse({
//     ...req.body,
//     token: req.params.token,
//   });

//   const { user } = await userPasswordChangeService({
//     newPassword: body.newPassword,
//     passwordResetToken: body.token,
//   });

//   return res.status(OK).json({
//     message: "Password reset successfully",
//     data: user,
//   });
// });

export const userVerifyEmailRequestHandler = asyncHandler(async (req, res) => {
  const userId = req.userId;

  const { verification } = await userVerifyEmailRequestService(
    userId as string
  );

  return res.status(OK).json({
    message: "email verification successfully send",
    data: verification.id as string,
  });
});

export const userVerifyEmailHandler = asyncHandler(async (req, res) => {
  const verificationId = idSchema.parse(req.params.verificationId);
  const { user } = await userVerifyEmailService(verificationId);
  return res.status(OK).json({
    message: "user verified successfully",
    data: user,
  });
});
