import { z } from "zod";
import { productSchema } from "./checkout.schema";

export const addOrderSchema = z.object({
  paymentId: z.string(),
  orderItems: z.array(productSchema),
  totalAmount: z.string(),
  paymentMethod: z.string(),
});
