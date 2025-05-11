import { checkoutSchema } from "../../common/schema/checkout.schema";
import asyncHandler from "../../middlewares/asyncHandler.middleware";
import { checkoutService } from "../services/checkout.service";

export const checkoutHandle = asyncHandler(async (req, res) => {
  const body = checkoutSchema.parse({
    products: req.body.products,
    email: req.body.email,
  });
  const { stripeSessionId } = await checkoutService({
    userId: req.userId as string,
    email: body.email,
    products: body.products,
  });
  res.status(200).json({
    message: "Order checkout completed",
    data: {
      stripeSessionId,
    },
  });
});
