// src/app/api/activity/recent/route.ts
import { NextResponse } from "next/server";
import { authMiddleware } from "../../../../lib/authMiddleware";
import prisma from "../../../../lib/prisma";

export const GET = authMiddleware(async (req, context) => {
  try {
    const { userId, userRole } = context;

    const whereClause =
      userRole === "ADMIN"
        ? {}
        : { order: { userId } }; // only see their own orders

    const activities = await prisma.orderActivity.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        user: { select: { name: true, email: true } },
        order: { select: { id: true, status: true } },
      },
    });

    return NextResponse.json(activities, { status: 200 });
  } catch (error) {
    console.error("Fetch recent activities error:", error);
    return NextResponse.json(
      { message: "Something went wrong fetching activities" },
      { status: 500 }
    );
  }
});
