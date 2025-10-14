import { NextResponse } from "next/server";
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


export const GET = authMiddleware(async (req: Request) => {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "5");
    const search = url.searchParams.get("search") || "";
    const sortField = (url.searchParams.get("sortField") || "createdAt") as keyof typeof prisma.party;
    const sortOrder = (url.searchParams.get("sortOrder") || "desc") as "asc" | "desc";

    // Build search filter
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { phone: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { address: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    // Total count
    const total = await prisma.party.count({ where });

    // Fetch paginated data
    const parties = await prisma.party.findMany({
      where,
      orderBy: { [sortField]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({ parties, total }, { status: 200 });
  } catch (error) {
    console.error("Get all parties error:", error);
    return NextResponse.json({ message: "Something went wrong fetching parties" }, { status: 500 });
  }
});


// 📌 POST create new party
export const POST = authMiddleware(async (req) => {
  try {
    const body = await req.json();
    const { name, phone, email, address } = body;

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
