// import { NextResponse } from "next/server";
// import { authMiddleware } from "../../../../../lib/authMiddleware";
// import prisma from "../../../../../lib/prisma";

// export const PUT = authMiddleware(async (req, { userId }) => {
//   try {
//     // ✅ Find today's active attendance record
//     const attendance = await prisma.attendance.findFirst({
//       where: {
//         userId,
//         clockOutTime: null,
//       },
//       orderBy: { clockInTime: "desc" },
//     });

//     if (!attendance) {
//       return NextResponse.json(
//         { message: "No active clock-in found" },
//         { status: 400 }
//       );
//     }

//     // ✅ Calculate today’s stats before clock-out
//     const startOfDay = new Date();
//     startOfDay.setHours(0, 0, 0, 0);
//     const endOfDay = new Date();
//     endOfDay.setHours(23, 59, 59, 999);

//     const orders = await prisma.order.findMany({
//       where: {
//         userId,
//         createdAt: { gte: startOfDay, lte: endOfDay },
//       },
//     });

//     const totalOrders = orders.length;
//     const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);

//     const updated = await prisma.attendance.update({
//       where: { id: attendance.id },
//       data: {
//         clockOutTime: new Date(),
//         totalOrders,
//         totalSales,
//       },
//     });

//     return NextResponse.json(
//       { message: "Clocked out successfully", updated },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Clock Out Error:", error);
//     return NextResponse.json(
//       { message: "Something went wrong during clock-out" },
//       { status: 500 }
//     );
//   }
// });
import { NextResponse } from "next/server";
import { authMiddleware } from "../../../../../lib/authMiddleware";


export const PUT = authMiddleware(async (req, { userId }) => {
  try {
    // ✅ Find the user's active attendance record
    const active = await prisma.attendance.findFirst({
      where: { userId, clockOutTime: null },
    });

    if (!active) {
      return NextResponse.json(
        { message: "No active attendance found to clock out." },
        { status: 404 }
      );
    }

    const now = new Date();

    // ✅ Update the record with clock-out time
    const updated = await prisma.attendance.update({
      where: { id: active.id },
      data: { clockOutTime: now },
    });

    // ✅ Calculate total duration
    const clockIn = new Date(active.clockInTime);
    const diffMs = now.getTime() - clockIn.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    const duration = `${hours}h ${minutes}m`;

    return NextResponse.json(
      {
        message: "Clocked out successfully",
        summary: {
          attendanceId: updated.id,
          clockInTime: clockIn,
          clockOutTime: now,
          totalDuration: duration,
          location: updated.location,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Clock Out Error:", error);
    return NextResponse.json(
      { message: "Something went wrong during clock-out" },
      { status: 500 }
    );
  }
});
