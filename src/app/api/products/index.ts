// pages/api/products/index.ts
import type { NextApiResponse } from 'next'
import { AuthenticatedRequest, authMiddleware, adminMiddleware } from '../../../../lib/authMiddleware'
import prisma from '../../../../lib/prisma'

const handleProducts = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      // Anyone authenticated can get products
      try {
        const products = await prisma.product.findMany({
          orderBy: { createdAt: 'desc' },
        })
        res.status(200).json(products)
      } catch (error) {
        console.error('Get all products error:', error)
        res.status(500).json({ message: 'Something went wrong fetching products' })
      }
      break

    case 'POST':
      // Only admins can create products
      return adminMiddleware(async (adminReq, adminRes) => {
        try {
          const { name, description, price, imageUrl, category, stock } = adminReq.body
          const newProduct = await prisma.product.create({
            data: { name, description, price: parseFloat(price), imageUrl, category, stock: parseInt(stock) },
          })
          adminRes.status(201).json(newProduct)
        } catch (error) {
          console.error('Create product error:', error)
          adminRes.status(500).json({ message: 'Something went wrong creating product' })
        }
      })(req, res)

    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default authMiddleware(handleProducts)