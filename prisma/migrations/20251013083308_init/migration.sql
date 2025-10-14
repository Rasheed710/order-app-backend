-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "public"."Party"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
