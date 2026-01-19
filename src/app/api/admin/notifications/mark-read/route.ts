// src/app/api/admin/notifications/mark-read/route.ts
import { NextResponse } from "next/server";
import { authMiddleware } from "../../../../../../lib/authMiddleware";
import prisma from "../../../../../../lib/prisma";


export const PUT = authMiddleware(async (req, { userId }) => {
  try {
    const { id, markAll } = await req.json();

    if (markAll) {
      await prisma.notification.updateMany({
        where: { userId, read: false },
        data: { read: true },
      });
      return NextResponse.json({ message: "All notifications marked as read" });
    }

    if (id) {
      await prisma.notification.update({
        where: { id },
        data: { read: true },
      });
      return NextResponse.json({ message: "Notification marked as read" });
    }

    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  } catch (err) {
    console.error("Mark read error:", err);
    return NextResponse.json({ message: "Failed to update read status" }, { status: 500 });
  }
});
