-- AlterTable
ALTER TABLE "public"."HistoryRecord" ADD COLUMN "chatSessionId" TEXT;

-- CreateIndex
CREATE INDEX "HistoryRecord_chatSessionId_idx" ON "public"."HistoryRecord"("chatSessionId");

-- AddForeignKey
ALTER TABLE "public"."HistoryRecord" ADD CONSTRAINT "HistoryRecord_chatSessionId_fkey" FOREIGN KEY ("chatSessionId") REFERENCES "public"."ChatSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;
