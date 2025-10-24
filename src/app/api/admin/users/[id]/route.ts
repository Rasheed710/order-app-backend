// // // // pages/api/admin/users/[id].ts
// // // import type { NextApiResponse } from 'next'
// // // import { AuthenticatedRequest, adminMiddleware } from '../../../../../../lib/authMiddleware'
// // // import prisma from '../../../../../../lib/prisma'
// // // import bcrypt from 'bcryptjs'

// // // const handleUser = async (req: AuthenticatedRequest, res: NextApiResponse) => {
// // //   const { id } = req.query as { id: string }

// // //   switch (req.method) {
// // //     case 'GET':
// // //       try {
// // //         const user = await prisma.user.findUnique({
// // //           where: { id },
// // //           select: { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true },
// // //         })
// // //         if (!user) {
// // //           return res.status(404).json({ message: 'User not found' })
// // //         }
// // //         res.status(200).json(user)
// // //       } catch (error) {
// // //         console.error('Get user error:', error)
// // //         res.status(500).json({ message: 'Something went wrong fetching user' })
// // //       }
// // //       break

// // //     case 'PUT':
// // //       try {
// // //         const { email, name, role, password } = req.body
// // //         let data: any = { email, name, role }
// // //         if (password) {
// // //           data.password = await bcrypt.hash(password, 10)
// // //         }
// // //         const updatedUser = await prisma.user.update({
// // //           where: { id },
// // //           data,
// // //           select: { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true },
// // //         })
// // //         res.status(200).json(updatedUser)
// // //       } catch (error) {
// // //         console.error('Update user error:', error)
// // //         res.status(500).json({ message: 'Something went wrong updating user' })
// // //       }
// // //       break

// // //     case 'DELETE':
// // //       try {
// // //         await prisma.user.delete({ where: { id } })
// // //         res.status(204).end()
// // //       } catch (error) {
// // //         console.error('Delete user error:', error)
// // //         res.status(500).json({ message: 'Something went wrong deleting user' })
// // //       }
// // //       break

// // //     default:
// // //       res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
// // //       res.status(405).end(`Method ${req.method} Not Allowed`)
// // //   }
// // // }

// // // export default adminMiddleware(handleUser)
// // import { NextRequest, NextResponse } from 'next/server';

// // import bcrypt from 'bcryptjs';
// // import { adminMiddleware } from '../../../../../../lib/authMiddleware';
// // import prisma from '../../../../../../lib/prisma';


// // const handleUser = async (req: NextRequest, { params }: { params: { id: string } }) => {
// //   const { id } = params;

// //   if (req.method === 'GET') {
// //     try {
// //       const user = await prisma.user.findUnique({
// //         where: { id },
// //         select: { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true },
// //       });
// //       if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

// //       return NextResponse.json(user);
// //     } catch (error) {
// //       console.error('Get user error:', error);
// //       return NextResponse.json({ message: 'Something went wrong fetching user' }, { status: 500 });
// //     }
// //   }

// //   if (req.method === 'PUT') {
// //     try {
// //       const { email, name, role, password } = await req.json();
// //       const data: any = { email, name, role };

// //       if (password) {
// //         data.password = await bcrypt.hash(password, 10);
// //       }

// //       const updatedUser = await prisma.user.update({
// //         where: { id },
// //         data,
// //         select: { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true },
// //       });

// //       return NextResponse.json(updatedUser);
// //     } catch (error) {
// //       console.error('Update user error:', error);
// //       return NextResponse.json({ message: 'Something went wrong updating user' }, { status: 500 });
// //     }
// //   }

// //   if (req.method === 'DELETE') {
// //     try {
// //       await prisma.user.delete({ where: { id } });
// //       return new NextResponse(null, { status: 204 });
// //     } catch (error) {
// //       console.error('Delete user error:', error);
// //       return NextResponse.json({ message: 'Something went wrong deleting user' }, { status: 500 });
// //     }
// //   }

// //   return NextResponse.json({ message: `Method ${req.method} Not Allowed` }, { status: 405 });
// // };

// // export const GET = adminMiddleware(handleUser);
// // export const PUT = adminMiddleware(handleUser);
// // export const DELETE = adminMiddleware(handleUser);
// // app/api/admin/users/[id]/route.ts
// import { NextRequest, NextResponse } from 'next/server';

// import bcrypt from 'bcryptjs';
// import prisma from '../../../../../../lib/prisma';
// import { adminMiddleware } from '../../../../../../lib/authMiddleware';


// const handleUser = async (req: NextRequest, { params }: { params: { id: string } }) => {
//   const { id } = params;

//   if (req.method === 'GET') {
//     try {
//       const user = await prisma.user.findUnique({
//         where: { id },
//         select: { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true },
//       });
//       if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

//       return NextResponse.json(user);
//     } catch (error) {
//       console.error('Get user error:', error);
//       return NextResponse.json({ message: 'Something went wrong fetching user' }, { status: 500 });
//     }
//   }

//   if (req.method === 'PUT') {
//     try {
//       const { email, name, role, password } = await req.json();
//       const data: any = { email, name, role };

//       if (password) {
//         data.password = await bcrypt.hash(password, 10);
//       }

//       const updatedUser = await prisma.user.update({
//         where: { id },
//         data,
//         select: { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true },
//       });

//       return NextResponse.json(updatedUser);
//     } catch (error) {
//       console.error('Update user error:', error);
//       return NextResponse.json({ message: 'Something went wrong updating user' }, { status: 500 });
//     }
//   }

//   if (req.method === 'DELETE') {
//     try {
//       await prisma.user.delete({ where: { id } });
//       return new NextResponse(null, { status: 204 });
//     } catch (error) {
//       console.error('Delete user error:', error);
//       return NextResponse.json({ message: 'Something went wrong deleting user' }, { status: 500 });
//     }
//   }

//   return NextResponse.json({ message: `Method ${req.method} Not Allowed` }, { status: 405 });
// };

// export const GET = adminMiddleware(handleUser);
// export const PUT = adminMiddleware(handleUser);
// export const DELETE = adminMiddleware(handleUser);

// app/api/admin/users/[id]/route.ts
// import { NextRequest, NextResponse } from 'next/server';

// import bcrypt from 'bcryptjs';
// import prisma from '../../../../../../lib/prisma';
// import { adminMiddleware } from '../../../../../../lib/authMiddleware';


// const handleUser = async (req: NextRequest, { params }: { params: { id: string } }) => {
//   const { id } = params;

//   if (req.method === 'GET') {
//     try {
//       const user = await prisma.user.findUnique({
//         where: { id },
//         select: { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true },
//       });
//       if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

//       return NextResponse.json(user);
//     } catch (error) {
//       console.error('Get user error:', error);
//       return NextResponse.json({ message: 'Something went wrong fetching user' }, { status: 500 });
//     }
//   }

//   if (req.method === 'PUT') {
//     try {
//       const { email, name, role, password } = await req.json();
//       const data: any = { email, name, role };

//       if (password) {
//         data.password = await bcrypt.hash(password, 10);
//       }

//       const updatedUser = await prisma.user.update({
//         where: { id },
//         data,
//         select: { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true },
//       });

//       return NextResponse.json(updatedUser);
//     } catch (error) {
//       console.error('Update user error:', error);
//       return NextResponse.json({ message: 'Something went wrong updating user' }, { status: 500 });
//     }
//   }

//   if (req.method === 'DELETE') {
//     try {
//       await prisma.user.delete({ where: { id } });
//       return new NextResponse(null, { status: 204 });
//     } catch (error) {
//       console.error('Delete user error:', error);
//       return NextResponse.json({ message: 'Something went wrong deleting user' }, { status: 500 });
//     }
//   }

//   return NextResponse.json({ message: `Method ${req.method} Not Allowed` }, { status: 405 });
// };

// export const GET = adminMiddleware(handleUser);
// export const PUT = adminMiddleware(handleUser);
// export const DELETE = adminMiddleware(handleUser);

// import { NextRequest, NextResponse } from 'next/server';
// import bcrypt from 'bcryptjs';
// import prisma from '../../../../../../lib/prisma';
// import { adminMiddleware } from '../../../../../../lib/authMiddleware';

// const handleUser = async (req: NextRequest, id: string) => {
//   if (req.method === 'GET') {
//     try {
//       const user = await prisma.user.findUnique({
//         where: { id },
//         select: { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true },
//       });

//       if (!user) {
//         return NextResponse.json({ message: 'User not found' }, { status: 404 });
//       }

//       return NextResponse.json(user);
//     } catch (error) {
//       console.error('Get user error:', error);
//       return NextResponse.json({ message: 'Something went wrong fetching user' }, { status: 500 });
//     }
//   }

//   if (req.method === 'PUT') {
//     try {
//       const { email, name, role, password } = await req.json();
//       const data: any = { email, name, role };

//       if (password) {
//         data.password = await bcrypt.hash(password, 10);
//       }

//       const updatedUser = await prisma.user.update({
//         where: { id },
//         data,
//         select: { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true },
//       });

//       return NextResponse.json(updatedUser);
//     } catch (error) {
//       console.error('Update user error:', error);
//       return NextResponse.json({ message: 'Something went wrong updating user' }, { status: 500 });
//     }
//   }

//   if (req.method === 'DELETE') {
//     try {
//       await prisma.user.delete({ where: { id } });
//       return new NextResponse(null, { status: 204 });
//     } catch (error) {
//       console.error('Delete user error:', error);
//       return NextResponse.json({ message: 'Something went wrong deleting user' }, { status: 500 });
//     }
//   }

//   return NextResponse.json({ message: `Method ${req.method} Not Allowed` }, { status: 405 });
// };

// // Wrappers for App Router
// export const GET = adminMiddleware(async (req: NextRequest, { params }: { params: { id: string } }) => {
//   return handleUser(req, params.id);
// });

// export const PUT = adminMiddleware(async (req: NextRequest, { params }: { params: { id: string } }) => {
//   return handleUser(req, params.id);
// });

// export const DELETE = adminMiddleware(async (req: NextRequest, { params }: { params: { id: string } }) => {
//   return handleUser(req, params.id);
// });
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "../../../../../../lib/prisma";
import { adminMiddleware } from "../../../../../../lib/authMiddleware";

const handleUser = async (req: NextRequest, id: string) => {
  try {
    switch (req.method) {
      // ========================================
      // ✅ GET: Get single user by ID
      // ========================================
      case "GET": {
        const user = await prisma.user.findUnique({
          where: { id },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        });

        if (!user) {
          return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ data: user }, { status: 200 });
      }

      // ========================================
      // ✅ PUT: Update user (with optional password)
      // ========================================
      case "PUT": {
        const body = await req.json();
        const { name, email, role, password } = body;

        if (!name && !email && !role && !password) {
          return NextResponse.json(
            { message: "No fields provided to update" },
            { status: 400 }
          );
        }

        const data: any = {};

        if (name) data.name = name;
        if (email) data.email = email;
        if (role) data.role = role.toUpperCase();
        if (password) data.password = await bcrypt.hash(password, 10);

        const updatedUser = await prisma.user.update({
          where: { id },
          data,
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        });

        return NextResponse.json(
          { message: "User updated successfully", data: updatedUser },
          { status: 200 }
        );
      }

      // ========================================
      // ✅ DELETE: Remove user
      // ========================================
      case "DELETE": {
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) {
          return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        await prisma.user.delete({ where: { id } });
        return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
      }

      // ========================================
      // ❌ Method not allowed
      // ========================================
      default:
        return NextResponse.json(
          { message: `Method ${req.method} Not Allowed` },
          { status: 405 }
        );
    }
  } catch (error: any) {
    console.error(`${req.method} /users/${id} error:`, error);

    // Prisma unique constraint (email already exists)
    if (error.code === "P2002") {
      return NextResponse.json(
        { message: "Email already in use by another user" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Something went wrong processing user request" },
      { status: 500 }
    );
  }
};

// ✅ Wrappers for Next.js App Router with Admin Protection
export const GET = adminMiddleware(async (req: NextRequest, { params }: { params: { id: string } }) =>
  handleUser(req, params.id)
);

export const PUT = adminMiddleware(async (req: NextRequest, { params }: { params: { id: string } }) =>
  handleUser(req, params.id)
);

export const DELETE = adminMiddleware(async (req: NextRequest, { params }: { params: { id: string } }) =>
  handleUser(req, params.id)
);
