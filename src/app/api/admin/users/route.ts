// // // pages/api/admin/users/index.ts
// // import type { NextApiResponse } from 'next'
// // import { AuthenticatedRequest, adminMiddleware } from '../../../../../lib/authMiddleware'
// // import prisma from '../../../../../lib/prisma'
// // import bcrypt from 'bcryptjs'

// // const handleUsers = async (req: AuthenticatedRequest, res: NextApiResponse) => {
// //   switch (req.method) {
// //     case 'GET':
// //       try {
// //         const users = await prisma.user.findMany({
// //           select: { id: true, email: true, name: true, role: true, createdAt: true },
// //           orderBy: { createdAt: 'desc' },
// //         })
// //         res.status(200).json(users)
// //       } catch (error) {
// //         console.error('Get all users error:', error)
// //         res.status(500).json({ message: 'Something went wrong fetching users' })
// //       }
// //       break

// //     case 'POST':
// //       try {
// //         const { email, password, name, role } = req.body
// //         if (!email || !password || !role) {
// //           return res.status(400).json({ message: 'Email, password, and role are required' })
// //         }
// //         const existingUser = await prisma.user.findUnique({ where: { email } })
// //         if (existingUser) {
// //           return res.status(409).json({ message: 'User with this email already exists' })
// //         }
// //         const hashedPassword = await bcrypt.hash(password, 10)
// //         const newUser = await prisma.user.create({
// //           data: { email, password: hashedPassword, name, role },
// //           select: { id: true, email: true, name: true, role: true, createdAt: true },
// //         })
// //         res.status(201).json(newUser)
// //       } catch (error) {
// //         console.error('Create user error:', error)
// //         res.status(500).json({ message: 'Something went wrong creating user' })
// //       }
// //       break

// //     default:
// //       res.setHeader('Allow', ['GET', 'POST'])
// //       res.status(405).end(`Method ${req.method} Not Allowed`)
// //   }
// // }

// // export default adminMiddleware(handleUsers)
// import { NextRequest, NextResponse } from 'next/server';

// import bcrypt from 'bcryptjs';
// import { adminMiddleware } from '../../../../../lib/authMiddleware';
// import prisma from '../../../../../lib/prisma';


// const handleUsers = async (req: NextRequest) => {
//   if (req.method === 'GET') {
//     try {
//       const users = await prisma.user.findMany({
//         select: { id: true, email: true, name: true, role: true, createdAt: true },
//         orderBy: { createdAt: 'desc' },
//       });
//       return NextResponse.json(users);
//     } catch (error) {
//       console.error('Get all users error:', error);
//       return NextResponse.json({ message: 'Something went wrong fetching users' }, { status: 500 });
//     }
//   }

//   if (req.method === 'POST') {
//     try {
//       const body = await req.json();
//       const { email, password, name, role } = body;

//       if (!email || !password || !role) {
//         return NextResponse.json({ message: 'Email, password, and role are required' }, { status: 400 });
//       }

//       const existingUser = await prisma.user.findUnique({ where: { email } });
//       if (existingUser) {
//         return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
//       }

//       const hashedPassword = await bcrypt.hash(password, 10);
//       const newUser = await prisma.user.create({
//         data: { email, password: hashedPassword, name, role },
//         select: { id: true, email: true, name: true, role: true, createdAt: true },
//       });

//       return NextResponse.json(newUser, { status: 201 });
//     } catch (error) {
//       console.error('Create user error:', error);
//       return NextResponse.json({ message: 'Something went wrong creating user' }, { status: 500 });
//     }
//   }

//   return NextResponse.json({ message: `Method ${req.method} Not Allowed` }, { status: 405 });
// };

// export const GET = adminMiddleware(handleUsers);
// export const POST = adminMiddleware(handleUsers);
// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

import bcrypt from 'bcryptjs';
import { adminMiddleware } from '../../../../../lib/authMiddleware';
import prisma from '../../../../../lib/prisma';

const handleUsers = async (req: NextRequest) => {
  if (req.method === 'GET') {
    try {
      const users = await prisma.user.findMany({
        select: { id: true, email: true, name: true, role: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json(users);
    } catch (error) {
      console.error('Get all users error:', error);
      return NextResponse.json({ message: 'Something went wrong fetching users' }, { status: 500 });
    }
  }

  if (req.method === 'POST') {
    try {
      const { email, password, name, role } = await req.json();

      if (!email || !password || !role) {
        return NextResponse.json({ message: 'Email, password, and role are required' }, { status: 400 });
      }

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await prisma.user.create({
        data: { email, password: hashedPassword, name, role },
        select: { id: true, email: true, name: true, role: true, createdAt: true },
      });

      return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
      console.error('Create user error:', error);
      return NextResponse.json({ message: 'Something went wrong creating user' }, { status: 500 });
    }
  }

  return NextResponse.json({ message: `Method ${req.method} Not Allowed` }, { status: 405 });
};

export const GET = adminMiddleware(handleUsers);
export const POST = adminMiddleware(handleUsers);

