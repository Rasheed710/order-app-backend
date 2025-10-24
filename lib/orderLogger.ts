import prisma from "./prisma";


export async function logOrderActivity({
  orderId,
  userId,
  action,
  message,
}: {
  orderId: string;
  userId?: string;
  action: string;
  message: string;
}) {
  try {
    await prisma.orderActivity.create({
      data: { orderId, userId, action, message },
    });
  } catch (error) {
    console.error("Failed to log order activity:", error);
  }
}
