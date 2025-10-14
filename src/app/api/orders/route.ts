// // pages/api/orders/index.ts
// import type { NextApiResponse } from 'next'
// import { AuthenticatedRequest, authMiddleware, adminMiddleware } from '../../../../lib/authMiddleware'
// import prisma from '../../../../lib/prisma'

// const handleOrders = async (req: AuthenticatedRequest, res: NextApiResponse) => {
//   switch (req.method) {
//     case 'GET':
//       // Admin can get all orders; Customer can get their own orders
//       try {
//         let orders;
//         if (req.userRole === 'ADMIN') {
//           orders = await prisma.order.findMany({
//             include: {
//               user: { select: { id: true, name: true, email: true } },
//               orderItems: {
//                 include: { product: { select: { name: true, price: true } } },
//               },
//             },
//             orderBy: { createdAt: 'desc' },
//           })
//         } else { // CUSTOMER
//           orders = await prisma.order.findMany({
//             where: { userId: req.userId },
//             include: {
//               orderItems: {
//                 include: { product: { select: { name: true, price: true } } },
//               },
//             },
//             orderBy: { createdAt: 'desc' },
//           })
//         }
//         res.status(200).json(orders)
//       } catch (error) {
//         console.error('Get all orders error:', error)
//         res.status(500).json({ message: 'Something went wrong fetching orders' })
//       }
//       break

//     case 'POST':
//       // Authenticated users can place orders (CUSTOMER role implied by default)
//       try {
//         const { items } = req.body as { items: Array<{ productId: string, quantity: number }> }

//         if (!items || items.length === 0) {
//           return res.status(400).json({ message: 'Order must contain at least one item' })
//         }

//         const productIds = items.map(item => item.productId)
//         const products = await prisma.product.findMany({
//           where: {
//             id: { in: productIds },
//           },
//         })

//         if (products.length !== productIds.length) {
//           return res.status(400).json({ message: 'One or more products not found' })
//         }

//         let total = 0
//         const orderItemsData = items.map(item => {
//           const product = products.find(p => p.id === item.productId)
//           if (!product || product.stock < item.quantity) {
//               throw new Error(`Product ${product?.name || item.productId} is out of stock or insufficient quantity.`);
//           }
//           const itemPrice = product.price * item.quantity;
//           total += itemPrice;
//           return {
//             productId: item.productId,
//             quantity: item.quantity,
//             price: product.price, // Price at the time of order
//           }
//         })

//         // Use a transaction to create order and update product stock atomically
//         const result = await prisma.$transaction(async (tx) => {
//           const newOrder = await tx.order.create({
//             data: {
//               userId: req.userId!,
//               status: 'PENDING',
//               total: total,
//               orderItems: {
//                 createMany: {
//                   data: orderItemsData,
//                 },
//               },
//             },
//             include: {
//               orderItems: true
//             }
//           })

//           // Update product stock
//           for (const item of items) {
//             await tx.product.update({
//               where: { id: item.productId },
//               data: {
//                 stock: {
//                   decrement: item.quantity,
//                 },
//               },
//             });
//           }
//           return newOrder;
//         });

//         res.status(201).json(result)
//       } catch (error: any) {
//         console.error('Place order error:', error)
//         res.status(500).json({ message: error.message || 'Something went wrong placing the order' })
//       }
//       break

//     default:
//       res.setHeader('Allow', ['GET', 'POST'])
//       res.status(405).end(`Method ${req.method} Not Allowed`)
//   }
// }

// export default authMiddleware(handleOrders)
// app/api/orders/route.ts
import { NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma'
import { authMiddleware } from '../../../../lib/authMiddleware'

// GET: Admin → all orders, Customer → own orders
export async function GET(req: Request) {
  try {
    const { userId, userRole } = await authMiddleware(req)

    let orders
    if (userRole === 'ADMIN') {
      orders = await prisma.order.findMany({
        include: {
          user: { select: { id: true, name: true, email: true } },
          party: { select: { id: true, name: true, email: true, phone: true } },
          orderItems: {
            include: { product: { select: { name: true, price: true,stock: true } } },
          },
        },
        orderBy: { createdAt: 'desc' },
      })
    } else {
      orders = await prisma.order.findMany({
        where: { userId },
        include: {
          party: { select: { id: true, name: true, email: true, phone: true } },
          orderItems: {
            include: { product: { select: { name: true, price: true,stock: true} } },
          },
        },
        orderBy: { createdAt: 'desc' },
      })
    }

    return NextResponse.json(orders, { status: 200 })
  } catch (error) {
    console.error('Get all orders error:', error)
    return NextResponse.json(
      { message: 'Something went wrong fetching orders' },
      { status: 500 }
    )
  }
}

// POST: Place new order
// export async function POST(req: Request,context: { userId: any }) {
//   try {
//     const { userId } = context; 

// if (!userId) {
//   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
// }
//     const { partyId,items } = await req.json() as {
//       partyId: string;
//       items: Array<{ productId: string; quantity: number }>
//     }
//     if (!partyId) {
//       return NextResponse.json({ message: "Party ID is required" }, { status: 400 });
//     }

//     const party = await prisma.party.findUnique({ where: { id: partyId } });
//     if (!party) {
//       return NextResponse.json({ message: "Party not found" }, { status: 404 });
//     }
//     if (!items || items.length === 0) {
//       return NextResponse.json(
//         { message: 'Order must contain at least one item' },
//         { status: 400 }
//       )
//     }

//     const productIds = items.map((item) => item.productId)
//     const products = await prisma.product.findMany({
//       where: { id: { in: productIds } },
//     })

//     if (products.length !== productIds.length) {
//       return NextResponse.json(
//         { message: 'One or more products not found' },
//         { status: 400 }
//       )
//     }

//     let total = 0
//     const orderItemsData = items.map((item) => {
//       const product = products.find((p) => p.id === item.productId)
//       if (!product || product.stock < item.quantity) {
//         throw new Error(
//           `Product ${product?.name || item.productId} is out of stock or insufficient quantity.`
//         )
//       }
//       const itemPrice = product.price * item.quantity
//       total += itemPrice
//       return {
//         productId: item.productId,
//         quantity: item.quantity,
//         price: product.price, // snapshot price at order time
//       }
//     })

//     // Transaction: create order + update stock
//     const result = await prisma.$transaction(async (tx) => {
//       const newOrder = await tx.order.create({
//         data: {
//           user: { connect: { id: userId } },
//           partyId,
//           status: 'PENDING',
//           total,
//           orderItems: {
//             createMany: { data: orderItemsData },
//           },
//         },
//         include: { orderItems: true },
//       })

//       for (const item of items) {
//         await tx.product.update({
//           where: { id: item.productId },
//           data: { stock: { decrement: item.quantity } },
//         })
//       }
//       return newOrder
//     })

//     return NextResponse.json(result, { status: 201 })
//   } catch (error: any) {
//     console.error('Place order error:', error)
//     return NextResponse.json(
//       { message: error.message || 'Something went wrong placing the order' },
//       { status: 500 }
//     )
//   }
// }

interface OrderItemBody {
  productId: string;
  quantity: number;
}

interface PlaceOrderBody {
  partyId: string;
  items: OrderItemBody[];
}

export const POST = authMiddleware(async (req, context: { userId: string }) => {
  try {
    const { userId } = context;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as PlaceOrderBody;
    const { partyId, items } = body;

    // Validate party
    if (!partyId) {
      return NextResponse.json({ message: "Party ID is required" }, { status: 400 });
    }

    const party = await prisma.party.findUnique({ where: { id: partyId } });
    if (!party) {
      return NextResponse.json({ message: "Party not found" }, { status: 404 });
    }

    // Validate items
    if (!items || items.length === 0) {
      return NextResponse.json({ message: "Order must contain at least one item" }, { status: 400 });
    }

    const productIds = items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json({ message: "One or more products not found" }, { status: 400 });
    }

    // Prepare order items and calculate total
    let total = 0;
    const orderItemsData = items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      if (product.stock < item.quantity) {
        throw new Error(`Product "${product.name}" is out of stock or insufficient quantity.`);
      }

      total += product.price * item.quantity;
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price, // snapshot price at order time
      };
    });

    // Transaction: create order + update stock atomically
    const newOrder = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          user: { connect: { id: userId } },
          party: { connect: { id: partyId } },
          status: "PENDING",
          total,
          orderItems: {
            createMany: { data: orderItemsData },
          },
        },
        include: { orderItems: true, party: true,  },
      });

      // Update stock for all products
      await Promise.all(
        items.map((item) =>
          tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          })
        )
      );

      return createdOrder;
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error: any) {
    console.error("Place order error:", error);
    return NextResponse.json(
      { message: error.message || "Something went wrong placing the order" },
      { status: 500 }
    );
  }
});