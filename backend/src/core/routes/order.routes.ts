import { Router } from "express";
import verifyUser from "../../middlewares/auth.middleware";
import { addOrderHandle, getOrders } from "../controllers/order.controller";
const router = Router()


// routes


router.use(verifyUser)


router.route("/new").post(addOrderHandle)

router.route("/").get(getOrders)






export default router