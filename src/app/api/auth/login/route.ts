// // pages/api/auth/login.ts
// import type { NextApiRequest, NextApiResponse } from 'next'
// import bcrypt from 'bcryptjs'
// import jwt from 'jsonwebtoken'
// import prisma from '../../../../../lib/prisma'

// export default async function login(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method not allowed' })
//   }

//   const { email, password } = req.body

//   try {
//     const user = await prisma.user.findUnique({ where: { email } })

//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       return res.status(401).json({ message: 'Invalid credentials' })
//     }

//     const token = jwt.sign(
//       { userId: user.id, email: user.email, role: user.role },
//       process.env.JWT_SECRET!,
//       { expiresIn: '1h' }
//     )

//     res.status(200).json({
//       message: 'Login successful',
//       token,
//       user: { id: user.id, email: user.email, name: user.name, role: user.role },
//     })
//   } catch (error) {
//     console.error('Login error:', error)
//     res.status(500).json({ message: 'Something went wrong during login' })
//   }
// }
// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../../../../lib/prisma";


// export async function POST(req: Request) {
//   try {
//     const { email, password } = await req.json();

//     const user = await prisma.user.findUnique({ where: { email } });
//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
//     }

//     const token = jwt.sign(
//       { userId: user.id, email: user.email, role: user.role },
//       process.env.JWT_SECRET!,
//       { expiresIn: "1h" }
//     );
// console.log(user,'userrrr')
//     return NextResponse.json({
//       message: "Login successful",
//       token,
//       user: { id: user.id, email: user.email, name: user.name, role: user.role },
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     return NextResponse.json({ message: "Something went wrong during login" }, { status: 500 });
//   }
// }

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // Short-lived access token (for API requests)
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" } // 15 minutes
    );

    // Long-lived refresh token (to get new access tokens)
    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET!, // use a separate secret
      { expiresIn: "7d" } // 7 days
    );

    // Save refresh token in DB for this user
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return NextResponse.json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: { id: user.id,
        email: user.email,
        name: user.name,
        mobile: user.mobile,
        role: user.role,
        image: user.image,},
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Something went wrong during login" }, { status: 500 });
  }
}
