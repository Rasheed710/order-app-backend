// pages/api/products/[id].ts
import type { NextApiResponse } from 'next'
import { AuthenticatedRequest, authMiddleware, adminMiddleware } from '../../../../lib/authMiddleware'
import prisma from '../../../../lib/prisma'

const handleProduct = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  const { id } = req.query as { id: string }

  switch (req.method) {
    case 'GET':
      try {
        const product = await prisma.product.findUnique({ where: { id } })
        if (!product) {
          return res.status(404).json({ message: 'Product not found' })
        }
        res.status(200).json(product)
      } catch (error) {
        console.error('Get product error:', error)
        res.status(500).json({ message: 'Something went wrong fetching product' })
      }
      break

    case 'PUT':
      // Only admins can update products
      return adminMiddleware(async (adminReq, adminRes) => {
        try {
          const { name, description, price, imageUrl, category, stock } = adminReq.body
          const updatedProduct = await prisma.product.update({
            where: { id },
            data: { name, description, price, imageUrl, category, stock: parseInt(stock) },
          })
          adminRes.status(200).json(updatedProduct)
        } catch (error) {
          console.error('Update product error:', error)
          adminRes.status(500).json({ message: 'Something went wrong updating product' })
        }
      })(req, res) // Pass req and res to the middleware

    case 'DELETE':
      // Only admins can delete products
      return adminMiddleware(async (adminReq, adminRes) => {
        try {
          await prisma.product.delete({ where: { id } })
          adminRes.status(204).end() // No content
        } catch (error) {
          console.error('Delete product error:', error)
          adminRes.status(500).json({ message: 'Something went wrong deleting product' })
        }
      })(req, res)

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default authMiddleware(handleProduct) // All product operations require authentication