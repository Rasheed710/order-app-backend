import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
// make sure this is your prisma client path

export async function GET() {
  try {
    // Total Users (excluding Admins if needed)
    const totalUsers = await prisma.user.count({
      where: { role: "CUSTOMER" },
    });

    // Total Orders
    const totalOrders = await prisma.order.count();

    // Total Revenue (sum of all orders total)
    const totalRevenue = await prisma.order.aggregate({
      _sum: {
        total: true,
      },
      where: {
        status: {
          in: ["DELIVERED"], // Only count successful orders
        },
      },
    });

    return NextResponse.json({
      totalUsers,
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
