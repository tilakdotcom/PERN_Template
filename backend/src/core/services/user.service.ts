import appAssert from "../../common/API/AppAssert";
import { BAD_REQUEST } from "../../constants/http";
import uploadFileToCloudinary from "../../common/utils/cloudinary";
import prisma from "../../database/dbConnect";
import { verificationType } from "@prisma/client";
import ApiError from "../../common/API/ApiError";
import { fifteenMinuteFromNow, Now } from "../../common/utils/customTime";
import { CLIENT_URI } from "../../constants/getEnv";
import { sendForgotPasswordEmail, sendVerificationEmail } from "../../mail/mailer";

type UserAvatar = {
  avatar: string;
  userId: string;
};

export const userAvatarService = async (data: UserAvatar) => {
  const user = await prisma.user.findFirst({
    where: { id: data.userId },
  });

  appAssert(user, BAD_REQUEST, "user not found");

  const avatar = await uploadFileToCloudinary(data.avatar);

  const updateUserAvatar = await prisma.user.update({
    where: { id: user.id },
    data: { avatar: avatar.secure_url },
  });

  const { password, ...rest } = updateUserAvatar;

  return { user: rest };
};

type UserPasswordResetRequestType = {
  email: string;
};

export const userPasswordResetRequestService = async (
  data: UserPasswordResetRequestType
) => {
  const user = await prisma.user.findFirst({
    where: { email: data.email }
  });


  appAssert(user, BAD_REQUEST, "user not found");

  const count = await prisma.verification.count({
    where: {
      userId: user.id,
      type: verificationType.RESET_PASSWORD,
      expiresAt: {
        gte: Now(),
      },
    },
  });

  if (count > 2) {
    throw new ApiError(
      BAD_REQUEST,
      "You have exceeded the maximum number of documents"
    );
  }

  const passwordResetVerificationCode = await prisma.verification.create({
    data: {
      userId: user.id,
      type: verificationType.RESET_PASSWORD,
      expiresAt: fifteenMinuteFromNow(),
    }
  });



  const url = `${CLIENT_URI}/reset-password/${passwordResetVerificationCode.id}`;

  sendForgotPasswordEmail(data.email, url);

  return { passwordResetVerificationCode };
};



// type UserPasswordChangeServiceType = {
//   newPassword: string;
//   passwordResetToken: string;
// };

// export const userPasswordChangeService = async (
//   data: UserPasswordChangeServiceType
// ) => {
//   const verification = await VerifyCation.findOne({
//     _id: data.passwordResetToken,
//     type: verificationCode.PASSWORD_RESET,
//     expiresAt: {
//       $gte: Now(),
//     },
//   });
//   appAssert(verification, BAD_REQUEST, "reset password has expired");

//   const user = await User.findOne({ _id: verification.userId });
//   appAssert(user, INTERNAL_SERVER_ERROR, "reset password failed");

//   const hashedPassword = await passwordHasher(data.newPassword);

//   user.password = hashedPassword;
//   await user.save({ validateBeforeSave: false });

//   //delete old sessions
//   await Session.deleteMany({ userId: user._id });

//   await VerifyCation.deleteMany({
//     userId: user._id,
//     type: verificationCode.PASSWORD_RESET,
//   });

//   return { user };
// };

export const userVerifyEmailRequestService = async (userId: string) => {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });
  appAssert(user, BAD_REQUEST, "User not found");

  const count = await prisma.verification.count({
    where: { userId: userId, type: verificationType.EMAIL_VERIFICATION },
    orderBy: { createdAt: "desc" },
  });

  if (count >= 2) {
    throw new ApiError(
      BAD_REQUEST,
      "You have already reached the maximum number of limit try again laterr."
    );
  }

  const verification = await prisma.verification.create({
    data: {
      userId: userId,
      expiresAt: fifteenMinuteFromNow(),
      type: verificationType.EMAIL_VERIFICATION,
    },
  });

  // sent email
  const url = `${CLIENT_URI}/reset-password/${verification.id}`;

  sendVerificationEmail(user.email, url);

  return {
    verification,
  };
};

export const userVerifyEmailService = async (id: string) => {
  const verification = await prisma.verification.findFirst({
    where: {
      id: id,
      expiresAt: { gte: Now() },
    },
  });
  appAssert(verification, BAD_REQUEST, "Token has expired");

  const user = await prisma.user.findFirst({
    where: {
      id: verification.userId,
    }
  });

  appAssert(user, BAD_REQUEST, "Token has expired");

  const updateUser = await prisma.user.update({
    where: { id: user.id },
    data: { verifiedEmail: true },
  })
  const { password,...rest } = updateUser;
  //deleting the verification

  await prisma.verification.deleteMany({
    where: { userId: user.id, type: verificationType.EMAIL_VERIFICATION },
  });

  return { user: rest};
};
