// import { NextResponse } from "next/server";
// import { authMiddleware } from "../../../../../lib/authMiddleware";
// import prisma from "../../../../../lib/prisma";


// export const GET = authMiddleware(async (req, { userRole }) => {
//   if (userRole !== "ADMIN") {
//     return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
//   }

//   try {
//     const startOfDay = new Date();
//     startOfDay.setHours(0, 0, 0, 0);
//     const endOfDay = new Date();
//     endOfDay.setHours(23, 59, 59, 999);

//     const attendances = await prisma.attendance.findMany({
//       where: {
//         clockInTime: { gte: startOfDay, lte: endOfDay },
//       },
//       include: {
//         user: { select: { id: true, name: true, email: true } },
//       },
//       orderBy: { clockInTime: "desc" },
//     });

//     return NextResponse.json(attendances, { status: 200 });
//   } catch (error) {
//     console.error("Attendance fetch error:", error);
//     return NextResponse.json(
//       { message: "Failed to fetch attendance" },
//       { status: 500 }
//     );
//   }
// });
import { NextResponse } from "next/server";
import { authMiddleware } from "../../../../../lib/authMiddleware";
import prisma from "../../../../../lib/prisma";


// export const GET = authMiddleware(async (req, { userRole }) => {
//   try {
//     if (userRole !== "ADMIN") {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
//     }

//     const attendances = await prisma.attendance.findMany({
//       include: {
//         user: { select: { id: true, name: true, email: true } },
//       },
//       orderBy: { clockInTime: "desc" },
//     });

//     // ✅ Add derived fields like breakDuration and activeBreak
//     const enriched = attendances.map((a) => {
//       let breakDuration = null;
//       if (a.breakStart && a.breakEnd) {
//         const diffMs = new Date(a.breakEnd).getTime() - new Date(a.breakStart).getTime();
//         const mins = Math.floor(diffMs / 60000);
//         const hours = Math.floor(mins / 60);
//         breakDuration = `${hours}h ${mins % 60}m`;
//       }

//       return {
//         ...a,
//         breakDuration,
//       };
//     });

//     return NextResponse.json(enriched, { status: 200 });
//   } catch (error) {
//     console.error("Admin Attendance Fetch Error:", error);
//     return NextResponse.json({ message: "Failed to fetch attendance" }, { status: 500 });
//   }
// });


export const GET = authMiddleware(async (req, { userRole }) => {
  try {
    if (userRole !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // ✅ Fetch all attendance entries with user info
    const attendances = await prisma.attendance.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { clockInTime: "desc" },
    });

    const enriched = await Promise.all(
      attendances.map(async (a) => {
        // 🕓 Calculate break duration
        let breakDuration = null;
        if (a.breakStart && a.breakEnd) {
          const diffMs = new Date(a.breakEnd).getTime() - new Date(a.breakStart).getTime();
          const mins = Math.floor(diffMs / 60000);
          const hours = Math.floor(mins / 60);
          breakDuration = `${hours}h ${mins % 60}m`;
        }

        // 📅 Define date range for this attendance day
        const startOfDay = new Date(a.clockInTime);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(startOfDay);
        endOfDay.setHours(23, 59, 59, 999);

        // 🧮 Fetch orders placed by this user on the same day
        const orders = await prisma.order.findMany({
          where: {
            userId: a.userId,
            createdAt: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
          select: { id: true, total: true },
        });

        const totalOrders = orders.length;
        const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);

        return {
          ...a,
          totalOrders,
          totalSales,
          breakDuration,
        };
      })
    );

    return NextResponse.json(enriched, { status: 200 });
  } catch (error) {
    console.error("Admin Attendance Fetch Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch attendance" },
      { status: 500 }
    );
  }
});

