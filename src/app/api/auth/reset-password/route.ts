// src/app/api/auth/reset-password/route.ts
import { NextResponse } from "next/server";

import bcrypt from "bcryptjs";
import prisma from "../../../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const { mobile, otp, newPassword, confirmPassword } = await req.json();

    if (!mobile || !otp || !newPassword || !confirmPassword) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ message: "Passwords do not match" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { mobile: String(mobile) } });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (!user.otp || user.otp !== String(otp)) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    }

    if (user.otpExpiresAt && user.otpExpiresAt < new Date()) {
      return NextResponse.json({ message: "OTP expired" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        otp: null,
        otpExpiresAt: null,
      },
    });

    return NextResponse.json(
      { message: "Password reset successfully. You can now log in." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { message: "Something went wrong resetting password" },
      { status: 500 }
    );
  }
}
