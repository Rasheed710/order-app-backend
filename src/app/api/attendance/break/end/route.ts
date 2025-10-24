// import { NextResponse } from "next/server";
// import { authMiddleware } from "../../../../../../lib/authMiddleware";
// import prisma from "../../../../../../lib/prisma";


// export const POST = authMiddleware(async (req, { userId }) => {
//   try {
//     const attendance = await prisma.attendance.findFirst({
//       where: { userId, clockOutTime: null, isOnBreak: true },
//     });

//     if (!attendance) {
//       return NextResponse.json({ message: "No active break found." }, { status: 400 });
//     }

//     const updated = await prisma.attendance.update({
//       where: { id: attendance.id },
//       data: {
//         breakEnd: new Date(),
//         isOnBreak: false,
//       },
//     });

//     return NextResponse.json({ message: "Break ended", data: updated });
//   } catch (err) {
//     console.error("Break end error:", err);
//     return NextResponse.json({ message: "Error ending break" }, { status: 500 });
//   }
// });

import { NextResponse } from "next/server";
import { authMiddleware } from "../../../../../../lib/authMiddleware";
import prisma from "../../../../../../lib/prisma";

export const POST = authMiddleware(async (req, { userId }) => {
  try {
    // ✅ Find active attendance with ongoing break
    const attendance = await prisma.attendance.findFirst({
      where: { userId, clockOutTime: null, isOnBreak: true },
    });

    if (!attendance) {
      return NextResponse.json(
        { message: "No active break found." },
        { status: 400 }
      );
    }

    // ✅ Calculate break duration
    const now = new Date();
    const breakStart = attendance.breakStart
      ? new Date(attendance.breakStart)
      : null;

    let breakDurationMinutes = 0;

    if (breakStart) {
      const diffMs = now.getTime() - breakStart.getTime();
      breakDurationMinutes = Math.floor(diffMs / 60000);
    }

    // ✅ Update attendance record
    const updated = await prisma.attendance.update({
      where: { id: attendance.id },
      data: {
        breakEnd: now,
        isOnBreak: false,
        totalBreakMinutes: (attendance.totalBreakMinutes || 0) + breakDurationMinutes,
      },
    });

    return NextResponse.json({
      message: `Break ended. Duration: ${breakDurationMinutes} min`,
      data: updated,
    });
  } catch (err) {
    console.error("❌ Break end error:", err);
    return NextResponse.json(
      { message: "Error ending break" },
      { status: 500 }
    );
  }
});
