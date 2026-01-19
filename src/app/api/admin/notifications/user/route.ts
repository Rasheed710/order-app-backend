// src/app/api/admin/notifications/user/route.ts
import { NextResponse } from "next/server";
import { authMiddleware } from "../../../../../../lib/authMiddleware";
import prisma from "../../../../../../lib/prisma";


export const GET = authMiddleware(async (req, { userId }) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return NextResponse.json(notifications, { status: 200 });
  } catch (err) {
    console.error("Fetch notifications error:", err);
    return NextResponse.json({ message: "Failed to fetch notifications" }, { status: 500 });
  }
});
