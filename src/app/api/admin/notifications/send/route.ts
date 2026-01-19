// import { NextResponse } from "next/server";
// import { authMiddleware } from "../../../../../../lib/authMiddleware";
// import prisma from "../../../../../../lib/prisma";
// import { sendNotificationToAllUsers, sendNotificationToUser } from "../../../../../../lib/sendNotification";


// export const POST = authMiddleware(async (req, { userId, userRole }) => {
//   try {
//     if (userRole !== "ADMIN") {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
//     }

//     const body = await req.json();
//     const { title, body: messageBody, sendToAll, userIds } = body;

//     if (!title || !messageBody) {
//       return NextResponse.json({ message: "Missing title or body" }, { status: 400 });
//     }

//     // ✅ Collect recipients
//     let recipientIds: string[] = [];

//     if (sendToAll) {
//       const users = await prisma.user.findMany({
//         where: { fcmToken: { not: null } },
//         select: { id: true },
//       });
//       recipientIds = users.map((u) => u.id);

//       await sendNotificationToAllUsers(title, messageBody);
//     } else if (userIds?.length > 0) {
//       recipientIds = userIds;
//       for (const id of userIds) {
//         await sendNotificationToUser(id, title, messageBody);
//       }
//     } else {
//       return NextResponse.json({ message: "No recipients specified" }, { status: 400 });
//     }

//     // ✅ Store ONE log entry (not one per recipient)
//     await prisma.notificationLog.create({
//       data: {
//         title,
//         body: messageBody,
//         sendToAll: !!sendToAll,
//         recipientIds: recipientIds.join(","),
//         createdBy: userId,
//       },
//     });

//     return NextResponse.json({ message: "Notification sent successfully" });
//   } catch (error) {
//     console.error("Send notification error:", error);
//     return NextResponse.json({ message: "Failed to send notification" }, { status: 500 });
//   }
// });
import { NextResponse } from "next/server";
import { adminMiddleware } from "../../../../../../lib/authMiddleware";
import { sendNotificationToAllUsers, sendNotificationToUsers } from "../../../../../../lib/sendNotification";


export const POST = adminMiddleware(async (req, { userId: adminId }) => {
  try {
    const body = await req.json();
    const { title, body: messageBody, sendToAll, userIds } = body;

    if (!title || !messageBody) {
      return NextResponse.json({ message: "Title and body are required" }, { status: 400 });
    }

    // if (sendToAll) {
    //   // ✅ Send once globally
    //   await sendNotificationToAllUsers(title, messageBody, { createdBy: adminId });
    // } else if (Array.isArray(userIds) && userIds.length > 0) {
    //   // ✅ Send to a list in one batch (no duplicates)
    //   await sendNotificationToUsers(userIds, title, messageBody, { createdBy: adminId });
    // } else {
    //   return NextResponse.json({ message: "No users selected" }, { status: 400 });
    // }
    if (sendToAll) {
      // ✅ Broadcast: Send once globally
      await sendNotificationToAllUsers(title, messageBody, {
        type: "GLOBAL_BROADCAST",
        extra: {
          screen: "Notifications",
          source: "AdminBroadcast",
        },
        createdBy: adminId,
      });
    
      console.log(`📢 Broadcast sent by Admin (${adminId}) to all users`);
    
    } else if (Array.isArray(userIds) && userIds.length > 0) {
      // ✅ Targeted: Send to selected users (avoid duplicates)
      const uniqueUserIds = [...new Set(userIds)];
    
      await sendNotificationToUsers(uniqueUserIds, title, messageBody, {
        type: "TARGETED_NOTIFICATION",
        extra: {
          screen: "Notifications",
          recipients: uniqueUserIds,
          source: "AdminPanel",
        },
        createdBy: adminId,
      });
    
      console.log(`📨 Notification sent to ${uniqueUserIds.length} selected users by Admin (${adminId})`);
    
    } else {
      // ⚠️ No users provided
      return NextResponse.json(
        { message: "No users selected for notification" },
        { status: 400 }
      );
    }
    

    return NextResponse.json({ message: "Notification sent successfully" }, { status: 200 });
  } catch (err) {
    console.error("Send notification error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
});
