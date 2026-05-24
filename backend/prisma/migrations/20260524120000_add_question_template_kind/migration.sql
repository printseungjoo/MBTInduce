-- CreateEnum
CREATE TYPE "QuestionTemplateKind" AS ENUM ('MAIN_CHAT', 'SIMULATION');

-- AlterTable
ALTER TABLE "PromptTemplate" ADD COLUMN "kind" "QuestionTemplateKind" NOT NULL DEFAULT 'MAIN_CHAT';

-- DropIndex
DROP INDEX "PromptTemplate_isActive_createdAt_idx";

-- CreateIndex
CREATE INDEX "PromptTemplate_kind_isActive_createdAt_idx" ON "PromptTemplate"("kind", "isActive", "createdAt");
