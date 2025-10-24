// // src/app/api/attendance/status/route.ts
// import { NextResponse } from "next/server";
// import { authMiddleware } from "../../../../../lib/authMiddleware";
// import prisma from "../../../../../lib/prisma";


// export const GET = authMiddleware(async (req, { userId }) => {
//   try {
//     const activeAttendance = await prisma.attendance.findFirst({
//       where: {
//         userId,
//         clockOutTime: null, // still active
//       },
//     });

//     if (activeAttendance) {
//       return NextResponse.json({
//         clockedIn: true,
//         clockInTime: activeAttendance.clockInTime,
//         location: activeAttendance.location,
//       });
//     }

//     return NextResponse.json({ clockedIn: false });
//   } catch (error) {
//     console.error("Attendance status error:", error);
//     return NextResponse.json(
//       { message: "Something went wrong fetching attendance status" },
//       { status: 500 }
//     );
//   }
// });
import { NextResponse } from "next/server";
import { authMiddleware } from "../../../../../lib/authMiddleware";
import prisma from "../../../../../lib/prisma";

export const GET = authMiddleware(async (req, { userId }) => {
  try {
    // ✅ Find active attendance record (still clocked in)
    const activeAttendance = await prisma.attendance.findFirst({
      where: { userId, clockOutTime: null },
      select: {
        id: true,
        clockInTime: true,
        location: true,
        isOnBreak: true,
        breakStart: true,
        totalBreakMinutes: true,
      },
    });

    // ❌ If no active session
    if (!activeAttendance) {
      return NextResponse.json({ clockedIn: false });
    }

    // ✅ Calculate current break duration if break is active
    let totalBreakMinutes = activeAttendance.totalBreakMinutes || 0;

    if (activeAttendance.isOnBreak && activeAttendance.breakStart) {
      const now = new Date();
      const breakStart = new Date(activeAttendance.breakStart);
      const diffMinutes = Math.floor((now.getTime() - breakStart.getTime()) / 60000);
      totalBreakMinutes += diffMinutes;
    }

    // ✅ Format duration
    const hours = Math.floor(totalBreakMinutes / 60);
    const mins = totalBreakMinutes % 60;
    const formattedBreakDuration =
      totalBreakMinutes > 0 ? `${hours}h ${mins}m` : null;

    // ✅ Return complete status
    return NextResponse.json({
      clockedIn: true,
      clockInTime: activeAttendance.clockInTime,
      location: activeAttendance.location,
      isOnBreak: activeAttendance.isOnBreak,
      breakDuration: formattedBreakDuration,
    });
  } catch (error) {
    console.error("❌ Attendance status error:", error);
    return NextResponse.json(
      { message: "Something went wrong fetching attendance status" },
      { status: 500 }
    );
  }
});
