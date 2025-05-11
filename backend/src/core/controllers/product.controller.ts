import { products } from "../../common/data";
import asyncHandler from "../../middlewares/asyncHandler.middleware";

export const getProducts = asyncHandler(async (req, res) => {
  res.status(200).json({
    data: products,
    message: "highlight fetched successfully",
    success: true,
  });
});

export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = products.find((p) => p._id === parseInt(id));
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.status(200).json({
    data: product,
    message: "Product fetched successfully",
    success: true,
  });
});
