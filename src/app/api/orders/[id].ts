// pages/api/orders/[id].ts
import type { NextApiResponse } from 'next'
import { AuthenticatedRequest, authMiddleware, adminMiddleware } from '../../../../lib/authMiddleware'
import prisma from '../../../../lib/prisma'

const handleOrder = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  const { id } = req.query as { id: string }

  switch (req.method) {
    case 'GET':
      try {
        const order = await prisma.order.findUnique({
          where: { id },
          include: {
            user: { select: { id: true, name: true, email: true } },
            orderItems: {
              include: { product: true },
            },
          },
        })

        if (!order) {
          return res.status(404).json({ message: 'Order not found' })
        }

        // Customer can only view their own orders
        if (req.userRole === 'CUSTOMER' && order.userId !== req.userId) {
          return res.status(403).json({ message: 'Forbidden: You can only view your own orders' })
        }

        res.status(200).json(order)
      } catch (error) {
        console.error('Get order error:', error)
        res.status(500).json({ message: 'Something went wrong fetching order' })
      }
      break

    case 'PUT':
      // Only admins can update order status
      return adminMiddleware(async (adminReq, adminRes) => {
        try {
          const { status } = adminReq.body
          if (!['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].includes(status)) {
            return adminRes.status(400).json({ message: 'Invalid order status' })
          }
          const updatedOrder = await prisma.order.update({
            where: { id },
            data: { status },
            include: { user: { select: { name: true } } },
          })
          adminRes.status(200).json(updatedOrder)
        } catch (error) {
          console.error('Update order error:', error)
          adminRes.status(500).json({ message: 'Something went wrong updating order' })
        }
      })(req, res) // Pass req and res to the middleware

    default:
      res.setHeader('Allow', ['GET', 'PUT'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default authMiddleware(handleOrder)