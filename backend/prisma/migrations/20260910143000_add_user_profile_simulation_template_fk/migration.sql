-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN "simulationTemplateId" TEXT;

-- Backfill pairs that were previously joined by createdAt desc index
WITH ranked_templates AS (
  SELECT id, "userId", ROW_NUMBER() OVER (PARTITION BY "userId" ORDER BY "createdAt" DESC) AS rn
  FROM "SimulationTemplate"
),
ranked_profiles AS (
  SELECT id, "userId", ROW_NUMBER() OVER (PARTITION BY "userId" ORDER BY "createdAt" DESC) AS rn
  FROM "UserProfile"
)
UPDATE "UserProfile" AS up
SET "simulationTemplateId" = rt.id
FROM ranked_profiles AS rp
INNER JOIN ranked_templates AS rt
  ON rt."userId" = rp."userId" AND rt.rn = rp.rn
WHERE up.id = rp.id;

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_simulationTemplateId_key" ON "UserProfile"("simulationTemplateId");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_simulationTemplateId_fkey" FOREIGN KEY ("simulationTemplateId") REFERENCES "SimulationTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
