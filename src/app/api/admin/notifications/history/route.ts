// import { NextResponse } from "next/server";
// import { adminMiddleware } from "../../../../../../lib/authMiddleware";
// import prisma from "../../../../../../lib/prisma";


// export const GET = adminMiddleware(async (req) => {
//   try {
//     const { searchParams } = new URL(req.url);

//     const page = parseInt(searchParams.get("page") || "1", 10);
//     const limit = parseInt(searchParams.get("limit") || "10", 10);
//     const search = searchParams.get("search")?.trim() || "";
//     const senderId = searchParams.get("senderId") || "";
//     const date = searchParams.get("date") || "";

//     const skip = (page - 1) * limit;

//     // ✅ Build filters dynamically
//     const filters: any = {};

//     if (search) {
//       filters.OR = [
//         { title: { contains: search, mode: "insensitive" } },
//         { body: { contains: search, mode: "insensitive" } },
//       ];
//     }

//     if (senderId) filters.createdBy = senderId;

//     if (date) {
//       const startOfDay = new Date(date);
//       startOfDay.setHours(0, 0, 0, 0);
//       const endOfDay = new Date(date);
//       endOfDay.setHours(23, 59, 59, 999);
//       filters.createdAt = { gte: startOfDay, lte: endOfDay };
//     }

//     // ✅ Query data
//     const totalCount = await prisma.notificationLog.count({ where: filters });
//     const logs = await prisma.notificationLog.findMany({
//       where: filters,
//       include: {
//         sender: { select: { id: true, name: true, email: true } },
//       },
//       orderBy: { createdAt: "desc" },
//       skip,
//       take: limit,
//     });

//     const totalPages = Math.ceil(totalCount / limit);

//     return NextResponse.json(
//       { data: logs, meta: { totalCount, totalPages, page, limit } },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Fetch notification history error:", error);
//     return NextResponse.json({ message: "Failed to fetch history" }, { status: 500 });
//   }
// });

import { NextResponse } from "next/server";
import { adminMiddleware } from "../../../../../../lib/authMiddleware";
import prisma from "../../../../../../lib/prisma";

export const GET = adminMiddleware(async (req) => {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search")?.trim() || "";
    const senderId = searchParams.get("senderId")?.trim() || "";
    const date = searchParams.get("date") || "";

    const skip = (page - 1) * limit;

    const filters: any = {};

    // 🔹 Keyword search
    if (search) {
      filters.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { body: { contains: search, mode: "insensitive" } },
      ];
    }

    // 🔹 Sender filter
    if (senderId !== "") {
      filters.createdBy = senderId;
    }

    // 🔹 Date filter
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      filters.createdAt = { gte: startOfDay, lte: endOfDay };
    }

    const totalCount = await prisma.notificationLog.count({ where: filters });
    const logs = await prisma.notificationLog.findMany({
      where: filters,
      include: { sender: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json(
      { data: logs, meta: { totalCount, totalPages, page, limit } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch notification history error:", error);
    return NextResponse.json({ message: "Failed to fetch history" }, { status: 500 });
  }
});
