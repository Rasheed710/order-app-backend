import { NextResponse } from "next/server";
import { authMiddleware } from "../../../../../../lib/authMiddleware";
import prisma from "../../../../../../lib/prisma";


// ✅ Fetch all activity logs for a specific order
export const GET = authMiddleware(async (req, { params, userRole, userId }) => {
  try {
    const { id } = params; // order ID from URL

    if (!id) {
      return NextResponse.json(
        { message: "Order ID is required" },
        { status: 400 }
      );
    }

    // 🔒 Restrict access based on role
    const whereClause =
      userRole === "ADMIN"
        ? { orderId: id }
        : { orderId: id, order: { userId } }; // non-admins see only their orders

    // 🧠 Fetch activity logs
    const activities = await prisma.orderActivity.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    return NextResponse.json(activities, { status: 200 });
  } catch (error) {
    console.error("Fetch order activities error:", error);
    return NextResponse.json(
      { message: "Something went wrong fetching order activities" },
      { status: 500 }
    );
  }
});
