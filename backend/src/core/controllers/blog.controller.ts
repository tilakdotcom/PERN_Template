import { blogsData } from "../../common/data";
import asyncHandler from "../../middlewares/asyncHandler.middleware";

export const getBlogs = asyncHandler(async (req, res) => {
  res.status(200).json({
    data: blogsData,
    message :" Blogs data was successfully retrieved" 
  });
});