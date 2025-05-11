import { Router } from "express";
import { getHighlights } from "../controllers/highlights.controller";

const router = Router()


// routes
router.route("/").get(getHighlights)




export default router