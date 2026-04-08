-- CreateEnum
CREATE TYPE "public"."SimulationRole" AS ENUM ('user', 'ai');

-- CreateTable
CREATE TABLE "public"."SimulationTemplate" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SimulationTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "meOrNot" BOOLEAN NOT NULL DEFAULT false,
    "mbti" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SimulationChatMessage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "public"."SimulationRole" NOT NULL,
    "content" TEXT NOT NULL,
    "eValue" INTEGER NOT NULL DEFAULT 50,
    "sValue" INTEGER NOT NULL DEFAULT 50,
    "fValue" INTEGER NOT NULL DEFAULT 50,
    "pValue" INTEGER NOT NULL DEFAULT 50,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rate" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SimulationChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SimulationTemplate_userId_createdAt_idx" ON "public"."SimulationTemplate"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "UserProfile_userId_createdAt_idx" ON "public"."UserProfile"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "SimulationChatMessage_userId_createdAt_idx" ON "public"."SimulationChatMessage"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "public"."SimulationTemplate" ADD CONSTRAINT "SimulationTemplate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SimulationChatMessage" ADD CONSTRAINT "SimulationChatMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
