import { NextResponse } from "next/server";
import { authMiddleware } from "../../../../../lib/authMiddleware";
import prisma from "../../../../../lib/prisma";


export const GET = authMiddleware(async (req, context) => {
  try {
    const { userRole } = context;

    if (userRole !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const action = searchParams.get("action") || ""; // e.g. ORDER_CREATED

    const skip = (page - 1) * limit;

    const whereClause = action
      ? { action: { equals: action, mode: "insensitive" } }
      : {};

    const totalCount = await prisma.orderActivity.count({ where: whereClause });

    const activities = await prisma.orderActivity.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        user: { select: { name: true, email: true } },
        order: { select: { id: true, status: true } },
      },
    });

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json(
      {
        data: activities,
        meta: {
          page,
          limit,
          totalPages,
          totalCount,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Recent activities fetch error:", error);
    return NextResponse.json(
      { message: "Failed to fetch recent activities" },
      { status: 500 }
    );
  }
});
