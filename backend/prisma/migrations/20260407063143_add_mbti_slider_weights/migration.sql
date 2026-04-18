-- AlterTable
ALTER TABLE "public"."MbtiPreference" ADD COLUMN     "decisionWeight" INTEGER NOT NULL DEFAULT 50,
ADD COLUMN     "energyWeight" INTEGER NOT NULL DEFAULT 50,
ADD COLUMN     "informationWeight" INTEGER NOT NULL DEFAULT 50,
ADD COLUMN     "lifestyleWeight" INTEGER NOT NULL DEFAULT 50;
