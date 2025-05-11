import { categories, products } from "../../common/data";
import asyncHandler from "../../middlewares/asyncHandler.middleware";

export const getCategories = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: " categories data was successfully retrieved",
    data: categories,
  });
});

export const getCategoryProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const matchedProducts = products.filter((p) => p._base === id);
  if (!matchedProducts.length || matchedProducts.length === 0) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.status(200).json({
    message: " category product data was successfully retrieved",
    data: matchedProducts,
  });
});
