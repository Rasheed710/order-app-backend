// // lib/authMiddleware.ts
// import { NextApiRequest, NextApiResponse } from 'next'
// import jwt from 'jsonwebtoken'
// import prisma from './prisma'

// export interface AuthenticatedRequest extends NextApiRequest {
//   userId?: string;
//   userEmail?: string;
//   userRole?: string;
// }

// export const authMiddleware = (handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void | NextApiResponse>) => {
//   return async (req: AuthenticatedRequest, res: NextApiResponse) => {
//     const authHeader = req.headers.authorization

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({ message: 'Authentication required: No token provided' })
//     }

//     const token = authHeader.split(' ')[1]

//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, email: string, role: string, exp: number }

//       // Check if token is expired (JWT handles this, but good to know)
//       if (decoded.exp * 1000 < Date.now()) {
//         return res.status(401).json({ message: 'Authentication required: Token expired' })
//       }

//       // Check if user still exists (optional, but good for security)
//       const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
//       if (!user) {
//         return res.status(401).json({ message: 'Authentication required: User not found' });
//       }

//       req.userId = decoded.userId
//       req.userEmail = decoded.email
//       req.userRole = decoded.role

//       return handler(req, res)
//     } catch (error) {
//       console.error('JWT verification error:', error)
//       return res.status(401).json({ message: 'Authentication required: Invalid token' })
//     }
//   }
// }

// export const adminMiddleware = (handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void | NextApiResponse>) => {
//   return authMiddleware(async (req, res) => {
//     if (req.userRole !== 'ADMIN') {
//       return res.status(403).json({ message: 'Forbidden: Admin access required' })
//     }
//     return handler(req, res)
//   })
// }
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from './prisma';

export interface AuthenticatedContext {
  userId: string;
  userEmail: string;
  userRole: string;
}

// Auth middleware for route handlers
// export const authMiddleware = (handler: (req: NextRequest, context: AuthenticatedContext & { params?: any }) => Promise<NextResponse>) => {
//   return async (req: NextRequest, context: { params?: any }) => {
//     const authHeader = req.headers.get('authorization');

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return NextResponse.json({ message: 'Authentication required: No token provided' }, { status: 401 });
//     }

//     const token = authHeader.split(' ')[1];

//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
//         userId: string;
//         email: string;
//         role: string;
//         exp: number;
//       };

//       if (decoded.exp * 1000 < Date.now()) {
//         return NextResponse.json({ message: 'Authentication required: Token expired' }, { status: 401 });
//       }

//       // Optional: check if user exists in DB
//       const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
//       if (!user) {
//         return NextResponse.json({ message: 'Authentication required: User not found' }, { status: 401 });
//       }

//       const authContext: AuthenticatedContext = {
//         userId: decoded.userId,
//         userEmail: decoded.email,
//         userRole: decoded.role,
//       };

//       return handler(req, { ...context, ...authContext });
//     } catch (error) {
//       console.error('JWT verification error:', error);
//       return NextResponse.json({ message: 'Authentication required: Invalid token' }, { status: 401 });
//     }
//   };
// };
// export const authMiddleware = (
//   handler: (req: NextRequest, context: AuthenticatedContext & { params: any }) => Promise<NextResponse>
// ) => {
//   return async (req: NextRequest, context: { params: any }) => {
//     const authHeader = req.headers.get("authorization");

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return NextResponse.json({ message: "Authentication required: No token provided" }, { status: 401 });
//     }

//     const token = authHeader.split(" ")[1];

//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
//         userId: string;
//         email: string;
//         role: string;
//         exp: number;
//       };

//       if (decoded.exp * 1000 < Date.now()) {
//         return NextResponse.json({ message: "Authentication required: Token expired" }, { status: 401 });
//       }

//       // Check if user exists
//       const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
//       if (!user) {
//         return NextResponse.json({ message: "Authentication required: User not found" }, { status: 401 });
//       }

//       const authContext: AuthenticatedContext = {
//         userId: decoded.userId,
//         userEmail: decoded.email,
//         userRole: decoded.role,
//       };

//       // ✅ Forward context INCLUDING params
//       return handler(req, { ...context, ...authContext });
//     } catch (error) {
//       console.error("JWT verification error:", error);
//       return NextResponse.json({ message: "Authentication required: Invalid token" }, { status: 401 });
//     }
//   };
// };


export const authMiddleware = (
  handler: (req: NextRequest, context: AuthenticatedContext & { params?: any }) => Promise<NextResponse>
) => {
  return async (req: NextRequest, context: { params?: any }) => {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Authentication required: No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
        email: string;
        role: string;
        exp: number;
      };

      if (decoded.exp * 1000 < Date.now()) {
        return NextResponse.json(
          { message: "Authentication required: Token expired" },
          { status: 401 }
        );
      }

      // Ensure user exists
      const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
      if (!user) {
        return NextResponse.json(
          { message: "Authentication required: User not found" },
          { status: 401 }
        );
      }

      // ✅ Pass context correctly
      const authContext: AuthenticatedContext & { params?: any } = {
        userId: decoded.userId,
        userEmail: decoded.email,
        userRole: decoded.role,
        params: context?.params,
      };

      return handler(req, authContext);
    } catch (err) {
      console.error("JWT verification error:", err);
      return NextResponse.json(
        { message: "Authentication required: Invalid token" },
        { status: 401 }
      );
    }
  };
};


// Admin middleware wrapper
// export const adminMiddleware = (handler: (req: NextRequest, context: AuthenticatedContext & { params?: any }) => Promise<NextResponse>) => {
//   return authMiddleware(async (req, context) => {
//     if (context.userRole !== 'ADMIN') {
//       return NextResponse.json({ message: 'Forbidden: Admin access required' }, { status: 403 });
//     }
//     return handler(req, context);
//   });
// };
// export const adminMiddleware = (
//   handler: (req: NextRequest, context: AuthenticatedContext & { params: any }) => Promise<NextResponse>
// ) => {
//   return authMiddleware(async (req, context) => {
//     // Make sure params exist
//     const params = (context.params || {}) as any;

//     if (context.userRole !== 'ADMIN') {
//       return NextResponse.json({ message: 'Forbidden: Admin access required' }, { status: 403 });
//     }

//     // Forward context with guaranteed params
//     return handler(req, { ...context, params });
//   });
// };
// your existing auth

// Correct admin middleware that preserves params

export const adminMiddleware = (
  handler: (req: Request, context: { params: any; userRole?: string }) => Promise<NextResponse>
) => {
  return authMiddleware(async (req: Request, context: { params: any; userRole?: string }) => {
    // Check if user is admin
    if (context.userRole !== "ADMIN") {
      return NextResponse.json(
        { message: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    // Forward request and context (including params) to handler
    return handler(req, context);
  });
};


