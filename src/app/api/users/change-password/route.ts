
// import { NextRequest, NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import { authMiddleware } from "../../../../../lib/authMiddleware";
// import prisma from "../../../../../lib/prisma";


// export const PUT = authMiddleware(async (req: NextRequest, { userId }) => {
//   try {
//     const { currentPassword, newPassword } = await req.json();

//     if (!currentPassword || !newPassword) {
//       return NextResponse.json(
//         { message: "Both current and new passwords are required" },
//         { status: 400 }
//       );
//     }

//     // Fetch user
//     const user = await prisma.user.findUnique({ where: { id: userId } });
//     if (!user) {
//       return NextResponse.json({ message: "User not found" }, { status: 404 });
//     }

//     // Verify current password
//     const isMatch = await bcrypt.compare(currentPassword, user.password);
//     if (!isMatch) {
//       return NextResponse.json(
//         { message: "Current password is incorrect" },
//         { status: 401 }
//       );
//     }

//     // Hash new password
//     const hashedNewPassword = await bcrypt.hash(newPassword, 10);

//     // Update password
//     await prisma.user.update({
//       where: { id: userId },
//       data: { password: hashedNewPassword },
//     });

//     return NextResponse.json(
//       { message: "Password changed successfully" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Change password error:", error);
//     return NextResponse.json(
//       { message: "Something went wrong changing password" },
//       { status: 500 }
//     );
//   }
// });
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { authMiddleware } from "../../../../../lib/authMiddleware";
import prisma from "../../../../../lib/prisma";


export const PUT = authMiddleware(async (req: NextRequest, { userId }) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = await req.json();

    // 🧩 Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { message: "New passwords do not match" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // 🔍 Find user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, password: true },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 🔑 Verify current password
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return NextResponse.json(
        { message: "Current password is incorrect" },
        { status: 401 }
      );
    }

    // 🔐 Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // 💾 Update user
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    return NextResponse.json(
      { message: "Password changed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { message: "Something went wrong changing password" },
      { status: 500 }
    );
  }
});
