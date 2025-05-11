import { Router } from "express";
import { getProductById, getProducts } from "../controllers/product.controller";

const router = Router()


// routes
router.route("/").get(getProducts)

router.route("/:id").get(getProductById)




export default router