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

    const user = await prisma.user.findUnique({ where: { mobile } });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json({ message: "User already verified" }, { status: 400 });
    }

    // ✅ Rate limiting: only allow resend every 60 seconds
    const now = new Date();
    if (user.otpLastSentAt && now.getTime() - user.otpLastSentAt.getTime() < 60 * 1000) {
      return NextResponse.json({ message: "You can resend OTP after 60 seconds" }, { status: 429 });
    }

    // ✅ Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes

    // ✅ Update user with new OTP and last sent timestamp
    await prisma.user.update({
      where: { id: user.id },
      data: {
        otp,
        otpExpiresAt,
        otpLastSentAt: now,
      },
    });

    // ✅ Send OTP via Twilio
    await twilioClient.messages.create({
      body: `Your verification code is ${otp}`,
      from: twilioFrom,
      to: String(mobile).startsWith("+") ? String(mobile) : `+91${mobile}`,
    });

    return NextResponse.json({ message: "OTP resent successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Resend OTP error:", error);
    return NextResponse.json({ message: "Something went wrong resending OTP" }, { status: 500 });
  }
}
