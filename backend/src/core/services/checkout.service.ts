import { ProductType } from "../../common/types/product";
import {
  expiryTime,
  fifteenMinuteFromNow,
} from "../../common/utils/customTime";
import { stripe } from "../../config/stripe";
import { CLIENT_URI } from "../../constants/getEnv";
import { INTERNAL_SERVER_ERROR } from "../../constants/httpCode";
import appAssert from "../../middlewares/appAssert.middleware";
import { addOrderService } from "./order.service";

type checkoutServiceProps = {
  products: ProductType[];
  email: string;
  userId: string;
};

export const checkoutService = async (data: checkoutServiceProps) => {
  const extractData = await Promise.all(
    data.products.map(async (p) => {
      const product = await stripe.products.create({
        name: p.name,
        metadata: {
          variant_id: p._id,
          description: p.description,
        },
        images: p.images,
      });

      return {
        quantity: p.quantity,
        price_data: {
          currency: "USD",
          unit_amount: p.discountedPrice * 100,
          product: product.id,
        },
      };
    })
  );

  const stripeSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: extractData,
    mode: "payment",
    success_url: `${CLIENT_URI}/success?session_id={CHECKOUT_SESSION_ID}&exp=${expiryTime}`,
    cancel_url: `${CLIENT_URI}/cancel?exp=${expiryTime}`,
    customer_email: data.email,
    metadata: {
      email: data.email,
    },
  });

  appAssert(stripeSession, INTERNAL_SERVER_ERROR, "Error in Stripe session");

  const totalAmount = data.products.reduce(
    (acc, p) => acc + p.discountedPrice * p.quantity,
    0
  );

  const order = await addOrderService({
    userId: data.userId,
    totalAmount: String(totalAmount),
    paymentMethod: "stripe",
    paymentId: stripeSession.id,
    orderItems: data.products,
  });

  appAssert(order, INTERNAL_SERVER_ERROR, "Error adding order");

  return {
    stripeSessionId: stripeSession.id,
  };
};
