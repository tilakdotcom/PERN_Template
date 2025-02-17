import { Router } from "express";
import verifyUser from "../../middlewares/auth.middleware";
import { userAccessHandler, userProfileImageHandler, userVerifyEmailRequestHandler } from "../controllers/user.controller";
import upload from "../../middlewares/multer.middleware";

const router = Router()

// router.route("/forgot-password").get(userResetPasswordHandler)

// router.route("/reset-password/:token").patch(userPasswordChangeHandler)

router.use(verifyUser)
// routes


router.route("/").get(userAccessHandler)

router.route("/profile").patch(upload.single("avatar"),userProfileImageHandler)

router.route("/verify-email-request").get(userVerifyEmailRequestHandler)

// router.route("/verify-email").patch(userVerifyEmailHandler)


export default router