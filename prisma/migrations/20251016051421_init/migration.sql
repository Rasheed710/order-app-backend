-- AlterTable
ALTER TABLE "public"."Party" ADD COLUMN     "createdById" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Party" ADD CONSTRAINT "Party_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
