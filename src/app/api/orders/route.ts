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
import { logOrderActivity } from '../../../../lib/orderLogger';

// GET: Admin → all orders, Customer → own orders
// export async function GET(req: Request) {
//   try {
//     const { userId, userRole } = await authMiddleware(req)

//     let orders
//     if (userRole === 'ADMIN') {
//       orders = await prisma.order.findMany({
//         include: {
//           user: { select: { id: true, name: true, email: true } },
//           party: { select: { id: true, name: true, email: true, phone: true } },
//           orderItems: {
//             include: { product: { select: { name: true, price: true,stock: true } } },
//           },
//         },
//         orderBy: { createdAt: 'desc' },
//       })
//     } else {
//       orders = await prisma.order.findMany({
//         where: { userId },
//         include: {
//           party: { select: { id: true, name: true, email: true, phone: true } },
//           orderItems: {
//             include: { product: { select: { name: true, price: true,stock: true} } },
//           },
//         },
//         orderBy: { createdAt: 'desc' },
//       })
//     }

//     return NextResponse.json(orders, { status: 200 })
//   } catch (error) {
//     console.error('Get all orders error:', error)
//     return NextResponse.json(
//       { message: 'Something went wrong fetching orders' },
//       { status: 500 }
//     )
//   }
// }


// export async function GET(req: Request) {
//   try {
//     const { userId, userRole } = await authMiddleware(req);

//     const { searchParams } = new URL(req.url);

//     // ✅ Pagination
//     const page = parseInt(searchParams.get("page") || "1", 10);
//     const limit = parseInt(searchParams.get("limit") || "10", 10);
//     const skip = (page - 1) * limit;

//     // ✅ Search text
//     const search = searchParams.get("search")?.trim() || "";

//     // ✅ Base include (common fields)
//     const baseInclude = {
//       party: {
//         select: {
//           id: true,
//           name: true,
//           email: true,
//           phone: true,
//           address: true,
//         },
//       },
//       orderItems: {
//         include: {
//           product: {
//             select: { name: true, price: true, stock: true },
//           },
//         },
//       },
//     };

//     // ✅ Build search filters (for Admin & User)
//     const searchFilter = search
//       ? {
//           OR: [
//             { party: { name: { contains: search, mode: "insensitive" } } },
//             { party: { phone: { contains: search, mode: "insensitive" } } },
//             { id: { contains: search, mode: "insensitive" } }, // orderId match
//             ...(userRole === "ADMIN"
//               ? [{ user: { name: { contains: search, mode: "insensitive" } } }]
//               : []),
//           ],
//         }
//       : {};

//     // ✅ Filter by user if not admin
//     const whereClause =
//       userRole === "ADMIN"
//         ? searchFilter
//         : {
//             AND: [{ userId }, searchFilter],
//           };

//     // ✅ Count total matching records
//     const totalCount = await prisma.order.count({
//       where: whereClause,
//     });

//     // ✅ Fetch paginated, filtered orders
//     const orders = await prisma.order.findMany({
//       where: whereClause,
//       include:
//         userRole === "ADMIN"
//           ? {
//               ...baseInclude,
//               user: { select: { id: true, name: true, email: true } },
//             }
//           : baseInclude,
//       orderBy: { createdAt: "desc" },
//       skip,
//       take: limit,
//     });

//     // ✅ Pagination metadata
//     const totalPages = Math.ceil(totalCount / limit);

//     return NextResponse.json(
//       {
//         data: orders,
//         meta: {
//           page,
//           limit,
//           totalCount,
//           totalPages,
//           hasNextPage: page < totalPages,
//           hasPrevPage: page > 1,
//         },
//       },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     console.error("Get all orders error:", error);

//     if (error.message?.includes("Token expired")) {
//       return NextResponse.json({ message: "Token expired" }, { status: 401 });
//     }

//     return NextResponse.json(
//       { message: "Something went wrong fetching orders" },
//       { status: 500 }
//     );
//   }
// }


// export async function GET(req: Request) {
//   try {
//     // ✅ Authenticate
//     const { userId, userRole } = await authMiddleware(req);
//     const { searchParams } = new URL(req.url);

//     // ✅ Pagination
//     const page = parseInt(searchParams.get("page") || "1", 10);
//     const limit = parseInt(searchParams.get("limit") || "10", 10);
//     const skip = (page - 1) * limit;

//     // ✅ Optional search
//     const search = searchParams.get("search")?.trim() || "";

//     // ✅ Common include relations
//     const baseInclude = {
//       user: { select: { id: true, name: true, email: true } }, // who created order
//       party: {
//         select: { id: true, name: true, email: true, phone: true, address: true },
//       },
//       orderItems: {
//         include: {
//           product: { select: { id: true, name: true, price: true, stock: true } },
//         },
//       },
//     };

//     // ✅ Search filter (Order ID, Party name, or Party phone)
//     const searchFilter = search
//       ? {
//           OR: [
//             { id: { contains: search, mode: "insensitive" } },
//             { party: { name: { contains: search, mode: "insensitive" } } },
//             { party: { phone: { contains: search, mode: "insensitive" } } },
//             { user: { name: { contains: search, mode: "insensitive" } } },
//           ],
//         }
//       : {};

//     // ✅ Role-based access
//     const whereClause =
//       userRole === "ADMIN"
//         ? searchFilter // Admin can see all
//         : {
//             AND: [{ userId }, searchFilter], // Customer can only see their orders
//           };

//     // ✅ Count total
//     const totalCount = await prisma.order.count({ where: whereClause });

//     // ✅ Fetch paginated orders
//     const orders = await prisma.order.findMany({
//       where: whereClause,
//       include: baseInclude,
//       orderBy: { createdAt: "desc" },
//       skip,
//       take: limit,
//     });

//     // ✅ Pagination meta
//     const totalPages = Math.ceil(totalCount / limit);

//     return NextResponse.json(
//       {
//         data: orders,
//         meta: {
//           page,
//           limit,
//           totalCount,
//           totalPages,
//           hasNextPage: page < totalPages,
//           hasPrevPage: page > 1,
//           role: userRole,
//         },
//       },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     console.error("Get all orders error:", error);

//     if (error.message?.includes("Token expired")) {
//       return NextResponse.json({ message: "Token expired" }, { status: 401 });
//     }

//     return NextResponse.json(
//       { message: "Something went wrong fetching orders" },
//       { status: 500 }
//     );
//   }
// }

export const GET = authMiddleware(async (req, context) => {
  try {
    const { userId, userRole } = context; // ✅ now available here
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;
    const search = searchParams.get("search")?.trim() || "";

    const baseInclude = {
      user: { select: { id: true, name: true, email: true } },
      party: {
        select: { id: true, name: true, email: true, phone: true, address: true },
      },
      orderItems: {
        include: {
          product: { select: { id: true, name: true, price: true, stock: true } },
        },
      },
    };

    const searchFilter = search
      ? {
          OR: [
            { id: { contains: search, mode: "insensitive" } },
            { party: { name: { contains: search, mode: "insensitive" } } },
            { party: { phone: { contains: search, mode: "insensitive" } } },
            { user: { name: { contains: search, mode: "insensitive" } } },
          ],
        }
      : {};

    // ✅ Proper role-based filtering
    const whereClause =
      userRole === "ADMIN"
        ? searchFilter
        : {
            AND: [{ userId }, searchFilter],
          };

    const totalCount = await prisma.order.count({ where: whereClause });

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: baseInclude,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json(
      {
        data: orders,
        meta: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
          role: userRole,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get all orders error:", error);
    return NextResponse.json(
      { message: "Something went wrong fetching orders" },
      { status: 500 }
    );
  }
});





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

// export const POST = authMiddleware(async (req, context: { userId: string }) => {
//   try {
//     const { userId } = context;

//     if (!userId) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const body = (await req.json()) as PlaceOrderBody;
//     const { partyId, items } = body;

//     // Validate party
//     if (!partyId) {
//       return NextResponse.json({ message: "Party ID is required" }, { status: 400 });
//     }

//     const party = await prisma.party.findUnique({ where: { id: partyId } });
//     if (!party) {
//       return NextResponse.json({ message: "Party not found" }, { status: 404 });
//     }

//     // Validate items
//     if (!items || items.length === 0) {
//       return NextResponse.json({ message: "Order must contain at least one item" }, { status: 400 });
//     }

//     const productIds = items.map((item) => item.productId);
//     const products = await prisma.product.findMany({
//       where: { id: { in: productIds } },
//     });

//     if (products.length !== productIds.length) {
//       return NextResponse.json({ message: "One or more products not found" }, { status: 400 });
//     }

//     // Prepare order items and calculate total
//     let total = 0;
//     const orderItemsData = items.map((item) => {
//       const product = products.find((p) => p.id === item.productId);
//       if (!product) throw new Error(`Product ${item.productId} not found`);
//       if (product.stock < item.quantity) {
//         throw new Error(`Product "${product.name}" is out of stock or insufficient quantity.`);
//       }

//       total += product.price * item.quantity;
//       return {
//         productId: item.productId,
//         quantity: item.quantity,
//         price: product.price, // snapshot price at order time
//       };
//     });

//     // Transaction: create order + update stock atomically
//     const newOrder = await prisma.$transaction(async (tx) => {
//       const createdOrder = await tx.order.create({
//         data: {
//           user: { connect: { id: userId } },
//           party: { connect: { id: partyId } },
//           status: "PENDING",
//           total,
//           orderItems: {
//             createMany: { data: orderItemsData },
//           },
//         },
//         include: { orderItems: true, party: true,  },
//       });

//       // Update stock for all products
//       await Promise.all(
//         items.map((item) =>
//           tx.product.update({
//             where: { id: item.productId },
//             data: { stock: { decrement: item.quantity } },
//           })
//         )
//       );

//       return createdOrder;
//     });

//     return NextResponse.json(newOrder, { status: 201 });
//   } catch (error: any) {
//     console.error("Place order error:", error);
//     return NextResponse.json(
//       { message: error.message || "Something went wrong placing the order" },
//       { status: 500 }
//     );
//   }
// });

// export const POST = authMiddleware(async (req, context: { userId: string; userRole?: string }) => {
//   try {
//     const { userId } = context;

//     if (!userId) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const body = (await req.json()) as PlaceOrderBody;
//     const { partyId, items } = body;

//     // ✅ Validate party
//     if (!partyId) {
//       return NextResponse.json({ message: "Party ID is required" }, { status: 400 });
//     }

//     const party = await prisma.party.findUnique({ where: { id: partyId } });
//     if (!party) {
//       return NextResponse.json({ message: "Party not found" }, { status: 404 });
//     }

//     // ✅ Validate items
//     if (!items || items.length === 0) {
//       return NextResponse.json({ message: "Order must contain at least one item" }, { status: 400 });
//     }

//     const productIds = items.map((item) => item.productId);

//     const products = await prisma.product.findMany({
//       where: { id: { in: productIds } },
//       select: { id: true, name: true, price: true, stock: true },
//     });

//     // ✅ Check if all products exist
//     if (products.length !== productIds.length) {
//       const foundIds = products.map((p) => p.id);
//       const missing = productIds.filter((id) => !foundIds.includes(id));
//       return NextResponse.json(
//         { message: `Products not found: ${missing.join(", ")}` },
//         { status: 400 }
//       );
//     }

//     // ✅ Validate stock & calculate total
//     let total = 0;
//     const orderItemsData = items.map((item) => {
//       const product = products.find((p) => p.id === item.productId);
//       if (!product)
//         throw new Error(`Product ${item.productId} not found.`);
//       if (product.stock < item.quantity)
//         throw new Error(
//           `Insufficient stock for "${product.name}". Available: ${product.stock}`
//         );

//       total += product.price * item.quantity;
//       return {
//         productId: item.productId,
//         quantity: item.quantity,
//         price: product.price, // snapshot of price
//       };
//     });

//     // ✅ Transaction: create order + update stock atomically
//     const newOrder = await prisma.$transaction(async (tx) => {
//       // Create order
//       const createdOrder = await tx.order.create({
//         data: {
//           user: { connect: { id: userId } },
//           party: { connect: { id: partyId } },
//           status: "PENDING",
//           total,
//           orderItems: {
//             createMany: { data: orderItemsData },
//           },
//         },
//         include: {
//           user: { select: { id: true, name: true, email: true } }, // who created order
//           orderItems: {
//             include: { product: { select: { name: true, price: true } } },
//           },
//           party: { select: { id: true, name: true, phone: true, address: true } },
//         },
//       });

//       // Update stock
//       for (const item of items) {
//         await tx.product.update({
//           where: { id: item.productId },
//           data: { stock: { decrement: item.quantity } },
//         });
//       }

//       return createdOrder;
//     });
//     await logOrderActivity({
//       orderId: newOrder.id,
//       userId,
//       action: "ORDER_CREATED",
//       message: `Order created by ${newOrder?.user?.name || "User"}`,
//     });
//     // ✅ Return clean response
//     return NextResponse.json(
//       {
//         message: "Order placed successfully",
//         order: newOrder,
//       },
//       { status: 201 }
//     );
//   } catch (error: any) {
//     console.error("Place order error:", error);

//     if (error.message?.includes("Token expired")) {
//       return NextResponse.json({ message: "Token expired" }, { status: 401 });
//     }

//     // If Prisma transaction error
//     if (error.code === "P2002") {
//       return NextResponse.json(
//         { message: "Duplicate order or data conflict detected" },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json(
//       { message: error.message || "Something went wrong placing the order" },
//       { status: 500 }
//     );
//   }
// });



export const POST = authMiddleware(async (req, context: { userId: string; userRole?: string }) => {
  try {
    const { userId } = context;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { partyId, items } = body;

    // ✅ Validate party
    if (!partyId) {
      return NextResponse.json({ message: "Party ID is required" }, { status: 400 });
    }

    const party = await prisma.party.findUnique({ where: { id: partyId } });
    if (!party) {
      return NextResponse.json({ message: "Party not found" }, { status: 404 });
    }

    // ✅ Validate items
    if (!items || items.length === 0) {
      return NextResponse.json({ message: "Order must contain at least one item" }, { status: 400 });
    }

    const productIds = items.map((item: any) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, price: true, stock: true },
    });

    if (products.length !== productIds.length) {
      const foundIds = products.map((p) => p.id);
      const missing = productIds.filter((id: string) => !foundIds.includes(id));
      return NextResponse.json(
        { message: `Products not found: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    // ✅ Calculate total & validate stock
    let total = 0;
    const orderItemsData = items.map((item: any) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product)
        throw new Error(`Product ${item.productId} not found.`);
      if (product.stock < item.quantity)
        throw new Error(
          `Insufficient stock for "${product.name}". Available: ${product.stock}`
        );
      total += product.price * item.quantity;
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      };
    });

    // ✅ Auto-end break if user is still on break
    const activeBreak = await prisma.attendance.findFirst({
      where: { userId, clockOutTime: null, isOnBreak: true },
    });

    if (activeBreak) {
      await prisma.attendance.update({
        where: { id: activeBreak.id },
        data: {
          breakEnd: new Date(),
          isOnBreak: false,
        },
      });

      // 🧾 Log that the break was auto-ended
      await logOrderActivity({
        orderId: null,
        userId,
        action: "AUTO_BREAK_END",
        message: `Break automatically ended for user ${userId} during order creation.`,
      });

      console.log(`✅ Auto-ended break for user ${userId} during order creation`);
    }

    // ✅ Create order transaction
    const newOrder = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          user: { connect: { id: userId } },
          party: { connect: { id: partyId } },
          status: "PENDING",
          total,
          orderItems: { createMany: { data: orderItemsData } },
        },
        include: {
          user: { select: { id: true, name: true, email: true } },
          orderItems: { include: { product: { select: { name: true, price: true } } } },
          party: { select: { id: true, name: true, phone: true, address: true } },
        },
      });

      // ✅ Update stock for each product
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return createdOrder;
    });

    // ✅ Log order activity
    await logOrderActivity({
      orderId: newOrder.id,
      userId,
      action: "ORDER_CREATED",
      message: `Order created by ${newOrder?.user?.name || "User"}`,
    });

    return NextResponse.json(
      { message: "Order placed successfully", order: newOrder },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Place order error:", error);
    if (error.message?.includes("Token expired")) {
      return NextResponse.json({ message: "Token expired" }, { status: 401 });
    }
    if (error.code === "P2002") {
      return NextResponse.json(
        { message: "Duplicate order or data conflict detected" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: error.message || "Something went wrong placing the order" },
      { status: 500 }
    );
  }
});
