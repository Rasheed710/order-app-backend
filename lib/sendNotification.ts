import admin from "./firebaseAdmin";
import prisma from "./prisma";

/**
 * ✅ Create a NotificationLog record (admin broadcast history)
 */
async function createNotificationLog({
  title,
  body,
  sendToAll = false,
  recipientIds,
  createdBy,
}: {
  title: string;
  body: string;
  sendToAll?: boolean;
  recipientIds?: string[] | null;
  createdBy?: string | null;
}) {
  try {
    await prisma.notificationLog.create({
      data: {
        title,
        body,
        sendToAll,
        recipientIds: recipientIds && recipientIds.length ? recipientIds.join(",") : null,
        createdBy: createdBy || null,
      },
    });
  } catch (err) {
    console.error("❌ Failed to write NotificationLog:", err);
  }
}

/**
 * ✅ Create per-user Notification inbox entries and optionally send FCM pushes
 */
// async function createUserNotificationsAndPush(
//   users: { id: string; fcmToken?: string | null }[],
//   title: string,
//   body: string,
//   type?: string,
//   extra?: Record<string, any>
// ) {
//   const CHUNK_SIZE = 200;

//   for (let i = 0; i < users.length; i += CHUNK_SIZE) {
//     const chunk = users.slice(i, i + CHUNK_SIZE);

//     // Create per-user inbox notifications
//     const createManyData = chunk.map((u) => ({
//       userId: u.id,
//       title,
//       body,
//       type: type || null,
//       extra: extra ? JSON.stringify(extra) : null,
//     }));

//     try {
//       await prisma.notification.createMany({
//         data: createManyData,
//         skipDuplicates: true,
//       });
//     } catch (err) {
//       console.error("⚠️ createMany failed, falling back to individual inserts:", err);
//       for (const d of createManyData) {
//         try {
//           await prisma.notification.create({
//             data: d,
//           });
//         } catch (e) {
//           console.error("⚠️ Single insert failed:", e);
//         }
//       }
//     }

//     // Send push only to users with valid FCM tokens
//     const tokens = chunk.map((u) => u.fcmToken).filter(Boolean) as string[];
//     if (tokens.length > 0) {
//       try {
//         // const message = {
//         //   notification: { title, body },
//         //   android: { priority: "high" },
//         //   apns: { payload: { aps: { sound: "default" } } },
//         // };

//         const message = {
//           notification: { title, body },
//           data: extra ? Object.fromEntries(Object.entries(extra).map(([k, v]) => [k, String(v)])) : {}, // 🔹 must be stringified values
//           android: {
//             priority: "high",
//             notification: {
//               channelId: "default",
//               sound: "default",
//             },
//           },
//           apns: {
//             payload: {
//               aps: { sound: "default" },
//             },
//           },
//         };
        

//         const res = await admin.messaging().sendEachForMulticast({ tokens, ...message });

//         const failed = res.responses.filter((r) => !r.success);
//         if (failed.length > 0) {
//           console.warn(
//             `⚠️ ${failed.length}/${tokens.length} FCM sends failed:`,
//             failed.map((f) => f.error?.message)
//           );
//         } else {
//           console.log(`✅ Push sent to ${tokens.length} users`);
//         }
//       } catch (err) {
//         console.error("❌ FCM send error:", err);
//       }
//     }
//   }
// }

/**
 * ✅ Create per-user Notification inbox entries and optionally send FCM pushes
 */
export async function createUserNotificationsAndPush(
  users: { id: string; fcmToken?: string | null }[],
  title: string,
  body: string,
  type?: string,
  extra?: Record<string, any>
) {
  const CHUNK_SIZE = 200;

  for (let i = 0; i < users.length; i += CHUNK_SIZE) {
    const chunk = users.slice(i, i + CHUNK_SIZE);

    // 📨 Create per-user inbox notifications
    const createManyData = chunk.map((u) => ({
      userId: u.id,
      title,
      body,
      type: type || null,
      extra: extra ? JSON.stringify(extra) : null,
    }));

    try {
      await prisma.notification.createMany({
        data: createManyData,
        skipDuplicates: true,
      });
    } catch (err) {
      console.error("⚠️ createMany failed, inserting individually:", err);
      for (const d of createManyData) {
        try {
          await prisma.notification.create({ data: d });
        } catch (e) {
          console.error("⚠️ Single notification insert failed:", e);
        }
      }
    }

    // 🔹 Send FCM Pushes
    const tokens = chunk.map((u) => u.fcmToken).filter(Boolean) as string[];
    if (tokens.length === 0) continue;

    try {
      // FCM requires data payload values as strings
      const stringifiedData =
        extra && Object.keys(extra).length
          ? Object.fromEntries(
              Object.entries(extra).map(([k, v]) => [k, String(v)])
            )
          : {};

      const message = {
        notification: {
          title,
          body,
        },
        data: {
          ...stringifiedData,
          type: type || "",
        },
        android: {
          priority: "high",
          notification: {
            channelId: "default",
            sound: "default",
          },
        },
        apns: {
          payload: {
            aps: { sound: "default" },
          },
        },
      webpush: {
  headers: { Urgency: "high" },
  notification: {
    title,
    body,
    vibrate: [100, 50, 100],
    tag: "order-notification",
    data: { targetUrl: "/admin/orders" }, // ✅ Use `data` instead
  },
  fcmOptions: {
    link: "/admin/orders",
  },
},
      };

      const res = await admin.messaging().sendEachForMulticast({
        tokens,
        ...message,
      });

      const failed = res.responses.filter((r) => !r.success);
      const success = res.successCount;

      console.log(`✅ Push sent to ${success}/${tokens.length} users`);
      // if (failed.length > 0) {
      //   console.warn(
      //     `⚠️ ${failed.length} sends failed:`,
      //     failed.map((f) => f.error?.message)
      //   );
      // }
      if (failed.length > 0) {
        const retryTokens = failed
          .map((f, i) => (!f.success ? tokens[i] : null))
          .filter(Boolean);
        if (retryTokens.length) {
          console.warn(`🔁 Retrying ${retryTokens.length} failed notifications...`);
          await admin.messaging().sendEachForMulticast({
            tokens: retryTokens,
            ...message,
          });
        }
      }
    } catch (err) {
      console.error("❌ FCM send error:", err);
    }
  }
}


/* -------------------------------------------------------------------------- */
/*                            PUBLIC NOTIFICATION API                         */
/* -------------------------------------------------------------------------- */

/**
 * ✅ Send to a single user (push + inbox + log)
 */
export async function sendNotificationToUser(
  userId: string,
  title: string,
  body: string,
  opts?: { type?: string; extra?: Record<string, any>; createdBy?: string | null }
) {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      console.warn("⚠️ sendNotificationToUser: user not found", userId);
      return;
    }

    if (!user.fcmToken) {
      console.warn(`⚠️ User ${user.id} has no FCM token`);
      return;
    }

    await createNotificationLog({
      title,
      body,
      sendToAll: false,
      recipientIds: [userId],
      createdBy: opts?.createdBy || null,
    });

    await createUserNotificationsAndPush(
      [{ id: user.id, fcmToken: user.fcmToken }],
      title,
      body,
      opts?.type,
      opts?.extra
    );

    console.log(`📨 Sent notification to user: ${user.id}`);
  } catch (err) {
    console.error("❌ sendNotificationToUser error:", err);
  }
}

/**
 * ✅ Send to all admins
 */
export async function sendNotificationToAdmins(
  title: string,
  body: string,
  opts?: { type?: string; extra?: any; createdBy?: string | null }
) {
  try {
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { id: true, fcmToken: true },
    });

    if (!admins.length) {
      console.warn("⚠️ No admins found for notification.");
      return;
    }
    console.log(`📤 Sending admin notification to ${admins.length} admins`);


    await createNotificationLog({
      title,
      body,
      sendToAll: false,
      recipientIds: admins.map((a) => a.id),
      createdBy: opts?.createdBy || null,
    });

    await createUserNotificationsAndPush(admins, title, body, opts?.type, opts?.extra);
    console.log(`📨 Sent notification to user: ${admins}`);
  } catch (err) {
    console.error("❌ sendNotificationToAdmins error:", err);
  }
}

/**
 * ✅ Send to all users (broadcast)
 */
export async function sendNotificationToAllUsers(
  title: string,
  body: string,
  opts?: { type?: string; extra?: any; createdBy?: string | null }
) {
  try {
    const users = await prisma.user.findMany({
      where: {},
      select: { id: true, fcmToken: true },
    });

    if (!users.length) {
      console.warn("⚠️ No users found for broadcast.");
      return;
    }

    await createNotificationLog({
      title,
      body,
      sendToAll: true,
      recipientIds: null,
      createdBy: opts?.createdBy || null,
    });

    await createUserNotificationsAndPush(users, title, body, opts?.type, opts?.extra);
  } catch (err) {
    console.error("❌ sendNotificationToAllUsers error:", err);
  }
}

/**
 * ✅ Send to a list of specific users (multi-target)
 */
export async function sendNotificationToUsers(
  userIds: string[],
  title: string,
  body: string,
  opts?: { type?: string; extra?: any; createdBy?: string | null }
) {
  try {
    if (!Array.isArray(userIds) || userIds.length === 0) {
      console.warn("⚠️ sendNotificationToUsers called with empty userIds");
      return;
    }

    const recipients = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, fcmToken: true },
    });

    if (!recipients.length) {
      console.warn("⚠️ No valid recipients found:", userIds);
      return;
    }

    const usersWithToken = recipients.filter((u) => u.fcmToken);
    const usersWithoutToken = recipients.filter((u) => !u.fcmToken);

    await createNotificationLog({
      title,
      body,
      sendToAll: false,
      recipientIds: recipients.map((r) => r.id),
      createdBy: opts?.createdBy || null,
    });

    await createUserNotificationsAndPush(recipients, title, body, opts?.type, opts?.extra);

    console.log("📨 Notification Summary:");
    console.log("Title:", title);
    console.log("Recipients:", recipients.map((r) => r.id));
    console.log("With Token:", usersWithToken.length);
    console.log("Without Token:", usersWithoutToken.length);
  } catch (err) {
    console.error("❌ sendNotificationToUsers error:", err);
  }
}
