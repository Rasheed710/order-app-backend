-- DropForeignKey
ALTER TABLE "public"."Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "public"."Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_type_idx" ON "public"."Notification"("type");

-- CreateIndex
CREATE INDEX "Notification_read_idx" ON "public"."Notification"("read");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "public"."Notification"("createdAt");

-- CreateIndex
CREATE INDEX "NotificationLog_createdBy_idx" ON "public"."NotificationLog"("createdBy");

-- CreateIndex
CREATE INDEX "NotificationLog_createdAt_idx" ON "public"."NotificationLog"("createdAt");

-- CreateIndex
CREATE INDEX "NotificationLog_sendToAll_idx" ON "public"."NotificationLog"("sendToAll");

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
