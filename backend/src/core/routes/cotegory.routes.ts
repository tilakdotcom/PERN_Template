import { Router } from "express";
import { getCategories, getCategoryProductById } from "../controllers/category.controller";

const router = Router()


// routes
router.route("/").get(getCategories)


router.route("/:id").get(getCategoryProductById)






export default router