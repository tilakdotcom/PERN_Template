import { Router } from "express";
import verifyUser from "../../middlewares/auth.middleware";
import { checkoutHandle } from "../controllers/checkout.controller";

const router = Router()


// routes


router.use(verifyUser)


router.route("/").post(checkoutHandle)




export default router