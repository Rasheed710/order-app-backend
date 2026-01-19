import { NextResponse } from "next/server";
import { authMiddleware } from "../../../../lib/authMiddleware";
import prisma from "../../../../lib/prisma";

// 🧾 GET all user notifications
export const GET = authMiddleware(async (req, { userId }) => {
    try {
      const notifications = await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
  
      return NextResponse.json(notifications, { status: 200 });
    } catch (err) {
      console.error("Fetch notifications error:", err);
      return NextResponse.json({ message: "Failed to fetch notifications" }, { status: 500 });
    }
  });
  
  // 🟢 Mark all as read
  export const PUT = authMiddleware(async (req, { userId }) => {
    try {
      await prisma.notification.updateMany({
        where: { userId, read: false },
        data: { read: true },
      });
  
      return NextResponse.json({ message: "All notifications marked as read" });
    } catch (err) {
      console.error("Mark read error:", err);
      return NextResponse.json({ message: "Failed to mark read" }, { status: 500 });
    }
  });
  
  // 🔴 Clear all
  export const DELETE = authMiddleware(async (req, { userId }) => {
    try {
      await prisma.notification.deleteMany({ where: { userId } });
      return NextResponse.json({ message: "All notifications cleared" });
    } catch (err) {
      console.error("Clear notifications error:", err);
      return NextResponse.json({ message: "Failed to clear notifications" }, { status: 500 });
    }
  });
  
  