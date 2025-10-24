import { NextResponse } from "next/server";
import { authMiddleware } from "../../../../../lib/authMiddleware";
import prisma from "../../../../../lib/prisma";


// 🗓️ Get last 30 days sales trend
export const GET = authMiddleware(async (req, context) => {
  try {
    const { userRole } = context;

    if (userRole !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 30);

    // Fetch orders within last 30 days
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: today,
        },
      },
      select: {
        createdAt: true,
        total: true,
      },
    });

    // Group by day
    const dailySales: Record<string, number> = {};
    for (const order of orders) {
      const date = order.createdAt.toISOString().split("T")[0];
      dailySales[date] = (dailySales[date] || 0) + order.total;
    }

    // Ensure all 30 days exist, even if 0 sales
    const trend = Array.from({ length: 30 }).map((_, i) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const formatted = date.toISOString().split("T")[0];
      return { date: formatted, total: dailySales[formatted] || 0 };
    });

    return NextResponse.json({ trend }, { status: 200 });
  } catch (error) {
    console.error("Sales Trend API Error:", error);
    return NextResponse.json({ message: "Error fetching sales trend" }, { status: 500 });
  }
});
