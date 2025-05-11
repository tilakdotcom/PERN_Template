import { Router } from "express";
import { getBlogs } from "../controllers/blog.controller";

const router = Router()


// routes
router.route("/").get(getBlogs)




export default router