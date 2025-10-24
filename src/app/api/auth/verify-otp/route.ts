// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";
// import prisma from "../../../../../lib/prisma";

// export async function POST(req: Request) {
//   try {
//     const { mobile, otp } = await req.json();

//     if (!mobile || !otp) {
//       return NextResponse.json({ message: "Mobile and OTP are required" }, { status: 400 });
//     }

//     const user = await prisma.user.findUnique({ where: { mobile } });
//     if (!user) {
//       return NextResponse.json({ message: "User not found" }, { status: 404 });
//     }

//     if (user.isVerified) {
//       return NextResponse.json({ message: "User already verified" }, { status: 400 });
//     }

//     if (user.otp !== otp) {
//       return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
//     }

//     if (user.otpExpiresAt && user.otpExpiresAt < new Date()) {
//       return NextResponse.json({ message: "OTP expired" }, { status: 400 });
//     }

//     // Mark user verified
//     const updatedUser = await prisma.user.update({
//       where: { id: user.id },
//       data: {
//         isVerified: true,
//         otp: null,
//         otpExpiresAt: null,
//       },
//     });

//     // Generate JWT
//     const token = jwt.sign(
//       { userId: updatedUser.id, email: updatedUser.email, role: updatedUser.role },
//       process.env.JWT_SECRET!,
//       { expiresIn: "1h" }
//     );

//     return NextResponse.json({
//       message: "OTP verified successfully",
//       token,
//       user: {
//         id: updatedUser.id,
//         name: updatedUser.name,
//         email: updatedUser.email,
//         mobile: updatedUser.mobile,
//         image: updatedUser.image,
//         role: updatedUser.role,
//       },
//     });
//   } catch (error: any) {
//     console.error("OTP verification error:", error);
//     return NextResponse.json({ message: "Something went wrong during OTP verification" }, { status: 500 });
//   }
// }
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "../../../../../lib/prisma";

// export async function POST(req: Request) {
//   try {
//     const { mobile, otp } = await req.json();

//     if (!mobile || !otp) {
//       return NextResponse.json(
//         { message: "Mobile and OTP are required" },
//         { status: 400 }
//       );
//     }

//     const user = await prisma.user.findUnique({ where: { mobile } });
//     if (!user) {
//       return NextResponse.json({ message: "User not found" }, { status: 404 });
//     }

//     if (user.isVerified) {
//       return NextResponse.json({ message: "User already verified" }, { status: 400 });
//     }

//     if (!user.otp || String(user.otp) !== String(otp)) {
//       return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
//     }

//     if (user.otpExpiresAt && user.otpExpiresAt < new Date()) {
//       return NextResponse.json({ message: "OTP expired" }, { status: 400 });
//     }

//     // Mark user as verified and clear OTP
//     const updatedUser = await prisma.user.update({
//       where: { id: user.id },
//       data: {
//         isVerified: true,
//         otp: null,
//         otpExpiresAt: null,
//       },
//     });

//     // Generate access token (short-lived)
//     const accessToken = jwt.sign(
//       { userId: updatedUser.id, email: updatedUser.email, role: updatedUser.role },
//       process.env.JWT_SECRET!,
//       { expiresIn: "15m" }
//     );

//     // Generate refresh token (long-lived)
//     const refreshToken = jwt.sign(
//       { userId: updatedUser.id },
//       process.env.JWT_REFRESH_SECRET!,
//       { expiresIn: "7d" }
//     );

//     // Save refresh token in DB
//     await prisma.user.update({
//       where: { id: updatedUser.id },
//       data: { refreshToken },
//     });

//     return NextResponse.json({
//       message: "OTP verified successfully",
//       accessToken,
//       refreshToken,
//       user: {
//         id: updatedUser.id,
//         name: updatedUser.name,
//         email: updatedUser.email,
//         mobile: updatedUser.mobile,
//         image: updatedUser.image,
//         role: updatedUser.role,
//       },
//     });
//   } catch (error: any) {
//     console.error("OTP verification error:", error);
//     return NextResponse.json(
//       { message: "Something went wrong during OTP verification" },
//       { status: 500 }
//     );
//   }
// }
export async function POST(req: Request) {
  try {
    const { mobile, otp } = await req.json();

    if (!mobile || !otp) {
      return NextResponse.json(
        { message: "Mobile and OTP are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { mobile } });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json(
        { message: "User already verified" },
        { status: 400 }
      );
    }

    if (!user.otp || String(user.otp) !== String(otp)) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    }

    if (user.otpExpiresAt && user.otpExpiresAt < new Date()) {
      return NextResponse.json({ message: "OTP expired" }, { status: 400 });
    }

    // ✅ Mark user as verified and clear OTP
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        otp: null,
        otpExpiresAt: null,
      },
    });

    // ✅ Generate access + refresh tokens
    const accessToken = jwt.sign(
      { userId: updatedUser.id, email: updatedUser.email, role: updatedUser.role },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { userId: updatedUser.id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "7d" }
    );

    await prisma.user.update({
      where: { id: updatedUser.id },
      data: { refreshToken },
    });

    // ✅ Append base URL to image
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const userWithFullUrl = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      mobile: updatedUser.mobile,
      image: updatedUser.image
        ? `${baseUrl}${updatedUser.image}`
        : null,
      role: updatedUser.role,
    };

    return NextResponse.json({
      message: "OTP verified successfully",
      accessToken,
      refreshToken,
      user: userWithFullUrl,
    });
  } catch (error: any) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { message: "Something went wrong during OTP verification" },
      { status: 500 }
    );
  }
}


