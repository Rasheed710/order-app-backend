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
import { logOrderActivity } from '../../../../../lib/orderLogger';

// GET: Fetch single order
// export async function GET(req: Request, { params }: { params: { id: string } }) {
//   try {
//     const { userId, userRole } = await authMiddleware(req)
//     const { id } = params

//     const order = await prisma.order.findUnique({
//       where: { id },
//       include: {
//         party: { select: { id: true, name: true, email: true, phone: true } },
//         user: { select: { id: true, name: true, email: true } },
//         orderItems: { include: { product: true } },
//       },
//     })

//     if (!order) {
//       return NextResponse.json({ message: 'Order not found' }, { status: 404 })
//     }

//     // Restrict customer from viewing others' orders
//     if (userRole === 'CUSTOMER' && order.userId !== userId) {
//       return NextResponse.json({ message: 'Forbidden: You can only view your own orders' }, { status: 403 })
//     }

//     return NextResponse.json(order, { status: 200 })
//   } catch (error) {
//     console.error('Get order error:', error)
//     return NextResponse.json({ message: 'Something went wrong fetching order' }, { status: 500 })
//   }
// }

// export async function GET(req: Request, { params }: { params: { id: string } }) {
//   try {
//     const { userId, userRole } = await authMiddleware(req);
//     const { id } = params;

//     if (!id) {
//       return NextResponse.json({ message: "Order ID is required" }, { status: 400 });
//     }

//     const order = await prisma.order.findUnique({
//       where: { id },
//       include: {
//         party: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//             phone: true,
//             address: true,
//           },
//         },
//         user: { select: { id: true, name: true, email: true } },
//         orderItems: {
//           include: {
//             product: {
//               select: {
//                 id: true,
//                 name: true,
//                 price: true,
//                 stock: true,
//               },
//             },
//           },
//         },
//       },
//     });

//     if (!order) {
//       return NextResponse.json({ message: "Order not found" }, { status: 404 });
//     }

//     // Restrict non-admin users from accessing others' orders
//     if (userRole !== "ADMIN" && order.userId !== userId) {
//       return NextResponse.json(
//         { message: "Forbidden: You can only view your own orders" },
//         { status: 403 }
//       );
//     }

//     return NextResponse.json(order, { status: 200 });
//   } catch (error: any) {
//     console.error("Get order error:", error);

//     if (error.message?.includes("Token expired")) {
//       return NextResponse.json({ message: "Token expired" }, { status: 401 });
//     }

//     return NextResponse.json(
//       { message: "Something went wrong fetching order" },
//       { status: 500 }
//     );
//   }
// }
// export const GET = authMiddleware(async (req, context) => {
//   try {
//     const { userId, userRole, params } = context;
//     const { id } = params;

//     if (!id) {
//       return NextResponse.json(
//         { message: "Order ID is required" },
//         { status: 400 }
//       );
//     }

//     // ✅ Fetch order with relations
//     const order = await prisma.order.findUnique({
//       where: { id },
//       include: {
//         party: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//             phone: true,
//             address: true,
//           },
//         },
//         user: { select: { id: true, name: true, email: true } },
//         orderItems: {
//           include: {
//             product: {
//               select: {
//                 id: true,
//                 name: true,
//                 price: true,
//                 stock: true,
//               },
//             },
//           },
//         },
//       },
//     });

//     if (!order) {
//       return NextResponse.json({ message: "Order not found" }, { status: 404 });
//     }

//     // ✅ Access restriction for non-admins
//     if (userRole !== "ADMIN" && order.userId !== userId) {
//       return NextResponse.json(
//         { message: "Forbidden: You can only view your own orders" },
//         { status: 403 }
//       );
//     }

//     return NextResponse.json(order, { status: 200 });
//   } catch (error: any) {
//     console.error("Get order error:", error);

//     if (error.message?.includes("Token expired")) {
//       return NextResponse.json({ message: "Token expired" }, { status: 401 });
//     }

//     return NextResponse.json(
//       { message: "Something went wrong fetching order" },
//       { status: 500 }
//     );
//   }
// });
export const GET = authMiddleware(async (req, context) => {
  try {
    const { userId, userRole, params } = context;
    const { id } = params;

    if (!id) {
      return NextResponse.json({ message: "Order ID is required" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        party: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
          },
        },
        user: { select: { id: true, name: true, email: true } },
        orderItems: {
          include: {
            product: {
              select: { id: true, name: true, price: true, stock: true },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // ✅ Restrict normal users to their own orders
    if (userRole !== "ADMIN" && order.userId !== userId) {
      return NextResponse.json(
        { message: "Forbidden: You can only view your own orders" },
        { status: 403 }
      );
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error: any) {
    console.error("Get order error:", error);

    if (error.message?.includes("Token expired")) {
      return NextResponse.json({ message: "Token expired" }, { status: 401 });
    }

    return NextResponse.json(
      { message: "Something went wrong fetching order" },
      { status: 500 }
    );
  }
});

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
// export async function PUT(req: Request, { params }: { params: { id: string } }) {
//   // Extract order id from route params
//   const { id } = params;

//   if (!id) {
//     return NextResponse.json({ message: "Order ID is required" }, { status: 400 });
//   }

//   return authMiddleware(async (req, context) => {
//     try {
//       const { userId, userRole } = context;

//       if (userRole !== "ADMIN") {
//         return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
//       }

//       const body = await req.json();
//       const { status } = body;

//       if (!['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].includes(status)) {
//         return NextResponse.json({ message: "Invalid order status" }, { status: 400 });
//       }

//       const updatedOrder = await prisma.order.update({
//         where: { id }, // use extracted route param
//         data: { status },
//         include: {
//           user: { select: { name: true, email: true } },
//           party: { select: { name: true } },
//           orderItems: {
//             include: {
//               product: { select: { name: true, price: true, stock: true } }
//             }
//           }
//         }
//       });

//       return NextResponse.json(updatedOrder, { status: 200 });
//     } catch (error) {
//       console.error("Update order error:", error);
//       return NextResponse.json(
//         { message: "Something went wrong updating order" },
//         { status: 500 }
//       );
//     }
//   })(req, { params });
// }
// export async function PUT(req: Request, { params }: { params: { id: string } }) {
//   const { id } = params;

//   if (!id) {
//     return NextResponse.json({ message: "Order ID is required" }, { status: 400 });
//   }

//   return authMiddleware(async (req, context) => {
//     try {
//       const { userRole,userId } = context;

//       if (userRole !== "ADMIN") {
//         return NextResponse.json({ message: "Unauthorized: Admins only" }, { status: 403 });
//       }

//       const body = await req.json();
//       const { status } = body;

//       const validStatuses = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];
//       if (!validStatuses.includes(status)) {
//         return NextResponse.json(
//           { message: "Invalid order status", allowed: validStatuses },
//           { status: 400 }
//         );
//       }

//       const existingOrder = await prisma.order.findUnique({ where: { id } });
//       if (!existingOrder) {
//         return NextResponse.json({ message: "Order not found" }, { status: 404 });
//       }

//       const updatedOrder = await prisma.order.update({
//         where: { id },
//         data: { status },
//         include: {
//           user: { select: { id: true, name: true, email: true } },
//           party: { select: { id: true, name: true, phone: true, address: true } },
//           orderItems: {
//             include: {
//               product: { select: { id: true, name: true, price: true, stock: true } },
//             },
//           },
//         },
//       });
//       await logOrderActivity({
//         orderId: updatedOrder.id,
//         userId,
//         action: "STATUS_UPDATED",
//         message: `Order status changed to ${status} by ${updatedOrder.user?.name || "Admin"}`,
//       });
//       return NextResponse.json(
//         {
//           message: `Order status updated to ${status}`,
//           order: updatedOrder,
//         },
//         { status: 200 }
//       );
//     } catch (error: any) {
//       console.error("Update order error:", error);

//       if (error.message?.includes("Token expired")) {
//         return NextResponse.json({ message: "Token expired" }, { status: 401 });
//       }

//       return NextResponse.json(
//         { message: "Something went wrong updating order" },
//         { status: 500 }
//       );
//     }
//   })(req, { params });
// }

// export const PUT = authMiddleware(async (req, context) => {
//   try {
//     const { userRole, userId, params } = context;
//     const { id } = params;

//     if (!id) {
//       return NextResponse.json({ message: "Order ID is required" }, { status: 400 });
//     }

//     const body = await req.json();
//     const { status } = body;

//     const validStatuses = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];
//     if (!validStatuses.includes(status)) {
//       return NextResponse.json(
//         { message: "Invalid order status", allowed: validStatuses },
//         { status: 400 }
//       );
//     }

//     // 🧾 Fetch the existing order
//     const existingOrder = await prisma.order.findUnique({
//       where: { id },
//       include: { user: true },
//     });

//     if (!existingOrder) {
//       return NextResponse.json({ message: "Order not found" }, { status: 404 });
//     }

//     // 🧠 Role-based authorization logic
//     if (userRole === "ADMIN") {
//       // ✅ Admin can only update to CONFIRMED, SHIPPED, or CANCELLED
//       if (!["CONFIRMED", "SHIPPED", "CANCELLED"].includes(status)) {
//         return NextResponse.json(
//           {
//             message:
//               "Admins can only change status to CONFIRMED, SHIPPED, or CANCELLED.",
//           },
//           { status: 403 }
//         );
//       }
//     } else {
//       // ✅ Non-admin (salesman/customer)
//       if (userId !== existingOrder.userId) {
//         return NextResponse.json(
//           { message: "Forbidden: You can only update your own orders" },
//           { status: 403 }
//         );
//       }

//       if (!["DELIVERED", "CANCELLED"].includes(status)) {
//         return NextResponse.json(
//           {
//             message:
//               "You can only mark your order as DELIVERED or CANCELLED.",
//           },
//           { status: 403 }
//         );
//       }
//     }

//     // ✅ Update order status
//     const updatedOrder = await prisma.order.update({
//       where: { id },
//       data: { status },
//       include: {
//         user: { select: { id: true, name: true, email: true } },
//         party: { select: { id: true, name: true, phone: true, address: true } },
//         orderItems: {
//           include: {
//             product: { select: { id: true, name: true, price: true, stock: true } },
//           },
//         },
//       },
//     });

//     // ✅ Identify actor (the person making the change)
//     const actingUser = await prisma.user.findUnique({
//       where: { id: userId },
//       select: { name: true, role: true },
//     });

//     // ✅ Log activity
//     await logOrderActivity({
//       orderId: updatedOrder.id,
//       userId,
//       action: "STATUS_UPDATED",
//       message: `Order status changed to ${status} by ${actingUser?.name || "User"}`,
//     });

//     return NextResponse.json(
//       {
//         message: `Order status updated to ${status}`,
//         order: updatedOrder,
//       },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     console.error("Update order error:", error);

//     if (error.message?.includes("Token expired")) {
//       return NextResponse.json({ message: "Token expired" }, { status: 401 });
//     }

//     return NextResponse.json(
//       { message: "Something went wrong updating order" },
//       { status: 500 }
//     );
//   }
// });


import { sendNotificationToUser, sendNotificationToAdmins } from "../../../../../lib/sendNotification"; 

export const PUT = authMiddleware(async (req, context) => {
  try {
    const { userRole, userId, params } = context;
    const { id } = params;

    if (!id) {
      return NextResponse.json({ message: "Order ID is required" }, { status: 400 });
    }

    const body = await req.json();
    const { status } = body;

    const validStatuses = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { message: "Invalid order status", allowed: validStatuses },
        { status: 400 }
      );
    }

    // 🧾 Fetch existing order
    const existingOrder = await prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, role: true, fcmToken: true } },
        party: true,
      },
    });

    if (!existingOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // 🧠 Role-based authorization
    if (userRole === "ADMIN") {
      if (!["CONFIRMED", "SHIPPED", "CANCELLED"].includes(status)) {
        return NextResponse.json(
          { message: "Admins can only change status to CONFIRMED, SHIPPED, or CANCELLED." },
          { status: 403 }
        );
      }
    } else {
      if (userId !== existingOrder.user.id) {
        return NextResponse.json(
          { message: "Forbidden: You can only update your own orders" },
          { status: 403 }
        );
      }
      if (!["DELIVERED", "CANCELLED"].includes(status)) {
        return NextResponse.json(
          { message: "You can only mark your order as DELIVERED or CANCELLED." },
          { status: 403 }
        );
      }
    }

    // ✅ Update order status
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        user: { select: { id: true, name: true, email: true, fcmToken: true } },
        party: { select: { id: true, name: true } },
        orderItems: {
          include: { product: { select: { name: true, price: true } } },
        },
      },
    });

    // 🧍 Identify actor
    const actingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, role: true },
    });

    // 📝 Log order activity
    await logOrderActivity({
      orderId: updatedOrder.id,
      userId,
      action: "STATUS_UPDATED",
      message: `Order status changed to ${status} by ${actingUser?.name || "User"}`,
    });

    // 🔔 Send Notification
    const title = `Order #${updatedOrder.id.slice(0, 6)} status updated`;
    const message = `Order is now ${status} for ${updatedOrder.party?.name || "Party"}`;

    // if (userRole === "ADMIN") {
    //   // Notify the salesman
    //   if (existingOrder.user?.fcmToken) {
    //     await sendNotificationToUser(
    //       existingOrder.user.id,
    //       title,
    //       message
    //     );
    //   }
    // } else {
    //   // Notify all admins
    //   await sendNotificationToAdmins(title, `${actingUser?.name} marked an order as ${status}.`);
    // }
    if (userRole === "ADMIN") {
      // 🔹 Notify the salesman (order owner)
      if (existingOrder.user?.fcmToken) {
        await sendNotificationToUser(
          existingOrder.user.id,
          "📦 Order Status Updated",
          `Your order for ${existingOrder.party?.name || "the party"} was marked as ${status}.`,
          {
            type: "ORDER_UPDATE",
            extra: {
              screen: "OrderDetails",
              orderId: existingOrder.id,
              partyId: existingOrder.partyId,
              status,
            },
          }
        );
      }
    } else {
      // 🔹 Notify all admins
      await sendNotificationToAdmins(
        "📋 Order Updated by Salesman",
        `${actingUser?.name || "A salesman"} marked order #${existingOrder.id} as ${status}.`,
        {
          type: "ORDER_UPDATE_ADMIN",
          extra: {
            screen: "OrderDetails",
            orderId: existingOrder.id,
            partyId: existingOrder.partyId,
            updatedBy: actingUser?.id,
            status,
          },
        }
      );
    }
    

    return NextResponse.json(
      { message: `Order status updated to ${status}`, order: updatedOrder },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Update order error:", error);

    if (error.message?.includes("Token expired")) {
      return NextResponse.json({ message: "Token expired" }, { status: 401 });
    }

    return NextResponse.json(
      { message: "Something went wrong updating order" },
      { status: 500 }
    );
  }
});



// =======================
// DELETE: Remove an Order (Admins only)
// =======================
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ message: "Order ID is required" }, { status: 400 });
  }

  return authMiddleware(async (req, context) => {
    try {
      const { userRole,userId } = context;

      // ✅ Only Admins can delete orders
      if (userRole !== "ADMIN") {
        return NextResponse.json({ message: "Unauthorized: Admins only" }, { status: 403 });
      }

      // ✅ Check if order exists
      const existingOrder = await prisma.order.findUnique({
        where: { id },
        include: {
          orderItems: {
            include: { product: { select: { id: true, name: true } } },
          },
        },
      });

      if (!existingOrder) {
        return NextResponse.json({ message: "Order not found" }, { status: 404 });
      }

      // ✅ Restore product stock before deleting (if desired)
      // This ensures deleting an order adds back its item quantities.
      await prisma.$transaction(async (tx) => {
        for (const item of existingOrder.orderItems) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }

        // Delete related orderItems first (cascade if not set)
        await tx.orderItem.deleteMany({ where: { orderId: id } });

        // Delete the order itself
        await tx.order.delete({ where: { id } });
      });
      await logOrderActivity({
        orderId: id,
        userId,
        action: "ORDER_DELETED",
        message: "Order deleted by Admin",
      });
      return NextResponse.json(
        { message: `Order ${id} deleted successfully` },
        { status: 200 }
      );
    } catch (error: any) {
      console.error("Delete order error:", error);

      if (error.message?.includes("Token expired")) {
        return NextResponse.json({ message: "Token expired" }, { status: 401 });
      }

      return NextResponse.json(
        { message: "Something went wrong deleting the order" },
        { status: 500 }
      );
    }
  })(req, { params });
}


