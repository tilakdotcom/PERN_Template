import { z } from "zod";
// Define the product schema
export const productSchema = z.object({
  _id: z.number(),
  _base: z.string(),
  reviews: z.number(),
  rating: z.number(),
  quantity: z.number(),
  overView: z.string(),
  name: z.string(),
  isStock: z.boolean(),
  isNew: z.boolean(),
  images: z.array(z.string()),
  discountedPrice: z.number(),
  regularPrice: z.number(),
  description: z.string(),
  colors: z.array(z.string()),
  category: z.string(),
  brand: z.string(),
});

export const checkoutSchema = z.object({
  email: z.string().email(),
  products: z.array(productSchema),
});
