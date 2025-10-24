// src/app/api/auth/forgot-password/route.ts
import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import twilio from "twilio";
const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const twilioClient = twilio(accountSid, authToken);
const twilioFrom = process.env.TWILIO_FROM!;
export async function POST(req: Request) {
  try {
    const { mobile } = await req.json();

    if (!mobile) {
      return NextResponse.json({ message: "Mobile number is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { mobile: String(mobile) } });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Generate OTP and expiry
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    // Save OTP in DB
    await prisma.user.update({
      where: { id: user.id },
      data: { otp, otpExpiresAt },
    });

    // Send OTP via SMS
    await twilioClient.messages.create({
      body: `Your password reset code is ${otp}`,
      from: twilioFrom,
      to: String(mobile).startsWith("+") ? String(mobile) : `+91${mobile}`,
    });

    return NextResponse.json(
      { message: "OTP sent to your mobile number" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: "Something went wrong while sending OTP" },
      { status: 500 }
    );
  }
}
