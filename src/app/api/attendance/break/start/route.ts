import { NextResponse } from "next/server";
import { authMiddleware } from "../../../../../../lib/authMiddleware";
import prisma from "../../../../../../lib/prisma";


export const POST = authMiddleware(async (req, { userId }) => {
  try {
    const attendance = await prisma.attendance.findFirst({
      where: { userId, clockOutTime: null, isOnBreak: false },
    });

    if (!attendance) {
      return NextResponse.json({ message: "No active session found." }, { status: 400 });
    }

    const updated = await prisma.attendance.update({
      where: { id: attendance.id },
      data: {
        breakStart: new Date(),
        isOnBreak: true,
      },
    });

    return NextResponse.json({ message: "Break started", data: updated });
  } catch (err) {
    console.error("Break start error:", err);
    return NextResponse.json({ message: "Error starting break" }, { status: 500 });
  }
});
