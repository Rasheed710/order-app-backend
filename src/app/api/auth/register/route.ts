// // // // pages/api/auth/register.ts
// // // import type { NextApiRequest, NextApiResponse } from 'next'
// // // import bcrypt from 'bcryptjs'
// // // import jwt from 'jsonwebtoken'
// // // import prisma from '../../../../lib/prisma'

// // // export default async function register(req: NextApiRequest, res: NextApiResponse) {
// // //   if (req.method !== 'POST') {
// // //     return res.status(405).json({ message: 'Method not allowed' })
// // //   }

// // //   const { email, password, name } = req.body

// // //   if (!email || !password) {
// // //     return res.status(400).json({ message: 'Email and password are required' })
// // //   }

// // //   try {
// // //     const existingUser = await prisma.user.findUnique({ where: { email } })
// // //     if (existingUser) {
// // //       return res.status(409).json({ message: 'User with this email already exists' })
// // //     }

// // //     const hashedPassword = await bcrypt.hash(password, 10)

// // //     const newUser = await prisma.user.create({
// // //       data: {
// // //         email,
// // //         password: hashedPassword,
// // //         name: name || '',
// // //         role: 'CUSTOMER', // Default role for new registrations
// // //       },
// // //     })

// // //     const token = jwt.sign(
// // //       { userId: newUser.id, email: newUser.email, role: newUser.role },
// // //       process.env.JWT_SECRET!,
// // //       { expiresIn: '1h' }
// // //     )

// // //     res.status(201).json({
// // //       message: 'User registered successfully',
// // //       token,
// // //       user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role },
// // //     })
// // //   } catch (error) {
// // //     console.error('Registration error:', error)
// // //     res.status(500).json({ message: 'Something went wrong during registration' })
// // //   }
// // // }
// // // app/api/auth/register/route.ts
// // import { NextRequest, NextResponse } from "next/server";
// // import bcrypt from "bcryptjs";
// // import jwt from "jsonwebtoken";
// // import prisma from "../../../../../lib/prisma";

// // export async function POST(req: NextRequest) {
// //   try {
// //     const { email, password, name } = await req.json();

// //     if (!email || !password) {
// //       return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
// //     }

// //     const existingUser = await prisma.user.findUnique({ where: { email } });
// //     if (existingUser) {
// //       return NextResponse.json({ message: "User with this email already exists" }, { status: 409 });
// //     }

// //     const hashedPassword = await bcrypt.hash(password, 10);

// //     const newUser = await prisma.user.create({
// //       data: {
// //         email,
// //         password: hashedPassword,
// //         name: name || "",
// //         role: "CUSTOMER",
// //       },
// //     });

// //     const token = jwt.sign(
// //       { userId: newUser.id, email: newUser.email, role: newUser.role },
// //       process.env.JWT_SECRET!,
// //       { expiresIn: "1h" }
// //     );

// //     return NextResponse.json({
// //       message: "User registered successfully",
// //       token,
// //       user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role },
// //     }, { status: 201 });

// //   } catch (error: any) {
// //     console.error("Registration error:", error);
// //     return NextResponse.json({ message: "Something went wrong during registration" }, { status: 500 });
// //   }
// // }
// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import prisma from "../../../../../lib/prisma";
// import path from "path";
// import fs from "fs";
// import sharp from "sharp";
// import parseForm from "../../products/route";
//  // adjust path if needed

// export const config = {
//   api: {
//     bodyParser: false, // Important for formidable
//   },
// };

// export async function POST(req: Request) {
//   try {
//     // 🔹 Parse multipart form data
//     const { fields, files } = await parseForm(req);

//     const { name, email, password, confirmPassword, mobile } = fields;
//     let imageUrl = "";

//     // ✅ Validate fields
//     if (!email || !password || !confirmPassword || !name || !mobile) {
//       return NextResponse.json(
//         { message: "All fields are required" },
//         { status: 400 }
//       );
//     }

//     if (password !== confirmPassword) {
//       return NextResponse.json(
//         { message: "Passwords do not match" },
//         { status: 400 }
//       );
//     }

//     // ✅ Check existing user
//     const existingUser = await prisma.user.findUnique({ where: { email: String(email) } });
//     if (existingUser) {
//       return NextResponse.json(
//         { message: "User with this email already exists" },
//         { status: 409 }
//       );
//     }

//     // ✅ Handle image upload (convert to .webp)
//     if (files.image) {
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

//       await sharp(tempPath)
//         .webp({ quality: 80 })
//         .toFile(destPath);

//       fs.unlinkSync(tempPath); // cleanup temp file
//       imageUrl = `/uploads/${fileName}`;
//     }

//     // ✅ Hash password
//     const hashedPassword = await bcrypt.hash(String(password), 10);

//     // ✅ Create user
//     const newUser = await prisma.user.create({
//       data: {
//         name: String(name),
//         email: String(email),
//         password: hashedPassword,
//         mobile: String(mobile),
//         image: imageUrl,
//         role: "CUSTOMER",
//       },
//     });

//     // ✅ Generate JWT
//     const token = jwt.sign(
//       { userId: newUser.id, email: newUser.email, role: newUser.role },
//       process.env.JWT_SECRET!,
//       { expiresIn: "1h" }
//     );

//     return NextResponse.json(
//       {
//         message: "User registered successfully",
//         token,
//         user: {
//           id: newUser.id,
//           name: newUser.name,
//           email: newUser.email,
//           mobile: newUser.mobile,
//           image: newUser.image,
//           role: newUser.role,
//         },
//       },
//       { status: 201 }
//     );
//   } catch (error: any) {
//     console.error("Registration error:", error);
//     return NextResponse.json(
//       { message: "Something went wrong during registration" },
//       { status: 500 }
//     );
//   }
// }
// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import prisma from "../../../../../lib/prisma";
// import path from "path";
// import fs from "fs";
// import sharp from "sharp";
// import parseForm from "../../products/route";


// export const config = {
//   api: {
//     bodyParser: false, // Important for formidable
//   },
// };

// // ✅ Validation utilities
// const isValidEmail = (email: string): boolean => {
//   return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
// };

// const isValidMobile = (mobile: string): boolean => {
//   // Supports Indian 10-digit or international +country formats
//   return /^(\+?\d{1,3}[- ]?)?\d{10}$/.test(mobile);
// };

// const isStrongPassword = (password: string): boolean => {
//   // Minimum 8 characters, at least one uppercase, one lowercase, one number, one special char
//   return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
// };

// export async function POST(req: Request) {
//   try {
//     const { fields, files } = await parseForm(req);

//     const { name, email, password, confirmPassword, mobile } = fields;
//     let imageUrl = "";

//     // ✅ Required fields
//     if (!name || !email || !password || !confirmPassword || !mobile) {
//       return NextResponse.json(
//         { message: "All fields are required" },
//         { status: 400 }
//       );
//     }

//     // ✅ Validate email format
//     if (!isValidEmail(String(email))) {
//       return NextResponse.json(
//         { message: "Invalid email format" },
//         { status: 400 }
//       );
//     }

//     // ✅ Validate mobile format
//     if (!isValidMobile(String(mobile))) {
//       return NextResponse.json(
//         { message: "Invalid mobile number format" },
//         { status: 400 }
//       );
//     }

//     // ✅ Validate password match
//     if (password !== confirmPassword) {
//       return NextResponse.json(
//         { message: "Passwords do not match" },
//         { status: 400 }
//       );
//     }

//     // ✅ Validate password strength
//     if (!isStrongPassword(String(password))) {
//       return NextResponse.json(
//         {
//           message:
//             "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
//         },
//         { status: 400 }
//       );
//     }

//     // ✅ Check existing user
//     const existingUser = await prisma.user.findUnique({
//       where: { email: String(email) },
//     });
//     if (existingUser) {
//       return NextResponse.json(
//         { message: "User with this email already exists" },
//         { status: 409 }
//       );
//     }

//     // ✅ Handle image upload
//     if (files.image) {
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

//       await sharp(tempPath)
//         .webp({ quality: 80 })
//         .toFile(destPath);

//       fs.unlinkSync(tempPath); // remove temp file
//       imageUrl = `/uploads/${fileName}`;
//     }

//     // ✅ Hash password
//     const hashedPassword = await bcrypt.hash(String(password), 10);

//     // ✅ Create user
//     const newUser = await prisma.user.create({
//       data: {
//         name: String(name),
//         email: String(email),
//         password: hashedPassword,
//         mobile: String(mobile),
//         image: imageUrl,
//         role: "CUSTOMER",
//       },
//     });

//     // ✅ Generate JWT
//     const token = jwt.sign(
//       { userId: newUser.id, email: newUser.email, role: newUser.role },
//       process.env.JWT_SECRET!,
//       { expiresIn: "1h" }
//     );

//     return NextResponse.json(
//       {
//         message: "User registered successfully",
//         token,
//         user: {
//           id: newUser.id,
//           name: newUser.name,
//           email: newUser.email,
//           mobile: newUser.mobile,
//           image: newUser.image,
//           role: newUser.role,
//         },
//       },
//       { status: 201 }
//     );
//   } catch (error: any) {
//     console.error("Registration error:", error);
//     return NextResponse.json(
//       { message: "Something went wrong during registration" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "../../../../../lib/prisma";

import path from "path";
import fs from "fs";
import sharp from "sharp";
import twilio from "twilio";
import parseForm from "../../products/route";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const twilioClient = twilio(accountSid, authToken);
const twilioFrom = process.env.TWILIO_FROM!;

export const config = {
  api: {
    bodyParser: false,
  },
};

// export async function POST(req: Request) {
//   try {
//     const { fields, files } = await parseForm(req);
//     const { name, email, password, confirmPassword, mobile } = fields;
//     console.log(password,confirmPassword,'passw')
//     if (!name || !email || !password || !confirmPassword || !mobile) {
//       return NextResponse.json({ message: "All fields are required" }, { status: 400 });
//     }
//     const passwordStr = Array.isArray(password) ? password[0] : password;
//     const confirmPasswordStr = Array.isArray(confirmPassword) ? confirmPassword[0] : confirmPassword;
//     if (passwordStr !== confirmPasswordStr) {
//       return NextResponse.json({ message: "Passwords do not match" }, { status: 400 });
//     }

//     const existingUser = await prisma.user.findUnique({ where: { mobile: String(mobile) } });
//     if (existingUser) {
//       return NextResponse.json({ message: "Mobile number already registered" }, { status: 409 });
//     }

//     // Handle image upload (same as before)
//     let imageUrl = "";
//     if (files.image) {
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
//       imageUrl = `/uploads/${fileName}`;
//     }

//     const hashedPassword = await bcrypt.hash(String(password), 10);

//     // Generate OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

//     // Save user (not verified yet)
//     await prisma.user.create({
//       data: {
//         name: String(name),
//         email: String(email),
//         password: hashedPassword,
//         mobile: String(mobile),
//         image: imageUrl,
//         otp,
//         otpExpiresAt,
//         isVerified: false,
//         role: "CUSTOMER",
//       },
//     });

//     // Send OTP via Twilio SMS
//     await twilioClient.messages.create({
//       body: `Your verification code is ${otp}`,
//       from: twilioFrom,
//       to: String(mobile).startsWith("+") ? String(mobile) : `+91${mobile}`,
//     });

//     return NextResponse.json({ message: "OTP sent to your mobile number" }, { status: 200 });
//   } catch (error: any) {
//     console.error("Registration error:", error);
//     return NextResponse.json({ message: "Something went wrong during registration" }, { status: 500 });
//   }
// }
export async function POST(req: Request) {
  try {
    const { fields, files } = await parseForm(req);
    const { name, email, password, confirmPassword, mobile } = fields;

    // ✅ Validate all fields
    if (!name || !email || !password || !confirmPassword || !mobile) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const passwordStr = Array.isArray(password) ? password[0] : password;
    const confirmPasswordStr = Array.isArray(confirmPassword) ? confirmPassword[0] : confirmPassword;

    if (passwordStr !== confirmPasswordStr) {
      return NextResponse.json(
        { message: "Passwords do not match" },
        { status: 400 }
      );
    }

    // ✅ Check existing user
    const existingUser = await prisma.user.findUnique({
      where: { mobile: String(mobile) },
    });
    if (existingUser) {
      return NextResponse.json(
        { message: "Mobile number already registered" },
        { status: 409 }
      );
    }

    // ✅ Handle image upload (with base URL support)
    let imageUrl = "";
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

      imageUrl = `/uploads/${fileName}`;
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(String(passwordStr), 10);

    // ✅ Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    // ✅ Create user (not verified yet)
    const newUser = await prisma.user.create({
      data: {
        name: String(name),
        email: String(email),
        password: hashedPassword,
        mobile: String(mobile),
        image: imageUrl,
        otp,
        otpExpiresAt,
        isVerified: false,
        role: "CUSTOMER",
      },
    });

    // ✅ Send OTP via Twilio SMS
    await twilioClient.messages.create({
      body: `Your verification code is ${otp}`,
      from: twilioFrom,
      to: String(mobile).startsWith("+") ? String(mobile) : `+91${mobile}`,
    });

    // ✅ Build full image URL like product/profile APIs
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const userWithFullUrl = {
      ...newUser,
      image: newUser.image ? `${baseUrl}${newUser.image}` : null,
    };

    return NextResponse.json(
      {
        message: "OTP sent to your mobile number",
        user: userWithFullUrl,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Something went wrong during registration" },
      { status: 500 }
    );
  }
}

