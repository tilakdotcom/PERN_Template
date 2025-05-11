import Stripe from "stripe";
import { STRIPE_KEY } from "../constants/getEnv";

export const stripe = new Stripe(STRIPE_KEY, {
  apiVersion: "2025-02-24.acacia",
});
