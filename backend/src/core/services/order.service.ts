import { ProductType } from "../../common/types/product";
import { INTERNAL_SERVER_ERROR } from "../../constants/httpCode";
import prisma from "../../database/dbConnect";
import appAssert from "../../middlewares/appAssert.middleware";

type addOrderServiceProps = {
  userId: string;
  paymentId: string;
  orderItems: ProductType[];
  totalAmount: string;
  paymentMethod: string;
};

export const addOrderService = async (data: addOrderServiceProps) => {
  const newOrder = await prisma.order.create({
    data: {
      userId: data.userId,
      paymentId: data.paymentId,
      orderItems: data.orderItems,
      totalAmount: Number(data.totalAmount),
      paymentMethod: data.paymentMethod,
    },
  });

  appAssert(newOrder, INTERNAL_SERVER_ERROR, "error in creating order");

  return {
    order: newOrder,
  };
};

export const getOrdersService = async (userId: string) => {
  const orders = await prisma.order.findMany({
    where: { userId },
  });

  return { orders };
};
