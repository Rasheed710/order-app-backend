// src/app/api/notifications/register/route.ts
import { NextResponse } from "next/server";
import { authMiddleware } from "../../../../../lib/authMiddleware";
import prisma from "../../../../../lib/prisma";

export const POST = authMiddleware(async (req, { userId }) => {
  try {
    const { fcmToken } = await req.json();

    if (!fcmToken) {
      return NextResponse.json({ message: "Missing FCM token" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { fcmToken },
    });

    return NextResponse.json({ message: "FCM token registered successfully" });
  } catch (error) {
    console.error("FCM Register Error:", error);
    return NextResponse.json({ message: "Failed to register FCM token" }, { status: 500 });
  }
});


