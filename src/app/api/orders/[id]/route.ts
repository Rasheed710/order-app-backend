// // pages/api/orders/[id].ts
// import type { NextApiResponse } from 'next'
// import { AuthenticatedRequest, authMiddleware, adminMiddleware } from '../../../../lib/authMiddleware'
// import prisma from '../../../../lib/prisma'

// const handleOrder = async (req: AuthenticatedRequest, res: NextApiResponse) => {
//   const { id } = req.query as { id: string }

//   switch (req.method) {
//     case 'GET':
//       try {
//         const order = await prisma.order.findUnique({
//           where: { id },
//           include: {
//             user: { select: { id: true, name: true, email: true } },
//             orderItems: {
//               include: { product: true },
//             },
//           },
//         })

//         if (!order) {
//           return res.status(404).json({ message: 'Order not found' })
//         }

//         // Customer can only view their own orders
//         if (req.userRole === 'CUSTOMER' && order.userId !== req.userId) {
//           return res.status(403).json({ message: 'Forbidden: You can only view your own orders' })
//         }

//         res.status(200).json(order)
//       } catch (error) {
//         console.error('Get order error:', error)
//         res.status(500).json({ message: 'Something went wrong fetching order' })
//       }
//       break

//     case 'PUT':
//       // Only admins can update order status
//       return adminMiddleware(async (adminReq, adminRes) => {
//         try {
//           const { status } = adminReq.body
//           if (!['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].includes(status)) {
//             return adminRes.status(400).json({ message: 'Invalid order status' })
//           }
//           const updatedOrder = await prisma.order.update({
//             where: { id },
//             data: { status },
//             include: { user: { select: { name: true } } },
//           })
//           adminRes.status(200).json(updatedOrder)
//         } catch (error) {
//           console.error('Update order error:', error)
//           adminRes.status(500).json({ message: 'Something went wrong updating order' })
//         }
//       })(req, res) // Pass req and res to the middleware

//     default:
//       res.setHeader('Allow', ['GET', 'PUT'])
//       res.status(405).end(`Method ${req.method} Not Allowed`)
//   }
// }

// export default authMiddleware(handleOrder)
// app/api/orders/[id]/route.ts
import { NextResponse } from 'next/server'
import prisma from '../../../../../lib/prisma'
import { authMiddleware, adminMiddleware } from '../../../../../lib/authMiddleware'

// GET: Fetch single order
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { userId, userRole } = await authMiddleware(req)
    const { id } = params

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        party: { select: { id: true, name: true, email: true, phone: true } },
        user: { select: { id: true, name: true, email: true } },
        orderItems: { include: { product: true } },
      },
    })

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 })
    }

    // Restrict customer from viewing others' orders
    if (userRole === 'CUSTOMER' && order.userId !== userId) {
      return NextResponse.json({ message: 'Forbidden: You can only view your own orders' }, { status: 403 })
    }

    return NextResponse.json(order, { status: 200 })
  } catch (error) {
    console.error('Get order error:', error)
    return NextResponse.json({ message: 'Something went wrong fetching order' }, { status: 500 })
  }
}

// PUT: Update order status (Admins only)
// export async function PUT(req: Request, { params }: { params: { id: string } }) {
//   return adminMiddleware(async ({ id, body }) => {
//     try {
//       const body = await req.json(); // parse JSON body
//       const { status } = body;
//       if (!['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].includes(status)) {
//         return NextResponse.json({ message: 'Invalid order status' }, { status: 400 })
//       }

//       const updatedOrder = await prisma.order.update({
//         where: { id },
//         data: { status },
//         include: { user: { select: { name: true } } },
//       })

//       return NextResponse.json(updatedOrder, { status: 200 })
//     } catch (error) {
//       console.error('Update order error:', error)
//       return NextResponse.json({ message: 'Something went wrong updating order' }, { status: 500 })
//     }
//   })(req, params)
// }
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  // Extract order id from route params
  const { id } = params;

  if (!id) {
    return NextResponse.json({ message: "Order ID is required" }, { status: 400 });
  }

  return authMiddleware(async (req, context) => {
    try {
      const { userId, userRole } = context;

      if (userRole !== "ADMIN") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
      }

      const body = await req.json();
      const { status } = body;

      if (!['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].includes(status)) {
        return NextResponse.json({ message: "Invalid order status" }, { status: 400 });
      }

      const updatedOrder = await prisma.order.update({
        where: { id }, // use extracted route param
        data: { status },
        include: {
          user: { select: { name: true, email: true } },
          party: { select: { name: true } },
          orderItems: {
            include: {
              product: { select: { name: true, price: true, stock: true } }
            }
          }
        }
      });

      return NextResponse.json(updatedOrder, { status: 200 });
    } catch (error) {
      console.error("Update order error:", error);
      return NextResponse.json(
        { message: "Something went wrong updating order" },
        { status: 500 }
      );
    }
  })(req, { params });
}

