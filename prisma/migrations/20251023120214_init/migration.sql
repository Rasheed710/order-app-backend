-- AlterTable
ALTER TABLE "public"."Attendance" ADD COLUMN     "breakEnd" TIMESTAMP(3),
ADD COLUMN     "breakStart" TIMESTAMP(3),
ADD COLUMN     "isOnBreak" BOOLEAN NOT NULL DEFAULT false;
