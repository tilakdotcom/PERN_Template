import { addOrderSchema } from "../../common/schema/order.schema";
import asyncHandler from "../../middlewares/asyncHandler.middleware";
import { addOrderService, getOrdersService } from "../services/order.service";

export const addOrderHandle = asyncHandler(async (req, res) => {
  const body = addOrderSchema.parse(req.body);

  const { order } = await addOrderService({
    ...body,
    userId: req?.userId as string,
  });
  res
    .status(200)
    .json({ message: "Order added successfully", data: order, success: true });
});

export const getOrders = asyncHandler(async (req, res) => {
  const { userId } = req;
  const orders = await getOrdersService(userId as string);
  res.status(200).json({
    message: "Orders fetched successfully",
    data: orders.orders,
    success: true,
  });
});
