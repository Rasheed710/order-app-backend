// import { NextResponse } from "next/server";
// import { authMiddleware } from "../../../../../lib/authMiddleware";
// import prisma from "../../../../../lib/prisma";

// export const PUT = authMiddleware(async (req, { params }) => {
//   try {
//     const body = await req.json();
//     const { name, phone, email, address } = body;

//     if (!name || !phone) {
//       return NextResponse.json({ message: "Name and phone are required" }, { status: 400 });
//     }

//     const updatedParty = await prisma.party.update({
//       where: { id: params.id },
//       data: { name, phone, email: email || null, address: address || null },
//     });

//     return NextResponse.json(updatedParty, { status: 200 });
//   } catch (error) {
//     console.error("Update party error:", error);
//     return NextResponse.json({ message: "Failed to update party" }, { status: 500 });
//   }
// });

// export const DELETE = authMiddleware(async (_req, { params }) => {
//   try {
//     await prisma.party.delete({ where: { id: params.id } });
//     return NextResponse.json({ message: "Party deleted successfully" }, { status: 200 });
//   } catch (error) {
//     console.error("Delete party error:", error);
//     return NextResponse.json({ message: "Failed to delete party" }, { status: 500 });
//   }
// });
import { NextResponse } from "next/server";
import { authMiddleware } from "../../../../../lib/authMiddleware";
import prisma from "../../../../../lib/prisma";

export const PUT = authMiddleware(async (req, { params, userId, userRole }) => {
  try {
    const body = await req.json();
    const { name, phone, email, address } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { message: "Name and phone are required" },
        { status: 400 }
      );
    }

    // 🧭 Check if party exists
    const party = await prisma.party.findUnique({ where: { id: params.id } });
    if (!party) {
      return NextResponse.json({ message: "Party not found" }, { status: 404 });
    }

    // 🛑 Restrict editing to owner or admin
    if (userRole !== "ADMIN" && party.createdById !== userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const updatedParty = await prisma.party.update({
      where: { id: params.id },
      data: { name, phone, email: email || null, address: address || null },
    });

    return NextResponse.json(updatedParty, { status: 200 });
  } catch (error) {
    console.error("Update party error:", error);
    return NextResponse.json({ message: "Failed to update party" }, { status: 500 });
  }
});
export const DELETE = authMiddleware(async (_req, { params, userId, userRole }) => {
  try {
    const party = await prisma.party.findUnique({ where: { id: params.id } });
    if (!party) {
      return NextResponse.json({ message: "Party not found" }, { status: 404 });
    }

    if (userRole !== "ADMIN" && party.createdById !== userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    await prisma.party.delete({ where: { id: params.id } });

    return NextResponse.json(
      { message: "Party deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete party error:", error);
    return NextResponse.json({ message: "Failed to delete party" }, { status: 500 });
  }
});
