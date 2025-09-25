// lib/authMiddleware.ts
import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import prisma from './prisma'

export interface AuthenticatedRequest extends NextApiRequest {
  userId?: string;
  userEmail?: string;
  userRole?: string;
}

export const authMiddleware = (handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void | NextApiResponse>) => {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required: No token provided' })
    }

    const token = authHeader.split(' ')[1]

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, email: string, role: string, exp: number }

      // Check if token is expired (JWT handles this, but good to know)
      if (decoded.exp * 1000 < Date.now()) {
        return res.status(401).json({ message: 'Authentication required: Token expired' })
      }

      // Check if user still exists (optional, but good for security)
      const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
      if (!user) {
        return res.status(401).json({ message: 'Authentication required: User not found' });
      }

      req.userId = decoded.userId
      req.userEmail = decoded.email
      req.userRole = decoded.role

      return handler(req, res)
    } catch (error) {
      console.error('JWT verification error:', error)
      return res.status(401).json({ message: 'Authentication required: Invalid token' })
    }
  }
}

export const adminMiddleware = (handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void | NextApiResponse>) => {
  return authMiddleware(async (req, res) => {
    if (req.userRole !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden: Admin access required' })
    }
    return handler(req, res)
  })
}