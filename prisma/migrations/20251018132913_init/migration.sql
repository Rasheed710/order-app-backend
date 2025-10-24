-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "mobileOtp" TEXT,
ADD COLUMN     "mobileOtpExpiresAt" TIMESTAMP(3),
ADD COLUMN     "pendingMobile" TEXT;
