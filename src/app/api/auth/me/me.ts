// pages/api/auth/me.ts
import type { NextApiResponse } from 'next'
import { AuthenticatedRequest, authMiddleware } from '../../../../../lib/authMiddleware'
import prisma from '../../../../../lib/prisma'

const handler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true, name: true, role: true, createdAt: true }, // Don't return password
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(200).json(user)
  } catch (error) {
    console.error('Fetch current user error:', error)
    res.status(500).json({ message: 'Something went wrong fetching user data' })
  }
}

export default authMiddleware(handler)