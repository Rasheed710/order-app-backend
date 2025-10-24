// import { NextRequest, NextResponse } from "next/server";

// import parseForm from "../../products/route"; // Reuse your form parser
// import path from "path";
// import fs from "fs";
// import sharp from "sharp";
// import { authMiddleware } from "../../../../../lib/authMiddleware";
// import prisma from "../../../../../lib/prisma";

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export const PUT = authMiddleware(async (req: NextRequest, { userId }) => {
//   try {
//     const { fields, files } = await parseForm(req);
//     const { name, email, mobile } = fields;

//     if (!name && !email && !mobile && !files.image) {
//       return NextResponse.json(
//         { message: "No fields provided for update" },
//         { status: 400 }
//       );
//     }

//     const data: any = {};

//     if (name) data.name = String(name);
//     if (email) data.email = String(email);
//     if (mobile) data.mobile = String(mobile);

//     // Check for duplicate email or mobile
//     if (email) {
//       const existing = await prisma.user.findFirst({
//         where: { email: String(email), NOT: { id: userId } },
//       });
//       if (existing) {
//         return NextResponse.json(
//           { message: "Email already in use" },
//           { status: 409 }
//         );
//       }
//     }

//     if (mobile) {
//       const existing = await prisma.user.findFirst({
//         where: { mobile: String(mobile), NOT: { id: userId } },
//       });
//       if (existing) {
//         return NextResponse.json(
//           { message: "Mobile number already in use" },
//           { status: 409 }
//         );
//       }
//     }

//     // Handle profile image update
//     if (files?.image) {
//       const file = Array.isArray(files.image) ? files.image[0] : files.image;
//       const tempPath = file.filepath;
//       const uploadDir = path.join(process.cwd(), "public/uploads");
//       if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

//       const fileName =
//         (file.originalFilename || "profile.png").split(".")[0] +
//         "-" +
//         Date.now() +
//         ".webp";
//       const destPath = path.join(uploadDir, fileName);

//       await sharp(tempPath).webp({ quality: 80 }).toFile(destPath);
//       fs.unlinkSync(tempPath);

//       data.image = `/uploads/${fileName}`;
//     }

//     const updatedUser = await prisma.user.update({
//       where: { id: userId },
//       data,
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         mobile: true,
//         image: true,
//         updatedAt: true,
//       },
//     });

//     return NextResponse.json(
//       { message: "Profile updated successfully", data: updatedUser },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Update profile error:", error);
//     return NextResponse.json(
//       { message: "Something went wrong updating profile" },
//       { status: 500 }
//     );
//   }
// });

import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import parseForm from "../../products/route";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import twilio from "twilio";
import { authMiddleware } from "../../../../../lib/authMiddleware";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const twilioClient = twilio(accountSid, authToken);
const twilioFrom = process.env.TWILIO_FROM!;

export const config = { api: { bodyParser: false } };

// export const PUT = authMiddleware(async (req: NextRequest, context) => {
//   try {
//     const { userId } = context;
//     const { fields, files } = await parseForm(req);
//     const { name, email, mobile } = fields;

//     const user = await prisma.user.findUnique({ where: { id: userId } });
//     if (!user)
//       return NextResponse.json({ message: "User not found" }, { status: 404 });

//     let updatedData: any = {};

//     // ✅ Name / Email update
//     if (name) updatedData.name = String(name);
//     if (email) updatedData.email = String(email);

//     // ✅ Image upload
//     if (files.image) {
//       const file = Array.isArray(files.image) ? files.image[0] : files.image;
//       const uploadDir = path.join(process.cwd(), "public/uploads");
//       if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

//       const fileName =
//         (file.originalFilename || "profile.png").split(".")[0] +
//         "-" +
//         Date.now() +
//         ".webp";
//       const destPath = path.join(uploadDir, fileName);

//       await sharp(file.filepath).webp({ quality: 80 }).toFile(destPath);
//       fs.unlinkSync(file.filepath);

//       updatedData.image = `/uploads/${fileName}`;
//     }

//     // ✅ Mobile number change triggers OTP send (no update yet)
//     if (mobile && String(mobile) !== user.mobile) {
//       const newMobile = String(mobile);
//       const otp = Math.floor(100000 + Math.random() * 900000).toString();
//       const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

//       await prisma.user.update({
//         where: { id: userId },
//         data: { otp, otpExpiresAt },
//       });

//       // Send OTP to new mobile
//       await twilioClient.messages.create({
//         body: `Your verification code is ${otp}`,
//         from: twilioFrom,
//         to: newMobile.startsWith("+") ? newMobile : `+91${newMobile}`,
//       });

//       return NextResponse.json(
//         { message: "OTP sent to your new mobile number. Please verify to update." },
//         { status: 200 }
//       );
//     }

//     // ✅ Direct profile update if no mobile change
//     const updatedUser = await prisma.user.update({
//       where: { id: userId },
//       data: updatedData,
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
//       { message: "Profile updated successfully", user: updatedUser },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Update profile error:", error);
//     return NextResponse.json(
//       { message: "Something went wrong updating profile" },
//       { status: 500 }
//     );
//   }
// });
export const PUT = authMiddleware(async (req: NextRequest, context) => {
  try {
    const { userId } = context;
    const { fields, files } = await parseForm(req);
    const { name, email, mobile } = fields;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    let updatedData: any = {};

    // ✅ Name / Email update
    if (name) updatedData.name = String(name);
    if (email) updatedData.email = String(email);

    // ✅ Image upload
    if (files.image) {
      const file = Array.isArray(files.image) ? files.image[0] : files.image;
      const uploadDir = path.join(process.cwd(), "public/uploads");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

      const fileName =
        (file.originalFilename || "profile.png").split(".")[0] +
        "-" +
        Date.now() +
        ".webp";
      const destPath = path.join(uploadDir, fileName);

      await sharp(file.filepath).webp({ quality: 80 }).toFile(destPath);
      fs.unlinkSync(file.filepath);

      updatedData.image = `/uploads/${fileName}`;
    }

    // ✅ Handle mobile number change via OTP
    if (mobile && String(mobile) !== user.mobile) {
      const newMobile = String(mobile);
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

      await prisma.user.update({
        where: { id: userId },
        data: { otp, otpExpiresAt },
      });

      await twilioClient.messages.create({
        body: `Your verification code is ${otp}`,
        from: twilioFrom,
        to: newMobile.startsWith("+") ? newMobile : `+91${newMobile}`,
      });

      return NextResponse.json(
        { message: "OTP sent to your new mobile number. Please verify to update." },
        { status: 200 }
      );
    }

    // ✅ Direct profile update
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updatedData,
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        image: true,
        role: true,
      },
    });

    // ✅ Build full image URL like in product API
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const userWithFullUrl = {
      ...updatedUser,
      image: updatedUser.image
        ? `${baseUrl}${updatedUser.image}`
        : null,
    };

    return NextResponse.json(
      { message: "Profile updated successfully", user: userWithFullUrl },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { message: "Something went wrong updating profile" },
      { status: 500 }
    );
  }
});

