import { NextRequest, NextResponse } from "next/server";
import { authMiddleware, adminMiddleware } from "../../../../lib/authMiddleware";
import prisma from "../../../../lib/prisma";

// 📌 GET all parties
// export const GET = authMiddleware(async () => {
//   try {
//     const parties = await prisma.party.findMany({
//       orderBy: { createdAt: "desc" },
//     });
//     return NextResponse.json(parties, { status: 200 });
//   } catch (error) {
//     console.error("Get all parties error:", error);
//     return NextResponse.json(
//       { message: "Something went wrong fetching parties" },
//       { status: 500 }
//     );
//   }
// });


// export const GET = authMiddleware(async (req: Request) => {
//   try {
//     const url = new URL(req.url);
//     const page = parseInt(url.searchParams.get("page") || "1");
//     const limit = parseInt(url.searchParams.get("limit") || "5");
//     const search = url.searchParams.get("search") || "";
//     const sortField = (url.searchParams.get("sortField") || "createdAt") as keyof typeof prisma.party;
//     const sortOrder = (url.searchParams.get("sortOrder") || "desc") as "asc" | "desc";

//     // Build search filter
//     const where = search
//       ? {
//           OR: [
//             { name: { contains: search, mode: "insensitive" } },
//             { phone: { contains: search, mode: "insensitive" } },
//             { email: { contains: search, mode: "insensitive" } },
//             { address: { contains: search, mode: "insensitive" } },
//           ],
//         }
//       : {};

//     // Total count
//     const total = await prisma.party.count({ where });

//     // Fetch paginated data
//     const parties = await prisma.party.findMany({
//       where,
//       orderBy: { [sortField]: sortOrder },
//       skip: (page - 1) * limit,
//       take: limit,
//     });

//     return NextResponse.json({ parties, total }, { status: 200 });
//   } catch (error) {
//     console.error("Get all parties error:", error);
//     return NextResponse.json({ message: "Something went wrong fetching parties" }, { status: 500 });
//   }
// });
// export const GET = authMiddleware(async (req: Request, context) => {
//   try {
//     const url = new URL(req.url);
//     const page = parseInt(url.searchParams.get("page") || "1");
//     const limit = parseInt(url.searchParams.get("limit") || "5");
//     const search = url.searchParams.get("search") || "";
//     const sortField = url.searchParams.get("sortField") || "createdAt";
//     const sortOrder = (url.searchParams.get("sortOrder") || "desc") as "asc" | "desc";

//     const userId = context.userId;
//     const userRole = context.userRole;

//     const where: any = search
//       ? {
//           OR: [
//             { name: { contains: search, mode: "insensitive" } },
//             { phone: { contains: search, mode: "insensitive" } },
//             { email: { contains: search, mode: "insensitive" } },
//             { address: { contains: search, mode: "insensitive" } },
//           ],
//         }
//       : {};

//     // 🧠 Role based filter
//     if (userRole !== "ADMIN") {
//       where.createdById = userId; // salesman can see only their own parties
//     }

//     const total = await prisma.party.count({ where });
//     const parties = await prisma.party.findMany({
//       where,
//       orderBy: { [sortField]: sortOrder },
//       skip: (page - 1) * limit,
//       take: limit,
//     });

//     return NextResponse.json({ parties, total }, { status: 200 });
//   } catch (error) {
//     console.error("Get all parties error:", error);
//     return NextResponse.json({ message: "Something went wrong fetching parties" }, { status: 500 });
//   }
// });

// export const GET = authMiddleware(async (req: NextRequest, context) => {
//   try {
//     const url = new URL(req.url);
//     const page = parseInt(url.searchParams.get("page") || "1");
//     const limit = parseInt(url.searchParams.get("limit") || "5");
//     const search = url.searchParams.get("search") || "";
//     const sortField = url.searchParams.get("sortField") || "createdAt";
//     const sortOrder = (url.searchParams.get("sortOrder") || "desc") as "asc" | "desc";

//     const { userId, userRole } = context;

//     const where: any = {};

//     // 🔍 Search filter
//     if (search) {
//       where.OR = [
//         { name: { contains: search, mode: "insensitive" } },
//         { phone: { contains: search, mode: "insensitive" } },
//         { email: { contains: search, mode: "insensitive" } },
//         { address: { contains: search, mode: "insensitive" } },
//       ];
//     }

//     // 🧠 Role-based restriction
//     if (userRole !== "ADMIN") {
//       where.createdById = userId; // non-admin users see only their parties
//     }

//     // 📊 Count total
//     const totalCount = await prisma.party.count({ where });

//     // 📦 Fetch paginated data
//     const parties = await prisma.party.findMany({
//       where,
//       orderBy: { [sortField]: sortOrder },
//       skip: (page - 1) * limit,
//       take: limit,
//       select: {
//         id: true,
//         name: true,
//         phone: true,
//         email: true,
//         address: true,
//         createdAt: true,
//       },
//     });

//     // 📑 Meta info for pagination
//     const totalPages = Math.ceil(totalCount / limit);
//     const hasNextPage = page < totalPages;

//     // ✅ Match mobile structure { data, meta }
//     return NextResponse.json(
//       {
//         data: parties,
//         meta: {
//           totalCount,
//           totalPages,
//           page,
//           limit,
//           hasNextPage,
//         },
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Get all parties error:", error);
//     return NextResponse.json(
//       { message: "Something went wrong fetching parties" },
//       { status: 500 }
//     );
//   }
// });

export const GET = authMiddleware(async (req: NextRequest, context) => {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "5");
    const search = url.searchParams.get("search") || "";
    const sortField = url.searchParams.get("sortField") || "createdAt";
    const sortOrder = (url.searchParams.get("sortOrder") || "desc") as "asc" | "desc";

    const { userId, userRole } = context;
    console.log("🔍 Auth Context:", { userId, userRole });

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
      ];
    }

    // 🧠 Make role check case-insensitive
    if (userRole.toUpperCase() !== "ADMIN") {
      where.createdById = userId;
    }

    const totalCount = await prisma.party.count({ where });

    const parties = await prisma.party.findMany({
      where,
      orderBy: { [sortField]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        address: true,
        createdAt: true,
      },
    });

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;

    return NextResponse.json(
      {
        data: parties,
        meta: { totalCount, totalPages, page, limit, hasNextPage },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get all parties error:", error);
    return NextResponse.json(
      { message: "Something went wrong fetching parties" },
      { status: 500 }
    );
  }
});


// 📌 POST create new party
// export const POST = authMiddleware(async (req:Request,context) => {
//   try {
//     const body = await req.json();
//     const { name, phone, email, address } = body;
//     const user = context.user; 
//     if (!name || !phone) {
//       return NextResponse.json(
//         { message: "Name and phone are required" },
//         { status: 400 }
//       );
//     }

//     const newParty = await prisma.party.create({
//       data: {
//         name,
//         phone,
//         email: email || null,
//         address: address || null,
//         createdById: user.id, 
//       },
//     });

//     return NextResponse.json(newParty, { status: 201 });
//   } catch (error) {
//     console.error("Add party error:", error);
//     return NextResponse.json(
//       { message: "Something went wrong creating the party" },
//       { status: 500 }
//     );
//   }
// });
export const POST = authMiddleware(async (req: Request, context) => {
  try {
    const body = await req.json();
    const { name, phone, email, address } = body;

    const userId = context.userId;

    if (!name || !phone) {
      return NextResponse.json(
        { message: "Name and phone are required" },
        { status: 400 }
      );
    }

    const newParty = await prisma.party.create({
      data: {
        name,
        phone,
        email: email || null,
        address: address || null,
        createdById: userId,  // ✅ use userId from token
      },
    });

    return NextResponse.json(newParty, { status: 201 });
  } catch (error) {
    console.error("Add party error:", error);
    return NextResponse.json(
      { message: "Something went wrong creating the party" },
      { status: 500 }
    );
  }
});

