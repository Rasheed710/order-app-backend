// pages/api/admin/users/index.ts
import type { NextApiResponse } from 'next'
import { AuthenticatedRequest, adminMiddleware } from '../../../../../lib/authMiddleware'
import prisma from '../../../../../lib/prisma'
import bcrypt from 'bcryptjs'

const handleUsers = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      try {
        const users = await prisma.user.findMany({
          select: { id: true, email: true, name: true, role: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
        })
        res.status(200).json(users)
      } catch (error) {
        console.error('Get all users error:', error)
        res.status(500).json({ message: 'Something went wrong fetching users' })
      }
      break

    case 'POST':
      try {
        const { email, password, name, role } = req.body
        if (!email || !password || !role) {
          return res.status(400).json({ message: 'Email, password, and role are required' })
        }
        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) {
          return res.status(409).json({ message: 'User with this email already exists' })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await prisma.user.create({
          data: { email, password: hashedPassword, name, role },
          select: { id: true, email: true, name: true, role: true, createdAt: true },
        })
        res.status(201).json(newUser)
      } catch (error) {
        console.error('Create user error:', error)
        res.status(500).json({ message: 'Something went wrong creating user' })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default adminMiddleware(handleUsers)