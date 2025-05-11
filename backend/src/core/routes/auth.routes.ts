import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/auth.controller";
import upload from "../../middlewares/multer.middleware";
import verifyUser from "../../middlewares/auth.middleware";

const router = Router();

// routes
router.route("/register").post(upload.single("avatar"), registerUser);

router.route("/login").post(loginUser);

router.route("/logout").get(verifyUser, logoutUser);

export default router;
