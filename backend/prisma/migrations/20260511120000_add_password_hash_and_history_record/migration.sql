-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN "passwordHash" TEXT;

-- CreateTable
CREATE TABLE "public"."HistoryRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "title" TEXT NOT NULL,
    "preview" TEXT,
    "content" TEXT NOT NULL,
    "mbti" TEXT,
    "sourceType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HistoryRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HistoryRecord_userId_idx" ON "public"."HistoryRecord"("userId");

-- CreateIndex
CREATE INDEX "HistoryRecord_createdAt_idx" ON "public"."HistoryRecord"("createdAt");

-- CreateIndex
CREATE INDEX "HistoryRecord_mbti_idx" ON "public"."HistoryRecord"("mbti");

-- AddForeignKey
ALTER TABLE "public"."HistoryRecord" ADD CONSTRAINT "HistoryRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
