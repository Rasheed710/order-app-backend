// import { NextResponse } from "next/server";
// import { authMiddleware } from "../../../../../lib/authMiddleware";
// import prisma from "../../../../../lib/prisma";

// export const GET = authMiddleware(async (req, { userId }) => {
//   try {
//     const startOfDay = new Date();
//     startOfDay.setHours(0, 0, 0, 0);
//     const endOfDay = new Date();
//     endOfDay.setHours(23, 59, 59, 999);

//     const orders = await prisma.order.findMany({
//       where: {
//         userId,
//         createdAt: { gte: startOfDay, lte: endOfDay },
//       },
//       include: { party: true },
//     });

//     const totalOrders = orders.length;
//     const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);
//     const visitedParties = new Set(orders.map((o) => o.party?.id)).size;

//     return NextResponse.json(
//       { totalOrders, totalSales, visitedParties },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Summary fetch error:", error);
//     return NextResponse.json(
//       { message: "Something went wrong fetching summary" },
//       { status: 500 }
//     );
//   }
// });

import { NextResponse } from "next/server";
import { authMiddleware } from "../../../../../lib/authMiddleware";
import prisma from "../../../../../lib/prisma";


export const GET = authMiddleware(async (req, { userId }) => {
  try {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6); // last 7 days including today

    const records = await prisma.attendance.findMany({
      where: {
        userId,
        clockInTime: {
          gte: new Date(sevenDaysAgo.setHours(0, 0, 0, 0)),
        },
      },
      orderBy: { clockInTime: "asc" },
    });

    const summary = records.map((r) => {
      const clockIn = new Date(r.clockInTime);
      const clockOut = r.clockOutTime ? new Date(r.clockOutTime) : null;

      let duration = "Active";
      if (clockOut) {
        const diffMs = clockOut.getTime() - clockIn.getTime();
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        duration = `${hours}h ${minutes}m`;
      }

      return {
        date: clockIn.toLocaleDateString(),
        clockIn: clockIn.toLocaleTimeString(),
        clockOut: clockOut ? clockOut.toLocaleTimeString() : null,
        duration,
      };
    });

    return NextResponse.json({ summary }, { status: 200 });
  } catch (error) {
    console.error("Weekly attendance fetch error:", error);
    return NextResponse.json(
      { message: "Something went wrong fetching attendance summary" },
      { status: 500 }
    );
  }
});
