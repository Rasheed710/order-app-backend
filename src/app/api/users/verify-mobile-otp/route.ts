// import { NextRequest, NextResponse } from "next/server";
// import { authMiddleware } from "../../../../../lib/authMiddleware";
// import prisma from "../../../../../lib/prisma";


// export const POST = authMiddleware(async (req: NextRequest, { userId }) => {
//   try {
//     const { otp } = await req.json();

//     if (!otp) {
//       return NextResponse.json({ message: "OTP is required" }, { status: 400 });
//     }

//     // Find user and pending verification data
//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//       select: {
//         id: true,
//         mobile: true,
//         pendingMobile: true,
//         mobileOtp: true,
//         mobileOtpExpiresAt: true,
//       },
//     });

//     if (!user || !user.pendingMobile) {
//       return NextResponse.json(
//         { message: "No mobile verification in progress" },
//         { status: 400 }
//       );
//     }

//     // Validate OTP
//     if (
//       !user.mobileOtp ||
//       user.mobileOtp !== String(otp) ||
//       !user.mobileOtpExpiresAt ||
//       user.mobileOtpExpiresAt < new Date()
//     ) {
//       return NextResponse.json({ message: "Invalid or expired OTP" }, { status: 400 });
//     }

//     // ✅ Update mobile and clear OTP data
//     const updatedUser = await prisma.user.update({
//       where: { id: userId },
//       data: {
//         mobile: user.pendingMobile,
//         pendingMobile: null,
//         mobileOtp: null,
//         mobileOtpExpiresAt: null,
//       },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         mobile: true,
//         image: true,
//       },
//     });

//     return NextResponse.json(
//       {
//         message: "Mobile number verified successfully",
//         user: updatedUser,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Verify mobile OTP error:", error);
//     return NextResponse.json(
//       { message: "Something went wrong verifying mobile OTP" },
//       { status: 500 }
//     );
//   }
// });

import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { authMiddleware } from "../../../../../lib/authMiddleware";

// export const POST = authMiddleware(async (req, context) => {
//   try {
//     const { userId } = context;
//     const { mobile, otp } = await req.json();

//     if (!mobile || !otp) {
//       return NextResponse.json(
//         { message: "Mobile and OTP are required" },
//         { status: 400 }
//       );
//     }

//     const user = await prisma.user.findUnique({ where: { id: userId } });
//     if (!user)
//       return NextResponse.json({ message: "User not found" }, { status: 404 });

//     if (!user.otp || user.otp !== String(otp))
//       return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });

//     if (user.otpExpiresAt && user.otpExpiresAt < new Date())
//       return NextResponse.json({ message: "OTP expired" }, { status: 400 });

//     const updatedUser = await prisma.user.update({
//       where: { id: userId },
//       data: {
//         mobile: String(mobile),
//         otp: null,
//         otpExpiresAt: null,
//       },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         mobile: true,
//         image: true,
//         role: true,
//       },
//     });

//     return NextResponse.json(
//       { message: "Mobile number verified successfully", user: updatedUser },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Verify mobile OTP error:", error);
//     return NextResponse.json(
//       { message: "Something went wrong verifying mobile OTP" },
//       { status: 500 }
//     );
//   }
// });
export const POST = authMiddleware(async (req, context) => {
  try {
    const { userId } = context;
    const { mobile, otp } = await req.json();

    // ✅ Basic validation
    if (!mobile || !otp) {
      return NextResponse.json(
        { message: "Mobile and OTP are required" },
        { status: 400 }
      );
    }

    // ✅ Find user
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // ✅ Validate OTP
    if (!user.otp || user.otp !== String(otp)) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    }

    if (user.otpExpiresAt && user.otpExpiresAt < new Date()) {
      return NextResponse.json({ message: "OTP expired" }, { status: 400 });
    }

    // ✅ Update mobile number and clear OTP fields
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        mobile: String(mobile),
        otp: null,
        otpExpiresAt: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        image: true,
        role: true,
      },
    });

    // ✅ Add full base URL for image (for React Native)
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const userWithFullUrl = {
      ...updatedUser,
      image: updatedUser.image ? `${baseUrl}${updatedUser.image}` : null,
    };

    return NextResponse.json(
      {
        message: "Mobile number verified successfully",
        user: userWithFullUrl,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verify mobile OTP error:", error);
    return NextResponse.json(
      { message: "Something went wrong verifying mobile OTP" },
      { status: 500 }
    );
  }
});

