// import { NextResponse } from "next/server";
// import { authMiddleware } from "../../../../lib/authMiddleware";
// import prisma from "../../../../lib/prisma";

// export const POST = authMiddleware(async (req, { userId }) => {
//   try {
//     const { location } = await req.json();

//     // ✅ Check if already clocked in today
//     const existing = await prisma.attendance.findFirst({
//       where: {
//         userId,
//         clockOutTime: null,
//       },
//     });

//     if (existing) {
//       return NextResponse.json(
//         { message: "Already clocked in today" },
//         { status: 400 }
//       );
//     }

//     const attendance = await prisma.attendance.create({
//       data: {
//         userId,
//         location: location || null,
//       },
//     });

//     return NextResponse.json(
//       { message: "Clocked in successfully", attendance },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Clock In Error:", error);
//     return NextResponse.json(
//       { message: "Something went wrong during clock-in" },
//       { status: 500 }
//     );
//   }
// });

import { NextResponse } from "next/server";
import { authMiddleware } from "../../../../lib/authMiddleware";
import prisma from "../../../../lib/prisma";

// export const POST = authMiddleware(async (req, { userId }) => {
//   try {
//     const body = await req.json();
//     let { location, latitude, longitude } = body;

//     // 🧩 Normalize location value
//     // Case 1: location sent as string "37.7858, -122.4064"
//     // Case 2: location sent as { latitude, longitude }
//     // Case 3: location sent as plain name string
//     if (latitude && longitude) {
//       location = `${latitude}, ${longitude}`;
//     } else if (typeof location === "object" && location.latitude && location.longitude) {
//       location = `${location.latitude}, ${location.longitude}`;
//     } else if (typeof location !== "string") {
//       location = null;
//     }

//     // ✅ Check if already clocked in today (no open attendance)
//     const existing = await prisma.attendance.findFirst({
//       where: {
//         userId,
//         clockOutTime: null,
//       },
//     });

//     if (existing) {
//       return NextResponse.json(
//         { message: "Already clocked in today" },
//         { status: 400 }
//       );
//     }

//     // ✅ Create attendance
//     const attendance = await prisma.attendance.create({
//       data: {
//         userId,
//         location,
//       },
//     });

//     return NextResponse.json(
//       { message: "Clocked in successfully", attendance },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Clock In Error:", error);
//     return NextResponse.json(
//       { message: "Something went wrong during clock-in" },
//       { status: 500 }
//     );
//   }
// });
export const POST = authMiddleware(async (req, { userId }) => {
  try {
    const body = await req.json();
    let { location, latitude, longitude } = body;

    // 🧩 Normalize location input
    if (latitude && longitude) {
      location = `${latitude}, ${longitude}`;
    } else if (
      typeof location === "object" &&
      location?.latitude &&
      location?.longitude
    ) {
      location = `${location.latitude}, ${location.longitude}`;
    } else if (typeof location !== "string") {
      location = null;
    }

    // ✅ Check for any *active* attendance (not clocked out yet)
    const activeAttendance = await prisma.attendance.findFirst({
      where: { userId, clockOutTime: null },
    });

    if (activeAttendance) {
      // ⚙️ Automatically clock out the previous record
      await prisma.attendance.update({
        where: { id: activeAttendance.id },
        data: { clockOutTime: new Date() },
      });
      console.log(
        `User ${userId} had active attendance. Auto clocked out before new session.`
      );
    }

    // ✅ Create new attendance
    const attendance = await prisma.attendance.create({
      data: {
        userId,
        location,
        clockInTime: new Date(),
      },
    });

    return NextResponse.json(
      {
        message: activeAttendance
          ? "Previous session closed. Clocked in for a new session."
          : "Clocked in successfully",
        attendance,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Clock In Error:", error);
    return NextResponse.json(
      { message: "Something went wrong during clock-in" },
      { status: 500 }
    );
  }
});