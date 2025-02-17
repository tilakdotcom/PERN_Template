import appAssert from "../../common/API/AppAssert";
import {
  BAD_REQUEST,
} from "../../constants/http";
import uploadFileToCloudinary from "../../common/utils/cloudinary";
import prisma from "../../database/dbConnect";

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


  const updateUserAvatar=  await prisma.user.update({
    where: { id: user.id },
    data: { avatar: avatar.secure_url },
  })

  const {password, ...rest} = updateUserAvatar

  return { user: rest };
};

// type UserPasswordResetRequestType = {
//   email: string;
// };

// export const userPasswordResetRequestService = async (
//   data: UserPasswordResetRequestType
// ) => {
//   const user = await User.findOne({ email: data.email });
//   appAssert(user, BAD_REQUEST, "user not found");

//   const count = await VerifyCation.countDocuments({
//     userId: user._id,
//     expiresAt: {
//       $gte: Now(),
//     },
//   });
//   if (count > 2) {
//     throw new ApiError(
//       BAD_REQUEST,
//       "You have exceeded the maximum number of documents"
//     );
//   }

//   const passwordResetVerificationCode = await VerifyCation.create({
//     userId: user._id,
//     type: verificationCode.PASSWORD_RESET,
//     expiresAt: fifteenMinuteFromNow(),
//   });

//   const url = `${CLIENT_URI}/reset-password/${passwordResetVerificationCode._id}`;

//   sendForgotPasswordEmail(data.email, url);

//   return { passwordResetVerificationCode };
// };

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

// export const userVerifyEmailRequestService = async (userId: string) => {
//   const user = await User.findOne({ _id: userId });
//   appAssert(user, BAD_REQUEST, "User not found");

//   const count = await VerifyCation.countDocuments({ userId: userId });

//   if (count >= 2) {
//     throw new ApiError(
//       BAD_REQUEST,
//       "You have already reached the maximum number of limit try again laterr."
//     );
//   }

//   const verification = await VerifyCation.create({
//     userId: userId,
//     expiresAt: fifteenMinuteFromNow(),
//     type: verificationCode.VERIFICATION_EMAIL,
//   });

//   // sent email
//   const url = `${CLIENT_URI}/reset-password/${verification._id}`;
//   sendVerificationEmail(user.email, url);
//   return {
//     verification,
//   };
// };

// export const userVerifyEmailService = async (id: string) => {
//   const verification = await VerifyCation.findOne({
//     _id: id,
//     expiresAt: { $gte: Now() },
//   });
//   appAssert(verification, BAD_REQUEST, "Token has expired");

//   const user = await User.findOne({ _id: verification.userId });
//   appAssert(user, BAD_REQUEST, "Token has expired");

//   user.verifiedEmail = true;
//   await user.save({ validateBeforeSave: false });

//   //deleting the verification
//   await VerifyCation.deleteMany({
//     userId: user._id,
//     type: verificationCode.VERIFICATION_EMAIL,
//   });

//   return { user: user.publicUser() };
// };
