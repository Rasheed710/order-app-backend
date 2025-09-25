// pages/api/admin/users/[id].ts
import type { NextApiResponse } from 'next'
import { AuthenticatedRequest, adminMiddleware } from '../../../../../lib/authMiddleware'
import prisma from '../../../../../lib/prisma'
import bcrypt from 'bcryptjs'

const handleUser = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  const { id } = req.query as { id: string }

  switch (req.method) {
    case 'GET':
      try {
        const user = await prisma.user.findUnique({
          where: { id },
          select: { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true },
        })
        if (!user) {
          return res.status(404).json({ message: 'User not found' })
        }
        res.status(200).json(user)
      } catch (error) {
        console.error('Get user error:', error)
        res.status(500).json({ message: 'Something went wrong fetching user' })
      }
      break

    case 'PUT':
      try {
        const { email, name, role, password } = req.body
        let data: any = { email, name, role }
        if (password) {
          data.password = await bcrypt.hash(password, 10)
        }
        const updatedUser = await prisma.user.update({
          where: { id },
          data,
          select: { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true },
        })
        res.status(200).json(updatedUser)
      } catch (error) {
        console.error('Update user error:', error)
        res.status(500).json({ message: 'Something went wrong updating user' })
      }
      break

    case 'DELETE':
      try {
        await prisma.user.delete({ where: { id } })
        res.status(204).end()
      } catch (error) {
        console.error('Delete user error:', error)
        res.status(500).json({ message: 'Something went wrong deleting user' })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default adminMiddleware(handleUser)