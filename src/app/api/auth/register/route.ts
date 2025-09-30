// // pages/api/auth/register.ts
// import type { NextApiRequest, NextApiResponse } from 'next'
// import bcrypt from 'bcryptjs'
// import jwt from 'jsonwebtoken'
// import prisma from '../../../../lib/prisma'

// export default async function register(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method not allowed' })
//   }

//   const { email, password, name } = req.body

//   if (!email || !password) {
//     return res.status(400).json({ message: 'Email and password are required' })
//   }

//   try {
//     const existingUser = await prisma.user.findUnique({ where: { email } })
//     if (existingUser) {
//       return res.status(409).json({ message: 'User with this email already exists' })
//     }

//     const hashedPassword = await bcrypt.hash(password, 10)

//     const newUser = await prisma.user.create({
//       data: {
//         email,
//         password: hashedPassword,
//         name: name || '',
//         role: 'CUSTOMER', // Default role for new registrations
//       },
//     })

//     const token = jwt.sign(
//       { userId: newUser.id, email: newUser.email, role: newUser.role },
//       process.env.JWT_SECRET!,
//       { expiresIn: '1h' }
//     )

//     res.status(201).json({
//       message: 'User registered successfully',
//       token,
//       user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role },
//     })
//   } catch (error) {
//     console.error('Registration error:', error)
//     res.status(500).json({ message: 'Something went wrong during registration' })
//   }
// }
// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../../../../lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || "",
        role: "CUSTOMER",
      },
    });

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    return NextResponse.json({
      message: "User registered successfully",
      token,
      user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role },
    }, { status: 201 });

  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ message: "Something went wrong during registration" }, { status: 500 });
  }
}
